# 🚀 Hacktivators Team • منصة يوم الهاك (Hack-Day Platform)

Official event registration, attendance management, and interactive workshop schedule platform for the **Hacktivators** team.

---

## ✨ Features Implemented

1. **Student Registration System**:
   - Collects all required fields: **Full Name**, **Grade**, **School**, **Mobile Number**, and **Email Address**.
   - Account password configuration for student portal access.
   - Profile photo upload with live preview.
   - Smart balanced allocation across 4 groups: **Group A**, **Group B**, **Group C**, and **Group D**.
   - Unique Ticket ID & QR Code generation (e.g. `HACK-A-1001`).
   - Instant confirmation popup with downloadable/printable high-resolution Event Pass.

2. **Personal Student Portal / Account**:
   - Student Login and Logout with persistent session.
   - Profile photo management.
   - Assigned Group badge.
   - Real-time attendance check-in status (Attended / Pending).
   - Official QR Code Pass for event gate verification.
   - **Personalized Day Schedule**: Hour-by-hour room rotations tailored specifically to the student's assigned group.
   - **Interactive Workshop Ratings (0 to 5 Stars)** & Comments for all 4 workshops:
     1. *Emotional Intelligence* (الذكاء العاطفي)
     2. *Block-based Programming* (البرمجة باستخدام البلوكات)
     3. *Game Development* (تطوير الألعاب)
     4. *Design Basics* (أساسيات التصميم)

3. **Digital Interactive Schedule of the Day**:
   - Exact digital representation of the official event poster:
     - 4 continuous hours (8:00 AM – 12:00 PM) without breaks.
     - 4 groups rotation matrix.
     - Group filter tabs (All Groups, Group A, Group B, Group C, Group D).
     - Workshop descriptions and cards.
     - Built-in viewer for the original high-resolution event poster.

4. **Dedicated Admin Dashboard**:
   - Protected with admin passcode (`admin2026`).
   - Live KPI Counters: Total Registered, Checked-in Students, Attendance Rate %, Group Distribution, Workshop Average Rating.
   - **Live QR Code Camera Scanner**:
     - Instant check-in via mobile or webcam camera.
     - Image file scanner for QR tickets.
     - Manual ticket code verification.
     - Audio feedback beep + instant attendance timestamp logging.
   - Searchable, filterable students directory table.
   - **Manual Student Walk-in Registration** (Add student manually).
   - **Delete Student** capability.
   - **Full Student Details & Workshop Feedback Inspector**.
   - **Export to CSV / Excel** with UTF-8 BOM for perfect Arabic display.

5. **Supabase Integration**:
   - Configured with project `mwqohvrgimpfyduaxrow` using the provided anon & publishable keys.
   - Seamless offline-first architecture with automatic sync.
   - Included SQL migration file `supabase_schema.sql` with ready-to-run tables and RLS security policies.

6. **Bilingual (Arabic & English) + Themes**:
   - Full English and Arabic translations for every label and message.
   - Native RTL support for Arabic, LTR for English.
   - Cyber Dark Mode ("Black") and Crisp Light Mode ("White").
   - Official glowing Hacktivators shield branding.

---

## 🏃 Quick Start Guide

### 1. Launch the Server
In PowerShell or Terminal:
```bash
cd C:\Users\Ahmed\.gemini\antigravity\scratch\hacktivators-event
node server.js
```
Open your browser at:
👉 **`http://localhost:3000`**

### 2. Admin Access
- Passcode: `admin2026`

### 3. Supabase Schema Setup (1-Click)
1. Go to your [Supabase Dashboard SQL Editor](https://supabase.com/dashboard/project/mwqohvrgimpfyduaxrow/sql).
2. Copy the contents of [`supabase_schema.sql`](file:///C:/Users/Ahmed/.gemini/antigravity/scratch/hacktivators-event/supabase_schema.sql) and click **Run**.
