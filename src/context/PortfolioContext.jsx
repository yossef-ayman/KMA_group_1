import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaultData';

const STORAGE_KEY = 'kma_wedding_media_production_en_v6';
const STORAGE_LANG_KEY = 'kma_wedding_lang_en_v4';

const STORAGE_BOOKINGS_KEY = 'kma_wedding_bookings_v1';

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
    showToast(lang === 'ar' ? 'تم تحديث بيانات الشركة بنجاح!' : 'Company information updated successfully!');
  };

  // Certificate methods
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
      id: newProject.id || `deal-${Date.now()}`
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
      showToast(lang === 'ar' ? 'تم تصدير نسخة احتياطية من البيانات' : 'KMA data exported successfully!');
    } catch (e) {
      console.error(e);
      showToast(lang === 'ar' ? 'فشل التصدير' : 'Failed to export backup.', 'error');
    }
  };

  const updateSkills = (newSkills) => {
    setData((prev) => ({
      ...prev,
      skills: newSkills
    }));
    showToast(lang === 'ar' ? 'تم تحديث المهارات' : 'Skills updated!');
  };

  const updateExperience = (newExp) => {
    setData((prev) => ({
      ...prev,
      experience: newExp
    }));
    showToast(lang === 'ar' ? 'تم تحديث الخبرات' : 'Experience updated!');
  };

  // Import JSON backup file
  const importDataJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.profile && parsed.certificates) {
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
        updateProfile,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        refreshCertificates,
        addProject,
        updateProject,
        deleteProject,
        updateSkills,
        updateExperience,
        resetToDefault,
        exportDataJSON,
        importDataJSON,
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
