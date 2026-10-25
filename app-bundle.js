// ==============================================================================
// HACKTIVATORS EVENT PLATFORM - COMPLETE STANDALONE CORE BUNDLE
// Works across both http:// and file:// protocols with zero CORS issues
// ==============================================================================

(function () {
  "use strict";

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231f294d'/><circle cx='50' cy='38' r='18' fill='%2394a3b8'/><path d='M14 94c4-22 20-32 36-32s32 10 36 32z' fill='%2394a3b8'/></svg>";

  async function hashPassword(pw, email) {
    try {
      if (window.crypto && window.crypto.subtle) {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("hacktivators:" + String(email).toLowerCase() + ":" + pw));
        return "sha256:" + [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (e) {}
    return pw;
  }
  async function verifyPassword(stored, pw, email) {
    if (!stored) return false;
    if (String(stored).startsWith("sha256:")) return stored === (await hashPassword(pw, email));
    return stored === pw; // legacy plain-text records
  }

  // 1. CONFIGURATION & METADATA
  const CONFIG = {
    supabaseUrl: "https://mwqohvrgimpfyduaxrow.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cW9odnJnaW1wZnlkdWF4cm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MjY2NDksImV4cCI6MjEwODUwMjY0OX0.i6TiH_15wKEdED7wQEzxkXbOlikt0d1RQmZXqjrltTw",
    supabasePublishableKey: "sb_publishable_Wrneh6Vnt7BlZWRRirUpMg_XI9kohvD",
    adminPasscode: "admin2026",

    event: {
      nameEn: "Hack Day",
      nameAr: "يوم الهاك",
      teamNameEn: "Hacktivators",
      teamNameAr: "هاكتيفيتورز",
      taglineEn: "Innovation • Technology • Impact",
      taglineAr: "تعلّم • ابنِ • ابتكر • معاً",
      duration: "4 Hours (Non-stop) / 4 ساعات (من غير فواصل)",
      time: "8:00 AM - 12:00 PM / من 8:00 صباحاً إلى 12:00 ظهراً",
      groups: ["A", "B", "C", "D"],
      workshops: [
        {
          id: "emotional_intelligence",
          nameEn: "Emotional Intelligence",
          nameAr: "الذكاء العاطفي",
          icon: "fa-brain",
          color: "purple",
          descAr: "طوّر وعيك بذاتك والآخرين، وتعلّم كيف تتواصل بشكل أفضل وتبني علاقات أقوى.",
          descEn: "Develop awareness of yourself and others, learn effective communication, and build stronger relationships."
        },
        {
          id: "block_programming",
          nameEn: "Block-based Programming",
          nameAr: "البرمجة باستخدام البلوكات",
          icon: "fa-cubes",
          color: "amber",
          descAr: "إبنِ أفكارك من خلال البرمجة المرئية، وتعلّم أساسيات البرمجة بطريقة بسيطة وممتعة.",
          descEn: "Build your ideas through visual coding and master programming fundamentals in an easy, fun way."
        },
        {
          id: "game_dev",
          nameEn: "Game Development",
          nameAr: "تطوير الألعاب",
          icon: "fa-gamepad",
          color: "cyan",
          descAr: "إبدع في تصميم ألعابك الخاصة وتعلّم أساسيات المنطق والتصميم.",
          descEn: "Unleash creativity by designing your own video games and mastering game logic and mechanics."
        },
        {
          id: "design_basics",
          nameEn: "Design Basics",
          nameAr: "أساسيات التصميم",
          icon: "fa-pen-nib",
          color: "pink",
          descAr: "اكتشف أساسيات التصميم وتعلّم كيف تحوّل أفكارك إلى رسومات بصرية مميزة.",
          descEn: "Discover core visual design principles and learn how to translate creative ideas into stunning artwork."
        }
      ],
      scheduleMatrix: [
        {
          timeEn: "8:00 AM - 9:00 AM",
          timeAr: "8:00 - 9:00 صباحاً",
          slots: {
            A: "design_basics",
            B: "emotional_intelligence",
            C: "game_dev",
            D: "block_programming"
          }
        },
        {
          timeEn: "9:00 AM - 10:00 AM",
          timeAr: "9:00 - 10:00 صباحاً",
          slots: {
            A: "emotional_intelligence",
            B: "game_dev",
            C: "block_programming",
            D: "design_basics"
          }
        },
        {
          timeEn: "10:00 AM - 11:00 AM",
          timeAr: "10:00 - 11:00 صباحاً",
          slots: {
            A: "game_dev",
            B: "block_programming",
            C: "design_basics",
            D: "emotional_intelligence"
          }
        },
        {
          timeEn: "11:00 AM - 12:00 PM",
          timeAr: "11:00 صباحاً - 12:00 ظهراً",
          slots: {
            A: "block_programming",
            B: "design_basics",
            C: "emotional_intelligence",
            D: "game_dev"
          }
        }
      ]
    }
  };

  // 2. TRANSLATIONS (ARABIC & ENGLISH)
  const TRANSLATIONS = {
    ar: {
      navBrand: "هاكتيفيتورز",
      navHome: "الرئيسية",
      navSchedule: "الجدول الزمني",
      navRegister: "التسجيل بالحدث",
      navStudentPortal: "حساب الطالب",
      navAdmin: "لوحة الإدارة",
      badgeUpcoming: "الحدث القادم • يوم الهاك",
      heroTitlePrefix: "مرحباً بكم في",
      heroTitleHighlight: "يوم الهاك",
      heroSubtitle: "مهارات مختلفة • هدف واحد. سجّل الآن للمشاركة في ورش العمل التفاعلية واكتشف شغفك في التقنية والتصميم والابتكار مع فريق هاكتيفيتورز.",
      btnRegisterNow: "سجّل الآن في الحدث",
      btnViewSchedule: "استعراض الجدول الزمني",
      btnLoginStudent: "تسجيل دخول طالب",
      btnViewOriginalPoster: "عرض البوستر الأصلي",
      statDuration: "المدة",
      statDurationVal: "4 ساعات متواصلة",
      statGroups: "المجموعات",
      statGroupsVal: "A • B • C • D",
      statTime: "التوقيت",
      statTimeVal: "8:00 ص - 12:00 ظ",
      statDate: "الموعد",
      statDateVal: "يوم الهاك",
      scheduleTitle: "الجدول الزمني التفاعلي",
      scheduleSubtitle: "توزيع ورش العمل الأربعة بين المجموعات A و B و C و D على مدار 4 ساعات متتالية بدون فواصل.",
      tabAllGroups: "كل المجموعات",
      tabGroupA: "المجموعة A",
      tabGroupB: "المجموعة B",
      tabGroupC: "المجموعة C",
      tabGroupD: "المجموعة D",
      timeCol: "التوقيت",
      viewPosterBtn: "معاينة البوستر الرسمي للملتقى",
      workshopsHeading: "الورش المقدمة",
      regTitle: "تسجيل حضور الطالب",
      regSubtitle: "يرجى تعبئة جميع البيانات المطلوبة بدقة للحصول على بطاقة الحضور الخاصة بك مع رمز الـ QR وتعيين مجموعتك.",
      fieldName: "الاسم الكامل",
      fieldNamePlaceholder: "مثال: عبد الرحمن محمد",
      fieldGrade: "الصف الدراسي",
      fieldGradeSelect: "اختر الصف الدراسي",
      grade9: "الصف التاسع (Grade 9)",
      grade10: "الصف العاشر (Grade 10)",
      grade11: "الصف الحادي عشر (Grade 11)",
      grade12: "الصف الثاني عشر (Grade 12)",
      gradeOther: "صف آخر",
      fieldSchool: "اسم المدرسة",
      fieldSchoolPlaceholder: "مثال: مدرسة التكنولوجيا المتقدمة",
      fieldMobile: "رقم الجوال / الهاتف",
      fieldMobilePlaceholder: "مثال: 0501234567",
      fieldEmail: "البريد الإلكتروني",
      fieldEmailPlaceholder: "مثال: student@example.com",
      fieldPassword: "كلمة المرور لحسابك",
      fieldPasswordPlaceholder: "أدخل كلمة مرور لتسجيل الدخول لاحقاً",
      fieldPhoto: "الصورة الشخصية (اختياري)",
      btnSubmitRegistration: "إتمام التسجيل وإنشاء الحساب",
      allFieldsRequiredNote: "جميع الحقول المشار إليها بـ (*) إلزامية.",
      alreadyRegistered: "مسجل مسبقاً؟",
      loginHere: "سجّل دخولك لحسابك",
      regSuccessTitle: "تم تسجيلك بنجاح في يوم الهاك!",
      regSuccessDesc: "تم إنشاء حسابك الشخصي وتعيينك ضمن المجموعة المحددة أدناه. يمكنك تحميل بطاقة الدخول (QR Pass) فوراً.",
      ticketStudentName: "اسم الطالب:",
      ticketGroup: "المجموعة المعينة:",
      btnDownloadPass: "تحميل بطاقة الحضور",
      btnPrintPass: "طباعة",
      btnGoToProfile: "الانتقال إلى لوحة حسابك",
      studentPortalTitle: "لوحة تحكم الطالب",
      studentPortalSubtitle: "متابعة جدولك المخصص، بطاقة الحضور، وتقييم ورش العمل.",
      statusAttended: "تم تسجيل الحضور بنجاح",
      statusNotAttended: "في انتظار مسح رمز الحضور عند الوصول",
      changePhotoBtn: "تغيير الصورة",
      myGroupIs: "أنت مسجل في المجموعة",
      myScheduleTitle: "جدولك المخصص ليوم الهاك",
      myScheduleNote: "تنقل حسب التوقيت التالي لحضور ورش العمل الخاصة بمجموعتك:",
      rateWorkshopsTitle: "تقييم ورش العمل وترك الملاحظات",
      rateWorkshopsDesc: "يمكنك تقييم كل ورشة عمل من 0 إلى 5 نجوم وكتابة تعليقك ورأيك لمساعدتنا في تحسين التجربة القادمة.",
      starRatingLabel: "التقييم (من 0 إلى 5 نجوم):",
      commentLabel: "ملاحظاتك وتعليقك حول الورشة:",
      commentPlaceholder: "ما الذي أعجبك في هذه الورشة؟ وما هي اقتراحاتك؟",
      btnSaveRatings: "حفظ تقييماتي",
      ratingsSavedSuccess: "تم حفظ تقييمك لورش العمل بنجاح في قاعدة البيانات!",
      adminTitle: "لوحة تحكم الإدارة (Hacktivators Admin)",
      adminSubtitle: "إدارة بيانات الطلاب، مسح رموز QR لتسجيل الحضور، ومتابعة إحصائيات وتقييمات الورش.",
      adminLockTitle: "تسجيل دخول المسؤول",
      adminPassPlaceholder: "أدخل رمز مرور الإدارة",
      btnAdminUnlock: "دخول لوحة الإدارة",
      adminWrongPass: "رمز المرور غير صحيح! يرجى المحاولة مرة أخرى.",
      btnAdminLogout: "خروج من الإدارة",
      statTotalRegistered: "إجمالي الطلاب المسجلين",
      statCheckedIn: "الطلاب الحاضرين",
      statAttendanceRate: "نسبة الحضور",
      statGroupDistribution: "توزيع المجموعات",
      statAvgRating: "متوسط تقييم الورش",
      qrScannerHeading: "ماسح رموز الحضور المباشر (Live QR Check-in)",
      qrScannerDesc: "استخدم كاميرا الجهاز أو ارفع صورة QR لمسح كود الطالب وتسجيل حضوره فورياً بنقرة واحدة.",
      btnStartCamera: "تشغيل الكاميرا",
      btnStopCamera: "إيقاف الكاميرا",
      btnUploadQR: "مسح QR من صورة",
      btnManualCheckin: "تسجيل الحضور",
      checkinSuccessMsg: "تم تسجيل حضور الطالب بنجاح!",
      studentNotFound: "لم يتم العثور على طالب بهذا الرمز.",
      studentsTableTitle: "قائمة الطلاب المسجلين",
      searchPlaceholder: "ابحث بالاسم، المدرسة، البريد، أو رقم الهاتف...",
      filterGroupAll: "كل المجموعات",
      filterStatusAll: "كل حالات الحضور",
      filterStatusAttended: "حاضر فقط",
      filterStatusPending: "غير حاضر بعد",
      btnAddStudentManual: "+ إضافة طالب يدوياً",
      btnExportCSV: "تصدير CSV / Excel",
      btnSupabaseSync: "إعداد Supabase",
      colName: "الاسم والرمز",
      colGradeSchool: "الصف والمدرسة",
      colContact: "التواصل",
      colGroup: "المجموعة",
      colAttendance: "حالة الحضور",
      colRatings: "تقييم الورش",
      colActions: "الإجراءات",
      modalAddTitle: "إضافة طالب جديد يدوياً بواسطة الإدارة",
      btnSaveStudent: "حفظ الطالب",
      btnCancel: "إلغاء",
      supabaseModalTitle: "إعداد ومزامنة قاعدة بيانات Supabase",
      supabaseStatusConnected: "متصل بحساب Supabase بنجاح",
      supabaseInstruction: "انسخ كود SQL التالي والصقه في Supabase SQL Editor لإنشاء الجداول وسياسات الأمان تلقائياً:",
      btnCopySQL: "نسخ استعلام SQL",
      sqlCopied: "تم نسخ كود SQL إلى الحافظة بنجاح!",
      logout: "تسجيل الخروج",
      login: "تسجيل الدخول",
      footerQuote: "جهّز نفسك... الإبتكار بانتظارك! نلتقي في يوم الهاك!",
      copyright: "جميع الحقوق محفوظة لفريق هاكتيفيتورز © 2026",
      confirmDelete: "هل أنت متأكد من حذف هذا الطالب نهائياً من قاعدة البيانات؟"
    },
    en: {
      navBrand: "Hacktivators",
      navHome: "Home",
      navSchedule: "Schedule",
      navRegister: "Event Register",
      navStudentPortal: "Student Portal",
      navAdmin: "Admin Portal",
      badgeUpcoming: "Upcoming Event • HACK-DAY",
      heroTitlePrefix: "Welcome to",
      heroTitleHighlight: "Hack Day",
      heroSubtitle: "Different skills • One shared goal. Register now to experience hands-on interactive workshops in AI, coding, game design, and creative technology with the Hacktivators team.",
      btnRegisterNow: "Register For Event",
      btnViewSchedule: "Explore Timetable",
      btnLoginStudent: "Student Login",
      btnViewOriginalPoster: "View Event Poster",
      statDuration: "Duration",
      statDurationVal: "4 Hours (Non-stop)",
      statGroups: "Groups",
      statGroupsVal: "A • B • C • D",
      statTime: "Timings",
      statTimeVal: "8:00 AM - 12:00 PM",
      statDate: "Date",
      statDateVal: "Hack-Day",
      scheduleTitle: "Interactive Digital Schedule",
      scheduleSubtitle: "Continuous 4-hour rotation matrix distributing Groups A, B, C, and D across all 4 workshops.",
      tabAllGroups: "All Groups",
      tabGroupA: "Group A",
      tabGroupB: "Group B",
      tabGroupC: "Group C",
      tabGroupD: "Group D",
      timeCol: "Time Slot",
      viewPosterBtn: "View Official Event Poster",
      workshopsHeading: "Featured Workshops",
      regTitle: "Student Event Registration",
      regSubtitle: "Please fill out all required fields accurately to receive your personalized group allocation, and unique QR access pass.",
      fieldName: "Full Name",
      fieldNamePlaceholder: "e.g. Alex Johnson",
      fieldGrade: "Grade / Year",
      fieldGradeSelect: "Select Your Grade",
      grade9: "Grade 9",
      grade10: "Grade 10",
      grade11: "Grade 11",
      grade12: "Grade 12",
      gradeOther: "Other Grade",
      fieldSchool: "School Name",
      fieldSchoolPlaceholder: "e.g. Apex Academy of Technology",
      fieldMobile: "Mobile Number",
      fieldMobilePlaceholder: "e.g. 0501234567",
      fieldEmail: "Email Address",
      fieldEmailPlaceholder: "e.g. student@example.com",
      fieldPassword: "Password (for student portal)",
      fieldPasswordPlaceholder: "Choose a password to log into your account",
      fieldPhoto: "Profile Photo (Optional)",
      btnSubmitRegistration: "Complete Registration & Create Account",
      allFieldsRequiredNote: "All fields marked with (*) are strictly required.",
      alreadyRegistered: "Already registered?",
      loginHere: "Login to your account",
      regSuccessTitle: "Registration Confirmed!",
      regSuccessDesc: "Your personal student account has been created and you have been allocated to the group below. You can download your official QR Pass right now.",
      ticketStudentName: "Student Name:",
      ticketGroup: "Allocated Group:",
      btnDownloadPass: "Download QR Pass",
      btnPrintPass: "Print",
      btnGoToProfile: "Go to Student Dashboard",
      studentPortalTitle: "Student Dashboard",
      studentPortalSubtitle: "Access your personalized day schedule, QR event pass, and submit workshop reviews.",
      statusAttended: "Checked-in & Present",
      statusNotAttended: "Awaiting QR scan upon arrival",
      changePhotoBtn: "Update Photo",
      myGroupIs: "You are allocated in Group",
      myScheduleTitle: "Your Personalized Day Schedule",
      myScheduleNote: "Follow this exact schedule during Hack Day to attend your allocated workshop rooms:",
      rateWorkshopsTitle: "Workshop Ratings & Feedback",
      rateWorkshopsDesc: "Rate each workshop from 0 to 5 stars and share your feedback to help us shape future Hacktivators experiences.",
      starRatingLabel: "Rating (0 to 5 Stars):",
      commentLabel: "Your Comments & Feedback:",
      commentPlaceholder: "What did you enjoy most? What would you like to see next time?",
      btnSaveRatings: "Save My Ratings",
      ratingsSavedSuccess: "Your ratings and feedback were successfully saved!",
      adminTitle: "Hacktivators Admin Portal",
      adminSubtitle: "Manage student attendance, scan live QR codes, and review workshop feedback and event metrics.",
      adminLockTitle: "Admin Access Verification",
      adminPassPlaceholder: "Enter admin passcode",
      btnAdminUnlock: "Unlock Admin Portal",
      adminWrongPass: "Incorrect admin passcode. Please try again.",
      btnAdminLogout: "Exit Admin Portal",
      statTotalRegistered: "Total Registered",
      statCheckedIn: "Attended Students",
      statAttendanceRate: "Attendance Rate",
      statGroupDistribution: "Group Allocations",
      statAvgRating: "Average Rating",
      qrScannerHeading: "Live QR Check-in Scanner",
      qrScannerDesc: "Use your device camera or upload a QR image to scan and verify student attendance instantly.",
      btnStartCamera: "Start Camera Scanner",
      btnStopCamera: "Stop Camera Scanner",
      btnUploadQR: "Scan QR from Image",
      btnManualCheckin: "Check In",
      checkinSuccessMsg: "Student attendance recorded successfully!",
      studentNotFound: "No student found matching this code.",
      studentsTableTitle: "Registered Students Directory",
      searchPlaceholder: "Search by name, school, email, or mobile...",
      filterGroupAll: "All Groups",
      filterStatusAll: "All Attendance",
      filterStatusAttended: "Attended Only",
      filterStatusPending: "Pending Check-in",
      btnAddStudentManual: "+ Add Student Manually",
      btnExportCSV: "Export CSV / Excel",
      btnSupabaseSync: "Supabase Setup",
      colName: "Name & Token",
      colGradeSchool: "Grade & School",
      colContact: "Contact",
      colGroup: "Group",
      colAttendance: "Status",
      colRatings: "Workshop Ratings",
      colActions: "Actions",
      modalAddTitle: "Manually Register Student (Admin Walk-in)",
      btnSaveStudent: "Save Student",
      btnCancel: "Cancel",
      supabaseModalTitle: "Supabase Database Synchronization",
      supabaseStatusConnected: "Connected to Supabase Project",
      supabaseInstruction: "Copy and run this SQL script in the Supabase Dashboard SQL Editor to initialize your tables and policies:",
      btnCopySQL: "Copy SQL Script",
      sqlCopied: "SQL Script copied to clipboard!",
      logout: "Log Out",
      login: "Log In",
      footerQuote: "Get ready... Innovation awaits you! See you at Hack-Day!",
      copyright: "All rights reserved. Hacktivators Team © 2026",
      confirmDelete: "Are you sure you want to permanently delete this student record?"
    }
  };

  // 3. ZERO IMAGINARY DATA - CLEAN EMPTY REPOSITORY
  const SEED_STUDENTS = [];

  class DataService {
    constructor() {
      this.storageKey = "hacktivators_students_clean_v1";
      this.supabase = null;
      this.init();
    }

    init() {
      try {
        localStorage.removeItem("hacktivators_local_students_v1");
        localStorage.removeItem("hacktivators_local_students_v2");
        localStorage.removeItem("hacktivators_local_ratings_v1");
      } catch (e) {}
      if (!localStorage.getItem(this.storageKey)) this.setLocal([]);
      try {
        if (window.supabase && typeof window.supabase.createClient === "function") {
          this.supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
        }
      } catch (e) {
        console.warn("Supabase init note:", e);
      }
    }

    getLocal() {
      try { return JSON.parse(localStorage.getItem(this.storageKey) || "[]"); } catch { return SEED_STUDENTS; }
    }

    setLocal(list) {
      try { localStorage.setItem(this.storageKey, JSON.stringify(list)); return true; }
      catch (e) { console.warn("localStorage write failed (quota?)", e); return false; }
    }

    isLocalId(id) { return String(id).startsWith("std_"); }

    studentRow(r) {
      return { name: r.name, grade: r.grade, school: r.school, mobile: r.mobile, email: r.email,
        password_hash: r.password_hash, group_name: r.group_name, qr_code_token: r.qr_code_token,
        avatar_url: r.avatar_url, attended: !!r.attended, attended_at: r.attended_at || null };
    }

    async fetchRatings() {
      const map = {};
      if (!this.supabase) return map;
      try {
        const { data, error } = await this.supabase.from("workshop_ratings").select("*");
        if (error || !Array.isArray(data)) return map;
        data.forEach((r) => { (map[r.student_id] = map[r.student_id] || {})[r.workshop_id] = { rating: r.rating, comment: r.comment || "" }; });
      } catch (e) {}
      return map;
    }

    async getStudents() {
      if (this.supabase) {
        try {
          const { data, error } = await this.supabase.from("students").select("*").order("created_at", { ascending: false });
          if (!error && Array.isArray(data)) {
            const local = this.getLocal();
            const remoteRatings = await this.fetchRatings();
            const remoteEmails = new Set(data.map((s) => (s.email || "").toLowerCase()));
            const merged = data.map((s) => {
              const m = local.find((l) => (l.email || "").toLowerCase() === (s.email || "").toLowerCase());
              const rr = remoteRatings[s.id];
              return { ...s, ratings: rr && Object.keys(rr).length ? rr : ((m && m.ratings) || {}) };
            });
            // students registered while offline: keep them and try to push them now
            for (const p of local.filter((l) => this.isLocalId(l.id) && !remoteEmails.has((l.email || "").toLowerCase()))) {
              try {
                const res = await this.supabase.from("students").insert([this.studentRow(p)]).select();
                if (!res.error && res.data && res.data[0]) { merged.unshift({ ...p, id: res.data[0].id }); continue; }
              } catch (e) {}
              merged.unshift(p);
            }
            this.setLocal(merged);
            return merged;
          }
          if (error) console.warn("Supabase students not ready, using local data:", error.message);
        } catch (e) {
          console.warn("Using local cache (Supabase unreachable):", e);
        }
      }
      return this.getLocal();
    }

    async register(data) {
      const email = data.email.trim().toLowerCase();
      const dupMsg = document.documentElement.lang === "ar" ? "هذا البريد الإلكتروني مسجل بالفعل مسبقاً!" : "This email address is already registered!";
      const list = await this.getStudents(); // fresh state so groups stay balanced & duplicates are caught
      if (list.some((s) => (s.email || "").toLowerCase() === email)) throw new Error(dupMsg);

      let grp = data.group_name;
      if (!grp) {
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        list.forEach((s) => { if (counts[s.group_name] !== undefined) counts[s.group_name]++; });
        grp = Object.keys(counts).sort((x, y) => counts[x] - counts[y])[0] || "A";
      }

      const password_hash = data.password ? await hashPassword(data.password, email) : "";
      let rec = null;
      for (let attempt = 0; attempt < 6; attempt++) {
        let token;
        do { token = `HACK-${grp}-${Math.floor(1000 + Math.random() * 9000)}`; } while (list.some((s) => s.qr_code_token === token));
        rec = {
          id: "std_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          name: data.name.trim(), grade: data.grade.trim(), school: data.school.trim(), mobile: data.mobile.trim(),
          email, password_hash, group_name: grp, qr_code_token: token, avatar_url: data.avatar_url || "",
          attended: false, attended_at: null, created_at: new Date().toISOString(), ratings: {}
        };
        if (!this.supabase) break;
        try {
          const { data: res, error } = await this.supabase.from("students").insert([this.studentRow(rec)]).select();
          if (!error && res && res[0]) { rec.id = res[0].id; break; }
          if (error) {
            if (error.code === "23505") {
              if (/email/i.test((error.message || "") + (error.details || ""))) { const e = new Error(dupMsg); e.isDup = true; throw e; }
              continue; // QR token collision: generate another token
            }
            console.warn("Supabase insert failed, saved locally:", error.message);
          }
        } catch (e) {
          if (e && e.isDup) throw e;
          console.warn("Supabase unreachable, saved locally:", e);
        }
        break;
      }

      list.unshift(rec);
      this.setLocal(list);
      return rec;
    }

    async deleteStudent(id) {
      if (this.supabase && !this.isLocalId(id)) {
        try { await this.supabase.from("students").delete().eq("id", id); } catch (e) {}
      }
      this.setLocal(this.getLocal().filter((s) => s.id !== id));
      return true;
    }

    // mode "toggle": admin table button. mode "checkin": QR / manual code (never un-checks by accident)
    async setAttendance(idOrToken, mode = "toggle") {
      const key = String(idOrToken || "").trim();
      if (!key) return { success: false };
      const find = (l) => l.find((it) => it.id === key || (it.qr_code_token || "").toLowerCase() === key.toLowerCase() || (it.email || "").toLowerCase() === key.toLowerCase());
      let list = this.getLocal();
      let s = find(list);
      if (!s) { list = await this.getStudents(); s = find(list); }
      if (!s) return { success: false };

      let already = false;
      if (mode === "checkin") {
        if (s.attended) already = true;
        else { s.attended = true; s.attended_at = new Date().toISOString(); }
      } else {
        s.attended = !s.attended;
        s.attended_at = s.attended ? new Date().toISOString() : null;
      }
      this.setLocal(list);

      if (this.supabase && !already && !this.isLocalId(s.id)) {
        try {
          const { error } = await this.supabase.from("students").update({ attended: s.attended, attended_at: s.attended_at }).eq("id", s.id);
          if (error) console.warn("Attendance sync failed:", error.message);
        } catch (e) {}
      }
      return { success: true, student: s, already };
    }

    async updatePhoto(id, photoUrl) {
      const list = this.getLocal();
      const s = list.find((it) => it.id === id);
      if (!s) return;
      s.avatar_url = photoUrl;
      this.setLocal(list);
      if (this.supabase && !this.isLocalId(id)) {
        try { await this.supabase.from("students").update({ avatar_url: photoUrl }).eq("id", id); } catch (e) {}
      }
    }

    async saveRatings(studentId, ratingsObj) {
      const list = this.getLocal();
      const s = list.find((it) => it.id === studentId);
      if (!s) return { saved: false, synced: false };
      s.ratings = { ...(s.ratings || {}), ...ratingsObj };
      this.setLocal(list);

      let synced = false;
      if (this.supabase && !this.isLocalId(s.id)) {
        try {
          const now = new Date().toISOString();
          const rows = Object.entries(ratingsObj).map(([wId, v]) => ({ student_id: s.id, student_email: s.email, workshop_id: wId, rating: v.rating, comment: v.comment || "", updated_at: now }));
          const { error } = await this.supabase.from("workshop_ratings").upsert(rows, { onConflict: "student_id,workshop_id" });
          synced = !error;
          if (error) console.warn("Ratings sync failed:", error.message);
        } catch (e) {}
      }
      return { saved: true, synced };
    }
  }

  const db = new DataService();

  // 4. MAIN CONTROLLER CLASS
  class AppController {
    constructor() {
      this.lang = localStorage.getItem("hacktivators_lang") || "ar";
      this.theme = localStorage.getItem("hacktivators_theme") || "dark";
      this.currentUser = JSON.parse(localStorage.getItem("hacktivators_current_user") || "null");
      this.isAdmin = sessionStorage.getItem("hacktivators_admin_auth") === "true";
      this.students = [];
      this.activeGroup = "ALL";
      this.filter = { search: "", group: "ALL", status: "ALL" };
      this.qrScanner = null;
      this.isScanning = false;
    }

    init() {
      this.applyTheme(this.theme);
      this.applyLang(this.lang);
      this.bindEvents();
      this.refresh();

      if (this.currentUser) this.showStudentPortal(false);
      if (this.isAdmin) this.showAdminSection(false);
    }

    saveSession(u) {
      try { const { password_hash, ...safe } = u; localStorage.setItem("hacktivators_current_user", JSON.stringify(safe)); } catch (e) {}
    }

    compressImage(file, max = 256) {
      return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onerror = reject;
        r.onload = () => {
          const img = new Image();
          img.onerror = reject;
          img.onload = () => {
            const sc = Math.min(1, max / Math.max(img.width, img.height));
            const c = document.createElement("canvas");
            c.width = Math.max(1, Math.round(img.width * sc));
            c.height = Math.max(1, Math.round(img.height * sc));
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            resolve(c.toDataURL("image/jpeg", 0.8));
          };
          img.src = r.result;
        };
        r.readAsDataURL(file);
      });
    }

    t(key) {
      const dict = TRANSLATIONS[this.lang] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || key;
    }

    applyTheme(theme) {
      this.theme = theme;
      localStorage.setItem("hacktivators_theme", theme);
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
      const icon = document.getElementById("themeIcon");
      if (icon) {
        icon.className = theme === "dark" ? "fa-solid fa-sun text-yellow-400 text-base" : "fa-solid fa-moon text-slate-700 text-base";
      }
    }

    toggleTheme() {
      this.applyTheme(this.theme === "dark" ? "light" : "dark");
    }

    applyLang(lang) {
      this.lang = lang;
      localStorage.setItem("hacktivators_lang", lang);
      const root = document.documentElement;
      root.setAttribute("lang", lang);
      root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const val = this.t(key);
        if (val) {
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = val;
          } else {
            el.textContent = val;
          }
        }
      });

      const langBtn = document.getElementById("langBtnText");
      if (langBtn) langBtn.textContent = lang === "ar" ? "English" : "العربية";

      this.renderSchedule();
      this.renderFeaturedWorkshops();
      if (this.currentUser) this.renderPortal();
      if (this.isAdmin) this.renderAdminViews();
    }

    toggleLang() {
      this.applyLang(this.lang === "ar" ? "en" : "ar");
    }

    async refresh() {
      this.students = await db.getStudents();
      if (this.currentUser) {
        const u = this.students.find(s => s.id === this.currentUser.id || s.email === this.currentUser.email);
        if (u) {
          this.currentUser = u;
          this.saveSession(u);
        }
      }
      this.renderSchedule();
      this.renderFeaturedWorkshops();
      if (this.currentUser) this.renderPortal();
      if (this.isAdmin) this.renderAdminViews();
    }

    bindEvents() {
      // one delegated handler for admin-table buttons (no inline JS with user data)
      document.addEventListener("click", (e) => {
        const el = e.target.closest("[data-action]");
        if (!el) return;
        const id = el.getAttribute("data-id");
        const act = el.getAttribute("data-action");
        if (act === "toggle-attendance") this.toggleAttendance(id);
        else if (act === "view") this.viewStudentDetails(id);
        else if (act === "delete") this.confirmDelete(id);
      });
      document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        ["loginModal", "manualAddModal", "studentDetailModal", "posterModal", "supabaseModal", "regSuccessModal"].forEach((m) => this.toggleModal(m, false));
      });

      // Header Toggles

      // Nav Links

      // Registration Form
      const regForm = document.getElementById("registrationForm");
      if (regForm) {
        regForm.addEventListener("submit", (e) => this.handleRegistration(e));
      }

      // Registration photo (resized so it fits localStorage / DB)
      document.getElementById("regPhotoInput")?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          const dataUrl = await this.compressImage(file);
          const img = document.getElementById("regPhotoPreviewImg");
          if (img) img.src = dataUrl;
          document.getElementById("regPhotoPreview")?.classList.remove("hidden");
          const hidden = document.getElementById("regAvatarData");
          if (hidden) hidden.value = dataUrl;
        } catch (err) { console.warn("Photo load failed", err); }
      });

      // Login Form
      document.getElementById("studentLoginForm")?.addEventListener("submit", (e) => this.handleLogin(e));

      // Admin Lock Form
      document.getElementById("adminUnlockForm")?.addEventListener("submit", (e) => this.handleAdminUnlock(e));

      // Admin Filters
      document.getElementById("adminSearchInput")?.addEventListener("input", (e) => {
        this.filter.search = e.target.value;
        this.renderStudentsTable();
      });
      document.getElementById("adminFilterGroup")?.addEventListener("change", (e) => {
        this.filter.group = e.target.value;
        this.renderStudentsTable();
      });
      document.getElementById("adminFilterStatus")?.addEventListener("change", (e) => {
        this.filter.status = e.target.value;
        this.renderStudentsTable();
      });

      // Admin Manual Add Form
      document.getElementById("manualAddStudentForm")?.addEventListener("submit", (e) => this.handleManualAdd(e));

      // Admin CSV Export

      // Scanner Controls
      document.getElementById("qrFileInput")?.addEventListener("change", (e) => this.handleQrFile(e));

      // Schedule Filter Tabs
      document.querySelectorAll(".schedule-group-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
          const grp = e.currentTarget.getAttribute("data-group");
          this.activeGroup = grp;
          document.querySelectorAll(".schedule-group-tab").forEach(t => {
            t.classList.remove("active-tab", "bg-cyan-500", "text-white");
            t.classList.add("text-slate-300");
          });
          e.currentTarget.classList.add("active-tab", "bg-cyan-500", "text-white");
          e.currentTarget.classList.remove("text-slate-300");
          this.renderSchedule();
        });
      });

      // Posters
    }

    toggleModal(modalId, show) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      if (show) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      } else {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    }

    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }

    // ===================== REGISTRATION & LOGIN =====================
    async handleRegistration(e) {
      e.preventDefault();
      const form = e.target;
      const errBox = document.getElementById("regErrorAlert");
      const submitBtn = document.getElementById("regSubmitBtn");
      errBox.classList.add("hidden");

      const name = form.studentName.value.trim();
      const grade = form.studentGrade.value.trim();
      const school = form.studentSchool.value.trim();
      const mobile = form.studentMobile.value.trim();
      const email = form.studentEmail.value.trim();
      const password = form.studentPassword.value.trim();
      const avatarUrl = form.regAvatarData?.value || "";

      if (!name || !grade || !school || !mobile || !email || !password) {
        errBox.textContent = this.lang === "ar" ? "يرجى تعبئة كافة الحقول الإلزامية المطلوبة." : "Please fill all required fields.";
        errBox.classList.remove("hidden");
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${this.lang === "ar" ? "جارٍ التسجيل..." : "Registering..."}`;

        const student = await db.register({ name, grade, school, mobile, email, password, avatar_url: avatarUrl });
        await this.refresh();

        if (window.confetti) {
          window.confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }

        this.currentUser = student;
        this.saveSession(student);

        this.showSuccessModal(student);
        form.reset();
        const av = document.getElementById("regAvatarData");
        if (av) av.value = ""; // hidden inputs are not cleared by reset()
        document.getElementById("regPhotoPreview")?.classList.add("hidden");
      } catch (err) {
        errBox.textContent = err.message || "Registration error";
        errBox.classList.remove("hidden");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>${this.t("btnSubmitRegistration")}</span> <i class="fa-solid fa-arrow-right rtl:rotate-180"></i>`;
      }
    }

    showSuccessModal(student) {
      document.getElementById("successStudentName").textContent = student.name;
      document.getElementById("successStudentEmail").textContent = student.email;
      document.getElementById("successStudentSchool").textContent = student.school;
      document.getElementById("successStudentGroup").textContent = student.group_name;
      document.getElementById("successStudentCode").textContent = student.qr_code_token;

      const qrBox = document.getElementById("successQrCanvas");
      if (qrBox) {
        qrBox.innerHTML = "";
        if (window.QRCode) {
          new window.QRCode(qrBox, {
            text: student.qr_code_token,
            width: 170,
            height: 170,
            colorDark: "#0d1127",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.H
          });
        }
      }

      document.getElementById("btnDownloadSuccessPass").onclick = () => this.downloadPass(student);
      document.getElementById("btnPrintSuccessPass").onclick = () => this.printPass(student);
      document.getElementById("btnSuccessToPortal").onclick = () => {
        this.toggleModal("regSuccessModal", false);
        this.showStudentPortal();
      };

      this.toggleModal("regSuccessModal", true);
    }

    async handleLogin(e) {
      e.preventDefault();
      const form = e.target;
      const email = form.loginEmail.value.trim().toLowerCase();
      const pass = form.loginPassword.value.trim();
      const errBox = document.getElementById("loginErrorAlert");
      errBox.classList.add("hidden");

      await this.refresh();
      const found = this.students.find(s => (s.email || "").toLowerCase() === email);
      const student = found && (await verifyPassword(found.password_hash, pass, email)) ? found : null;

      if (!student) {
        errBox.textContent = this.lang === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : "Invalid email or password.";
        errBox.classList.remove("hidden");
        return;
      }

      this.currentUser = student;
      this.saveSession(student);
      this.toggleModal("loginModal", false);
      form.reset();
      this.showStudentPortal();
    }

    showStudentPortalOrLogin() {
      if (this.currentUser) {
        this.showStudentPortal();
      } else {
        this.toggleModal("loginModal", true);
      }
    }

    showStudentPortal(scroll = true) {
      const portal = document.getElementById("studentPortalSection");
      if (portal) portal.classList.remove("hidden");
      if (scroll) this.scrollTo("studentPortalSection");
      this.renderPortal();
    }

    logoutStudent() {
      this.currentUser = null;
      localStorage.removeItem("hacktivators_current_user");
      document.getElementById("studentPortalSection")?.classList.add("hidden");
      document.getElementById("navUserBadge")?.classList.add("hidden");
      this.scrollTo("homeSection");
    }

    // ===================== PORTAL RENDERING =====================
    renderPortal() {
      if (!this.currentUser) return;

      const badge = document.getElementById("navUserBadge");
      if (badge) {
        badge.textContent = this.currentUser.name.split(" ")[0];
        badge.classList.remove("hidden");
      }

      document.getElementById("portalStudentName").textContent = this.currentUser.name;
      document.getElementById("portalStudentSchool").textContent = this.currentUser.school;
      document.getElementById("portalStudentGrade").textContent = this.currentUser.grade;
      document.getElementById("portalStudentEmail").textContent = this.currentUser.email;
      document.getElementById("portalStudentMobile").textContent = this.currentUser.mobile;
      document.getElementById("portalStudentGroup").textContent = this.currentUser.group_name;
      document.getElementById("portalQrCodeText").textContent = this.currentUser.qr_code_token;

      // Attendance status
      const statusEl = document.getElementById("portalAttendanceStatus");
      if (statusEl) {
        if (this.currentUser.attended) {
          statusEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
          statusEl.innerHTML = `<i class="fa-solid fa-check"></i> ${this.t("statusAttended")}`;
        } else {
          statusEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30";
          statusEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${this.t("statusNotAttended")}`;
        }
      }

      // Avatar
      const avatarEl = document.getElementById("portalAvatarImg");
      if (avatarEl) {
        avatarEl.src = this.currentUser.avatar_url || DEFAULT_AVATAR;
      }

      // QR Code
      const qrBox = document.getElementById("portalQrCanvas");
      if (qrBox) {
        qrBox.innerHTML = "";
        if (window.QRCode) {
          new window.QRCode(qrBox, {
            text: this.currentUser.qr_code_token,
            width: 180,
            height: 180,
            colorDark: "#0d1127",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.H
          });
        }
      }

      document.getElementById("btnDownloadMyPass").onclick = () => this.downloadPass(this.currentUser);
      document.getElementById("btnPrintMyPass").onclick = () => this.printPass(this.currentUser);

      // Change photo
      const changePhotoInput = document.getElementById("portalChangePhotoInput");
      if (changePhotoInput) {
        changePhotoInput.onchange = async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const url = await this.compressImage(file);
            await db.updatePhoto(this.currentUser.id, url);
            this.currentUser.avatar_url = url;
            this.saveSession(this.currentUser);
            if (avatarEl) avatarEl.src = url;
          } catch (err) { console.warn("Photo update failed", err); }
          e.target.value = "";
        };
      }

      this.renderPersonalizedSchedule();
      this.renderRatings();
    }

    renderPersonalizedSchedule() {
      const container = document.getElementById("myScheduleTimeline");
      if (!container || !this.currentUser) return;

      const grp = this.currentUser.group_name;
      const matrix = CONFIG.event.scheduleMatrix;

      let html = `<div class="grid grid-cols-1 md:grid-cols-4 gap-4">`;
      matrix.forEach((slot, index) => {
        const wId = slot.slots[grp];
        const w = CONFIG.event.workshops.find(item => item.id === wId);
        const timeStr = this.lang === "ar" ? slot.timeAr : slot.timeEn;
        const name = this.lang === "ar" ? w.nameAr : w.nameEn;
        const desc = this.lang === "ar" ? w.descAr : w.descEn;

        const colors = {
          purple: "from-purple-900/60 to-purple-950/80 border-purple-500/50 text-purple-300",
          amber: "from-amber-900/60 to-amber-950/80 border-amber-500/50 text-amber-300",
          cyan: "from-cyan-900/60 to-cyan-950/80 border-cyan-500/50 text-cyan-300",
          pink: "from-pink-900/60 to-pink-950/80 border-pink-500/50 text-pink-300"
        };

        html += `
          <div class="relative p-5 rounded-2xl border bg-gradient-to-b ${colors[w.color] || colors.cyan} shadow-lg backdrop-blur-sm transition-all hover:scale-105">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 border border-white/10">
                #${index + 1} • ${timeStr}
              </span>
              <i class="fa-solid fa-clock opacity-60"></i>
            </div>
            <h4 class="text-lg font-bold text-white mb-1">${name}</h4>
            <p class="text-xs text-white/70 line-clamp-2">${desc}</p>
          </div>
        `;
      });
      html += `</div>`;
      container.innerHTML = html;
    }

    renderRatings() {
      const container = document.getElementById("workshopRatingsContainer");
      if (!container || !this.currentUser) return;

      const ratings = this.currentUser.ratings || {};
      let html = `<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`;

      CONFIG.event.workshops.forEach(w => {
        const item = ratings[w.id] || { rating: 0, comment: "" };
        const stars = item.rating !== undefined ? item.rating : 0;
        const comment = item.comment || "";
        const name = this.lang === "ar" ? w.nameAr : w.nameEn;
        const desc = this.lang === "ar" ? w.descAr : w.descEn;

        html += `
          <div class="p-6 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="w-10 h-10 rounded-xl bg-${w.color}-500/20 text-${w.color}-400 flex items-center justify-center font-bold text-lg border border-${w.color}-500/30">
                  <i class="fa-solid ${w.icon}"></i>
                </span>
                <div>
                  <h4 class="text-lg font-bold text-white">${name}</h4>
                  <p class="text-xs text-slate-400 line-clamp-1">${desc}</p>
                </div>
              </div>

              <!-- Interactive Star Rating (0 to 5) -->
              <div class="my-4 p-3 rounded-xl bg-black/30 border border-white/5">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-medium text-slate-300">${this.t("starRatingLabel")}</label>
                  <span id="starVal_${w.id}" class="text-xs font-bold text-yellow-400">${stars} / 5</span>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" class="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white" onclick="window.hackApp.setRating('${w.id}', 0)">0 ★</button>
                  ${[1, 2, 3, 4, 5].map(st => `
                    <button type="button" class="text-2xl transition-transform hover:scale-125 focus:outline-none star-btn-${w.id}" data-star="${st}" onclick="window.hackApp.setRating('${w.id}', ${st})">
                      <i class="${st <= stars ? 'fa-solid text-yellow-400' : 'fa-regular text-slate-600'} fa-star"></i>
                    </button>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1.5">${this.t("commentLabel")}</label>
                <textarea 
                  id="comment_${w.id}" 
                  rows="2" 
                  class="w-full px-3 py-2 text-sm rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="${this.t("commentPlaceholder")}"
                >${esc(comment)}</textarea>
              </div>
            </div>
          </div>
        `;
      });
      html += `</div>`;

      html += `
        <div class="mt-6 flex justify-end">
          <button id="btnSaveAllRatings" type="button" class="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2" onclick="window.hackApp.handleSaveRatings()">
            <i class="fa-solid fa-floppy-disk"></i>
            <span>${this.t("btnSaveRatings")}</span>
          </button>
        </div>
      `;

      container.innerHTML = html;
    }

    setRating(wId, star) {
      if (!this.currentUser) return;
      if (!this.currentUser.ratings) this.currentUser.ratings = {};
      if (!this.currentUser.ratings[wId]) this.currentUser.ratings[wId] = { rating: star, comment: "" };
      else this.currentUser.ratings[wId].rating = star;

      const badge = document.getElementById(`starVal_${wId}`);
      if (badge) badge.textContent = `${star} / 5`;

      document.querySelectorAll(`.star-btn-${wId}`).forEach(btn => {
        const val = parseInt(btn.getAttribute("data-star") || "0", 10);
        const icon = btn.querySelector("i");
        if (icon) {
          icon.className = val <= star ? "fa-solid fa-star text-yellow-400" : "fa-regular fa-star text-slate-600";
        }
      });
    }

    async handleSaveRatings() {
      if (!this.currentUser) return;
      const payload = {};
      CONFIG.event.workshops.forEach(w => {
        const star = this.currentUser.ratings?.[w.id]?.rating || 0;
        const txt = document.getElementById(`comment_${w.id}`)?.value.trim() || "";
        payload[w.id] = { rating: star, comment: txt };
      });

      const btn = document.getElementById("btnSaveAllRatings");
      if (btn) btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

      const saveRes = await db.saveRatings(this.currentUser.id, payload);
      this.currentUser.ratings = payload;
      this.saveSession(this.currentUser);

      if (btn) {
        const okMsg = saveRes.synced ? this.t("ratingsSavedSuccess") : (this.lang === "ar" ? "تم الحفظ على هذا الجهاز فقط (تعذّر الاتصال بقاعدة البيانات)" : "Saved on this device only (database unreachable)");
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${esc(okMsg)}`;
        setTimeout(() => {
          btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>${this.t("btnSaveRatings")}</span>`;
        }, 2500);
      }
    }

    // ===================== SCHEDULE MATRIX =====================
    renderSchedule() {
      const tbody = document.getElementById("scheduleTableBody");
      if (!tbody) return;

      const matrix = CONFIG.event.scheduleMatrix;
      const workshops = CONFIG.event.workshops;
      const wMap = {};
      workshops.forEach(w => { wMap[w.id] = w; });

      const curGrp = this.activeGroup;
      ["A", "B", "C", "D"].forEach((g) => document.querySelectorAll(".schedule-col-" + g).forEach((el) => el.classList.toggle("hidden", curGrp !== "ALL" && curGrp !== g)));
      let html = "";

      matrix.forEach(row => {
        const timeStr = this.lang === "ar" ? row.timeAr : row.timeEn;
        html += `<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">`;
        html += `
          <td class="p-4 font-bold text-sm text-cyan-400 whitespace-nowrap bg-black/20">
            <div class="flex items-center gap-2">
              <i class="fa-regular fa-clock"></i>
              <span>${timeStr}</span>
            </div>
          </td>
        `;

        ["A", "B", "C", "D"].forEach(grp => {
          if (curGrp !== "ALL" && curGrp !== grp) return;
          const w = wMap[row.slots[grp]];
          const name = this.lang === "ar" ? w.nameAr : w.nameEn;

          const colorBadges = {
            purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
            amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
            cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
            pink: "bg-pink-500/20 text-pink-300 border-pink-500/30"
          };

          html += `
            <td class="p-4">
              <div class="p-3 rounded-xl border ${colorBadges[w.color] || colorBadges.cyan} backdrop-blur-sm transition-all hover:scale-[1.02]">
                <span class="block text-xs font-semibold uppercase opacity-60 mb-1">
                  ${this.lang === "ar" ? "المجموعة" : "Group"} ${grp}
                </span>
                <span class="font-bold text-sm block">${name}</span>
              </div>
            </td>
          `;
        });
        html += `</tr>`;
      });

      tbody.innerHTML = html;
    }

    renderFeaturedWorkshops() {
      const container = document.getElementById("featuredWorkshopsList");
      if (!container) return;

      let html = "";
      CONFIG.event.workshops.forEach(w => {
        const name = this.lang === "ar" ? w.nameAr : w.nameEn;
        const desc = this.lang === "ar" ? w.descAr : w.descEn;

        html += `
          <div class="p-6 rounded-2xl border border-white/10 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-md hover:border-cyan-500/40 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl mb-4 border border-cyan-500/20">
              <i class="fa-solid ${w.icon}"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">${name}</h3>
            <p class="text-sm text-slate-400 leading-relaxed">${desc}</p>
          </div>
        `;
      });
      container.innerHTML = html;
    }

    // ===================== ADMIN DASHBOARD =====================
    showAdminSection(scroll = true) {
      const wrapper = document.getElementById("adminSectionWrapper");
      if (wrapper && scroll) this.scrollTo("adminSectionWrapper");

      if (this.isAdmin) {
        document.getElementById("adminLockSection")?.classList.add("hidden");
        document.getElementById("adminDashboardSection")?.classList.remove("hidden");
        this.renderAdmin();
      } else {
        document.getElementById("adminLockSection")?.classList.remove("hidden");
        document.getElementById("adminDashboardSection")?.classList.add("hidden");
      }
    }

    handleAdminUnlock(e) {
      e.preventDefault();
      const input = document.getElementById("adminPassInput");
      const errBox = document.getElementById("adminAuthError");
      errBox.classList.add("hidden");

      if (input.value.trim() === CONFIG.adminPasscode) {
        this.isAdmin = true;
        sessionStorage.setItem("hacktivators_admin_auth", "true");
        document.getElementById("adminLockSection")?.classList.add("hidden");
        document.getElementById("adminDashboardSection")?.classList.remove("hidden");
        input.value = "";
        this.renderAdmin();
      } else {
        errBox.textContent = this.t("adminWrongPass");
        errBox.classList.remove("hidden");
      }
    }

    logoutAdmin() {
      this.isAdmin = false;
      sessionStorage.removeItem("hacktivators_admin_auth");
      document.getElementById("adminLockSection")?.classList.remove("hidden");
      document.getElementById("adminDashboardSection")?.classList.add("hidden");
      this.stopScanner();
    }

    async renderAdmin() {
      await this.refresh(); // refresh() already re-renders the admin views
    }

    renderAdminViews() {
      this.renderAdminStats();
      this.renderStudentsTable();
    }

    renderAdminStats() {
      const total = this.students.length;
      const attended = this.students.filter(s => s.attended).length;
      const rate = total > 0 ? Math.round((attended / total) * 100) : 0;

      const grpCounts = { A: 0, B: 0, C: 0, D: 0 };
      let sum = 0, count = 0;

      this.students.forEach(s => {
        if (grpCounts[s.group_name] !== undefined) grpCounts[s.group_name]++;
        if (s.ratings) {
          Object.values(s.ratings).forEach(r => {
            if (r && r.rating !== undefined) {
              sum += r.rating;
              count++;
            }
          });
        }
      });

      const avg = count > 0 ? (sum / count).toFixed(1) : null;

      document.getElementById("statTotalStudentsVal").textContent = total;
      document.getElementById("statAttendedVal").textContent = attended;
      document.getElementById("statAttendanceRateVal").textContent = `${rate}%`;
      document.getElementById("statAvgRatingVal").textContent = avg === null ? "—" : `${avg} ★`;

      document.getElementById("statGroupAVal").textContent = grpCounts.A;
      document.getElementById("statGroupBVal").textContent = grpCounts.B;
      document.getElementById("statGroupCVal").textContent = grpCounts.C;
      document.getElementById("statGroupDVal").textContent = grpCounts.D;
    }

    renderStudentsTable() {
      const tbody = document.getElementById("adminStudentsTableBody");
      if (!tbody) return;

      let list = [...this.students];

      // Filters
      if (this.filter.search) {
        const q = this.filter.search.toLowerCase();
        list = list.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.school.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.mobile || "").includes(q) ||
          s.qr_code_token.toLowerCase().includes(q)
        );
      }
      if (this.filter.group !== "ALL") {
        list = list.filter(s => s.group_name === this.filter.group);
      }
      if (this.filter.status === "ATTENDED") {
        list = list.filter(s => s.attended);
      } else if (this.filter.status === "PENDING") {
        list = list.filter(s => !s.attended);
      }

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-10 text-slate-400">
              <i class="fa-solid fa-user-slash text-2xl mb-2 block opacity-40"></i>
              No students match the criteria.
            </td>
          </tr>
        `;
        return;
      }

      let html = "";
      list.forEach(s => {
        const photo = s.avatar_url || DEFAULT_AVATAR;
        const statusBadge = s.attended
          ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><i class="fa-solid fa-check mr-1"></i> Attended</span>`
          : `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700/50 text-slate-400 border border-slate-600"><i class="fa-regular fa-clock mr-1"></i> Pending</span>`;

        const rArr = s.ratings ? Object.entries(s.ratings) : [];
        let rBadge = `<span class="text-xs text-slate-500">None yet</span>`;
        if (rArr.length > 0) {
          const avg = (rArr.reduce((acc, curr) => acc + (curr[1].rating || 0), 0) / rArr.length).toFixed(1);
          rBadge = `<button class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold hover:scale-105" data-action="view" data-id="${esc(s.id)}">${avg} ★ (${rArr.length})</button>`;
        }

        const grpColors = {
          A: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
          B: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          C: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          D: "bg-amber-500/20 text-amber-300 border-amber-500/40"
        };

        html += `
          <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td class="p-3">
              <div class="flex items-center gap-3">
                <img src="${esc(photo)}" alt="" class="w-10 h-10 rounded-full object-cover border border-white/20">
                <div>
                  <p class="font-bold text-sm text-white">${esc(s.name)}</p>
                  <p class="text-xs text-cyan-400 font-mono">${esc(s.qr_code_token)}</p>
                </div>
              </div>
            </td>
            <td class="p-3 text-xs text-slate-300">
              <div class="font-semibold text-white">${esc(s.grade)}</div>
              <div class="text-slate-400">${esc(s.school)}</div>
            </td>
            <td class="p-3 text-xs text-slate-300">
              <div><i class="fa-solid fa-phone text-xs text-slate-400 mr-1"></i> ${esc(s.mobile)}</div>
              <div class="text-slate-400 truncate max-w-[160px]"><i class="fa-regular fa-envelope text-xs mr-1"></i> ${esc(s.email)}</div>
            </td>
            <td class="p-3">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold border ${grpColors[s.group_name] || grpColors.A}">
                Group ${esc(s.group_name)}
              </span>
            </td>
            <td class="p-3">${statusBadge}</td>
            <td class="p-3">${rBadge}</td>
            <td class="p-3">
              <div class="flex items-center gap-2">
                <button title="Toggle Attendance" class="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white transition-all text-xs" data-action="toggle-attendance" data-id="${esc(s.id)}">
                  <i class="fa-solid fa-clipboard-check"></i>
                </button>
                <button title="View Details" class="p-2 rounded-lg bg-slate-800 hover:bg-cyan-600 text-white transition-all text-xs" data-action="view" data-id="${esc(s.id)}">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button title="Delete" class="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-red-400 hover:text-white transition-all text-xs" data-action="delete" data-id="${esc(s.id)}">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = html;
    }

    async toggleAttendance(id) {
      const res = await db.setAttendance(id, "toggle");
      if (res.success) {
        await this.refresh();
      }
    }

    async confirmDelete(id) {
      if (confirm(this.t("confirmDelete"))) {
        await db.deleteStudent(id);
        await this.refresh();
      }
    }

    viewStudentDetails(id) {
      const s = this.students.find(it => it.id === id);
      if (!s) return;

      document.getElementById("detailModalName").textContent = s.name;
      document.getElementById("detailModalSchool").textContent = `${s.school} • ${s.grade}`;
      document.getElementById("detailModalEmail").textContent = s.email;
      document.getElementById("detailModalMobile").textContent = s.mobile;
      document.getElementById("detailModalGroup").textContent = `Group ${s.group_name}`;
      document.getElementById("detailModalStatus").textContent = s.attended ? "Attended" : "Pending Check-in";
      document.getElementById("detailModalToken").textContent = s.qr_code_token;

      const img = document.getElementById("detailModalPhoto");
      if (img) img.src = s.avatar_url || DEFAULT_AVATAR;

      const listContainer = document.getElementById("detailModalRatingsList");
      if (listContainer) {
        const rMap = s.ratings || {};
        let rHtml = "";
        CONFIG.event.workshops.forEach(w => {
          const item = rMap[w.id];
          const st = item ? item.rating : 0;
          const comm = (item && item.comment) || "No feedback submitted yet.";
          const name = this.lang === "ar" ? w.nameAr : w.nameEn;

          rHtml += `
            <div class="p-3 rounded-xl bg-slate-900 border border-white/5">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-sm text-white">${name}</span>
                <span class="text-xs font-bold text-yellow-400">${st} / 5 ★</span>
              </div>
              <p class="text-xs text-slate-400 italic">"${esc(comm)}"</p>
            </div>
          `;
        });
        listContainer.innerHTML = rHtml;
      }

      this.toggleModal("studentDetailModal", true);
    }

    async handleManualAdd(e) {
      e.preventDefault();
      const form = e.target;
      const name = form.manualName.value.trim();
      const grade = form.manualGrade.value.trim();
      const school = form.manualSchool.value.trim();
      const mobile = form.manualMobile.value.trim();
      const email = form.manualEmail.value.trim();
      const group = form.manualGroup.value;

      try {
        await db.register({ name, grade, school, mobile, email, group_name: group, password: "" });
        await this.refresh();
        this.toggleModal("manualAddModal", false);
        form.reset();
      } catch (err) {
        alert(err.message);
      }
    }

    // ===================== QR CODE SCANNER =====================
    startScanner() {
      if (this.isScanning) return;
      if (!window.Html5Qrcode) { alert("Scanner library failed to load. Check your internet connection and reload."); return; }
      {
        this.qrScanner = new window.Html5Qrcode("qrReaderContainer");
        this.qrScanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decoded) => this.onScanSuccess(decoded),
          () => {}
        ).then(() => {
          this.isScanning = true;
          document.getElementById("btnStartQrScanner")?.classList.add("hidden");
          document.getElementById("btnStopQrScanner")?.classList.remove("hidden");
        }).catch(err => {
          alert("Camera could not be started: " + err);
        });
      }
    }

    stopScanner() {
      if (this.qrScanner && this.isScanning) {
        this.qrScanner.stop().then(() => {
          this.isScanning = false;
          document.getElementById("btnStartQrScanner")?.classList.remove("hidden");
          document.getElementById("btnStopQrScanner")?.classList.add("hidden");
        }).catch(console.error);
      }
    }

    async handleQrFile(e) {
      const file = e.target.files?.[0];
      if (!file || !window.Html5Qrcode) return;
      const scanner = new window.Html5Qrcode("qrReaderContainer");
      try {
        const decoded = await scanner.scanFile(file, true);
        this.onScanSuccess(decoded);
      } catch (err) {
        alert("No valid QR detected in this image: " + err);
      } finally {
        e.target.value = "";
      }
    }

    handleManualCheckin() {
      const code = document.getElementById("manualCodeInput")?.value.trim();
      if (code) {
        this.onScanSuccess(code);
        document.getElementById("manualCodeInput").value = "";
      }
    }

    async onScanSuccess(decoded) {
      this.beep();
      const res = await db.setAttendance(decoded, "checkin");
      const alertBox = document.getElementById("scannerFeedbackAlert");

      if (res.success) {
        await this.refresh();
        if (alertBox) {
          alertBox.className = "p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3";
          alertBox.innerHTML = `
            <i class="fa-solid fa-circle-check text-2xl"></i>
            <div>
              <div class="font-bold text-white">${esc(res.student.name)} (${esc(res.student.group_name)})</div>
              <div class="text-xs">${res.already ? (this.lang === "ar" ? "مسجّل حضوره مسبقاً" : "Already checked in") : this.t("checkinSuccessMsg")} • ${new Date().toLocaleTimeString()}</div>
            </div>
          `;
          alertBox.classList.remove("hidden");
        }
        if (window.confetti) window.confetti({ particleCount: 50, spread: 50 });
      } else {
        if (alertBox) {
          alertBox.className = "p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm flex items-center gap-3";
          alertBox.innerHTML = `
            <i class="fa-solid fa-circle-exclamation text-2xl"></i>
            <div>
              <div class="font-bold text-white">${this.t("studentNotFound")}</div>
              <div class="text-xs">Scanned Code: ${esc(decoded)}</div>
            </div>
          `;
          alertBox.classList.remove("hidden");
        }
      }
    }

    beep() {
      try {
        const ctx = (this._audioCtx = this._audioCtx || new (window.AudioContext || window.webkitAudioContext)());
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 850;
        gain.gain.value = 0.25;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (e) {}
    }

    printPass(student) {
      if (!student) return;
      let area = document.getElementById("printArea");
      if (!area) { area = document.createElement("div"); area.id = "printArea"; document.body.appendChild(area); }
      area.innerHTML = `<div style="font-family:sans-serif;max-width:520px;margin:24px auto;padding:24px;border:3px solid #0d1127;border-radius:16px;text-align:center;color:#0d1127;background:#fff">
        <h1 style="margin:0;font-size:28px">HACKTIVATORS</h1>
        <h2 style="margin:4px 0 16px;font-size:18px;color:#0891b2">HACK-DAY EVENT PASS</h2>
        <p style="font-size:22px;margin:6px 0"><b>${esc(student.name)}</b></p>
        <p style="margin:4px 0">${esc(student.school)} (${esc(student.grade)})</p>
        <p style="margin:4px 0">Group <b>${esc(student.group_name)}</b></p>
        <div id="printQr" style="display:flex;justify-content:center;margin:16px 0"></div>
        <p style="font-family:monospace;font-size:18px;margin:4px 0">${esc(student.qr_code_token)}</p>
        <p style="font-size:12px;color:#475569">4 Hours Continuous • 8:00 AM - 12:00 PM</p></div>`;
      if (window.QRCode) new window.QRCode(area.querySelector("#printQr"), { text: student.qr_code_token, width: 200, height: 200, correctLevel: window.QRCode.CorrectLevel.H });
      setTimeout(() => window.print(), 150);
    }

    // ===================== DOWNLOAD PASS =====================
    downloadPass(student) {
      const canvas = document.createElement("canvas");
      canvas.width = 650;
      canvas.height = 900;
      const ctx = canvas.getContext("2d");

      // BG Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 900);
      grad.addColorStop(0, "#0d1127");
      grad.addColorStop(1, "#070913");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 650, 900);

      // Neon frame
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 6;
      ctx.strokeRect(15, 15, 620, 870);

      // Top color bar
      const topGrad = ctx.createLinearGradient(20, 20, 630, 20);
      topGrad.addColorStop(0, "#8b5cf6");
      topGrad.addColorStop(1, "#00f0ff");
      ctx.fillStyle = topGrad;
      ctx.fillRect(20, 20, 610, 15);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("HACKTIVATORS", 325, 90);

      ctx.fillStyle = "#00f0ff";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("HACK-DAY EVENT PASS", 325, 130);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText("INNOVATION • TECHNOLOGY • IMPACT", 325, 160);

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, 190);
      ctx.lineTo(600, 190);
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText("ATTENDEE NAME:", 60, 235);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(student.name, 60, 270);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText("SCHOOL / INSTITUTION:", 60, 320);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "18px sans-serif";
      ctx.fillText(`${student.school} (${student.grade})`, 60, 350);

      // Group block
      ctx.fillStyle = "#8b5cf6";
      ctx.fillRect(450, 220, 140, 90);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("GROUP", 520, 250);
      ctx.font = "bold 36px sans-serif";
      ctx.fillText(student.group_name, 520, 295);

      const qrDiv = document.createElement("div");
      new window.QRCode(qrDiv, {
        text: student.qr_code_token,
        width: 260,
        height: 260,
        colorDark: "#0d1127",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H
      });

      setTimeout(() => {
        const qrImg = qrDiv.querySelector("canvas") || qrDiv.querySelector("img");
        if (qrImg) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(175, 420, 300, 300);
          ctx.drawImage(qrImg, 195, 440, 260, 260);
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "#00f0ff";
        ctx.font = "bold 20px monospace";
        ctx.fillText(student.qr_code_token, 325, 760);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px sans-serif";
        ctx.fillText("Show this QR pass at the entrance gate", 325, 800);

        ctx.fillStyle = "#64748b";
        ctx.font = "12px sans-serif";
        ctx.fillText("4 Hours Continuous • 8:00 AM - 12:00 PM • يوم الهاك", 325, 840);

        const a = document.createElement("a");
        a.download = `Hacktivators-Pass-${student.group_name}-${student.name.replace(/\s+/g, "_")}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      }, 200);
    }

    exportCSV() {
      if (this.students.length === 0) {
        alert("No records to export.");
        return;
      }
      const headers = [
        "Student ID", "Name", "Grade", "School", "Mobile", "Email", 
        "Group", "QR Token", "Attended", "Attended At", 
        "Emotional Intelligence Rating", "Emotional Intelligence Comment",
        "Block Programming Rating", "Block Programming Comment",
        "Game Dev Rating", "Game Dev Comment",
        "Design Basics Rating", "Design Basics Comment"
      ];
      const cell = (v) => {
        let t = String(v ?? "");
        if (/^[=@\t\r]|^[+\-](?![\d\s()-]+$)/.test(t)) t = "'" + t; // block spreadsheet formula injection
        return `"${t.replace(/"/g, '""')}"`;
      };
      const wids = ["emotional_intelligence", "block_programming", "game_dev", "design_basics"];
      const rows = this.students.map(s => {
        const r = s.ratings || {};
        return [s.id, s.name, s.grade, s.school, s.mobile, s.email, s.group_name, s.qr_code_token,
          s.attended ? "YES" : "NO", s.attended_at || "",
          ...wids.flatMap(w => [r[w]?.rating ?? "", r[w]?.comment || ""])].map(cell).join(",");
      });

      const csv = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Hacktivators_Students_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  // Instant global exposure
  window.hackApp = new AppController();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.hackApp.init());
  } else {
    window.hackApp.init();
  }

})();

  