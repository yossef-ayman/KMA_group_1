import React, { useState, useEffect } from 'react';
import { Menu, X, Award, Settings, Eye, Send, ArrowRight, Scale } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Navbar = () => {
  const { data, currentView, navigateTo } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Judicial Accreditations', href: '#certificates' },
    { label: 'Landmark Rulings', href: '#projects' },
    { label: 'Legal Jurisprudence', href: '#skills' },
    { label: 'Chambers Contact', href: '#contact' },
  ];

  useEffect(() => {
    if (currentView !== 'portfolio') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const link of [...navLinks].reverse()) {
        const section = document.querySelector(link.href);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(link.href.replace('#', ''));
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const scrollToSection = (href) => {
    setMobileMenuOpen(false);

    if (currentView !== 'portfolio') {
      navigateTo('portfolio');
      setTimeout(() => {
        performScroll(href);
      }, 150);
    } else {
      performScroll(href);
    }
  };

  const performScroll = (href) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      const navHeight = 84;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e8dfd5] bg-[#faf7f2]/90 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo & Name */}
          <div
            onClick={() => {
              if (currentView !== 'portfolio') {
                navigateTo('portfolio');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-[#cbb497] group-hover:ring-[#8c6b3e] transition-all shadow-sm">
                <img
                  src={data.profile.avatarUrl}
                  alt={data.profile.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600";
                  }}
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-600 border-2 border-[#faf7f2] rounded-full" title="Active on Judicial Bench"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors judicial-heading">
                  {data.profile.fullName}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-900 rounded-full border border-amber-300/80">
                  Judicial Bench
                </span>
              </div>
              <p className="text-xs text-stone-500 truncate max-w-[170px] sm:max-w-[250px] font-medium">
                {data.profile.title}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {currentView === 'portfolio' ? (
            <nav className="hidden lg:flex items-center gap-1 bg-[#f4ece1]/80 px-3 py-1.5 rounded-2xl border border-[#e5dacb] shadow-inner">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-amber-800 text-white shadow-md shadow-amber-900/20 font-bold'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-[#e9ded0]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#f4ece1] border border-[#e5dacb] text-xs text-stone-600 font-medium">
              <Scale className="w-4 h-4 text-amber-800" />
              <span>Chambers & Credentials Management Mode</span>
            </div>
          )}

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {currentView === 'portfolio' ? (
              <>
                <button
                  onClick={() => scrollToSection('#contact')}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-white hover:bg-[#f6eee4] border border-[#e2d7c8] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-amber-700" />
                  <span>Contact Chambers</span>
                </button>

                <button
                  onClick={() => navigateTo('admin')}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-800 to-yellow-900 hover:from-amber-700 hover:to-yellow-800 rounded-xl transition-all shadow-md shadow-amber-900/15 transform hover:-translate-y-0.5"
                >
                  <Settings className="w-4 h-4" />
                  <span>Manage / Edit</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigateTo('portfolio')}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-800 to-yellow-900 hover:from-amber-700 hover:to-yellow-800 rounded-xl transition-all shadow-md shadow-amber-900/15"
              >
                <Eye className="w-4 h-4" />
                <span>View Public Portfolio</span>
              </button>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentView === 'portfolio' ? (
              <button
                onClick={() => navigateTo('admin')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold shadow-sm"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('portfolio')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-950 bg-white border border-[#e2d7c8] rounded-xl shadow-sm"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e8dfd5] bg-[#faf7f2]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in">
          {currentView === 'portfolio' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl text-left transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-amber-800 text-white font-bold'
                        : 'bg-white text-stone-700 hover:bg-[#f6eee4] hover:text-stone-950 border border-[#e2d7c8]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t border-[#e8dfd5] flex flex-col gap-2">
            {currentView === 'portfolio' ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('admin');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-gradient-to-r from-amber-800 to-yellow-900 rounded-xl shadow-md"
              >
                <Settings className="w-4 h-4" />
                <span>Open Judicial Management Portal</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('portfolio');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-amber-800 rounded-xl"
              >
                <Eye className="w-4 h-4" />
                <span>Return to Public Showcase</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
