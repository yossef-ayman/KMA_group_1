import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Calendar, Copy, Check, Award, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const CertificateModal = () => {
  const { activeModalCert, setActiveModalCert, t } = usePortfolio();
  const [copied, setCopied] = useState(false);

  // Escape-to-close & body scroll lock
  useEffect(() => {
    if (!activeModalCert) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModalCert(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeModalCert, setActiveModalCert]);

  if (!activeModalCert) return null;

  const cert = activeModalCert;

  const handleCopyId = () => {
    if (cert.credentialId) {
      navigator.clipboard.writeText(cert.credentialId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={() => setActiveModalCert(null)}
    >
      <div
        className="relative w-full max-w-3xl my-8 bg-[#fdfbf7] border border-[#ded0bf] rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8dfd2] bg-[#f8f3ea]">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-100 text-amber-900 border border-amber-300/80 shadow-sm">
              <Award className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Official Media Accreditation & License</span>
            </span>
          </div>
          <button
            onClick={() => setActiveModalCert(null)}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-[#efe5d7] rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Image Preview */}
        <div className="relative w-full max-h-96 bg-[#f5ede1] overflow-hidden flex items-center justify-center border-b border-[#e8dfd2]">
          <img
            src={cert.imageUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"}
            alt={t(cert.title)}
            className="w-full object-cover max-h-96"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800";
            }}
          />
        </div>

        {/* Certificate Details */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight mb-3 judicial-heading leading-snug">
              {t(cert.title)}
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-stone-700">
              <span className="font-bold text-amber-950 bg-amber-100/90 px-3 py-1 rounded-lg border border-amber-300 shadow-sm">
                {t(cert.issuer)}
              </span>
              <span className="flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg bg-white border border-[#e5dacb]">
                <Calendar className="w-3.5 h-3.5 text-amber-800" />
                <span>Issued: {t(cert.issueDate)}</span>
              </span>
              {cert.expiryDate && (
                <span className="text-stone-600 font-medium px-2.5 py-1 rounded-lg bg-white border border-[#e5dacb]">
                  <span>Status: {t(cert.expiryDate)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {cert.description && (
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed bg-[#fbf7f0] p-5 rounded-2xl border border-[#efe6d8]">
              {t(cert.description)}
            </p>
          )}

          {/* Credential ID */}
          {cert.credentialId && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f6eee2] border border-[#e8dfd2]">
              <div className="text-xs">
                <span className="text-stone-500 block uppercase font-bold text-[10px]">
                  Official License / Permit ID
                </span>
                <span className="font-mono text-stone-900 font-bold text-sm sm:text-base">
                  {cert.credentialId}
                </span>
              </div>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 hover:text-stone-950 bg-white hover:bg-[#f6eee4] rounded-xl transition-colors border border-[#d8cabb] shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Skills / Production Competencies */}
          {cert.skills && cert.skills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
                Accredited Domains & Standards
              </h4>
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-white text-stone-800 border border-[#e4d8c7] shadow-sm"
                  >
                    {t(skill)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e8dfd2]">
            <button
              onClick={() => setActiveModalCert(null)}
              className="px-5 py-2.5 text-xs font-bold text-stone-700 hover:text-stone-950 bg-[#f4ece1] hover:bg-[#ebdccb] rounded-xl transition-all"
            >
              Close
            </button>

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-800 to-yellow-900 hover:from-amber-700 hover:to-yellow-800 rounded-xl transition-all shadow-md shadow-amber-950/20"
              >
                <span>Verify Credential</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
