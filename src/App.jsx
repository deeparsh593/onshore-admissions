import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  GraduationCap, Globe, FileText, CheckCircle2, Clock, Download,
  Upload, Mail, Briefcase, Building2, UserCheck, ShieldCheck,
  Search, ChevronRight, ArrowRight, Plus, LogOut, User, MapPin,
  DollarSign, Calendar, Send, Menu, X, Sparkles, Lock, Eye, EyeOff
} from 'lucide-react';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://girvhzxxzmcggrbwqiaw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RNnAPbFgYlNJ8rv_V4KpCg_sFXf7eHq';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// --- ADMIN PASSWORD (Aap ise kabhi bhi badal sakte hain) ---
const ADMIN_PASSCODE = 'Admin@2026';

const INITIAL_UNIVERSITIES = [
  {
    id: 'u1',
    name: 'University of Toronto - School of Continuing Studies',
    country: 'Canada',
    city: 'Toronto, ON',
    intake: 'Jan / May / Sep 2027',
    tuition: 'CAD $18,500 / yr',
    scholarship: 'Up to CAD $3,000 Onshore Grant',
    courses: ['Post-Graduate Certificate in Project Management', 'Data Analytics & Business Intelligence', 'Global Supply Chain Management']
  },
  {
    id: 'u2',
    name: 'Northeastern University - College of Professional Studies',
    country: 'USA',
    city: 'Boston, MA / Seattle, WA',
    intake: 'Spring / Fall 2027',
    tuition: 'USD $24,000 / yr',
    scholarship: '20% Transfer Credit Waiver',
    courses: ['MS in Project Management (STEM)', 'MS in Applied Machine Intelligence', 'MPS in Informatics']
  },
  {
    id: 'u3',
    name: 'University of Technology Sydney (UTS)',
    country: 'Australia',
    city: 'Sydney, NSW',
    intake: 'Feb / July 2027',
    tuition: 'AUD $34,000 / yr',
    scholarship: '25% Onshore Academic Excellence Scholarship',
    courses: ['Master of Information Technology', 'Master of Business Analytics', 'Graduate Diploma in Engineering Management']
  },
  {
    id: 'u4',
    name: 'Seneca Polytechnic',
    country: 'Canada',
    city: 'North York, ON',
    intake: 'Jan / May / Sep 2027',
    tuition: 'CAD $16,200 / yr',
    scholarship: 'Fast-Track DLI Transfer Waiver',
    courses: ['Cybersecurity & Threat Management', 'Cloud Architecture & Administration', 'Financial Technology (FinTech)']
  },
  {
    id: 'u5',
    name: 'Arizona State University (ASU)',
    country: 'USA',
    city: 'Tempe, AZ',
    intake: 'Spring / Fall 2027',
    tuition: 'USD $27,500 / yr',
    scholarship: 'Up to USD $5,000 Transfer Award',
    courses: ['MS in Computer Science', 'MS in Business Analytics', 'Master of Engineering Management']
  },
  {
    id: 'u6',
    name: 'RMIT University',
    country: 'Australia',
    city: 'Melbourne, VIC',
    intake: 'Feb / July 2027',
    tuition: 'AUD $32,800 / yr',
    scholarship: '20% Onshore International Bursary',
    courses: ['Master of Data Science', 'Master of Supply Chain & Logistics', 'Master of International Business']
  }
];

const INITIAL_BLOGS = [
  {
    id: 'b1',
    title: 'Canada DLI Change & Study Permit Extension Rules (2026–2027 Guide)',
    category: 'Canada Onshore',
    date: 'Nov 18, 2026',
    readTime: '5 min read',
    excerpt: 'Everything international students inside Canada need to know before switching colleges, applying for a new PAL, or extending their study permit.',
    content: 'Changing your Designated Learning Institution (DLI) in Canada now requires careful compliance with IRCC guidelines. Before transferring, ensure your new program aligns with your career progression and check whether a Provincial Attestation Letter (PAL) is required for your level of study. Always maintain full-time enrollment during the transition.'
  },
  {
    id: 'b2',
    title: 'How to Transfer Your SEVIS I-20 in the USA Without Losing F-1 Status',
    category: 'USA Onshore',
    date: 'Nov 10, 2026',
    readTime: '6 min read',
    excerpt: 'Step-by-step timeline for requesting a SEVIS release date from your current DSO and securing an I-20 from a top US university.',
    content: 'Transferring between SEVP-certified schools in the United States requires coordinating your SEVIS record release date within 60 days of program completion (or while in valid status). Secure your new admission letter first, submit the Transfer-In form, and ensure classes start within 5 months of your release date.'
  },
  {
    id: 'b3',
    title: 'Switching Courses or Providers in Australia: Subclass 500 Visa Rules',
    category: 'Australia Onshore',
    date: 'Nov 02, 2026',
    readTime: '4 min read',
    excerpt: 'Understanding Genuine Student (GS) requirements, AQF level rules, and release letters when changing institutions in Australia.',
    content: 'If you have not completed 6 months of your principal course in Australia, you will need a formal Letter of Release from your current provider. Additionally, under Subclass 500 rules, you must maintain the same or higher AQF qualification level unless you apply for a new Student Visa.'
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
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', country: 'Canada' });
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin Auth States
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Data States
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Filters
  const [countryFilter, setCountryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Application Form State
  const [appForm, setAppForm] = useState({
    currentCountry: 'Canada',
    currentInstitution: '',
    targetUniversity: INITIAL_UNIVERSITIES[0].name,
    course: INITIAL_UNIVERSITIES[0].courses[0],
    intake: 'Jan / Spring 2027',
    passportFile: '',
    transcriptFile: '',
    visaFile: ''
  });
  const [submittingApp, setSubmittingApp] = useState(false);

  // Blog Admin Form
  const [newBlog, setNewBlog] = useState({ title: '', category: 'Canada Onshore', excerpt: '', content: '' });

  // Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Check active Supabase session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          country: session.user.user_metadata?.country || 'Canada'
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          country: session.user.user_metadata?.country || 'Canada'
        });
      } else {
        setCurrentUser(null);
      }
    });

    fetchApplications();
    return () => subscription.unsubscribe();
  }, []);

  // Fetch all applications from Supabase
  const fetchApplications = async () => {
    setLoadingApps(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('submitted_date', { ascending: false });

    if (!error && data) {
      setApplications(data);
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
    setMobileMenuOpen(false);
    setSelectedBlog(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- REAL SUPABASE AUTH HANDLER ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authForm.email.trim(),
          password: authForm.password,
          options: {
            data: {
              full_name: authForm.name.trim(),
              country: authForm.country
            }
          }
        });

        if (error) throw error;

        if (data?.user) {
          showToast('Account Created!', `Welcome to Onshore Admissions, ${authForm.name}!`);
          setAuthForm({ name: '', email: '', password: '', country: 'Canada' });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authForm.email.trim(),
          password: authForm.password
        });

        if (error) throw error;

        if (data?.user) {
          showToast('Login Successful', `Welcome back, ${data.user.user_metadata?.full_name || data.user.email}!`);
          setAuthForm({ name: '', email: '', password: '', country: 'Canada' });
        }
      }
    } catch (err) {
      showToast('Authentication Error', err.message || 'Please check your email and password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    showToast('Logged Out', 'You have been securely signed out.');
  };

  // --- SUBMIT APPLICATION TO SUPABASE ---
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmittingApp(true);

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

    const { error } = await supabase.from('applications').insert([newApp]);

    if (error) {
      showToast('Submission Failed', error.message);
    } else {
      await fetchApplications();
      showToast('Application Submitted!', `Reference ID ${newApp.id} saved permanently.`);
      setAppForm({
        ...appForm,
        currentInstitution: '',
        passportFile: '',
        transcriptFile: '',
        visaFile: ''
      });
    }
    setSubmittingApp(false);
  };

  // --- ADMIN UPDATE STATUS IN SUPABASE ---
  const updateApplicationStatus = async (id, newStatus) => {
    const isOfferReady = newStatus === 'Unconditional Offer Letter Ready' || newStatus === 'Conditional Offer Issued';

    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus, offer_ready: isOfferReady })
      .eq('id', id);

    if (error) {
      showToast('Update Error', error.message);
    } else {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus, offer_ready: isOfferReady } : app))
      );
      showToast('Status Updated', `Application ${id} updated to "${newStatus}".`);
    }
  };

  const handleDownloadOfferLetter = (app) => {
    const letterContent = `
====================================================================
                  ONSHORE ADMISSIONS — OFFICIAL OFFER SUMMARY
====================================================================
Reference ID:        ${app.id}
Date Issued:         ${new Date().toLocaleDateString()}
Student Name:        ${app.student_name}
Student Email:       ${app.student_email}
Current Location:    ${app.current_country} (${app.current_institution})

ADMISSION DETAILS:
Target Institution:  ${app.target_university}
Program / Course:    ${app.course}
Commencement Intake: ${app.intake}
Application Status:  ${app.status}

Congratulations! Your onshore transfer/extension application has been
approved. Please contact info@theonshoreadmissions.com for enrollment
confirmation and COE / I-20 / LOA issuance steps.
====================================================================
    `.trim();

    const blob = new Blob([letterContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${app.id}_Offer_Letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Offer Letter Downloaded', `${app.id}_Offer_Letter.txt saved to your device.`);
  };

  const handleAdminUnlock = (e) => {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSCODE) {
      setIsAdminUnlocked(true);
      setAdminPasswordInput('');
      showToast('Admin Access Granted', 'Welcome to the Onshore Admissions Admin Dashboard.');
    } else {
      showToast('Incorrect Password', 'Please enter the valid Admin Passcode.');
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

  const filteredUniversities = INITIAL_UNIVERSITIES.filter((u) => {
    const matchesCountry = countryFilter === 'All' || u.country === countryFilter;
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.courses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCountry && matchesQuery;
  });

  const studentApplications = currentUser
    ? applications.filter((a) => a.student_email?.toLowerCase() === currentUser.email?.toLowerCase())
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">{toast.title}</p>
            <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
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

          {/* Desktop Nav */}
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

          {/* Portal Buttons */}
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

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* 1. HOME PAGE */}
        {activePage === 'home' && (
          <div>
            <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white py-20 px-4">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Direct Onshore Admissions & Institution Transfers
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    Already Studying in the <span className="text-blue-400">USA, Canada, or Australia?</span>
                  </h1>
                  <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                    Seamlessly change your university or college, extend your study permit, or progress to a Master’s/Post-Grad program—with zero service fees and real-time application tracking.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => navigate('student-portal')}
                      className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
                    >
                      Apply / Student Portal <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('universities')}
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/15 transition"
                    >
                      Explore Universities
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 space-y-4">
                    <h3 className="font-bold text-lg text-white">Why Onshore Students Choose Us</h3>
                    {[
                      { title: 'Fast-Track Offer Letters', desc: 'Priority institutional processing for onshore DLI, SEVIS I-20 & CoE transfers.' },
                      { title: '100% Digital Document Portal', desc: 'Upload passport, transcripts & current visa online and track every stage live.' },
                      { title: 'Onshore Transfer Scholarships', desc: 'Access exclusive tuition waivers up to 25% for onshore international students.' }
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

            {/* Countries Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Specialized Onshore Transfer Destinations</h2>
                <p className="text-slate-600 mt-2">Select your current study country to browse partner universities and transfer pathways.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    country: 'Canada',
                    tag: 'DLI Transfer & Study Extension',
                    points: ['Post-Grad Diplomas & Master’s', 'PAL & Study Permit Extension Support', 'Toronto, Vancouver, Calgary & More']
                  },
                  {
                    country: 'USA',
                    tag: 'SEVIS I-20 Transfer & Day-1/STEM',
                    points: ['STEM Master’s & MBA Programs', 'Smooth DSO SEVIS Record Release', 'Boston, Seattle, Texas & California']
                  },
                  {
                    country: 'Australia',
                    tag: 'CoE Transfer & Subclass 500',
                    points: ['AQF Level Progression & Master’s', 'GS Requirement & Release Guidance', 'Sydney, Melbourne, Brisbane & Perth']
                  }
                ].map((item) => (
                  <div key={item.country} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
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

        {/* 2. UNIVERSITIES & COURSES */}
        {activePage === 'universities' && (
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Partner Universities & Onshore Programs</h1>
                <p className="text-slate-600 mt-1">Filter by country or search courses available for immediate onshore transfer.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Canada', 'USA', 'Australia'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCountryFilter(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      countryFilter === c
                        ? 'bg-blue-700 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mb-8">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search university, city, or course (e.g. Project Management, Data Science, STEM)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredUniversities.map((uni) => (
                <div key={uni.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                        {uni.country}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                        {uni.scholarship}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-3">{uni.name}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {uni.city}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {uni.intake}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {uni.tuition}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Available Onshore Courses</p>
                      <ul className="space-y-1.5">
                        {uni.courses.map((course, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAppForm({
                        ...appForm,
                        currentCountry: uni.country,
                        targetUniversity: uni.name,
                        course: uni.courses[0]
                      });
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

        {/* 3. STUDENT PORTAL (REAL SUPABASE AUTH + DATABASE) */}
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
                  <p className="text-sm text-slate-500 mt-1">
                    {authMode === 'login'
                      ? 'Sign in to submit documents, track status & download offer letters.'
                      : 'Register in 30 seconds to start your onshore transfer application.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`py-2 text-sm font-semibold rounded-lg transition ${
                      authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`py-2 text-sm font-semibold rounded-lg transition ${
                      authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
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
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Current Study Country</label>
                        <select
                          value={authForm.country}
                          onChange={(e) => setAuthForm({ ...authForm, country: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold text-sm transition shadow-md"
                  >
                    {authLoading
                      ? 'Please wait...'
                      : authMode === 'login'
                      ? 'Sign In to Student Portal'
                      : 'Create Account & Continue'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Student Header */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      Verified Onshore Student Account
                    </span>
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
                  {/* New Application Form */}
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Current College / University Name</label>
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Institution</label>
                        <select
                          value={appForm.targetUniversity}
                          onChange={(e) => {
                            const selected = INITIAL_UNIVERSITIES.find((u) => u.name === e.target.value);
                            setAppForm({
                              ...appForm,
                              targetUniversity: e.target.value,
                              course: selected ? selected.courses[0] : appForm.course
                            });
                          }}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                        >
                          {INITIAL_UNIVERSITIES.map((u) => (
                            <option key={u.id} value={u.name}>
                              {u.name} ({u.country})
                            </option>
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

                      <div className="pt-2 border-t border-slate-100 space-y-3">
                        <p className="text-xs font-bold text-slate-700">Upload Required Documents (PDF / JPG)</p>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">1. Valid Passport Copy</label>
                          <input
                            type="file"
                            required
                            onChange={(e) =>
                              setAppForm({ ...appForm, passportFile: e.target.files[0]?.name || 'Passport.pdf' })
                            }
                            className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">2. Academic Transcripts / Marksheets</label>
                          <input
                            type="file"
                            required
                            onChange={(e) =>
                              setAppForm({ ...appForm, transcriptFile: e.target.files[0]?.name || 'Transcripts.pdf' })
                            }
                            className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">3. Current Study Permit / I-20 / CoE</label>
                          <input
                            type="file"
                            required
                            onChange={(e) =>
                              setAppForm({ ...appForm, visaFile: e.target.files[0]?.name || 'Study_Permit.pdf' })
                            }
                            className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingApp}
                        className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold text-sm transition"
                      >
                        {submittingApp ? 'Submitting Application...' : 'Submit Application'}
                      </button>
                    </form>
                  </div>

                  {/* Student Applications List */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-900">
                        My Applications ({studentApplications.length})
                      </h2>
                      <button
                        onClick={fetchApplications}
                        className="text-xs font-semibold text-blue-700 hover:underline"
                      >
                        Refresh Status
                      </button>
                    </div>

                    {loadingApps ? (
                      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-sm text-slate-500">
                        Loading your applications...
                      </div>
                    ) : studentApplications.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No Applications Submitted Yet</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Fill out the form on the left to submit your first onshore transfer or extension application.
                        </p>
                      </div>
                    ) : (
                      studentApplications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                                {app.id}
                              </span>
                              <h3 className="text-lg font-bold text-slate-900 mt-2">{app.target_university}</h3>
                              <p className="text-sm text-slate-600">{app.course} • {app.intake}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {app.status}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 flex flex-wrap gap-2">
                            <span className="font-semibold text-slate-700">Uploaded Docs:</span>
                            {(app.docs || []).map((doc, idx) => (
                              <span key={idx} className="bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-700">
                                {doc}
                              </span>
                            ))}
                          </div>

                          {app.offer_ready ? (
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" /> Official Offer Letter Ready!
                              </span>
                              <button
                                onClick={() => handleDownloadOfferLetter(app)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
                              >
                                <Download className="w-4 h-4" /> Download Offer Letter
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                              Our admissions team is reviewing your file. Your offer letter download button will unlock automatically once approved.
                            </p>
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

        {/* 4. ADMIN PANEL (PASSWORD LOCKED + LIVE DATABASE CONTROL) */}
        {activePage === 'admin-portal' && (
          <section className="max-w-7xl mx-auto px-4 py-12">
            {!isAdminUnlocked ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Admin Panel Access</h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Enter your Admin Passcode to manage student applications and issue offer letters.
                  </p>
                </div>

                <form onSubmit={handleAdminUnlock} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Passcode</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter Admin@2026"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition"
                  >
                    Unlock Admin Dashboard
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl">
                  <div>
                    <h1 className="text-2xl font-bold">Onshore Admissions — Admin Dashboard</h1>
                    <p className="text-sm text-slate-300 mt-1">
                      Manage all student applications, verify documents, and release offer letters in real time.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={fetchApplications}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold"
                    >
                      Refresh Data
                    </button>
                    <button
                      onClick={() => setIsAdminUnlocked(false)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-semibold"
                    >
                      Lock Admin
                    </button>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-900">
                      All Student Applications ({applications.length})
                    </h2>
                  </div>

                  {applications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No applications in database yet. Once a student submits an application, it will appear here immediately.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                            <th className="py-3.5 px-4">Ref ID & Date</th>
                            <th className="py-3.5 px-4">Student Details</th>
                            <th className="py-3.5 px-4">Target Institution & Course</th>
                            <th className="py-3.5 px-4">Documents</th>
                            <th className="py-3.5 px-4">Update Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/70">
                              <td className="py-4 px-4 align-top">
                                <span className="font-mono font-bold text-blue-700 block">{app.id}</span>
                                <span className="text-xs text-slate-400">{app.submitted_date}</span>
                              </td>
                              <td className="py-4 px-4 align-top">
                                <p className="font-semibold text-slate-900">{app.student_name}</p>
                                <p className="text-xs text-slate-500">{app.student_email}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                  From: {app.current_institution} ({app.current_country})
                                </p>
                              </td>
                              <td className="py-4 px-4 align-top">
                                <p className="font-semibold text-slate-900">{app.target_university}</p>
                                <p className="text-xs text-slate-600">{app.course}</p>
                                <span className="inline-block mt-1 text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                                  {app.intake}
                                </span>
                              </td>
                              <td className="py-4 px-4 align-top">
                                <div className="space-y-1">
                                  {(app.docs || []).map((d, i) => (
                                    <span key={i} className="block text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-fit">
                                      {d}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 px-4 align-top">
                                <select
                                  value={app.status}
                                  onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-600"
                                >
                                  {STATUS_STEPS.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Publish Blog Post */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-2xl">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-700" /> Publish New Onshore Visa / Admission Guide
                  </h2>
                  <form onSubmit={handlePublishBlog} className="space-y-4">
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
                      rows={4}
                      required
                      placeholder="Write full guide content..."
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold"
                    >
                      Publish Article
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 5. EDUCATION PROVIDERS (B2B) */}
        {activePage === 'providers' && (
          <section className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <Building2 className="w-4 h-4" /> Institutional & B2B Recruitment Partnerships
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Partner With Onshore Admissions</h1>
              <p className="text-slate-600 leading-relaxed">
                We connect accredited universities, polytechnics, and colleges in the USA, Canada, and Australia with verified onshore international students seeking program progression, credit transfers, and study extensions.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Partnership Inquiry Sent', 'Our B2B team will contact you via info@theonshoreadmissions.com.');
                  e.target.reset();
                }}
                className="grid sm:grid-cols-2 gap-4 pt-2"
              >
                <input required placeholder="Institution / Organization Name" className="px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                <input required placeholder="Contact Person & Title" className="px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                <input type="email" required placeholder="Official Work Email" className="px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                <select className="px-4 py-3 rounded-xl border border-slate-300 text-sm">
                  <option>Canada</option>
                  <option>USA</option>
                  <option>Australia</option>
                </select>
                <textarea rows={3} placeholder="Tell us about your onshore intake capacity and commission structure..." className="sm:col-span-2 px-4 py-3 rounded-xl border border-slate-300 text-sm" />
                <button type="submit" className="sm:col-span-2 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm">
                  Request Recruitment Agreement
                </button>
              </form>
            </div>
          </section>
        )}

        {/* 6. BLOGS & GUIDES */}
        {activePage === 'blogs' && (
          <section className="max-w-5xl mx-auto px-4 py-12">
            {selectedBlog ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
                <button onClick={() => setSelectedBlog(null)} className="text-sm font-semibold text-blue-700 hover:underline">
                  ← Back to All Guides
                </button>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  {selectedBlog.category}
                </span>
                <h1 className="text-3xl font-bold text-slate-900">{selectedBlog.title}</h1>
                <p className="text-xs text-slate-400">{selectedBlog.date} • {selectedBlog.readTime}</p>
                <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-100 whitespace-pre-line">
                  {selectedBlog.content}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Onshore Student Guides & Visa Updates</h1>
                <p className="text-slate-600 mb-8">Latest compliance rules for DLI transfers, SEVIS releases, and Subclass 500 extensions.</p>
                <div className="grid md:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                          {blog.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-3">{blog.title}</h3>
                        <p className="text-sm text-slate-600 mt-2">{blog.excerpt}</p>
                      </div>
                      <button
                        onClick={() => setSelectedBlog(blog)}
                        className="mt-5 text-sm font-semibold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        Read Full Guide <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 7. CAREERS */}
        {activePage === 'careers' && (
          <section className="max-w-4xl mx-auto px-4 py-12 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
                <Briefcase className="w-4 h-4" /> Join Our Global Admissions Team
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Careers at Onshore Admissions</h1>
              <p className="text-slate-600 mt-2">
                We are hiring remote and regional onshore student counselors for Canada, USA, and Australia markets.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  { role: 'Senior Onshore Admissions Counselor (Canada & USA)', loc: 'Remote / Hybrid', type: 'Full-Time' },
                  { role: 'University Relations & Compliance Coordinator (Australia)', loc: 'Remote', type: 'Full-Time' }
                ].map((job, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{job.role}</h3>
                      <p className="text-xs text-slate-500 mt-1">{job.loc} • {job.type}</p>
                    </div>
                    <button
                      onClick={() => showToast('Application Noted', 'Send your CV directly to info@theonshoreadmissions.com.')}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                    >
                      Apply via Email
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 8. CONTACT */}
        {activePage === 'contact' && (
          <section className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">Contact Onshore Admissions</h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Have questions about changing your college, extending your study permit, or checking credit transfer eligibility? Reach out directly.
                </p>
                <div className="space-y-3 pt-2 text-sm">
                  <p className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Mail className="w-4 h-4 text-blue-700" /> info@theonshoreadmissions.com
                  </p>
                  <p className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Globe className="w-4 h-4 text-blue-700" /> www.theonshoreadmissions.com
                  </p>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Message Sent!', 'We will reply to your inquiry within 24 hours.');
                  e.target.reset();
                }}
                className="space-y-3"
              >
                <input required placeholder="Your Full Name" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
                <input type="email" required placeholder="Your Email Address" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm">
                  <option>Canada Study Transfer / Extension</option>
                  <option>USA SEVIS I-20 Transfer</option>
                  <option>Australia CoE / Course Change</option>
                </select>
                <textarea rows={3} required placeholder="How can we help you?" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
                <button type="submit" className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Inquiry
                </button>
              </form>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-300 font-semibold">© 2026 Onshore Admissions. All rights reserved.</p>
          <p>Official Support: info@theonshoreadmissions.com</p>
        </div>
      </footer>
    </div>
  );
}
