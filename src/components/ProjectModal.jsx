import React, { useState, useEffect } from 'react';
import {
  X,
  Film,
  Calendar,
  Camera,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Tag,
  Video,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { normalizeProject } from '../utils/projectModel';

export const ProjectModal = () => {
  const { activeModalProject, setActiveModalProject, t } = usePortfolio();

  // Escape key and body lock
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

  // Safe normalized project
  const proj = activeModalProject ? normalizeProject(activeModalProject) : null;
  const mediaList = proj?.media || [];

  // Active media item index
  const [selectedMediaIdx, setSelectedMediaIdx] = useState(0);

  // Synchronize initial media index on project open (prefer cover or 0)
  useEffect(() => {
    if (proj && Array.isArray(proj.media) && proj.media.length > 0) {
      if (proj.coverMediaId) {
        const coverIdx = proj.media.findIndex((m) => m.id === proj.coverMediaId);
        setSelectedMediaIdx(coverIdx >= 0 ? coverIdx : 0);
      } else {
        setSelectedMediaIdx(0);
      }
    } else {
      setSelectedMediaIdx(0);
    }
  }, [proj?.id]);

  if (!proj) return null;

  // Determine video embed (Google Drive, YouTube, Vimeo, Dropbox, or direct MP4/stream)
  const getVideoEmbed = (url) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;

    // 1. Google Drive Video
    const driveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return {
        type: 'iframe',
        src: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
      };
    }

    // 2. YouTube
    const ytMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
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
      const dbUrl = trimmed
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        .replace(/[?&]dl=[01]/, '');
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

  const currentMedia = mediaList[selectedMediaIdx] || (mediaList.length > 0 ? mediaList[0] : null);
  const isCurrentVideo = currentMedia?.type === 'video';
  const currentVideoEmbed = isCurrentVideo ? getVideoEmbed(currentMedia.url) : null;
  const currentImageUrl =
    currentMedia?.type === 'image'
      ? currentMedia.url
      : proj.imageUrl ||
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';

  const handlePrevMedia = (e) => {
    e.stopPropagation();
    if (mediaList.length > 1) {
      setSelectedMediaIdx((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
    }
  };

  const handleNextMedia = (e) => {
    e.stopPropagation();
    if (mediaList.length > 1) {
      setSelectedMediaIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={() => setActiveModalProject(null)} />

      <div className="relative w-full max-w-4xl bg-[#fdfbf7] rounded-3xl border border-[#ded0bf] shadow-2xl overflow-hidden z-10 my-8">
        {/* Modal Main Viewport (Video Player or High-Res Image) */}
        <div className="relative h-72 sm:h-[420px] w-full overflow-hidden bg-stone-950 flex items-center justify-center group">
          {isCurrentVideo && currentVideoEmbed ? (
            currentVideoEmbed.type === 'iframe' ? (
              <iframe
                key={currentMedia.id || currentMedia.url}
                src={currentVideoEmbed.src}
                title={t(proj.title)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                key={currentMedia.id || currentMedia.url}
                src={currentVideoEmbed.src}
                poster={currentMedia.thumbnailUrl || proj.imageUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover z-0"
              />
            )
          ) : (
            <>
              <img
                key={currentMedia?.id || currentImageUrl}
                src={currentImageUrl}
                alt={t(proj.title)}
                className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-900/20" />
            </>
          )}

          {/* Previous / Next Arrow Controls for multiple media */}
          {mediaList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevMedia}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all border border-white/20 z-20 shadow-lg group-hover:scale-105"
                title="Previous media"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMedia}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all border border-white/20 z-20 shadow-lg group-hover:scale-105"
                title="Next media"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
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

          {/* Media Count Badge on Viewport */}
          {mediaList.length > 1 && (
            <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-300 text-xs font-mono font-bold border border-amber-400/30 shadow-lg">
                {selectedMediaIdx + 1} / {mediaList.length}
              </span>
            </div>
          )}

          {/* Title on Header ONLY if no video to avoid obscuring controls */}
          {!isCurrentVideo && (
            <div className="absolute bottom-5 left-6 right-20 text-white pointer-events-none">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-medium mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{proj.year || proj.date}</span>
                {(proj.location || proj.tribunal) && (
                  <>
                    <span>•</span>
                    <span className="truncate">{proj.location || proj.tribunal}</span>
                  </>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white judicial-heading leading-snug">
                {t(proj.title)}
              </h3>
            </div>
          )}
        </div>

        {/* Multi-Media Thumbnail Gallery Strip (When project has multiple items) */}
        {mediaList.length > 1 && (
          <div className="bg-[#f0e6d6] px-4 py-3 border-y border-[#dfd2c0] flex items-center gap-2.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950 shrink-0 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span>Media ({mediaList.length}):</span>
            </span>
            <div className="flex items-center gap-2">
              {mediaList.map((m, idx) => {
                const isSelected = idx === selectedMediaIdx;
                const isVid = m.type === 'video';
                return (
                  <button
                    key={m.id || idx}
                    type="button"
                    onClick={() => setSelectedMediaIdx(idx)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 transition-all border-2 ${
                      isSelected
                        ? 'border-amber-800 ring-2 ring-amber-600/40 scale-105 shadow-md'
                        : 'border-[#ded0bf] opacity-75 hover:opacity-100 hover:border-amber-600'
                    }`}
                  >
                    <img
                      src={m.thumbnailUrl || m.url || proj.imageUrl}
                      alt={m.title || `Media ${idx + 1}`}
                      className="w-full h-full object-cover bg-stone-900"
                      onError={(e) => {
                        e.target.src = proj.imageUrl || '/logo.png';
                      }}
                    />
                    {isVid && (
                      <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      </div>
                    )}
                    {m.id === proj.coverMediaId && (
                      <div className="absolute top-0.5 left-0.5 bg-amber-800 text-[8px] font-bold text-white px-1 rounded-sm leading-none py-0.5">
                        Cover
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-18rem)] overflow-y-auto">
          {/* If video is embedded, display title and metadata cleanly at the top of the body */}
          {isCurrentVideo && (
            <div className="pb-4 border-b border-[#e8dfd5]">
              <div className="flex items-center gap-2 text-amber-900 text-xs font-mono font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{proj.year || proj.date}</span>
                {(proj.location || proj.tribunal) && (
                  <>
                    <span>•</span>
                    <span className="truncate">{proj.location || proj.tribunal}</span>
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
                {proj.value || 'VIP Production'}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-stone-500 mb-0.5">
                Location & Venue
              </div>
              <div className="text-xs font-bold text-stone-800 truncate">
                {proj.location || proj.tribunal || 'Cairo Luxury Venue'}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-stone-500 mb-0.5">
                Project Category
              </div>
              <div className="text-xs font-bold text-stone-800 truncate">
                {t(proj.categoryLabel) || proj.category}
              </div>
            </div>
          </div>

          {/* Scope / Summary */}
          {proj.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-800" />
                <span>Production Scope & Highlights</span>
              </h4>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {t(proj.description)}
              </p>
            </div>
          )}

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
            {proj.liveUrl && (
              <a
                href={proj.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-amber-900 hover:text-amber-700 bg-white border border-[#ded0bf] hover:bg-amber-50 shadow-sm transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Watch External Film</span>
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
