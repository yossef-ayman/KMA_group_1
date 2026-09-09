import React from 'react';
import { ArrowUp, Mail, ShieldCheck, Scale } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer = () => {
  const { data, navigateTo } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#e8dfd5] bg-[#f5ece1] text-stone-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Info */}
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Scale className="w-4 h-4 text-amber-800" />
              <span className="text-base font-bold text-stone-900 tracking-tight judicial-heading">
                {data.profile.fullName}
              </span>
              <span className="text-xs text-amber-800 font-semibold flex items-center gap-1 font-mono">
                • Chambers & Judicial Bench
              </span>
            </div>
            <p className="text-xs text-stone-500">
              © {new Date().getFullYear()} Hon. Mariam Awad. Official Judicial Portfolio & Legal Archive.
            </p>
          </div>

          {/* Socials & Profiles */}
          <div className="flex items-center gap-3">
            {data.profile.socials.linkedin && (
              <a
                href={data.profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-[#efe5d7] text-stone-700 hover:text-amber-900 border border-[#ded0bf] transition-colors shadow-sm"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {data.profile.socials.twitter && (
              <a
                href={data.profile.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-[#efe5d7] text-stone-700 hover:text-amber-900 border border-[#ded0bf] transition-colors shadow-sm"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            )}
            <a
              href={`mailto:${data.profile.email}`}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-[#efe5d7] text-stone-700 hover:text-amber-900 border border-[#ded0bf] transition-colors shadow-sm"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Back to top & Admin Link */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('admin')}
              className="text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors underline-offset-4 hover:underline"
            >
              Chambers Management & Credentials
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white hover:bg-[#efe5d7] text-stone-600 hover:text-stone-900 border border-[#ded0bf] transition-colors flex items-center gap-1 text-xs shadow-sm"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
