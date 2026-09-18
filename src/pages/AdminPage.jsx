import React, { useState, useRef, useEffect } from 'react';
import {
  Award,
  User,
  Briefcase,
  Layers,
  Upload,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Save,
  Check,
  ArrowLeft,
  Download,
  FileCode,
  RotateCcw,
  Search,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  Inbox,
  Palette,
  Sparkles,
  Sliders,
  ExternalLink,
  Eye,
  Film,
  Camera,
  Heart,
  Lock,
  Unlock,
  Key,
  Send
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { AdminMediaUpload } from '../components/AdminMediaUpload';

export const AdminPage = () => {
  const {
    data,
    navigateTo,
    updateProfile,
    updateStats,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    refreshCertificates,
    addProject,
    updateProject,
    deleteProject,
    addService,
    updateService,
    deleteService,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    updateSkills,
    resetToDefault,
    exportDataJSON,
    importDataJSON,
    editingCertId,
    setEditingCertId,
    bookings,
    deleteBooking,
    updateBookingStatus,
    showToast,
    currentTheme,
    setTheme,
    THEME_PRESETS,
    adminPasscode,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateAdminPasscode,
    sendTestEmail
  } = usePortfolio();

  const safeVal = (v) => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object') return v.en || v.ar || '';
    return String(v);
  };

  // Login Gate state
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [newPasscodeInput, setNewPasscodeInput] = useState('');

  // Active admin tab: 'theme' | 'profile' | 'projects' | 'services' | 'milestones' | 'certificates' | 'skills' | 'bookings' | 'backup'
  const [activeTab, setActiveTab] = useState('theme');

  // ============================================================
  // 1. THEME PRESETS STATE
  // ============================================================
  const activeThemeObj = (THEME_PRESETS || []).find((t) => t.id === currentTheme) || THEME_PRESETS?.[0];

  // ============================================================
  // 2. PROFILE & STATS STATE
  // ============================================================
  const [profileForm, setProfileForm] = useState({
    fullName: safeVal(data.profile.fullName),
    shortName: safeVal(data.profile.shortName),
    title: safeVal(data.profile.title),
    tagline: safeVal(data.profile.tagline),
    bio: safeVal(data.profile.bio),
    location: safeVal(data.profile.location),
    email: safeVal(data.profile.email),
    notificationEmail: data.profile.notificationEmail || data.profile.email || 'contact@kmawedding.com',
    web3formsKey: data.profile.web3formsKey || '',
    phone: safeVal(data.profile.phone),
    phoneSecondary: safeVal(data.profile.phoneSecondary),
    avatarUrl: data.profile.avatarUrl || '/logo.png',
    logoUrl: data.profile.logoUrl || '/logo.png',
    socials: {
      instagram: data.profile.socials?.instagram || '',
      facebook: data.profile.socials?.facebook || '',
      youtube: data.profile.socials?.youtube || '',
      tiktok: data.profile.socials?.tiktok || ''
    }
  });

  const [statsList, setStatsList] = useState(
    data.profile.stats || [
      { value: '+950', label: 'Weddings & Events Documented', desc: 'Celebrated across Egypt & Middle East' },
      { value: '+10', label: 'Years of Creative Excellence', desc: 'Pioneering visual storytelling' },
      { value: '25+', label: 'Professional Cinema Crew', desc: 'Specialized directors & cinematographers' },
      { value: '99.8%', label: 'Client Satisfaction Rate', desc: 'Unmatched reviews & recommendations' }
    ]
  );

  useEffect(() => {
    setProfileForm({
      fullName: safeVal(data.profile.fullName),
      shortName: safeVal(data.profile.shortName),
      title: safeVal(data.profile.title),
      tagline: safeVal(data.profile.tagline),
      bio: safeVal(data.profile.bio),
      location: safeVal(data.profile.location),
      email: safeVal(data.profile.email),
      notificationEmail: data.profile.notificationEmail || data.profile.email || 'contact@kmawedding.com',
      web3formsKey: data.profile.web3formsKey || '',
      phone: safeVal(data.profile.phone),
      phoneSecondary: safeVal(data.profile.phoneSecondary),
      avatarUrl: data.profile.avatarUrl || '/logo.png',
      logoUrl: data.profile.logoUrl || '/logo.png',
      socials: {
        instagram: data.profile.socials?.instagram || '',
        facebook: data.profile.socials?.facebook || '',
        youtube: data.profile.socials?.youtube || '',
        tiktok: data.profile.socials?.tiktok || ''
      }
    });
    setStatsList(data.profile.stats || []);
  }, [data.profile]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      ...profileForm,
      stats: statsList
    });
  };

  const handleStatChange = (idx, field, val) => {
    const updated = [...statsList];
    updated[idx] = { ...updated[idx], [field]: val };
    setStatsList(updated);
  };

  const handleAddStat = () => {
    setStatsList([...statsList, { value: '100+', label: 'New Metric', desc: 'Description of milestone' }]);
  };

  const handleDeleteStat = (idx) => {
    setStatsList(statsList.filter((_, i) => i !== idx));
  };

  // ============================================================
  // 3. PROJECTS / FILMS STATE
  // ============================================================
  const [editingProjId, setEditingProjId] = useState(null);
  const [isAddingProj, setIsAddingProj] = useState(false);
  const [projFormData, setProjFormData] = useState({
    title: '',
    category: 'weddings',
    categoryLabel: 'Cinematic Weddings',
    value: 'Full Cinema Package',
    year: '2024',
    tribunal: 'Cairo Luxury Venue',
    clientType: 'Luxury Royal Wedding',
    description: '',
    outcome: '',
    techStack: '',
    liveUrl: '',
    githubUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
  });

  const startNewProject = () => {
    setEditingProjId(null);
    setProjFormData({
      title: '',
      category: 'weddings',
      categoryLabel: 'Cinematic Weddings',
      value: 'VIP Wedding Package',
      year: '2024',
      tribunal: 'Cairo Luxury Venue',
      clientType: 'Luxury Royal Wedding',
      description: '',
      outcome: 'Full 4K highlights film and fine-art album delivered to the happy couple.',
      techStack: 'Sony FX3, DJI Cinema Drone, Master Color Grading, Sound Design',
      liveUrl: 'https://vimeo.com/...',
      githubUrl: 'https://instagram.com/kma_wedding',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
    });
    setIsAddingProj(true);
  };

  const handleEditProjectClick = (proj) => {
    setEditingProjId(proj.id);
    setIsAddingProj(false);
    setProjFormData({
      title: safeVal(proj.title),
      category: proj.category || 'weddings',
      categoryLabel: safeVal(proj.categoryLabel) || 'Cinematic Weddings',
      value: safeVal(proj.value) || '',
      year: safeVal(proj.year) || '2024',
      tribunal: safeVal(proj.tribunal) || '',
      clientType: safeVal(proj.clientType) || '',
      description: safeVal(proj.description),
      outcome: safeVal(proj.outcome),
      techStack: proj.techStack ? proj.techStack.map((s) => safeVal(s)).join(', ') : '',
      liveUrl: safeVal(proj.liveUrl),
      githubUrl: safeVal(proj.githubUrl),
      imageUrl: proj.imageUrl || ''
    });
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projFormData.title.trim()) {
      showToast('Film / Project Title is required.', 'error');
      return;
    }

    const parsedTech = projFormData.techStack
      ? projFormData.techStack.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      title: projFormData.title.trim(),
      category: projFormData.category,
      categoryLabel: projFormData.categoryLabel.trim(),
      value: projFormData.value.trim(),
      year: projFormData.year.trim(),
      tribunal: projFormData.tribunal.trim(),
      clientType: projFormData.clientType.trim(),
      description: projFormData.description.trim(),
      outcome: projFormData.outcome.trim(),
      techStack: parsedTech,
      liveUrl: projFormData.liveUrl.trim(),
      githubUrl: projFormData.githubUrl.trim(),
      imageUrl: projFormData.imageUrl.trim() || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
    };

    if (editingProjId) {
      updateProject(editingProjId, payload);
    } else {
      addProject(payload);
    }
    setEditingProjId(null);
    setIsAddingProj(false);
  };

  // ============================================================
  // 4. SERVICES / PACKAGES STATE (PRACTICE AREAS)
  // ============================================================
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    category: 'weddings',
    description: '',
    items: ''
  });

  const startNewService = () => {
    setEditingServiceId(null);
    setServiceFormData({
      title: '',
      category: 'weddings',
      description: '',
      items: '4K Cinema Cameras, Sound Design, Drone Aerials, Rapid Delivery'
    });
    setIsAddingService(true);
  };

  const handleEditServiceClick = (serv) => {
    setEditingServiceId(serv.id);
    setIsAddingService(false);
    setServiceFormData({
      title: safeVal(serv.title),
      category: serv.category || 'weddings',
      description: safeVal(serv.description),
      items: serv.items ? serv.items.map((it) => safeVal(it)).join(', ') : ''
    });
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceFormData.title.trim()) {
      showToast('Service package title is required.', 'error');
      return;
    }

    const parsedItems = serviceFormData.items
      ? serviceFormData.items.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      title: serviceFormData.title.trim(),
      category: serviceFormData.category,
      description: serviceFormData.description.trim(),
      items: parsedItems
    };

    if (editingServiceId) {
      updateService(editingServiceId, payload);
    } else {
      addService(payload);
    }
    setEditingServiceId(null);
    setIsAddingService(false);
  };

  // ============================================================
  // 5. MILESTONES STATE
  // ============================================================
  const [editingMilestoneIdx, setEditingMilestoneIdx] = useState(null);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [milestoneFormData, setMilestoneFormData] = useState({
    year: '2024',
    title: '',
    description: ''
  });

  const startNewMilestone = () => {
    setEditingMilestoneIdx(null);
    setMilestoneFormData({
      year: new Date().getFullYear().toString(),
      title: '',
      description: ''
    });
    setIsAddingMilestone(true);
  };

  const handleEditMilestoneClick = (ms, idx) => {
    setEditingMilestoneIdx(idx);
    setIsAddingMilestone(false);
    setMilestoneFormData({
      year: safeVal(ms.year),
      title: safeVal(ms.title),
      description: safeVal(ms.description)
    });
  };

  const handleSaveMilestone = (e) => {
    e.preventDefault();
    if (!milestoneFormData.title.trim() || !milestoneFormData.year.trim()) {
      showToast('Year and Milestone Title are required.', 'error');
      return;
    }

    const payload = {
      year: milestoneFormData.year.trim(),
      title: milestoneFormData.title.trim(),
      description: milestoneFormData.description.trim()
    };

    if (editingMilestoneIdx !== null) {
      updateMilestone(editingMilestoneIdx, payload);
    } else {
      addMilestone(payload);
    }
    setEditingMilestoneIdx(null);
    setIsAddingMilestone(false);
  };

  // ============================================================
  // 6. CERTIFICATES / PERMITS STATE
  // ============================================================
  const [certSearch, setCertSearch] = useState('');
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [certFormData, setCertFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    imageUrl: '',
    description: '',
    skills: '',
    featured: true
  });

  useEffect(() => {
    if (editingCertId) {
      const target = data.certificates.find((c) => c.id === editingCertId);
      if (target) {
        setCertFormData({
          title: safeVal(target.title),
          issuer: safeVal(target.issuer),
          issueDate: safeVal(target.issueDate),
          expiryDate: safeVal(target.expiryDate),
          credentialId: safeVal(target.credentialId),
          credentialUrl: safeVal(target.credentialUrl),
          imageUrl: safeVal(target.imageUrl),
          description: safeVal(target.description),
          skills: target.skills ? target.skills.map((s) => safeVal(s)).join(', ') : '',
          featured: target.featured ?? true
        });
        setIsAddingCert(false);
      }
    }
  }, [editingCertId, data.certificates]);

  const startNewCert = () => {
    setEditingCertId(null);
    setCertFormData({
      title: '',
      issuer: '',
      issueDate: '2024',
      expiryDate: 'Official Active License',
      credentialId: '',
      credentialUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
      description: '',
      skills: 'Cinematography, Wedding Films, Color Grading, 4K Production',
      featured: true
    });
    setIsAddingCert(true);
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    if (!certFormData.title.trim() || !certFormData.issuer.trim()) {
      showToast('Accreditation Title and Issuing Body are required.', 'error');
      return;
    }

    const parsedSkills = certFormData.skills
      ? certFormData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      title: certFormData.title.trim(),
      issuer: certFormData.issuer.trim(),
      issueDate: certFormData.issueDate.trim() || '2024',
      expiryDate: certFormData.expiryDate.trim(),
      credentialId: certFormData.credentialId.trim(),
      credentialUrl: certFormData.credentialUrl.trim(),
      imageUrl: certFormData.imageUrl.trim() || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
      description: certFormData.description.trim(),
      skills: parsedSkills,
      featured: Boolean(certFormData.featured),
      category: 'Official Permits & Licenses'
    };

    if (editingCertId) {
      updateCertificate(editingCertId, payload);
    } else {
      addCertificate(payload);
    }
    setEditingCertId(null);
    setIsAddingCert(false);
  };

  // ============================================================
  // 7. SKILLS / GEAR STATE
  // ============================================================
  const [skillsCatalog, setSkillsCatalog] = useState(data.skills || []);

  useEffect(() => {
    setSkillsCatalog(data.skills || []);
  }, [data.skills]);

  const handleSkillChange = (catIndex, value) => {
    const updated = [...skillsCatalog];
    updated[catIndex].items = value.split(',').map((s) => s.trim()).filter(Boolean);
    setSkillsCatalog(updated);
  };

  const handleSkillCategoryNameChange = (catIndex, value) => {
    const updated = [...skillsCatalog];
    updated[catIndex].category = value;
    setSkillsCatalog(updated);
  };

  const handleAddSkillCategory = () => {
    setSkillsCatalog([
      ...skillsCatalog,
      { category: 'New Production Domain', items: ['Capability 1', 'Capability 2'] }
    ]);
  };

  const handleDeleteSkillCategory = (idx) => {
    setSkillsCatalog(skillsCatalog.filter((_, i) => i !== idx));
  };

  const handleSaveSkills = () => {
    updateSkills(skillsCatalog);
  };

  // Handle Passcode Submission for Login Gate
  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    loginAdmin(passcodeAttempt);
    setPasscodeAttempt('');
  };

  // ============================================================
  // ADMIN PASSCODE GATE
  // ============================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-[#ded0bf] rounded-3xl shadow-2xl p-8 space-y-6 text-center animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-800" />

          {/* Logo & Security Lock Icon */}
          <div className="relative mx-auto w-24 h-24 rounded-3xl bg-[#f5ede1] border border-[#e5dacb] flex items-center justify-center p-2 shadow-inner">
            <img
              src={data.profile?.logoUrl || data.profile?.avatarUrl || "/logo.png"}
              alt="KMA Logo"
              className="w-full h-full object-contain rounded-2xl"
              onError={(e) => {
                e.target.src = "/logo.png";
              }}
            />
            <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-800 text-white shadow-md border-2 border-white">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-stone-900 font-serif judicial-heading">
              KMA Studio Master Lock
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Please enter your private admin passcode to access portfolio management, email settings, and client inquiries.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  autoFocus
                  required
                  value={passcodeAttempt}
                  onChange={(e) => setPasscodeAttempt(e.target.value)}
                  placeholder="Enter Passcode..."
                  className="w-full px-4 py-3.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-center font-mono text-lg tracking-widest text-stone-900 focus:outline-none focus:border-amber-700 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
                >
                  {showPasscode ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-[11px] text-stone-400 mt-2 font-mono">
                Default PIN: <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">kma2026</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-all shadow-md"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('portfolio')}
              className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
            >
              Return to Public Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-800 pb-24">
      {/* Top Banner & Navigation Header */}
      <div className="border-b border-[#e8dfd5] bg-[#faf7f2]/95 backdrop-blur-md sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => navigateTo('portfolio')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6eee4] text-stone-700 hover:text-stone-950 border border-[#ded0bf] transition-colors text-xs font-bold shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Showcase</span>
              </button>
              <div className="h-4 w-px bg-[#dfd2c0] hidden sm:block" />
              <div>
                <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2 judicial-heading">
                  <span>KMA Studio Management & Master Portal</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                    Live Control
                  </span>
                </h1>
                <p className="text-xs text-stone-500 font-medium">
                  Custom color themes, media uploads, packages, milestones, and client inquiries
                </p>
              </div>
            </div>

            {/* Quick Actions & Security Lock */}
            <div className="flex items-center gap-2">
              <button
                onClick={exportDataJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6eee4] text-stone-700 hover:text-stone-900 border border-[#ded0bf] transition-colors text-xs font-semibold shadow-sm"
                title="Download full JSON backup"
              >
                <Download className="w-3.5 h-3.5 text-amber-800" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => navigateTo('portfolio')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white transition-colors text-xs font-bold shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Site</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-800 border border-[#ded0bf] transition-colors text-xs font-semibold shadow-sm"
                title="Lock Dashboard Session"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            </div>
          </div>

          {/* Navigation Tab Bar with all 9 Sections */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 border-t border-[#e8dfd5] scrollbar-none">
            {/* Tab 1: Theme & Colors */}
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'theme'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Theme & Colors</span>
              <span className={`w-2 h-2 rounded-full ${activeTab === 'theme' ? 'bg-amber-300' : 'bg-amber-600'}`} />
            </button>

            {/* Tab 2: Studio & Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'profile'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Studio & Stats</span>
            </button>

            {/* Tab 3: Films & Projects */}
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'projects'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Films & Portfolio ({data.projects.length})</span>
            </button>

            {/* Tab 4: Services & Packages */}
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'services'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Services & Packages ({(data.practiceAreas || []).length})</span>
            </button>

            {/* Tab 5: Milestones */}
            <button
              onClick={() => setActiveTab('milestones')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'milestones'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Journey & Milestones ({(data.milestones || []).length})</span>
            </button>

            {/* Tab 6: Permits & Awards */}
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'certificates'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Permits & Awards ({data.certificates.length})</span>
            </button>

            {/* Tab 7: Gear & Skills */}
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'skills'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Gear & Tech</span>
            </button>

            {/* Tab 8: Event Bookings */}
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'bookings'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Client Inquiries</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                (bookings || []).length > 0
                  ? activeTab === 'bookings' ? 'bg-white text-amber-900' : 'bg-amber-800 text-white'
                  : 'bg-stone-200 text-stone-600'
              }`}>
                {(bookings || []).length}
              </span>
            </button>

            {/* Tab 9: Backup & Restore */}
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'backup'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Backup & Security</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: THEME & APPEARANCE CUSTOMIZER                         */}
      {/* ============================================================ */}
      {activeTab === 'theme' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fade-in">
          <div className="p-8 rounded-3xl bg-white border border-[#ded0bf] shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8dfd5]">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900 mb-1">
                  <Palette className="w-4 h-4 text-amber-800" />
                  <span>Color Customizer</span>
                </div>
                <h2 className="text-xl font-bold text-stone-900 font-serif">
                  Website Color Theme & Aesthetic
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Select a luxury color palette below. Changes apply instantly across the entire showcase, navigation, buttons, and admin dashboard.
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#fbf9f6] border border-[#ded0bf]">
                <div
                  className="w-8 h-8 rounded-xl shadow-md border border-white/60 shrink-0"
                  style={{ background: activeThemeObj?.gradient || '#b45309' }}
                />
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">Active Theme</span>
                  <span className="text-xs font-bold text-stone-900 font-serif">
                    {activeThemeObj?.name || 'Gold & Amber Luxury'}
                  </span>
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(THEME_PRESETS || []).map((thm) => {
                const isSelected = currentTheme === thm.id;
                return (
                  <div
                    key={thm.id}
                    onClick={() => setTheme(thm.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden group ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/50 shadow-lg ring-4 ring-amber-700/20'
                        : 'border-[#e5dacb] bg-[#fbf9f6] hover:border-stone-400 hover:bg-white shadow-sm'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded-lg shadow-sm border border-white/60"
                          style={{ background: thm.primary }}
                        />
                        <h3 className="text-sm font-bold text-stone-900 font-serif">{thm.name}</h3>
                      </div>

                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-800 text-white shadow-sm">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-stone-400 group-hover:text-stone-700 transition-colors">
                          Click to Apply
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed font-normal">
                      {thm.tagline}
                    </p>

                    {/* Gradient Preview Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-[#eee3d5]">
                      <div
                        className="h-5 w-full rounded-lg shadow-inner border border-stone-900/10"
                        style={{ background: thm.gradient }}
                      />
                      <div className="flex gap-1.5 justify-end">
                        {thm.previewColors?.map((c, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Interactive Sample Preview */}
            <div className="pt-6 border-t border-[#e8dfd5] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Live Theme Component Preview
              </h4>

              <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-bold judicial-heading gradient-gold">
                    KMA Cinematic Media
                  </span>
                  <p className="text-xs text-stone-500">
                    Typography, gradients, and buttons update automatically with the chosen theme.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                    Badge Preview
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-all shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Button Preview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: PROFILE, LOGO, STATS & EMAIL CONFIG                   */}
      {/* ============================================================ */}
      {activeTab === 'profile' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fade-in">
          <div className="p-8 rounded-3xl bg-white border border-[#ded0bf] shadow-md space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900 mb-1">
                <User className="w-4 h-4 text-amber-800" />
                <span>Brand Identity</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 font-serif">KMA Profile & Studio Brand</h2>
              <p className="text-xs text-stone-500 mt-1">
                Manage your studio name, official logo, company description, contact numbers, email alerts, and public stats.
              </p>
            </div>

            {/* Logo Media Upload Component */}
            <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5]">
              <AdminMediaUpload
                label="Official Studio Logo & Avatar"
                helper="High-resolution PNG, JPG, WebP, or SVG. Displayed in navbar, hero showpiece, and footer."
                currentUrl={profileForm.avatarUrl}
                onUrlChange={(newUrl) =>
                  setProfileForm((prev) => ({ ...prev, avatarUrl: newUrl, logoUrl: newUrl }))
                }
                aspectRatio="square"
              />
            </div>

            {/* Email Notification Setup Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 to-[#fdfbf7] border border-[#ded0bf] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ebdccb]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-serif">
                      Direct Email Notifications (100% Free • Web3Forms)
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Receive every client booking directly in your Gmail inbox immediately with 0 server costs.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={sendTestEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 shadow-sm transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Email</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Notification Recipient Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.notificationEmail}
                    onChange={(e) => setProfileForm({ ...profileForm, notificationEmail: e.target.value })}
                    placeholder="your.email@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-mono"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Client booking details will be sent directly to this address.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Web3Forms Free Access Key
                    </label>
                    <a
                      href="https://web3forms.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-amber-800 hover:underline font-bold flex items-center gap-0.5"
                    >
                      <span>Get Free Key (10s)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={profileForm.web3formsKey}
                    onChange={(e) => setProfileForm({ ...profileForm, web3formsKey: e.target.value })}
                    placeholder="e.g. 1a2b3c4d-5e6f-7g8h-9i0j-..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-mono"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Paste your free key from web3forms.com (no sign-up, no credit card required).
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Fields Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Company Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Headline / Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Brand Slogan / Tagline
                </label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  About KMA & Studio Vision
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Location & Destination Coverage
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Primary Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Official Studio Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-[#e8dfd5] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Social Channels & Platforms
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">Instagram</label>
                    <input
                      type="url"
                      value={profileForm.socials?.instagram || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, instagram: e.target.value }
                        })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">YouTube / Vimeo</label>
                    <input
                      type="url"
                      value={profileForm.socials?.youtube || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, youtube: e.target.value }
                        })
                      }
                      placeholder="https://youtube.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">Facebook</label>
                    <input
                      type="url"
                      value={profileForm.socials?.facebook || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, facebook: e.target.value }
                        })
                      }
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">TikTok</label>
                    <input
                      type="url"
                      value={profileForm.socials?.tiktok || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, tiktok: e.target.value }
                        })
                      }
                      placeholder="https://tiktok.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>
                </div>
              </div>

              {/* Company Stats Counters Management */}
              <div className="pt-6 border-t border-[#e8dfd5] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Hero Key Statistics & Counters
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Displayed on the Hero section (e.g. +950 Weddings, +10 Years, 25+ Crew, 99.8% Satisfaction).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStat}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stat</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {statsList.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] space-y-2 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteStat(idx)}
                        className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-rose-700 hover:bg-white rounded-lg transition-colors"
                        title="Remove stat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-stone-500 uppercase">Number</label>
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                            placeholder="+950"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#ded0bf] text-xs font-bold text-amber-900 focus:outline-none focus:border-amber-700 font-serif"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-stone-500 uppercase">Metric Title</label>
                          <input
                            type="text"
                            value={safeVal(st.label)}
                            onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                            placeholder="Weddings Documented"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#ded0bf] text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase">Subtitle / Scope</label>
                        <input
                          type="text"
                          value={safeVal(st.desc)}
                          onChange={(e) => handleStatChange(idx, 'desc', e.target.value)}
                          placeholder="Celebrated across Egypt"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#ded0bf] text-[11px] text-stone-600 focus:outline-none focus:border-amber-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Studio Profile & Stats</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: MEDIA WORKS & FILMS                                   */}
      {/* ============================================================ */}
      {activeTab === 'projects' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Projects List */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 font-serif">KMA Films & Portfolio</h2>
                  <p className="text-xs text-stone-500">Manage cinematic wedding films and commercial media showcases</p>
                </div>
                <button
                  onClick={startNewProject}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Film</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => handleEditProjectClick(proj)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      editingProjId === proj.id
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-700/20 shadow-md'
                        : 'bg-white border-[#ded0bf] hover:border-amber-600 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f4ede3] shrink-0 border border-[#e4d8c7]">
                        <img
                          src={proj.imageUrl}
                          alt={safeVal(proj.title)}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            {safeVal(proj.categoryLabel) || proj.category}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono">• {proj.year}</span>
                        </div>
                        <h3 className="text-sm font-bold text-stone-900 truncate font-serif mt-0.5">{safeVal(proj.title)}</h3>
                        <p className="text-xs text-stone-500 truncate">{safeVal(proj.description)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProjectClick(proj);
                        }}
                        className="p-2 text-stone-500 hover:text-amber-800 hover:bg-stone-100 rounded-lg"
                        title="Edit Film"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete film "${safeVal(proj.title)}"?`)) {
                            deleteProject(proj.id);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        title="Delete Film"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Project Form */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-white border border-[#ded0bf] shadow-md sticky top-40 space-y-4">
                <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-[#e8dfd5] font-serif">
                  {isAddingProj
                    ? 'Add New Film / Media Project'
                    : editingProjId
                    ? 'Edit Film Details'
                    : 'Select a Film from the list or click "Add New Film"'}
                </h3>

                <form onSubmit={handleSaveProject} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Project / Film Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projFormData.title}
                      onChange={(e) => setProjFormData({ ...projFormData, title: e.target.value })}
                      placeholder="e.g. Royal Palace Wedding Highlights • Baron Palace"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <select
                        value={projFormData.category}
                        onChange={(e) => {
                          const cat = e.target.value;
                          const labels = {
                            weddings: 'Cinematic Weddings',
                            destination: 'Destination Weddings',
                            events: 'Corporate Events',
                            photography: 'Bridal Photography',
                            commercial: 'Commercial Media'
                          };
                          setProjFormData({
                            ...projFormData,
                            category: cat,
                            categoryLabel: labels[cat] || cat
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      >
                        <option value="weddings">Cinematic Weddings</option>
                        <option value="destination">Destination Weddings</option>
                        <option value="events">Corporate Events</option>
                        <option value="photography">Bridal Photography</option>
                        <option value="commercial">Commercial Media</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Package / Scope Badge
                      </label>
                      <input
                        type="text"
                        value={projFormData.value}
                        onChange={(e) => setProjFormData({ ...projFormData, value: e.target.value })}
                        placeholder="e.g. VIP Cinema Package"
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Film Description & Highlights
                    </label>
                    <textarea
                      rows={3}
                      value={projFormData.description}
                      onChange={(e) => setProjFormData({ ...projFormData, description: e.target.value })}
                      placeholder="Multi-camera 4K cinematography, aerial drone sweeps, and same-day highlights..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Camera Gear & Deliverables (comma separated)
                    </label>
                    <input
                      type="text"
                      value={projFormData.techStack}
                      onChange={(e) => setProjFormData({ ...projFormData, techStack: e.target.value })}
                      placeholder="Sony FX6, DJI Cinema Drone, Davinci Resolve, Same Day Edit"
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Watch Film / Vimeo / Video URL
                      </label>
                      <input
                        type="url"
                        value={projFormData.liveUrl}
                        onChange={(e) => setProjFormData({ ...projFormData, liveUrl: e.target.value })}
                        placeholder="https://vimeo.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Gallery / Instagram Link
                      </label>
                      <input
                        type="url"
                        value={projFormData.githubUrl}
                        onChange={(e) => setProjFormData({ ...projFormData, githubUrl: e.target.value })}
                        placeholder="https://instagram.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  {/* Media Upload for Project Poster */}
                  <div>
                    <AdminMediaUpload
                      label="Cover Image / Film Poster"
                      helper="Drag & drop or upload the cinematic poster image for this wedding or production"
                      currentUrl={projFormData.imageUrl}
                      onUrlChange={(url) => setProjFormData((prev) => ({ ...prev, imageUrl: url }))}
                      aspectRatio="video"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProjId ? 'Save Film Changes' : 'Add Film to Showcase'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: SERVICES & PACKAGES (FULL CRUD)                       */}
      {/* ============================================================ */}
      {activeTab === 'services' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Services List */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 font-serif">KMA Services & Production Packages</h2>
                  <p className="text-xs text-stone-500">
                    The 4 cards displayed under "Full-Spectrum Wedding & Media Services"
                  </p>
                </div>
                <button
                  onClick={startNewService}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Package</span>
                </button>
              </div>

              <div className="space-y-3">
                {(data.practiceAreas || []).map((serv, idx) => (
                  <div
                    key={serv.id || idx}
                    onClick={() => handleEditServiceClick(serv)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      editingServiceId === serv.id
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-700/20 shadow-md'
                        : 'bg-white border-[#ded0bf] hover:border-amber-600 shadow-sm'
                    }`}
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-stone-900 font-serif truncate">
                          {safeVal(serv.title)}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {safeVal(serv.description)}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(serv.items || []).slice(0, 3).map((it, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-[#f6eee4] text-stone-700 text-[10px] font-semibold border border-[#e5dacb]"
                          >
                            {safeVal(it)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditServiceClick(serv);
                        }}
                        className="p-2 text-stone-500 hover:text-amber-800 hover:bg-stone-100 rounded-lg"
                        title="Edit Service"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete service "${safeVal(serv.title)}"?`)) {
                            deleteService(serv.id);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Form */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-white border border-[#ded0bf] shadow-md sticky top-40 space-y-4">
                <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-[#e8dfd5] font-serif">
                  {isAddingService
                    ? 'Add New Service Package'
                    : editingServiceId
                    ? 'Edit Service Package'
                    : 'Select a Service to Edit'}
                </h3>

                <form onSubmit={handleSaveService} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceFormData.title}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                      placeholder="e.g. Cinematic Wedding Films"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Category Identifier
                    </label>
                    <input
                      type="text"
                      value={serviceFormData.category}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                      placeholder="weddings, photography, drone, media"
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Service Description
                    </label>
                    <textarea
                      rows={3}
                      value={serviceFormData.description}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                      placeholder="Explain the aesthetic approach, cameras, and emotional storytelling..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Included Package Features (comma separated)
                    </label>
                    <textarea
                      rows={3}
                      value={serviceFormData.items}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, items: e.target.value })}
                      placeholder="4K / 6K Digital Cinema Cameras, Custom Score, Same-Day Edit, Luxury Wooden USB Box"
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingServiceId ? 'Save Package Details' : 'Add Service Package'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: JOURNEY & MILESTONES (FULL CRUD)                      */}
      {/* ============================================================ */}
      {activeTab === 'milestones' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 font-serif">KMA Creative Journey Timeline</h2>
                  <p className="text-xs text-stone-500">
                    Displayed under "Our Creative Journey" on the About section
                  </p>
                </div>
                <button
                  onClick={startNewMilestone}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {(data.milestones || []).map((ms, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleEditMilestoneClick(ms, idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      editingMilestoneIdx === idx
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-700/20 shadow-md'
                        : 'bg-white border-[#ded0bf] hover:border-amber-600 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 font-bold font-mono text-xs border border-amber-300 shrink-0">
                        {ms.year}
                      </span>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm font-bold text-stone-900 font-serif truncate">
                          {safeVal(ms.title)}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2">
                          {safeVal(ms.description)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMilestoneClick(ms, idx);
                        }}
                        className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-stone-100 rounded-lg"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete milestone "${safeVal(ms.title)}"?`)) {
                            deleteMilestone(idx);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Form */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-white border border-[#ded0bf] shadow-md sticky top-40 space-y-4">
                <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-[#e8dfd5] font-serif">
                  {isAddingMilestone
                    ? 'Add Creative Milestone'
                    : editingMilestoneIdx !== null
                    ? 'Edit Milestone'
                    : 'Select a Milestone to Edit'}
                </h3>

                <form onSubmit={handleSaveMilestone} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Year Achieved *
                    </label>
                    <input
                      type="text"
                      required
                      value={milestoneFormData.year}
                      onChange={(e) => setMilestoneFormData({ ...milestoneFormData, year: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Milestone Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={milestoneFormData.title}
                      onChange={(e) => setMilestoneFormData({ ...milestoneFormData, title: e.target.value })}
                      placeholder="e.g. Surpassed 950 Celebrated Weddings & Events"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Milestone Description
                    </label>
                    <textarea
                      rows={3}
                      value={milestoneFormData.description}
                      onChange={(e) => setMilestoneFormData({ ...milestoneFormData, description: e.target.value })}
                      placeholder="Details on the expansion of cinema gear, fleet, awards, or studio facilities..."
                      className="w-full px-3 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingMilestoneIdx !== null ? 'Save Milestone' : 'Add Milestone'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: PERMITS & LICENSES HUB                                */}
      {/* ============================================================ */}
      {activeTab === 'certificates' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Certificates List & Search */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 font-serif">KMA Official Permits & Accreditations</h2>
                  <p className="text-xs text-stone-500">Official drone flight permits, camera licenses, and industry awards</p>
                </div>
                <button
                  onClick={startNewCert}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Permit</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  placeholder="Filter permits by title or issuing authority..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#ded0bf] text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 shadow-sm"
                />
              </div>

              {/* Clickable Certificate Cards */}
              <div className="space-y-3">
                {data.certificates
                  .filter(
                    (c) =>
                      safeVal(c.title).toLowerCase().includes(certSearch.toLowerCase()) ||
                      safeVal(c.issuer).toLowerCase().includes(certSearch.toLowerCase())
                  )
                  .map((cert) => {
                    const isSelected = editingCertId === cert.id && !isAddingCert;
                    return (
                      <div
                        key={cert.id}
                        onClick={() => {
                          setEditingCertId(cert.id);
                          setIsAddingCert(false);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-700/20 shadow-md'
                            : 'bg-white border-[#ded0bf] hover:border-amber-600 hover:bg-[#fcfaf7] shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f4ede3] shrink-0 border border-[#e4d8c7]">
                            <img
                              src={cert.imageUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"}
                              alt={safeVal(cert.title)}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-amber-900 truncate">
                                {safeVal(cert.issuer)}
                              </span>
                              <span className="text-[10px] text-stone-500">
                                • {safeVal(cert.issueDate)}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-stone-900 truncate group-hover:text-amber-800 transition-colors judicial-heading">
                              {safeVal(cert.title)}
                            </h3>
                            {cert.credentialId && (
                              <p className="text-[11px] text-stone-500 font-mono truncate">
                                Reg ID: {cert.credentialId}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCertId(cert.id);
                              setIsAddingCert(false);
                            }}
                            className="p-2 text-stone-500 hover:text-amber-800 hover:bg-white rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete credential "${cert.title}"?`)) {
                                deleteCertificate(cert.id);
                              }
                            }}
                            className="p-2 text-stone-400 hover:text-rose-700 hover:bg-white rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Column: Certificate Editor Form */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-white border border-[#ded0bf] shadow-md sticky top-40 space-y-4">
                <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-[#e8dfd5] font-serif">
                  {isAddingCert
                    ? 'Add Official Permit / Accreditation'
                    : editingCertId
                    ? 'Edit Permit Details'
                    : 'Select a Permit from the list to Edit'}
                </h3>

                <form onSubmit={handleSaveCert} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Accreditation / Permit Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={certFormData.title}
                      onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                      placeholder="e.g. Commercial Aerial Drone Operator Permit"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Issuing Authority / Chamber *
                      </label>
                      <input
                        type="text"
                        required
                        value={certFormData.issuer}
                        onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })}
                        placeholder="e.g. Civil Aviation Authority"
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Issue Year / Status
                      </label>
                      <input
                        type="text"
                        value={certFormData.issueDate}
                        onChange={(e) => setCertFormData({ ...certFormData, issueDate: e.target.value })}
                        placeholder="2024 / Active Official Permit"
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Credential / License ID
                      </label>
                      <input
                        type="text"
                        value={certFormData.credentialId}
                        onChange={(e) => setCertFormData({ ...certFormData, credentialId: e.target.value })}
                        placeholder="UAV-DRONE-LIC-3301"
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Verification URL
                      </label>
                      <input
                        type="url"
                        value={certFormData.credentialUrl}
                        onChange={(e) => setCertFormData({ ...certFormData, credentialUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Permit Scope / Description
                    </label>
                    <textarea
                      rows={3}
                      value={certFormData.description}
                      onChange={(e) => setCertFormData({ ...certFormData, description: e.target.value })}
                      placeholder="Accredited for aerial filming of weddings, open-air venues, and summits..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 resize-none"
                    />
                  </div>

                  {/* Media Upload for Certificate Document */}
                  <div>
                    <AdminMediaUpload
                      label="Permit / Certificate Document Image"
                      helper="Drag & drop or upload official certificate or permit document"
                      currentUrl={certFormData.imageUrl}
                      onUrlChange={(url) => setCertFormData((prev) => ({ ...prev, imageUrl: url }))}
                      aspectRatio="document"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingCertId ? 'Save Permit Changes' : 'Add Permit to Showcase'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 7: GEAR & CAPABILITIES                                   */}
      {/* ============================================================ */}
      {activeTab === 'skills' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-fade-in">
          <div className="p-8 rounded-3xl bg-white border border-[#ded0bf] shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-serif">KMA Cinema Gear & Tech Capabilities</h2>
                <p className="text-xs text-stone-500">
                  Edit categories and equipment lists shown across the showcase.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSkillCategory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-6">
              {skillsCatalog.map((cat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] space-y-3 relative group">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={cat.category}
                      onChange={(e) => handleSkillCategoryNameChange(idx, e.target.value)}
                      className="text-xs font-bold text-amber-900 uppercase tracking-wider font-serif bg-white px-3 py-1.5 rounded-lg border border-[#ded0bf] focus:outline-none focus:border-amber-700 flex-1 max-w-sm"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-500 font-mono">
                        {cat.items.length} items
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkillCategory(idx)}
                        className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-white rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Capabilities (comma separated)
                    </label>
                    <input
                      type="text"
                      value={cat.items.join(', ')}
                      onChange={(e) => handleSkillChange(idx, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={handleSaveSkills}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save All Gear & Capabilities</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 8: EVENT BOOKINGS & INQUIRIES                            */}
      {/* ============================================================ */}
      {activeTab === 'bookings' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-fade-in">
          {/* Email Notification Quick Configuration */}
          <div className="p-6 rounded-3xl bg-white border border-[#ded0bf] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Live Email Notifications Status
                  </h3>
                  <p className="text-xs text-stone-500">
                    Destination: <span className="font-mono font-bold text-stone-800">{profileForm.notificationEmail || profileForm.email}</span>
                    {profileForm.web3formsKey ? ' • Web3Forms API Active ✅' : ' • Free Key Pending (Add in Studio & Stats)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={sendTestEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Test Email Dispatch</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#ded0bf] shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8dfd5]">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-serif flex items-center gap-2.5">
                  <Inbox className="w-5 h-5 text-amber-800" />
                  <span>Client Event Bookings & Inquiries</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Every request submitted on the public booking form appears here instantly and triggers an email alert.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  Total Inquiries: {(bookings || []).length}
                </span>
              </div>
            </div>

            {/* Bookings List */}
            {(!bookings || bookings.length === 0) ? (
              <div className="text-center py-16 px-4 bg-[#fbf9f6] rounded-2xl border border-dashed border-[#d8cbba]">
                <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-stone-700">No booking inquiries yet</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  When clients submit the Event Booking Form on the public showcase, their requests will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] hover:border-[#cbb497] transition-all shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eee3d5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-800 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                          {b.name ? b.name.charAt(0).toUpperCase() : 'B'}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                            <span>{b.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : b.status === 'contacted'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {b.status || 'new'}
                            </span>
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono mt-0.5">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>
                              Received: {b.createdAt ? new Date(b.createdAt).toLocaleDateString() + ' ' + new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status changer & delete */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <select
                          value={b.status || 'new'}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-[#ded0bf] text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-700"
                        >
                          <option value="new">Mark: New</option>
                          <option value="contacted">Mark: Contacted</option>
                          <option value="confirmed">Mark: Confirmed</option>
                        </select>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete booking inquiry from "${b.name}"?`)) {
                              deleteBooking(b.id);
                              showToast('Booking inquiry removed');
                            }
                          }}
                          className="p-2 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-[#ded0bf]">
                        <span className="text-[10px] font-bold uppercase text-stone-400 block mb-0.5">Phone / WhatsApp</span>
                        <a
                          href={`tel:${b.phone}`}
                          className="font-mono font-bold text-amber-900 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-amber-700" />
                          <span>{b.phone}</span>
                        </a>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#ded0bf]">
                        <span className="text-[10px] font-bold uppercase text-stone-400 block mb-0.5">Email Address</span>
                        <a
                          href={`mailto:${b.email}`}
                          className="font-mono text-stone-800 hover:underline truncate block flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3 text-amber-700 shrink-0" />
                          <span className="truncate">{b.email || 'None'}</span>
                        </a>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#ded0bf]">
                        <span className="text-[10px] font-bold uppercase text-stone-400 block mb-0.5">Event Date</span>
                        <span className="font-semibold text-stone-800 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                          <span>{b.eventDate || 'Not specified'}</span>
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#ded0bf]">
                        <span className="text-[10px] font-bold uppercase text-stone-400 block mb-0.5">Venue & Location</span>
                        <span className="font-semibold text-stone-800 truncate flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span className="truncate">{b.location || 'Cairo / Unspecified'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Message / Details */}
                    <div className="p-4 rounded-xl bg-white border border-[#ded0bf] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-stone-400">Client Vision & Message</span>
                      <p className="text-xs text-stone-700 leading-relaxed font-normal">
                        "{b.message}"
                      </p>
                    </div>

                    {/* Quick WhatsApp Contact Action */}
                    {b.phone && (
                      <div className="flex justify-end pt-1">
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Message on WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 9: BACKUP & SECURITY SETTINGS                            */}
      {/* ============================================================ */}
      {activeTab === 'backup' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fade-in">
          <div className="p-8 rounded-3xl bg-white border border-[#ded0bf] shadow-md space-y-8">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif">KMA Security & Data Archive</h2>
              <p className="text-xs text-stone-500">
                Change your admin PIN, export your complete database locally as a portable JSON file, or restore.
              </p>
            </div>

            {/* Passcode Security */}
            <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Admin Passcode & PIN Security</h3>
                  <p className="text-xs text-stone-500">
                    Current PIN is active. Enter a new 4+ digit code to update access security.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md">
                <input
                  type="text"
                  value={newPasscodeInput}
                  onChange={(e) => setNewPasscodeInput(e.target.value)}
                  placeholder="Enter new 4+ character passcode..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#ded0bf] text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-amber-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (updateAdminPasscode(newPasscodeInput)) {
                      setNewPasscodeInput('');
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
                >
                  Update PIN
                </button>
              </div>
            </div>

            {/* Export */}
            <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Download Complete Archive (.json)</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Saves all wedding films, media permits, logos, and studio contacts into a single portable backup file.
                </p>
              </div>
              <button
                onClick={exportDataJSON}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 transition-colors shrink-0 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Restore from Backup (.json)</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Upload a previously exported JSON backup file to restore all records instantly.
                </p>
              </div>
              <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-stone-800 bg-white hover:bg-[#f4ece1] border border-[#ded0bf] cursor-pointer transition-colors shrink-0 shadow-sm">
                <Upload className="w-4 h-4 text-amber-800" />
                <span>Upload JSON</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) importDataJSON(file);
                  }}
                />
              </label>
            </div>

            {/* Reset */}
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-rose-900">Reset to Default KMA Showcase</h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  Reverts all films, permits, packages, and studio details back to the default factory state.
                </p>
              </div>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 transition-colors shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
