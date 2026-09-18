import React from 'react';
import { ArrowUp, Mail, Phone, Heart } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer = () => {
  const { data, lang, t } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#e8dfd5] bg-[#f5ece1] text-stone-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Info & Logo */}
          <div className="flex items-center gap-4 text-center md:text-left rtl:md:text-right">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-sm border border-[#dfd2c0] shrink-0 overflow-hidden">
              <img
                src={data.profile.logoUrl || data.profile.avatarUrl || "/logo.png"}
                alt="KMA Wedding"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => { e.target.src = "/logo.png"; }}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start rtl:md:justify-start gap-2">
                <span className="text-lg font-bold text-stone-900 tracking-tight judicial-heading">
                  KMA Wedding & Media Production
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start rtl:md:justify-start gap-1.5 text-xs text-amber-900 font-medium">
                <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                <span>
                  {lang === 'ar'
                    ? 'شركة متخصصة في الإنتاج المرئي وتوثيق أرقى حفلات الزفاف والمناسبات'
                    : 'Premier Cinematography & Luxury Wedding Media Production'}
                </span>
              </div>
              <p className="text-xs text-stone-500 flex items-center justify-center md:justify-start gap-2">
                <span>© {new Date().getFullYear()} KMA Wedding. All rights reserved.</span>
                <span>•</span>
                <a
                  href="#admin"
                  className="text-stone-400 hover:text-amber-800 transition-colors underline"
                >
                  Admin Portal
                </a>
              </p>
            </div>
          </div>

          {/* Socials & Contacts */}
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${data.profile.email}`}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-[#efe5d7] text-stone-700 hover:text-amber-900 border border-[#ded0bf] transition-colors shadow-sm"
              title="Email KMA"
            >
              <Mail className="w-4 h-4" />
            </a>

            {data.profile.phone && (
              <a
                href={`tel:${data.profile.phone.replace(/[^+\d]/g, '')}`}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-[#efe5d7] text-stone-700 hover:text-amber-900 border border-[#ded0bf] transition-colors shadow-sm"
                title="Call KMA"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white hover:bg-[#efe5d7] text-stone-600 hover:text-stone-900 border border-[#ded0bf] transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              title={lang === 'ar' ? 'العودة للأعلى' : 'Back to Top'}
            >
              <span>{lang === 'ar' ? 'للأعلى' : 'Top'}</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
