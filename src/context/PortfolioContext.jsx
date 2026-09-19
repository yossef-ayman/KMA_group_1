import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaultData';
import { THEME_PRESETS, BG_TONES } from '../data/themes';

const STORAGE_KEY = 'kma_wedding_media_production_en_v6';
const STORAGE_LANG_KEY = 'kma_wedding_lang_en_v4';
const STORAGE_BOOKINGS_KEY = 'kma_wedding_bookings_v1';
const STORAGE_THEME_KEY = 'kma_wedding_theme_v1';
const STORAGE_BGTONE_KEY = 'kma_wedding_bgtone_v1';
const STORAGE_PASSCODE_KEY = 'kma_admin_passcode_v1';
const SESSION_AUTH_KEY = 'kma_admin_auth_session_v1';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  // Purge any legacy keys
  if (typeof window !== 'undefined') {
    try {
      [
        'mariam_awad_judge_data_v4',
        'awad_partners_firm_data_v1',
        'awad_partners_firm_data_v2',
        'awad_partners_lang_v1',
        'kma_wedding_media_data_v3',
        'kma_wedding_media_production_v5',
        'kma_wedding_lang_v3'
      ].forEach(k => {
        localStorage.removeItem(k);
      });
    } catch (e) {}
  }

  // Language state: defaults to 'en'
  const [lang, setLang] = useState(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_LANG_KEY);
      if (savedLang === 'en' || savedLang === 'ar') {
        return savedLang;
      }
    } catch (e) {
      console.error(e);
    }
    return 'en'; // Default to English
  });

  // Admin Security & Passcode Gate
  const [adminPasscode, setAdminPasscode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_PASSCODE_KEY) || 'kma2026';
    } catch (e) {
      return 'kma2026';
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const loginAdmin = (inputPasscode) => {
    if (inputPasscode === adminPasscode) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      } catch (e) {}
      showToast(lang === 'ar' ? 'تم تسجيل الدخول للوحة الإدارة بنجاح' : 'Admin session authenticated successfully!');
      return true;
    }
    showToast(lang === 'ar' ? 'الرقم السري غير صحيح' : 'Invalid admin passcode.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    } catch (e) {}
    showToast(lang === 'ar' ? 'تم تسجيل الخروج' : 'Admin session ended.', 'info');
  };

  const updateAdminPasscode = (newCode) => {
    if (!newCode || newCode.length < 4) {
      showToast(lang === 'ar' ? 'الرمز يجب أن يكون 4 خانات على الأقل' : 'Passcode must be at least 4 characters.', 'error');
      return false;
    }
    setAdminPasscode(newCode);
    try {
      localStorage.setItem(STORAGE_PASSCODE_KEY, newCode);
    } catch (e) {}
    showToast(lang === 'ar' ? 'تم تحديث الرقم السري بنجاح' : 'Admin passcode updated successfully!');
    return true;
  };

  // Theme state: defaults to 'gold'
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
      if (savedTheme && THEME_PRESETS.some(t => t.id === savedTheme)) {
        return savedTheme;
      }
    } catch (e) {
      console.error(e);
    }
    return 'gold';
  });

  // Apply theme to document
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem(STORAGE_THEME_KEY, currentTheme);
    } catch (e) {
      console.error(e);
    }
  }, [currentTheme]);

  const setTheme = (themeId) => {
    setCurrentTheme(themeId);
    const themeObj = THEME_PRESETS.find(t => t.id === themeId);
    showToast(
      lang === 'ar'
        ? `تم تفعيل ثيم: ${themeObj?.name || themeId}`
        : `Theme switched to: ${themeObj?.name || themeId}`
    );
  };

  // Background Canvas Tone state: defaults to 'beige'
  const [bgTone, setBgTone] = useState(() => {
    try {
      const savedTone = localStorage.getItem(STORAGE_BGTONE_KEY);
      if (savedTone && BG_TONES.some(b => b.id === savedTone)) {
        return savedTone;
      }
    } catch (e) {
      console.error(e);
    }
    return 'beige';
  });

  // Apply background tone to document
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-bgtone', bgTone);
      localStorage.setItem(STORAGE_BGTONE_KEY, bgTone);
    } catch (e) {
      console.error(e);
    }
  }, [bgTone]);

  const setBackgroundTone = (toneId) => {
    setBgTone(toneId);
    const toneObj = BG_TONES.find(b => b.id === toneId);
    showToast(
      lang === 'ar'
        ? `تم تفعيل لون الخلفية: ${toneObj?.name || toneId}`
        : `Background updated to: ${toneObj?.name || toneId}`
    );
  };

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.profile?.shortName === 'KMA' && !JSON.stringify(parsed).includes('Awad')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  // Client-side Event Bookings submitted by visitors
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKINGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading bookings from localStorage', e);
    }
    return [
      {
        id: 'book-1',
        name: 'Sarah & Omar',
        phone: '+20 101 234 5678',
        email: 'sarah.omar@gmail.com',
        eventType: 'wedding',
        eventDate: '2026-10-15',
        location: 'Four Seasons Nile Plaza • Cairo',
        message: 'We are planning a full royal wedding and would love to have KMA cover our special day with 4K cameras, drone sweeps, and a same-day edit.',
        createdAt: '2026-09-14T18:20:00.000Z',
        status: 'new'
      },
      {
        id: 'book-2',
        name: 'Nour & Karim',
        phone: '+20 112 987 6543',
        email: 'nour.karim@yahoo.com',
        eventType: 'destination',
        eventDate: '2026-11-20',
        location: 'El Gouna Red Sea',
        message: 'Beachfront destination wedding ceremony and sunset photography session for our intimate gathering.',
        createdAt: '2026-09-15T09:45:00.000Z',
        status: 'confirmed'
      }
    ];
  });

  // Save bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Error saving bookings to localStorage', e);
    }
  }, [bookings]);

  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const deleteBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  // Dispatch live email to KMA inbox via free Web3Forms API
  const sendBookingEmail = async (bookingData) => {
    const accessKey = data.profile?.web3formsKey?.trim();
    const destinationEmail = data.profile?.notificationEmail?.trim() || data.profile?.email || 'contact@kmawedding.com';

    if (accessKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `New Event Booking: ${bookingData.name} - KMA Production`,
            from_name: `KMA Booking System (${bookingData.name})`,
            to_email: destinationEmail,
            client_name: bookingData.name,
            client_phone: bookingData.phone,
            client_email: bookingData.email,
            event_type: bookingData.eventType,
            event_date: bookingData.eventDate || 'Not specified',
            event_location: bookingData.location || 'Not specified',
            client_message: bookingData.message
          })
        });
        const result = await response.json();
        return { success: result.success, message: result.message };
      } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err.message };
      }
    }
    return { success: true, isLocalOnly: true };
  };

  // Test live email delivery
  const sendTestEmail = async () => {
    const accessKey = data.profile?.web3formsKey?.trim();
    const destinationEmail = data.profile?.notificationEmail?.trim() || data.profile?.email || 'contact@kmawedding.com';

    if (!accessKey) {
      showToast(
        lang === 'ar'
          ? 'يرجى كتابة Web3Forms Access Key أولاً لإرسال إيميل حقيقي.'
          : 'Please enter your Web3Forms Access Key first to send live test emails.',
        'error'
      );
      return false;
    }

    try {
      showToast(lang === 'ar' ? 'جارٍ إرسال رسالة تجريبية للإيميل...' : 'Sending test email...', 'info');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'KMA Wedding Production - Test Email Notification',
          from_name: 'KMA System Check',
          to_email: destinationEmail,
          status: 'SUCCESSFUL_SETUP',
          message: 'Congratulations! Your free KMA email notification system is configured and working perfectly.'
        })
      });
      const result = await response.json();
      if (result.success) {
        showToast(
          lang === 'ar'
            ? `وصلت الرسالة التجريبية بنجاح إلى ${destinationEmail}!`
            : `Test email sent successfully to ${destinationEmail}!`,
          'success'
        );
        return true;
      } else {
        showToast(result.message || 'Failed to send test email', 'error');
        return false;
      }
    } catch (err) {
      showToast('Connection error: ' + err.message, 'error');
      return false;
    }
  };

  // Current view: 'portfolio' or 'admin'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'portfolio';
  });

  // Active certificate modal for full-screen inspection
  const [activeModalCert, setActiveModalCert] = useState(null);

  // Active project/deal modal for full-screen inspection
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Certificate currently being edited in the admin panel
  const [editingCertId, setEditingCertId] = useState(null);

  // Toast system
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // Keep HTML lang & dir attribute in sync
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch (e) {
      console.error(e);
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const setLanguage = (newLang) => {
    if (newLang === 'ar' || newLang === 'en') {
      setLang(newLang);
    }
  };

  // Helper function to extract translated text
  const t = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      return val[lang] || val.ar || val.en || '';
    }
    return String(val);
  };

  // Synchronize hash with view
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('portfolio');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

  // Profile methods
  const updateProfile = (profileUpdates) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileUpdates
      }
    }));
    showToast(lang === 'ar' ? 'تم تحديث بيانات الشركة بنجاح!' : 'Studio & Brand profile updated successfully!');
  };

  const updateStats = (newStats) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        stats: newStats
      }
    }));
    showToast(lang === 'ar' ? 'تم تحديث الإحصائيات بنجاح' : 'Key statistics updated successfully');
  };

  // Certificate / Permit methods
  const addCertificate = (newCert) => {
    const certWithId = {
      ...newCert,
      id: newCert.id || `cert-${Date.now()}`
    };
    setData((prev) => ({
      ...prev,
      certificates: [certWithId, ...prev.certificates]
    }));
    showToast(lang === 'ar' ? 'تمت إضافة الاعتماد الرسمي بنجاح' : 'Official permit / accreditation added successfully');
    return certWithId;
  };

  const updateCertificate = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((cert) =>
        cert.id === id ? { ...cert, ...updatedFields } : cert
      )
    }));
    showToast(lang === 'ar' ? 'تم حفظ الاعتماد بنجاح' : 'Accreditation saved successfully');
  };

  const deleteCertificate = (id) => {
    setData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c.id !== id)
    }));
    if (editingCertId === id) {
      setEditingCertId(null);
    }
    showToast(lang === 'ar' ? 'تم حذف الاعتماد' : 'Accreditation removed', 'info');
  };

  const refreshCertificates = () => {
    setData((prev) => ({
      ...prev,
      certificates: [...prev.certificates]
    }));
    showToast(lang === 'ar' ? 'تم تحديث قائمة الاعتمادات' : 'Accreditations refreshed successfully');
  };

  // Project methods
  const addProject = (newProject) => {
    const projectWithId = {
      ...newProject,
      id: newProject.id || `proj-${Date.now()}`
    };
    setData((prev) => ({
      ...prev,
      projects: [projectWithId, ...prev.projects]
    }));
    showToast(lang === 'ar' ? 'تمت إضافة العمل/الفيلم بنجاح' : 'Film / Project added successfully');
    return projectWithId;
  };

  const updateProject = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updatedFields } : proj
      )
    }));
    showToast(lang === 'ar' ? 'تم حفظ تفاصيل الفيلم بنجاح' : 'Film details updated successfully');
  };

  const deleteProject = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
    showToast(lang === 'ar' ? 'تم حذف الفيلم' : 'Film removed', 'info');
  };

  // Services (Practice Areas) CRUD
  const addService = (newService) => {
    const serviceWithId = {
      ...newService,
      id: newService.id || `service-${Date.now()}`
    };
    setData((prev) => ({
      ...prev,
      practiceAreas: [...(prev.practiceAreas || []), serviceWithId]
    }));
    showToast(lang === 'ar' ? 'تمت إضافة باقة الخدمة بنجاح' : 'Service package added successfully');
    return serviceWithId;
  };

  const updateService = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      practiceAreas: (prev.practiceAreas || []).map((s) =>
        s.id === id ? { ...s, ...updatedFields } : s
      )
    }));
    showToast(lang === 'ar' ? 'تم حفظ باقة الخدمة بنجاح' : 'Service package updated successfully');
  };

  const deleteService = (id) => {
    setData((prev) => ({
      ...prev,
      practiceAreas: (prev.practiceAreas || []).filter((s) => s.id !== id)
    }));
    showToast(lang === 'ar' ? 'تم حذف باقة الخدمة' : 'Service package removed', 'info');
  };

  // Milestones CRUD
  const addMilestone = (newMilestone) => {
    setData((prev) => ({
      ...prev,
      milestones: [newMilestone, ...(prev.milestones || [])]
    }));
    showToast(lang === 'ar' ? 'تمت إضافة المحطة التاريخية' : 'Milestone added successfully');
  };

  const updateMilestone = (index, updatedFields) => {
    setData((prev) => {
      const list = [...(prev.milestones || [])];
      if (list[index]) {
        list[index] = { ...list[index], ...updatedFields };
      }
      return { ...prev, milestones: list };
    });
    showToast(lang === 'ar' ? 'تم حفظ محطة النجاح' : 'Milestone updated successfully');
  };

  const deleteMilestone = (index) => {
    setData((prev) => ({
      ...prev,
      milestones: (prev.milestones || []).filter((_, i) => i !== index)
    }));
    showToast(lang === 'ar' ? 'تم حذف المحطة' : 'Milestone removed', 'info');
  };

  // Skills update
  const updateSkills = (newSkills) => {
    setData((prev) => ({
      ...prev,
      skills: newSkills
    }));
    showToast(lang === 'ar' ? 'تم تحديث المعدات والمهارات' : 'Gear & Capabilities updated successfully');
  };

  // Reset to default
  const resetToDefault = () => {
    const confirmMsg =
      lang === 'ar'
        ? 'هل أنت متأكد من استعادة البيانات الافتراضية لشركة KMA؟'
        : 'Are you sure you want to reset all data to KMA defaults?';
    if (window.confirm(confirmMsg)) {
      setData(DEFAULT_PORTFOLIO_DATA);
      localStorage.removeItem(STORAGE_KEY);
      showToast(lang === 'ar' ? 'تمت استعادة البيانات الافتراضية' : 'Restored default KMA data!', 'info');
    }
  };

  // Export JSON backup file
  const exportDataJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `kma_wedding_media_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(lang === 'ar' ? 'تم تصدير نسخة احتياطية من البيانات' : 'KMA complete data exported successfully!');
    } catch (e) {
      console.error(e);
      showToast(lang === 'ar' ? 'فشل التصدير' : 'Failed to export backup.', 'error');
    }
  };

  // Import JSON backup file
  const importDataJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.profile && (parsed.certificates || parsed.projects)) {
          setData(parsed);
          showToast(lang === 'ar' ? 'تم استيراد البيانات بنجاح' : 'Data imported from JSON successfully!');
        } else {
          showToast(lang === 'ar' ? 'ملف غير صالح' : 'Invalid backup file structure.', 'error');
        }
      } catch (err) {
        showToast(lang === 'ar' ? 'خطأ في قراءة الملف' : 'Error reading JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        lang,
        setLanguage,
        toggleLanguage,
        t,
        currentView,
        navigateTo,
        activeModalCert,
        setActiveModalCert,
        activeModalProject,
        setActiveModalProject,
        editingCertId,
        setEditingCertId,
        toast,
        showToast,
        // Theme & Background
        currentTheme,
        setTheme,
        THEME_PRESETS,
        bgTone,
        setBackgroundTone,
        BG_TONES,
        // Admin Security
        adminPasscode,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminPasscode,
        // Email & Notification
        sendBookingEmail,
        sendTestEmail,
        // Profile & Stats
        updateProfile,
        updateStats,
        // Certificates
        addCertificate,
        updateCertificate,
        deleteCertificate,
        refreshCertificates,
        // Projects
        addProject,
        updateProject,
        deleteProject,
        // Services
        addService,
        updateService,
        deleteService,
        // Milestones
        addMilestone,
        updateMilestone,
        deleteMilestone,
        // Skills
        updateSkills,
        // Backup
        resetToDefault,
        exportDataJSON,
        importDataJSON,
        // Bookings
        bookings,
        addBooking,
        deleteBooking,
        updateBookingStatus
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
