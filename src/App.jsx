import React, { useState } from 'react';
import {
  GraduationCap, Globe, FileText, CheckCircle2, Clock, Download,
  Upload, Mail, Briefcase, Building2, UserCheck, ShieldCheck,
  Search, ChevronRight, ArrowRight, Plus, LogOut, User, MapPin,
  DollarSign, Calendar, Send, Menu, X, Sparkles
} from 'lucide-react';

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
    summary: 'Everything international students in the US need to know about SEVIS release dates, grace periods, and STEM master’s transfers.',
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

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const [universities] = useState(INITIAL_UNIVERSITIES);
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [selectedUniForApply, setSelectedUniForApply] = useState(null);

  const [countryFilter, setCountryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [toast, setToast] = useState(null);

  const showToast = (title,
