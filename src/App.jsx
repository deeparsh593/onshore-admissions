import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  GraduationCap, Globe, FileText, CheckCircle2, Clock, Download,
  Upload, Mail, Briefcase, Building2, UserCheck, ShieldCheck,
  Search, ChevronRight, ArrowRight, Plus, LogOut, User, MapPin,
  DollarSign, Calendar, Send, Menu, X, Sparkles, Lock, Eye, EyeOff
} from 'lucide-react';
import { UNIVERSITIES_DATA } from './universitiesData';

const SUPABASE_URL = 'https://girvhzxxzmcggrbwqiaw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscnZoenh4em1jZ3FuYndxbGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1ODk5NjMsImV4cCI6MjExMTE2NTk2M30.Ilr1LRqLh7embIeeSc9Ag9vj014KaVp8eZqzX4WubGs';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_PASSCODE = 'Ashu1122@@';
const ADMIN_SESSION_KEY = 'onshore_admin_unlocked_v1';
const ACTIVE_PAGE_KEY = 'onshore_active_page_v1';
const SESSION_STORAGE_KEY = 'onshore_student_session_v1';
const BACKUP_APPS_KEY = 'onshore_backup_apps_v1';
const CUSTOM_INST_KEY = 'onshore_custom_institutions_v1';
 const INITIAL_BLOGS = [ 
   {
    id: 'b1',
    title: 'Canada DLI Change & Study Permit Extension Rules (2026–2027 Guide)',
    category: 'Canada Onshore',
    date: 'Nov 18, 2026',
    readTime: '5 min read',
    excerpt: 'Everything international students inside Canada need to know before switching colleges, applying for a new PAL, or extending their study permit.',
    content: 'Changing your Designated Learning Institution (DLI) in Canada requires careful compliance with IRCC guidelines. Ensure your new program aligns with your career progression and check whether a Provincial Attestation Letter (PAL) is required.'
  },
  {
    id: 'b2',
    title: 'How to Transfer Your SEVIS I-20 in the USA Without Losing F-1 Status',
    category: 'USA Onshore',
    date: 'Nov 10, 2026',
    readTime: '6 min read',
    excerpt: 'Step-by-step timeline for requesting a SEVIS release date from your current DSO and securing an I-20 from a top US university.',
    content: 'Transferring between SEVP-certified schools in the United States requires coordinating your SEVIS record release date within 60 days of program completion. Secure your new admission letter first and submit the Transfer-In form.'
  },
  {
    id: 'b3',
    title: 'Switching Courses or Providers in Australia: Subclass 500 Visa Rules',
    category: 'Australia Onshore',
    date: 'Nov 02, 2026',
    readTime: '4 min read',
    excerpt: 'Understanding Genuine Student (GS) requirements, AQF level rules, and release letters when changing institutions in Australia.',
    content: 'If you have not completed 6 months of your principal course in Australia, you will need a formal Letter of Release from your current provider and must maintain the same or higher AQF qualification level.'
  }
];

const STATUS_STEPS = [
  'Documents Received & Verified',
  'Submitted to University Admissions',
  'Under Institutional Review',
  'Conditional Offer Issued',
  'Unconditional Offer Letter Ready'
];

export default function App() {
 const [activePage, setActivePage] = useState(() => {
  try {
    return localStorage.getItem(ACTIVE_PAGE_KEY) || 'home';
  } catch (_) {
    return 'home';
  }
});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
  try {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch (_) {
    return false;
  }
});
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', country: 'Canada' });
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [openDocStudentEmail, setOpenDocStudentEmail] = useState(null);

  const [universities, setUniversities] = useState(UNIVERSITIES_DATA);
  const [bulkJsonInput, setBulkJsonInput] = useState('');

  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [countryFilter, setCountryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [appForm, setAppForm] = useState({
    currentCountry: 'Canada',
    currentInstitution: '',
    targetUniversity: UNIVERSITIES_DATA[0].name,
    course: UNIVERSITIES_DATA[0].courses[0],
    intake: 'Jan / Spring 2027',
    passportFile: '',
    transcriptFile: '',
    visaFile: ''
  });
  const [submittingApp, setSubmittingApp] = useState(false);

  const [newBlog, setNewBlog] = useState({ title: '', category: 'Canada Onshore', excerpt: '', content: '' });
const [currentUser, setCurrentUser] = useState(null);
  const STUDENT_DOC_SLOTS = [
  { id: 'tenth', label: '10th', required: true },
  { id: 'twelfth', label: '12th', required: true },
  { id: 'last_qualification', label: 'Last qualification if any', required: false },
  { id: 'last_college_docs', label: 'Last college docs', required: true },
  { id: 'visa_copy', label: 'Visa copy', required: true },
];

const [studentDocs, setStudentDocs] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('onshore_student_docs_v1') || '{}');
  } catch (_) {
    return {};
  }
});

const handleDocUpload = (docId, label, file) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const ownerKey = currentUser?.email || 'guest_student';
    const next = {
      ...studentDocs,
      [ownerKey]: {
        ...(studentDocs[ownerKey] || {}),
        [docId]: {
          docId,
          label,
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          dataUrl: reader.result,
          updatedAt: new Date().toLocaleString(),
        },
      },
    };
    setStudentDocs(next);
    try {
      localStorage.setItem('onshore_student_docs_v1', JSON.stringify(next));
    } catch (_) {}
    showToast('Document Saved', `${label} (${file.name}) uploaded.`);
  };
  reader.readAsDataURL(file);
};

const handleDownloadDoc = (docItem) => {
  if (!docItem?.dataUrl) return;
  const link = document.createElement('a');
  link.href = docItem.dataUrl;
  link.download = docItem.fileName || `${docItem.docId}_document`;
  link.click();
};

const whatsappInquiryUrl =
  'https://wa.me/14313036515?text=' +
  encodeURIComponent(
    'Hi, I would like to inquire about admissions, college/university transfer, or study extension.'
  );
  const [toast, setToast] = useState(null);
  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email) setCurrentUser(parsed);
      }
      const customInst = JSON.parse(localStorage.getItem(CUSTOM_INST_KEY) || '[]');
      if (Array.isArray(customInst) && customInst.length > 0) {
        setUniversities([...UNIVERSITIES_DATA, ...customInst]);
      }
    } catch (_) {}
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoadingApps(true);
    let backupApps = [];
    try {
      backupApps = JSON.parse(localStorage.getItem(BACKUP_APPS_KEY) || '[]');
    } catch (_) {}

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_date', { ascending: false });

      if (!error && data) {
        const dbIds = new Set(data.map((d) => d.id));
        const merged = [...backupApps.filter((b) => !dbIds.has(b.id)), ...data];
        setApplications(merged);
      } else {
        setApplications(backupApps);
      }
    } catch (_) {
      setApplications(backupApps);
    }
    setLoadingApps(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'universities', label: 'Universities & Courses' },
    { id: 'providers', label: 'Education Providers' },
    { id: 'blogs', label: 'Blogs & Guides' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' }
  ];

  const navigate = (page) => {
  setActivePage(page);
    try {
      localStorage.setItem(ACTIVE_PAGE_KEY, page);
    } catch (_) {}
    setMobileMenuOpen(false);
    setSelectedBlog(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const cleanEmail = authForm.email.trim().toLowerCase();
    const existingApp = applications.find(
      (a) => a.student_email && a.student_email.toLowerCase() === cleanEmail
    );
    const derivedName =
      authMode === 'signup'
        ? authForm.name.trim() || cleanEmail.split('@')[0]
        : existingApp?.student_name || authForm.name.trim() || cleanEmail.split('@')[0];
    const derivedCountry =
      authMode === 'signup'
        ? authForm.country
        : existingApp?.current_country || authForm.country || 'Canada';

    const userSession = {
      id: `STU-${cleanEmail}`,
      email: cleanEmail,
      name: derivedName,
      country: derivedCountry
    };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userSession));
    } catch (_) {}
    setCurrentUser(userSession);
    setAppForm((prev) => ({ ...prev, currentCountry: derivedCountry }));
    setAuthForm({ name: '', email: '', password: '', country: 'Canada' });
    setAuthLoading(false);
    showToast(authMode === 'signup' ? 'Account Created!' : 'Login Successful', `Welcome, ${userSession.name}!`);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (_) {}
    setCurrentUser(null);
    showToast('Logged Out', 'You have been signed out of the student portal.');
  };
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmittingApp(true);
const ownerKey = currentUser?.email || 'guest_student';
const currentUserDocs = studentDocs[ownerKey] || {};
const missingMandatory = STUDENT_DOC_SLOTS.filter(
  (slot) => slot.required && !currentUserDocs[slot.id]?.fileName
);

if (missingMandatory.length > 0) {
  setSubmittingApp(false);
  showToast(
    'Mandatory Documents Required',
    `Please upload: ${missingMandatory.map((m) => m.label).join(', ')}`
  );
  return;
}
    const newApp = {
      id: `OA-${Math.floor(100000 + Math.random() * 900000)}`,
      student_name: currentUser.name,
      student_email: currentUser.email,
      current_country: appForm.currentCountry,
      current_institution: appForm.currentInstitution || 'Current Onshore Institution',
      target_university: appForm.targetUniversity,
      course: appForm.course,
      intake: appForm.intake,
      status: 'Documents Received & Verified',
      submitted_date: new Date().toISOString().split('T')[0],
      docs: [
        appForm.passportFile || 'Passport_Copy.pdf',
        appForm.transcriptFile || 'Academic_Transcripts.pdf',
        appForm.visaFile || 'Current_Study_Permit_Visa.pdf'
      ],
      offer_ready: false
    };

    try {
      const { error } = await supabase.from('applications').insert([newApp]);
      if (error) throw error;
      await fetchApplications();
      showToast('Application Submitted!', `Reference ID ${newApp.id} saved to database.`);
    } catch (_) {
      let existingBackup = [];
      try {
        existingBackup = JSON.parse(localStorage.getItem(BACKUP_APPS_KEY) || '[]');
      } catch (_) {}
      const backupApp = { ...newApp, _localBackup: true };
      try {
        localStorage.setItem(BACKUP_APPS_KEY, JSON.stringify([backupApp, ...existingBackup]));
      } catch (_) {}
      setApplications((prev) => [backupApp, ...prev]);
      showToast('Application Submitted!', `Reference ID ${newApp.id} saved successfully.`);
    }

    setAppForm({ ...appForm, currentInstitution: '', passportFile: '', transcriptFile: '', visaFile: '' });
    setSubmittingApp(false);
  };

  const updateApplicationStatus = async (id, newStatus) => {
    const isOfferReady =
      newStatus === 'Unconditional Offer Letter Ready' || newStatus === 'Conditional Offer Issued';
    try {
      await supabase
        .from('applications')
        .update({ status: newStatus, offer_ready: isOfferReady })
        .eq('id', id);
    } catch (_) {}

    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus, offer_ready: isOfferReady } : app))
    );
    try {
      const existingBackup = JSON.parse(localStorage.getItem(BACKUP_APPS_KEY) || '[]');
      const updatedBackup = existingBackup.map((app) =>
        app.id === id ? { ...app, status: newStatus, offer_ready: isOfferReady } : app
      );
      localStorage.setItem(BACKUP_APPS_KEY, JSON.stringify(updatedBackup));
    } catch (_) {}
    showToast('Status Updated', `Application ${id} updated to "${newStatus}".`);
  };

  const handleBulkImportInstitutions = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(bulkJsonInput);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        showToast('Invalid Format', 'Please paste a valid JSON array [ { ... } ].');
        return;
      }
      const formatted = parsed.map((item, idx) => ({
        id: item.id || `bulk-${Date.now()}-${idx}`,
        name: item.name || 'Unnamed Institution',
        type: item.type || 'University',
        country: item.country || 'Canada',
        city: item.city || 'Campus City',
        intake: item.intake || '2027 Intakes',
        tuition: item.tuition || 'Contact for Tuition',
        scholarship: item.scholarship || 'Onshore Transfer Eligible',
        eligibility: item.eligibility || 'Valid Study Permit / Visa & Official Transcripts',
        courses: Array.isArray(item.courses) && item.courses.length > 0 ? item.courses : ['General Transfer Program']
      }));

      const existingCustom = JSON.parse(localStorage.getItem(CUSTOM_INST_KEY) || '[]');
      const updatedCustom = [...existingCustom, ...formatted];
      localStorage.setItem(CUSTOM_INST_KEY, JSON.stringify(updatedCustom));
      setUniversities([...UNIVERSITIES_DATA, ...updatedCustom]);
      setBulkJsonInput('');
      showToast('Bulk Import Successful!', `${formatted.length} institutions added.`);
    } catch (_) {
      showToast('JSON Syntax Error', 'Please check commas and quotes in your JSON.');
    }
  };

  const handleDownloadOfferLetter = (app) => {
    const letterContent = `
ONSHORE ADMISSIONS - OFFICIAL OFFER SUMMARY
Reference ID: ${app.id}
Student Name: ${app.student_name}
Student Email: ${app.student_email}
Target Institution: ${app.target_university}
Course: ${app.course}
Intake: ${app.intake}
Status: ${app.status}
Support: info@theonshoreadmissions.com
    `.trim();

    const blob = new Blob([letterContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${app.id}_Offer_Letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Offer Letter Downloaded', `${app.id}_Offer_Letter.txt saved.`);
  };

  const handleAdminUnlock = (e) => {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSCODE) {
      setIsAdminUnlocked(true);
      try {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
     } catch (_) {}
      showToast('Admin Access Granted', 'Welcome to Admin Dashboard.');
   } else {
      showToast('Incorrect Password', 'Access denied.');
    }
  };

  const handlePublishBlog = (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;
    const created = {
      id: `b-${Date.now()}`,
      title: newBlog.title,
      category: newBlog.category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: '4 min read',
      excerpt: newBlog.excerpt || newBlog.content.slice(0, 130) + '...',
      content: newBlog.content
    };
    setBlogs([created, ...blogs]);
    setNewBlog({ title: '', category: 'Canada Onshore', excerpt: '', content: '' });
    showToast('Blog Published', 'Your new onshore guide is now live.');
  };

  const filteredUniversities = universities.filter((u) => {
    const matchesCountry = countryFilter === 'All' || u.country === countryFilter;
    const matchesType = typeFilter === 'All' || (u.type || 'University') === typeFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      u.name.toLowerCase().includes(q) ||
      (u.city || '').toLowerCase().includes(q) ||
      (u.eligibility || '').toLowerCase().includes(q) ||
      (u.courses || []).some((c) => c.toLowerCase().includes(q));
    return matchesCountry && matchesType && matchesQuery;
  });

  const studentApplications = currentUser
    ? applications.filter(
        (a) => a.student_email && a.student_email.toLowerCase() === currentUser.email.toLowerCase()
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">{toast.title}</p>
            <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="flex items-center gap-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-none">
                Onshore Admissions
              </span>
              <span className="text-[11px] font-medium text-blue-700 tracking-wider uppercase">
                USA • Canada • Australia
              </span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`text-sm font-medium transition ${
                  activePage === item.id ? 'text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => navigate('student-portal')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                activePage === 'student-portal'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <User className="w-4 h-4" />
              {currentUser ? 'My Portal' : 'Student Login'}
            </button>
            <button
              onClick={() => navigate('admin-portal')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                activePage === 'admin-portal'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('student-portal')}
                className="py-2.5 px-3 rounded-xl bg-blue-700 text-white text-sm font-semibold text-center"
              >
                {currentUser ? 'My Portal' : 'Student Login'}
              </button>
              <button
                onClick={() => navigate('admin-portal')}
                className="py-2.5 px-3 rounded-xl bg-slate-900 text-white text-sm font-semibold text-center"
              >
                Admin Panel
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {activePage === 'home' && (
          <div>
            <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white py-20 px-4">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Direct Onshore Admissions • {universities.length}+ Partner Institutions
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    Already Studying in the <span className="text-blue-400">USA, Canada, or Australia?</span>
                  </h1>
                  <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                    Compare {universities.length}+ partner universities and colleges, check onshore transfer eligibility, extend your study permit, and track your offer letter live.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => navigate('student-portal')}
                      className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg flex items-center gap-2 transition"
                    >
                      Apply / Student Portal <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('universities')}
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/15 transition"
                    >
                      Browse {universities.length}+ Universities & Colleges
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 space-y-4">
                    <h3 className="font-bold text-lg text-white">Why Onshore Students Choose Us</h3>
                    {[
                      { title: '100+ Universities & Colleges', desc: 'Filter institutions across Canada, USA & Australia by course, GPA, and visa rules.' },
                      { title: '100% Digital Document Portal', desc: 'Upload passport, transcripts & current visa online and track every stage live.' },
                      { title: 'Onshore Transfer Scholarships', desc: 'Access tuition waivers and fast-track onshore admission pathways.' }
                    ].map((feat, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex gap-3.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm text-white">{feat.title}</h4>
                          <p className="text-xs text-slate-300 mt-1">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Specialized Onshore Transfer Destinations</h2>
                <p className="text-slate-600 mt-2">Select your current study country to browse partner universities, colleges, and eligibility.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { country: 'Canada', tag: 'DLI Transfer & Study Extension', points: ['35+ Canadian Colleges & Universities', 'Post-Grad Diplomas, MBA & Master’s', 'PAL & Study Permit Extension Support'] },
                  { country: 'USA', tag: 'SEVIS I-20 Transfer & STEM', points: ['35+ US Universities & Colleges', 'STEM Master’s & MBA Programs', 'Smooth DSO SEVIS Record Release'] },
                  { country: 'Australia', tag: 'CoE Transfer & Subclass 500', points: ['30+ Australian Universities & Colleges', 'AQF Level Progression & Master’s', 'GS Requirement & Release Guidance'] }
                ].map((item) => (
                  <div key={item.country} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                        {item.tag}
                      </span>
                      <h3 className="text-2xl font-bold mt-4 text-slate-900">{item.country}</h3>
                      <ul className="mt-4 space-y-2.5">
                        {item.points.map((pt, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        setCountryFilter(item.country);
                        navigate('universities');
                      }}
                      className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-700 text-white text-sm font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      View {item.country} Programs <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activePage === 'universities' && (
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Partner Universities & Colleges ({filteredUniversities.length} of {universities.length})
                </h1>
                <p className="text-slate-600 mt-1">Filter by country, institution type (University/College), course, city, or GPA/eligibility.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Canada', 'USA', 'Australia'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCountryFilter(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      countryFilter === c ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex gap-2">
                {['All', 'University', 'College'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      typeFilter === t ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {t === 'All' ? 'All Types' : t}
                  </button>
                ))}
              </div>
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
                <input
                  type="text"
                  placeholder="Filter by course, university, city, or eligibility (e.g. STEM, MBA, 2.5 GPA, 60%, Release Letter)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredUniversities.map((uni) => (
                <div key={uni.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">{uni.country}</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{uni.type || 'University'}</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">{uni.scholarship}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-3">{uni.name}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {uni.city}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {uni.intake}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {uni.tuition}</span>
                    </div>

                    {uni.eligibility && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70">
                        <p className="text-[11px] font-bold uppercase text-amber-800">Onshore Transfer Eligibility</p>
                        <p className="text-xs text-slate-700 mt-0.5">{uni.eligibility}</p>
                      </div>
                    )}

                    <ul className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      {(uni.courses || []).map((course, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" /> {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setAppForm({ ...appForm, currentCountry: uni.country, targetUniversity: uni.name, course: uni.courses[0] });
                      navigate('student-portal');
                    }}
                    className="mt-6 w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition"
                  >
                    Apply to {uni.name.split(' - ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activePage === 'student-portal' && (
          <section className="max-w-6xl mx-auto px-4 py-12">
            {!currentUser ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {authMode === 'login' ? 'Student Portal Login' : 'Create Student Account'}
                  </h1>
                </div>

                <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`py-2 text-sm font-semibold rounded-lg ${authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`py-2 text-sm font-semibold rounded-lg ${authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (As per Passport)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Arshdeep Singh"
                          value={authForm.name}
                          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Current Study Country</label>
                        <select
                          value={authForm.country}
                          onChange={(e) => setAuthForm({ ...authForm, country: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                        >
                          <option value="Canada">Canada</option>
                          <option value="USA">USA</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password (Min. 6 characters)</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition"
                  >
                    {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In to Student Portal' : 'Create Account & Continue'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">Student Account</span>
                    <h1 className="text-2xl font-bold text-slate-900 mt-2">Welcome, {currentUser.name}</h1>
                    <p className="text-sm text-slate-500">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold flex items-center gap-2 self-start"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 h-fit">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-blue-700" /> Submit New Transfer Application
                    </h2>
                    <form onSubmit={handleApplicationSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Current Study Country</label>
                        <select
                          value={appForm.currentCountry}
                          onChange={(e) => setAppForm({ ...appForm, currentCountry: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                        >
                          <option value="Canada">Canada</option>
                          <option value="USA">USA</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Current College / University</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Conestoga College"
                          value={appForm.currentInstitution}
                          onChange={(e) => setAppForm({ ...appForm, currentInstitution: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Institution ({universities.length} Available)</label>
                        <select
                          value={appForm.targetUniversity}
                          onChange={(e) => {
                            const selected = universities.find((u) => u.name === e.target.value);
                            setAppForm({ ...appForm, targetUniversity: e.target.value, course: selected ? selected.courses[0] : appForm.course });
                          }}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                        >
                          {universities.map((u) => (
                            <option key={u.id} value={u.name}>{u.name} ({u.country})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Program / Course</label>
                        <input
                          type="text"
                          required
                          value={appForm.course}
                          onChange={(e) => setAppForm({ ...appForm, course: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Intake</label>
                        <select
                          value={appForm.intake}
                          onChange={(e) => setAppForm({ ...appForm, intake: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                        >
                          <option value="Jan / Spring 2027">Jan / Spring 2027</option>
                          <option value="May / Summer 2027">May / Summer 2027</option>
                          <option value="Sep / Fall 2027">Sep / Fall 2027</option>
                        </select>
                      </div>

                  <div className="pt-3 border-t border-slate-200 space-y-3">
  <div className="flex flex-wrap items-center justify-between gap-2">
    <div>
      <p className="text-xs font-bold text-slate-800">Required Documents</p>
   <p className="text-[11px] text-slate-500">
  Upload required files or click Change Document to replace an incorrect file.
</p>
    </div>
    <a
      href={whatsappInquiryUrl}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
    >
      WhatsApp (+14313036515)
    </a>
  </div>

  {STUDENT_DOC_SLOTS.map((slot) => {
    const ownerKey = currentUser?.email || 'guest_student';
    const uploaded = studentDocs[ownerKey]?.[slot.id];
    return (
      <div
        key={slot.id}
        className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/60"
      >
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-900">
            {slot.label}{' '}
            <span className="font-normal text-slate-500">
              ({slot.required ? 'Mandatory' : 'Optional'})
            </span>
          </div>
          <div className="text-[11px] text-slate-600 truncate">
            {uploaded ? `Uploaded: ${uploaded.fileName}` : 'Not uploaded yet'}
          </div>
        </div>

        <label className="shrink-0 cursor-pointer px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-semibold">
          {uploaded ? 'Change Document' : 'Upload'}
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleDocUpload(slot.id, slot.label, e.target.files?.[0])}
          />
        </label>
      </div>
    );
  })}
</div>
                      <button type="submit" disabled={submittingApp} className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm">
                        {submittingApp ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </form>
                  </div>
                  

                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-900">My Applications ({studentApplications.length})</h2>
                      <button onClick={fetchApplications} className="text-xs font-semibold text-blue-700 hover:underline">Refresh Status</button>
                    </div>

                    {loadingApps ? (
                      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-sm text-slate-500">Loading...</div>
                    ) : studentApplications.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No Applications Submitted Yet</p>
                      </div>
                    ) : (
                      studentApplications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">{app.id}</span>
                              <h3 className="text-lg font-bold text-slate-900 mt-2">{app.target_university}</h3>
                              <p className="text-sm text-slate-600">{app.course} • {app.intake}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {app.status}
                            </span>
                          </div>
                          {app.offer_ready && (
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-xs font-semibold text-emerald-700">Offer Letter Ready</span>
                              <button
                                onClick={() => handleDownloadOfferLetter(app)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
                              >
                                <Download className="w-4 h-4" /> Download Offer Letter
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {activePage === 'admin-portal' && (
          <section className="max-w-7xl mx-auto px-4 py-12">
            {!isAdminUnlocked ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Admin Panel Access</h1>
                </div>
                <form onSubmit={handleAdminUnlock} className="space-y-4">
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin Passcode"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                  <button type="submit" className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm">
                    Unlock Admin Dashboard
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl">
                  <div>
                    <h1 className="text-2xl font-bold">Onshore Admissions — Admin Dashboard</h1>
                    <p className="text-sm text-slate-300 mt-1">Manage student applications, update status, and bulk-upload institutions.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={fetchApplications} className="px-4 py-2 rounded-xl bg-white/10 text-sm font-semibold">Refresh Data</button>
                  <button onClick={() => { setIsAdminUnlocked(false); try { localStorage.removeItem(ADMIN_SESSION_KEY); } catch (_) {} }} className="px-4 py-2 rounded-xl bg-red-600 text-sm font-semibold">Lock Admin</button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="font-bold text-lg text-slate-900">All Student Applications ({applications.length})</h2>
                  </div>
                  {applications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">No applications yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                            <th className="py-3.5 px-4">Ref ID</th>
                            <th className="py-3.5 px-4">Student</th>
                            <th className="py-3.5 px-4">Target Institution</th>
                            <th className="py-3.5 px-4">Update Status</th>
                            <th className="py-3.5 px-4">Docs</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {applications.map((app) => (
                            <tr key={app.id}>
                              <td className="py-4 px-4 font-mono font-bold text-blue-700">{app.id}</td>
                              <td className="py-4 px-4">
                                <p className="font-semibold">{app.student_name}</p>
                                <p className="text-xs text-slate-500">{app.student_email}</p>
                              </td>
                              <td className="py-4 px-4">
                                <p className="font-semibold">{app.target_university}</p>
                                <p className="text-xs text-slate-500">{app.course}</p>
                              </td>
                              <td className="py-4 px-4">
                                <select
                                  value={app.status}
                                  onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                                >
                                  {STATUS_STEPS.map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-4 px-4"><button type="button" onClick={() => setOpenDocStudentEmail(openDocStudentEmail === app.student_email ? null : app.student_email)} className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs">Docs</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                {openDocStudentEmail && (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
    <div className="flex items-center justify-between gap-2">
      <h3 className="font-bold text-base text-slate-900">Student Documents: {openDocStudentEmail}</h3>
      <button type="button" onClick={() => setOpenDocStudentEmail(null)} className="px-3 py-1 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50">Close</button>
    </div>
    {(!studentDocs[openDocStudentEmail] || Object.keys(studentDocs[openDocStudentEmail]).length === 0) ? (
      <p className="text-sm text-slate-500">Is student ne abhi koi document upload nahi kiya hai.</p>
    ) : (
      <div className="space-y-2">
        {STUDENT_DOC_SLOTS.map((slot) => {
          const item = studentDocs[openDocStudentEmail]?.[slot.id];
          return (
            <div key={slot.id} className="flex flex-wrap items-center justify-between gap-2 text-sm py-2 px-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <div>
                <span className="font-medium text-slate-800">{slot.label}</span>
                <span className="text-xs text-slate-500 ml-1">({slot.required ? 'Mandatory' : 'Optional'})</span>
                <span className="text-slate-600 ml-2">{item ? item.fileName : 'Pending'}</span>
              </div>
              {item?.dataUrl && (
                <a href={item.dataUrl} download={item.fileName || `${slot.id}.pdf`} className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold">Download</a>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
)}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-700" /> Bulk Upload Universities / Colleges (JSON)
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                      Paste JSON array with name, type (University/College), country, city, eligibility, and courses.
                    </p>
                    <form onSubmit={handleBulkImportInstitutions} className="space-y-3">
                      <textarea
                        rows={5}
                        required
                        placeholder='[{"name":"New College","type":"College","country":"Canada","city":"Toronto, ON","eligibility":"Min 60%, valid Study Permit","courses":["Cloud Computing","Cybersecurity"]}]'
                        value={bulkJsonInput}
                        onChange={(e) => setBulkJsonInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                      <button type="submit" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold">
                        Import Bulk Institutions
                      </button>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-blue-700" /> Publish New Guide
                    </h2>
                    <form onSubmit={handlePublishBlog} className="space-y-3">
                      <input
                        type="text"
                        required
                        placeholder="Article Title"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                      />
                      <select
                        value={newBlog.category}
                        onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                      >
                        <option value="Canada Onshore">Canada Onshore</option>
                        <option value="USA Onshore">USA Onshore</option>
                        <option value="Australia Onshore">Australia Onshore</option>
                      </select>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write full guide content..."
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                      />
                      <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold">
                        Publish Article
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {activePage === 'providers' && (
          <section className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <Building2 className="w-4 h-4" /> Institutional Partnerships
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Partner With Onshore Admissions</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Partnership Inquiry Sent', 'We will reach out via info@theonshoreadmissions.com.');
                  e.target.reset();
                }}
                className="grid sm:grid-cols-2 gap-4"
              >
                <input required placeholder="Institution Name" className="px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                <input required placeholder="Contact Person" className="px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                <input type="email" required placeholder="Work Email" className="px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                <select className="px-4 py-3 rounded-xl border border-slate-300 text-sm">
                  <option>Canada</option>
                  <option>USA</option>
                  <option>Australia</option>
                </select>
                <textarea rows={3} placeholder="Partnership details..." className="sm:col-span-2 px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                <button type="submit" className="sm:col-span-2 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm">
                  Submit Inquiry
                </button>
              </form>
            </div>
          </section>
        )}

        {activePage === 'blogs' && (
          <section className="max-w-5xl mx-auto px-4 py-12">
            {selectedBlog ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
                <button onClick={() => setSelectedBlog(null)} className="text-sm font-semibold text-blue-700 hover:underline">
                  ← Back to All Guides
                </button>
                <h1 className="text-3xl font-bold text-slate-900">{selectedBlog.title}</h1>
                <p className="text-xs text-slate-400">{selectedBlog.date} • {selectedBlog.readTime}</p>
                <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-100">{selectedBlog.content}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div key={blog.id} className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">{blog.category}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-3">{blog.title}</h3>
                      <p className="text-sm text-slate-600 mt-2">{blog.excerpt}</p>
                    </div>
                    <button onClick={() => setSelectedBlog(blog)} className="mt-5 text-sm font-semibold text-blue-700 hover:underline flex items-center gap-1">
                      Read Full Guide <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activePage === 'careers' && (
          <section className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <Briefcase className="w-4 h-4" /> Careers
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Join Onshore Admissions</h1>
              <p className="text-sm text-slate-600">Send your CV to info@theonshoreadmissions.com for counselor and admissions coordinator roles.</p>
            </div>
          </section>
        )}

        {activePage === 'contact' && (
          <section className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
                <p className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                  <Mail className="w-4 h-4 text-blue-700" /> info@theonshoreadmissions.com
                </p>
                <p className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                  <Globe className="w-4 h-4 text-blue-700" /> www.theonshoreadmissions.com
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Message Sent!', 'We will reply soon.');
                  e.target.reset();
                }}
                className="space-y-3"
              >
                <input required placeholder="Your Name" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
                <input type="email" required placeholder="Your Email" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
                <textarea rows={3} required placeholder="Your message..." className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
                <button type="submit" className="w-full py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Inquiry
                </button>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-10 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-300 font-semibold">© 2026 Onshore Admissions. All rights reserved.</p>
          <p>Official Support: info@theonshoreadmissions.com</p>
        </div>
      </footer>
    </div>
  );
}
