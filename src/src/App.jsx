import React, { useState } from 'react';
import {
  GraduationCap, Globe, FileText, CheckCircle2, Clock, Download,
  Upload, Mail, Briefcase, Building2, BookOpen, UserCheck, ShieldCheck,
  Search, ChevronRight, ArrowRight, Plus, LogOut, User, MapPin,
  DollarSign, Calendar, Send, Menu, X, Award, Sparkles, AlertCircle, Check
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
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
    name: 'Seneca Polytechnic',
    country: 'Canada',
    city: 'Toronto, ON',
    intake: 'Jan / May 2027',
    tuition: 'CAD $16,200 / yr',
    scholarship: 'Fast-Track LOA (5 Days)',
    courses: ['International Business Management', 'Cloud Architecture & Administration', 'Cybersecurity & Threat Management']
  },
  {
    id: 'u3',
    name: 'Northeastern University (College of Professional Studies)',
    country: 'USA',
    city: 'Boston, MA / Seattle, WA',
    intake: 'Jan / Apr / Sep 2027',
    tuition: 'USD $24,800 / yr',
    scholarship: 'USD $4,000 Transfer Merit Award',
    courses: ['MS in Project Management (STEM)', 'MS in Regulatory Affairs', 'MPS in Informatics (STEM)']
  },
  {
    id: 'u4',
    name: 'California State University, East Bay',
    country: 'USA',
    city: 'Hayward, CA',
    intake: 'Spring / Fall 2027',
    tuition: 'USD $19,400 / yr',
    scholarship: 'SEVIS Transfer Fee Waiver',
    courses: ['MS in Business Analytics (STEM)', 'MS in Computer Science', 'MBA - Global Innovators']
  },
  {
    id: 'u5',
    name: 'Macquarie University',
    country: 'Australia',
    city: 'Sydney, NSW',
    intake: 'Feb / Jul 2027',
    tuition: 'AUD $34,000 / yr',
    scholarship: 'AUD $5,000 Onshore Partner Bursary',
    courses: ['Master of Information Technology', 'Master of Business Analytics', 'Master of Management']
  },
  {
    id: 'u6',
    name: 'Deakin University',
    country: 'Australia',
    city: 'Melbourne, VIC',
    intake: 'Mar / Jul / Nov 2027',
    tuition: 'AUD $31,600 / yr',
    scholarship: '20% STEM Onshore Scholarship',
    courses: ['Master of Data Science', 'Master of Professional Accounting', 'Master of Construction Management']
  }
];

const INITIAL_BLOGS = [
  {
    id: 'b1',
    title: 'How to Change Your DLI College in Canada Without Affecting Your PGWP Eligibility',
    category: 'Canada Study Extension',
    date: 'Nov 18, 2026',
    readTime: '5 min read',
    summary: 'A step-by-step breakdown of IRCC rules for onshore DLI transfers, study permit extension timelines, and choosing PGWP-eligible programs.',
    content: 'Transferring between Designated Learning Institutions (DLIs) inside Canada requires careful compliance with IRCC rules. Before switching colleges or universities, ensure your new program is PGWP-eligible, notify IRCC via your GCKey portal, and apply for your study permit extension at least 90 days before expiration.'
  },
  {
    id: 'b2',
    title: 'F-1 SEVIS Transfer in the USA: Maintaining Status Between Universities',
    category: 'USA Transfers',
    date: 'Nov 10, 2026',
    readTime: '4 min read',
    summary: 'Everything international students in the US need to know about SEVIS release dates, grace periods, and Day-1 CPT or STEM master’s transfers.',
    content: 'When transferring your F-1 SEVIS record from one SEVP-certified school to another in the United States, timing your SEVIS release date is critical. You must begin classes at your transfer-in university within 5 months of your last day of attendance or OPT end date.'
  },
  {
    id: 'b3',
    title: 'Onshore CoE & Student Visa (Subclass 500) Extension Guide for Australia',
    category: 'Australia Visa',
    date: 'Nov 02, 2026',
    readTime: '6 min read',
    summary: 'Planning to upgrade from a Diploma to a Bachelor or Master degree in Sydney or Melbourne? Here is how to secure your new CoE and Bridging Visa A.',
    content: 'In Australia, onshore students extending their stay or changing courses must obtain a new Confirmation of Enrolment (CoE) and lodge a fresh Subclass 500 visa application before their current visa expires. Once lodged onshore, you automatically receive a Bridging Visa A (BVA) allowing you to remain lawfully in Australia.'
  }
];

const INITIAL_JOBS = [
  {
    id: 'j1',
    title: 'Senior Onshore Admissions Counselor (Canada & USA)',
    location: 'Remote / Hybrid',
    type: 'Full-Time',
    department: 'Student Admissions',
    description: 'Guide onshore international students through college/university transfers, document verification, and offer letter processing.'
  },
  {
    id: 'j2',
    title: 'University Partnerships Manager (B2B)',
    location: 'Remote (North America / APAC)',
    type: 'Full-Time',
    department: 'Institutional Relations',
    description: 'Onboard universities and colleges across the USA, Canada, and Australia and manage direct institutional commission agreements.'
  },
  {
    id: 'j3',
    title: 'Student Visa & Compliance Coordinator',
    location: 'Remote',
    type: 'Full-Time',
    department: 'Post-Offer Support',
    description: 'Assist students after offer letter issuance with CoE, I-20, LOA, and study permit extension documentation checklists.'
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: 'APP-2026-841',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.student@example.com',
    currentCountry: 'Canada',
    currentInstitution: 'Humber College',
    targetUniversity: 'Seneca Polytechnic',
    course: 'Cloud Architecture & Administration',
    intake: 'May 2027',
    status: 'Offer Letter Issued',
    submittedDate: '2026-11-15',
    docs: ['Passport_Bio.pdf', 'Current_Study_Permit.pdf', 'College_Transcripts.pdf'],
    offerReady: true
  },
  {
    id: 'APP-2026-842',
    studentName: 'Simran Kaur',
    studentEmail: 'simran.k@example.com',
    currentCountry: 'Australia',
    currentInstitution: 'Holmes Institute',
    targetUniversity: 'Macquarie University',
    course: 'Master of Business Analytics',
    intake: 'Feb 2027',
    status: 'Under University Review',
    submittedDate: '2026-11-21',
    docs: ['Passport.pdf', 'Subclass500_VisaGrant.pdf', 'Bachelor_Degree.pdf'],
    offerReady: false
  }
];

const STATUS_OPTIONS = [
  'Documents Received & Verified',
  'Submitted to University',
  'Under University Review',
  'Conditional Offer Issued',
  'Offer Letter Issued'
];

const CONTACT_EMAIL = 'info@theonshoreadmissions.com';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth & Role States
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  // Dynamic Platform Data
  const [universities] = useState(INITIAL_UNIVERSITIES);
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [selectedUniForApply, setSelectedUniForApply] = useState(null);

  // Filters
  const [countryFilter, setCountryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 5500);
  };

  // --- NAVIGATION ---
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'universities', label: 'Universities & Courses' },
    { id: 'providers', label: 'Education Providers' },
    { id: 'blogs', label: 'Blogs & Guides' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' },
  ];

  const navigate = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- HANDLERS ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const name = formData.get('name') || email.split('@')[0];
    const country = formData.get('country') || 'Canada';
    setCurrentUser({ name, email, country });
    setIsAdminMode(false);
    showToast('Welcome to Student Portal', `Logged in as ${name}`);
    navigate('portal');
  };

  const handleQuickDemoLogin = () => {
    setCurrentUser({
      name: 'Aarav Sharma',
      email: 'aarav.student@example.com',
      country: 'Canada'
    });
    setIsAdminMode(false);
    showToast('Demo Student Logged In', 'You can now apply, track status, and download your Offer Letter.');
    navigate('portal');
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newApp = {
      id: `APP-2026-${Math.floor(850 + Math.random() * 140)}`,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      currentCountry: fd.get('currentCountry'),
      currentInstitution: fd.get('currentInstitution'),
      targetUniversity: fd.get('targetUniversity'),
      course: fd.get('course'),
      intake: fd.get('intake'),
      status: 'Documents Received & Verified',
      submittedDate: new Date().toISOString().split('T')[0],
      docs: [
        fd.get('passportFile')?.name || 'Passport_Copy.pdf',
        fd.get('visaFile')?.name || 'Current_Visa_Permit.pdf',
        fd.get('transcriptFile')?.name || 'Academic_Transcripts.pdf'
      ],
      offerReady: false
    };

    setApplications([newApp, ...applications]);
    setSelectedUniForApply(null);
    showToast(
      'Application & Docs Sent!',
      `All documents dispatched to ${CONTACT_EMAIL}. Track live status below.`
    );
  };

  const handleAdminStatusChange = (appId, newStatus) => {
    setApplications(applications.map(app => {
      if (app.id === appId) {
        const isOffer = newStatus.toLowerCase().includes('offer');
        return { ...app, status: newStatus, offerReady: isOffer };
      }
      return app;
    }));
    showToast('Status Updated', `Application ${appId} updated to "${newStatus}".`);
  };

  const handleDownloadOffer = (app) => {
    const offerText = `
====================================================================
                  OFFICIAL LETTER OF OFFER (ONSHORE)
====================================================================
Reference ID: ${app.id}
Date Issued:  ${new Date().toLocaleDateString()}
Student Name: ${app.studentName}
Email:        ${app.studentEmail}

Institution:  ${app.targetUniversity}
Program:      ${app.course}
Intake:       ${app.intake}
Study Mode:   Onshore Transfer / Study Extension (${app.currentCountry})

Status:       OFFER CONFIRMED
Processed By: Onshore Admissions (${CONTACT_EMAIL})

NEXT STEPS FOR STUDENT:
1. Review your fee schedule and deposit deadline.
2. Contact our post-offer visa team at ${CONTACT_EMAIL} for your
   official CoE / LOA / I-20 and study permit extension filing.
====================================================================
    `.trim();

    const blob = new Blob([offerText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${app.id}_Offer_Letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Offer Letter Downloaded', `${app.id}_Offer_Letter.txt saved to your device.`);
  };

  const handleAddBlog = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newBlog = {
      id: `b-${Date.now()}`,
      title: fd.get('title'),
      category: fd.get('category'),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: '4 min read',
      summary: fd.get('summary'),
      content: fd.get('content')
    };
    setBlogs([newBlog, ...blogs]);
    e.target.reset();
    showToast('Blog Published!', 'Your new article is now live for organic traffic.');
  };

  const triggerMailForward = (subject, bodyText, successTitle) => {
    showToast(successTitle, `Forwarded directly to ${CONTACT_EMAIL}`);
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.open(mailtoUrl, '_blank');
  };

  // Filtered universities
  const filteredUniversities = universities.filter(u => {
    const matchesCountry = countryFilter === 'All' || u.country === countryFilter;
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  const userApplications = currentUser
    ? applications.filter(a => a.studentEmail.toLowerCase() === currentUser.email.toLowerCase() || a.studentName === currentUser.name)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">{toast.title}</h4>
            <p className="text-xs text-slate-300 mt-1">{toast.message}</p>
          </div>
        </div>
      )}

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-indigo-950 text-indigo-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Specialized Onshore College/University Transfers & Study Extensions: <strong>USA • Canada • Australia</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {CONTACT_EMAIL}
            </a>
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                navigate('portal');
              }}
              className="text-amber-300 hover:text-amber-200 font-medium underline"
            >
              {isAdminMode ? 'Exit Admin View' : 'Counselor / Admin Panel'}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-700 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Onshore<span className="text-indigo-600">Admissions</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-semibold -mt-1">
                Study Transfers & Extensions
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`text-sm font-medium transition ${
                  activePage === item.id
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Portal CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => navigate('portal')}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition"
              >
                <User className="w-4 h-4" />
                {currentUser.name} (Portal)
              </button>
            ) : (
              <button
                onClick={() => navigate('portal')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm flex items-center gap-1.5"
              >
                Student Login / Sign Up <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => navigate('portal')}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold text-sm"
              >
                {currentUser ? `Open Portal (${currentUser.name})` : 'Student Login / Sign Up'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow">
        {/* ================= HOME PAGE ================= */}
        {activePage === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-4">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-200">
                    <Globe className="w-4 h-4 text-indigo-300" />
                    Already Studying in USA, Canada, or Australia?
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    Transfer Universities or Extend Your Study Visa <span className="text-indigo-400">Zero Service Fee.</span>
                  </h1>
                  <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                    Apply directly to top partner universities and colleges through your Onshore Admissions portal. Upload documents once, track live application status, and download your official Offer Letter faster.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => navigate('portal')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold text-base shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
                    >
                      Apply Through Student Portal <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate('universities')}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-semibold text-base transition"
                    >
                      Browse Universities
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
                    <div>
                      <div className="text-2xl font-bold text-white">$0</div>
                      <div className="text-xs text-slate-400">Student Application Fee</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">150+</div>
                      <div className="text-xs text-slate-400">Partner Institutions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">48 Hrs</div>
                      <div className="text-xs text-slate-400">Document Verification</div>
                    </div>
                  </div>
                </div>

                {/* Quick Course Finder Card */}
                <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <h3 className="text-xl font-bold mb-1">Find Your Next Onshore Program</h3>
                  <p className="text-sm text-slate-500 mb-5">Select your current study country to explore transfer & extension options.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Study Destination</label>
                      <select
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      >
                        <option value="All">All Countries (USA, Canada, Australia)</option>
                        <option value="Canada">Canada (DLI Transfer / PGWP Extension)</option>
                        <option value="USA">USA (F-1 SEVIS Transfer / STEM Master's)</option>
                        <option value="Australia">Australia (Onshore CoE / Subclass 500)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Course or University Keyword</label>
                      <input
                        type="text"
                        placeholder="e.g. Data Science, MBA, Toronto, STEM..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => navigate('universities')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" /> Search Eligible Programs
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-slate-900">How Onshore Admissions Works</h2>
                <p className="text-slate-600 mt-2">
                  We partner directly with universities so students pay zero counseling fees while receiving end-to-end offer & visa support.
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    step: '01',
                    title: 'Create Student Account',
                    desc: 'Sign up in 30 seconds and choose your preferred university and course in USA, Canada, or Australia.',
                    icon: UserCheck
                  },
                  {
                    step: '02',
                    title: 'Upload Documents Online',
                    desc: 'Submit your passport, current visa/permit, and transcripts—sent directly to our admissions desk.',
                    icon: Upload
                  },
                  {
                    step: '03',
                    title: 'Track Live Status',
                    desc: 'Log in anytime to view real-time progress as our counselors submit and follow up with the university.',
                    icon: Clock
                  },
                  {
                    step: '04',
                    title: 'Download Offer & Extend',
                    desc: 'Download your official Offer Letter directly from your dashboard and email our visa team for CoE/LOA/I-20.',
                    icon: Download
                  }
                ].map((item) => (
                  <div key={item.step} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black text-slate-200">{item.step}</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Blogs Preview */}
            <section className="bg-white py-16 px-4 border-t border-slate-200">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-between items-end mb-10 gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Latest Onshore Visa & Transfer Guides</h2>
                    <p className="text-slate-600 mt-1">Updated compliance guides for international students extending their studies.</p>
                  </div>
                  <button
                    onClick={() => navigate('blogs')}
                    className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:underline"
                  >
                    Read All Articles <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {blogs.slice(0, 3).map(blog => (
                    <div key={blog.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                          {blog.category}
                        </span>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{blog.title}</h3>
                        <p className="text-sm text-slate-600 line-clamp-3">{blog.summary}</p>
                      </div>
                      <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                        <span>{blog.date}</span>
                        <button onClick={() => navigate('blogs')} className="text-indigo-600 font-semibold hover:underline">
                          Read More →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= UNIVERSITIES & COURSES PAGE ================= */}
        {activePage === 'universities' && (
          <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Partner Universities & Onshore Programs</h1>
              <p className="text-slate-600 mt-1">Select your dream university and click "Apply Through Us" to submit your documents via the Student Portal.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['All', 'Canada', 'USA', 'Australia'].map(country => (
                  <button
                    key={country}
                    onClick={() => setCountryFilter(country)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      countryFilter === country
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
              <div className="relative flex-grow max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search university, city, or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {/* University Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredUniversities.map(uni => (
                <div key={uni.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
                          <MapPin className="w-3.5 h-3.5" /> {uni.country} • {uni.city}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{uni.name}</h3>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full shrink-0">
                        {uni.scholarship}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span><strong>Intakes:</strong> {uni.intake}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <DollarSign className="w-4 h-4 text-indigo-600" />
                        <span><strong>Est. Tuition:</strong> {uni.tuition}</span>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="text-xs font-semibold uppercase text-slate-400 mb-2">Popular Onshore Transfer Courses:</div>
                      <ul className="space-y-1.5">
                        {uni.courses.map((course, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedUniForApply(uni);
                      navigate('portal');
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    Apply Through Us (Zero Fee) <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STUDENT & ADMIN PORTAL ================= */}
        {activePage === 'portal' && (
          <div className="max-w-7xl mx-auto py-10 px-4">
            {/* Portal Mode Switcher Banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  {isAdminMode ? (
                    <>
                      <ShieldCheck className="w-6 h-6 text-amber-400" /> Counselor & Admin Control Panel
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-6 h-6 text-indigo-400" /> Onshore Student Application Portal
                    </>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {isAdminMode
                    ? `Manage incoming applications sent to ${CONTACT_EMAIL}, update statuses, and issue Offer Letters.`
                    : 'Submit your documents, track live admission progress, download Offer Letters, and contact our post-offer support team.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    isAdminMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  }`}
                >
                  {isAdminMode ? 'Switch to Student View' : 'Switch to Admin Status Updater'}
                </button>
                {currentUser && !isAdminMode && (
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      showToast('Logged Out', 'You have been signed out of the student portal.');
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                )}
              </div>
            </div>

            {/* ADMIN VIEW */}
            {isAdminMode ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">All Student Applications ({applications.length})</h2>
                    <p className="text-xs text-slate-500">Changing a student's status to "Offer Letter Issued" immediately enables their Offer Letter download.</p>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg">
                    Inbox Synced: {CONTACT_EMAIL}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3.5">App ID & Student</th>
                        <th className="px-6 py-3.5">University & Course</th>
                        <th className="px-6 py-3.5">Uploaded Docs</th>
                        <th className="px-6 py-3.5">Update Live Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {applications.map(app => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="font-bold text-indigo-600">{app.id}</div>
                            <div className="font-semibold text-slate-900">{app.studentName}</div>
                            <div className="text-xs text-slate-500">{app.studentEmail} • In {app.currentCountry}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">{app.targetUniversity}</div>
                            <div className="text-xs text-slate-600">{app.course} ({app.intake})</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {app.docs.map((d, i) => (
                                <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                  {d}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={app.status}
                              onChange={(e) => handleAdminStatusChange(app.id, e.target.value)}
                              className="border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold bg-white focus:ring-2 focus:ring-indigo-600"
                            >
                              {STATUS_OPTIONS.map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : !currentUser ? (
              /* STUDENT LOGIN / SIGNUP SCREEN */
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex border-b border-slate-200 mb-6">
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${
                      authMode === 'login' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
                    }`}
                  >
                    Student Login
                  </button>
                  <button
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${
                      authMode === 'signup' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
                    }`}
                  >
                    New Student Sign Up
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (As on Passport)</label>
                        <input required name="name" type="text" placeholder="e.g. Gurpreet Singh" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Current Study Country</label>
                        <select name="country" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm">
                          <option value="Canada">Canada</option>
                          <option value="USA">USA</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input required name="email" type="email" placeholder="you@example.com" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <input required name="password" type="password" placeholder="••••••••" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition">
                    {authMode === 'login' ? 'Sign In to Portal' : 'Create Student Account'}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-2">Want to test the portal immediately?</p>
                  <button
                    onClick={handleQuickDemoLogin}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs transition"
                  >
                    1-Click Demo Student Login (With Ready Offer Letter)
                  </button>
                </div>
              </div>
            ) : (
              /* LOGGED-IN STUDENT DASHBOARD */
              <div className="grid lg:grid-cols-12 gap-8">
                {/* LEFT: New Application Form */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">Apply to a University</h2>
                  <p className="text-xs text-slate-500 mb-5">
                    Select your course and attach documents. Everything goes directly to <strong>{CONTACT_EMAIL}</strong>.
                  </p>

                  <form onSubmit={handleApplicationSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Current Country</label>
                        <select
                          name="currentCountry"
                          defaultValue={selectedUniForApply?.country || currentUser.country}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                        >
                          <option value="Canada">Canada</option>
                          <option value="USA">USA</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Intake</label>
                        <select name="intake" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm">
                          <option value="Jan / Feb 2027">Jan / Feb 2027</option>
                          <option value="May / Jul 2027">May / Jul 2027</option>
                          <option value="Sep 2027">Sep 2027</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Current College / University</label>
                      <input
                        required
                        name="currentInstitution"
                        type="text"
                        placeholder="e.g. Centennial College / Current School"
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Target University / College</label>
                      <select
                        name="targetUniversity"
                        defaultValue={selectedUniForApply?.name || universities[0].name}
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm"
                      >
                        {universities.map(u => (
                          <option key={u.id} value={u.name}>{u.name} ({u.country})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Course / Program</label>
                      <input
                        required
                        name="course"
                        type="text"
                        defaultValue={selectedUniForApply?.courses[0] || ''}
                        placeholder="e.g. Master of Business Analytics"
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm"
                      />
                    </div>

                    {/* Document Uploads */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-indigo-600" /> Upload Required Documents (PDF/JPG)
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">1. Passport (Front & Back)</label>
                        <input required name="passportFile" type="file" className="w-full text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 file:font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">2. Current Study Permit / Visa / I-20</label>
                        <input required name="visaFile" type="file" className="w-full text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 file:font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">3. Academic Transcripts & English Score</label>
                        <input required name="transcriptFile" type="file" className="w-full text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 file:font-semibold" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send className="w-4 h-4" /> Submit Application & Send Docs
                    </button>
                  </form>
                </div>

                {/* RIGHT: Application Tracker, Offer Download & Post-Offer Support */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">My Applications & Live Status</h2>
                    <p className="text-xs text-slate-500 mb-5">
                      Track your application progress in real time. Once your Offer Letter arrives, download it directly below.
                    </p>

                    {userApplications.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">No applications submitted yet</p>
                        <p className="text-xs text-slate-500 mt-1">Fill out the form on the left to submit your first university application.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userApplications.map(app => (
                          <div key={app.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/60">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                              <div>
                                <span className="text-xs font-bold text-indigo-600">{app.id} • Submitted {app.submittedDate}</span>
                                <h3 className="font-bold text-base text-slate-900">{app.targetUniversity}</h3>
                                <p className="text-sm text-slate-600">{app.course} ({app.intake})</p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  app.offerReady
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>

                            {/* Action Buttons: Download Offer + Post-Offer Team Help */}
                            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                              {app.offerReady ? (
                                <button
                                  onClick={() => handleDownloadOffer(app)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                                >
                                  <Download className="w-4 h-4" /> Download Official Offer Letter
                                </button>
                              ) : (
                                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                  <Clock className="w-4 h-4 text-amber-500" /> Offer Letter will unlock here once issued by university
                                </span>
                              )}

                              <button
                                onClick={() =>
                                  triggerMailForward(
                                    `Post-Offer & Visa Extension Help - ${app.id} (${app.studentName})`,
                                    `Hello Onshore Admissions Team,\n\nI need assistance with the next steps (Tuition Deposit / CoE / LOA / I-20 / Study Visa Extension) for my application:\n\nApplication ID: ${app.id}\nUniversity: ${app.targetUniversity}\nCourse: ${app.course}\nCurrent Status: ${app.status}\n\nPlease guide me on the next steps.`,
                                    'Post-Offer Support Request Ready'
                                  )
                                }
                                className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                              >
                                <Mail className="w-3.5 h-3.5" /> Mail Team for Further Process
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dedicated Post-Offer Support Card */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-indigo-950 text-base">Received Your Offer? Need Visa Extension or CoE / LOA / I-20 Help?</h3>
                      <p className="text-xs text-indigo-800 mt-1">
                        Our dedicated post-offer processing desk handles tuition fee receipts, SEVIS transfers, CoE issuance, and study permit extensions.
                      </p>
                    </div>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Post-Offer%20Processing%20Support`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0"
                    >
                      <Mail className="w-4 h-4" /> Email {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= EDUCATION PROVIDERS (B2B) PAGE ================= */}
        {activePage === 'providers' && (
          <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-6 space-y-5">
                <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                  <Building2 className="w-4 h-4" /> For Universities, Colleges & Language Schools
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  Partner With Onshore Admissions for Verified Onshore Enrollments
                </h1>
                <p className="text-slate-600 leading-relaxed">
                  We connect accredited institutions in the <strong>USA, Canada, and Australia</strong> with high-intent international students who are already onshore and looking to transfer or progress to higher degree programs.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    'Pre-screened onshore applicants with valid visas, academic transcripts, and local English proficiency.',
                    'Higher visa certainty and immediate intake conversion without offshore visa delays.',
                    'Direct recruitment & commission partnership agreements managed transparently.'
                  ].map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 text-white p-5 rounded-2xl mt-6">
                  <div className="text-xs text-indigo-300 font-semibold uppercase">Direct Institutional Partnerships Desk</div>
                  <div className="text-lg font-bold mt-1">{CONTACT_EMAIL}</div>
                  <p className="text-xs text-slate-400 mt-1">Reach out directly or submit the partnership onboarding form to initiate an agreement.</p>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Become a Partner Education Provider</h2>
                <p className="text-xs text-slate-500 mb-6">Submit your institution details to connect directly with our recruitment directors.</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    triggerMail
