# **📚 Digital Library Logbook Management System**

## **Capstone Project Feature Specification (Approved Modules)**

*University Digital Library System | red Theme | Clean Modern UI | Rounded Corners*  
*Platform: Android Mobile App (Users) \+ Windows Desktop App (Librarian)*  
---

## **🔐 MODULE 1: User Management & Authentication**

*Handles user registration, login, and role-based access control*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Role-Based Login** | Separate interfaces for Librarian, Student, Faculty, Visitor with tailored permissions | Both | 🔴 High |
| **Manual Registration** | Students, faculty, and visitors register manually with required fields: Name, ID Number, Email, Program/Department, Password | Mobile | 🔴 High |
| **Login & Session Management** | Secure login with encrypted credentials; auto-logout after inactivity | Both | 🔴 High |
| **Guest/Visitor Mode** | Temporary account creation for visitors with time-limited QR access | Mobile | 🟡 Medium |
| **Profile Management** | Users can view/edit personal info, change password, view borrowing history | Mobile | 🟢 Low |

---

## **📖 MODULE 2: Digital Catalog & Resource Management**

*Core library operations: cataloging, search, inventory for multiple resource types*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Smart Search** | Keyword, ISBN, author, subject, category filters \+ autocomplete suggestions | Both | 🔴 High |
| **Multi-Category Catalog** | Support for 3 resource types: **Books**, **Research/Literature**, **Magazines** with distinct metadata fields | Desktop | 🔴 High |
| **Resource Cataloging** | Add/edit entries with metadata: title, author, ISBN/ISSN, category, copies, shelf location, abstract (for research) | Desktop | 🔴 High |
| **QR-Encoded Resource Tags** | Generate AES-256 encrypted QR codes per item copy for secure check-out | Desktop | 🔴 High |
| **Real-Time Availability** | Live status: Available / Borrowed / Reserved / Under Maintenance / Reference-Only | Both | 🔴 High |
| **Batch Import/Export** | CSV/Excel upload for bulk resource registration; export catalog backups | Desktop | 🟢 Low |

---

## **🔄 MODULE 3: Borrowing & Return Transactions**

*Automated circulation management with student-initiated scanning*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Student-Initiated QR Checkout** | Student scans book/resource QR via mobile app → request sent to librarian dashboard → Librarian approves/rejects on desktop | Both | 🔴 High |
| **Librarian Approval Dashboard** | Real-time queue of pending checkout requests with student info, item details, and approve/reject buttons | Desktop | 🔴 High |
| **Auto Due Date Assignment** | System assigns return date based on user role (Student: 14 days, Faculty: 30 days) | Both | 🔴 High |
| **One-Tap Return Processing** | Librarian scans item QR → instantly mark returned, update inventory, close transaction | Desktop | 🔴 High |
| **Reservation System** | Students can reserve unavailable items; receive notification when available | Mobile | 🟡 Medium |
| **Borrowing Limits Enforcement** | Configurable max items per user type; block checkout if limit exceeded | Both | 🟡 Medium |
| **Late Return Tracking (No Fines)** | System logs late returns for analytics and user history, but **no monetary fines** applied | Both | 🟡 Medium |

---

## **📍 MODULE 4: QR Logbook & Attendance System**

*QR-based library attendance tracking with time-in/time-out*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Dynamic Attendance QR** | Librarian generates time-bound QR (valid 5-15 mins) displayed on desktop for users to scan | Desktop | 🔴 High |
| **User QR Scan (Time-In/Out)** | Users scan attendance QR via mobile app → logs entry/exit with timestamp and device ID | Mobile | 🔴 High |
| **Anti-Cheat Measures** | Device fingerprinting \+ optional location validation to prevent proxy scanning | Mobile | 🟡 Medium |
| **Session Duration Tracking** | Auto-calculate study duration; flag unusual patterns for analytics | Both | 🟢 Low |
| **Attendance Dashboard** | Visual calendar view of user library visits; filter by department, date range; exportable logs | Desktop | 🟡 Medium |
| **Eligibility Reports** | Auto-generate attendance % reports for academic departments (e.g., 80% requirement) | Desktop | 🟡 Medium |

---

## **💡 MODULE 5: Personalized Recommendations (NEW)**

*AI-lite suggestion engine for enhanced user engagement*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Program-Based Suggestions** | Algorithm recommends resources based on user's academic program/department (e.g., Engineering students see technical literature) | Mobile | 🟡 Medium |
| **Borrowing History Insights** | "Because you borrowed X, you might like Y" suggestions on mobile home page | Mobile | 🟢 Low |
| **Trending in Your Department** | Showcase most-borrowed items within the user's college/program | Mobile | 🟢 Low |
| **Manual Preference Tags** | Users can optionally select interest tags (e.g., "AI", "Literature", "Business") to refine suggestions | Mobile | 🟢 Low |

---

## **🔒 MODULE 6: Security & Data Protection**

*Ensuring privacy, integrity, and ethical data handling*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **AES-256 QR Encryption** | All QR codes embed encrypted payloads (user ID, timestamp, session token, item ID) | Both | 🔴 High |
| **Data Minimization Policy** | Collect only essential registration data; anonymize analytics for reporting | Backend | 🔴 High |
| **Audit Logs** | Immutable log of all librarian/admin actions (item edits, user changes, report exports) | Desktop | 🟡 Medium |
| **Privacy Compliance Framework** | Clear consent flow during registration; user data export/delete request handling | Both | 🟡 Medium |
| **Secure Session Handling** | Token-based authentication; auto-logout after configurable inactivity period | Both | 🟢 Low |

---

## **📊 MODULE 7: Reporting & Analytics**

*Actionable insights for librarians and academic administrators*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Circulation Reports** | Most borrowed items, peak usage hours, department-wise borrowing trends | Desktop | 🔴 High |
| **Attendance Analytics** | Heatmaps of library traffic, average stay duration, repeat visitor rates by program | Desktop | 🟡 Medium |
| **Custom Report Builder** | Filter reports by date range, department, resource type, user role; export to PDF/CSV | Desktop | 🟡 Medium |
| **Low-Engagement Alerts** | Auto-flag users with minimal library activity; optional gentle notification via app | Mobile | 🟢 Low |
| **Inventory Health Dashboard** | Flag damaged/lost items, low-stock categories, maintenance needs | Desktop | 🟢 Low |

---

## **🔔 MODULE 8: Notifications & Communication**

*Proactive, user-friendly engagement*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Due Date Reminders** | Push/email notifications 3 days & 1 day before return deadline | Mobile | 🔴 High |
| **Reservation Alerts** | Notify when reserved item becomes available for pickup | Mobile | 🟡 Medium |
| **System Announcements** | Librarian can broadcast library hours, closures, events to all users | Both | 🟢 Low |
| **In-App Inquiry Form** | Users can submit questions to librarian; responses visible in app notification center | Mobile | 🟢 Low |

---

## **⚙️ MODULE 9: Admin & System Configuration**

*Backend control for librarians and IT staff*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Role & Permission Manager** | Customize access levels for Student, Faculty, Visitor, Staff roles | Desktop | 🔴 High |
| **Resource Category Manager** | Add/edit categories (Books, Research/Literature, Magazines) with custom metadata fields | Desktop | 🟡 Medium |
| **Theme & UI Settings** | Configure red theme variants, corner radius, font preferences (admin-only) | Desktop | 🟡 Medium |
| **QR Validity Configuration** | Set duration for attendance QR codes (e.g., 5/10/15 mins) | Desktop | 🟡 Medium |
| **Backup & Restore Utility** | Schedule automated database backups; one-click restore functionality | Desktop | 🟡 Medium |
| **Recommendation Engine Settings** | Adjust suggestion algorithm weights (program relevance vs. popularity vs. recency) | Desktop | 🟢 Low |

---

## **🎨 UI/UX Implementation Guidelines**

*Aligned with red theme and human-centered design values*  
markdown  
---

## **🚀 Recommended Development Phasing (Capstone Timeline)**

| Phase | Modules | Key Deliverables | Timeline |
| ----- | ----- | ----- | ----- |
| **Phase 1 (MVP Core)** | Module 1 (Auth) \+ Module 2 (Catalog) \+ Module 3 (Borrow/Return) \+ Module 4 (Attendance) | Working prototype: manual registration, QR checkout flow, attendance logging | Weeks 1-6 |
| **Phase 2 (Enhance)** | Module 5 (Recommendations) \+ Module 7 (Reporting) \+ Module 8 (Notifications) | Personalized suggestions, analytics dashboard, reminder system | Weeks 7-10 |
| **Phase 3 (Polish)** | Module 6 (Security) \+ Module 9 (Admin) \+ UI Theming | AES encryption, role management, red theme implementation, accessibility checks | Weeks 11-14 |
| **Phase 4 (Demo Ready)** | Integration Testing \+ User Acceptance Testing | End-to-end demo script, test reports, final documentation | Weeks 15-16 |

---

## **📋 Quick Reference: Feature Priority Legend**

| Priority | Meaning | Action |
| ----- | ----- | ----- |
| 🔴 High | Critical for MVP; core functionality | Implement in Phase 1 |
| 🟡 Medium | Important for usability; enhances value | Implement in Phase 2-3 |
| 🟢 Low | Nice-to-have; polish or stretch goals | Implement if time permits |

---

**Project Vision**: *"A human-centered digital library system that makes academic resources faster to access, easier to discover, and more inclusive for all university community members — built with ethics, privacy, and clean design at its core."*  
---

*Document Version: 1.1 (Approved)*  
*Last Updated: \[Insert Date\]*  
*Prepared for: \[University Name\] Capstone Project*  
*Team: \[Your Team Name\]*  
---

💡 **Google Docs Tip**: Paste this Markdown content directly into Google Docs. For best results:

1. Use *Paste without formatting* (Ctrl+Shift+V)  
2. Apply "Heading 1", "Heading 2" styles to section titles for automatic table of contents  
3. Tables will auto-format; adjust column widths as needed  
4. Use the red color code `#800000` for heading text to match your theme

Let me know if you need this exported as a .docx template or if you'd like wireframe references for any module\! 🎓✨

list down all the approve modules along with the updated list properly md file that can be paste to google docs with proper headings also include the overall overview of the system

Thinking completed

# **📚 Digital Library Logbook Management System**

## **Capstone Project: Complete Feature Specification**

**Document Type**: Approved Feature Specification  
**Version**: 2.0 (Final)  
**Theme**: red (\#800000) | Clean Modern UI | Rounded Corners  
**Platforms**: Android Mobile App (Users) \+ Windows Desktop App (Librarian)  
---

## **🌐 SYSTEM OVERVIEW**

### **Project Title**

**Digital Library Logbook Management System for \[University Name\]**

### **Problem Statement**

Manual library operations at the university are slow, error-prone, and lack real-time visibility. Students face long queues for borrowing/returning books, attendance logging is inconsistent, and librarians struggle with fragmented record-keeping. There is no centralized digital system to manage resources, track usage, or personalize the library experience.

### **Solution Vision**

A cross-platform digital ecosystem that **automates**, **secures**, and **personalizes** university library operations through:

* ✅ QR code-driven workflows for attendance and transactions  
* ✅ Unified digital catalog supporting Books, Research/Literature, and Magazines  
* ✅ Student-initiated checkout with librarian approval for accountability  
* ✅ Program-based personalized recommendations to enhance resource discovery  
* ✅ Ethical, privacy-first design aligned with human-centered technology values

### **Core Objectives**

| Objective | Success Metric |
| ----- | ----- |
| **Digitize Operations** | Replace 100% of manual logbooks with digital timestamps |
| **Improve Efficiency** | Reduce average borrowing transaction time from 5 mins → \<60 seconds |
| **Enhance Discovery** | Increase resource utilization by 30% through personalized suggestions |
| **Ensure Security** | Zero data breaches via AES-256 encryption and role-based access |
| **Support Inclusivity** | Accessible interface usable by all 1,000+ students across 4 departments |

### **Scope**

**In Scope**:

* User registration, authentication, and profile management (manual entry)  
* Digital catalog management for Books, Research/Literature, Magazines  
* QR-based borrowing/returning with student scan \+ librarian approval flow  
* QR-based library attendance logging (time-in/time-out)  
* Personalized resource recommendations by academic program  
* Reporting dashboard for circulation, attendance, and inventory  
* red-themed, modern UI with rounded corners across both platforms

**Out of Scope**:

* Integration with external university SIS (manual registration only)  
* Monetary fine calculation or payment gateway  
* E-book lending or digital content hosting  
* Multi-language support (English-only for MVP)

### **Target Users**

| User Role | Primary Needs | Platform Access |
| ----- | ----- | ----- |
| **Librarian** | Manage catalog, approve transactions, generate reports, monitor attendance | Windows Desktop App |
| **Students** (\~1,000 across 4 programs) | Browse catalog, borrow/return items, log attendance, receive recommendations | Android Mobile App |
| **Teaching Faculty** | Access resources, track department usage, reserve materials | Android Mobile App |
| **Visitors** | Temporary access to library resources and attendance logging | Android Mobile App (Guest Mode) |

### **Technology Stack (Suggested)**

| Component | Recommendation |
| ----- | ----- |
| **Mobile App** | Flutter or React Native (cross-platform, QR support) |
| **Desktop App** | Electron.js or .NET MAUI (Windows-optimized, webcam integration) |
| **Backend** | Node.js \+ Express or Python \+ FastAPI |
| **Database** | PostgreSQL (relational) \+ Redis (caching) |
| **Security** | AES-256 encryption for QR payloads, JWT for sessions, bcrypt for passwords |
| **Hosting** | University on-premise server or private cloud (data sovereignty) |

---

## **🔐 MODULE 1: User Management & Authentication**

*Handles user registration, login, and role-based access control*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Role-Based Login** | Separate interfaces for Librarian, Student, Faculty, Visitor with tailored permissions and navigation | Both | 🔴 High |
| **Manual Registration** | Users register manually with required fields: Full Name, University ID/Email, Program/Department, Password. No SIS sync. | Mobile | 🔴 High |
| **Login & Session Management** | Secure login with encrypted credentials; token-based sessions; auto-logout after 15 mins inactivity | Both | 🔴 High |
| **Guest/Visitor Mode** | Temporary account creation for visitors with time-limited QR access (24-hour validity) | Mobile | 🟡 Medium |
| **Profile Management** | Users can view/edit personal info, change password, view borrowing history and attendance summary | Mobile | 🟢 Low |

---

## **📖 MODULE 2: Digital Catalog & Resource Management**

*Core library operations: cataloging, search, inventory for multiple resource types*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Smart Search** | Keyword, ISBN/ISSN, author, subject, category filters \+ autocomplete suggestions \+ typo tolerance | Both | 🔴 High |
| **Multi-Category Catalog** | Support for 3 distinct resource types: **Books**, **Research/Literature**, **Magazines** with tailored metadata fields | Desktop | 🔴 High |
| **Resource Cataloging** | Add/edit entries with metadata: title, author, ISBN/ISSN, category, copies, shelf location, abstract (research), publication date | Desktop | 🔴 High |
| **QR-Encoded Resource Tags** | Generate AES-256 encrypted QR codes per physical item copy for secure, tamper-resistant check-out | Desktop | 🔴 High |
| **Real-Time Availability** | Live status indicators: Available / Borrowed / Reserved / Reference-Only / Under Maintenance | Both | 🔴 High |
| **Batch Import/Export** | CSV/Excel upload for bulk resource registration; export full catalog or filtered subsets for backup | Desktop | 🟢 Low |

---

## **🔄 MODULE 3: Borrowing & Return Transactions**

*Automated circulation management with student-initiated scanning and librarian approval*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Student-Initiated QR Checkout** | Student scans item QR via mobile app → checkout request sent to librarian dashboard with item \+ user details | Mobile | 🔴 High |
| **Librarian Approval Dashboard** | Real-time queue of pending requests; librarian reviews and approves/rejects with one click; auto-logs timestamp upon approval | Desktop | 🔴 High |
| **Auto Due Date Assignment** | System assigns return date based on user role: Student (14 days), Faculty (30 days), Visitor (7 days) | Both | 🔴 High |
| **One-Tap Return Processing** | Librarian scans item QR → instantly marks returned, updates inventory, closes transaction, logs return time | Desktop | 🔴 High |
| **Reservation System** | Students can reserve unavailable items; receive push notification when item is returned and available | Mobile | 🟡 Medium |
| **Borrowing Limits Enforcement** | Configurable max items per user type (e.g., Students: 3 items, Faculty: 10); block checkout if limit exceeded | Both | 🟡 Medium |
| **Late Return Tracking (No Fines)** | System logs late returns in user history and analytics for engagement insights, but **no monetary fines** are calculated or charged | Both | 🟡 Medium |

---

## **📍 MODULE 4: QR Logbook & Attendance System**

*QR-based library attendance tracking with time-in/time-out and analytics*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Dynamic Attendance QR** | Librarian generates time-bound QR code (valid 5/15/30 mins, configurable) displayed on desktop dashboard for users to scan | Desktop | 🔴 High |
| **User QR Scan (Time-In/Out)** | Users scan attendance QR via mobile app → logs entry/exit with timestamp, device ID, and approximate location | Mobile | 🔴 High |
| **Anti-Cheat Measures** | Device fingerprinting \+ optional geofencing validation to prevent proxy scanning or location spoofing | Mobile | 🟡 Medium |
| **Session Duration Tracking** | Auto-calculate study duration per visit; flag unusually short (\<5 mins) or long (\>8 hrs) sessions for analytics review | Both | 🟢 Low |
| **Attendance Dashboard** | Visual calendar view of user/library visits; filter by department, date range, user type; export logs to CSV/PDF | Desktop | 🟡 Medium |
| **Eligibility Reports** | Auto-generate attendance percentage reports per student/department for academic compliance (e.g., 80% minimum requirement) | Desktop | 🟡 Medium |

---

## **💡 MODULE 5: Personalized Recommendations**

*AI-lite suggestion engine to enhance resource discovery and engagement*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Program-Based Suggestions** | Algorithm recommends resources based on user's academic program/department (e.g., Nursing students see healthcare literature) | Mobile | 🟡 Medium |
| **Home Page Recommendation Carousel** | "Recommended for You" section on mobile home page displaying 5-8 personalized items with cover image, title, availability | Mobile | 🟡 Medium |
| **Borrowing History Insights** | "Because you borrowed X, you might like Y" suggestions based on collaborative filtering of similar users in same program | Mobile | 🟢 Low |
| **Trending in Your Department** | Showcase top 5 most-borrowed items within the user's college/program over the last 30 days | Mobile | 🟢 Low |
| **Manual Preference Tags (Optional)** | Users can optionally select interest tags during onboarding (e.g., "AI", "Philosophy", "Business") to refine suggestions | Mobile | 🟢 Low |

---

## **🔒 MODULE 6: Security & Data Protection**

*Ensuring privacy, integrity, and ethical data handling throughout the system*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **AES-256 QR Encryption** | All QR codes (attendance \+ item) embed encrypted payloads containing user ID, timestamp, session token, item ID | Both | 🔴 High |
| **Data Minimization Policy** | Collect only essential registration data; anonymize analytics data before reporting; no unnecessary PII storage | Backend | 🔴 High |
| **Audit Logs** | Immutable, timestamped log of all librarian/admin actions: item edits, user changes, report exports, approval decisions | Desktop | 🟡 Medium |
| **Privacy Compliance Framework** | Clear consent checkbox during registration; in-app access to privacy policy; user data export/delete request workflow | Both | 🟡 Medium |
| **Secure Session Handling** | JWT-based authentication; token refresh mechanism; auto-logout after configurable inactivity period (default: 15 mins) | Both | 🟢 Low |

---

## **📊 MODULE 7: Reporting & Analytics**

*Actionable insights for librarians, department heads, and academic administrators*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Circulation Reports** | Most borrowed items, peak usage hours, department-wise borrowing trends, resource type distribution | Desktop | 🔴 High |
| **Attendance Analytics** | Heatmaps of library traffic by hour/day, average stay duration, repeat visitor rates segmented by program | Desktop | 🟡 Medium |
| **Custom Report Builder** | Filter reports by date range, department, resource type, user role; export to PDF (print-ready) or CSV (data analysis) | Desktop | 🟡 Medium |
| **Low-Engagement Alerts** | Auto-flag users with minimal library activity over semester; optional gentle notification via app to encourage usage | Mobile | 🟢 Low |
| **Inventory Health Dashboard** | Visual dashboard flagging damaged/lost items, low-stock categories, items needing maintenance or replacement | Desktop | 🟢 Low |

---

## **🔔 MODULE 8: Notifications & Communication**

*Proactive, user-friendly engagement to improve experience and reduce librarian workload*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Due Date Reminders** | Push notification \+ optional email 3 days and 1 day before return deadline; includes item title and due date | Mobile | 🔴 High |
| **Reservation Alerts** | Instant push notification when reserved item is returned and available for pickup; includes shelf location | Mobile | 🟡 Medium |
| **System Announcements** | Librarian can broadcast time-sensitive messages (library closures, event reminders, new arrivals) to all or filtered user groups | Both | 🟢 Low |
| **In-App Inquiry Form** | Users can submit questions or requests to librarian; responses appear in app notification center with read receipts | Mobile | 🟢 Low |

---

## **⚙️ MODULE 9: Admin & System Configuration**

*Backend control panel for librarians and IT staff to manage system behavior*

| Feature | Description | Platform | Priority |
| ----- | ----- | ----- | ----- |
| **Role & Permission Manager** | Granular control: define what each role (Student, Faculty, Visitor, Staff) can view, borrow, approve, or export | Desktop | 🔴 High |
| **Resource Category Manager** | Add/edit/delete categories (Books, Research/Literature, Magazines); customize metadata fields per category | Desktop | 🟡 Medium |
| **Theme & UI Settings** | Admin toggle for red theme variants, corner radius values, font size presets (for institutional branding consistency) | Desktop | 🟡 Medium |
| **QR Validity Configuration** | Set global duration for attendance QR codes (options: 5/10/15/30 mins) and item checkout QR expiration | Desktop | 🟡 Medium |
| **Backup & Restore Utility** | Schedule automated daily/weekly database backups; one-click restore functionality with confirmation dialog | Desktop | 🟡 Medium |
| **Recommendation Engine Settings** | Adjust algorithm weights: program relevance (40%), popularity (30%), recency (20%), user tags (10%) | Desktop | 🟢 Low |

---

## **🚀 DEVELOPMENT PHASING & TIMELINE**

| Phase | Modules Included | Key Deliverables | Success Criteria | Timeline |
| ----- | ----- | ----- | ----- | ----- |
| **Phase 1: MVP Core** | Module 1 \+ Module 2 \+ Module 3 \+ Module 4 | • Manual registration & login • Catalog search & QR item tags • Student scan → librarian approval flow • QR attendance logging | End-to-end borrowing \+ attendance workflow functional with 5 test users | Weeks 1–6 |
| **Phase 2: Engagement Layer** | Module 5 \+ Module 7 \+ Module 8 | • Program-based recommendations on mobile home • Circulation & attendance reports • Due date reminders \+ reservation alerts | 80% of test users engage with recommendations; reports generate accurately | Weeks 7–10 |
| **Phase 3: Polish & Secure** | Module 6 \+ Module 9 \+ UI Theming | • AES-256 QR encryption implemented • Role permissions configured • red theme applied consistently across both apps | Security audit passed; UI matches approved mockups; admin controls functional | Weeks 11–14 |
| **Phase 4: Demo Ready** | Integration \+ UAT \+ Documentation | • End-to-end demo script • Test reports & bug logs • Final user manual \+ technical documentation | Successful live demo with librarian \+ 3 students; zero critical bugs | Weeks 15–16 |

---

## **📋 PRIORITY LEGEND & DECISION GUIDE**

| Priority | Definition | Implementation Guidance |
| ----- | ----- | ----- |
| 🔴 **High** | Critical for MVP; core functionality without which system fails | Must be completed in Phase 1; block other features if delayed |
| 🟡 **Medium** | Important for usability, engagement, or admin control; enhances value | Target Phase 2–3; can be simplified if timeline tight |
| 🟢 **Low** | Nice-to-have polish, stretch goals, or future enhancements | Implement only if ahead of schedule; document for v2.0 |

---

**Project Vision Statement**  
*"To empower the university community with a human-centered digital library system that makes academic resources faster to access, easier to discover, and more inclusive for all — built with ethics, privacy, and clean design at its core."*  
---

*Document Version: 2.0 (Approved Final)*  
*Last Updated: \[Insert Date\]*  
*Prepared For: \[University Name\] — College of Information Technology*  
*Capstone Team: \[Your Team Name\]*

