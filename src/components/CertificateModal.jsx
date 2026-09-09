import React, { useState } from 'react';
import { X, ExternalLink, Award, Calendar, CheckCircle, Copy, Check, Edit3, Scale } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const CertificateModal = () => {
  const { activeModalCert, setActiveModalCert, navigateTo, setEditingCertId } = usePortfolio();
  const [copied, setCopied] = useState(false);

  if (!activeModalCert) return null;

  const handleCopyId = () => {
    if (activeModalCert.credentialId) {
      navigator.clipboard.writeText(activeModalCert.credentialId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEditShortcut = () => {
    setEditingCertId(activeModalCert.id);
    setActiveModalCert(null);
    navigateTo('admin');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={() => setActiveModalCert(null)}
    >
      <div
        className="relative w-full max-w-3xl my-8 bg-white border border-[#ded0bf] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8dfd2] bg-[#fbf8f3]">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-900 border border-amber-300/80">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Verified Judicial Accreditation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditShortcut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-white hover:bg-[#f6eee4] border border-[#d8cabb] rounded-lg transition-colors shadow-sm"
              title="Edit in Admin Panel"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-800" />
              <span>Edit Credential</span>
            </button>
            <button
              onClick={() => setActiveModalCert(null)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-[#efe5d7] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Image Preview */}
        <div className="relative w-full max-h-96 bg-[#f7f2ea] overflow-hidden flex items-center justify-center border-b border-[#e8dfd2]">
          <img
            src={activeModalCert.imageUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"}
            alt={activeModalCert.title}
            className="w-full object-contain max-h-96 bg-[#f7f2ea]"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800";
            }}
          />
        </div>

        {/* Certificate Details */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight mb-2 judicial-heading">
              {activeModalCert.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600">
              <span className="font-semibold text-amber-900 bg-amber-100 px-3 py-1 rounded-md border border-amber-300">
                {activeModalCert.issuer}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-stone-400" />
                Conferred: {activeModalCert.issueDate}
              </span>
              {activeModalCert.expiryDate && (
                <span className="text-stone-500 font-medium">
                  • Status: {activeModalCert.expiryDate}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {activeModalCert.description && (
            <p className="text-stone-700 text-sm md:text-base leading-relaxed bg-[#fdfaf5] p-4 rounded-xl border border-[#efe6d8]">
              {activeModalCert.description}
            </p>
          )}

          {/* Credential ID */}
          {activeModalCert.credentialId && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f3eb] border border-[#e8dfd2]">
              <div className="text-xs">
                <span className="text-stone-500 block uppercase font-semibold text-[10px]">Official Registry / Roll ID</span>
                <span className="font-mono text-stone-900 font-bold text-sm">
                  {activeModalCert.credentialId}
                </span>
              </div>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-white hover:bg-[#f6eee4] rounded-lg transition-colors border border-[#d8cabb] shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-800" />
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

          {/* Skills / Jurisprudential Competencies */}
          {activeModalCert.skills && activeModalCert.skills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Jurisprudential Domains & Accreditations
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeModalCert.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-[#f4ede3] text-stone-800 border border-[#e4d8c7]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e8dfd2]">
            <button
              onClick={() => setActiveModalCert(null)}
              className="px-5 py-2.5 text-sm font-semibold text-stone-700 hover:text-stone-950 bg-[#f4ece1] hover:bg-[#ebdccb] rounded-xl transition-all"
            >
              Close
            </button>

            {activeModalCert.credentialUrl && (
              <a
                href={activeModalCert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl transition-all shadow-md shadow-amber-950/20"
              >
                <span>Verify Credential on Official Registry</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
