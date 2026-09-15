import React, { useState, useEffect } from 'react';
import {
  Award,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Search,
  RefreshCw,
  CheckCircle,
  Calendar,
  Layers,
  Send,
  Camera,
  Film,
  Video,
  Sparkles,
  Heart,
  Clock,
  ShieldCheck,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../context/PortfolioContext';

export const PortfolioPage = () => {
  const {
    data,
    lang,
    t,
    setActiveModalCert,
    setActiveModalProject,
    refreshCertificates,
    addBooking,
    showToast
  } = usePortfolio();

  // Projects filter and search state
  const [projectFilter, setProjectFilter] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');

  // Certificates filter and search state
  const [certSearch, setCertSearch] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Contact / Event Booking form state
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'wedding',
    eventDate: '',
    location: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  // Category filters for media & wedding works
  const projectCategories = [
    { id: 'all', label: lang === 'ar' ? 'كافة الأعمال والإنتاجات' : 'All Works' },
    { id: 'weddings', label: lang === 'ar' ? 'أعراس سينمائية' : 'Cinematic Weddings' },
    { id: 'destination', label: lang === 'ar' ? 'أعراس شاطئية وسفر' : 'Destination Weddings' },
    { id: 'events', label: lang === 'ar' ? 'فعاليات ومؤتمرات' : 'Corporate Events' },
    { id: 'photography', label: lang === 'ar' ? 'فوتوغرافيا فنية' : 'Bridal Photography' },
    { id: 'commercial', label: lang === 'ar' ? 'إعلانات وميديا' : 'Commercial Media' }
  ];

  // Filter projects
  const filteredProjects = (data.projects || []).filter((proj) => {
    const matchesCategory = projectFilter === 'all' || proj.category === projectFilter;
    const titleText = (t(proj.title) || '').toLowerCase();
    const descText = (t(proj.description) || '').toLowerCase();
    const clientText = (t(proj.clientType) || '').toLowerCase();
    const q = projectSearch.toLowerCase();

    const matchesSearch = !q || titleText.includes(q) || descText.includes(q) || clientText.includes(q);
    return matchesCategory && matchesSearch;
  });

  // Unique issuers list for certificate filtering
  const issuers = [
    { id: 'all', label: lang === 'ar' ? 'كافة الاعتمادات' : 'All Accreditations' },
    ...Array.from(new Set((data.certificates || []).map((c) => t(c.issuer)))).map((name) => ({
      id: name,
      label: name
    }))
  ];

  // Filter certificates
  const filteredCertificates = (data.certificates || []).filter((cert) => {
    const titleText = (t(cert.title) || '').toLowerCase();
    const issuerText = (t(cert.issuer) || '').toLowerCase();
    const idText = (cert.credentialId || '').toLowerCase();
    const q = certSearch.toLowerCase();

    const matchesSearch = !q || titleText.includes(q) || issuerText.includes(q) || idText.includes(q);
    const matchesIssuer = selectedIssuer === 'all' || t(cert.issuer) === selectedIssuer;

    return matchesSearch && matchesIssuer;
  });

  const handleRefreshCertificates = () => {
    setIsRefreshing(true);
    refreshCertificates();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      showToast(
        lang === 'ar'
          ? 'يرجى إدخال الاسم ورقم الهاتف وتفاصيل المناسبة.'
          : 'Please enter your name, phone number, and event details.',
        'error'
      );
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      // Save booking in state/localStorage (client-side only, zero backend)
      addBooking({
        name: contactForm.name.trim(),
        phone: contactForm.phone.trim(),
        email: contactForm.email.trim(),
        eventType: contactForm.eventType,
        eventDate: contactForm.eventDate,
        location: contactForm.location.trim(),
        message: contactForm.message.trim()
      });

      setIsSending(false);
      showToast(
        lang === 'ar'
          ? `ألف مبروك يا ${contactForm.name}! تم استلام طلب الحجز وظهر في لوحة الإدارة.`
          : `Thank you, ${contactForm.name}! Your booking request has been submitted and recorded in the Admin Panel.`
      );
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.65 },
        colors: ['#b45309', '#78350f', '#d97706', '#f5ebd8', '#fbbf24', '#f43f5e']
      });
      setContactForm({
        name: '',
        phone: '',
        email: '',
        eventType: 'wedding',
        eventDate: '',
        location: '',
        message: ''
      });
    }, 850);
  };

  // Scroll reveal observer
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.remove('reveal'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          observer.unobserve(el);
          el.classList.add('is-visible');
          const cleanup = () => {
            el.classList.remove('reveal', 'is-visible');
            el.style.transitionDelay = '';
            el.removeEventListener('transitionend', cleanup);
          };
          el.addEventListener('transitionend', cleanup);
          setTimeout(() => {
            if (el.classList.contains('reveal')) cleanup();
          }, 1500);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [projectFilter, selectedIssuer, lang]);

  return (
    <div className="relative isolate overflow-hidden bg-[#faf7f2]">
      {/* Background ambient glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#f2e7d5]/70 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[900px] right-5 w-[600px] h-[500px] bg-[#f5ebd8]/80 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[2000px] left-5 w-[650px] h-[500px] bg-[#ece0ca]/60 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-24 border-b border-[#e8dfd5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Intro */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left rtl:lg:text-right">
              {/* Trust Badge */}
              <div className="reveal inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#f4ece1] border border-[#dfd2c0] text-amber-950 text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'KMA Wedding & Media Production • رواد التصوير السينمائي والإنتاج الإعلامي'
                    : 'KMA Wedding & Media Production • Premier Cinematography'}
                </span>
              </div>

              {/* Title & Headline */}
              <div className="reveal space-y-3" style={{ transitionDelay: '80ms' }}>
                <div className="flex items-baseline justify-center lg:justify-start rtl:lg:justify-start gap-3">
                  <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 judicial-heading">
                    <span className="gradient-gold">KMA</span>
                  </h1>
                  <span className="text-xl sm:text-2xl uppercase tracking-widest text-stone-500 font-light">
                    wedding
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-stone-800 leading-snug">
                  {t(data.profile.title)}
                </h2>
                <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
                  {t(data.profile.tagline)}
                </p>
              </div>

              {/* Action Buttons */}
              <div
                className="reveal flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-start gap-3.5 pt-2"
                style={{ transitionDelay: '160ms' }}
              >
                <button
                  onClick={() => {
                    const target = document.querySelector('#contact');
                    if (target) {
                      const navHeight = 84;
                      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-800 to-yellow-900 hover:from-amber-700 hover:to-yellow-800 shadow-lg shadow-amber-950/20 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'احجز موعد حفل زفافك الآن' : 'Book Your Event Now'}</span>
                </button>

                <button
                  onClick={() => {
                    const target = document.querySelector('#projects');
                    if (target) {
                      const navHeight = 84;
                      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-stone-800 bg-white hover:bg-[#f6eee4] border border-[#ded0bf] shadow-sm transition-all"
                >
                  <Film className="w-4 h-4 text-amber-800" />
                  <span>{lang === 'ar' ? 'معرض الأعمال السينمائية' : 'Explore Portfolio'}</span>
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div
                className="reveal grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 border-t border-[#e8dfd5]"
                style={{ transitionDelay: '240ms' }}
              >
                {data.profile.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/95 border border-[#e8dfd5] text-center shadow-sm hover:border-amber-400 transition-colors"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif gradient-gold">
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold text-stone-800 mt-1">
                      {t(stat.label)}
                    </div>
                    {stat.desc && (
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {t(stat.desc)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: KMA Logo Brand Showpiece */}
            <div className="reveal lg:col-span-5 flex justify-center" style={{ transitionDelay: '200ms' }}>
              <div className="relative group w-full max-w-md">
                <div className="absolute -inset-3 bg-gradient-to-r from-amber-700/20 via-yellow-600/15 to-amber-900/20 rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition duration-500" />
                <div className="relative rounded-3xl overflow-hidden border border-[#dfd2c0] bg-white shadow-2xl p-6 text-center space-y-6">
                  {/* Central KMA Logo */}
                  <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full bg-white p-3 shadow-xl ring-4 ring-[#dfd2c0]/60 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    <img
                      src="/logo.png"
                      alt="KMA Wedding Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>

                  <div className="space-y-2 border-t border-[#f0e6d6] pt-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'فريق تصوير سينمائي ومعدات 4K/6K' : 'Cinema Crew & 4K/6K Gear'}</span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 judicial-heading">
                      {t(data.profile.fullName)}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      <span>{t(data.profile.location)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. ABOUT KMA & VISION */}
      {/* ============================================================ */}
      <section id="about" className="py-20 border-b border-[#e8dfd5] bg-[#f5ece1]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="reveal lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900">
                <Heart className="w-4 h-4 text-amber-800 fill-amber-800" />
                <span>{lang === 'ar' ? 'عن شركة KMA للإنتاج' : 'About KMA Production'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight judicial-heading leading-snug">
                {lang === 'ar'
                  ? 'شغف سينمائي فريد يحول مناسباتكم إلى حكايات بصرية خالدة'
                  : 'A unique cinematic passion turning your moments into timeless visual stories'}
              </h3>
              <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                {t(data.profile.bio)}
              </p>

              <div className="pt-2 space-y-3 text-xs sm:text-sm text-stone-700">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#e5dacb]">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                  <span className="font-semibold">{t(data.profile.location)}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#e5dacb]">
                  <Mail className="w-4 h-4 text-amber-800 shrink-0" />
                  <span className="font-mono font-semibold">{data.profile.email}</span>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="reveal lg:col-span-7 space-y-5" style={{ transitionDelay: '120ms' }}>
              <h4 className="text-xl font-bold text-stone-900 flex items-center gap-2.5 judicial-heading">
                <Sparkles className="w-5 h-5 text-amber-800" />
                <span>{lang === 'ar' ? 'محطات التميز والريادة' : 'Our Creative Journey'}</span>
              </h4>

              <div className="space-y-4">
                {(data.milestones || []).map((ms, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#e8dfd5] hover:border-[#cbb497] transition-all shadow-sm flex items-start gap-4"
                  >
                    <div className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 font-bold font-mono text-sm shrink-0 border border-amber-300">
                      {ms.year}
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm sm:text-base font-bold text-stone-900 judicial-heading">
                        {t(ms.title)}
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {t(ms.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. PROJECTS & PORTFOLIO SHOWCASE */}
      {/* ============================================================ */}
      <section id="projects" className="py-24 border-b border-[#e8dfd5] bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900 mb-2">
                <Film className="w-4 h-4 text-amber-800" />
                <span>{lang === 'ar' ? 'معرض الأعمال السينمائية' : 'Cinematography & Media Portfolio'}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight judicial-heading">
                {lang === 'ar'
                  ? 'أحدث إنتاجات وأفلام الأعراس والفعاليات'
                  : 'Featured Wedding Films & Event Highlights'}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                {lang === 'ar'
                  ? 'تصفح مجموعة من أروع أفلام الزفاف الملكية، الجلسات الشاطئية، والتغطيات الإعلامية الكبرى المنفذة بعدسات KMA.'
                  : 'Browse our latest wedding films, destination beach sessions, and premier media coverage produced by KMA.'}
              </p>
            </div>

            <div className="text-xs font-bold text-amber-950 bg-amber-100/90 px-4 py-2 rounded-xl border border-amber-300 shrink-0">
              <span>
                {filteredProjects.length} {lang === 'ar' ? 'أعمال معروضة' : 'Projects Shown'}
              </span>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'ابحث في الأعمال بالاسم أو المكان أو نوع التصوير...'
                    : 'Search portfolio by title, location, or style...'
                }
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 rounded-xl bg-white border border-[#ded0bf] text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 shadow-sm"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {projectCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setProjectFilter(cat.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    projectFilter === cat.id
                      ? 'bg-amber-800 text-white font-bold shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-[#f6eee4] border border-[#ded0bf]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-[#ded0bf] shadow-sm">
              <Film className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-600 font-medium text-sm">
                {lang === 'ar'
                  ? 'لم يتم العثور على أعمال مطابقة لبحثك الحالي.'
                  : 'No projects found matching your search.'}
              </p>
              <button
                onClick={() => {
                  setProjectSearch('');
                  setProjectFilter('all');
                }}
                className="mt-3 text-xs text-amber-800 font-bold hover:underline"
              >
                {lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj, idx) => (
                <div
                  key={proj.id}
                  onClick={() => setActiveModalProject(proj)}
                  className="reveal beige-card rounded-3xl overflow-hidden cursor-pointer flex flex-col group relative transform transition-all duration-300 hover:-translate-y-1.5 border border-[#e8dfd5] hover:border-[#cbb497]"
                  style={{ transitionDelay: `${Math.min(idx, 8) * 70}ms` }}
                >
                  {/* Thumbnail Image Banner */}
                  <div className="relative h-56 w-full bg-[#f4ede3] overflow-hidden">
                    <img
                      src={proj.imageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"}
                      alt={t(proj.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm text-stone-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform group-hover:scale-110">
                        <Play className="w-5 h-5 fill-stone-900 ml-0.5" />
                      </div>
                    </div>

                    {/* Sector Badge */}
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                      <span className="px-3 py-1 text-xs font-bold rounded-lg bg-white/95 backdrop-blur-md text-amber-950 border border-amber-300 shadow-md">
                        {t(proj.categoryLabel)}
                      </span>
                    </div>

                    {/* Package Badge */}
                    {proj.value && (
                      <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-stone-950/85 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-md font-mono">
                          {proj.value}
                        </span>
                      </div>
                    )}

                    {/* Year pill on image bottom */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-mono drop-shadow">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{proj.year}</span>
                      </span>
                      <span className="truncate max-w-[180px]">
                        {proj.tribunal?.split('•')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <h4 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 judicial-heading leading-snug">
                        {t(proj.title)}
                      </h4>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {t(proj.description)}
                      </p>
                    </div>

                    {/* Tech & Gear pills */}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.techStack.slice(0, 3).map((item, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-[#f5ede1] text-stone-800 border border-[#e4d8c7]"
                          >
                            {t(item)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#e8dfd5] text-xs font-bold text-amber-900">
                      <span className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-amber-800" />
                        <span>{lang === 'ar' ? 'مشاهدة تفاصيل العمل' : 'View Highlights'}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. ACCREDITATIONS, LICENSES & AWARDS */}
      {/* ============================================================ */}
      <section id="certificates" className="py-24 border-b border-[#e8dfd5] bg-[#f5ece1]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900 mb-2">
                <Award className="w-4 h-4 text-amber-800" />
                <span>{lang === 'ar' ? 'الاعتمادات والتراخيص الرسمية' : 'Accreditations & Permits'}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight judicial-heading">
                {lang === 'ar'
                  ? 'التراخيص والشهادات والجوائز المعتمدة'
                  : 'Official Media Licenses & Industry Awards'}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                {lang === 'ar'
                  ? 'تراخيص معتمدة للإنتاج الإعلامي، اعتمادات تشغيل طائرات الدرون الجوية، وشهادات معتمدة من كبرى شركات تصنيع كاميرات السينما.'
                  : 'Official media production permits, aerial drone commercial flight licensing, and industry awards.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefreshCertificates}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-[#f6eee4] border border-[#ded0bf] shadow-sm transition-all"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-800' : 'text-stone-500'}`}
                />
                <span>{lang === 'ar' ? 'تحديث السجل' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Search & Issuer Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'ابحث في التراخيص والشهادات...'
                    : 'Search accreditations and awards...'
                }
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 rounded-xl bg-white border border-[#ded0bf] text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {issuers.map((issuer) => (
                <button
                  key={issuer.id}
                  onClick={() => setSelectedIssuer(issuer.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedIssuer === issuer.id
                      ? 'bg-amber-800 text-white font-bold shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-[#f6eee4] border border-[#ded0bf]'
                  }`}
                >
                  {issuer.label}
                </button>
              ))}
            </div>
          </div>

          {/* Certificates Grid */}
          {filteredCertificates.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-[#ded0bf] shadow-sm">
              <Award className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-600 font-medium text-sm">
                {lang === 'ar'
                  ? 'لم يتم العثور على اعتمادات مطابقة لبحثك.'
                  : 'No accreditations found matching your search.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCertificates.map((cert, certIdx) => (
                <div
                  key={cert.id}
                  onClick={() => setActiveModalCert(cert)}
                  className="reveal beige-card rounded-3xl overflow-hidden cursor-pointer flex flex-col group relative transform transition-all duration-300 hover:-translate-y-1.5 border border-[#e8dfd5] hover:border-[#cbb497]"
                  style={{ transitionDelay: `${Math.min(certIdx, 8) * 70}ms` }}
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 w-full bg-[#f4ede3] overflow-hidden">
                    <img
                      src={cert.imageUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"}
                      alt={t(cert.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-stone-900/15 group-hover:bg-transparent transition-colors" />

                    {/* Issuer Badge */}
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/95 backdrop-blur-md text-amber-950 border border-amber-300 shadow-md">
                        {t(cert.issuer)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-amber-800" />
                        <span>{t(cert.issueDate)}</span>
                      </div>

                      <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 judicial-heading leading-snug">
                        {t(cert.title)}
                      </h4>

                      {cert.description && (
                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                          {t(cert.description)}
                        </p>
                      )}
                    </div>

                    {/* Footer Trigger */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#e8dfd5] text-xs font-bold text-amber-900">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{lang === 'ar' ? 'فحص الاعتماد' : 'Inspect'}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SERVICES & PRODUCTION CAPABILITIES */}
      {/* ============================================================ */}
      <section id="practice-areas" className="py-24 border-b border-[#e8dfd5] bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900">
              <Layers className="w-4 h-4 text-amber-800" />
              <span>{lang === 'ar' ? 'خدمات KMA المتكاملة' : 'Our Media Services'}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight judicial-heading">
              {lang === 'ar' ? 'باقات وخدمات الإنتاج المرئي والتصوير' : 'Full-Spectrum Wedding & Media Services'}
            </h3>
            <p className="text-stone-600 text-xs sm:text-base">
              {lang === 'ar'
                ? 'حلول إعلامية وإنتاجية متكاملة تضمن خروج مناسبتكم بأبهى صورة سينمائية مع تسليمات سريعة وفائقة الجودة.'
                : 'Complete visual production solutions ensuring your wedding or corporate event is captured with flawless artistry.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data.practiceAreas || []).map((area, idx) => (
              <div
                key={idx}
                className="reveal p-8 rounded-3xl bg-[#fdfbf8] border border-[#e8dfd5] hover:border-[#cbb497] transition-all shadow-sm space-y-4"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h4 className="text-lg font-bold text-stone-900 judicial-heading">
                    {t(area.title)}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t(area.description)}
                </p>

                <div className="pt-2">
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                    {lang === 'ar' ? 'أبرز مميزات الخدمة' : 'Service Features'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {area.items.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-[#e4d8c7] text-stone-800 shadow-sm"
                      >
                        {t(item)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. BOOKING & CONTACT FORM */}
      {/* ============================================================ */}
      <section id="contact" className="py-24 bg-[#f5ece1]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Direct Contact Info */}
            <div className="reveal lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900">
                <Heart className="w-4 h-4 text-amber-800 fill-amber-800" />
                <span>{lang === 'ar' ? 'تواصل مع فريق KMA' : 'Connect with KMA'}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight judicial-heading">
                {lang === 'ar' ? 'احجز موعد حفل زفافك أو فعاليتك الآن' : 'Reserve Your Date with KMA'}
              </h3>
              <p className="text-stone-600 text-xs sm:text-base leading-relaxed">
                {lang === 'ar'
                  ? 'نسعد بمشاركتكم أسعد لحظاتكم. يرجى ملء بيانات الحفل لمعرفة توافر الموعد ومناقشة تفاصيل الباقة السينمائية المناسبة لكم.'
                  : 'We are thrilled to capture your once-in-a-lifetime moments. Fill in your event details to check availability.'}
              </p>

              <div className="space-y-3.5 pt-2">
                <a
                  href={`mailto:${data.profile.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ded0bf] hover:border-amber-700 transition-colors text-stone-700 hover:text-stone-900 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-stone-500 uppercase font-bold">
                      {lang === 'ar' ? 'البريد الإلكتروني المباشر' : 'Official Email'}
                    </div>
                    <div className="text-sm font-bold text-stone-900 font-mono">{data.profile.email}</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ded0bf] text-stone-700 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#efe6d8] text-amber-950 flex items-center justify-center border border-[#dfd2c0] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-stone-500 uppercase font-bold">
                      {lang === 'ar' ? 'الاستوديو ومقر العمل' : 'Studio & Production Base'}
                    </div>
                    <div className="text-sm font-bold text-stone-900">{t(data.profile.location)}</div>
                  </div>
                </div>

                {data.profile.phone && (
                  <a
                    href={`tel:${data.profile.phone.replace(/[^+\d]/g, '')}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ded0bf] hover:border-amber-700 transition-colors text-stone-700 hover:text-stone-900 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#efe6d8] text-amber-950 flex items-center justify-center border border-[#dfd2c0] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-stone-500 uppercase font-bold">
                        {lang === 'ar' ? 'الهاتف / واتساب للحجوزات' : 'Phone / WhatsApp'}
                      </div>
                      <div className="text-sm font-bold text-stone-900 font-mono">{data.profile.phone}</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Interactive Wedding Booking Form */}
            <div className="reveal lg:col-span-7" style={{ transitionDelay: '120ms' }}>
              <div className="p-8 rounded-3xl bg-white border border-[#ded0bf] shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f0e6d6]">
                  <div>
                    <h4 className="text-lg font-bold text-stone-900 judicial-heading">
                      {lang === 'ar' ? 'استمارة حجز موعد ومناسبة' : 'Event Booking Form'}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {lang === 'ar'
                        ? 'احجز موعدك مبكراً لضمان توافر فريق التصوير في يومك المميز'
                        : 'Book in advance to secure our cinematography crew for your date'}
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
                </div>

                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {lang === 'ar' ? 'الاسم بالكامل' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder={lang === 'ar' ? 'الاسم الكريم' : 'Full Name'}
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {lang === 'ar' ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+20 ..."
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {lang === 'ar' ? 'تاريخ الحفل / المناسبة' : 'Event Date'}
                      </label>
                      <input
                        type="date"
                        value={contactForm.eventDate}
                        onChange={(e) => setContactForm({ ...contactForm, eventDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-stone-900 focus:outline-none focus:border-amber-700 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {lang === 'ar' ? 'مكان الحفل / القاعة' : 'Venue / City'}
                      </label>
                      <input
                        type="text"
                        value={contactForm.location}
                        onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                        placeholder={lang === 'ar' ? 'اسم القاعة أو المدينة' : 'Venue Name / City'}
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      {lang === 'ar' ? 'نوع المناسبة المطلوبة' : 'Event Type'}
                    </label>
                    <select
                      value={contactForm.eventType}
                      onChange={(e) => setContactForm({ ...contactForm, eventType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-stone-900 focus:outline-none focus:border-amber-700 text-xs sm:text-sm font-medium"
                    >
                      <option value="wedding">
                        {lang === 'ar' ? 'حفل زفاف سينمائي كامل (Full Wedding Film)' : 'Cinematic Wedding'}
                      </option>
                      <option value="destination">
                        {lang === 'ar' ? 'زفاف شاطئي / سفر خارجي (Destination Wedding)' : 'Destination Beach Wedding'}
                      </option>
                      <option value="engagement">
                        {lang === 'ar' ? 'حفل خطوبة وفوتوسيشن (Engagement & Photoshoot)' : 'Engagement & Photoshoot'}
                      </option>
                      <option value="event">
                        {lang === 'ar' ? 'تغطية مؤتمر أو فعالية كبرى (Corporate Event)' : 'Corporate Event'}
                      </option>
                      <option value="commercial">
                        {lang === 'ar' ? 'إنتاج إعلان تجاري أو فيديو ترويجي (Commercial)' : 'Commercial Video'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      {lang === 'ar' ? 'تفاصيل إضافية أو طلبات خاصة' : 'Additional Notes / Vision'} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder={
                        lang === 'ar'
                          ? 'أخبرنا عن رؤيتكم لليوم المميز، عدد الحضور، أو أي تفاصيل تحبون أن نركز عليها...'
                          : 'Tell us about your vision for the special day...'
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 text-xs sm:text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-800 to-yellow-900 hover:from-amber-700 hover:to-yellow-800 shadow-md transition-all disabled:opacity-50"
                  >
                    {isSending ? (
                      <span>{lang === 'ar' ? 'جاري إرسال الطلب...' : 'Sending Request...'}</span>
                    ) : (
                      <>
                        <span>{lang === 'ar' ? 'إرسال طلب الحجز الآن' : 'Submit Booking Request'}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
