import React, { useEffect } from 'react';
import { X, Film, Calendar, Camera, CheckCircle, ExternalLink, Sparkles, Tag, Video } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ProjectModal = () => {
  const { activeModalProject, setActiveModalProject, t } = usePortfolio();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalProject(null);
      }
    };
    if (activeModalProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalProject, setActiveModalProject]);

  if (!activeModalProject) return null;

  const proj = activeModalProject;

  // Determine video embed (Google Drive, YouTube, Vimeo, Dropbox, or direct MP4/stream)
  const getVideoEmbed = (url) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;

    // 1. Google Drive Video (100% Free, zero server storage, plays directly in modal)
    const driveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return {
        type: 'iframe',
        src: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
      };
    }

    // 2. YouTube
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return {
        type: 'iframe',
        src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
      };
    }

    // 3. Vimeo
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch) {
      return {
        type: 'iframe',
        src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
      };
    }

    // 4. Dropbox Direct Stream
    if (trimmed.includes('dropbox.com')) {
      const dbUrl = trimmed.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace(/[?&]dl=[01]/, '');
      return {
        type: 'video',
        src: dbUrl
      };
    }

    // 5. Direct MP4 / WebM / Stream
    return {
      type: 'video',
      src: trimmed
    };
  };

  const videoEmbed = getVideoEmbed(proj.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setActiveModalProject(null)}
      />

      <div className="relative w-full max-w-3xl bg-[#fdfbf7] rounded-3xl border border-[#ded0bf] shadow-2xl overflow-hidden z-10 my-8">
        {/* Modal Header with Video or Image */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-stone-950 flex items-center justify-center">
          {videoEmbed ? (
            videoEmbed.type === 'iframe' ? (
              <iframe
                src={videoEmbed.src}
                title={t(proj.title)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoEmbed.src}
                poster={proj.imageUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover z-0"
              />
            )
          ) : (
            <>
              <img
                src={proj.imageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200"}
                alt={t(proj.title)}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-900/30" />
            </>
          )}

          {/* Close button */}
          <button
            onClick={() => setActiveModalProject(null)}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors border border-white/20 z-20 shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category & Status Pill */}
          <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2 z-20 pointer-events-none">
            <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-amber-900/90 text-amber-100 border border-amber-500/50 shadow-md flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>{t(proj.categoryLabel)}</span>
            </span>
            {proj.value && (
              <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-stone-900/90 text-amber-300 border border-amber-500/40 shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{proj.value}</span>
              </span>
            )}
          </div>

          {/* Title on Header ONLY if no video to avoid obscuring controls */}
          {!videoEmbed && (
            <div className="absolute bottom-5 left-6 right-6 text-white pointer-events-none">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-medium mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{proj.year}</span>
                {proj.tribunal && (
                  <>
                    <span>•</span>
                    <span className="truncate">{proj.tribunal}</span>
                  </>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white judicial-heading leading-snug">
                {t(proj.title)}
              </h3>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-16rem)] overflow-y-auto">
          {/* If video is embedded, display title and metadata cleanly at the top of the body */}
          {videoEmbed && (
            <div className="pb-4 border-b border-[#e8dfd5]">
              <div className="flex items-center gap-2 text-amber-900 text-xs font-mono font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{proj.year}</span>
                {proj.tribunal && (
                  <>
                    <span>•</span>
                    <span className="truncate">{proj.tribunal}</span>
                  </>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 judicial-heading">
                {t(proj.title)}
              </h3>
            </div>
          )}

            {/* Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#f5ede1] border border-[#e5dacb]">
            <div>
              <div className="text-[11px] uppercase font-bold text-stone-500 mb-0.5">
                Coverage Package
              </div>
              <div className="text-xs sm:text-sm font-bold text-amber-950">
                {proj.value || 'VIP Custom'}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-stone-500 mb-0.5">
                Crew & Equipment
              </div>
              <div className="text-xs font-bold text-stone-800 truncate">
                {proj.tribunal || 'KMA Pro Crew'}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-stone-500 mb-0.5">
                Event Type
              </div>
              <div className="text-xs font-bold text-stone-800 truncate">
                {t(proj.clientType)}
              </div>
            </div>
          </div>

          {/* Scope / Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-amber-800" />
              <span>Production Scope & Highlights</span>
            </h4>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {t(proj.description)}
            </p>
          </div>

          {/* Outcome & Deliverables */}
          {proj.outcome && (
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-700" />
                <span>Final Deliverables & Quality</span>
              </h4>
              <p className="text-stone-800 text-sm font-medium leading-relaxed">
                {t(proj.outcome)}
              </p>
            </div>
          )}

          {/* Equipment & Tags */}
          {proj.techStack && proj.techStack.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Gear & Production Technologies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {proj.techStack.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-[#ded0bf] text-stone-800 shadow-sm"
                  >
                    {t(item)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#f7f0e5] border-t border-[#e8dfd5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Official KMA Production Portfolio</span>
          </div>

          <div className="flex items-center gap-3">
            {(!videoEmbed && proj.liveUrl) && (
              <a
                href={proj.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-amber-900 hover:text-amber-700 bg-white border border-[#ded0bf] hover:bg-amber-50 shadow-sm transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Watch Preview</span>
              </a>
            )}
            <button
              onClick={() => setActiveModalProject(null)}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-800 to-yellow-900 hover:from-amber-700 hover:to-yellow-800 shadow-md transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
