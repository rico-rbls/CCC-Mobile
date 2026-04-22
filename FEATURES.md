# LibLog — Digital Library Logbook Management System

## Complete Feature Documentation

---

## 1. Onboarding (5-Step Registration Flow)

### Step 1: Role Selection
- Three role cards: **Student**, **Faculty**, **Visitor**
- Each card has a unique icon (GraduationCap, Briefcase, User), label, and description
- Selected card shows animated checkmark with spring animation
- Cards have hover elevation effects (`whileHover: { y: -2 }`)
- "Continue" button is disabled until a role is selected
- Animated entrance with staggered delay per card
- Step-specific icon in the progress indicator (Sparkles icon for Step 1)
- Background pattern changes per step with radial gradient shifts

### Step 2: Personal Information
- Full Name input field with placeholder "Juan Dela Cruz"
- University ID input field with placeholder "e.g. 2024-00001"
- User icon header with spring animation
- Input fields with purple focus border and ring effects
- Both fields required before continuing

### Step 3: Academic Information
- **Students**: Program dropdown (10 programs: CS, Nursing, Business Admin, etc.) + Year Level grid selector (1st-5th Year)
- **Faculty**: Department dropdown only (8 departments)
- **Visitors**: Info card explaining limited access ("browse catalog and use QR check-in")
- Year level buttons have purple selected state with shadow
- Conditional rendering based on selected role

### Step 4: Account Setup
- University Email input with placeholder "you@university.edu"
- Password field with show/hide toggle (Eye/EyeOff icons)
- Password strength indicator (4-bar visual: Weak/Fair/Good/Strong)
- Strength calculation based on length, uppercase, numbers, special characters
- Confirm Password field with real-time match validation
- Green checkmark when passwords match, red error when they don't
- Shield icon header

### Step 5: Notification Preferences
- Due Date Reminders toggle (default: ON) — with Calendar icon and orange background
- Reservation Alerts toggle (default: ON) — with BookOpen icon and purple background
- System Announcements toggle (disabled, default: OFF) — with Megaphone icon
- Each toggle is a Switch component with purple checked state
- Animated entrance with staggered delays (0.05s per item)
- Confetti animation on reaching Step 5 (20 animated particles in purple/amber/green colors)

### Progress Indicator
- Gradient progress bar across 5 segments
- Current step shows gradient from purple to purple-light with glow shadow
- Completed steps are solid purple
- Step dots with unique icons per step (Sparkles, User, GraduationCap, ShieldCheck, Bell)
- Completed steps show checkmark icons
- Current step icon is animated with scale and background color transition

### Onboarding-Wide Features
- Slide animation between steps (300ms, easeInOut)
- Back navigation with ArrowLeft button
- Step-specific decorative background patterns
- "Continue" / "Get Started" button with gradient on final step
- Loading spinner during account creation
- Registration via `/api/auth/register` POST endpoint
- Auto-login after successful registration (sets user state and navigates to home)
- Validation at each step before allowing progression

---

## 2. Login

### Authentication
- Email + Password login form
- Login via `/api/auth/login` POST endpoint
- Enter key support for quick login
- Loading state with animated spinner and "Signing in..." text
- Error handling with toast notifications for invalid credentials

### UI Design
- Animated gradient purple header with `rounded-b-[2.5rem]`
- Floating decorative book/library icons (5 icons with `animate-float-icon` at staggered delays)
- Animated gradient overlay with `gradient-shift` animation
- Decorative circles at various positions (white/5% opacity)
- App logo with spring entrance animation (scale from 0, rotate from -180deg)
- Logo has `animate-micro-pulse-glow` subtle glow effect
- "LibLog" title with "Digital Library Logbook System" subtitle and Library icon

### Form Fields
- **Email**: GraduationCap icon prefix, animated label color change on focus, purple ring and shadow on focus
- **Password**: Show/hide toggle (Eye/EyeOff), animated label, purple focus state
- "Forgot password?" link (visual only)
- Input height: 48px with rounded-xl corners

### Demo Account
- "Use Demo Account" button with dashed border
- Auto-fills: `juan@university.edu` / `password123`
- BookOpen icon on button
- Press-effect animation

### Additional
- Shimmer loading effect on Sign In button when both fields are filled
- "Don't have an account? Register" link at bottom
- Terms of Service and Privacy Policy footer text
- Glass-card effect on form container

---

## 3. Home Dashboard

### Top Header Section
- **Streak counter**: Flame icon (orange) + count + "day streak" label
- **Notifications button**: Bell icon with red badge showing unread count
- **Settings button**: Gear/Settings icon
- **User greeting**: Animated greeting that changes by time of day (Good morning/afternoon/evening) with AnimatePresence transition
- **Avatar circle**: Purple circle with initials
- **User info**: Program, Year Level, Role (e.g., "Computer Science · 3rd Year · Student")

### Library Status
- Green/Red badge showing Open/Closed status
- Open: "Library Open · Closes 9PM" with green dot
- Closed: "Library Closed · Opens tomorrow" with red dot
- Full date display with CalendarDays icon: "Wednesday, April 22, 2026"

### Pull-to-Refresh
- Touch-based pull-to-refresh gesture
- Pull distance indicator with animated height
- Refreshing spinner with "Refreshing..." / "Pull to refresh" text
- Triggers data re-fetch when pull > 60px

### Announcements Section
- Auto-rotating carousel (5-second interval)
- Purple-tinted banner with Megaphone icon
- Dismissible per announcement (X button)
- Carousel dot indicators (active dot is wider with purple color)
- Animated slide transitions between announcements
- Fetched from `/api/announcements` endpoint

### Today's Highlight
- Featured book card with purple gradient background and decorative circles
- Star + "Featured Pick" label
- Book cover thumbnail with white/15% backdrop blur
- Title, author, availability badge
- Arrow indicator for navigation
- Random book selection from API on each load
- Tap to navigate to book detail

### Current Borrow Card
- **With active borrow**: Book info card with:
  - Left gradient accent border (purple gradient vertical)
  - Title, author, category badge
  - Days remaining badge (purple/green/yellow/red based on urgency)
  - Progress bar showing elapsed time vs total borrow period
  - Borrow date and due date display
  - "View Details" button with ChevronRight
- **No active borrows**: Empty state with:
  - Dot pattern background
  - Animated floating book icons
  - "No Active Borrows" message
  - "Browse Catalog" CTA button with BookOpen icon

### Quick Actions
- 4-column grid in white card container:
  1. **Scan QR** — Purple background, white icon, navigates to QR scanner
  2. **My Loans** — Purple-50 background, navigates to borrowed screen
  3. **Reservations** — Purple-50 background, navigates to borrowed screen
  4. **Attendance** — Purple-50 background, navigates to home
- Each action has icon, label, and subtitle
- whileTap scale animation (0.93)

### Recommended for You
- Horizontal scrollable card carousel
- Program-based filtering: resources matching user's program shown first with "For You" star badge (amber)
- Fallback to general resources
- Each card shows: cover image (or purple gradient placeholder), category badge, availability indicator (green/red dot), title, author
- "See All" link navigating to search
- Hover/tap shadow transitions

### Trending in Your Department
- Numbered ranking list (1-5) in white card
- Top 3 ranks have purple filled circle, 4-5 have purple outline
- Title, author, and borrow count with Clock icon
- Fetched from `/api/resources` with mock borrow counts

### Loading State
- Full skeleton UI matching actual layout
- Skeleton cards for each section
- Skeleton recommendation carousel with 4 placeholder cards

---

## 4. Search Catalog

### Search Bar
- Search icon prefix
- Placeholder: "Search books, research, magazines..."
- Clear button (X) when query is present
- Purple focus border and ring
- 300ms debounced API search

### Popular Searches
- "POPULAR" label with TrendingUp icon
- 6 quick-search pill buttons: Algorithms, Deep Learning, Database, Nursing, Psychology, Clean Code
- Tapping a pill fills the search bar and triggers search
- Only visible when search is empty/focused

### Category Filters
- 4 filter pills: All, Books, Research, Magazines
- Each with unique icon (Search, BookOpen, FileText, Newspaper)
- Active state: purple background with white text and shadow
- Inactive: gray background with hover effect
- Category parameter sent to API

### Search Results
- Animated result count with number transition
- "X results found" header
- Result cards with:
  - Cover image (or purple gradient placeholder)
  - Title, author
  - Category color-coded badge (purple/blue/orange)
  - Tag pills (first 2 tags shown)
  - Subject pill when no tags present
  - Availability indicator (green dot + count or red dot + "Out")
  - Card hover effect
- Staggered entrance animation (0.03s delay per card)

### Recently Viewed
- Shown when search is empty
- Horizontal scrollable cards (4 items)
- Smaller cards (28x36) with category badge and cover image
- "Recently Viewed" header with Clock icon

### Empty State
- Search icon in purple circle
- "No results found" message
- "Try adjusting your search or filters" suggestion

---

## 5. QR Code Scanner

### Scanner Interface
- Full-screen dark background (#0d0d1a)
- Viewfinder (264x264) with:
  - Purple corner brackets (3px border, rounded corners)
  - Inner corner accents (2px, 40% opacity)
  - Animated scan line moving up and down (2.5s cycle)
  - Center ScanLine icon with pulse during scanning
  - Outer glow effect (purple/10% blur)
  - Semi-transparent white/5% inner overlay

### Scan Modes
- **Attendance Check-in** (default): UserCheck icon, purple active state
- **Book Checkout**: BookOpen icon, secondary state
- Toggle buttons at bottom with mode-specific icons
- Mode indicator badge in top-left corner

### Auto-Scan Simulation
- 2-second delay before auto-scan starts
- 3-second scanning animation (center icon pulses, scan line active)
- "Scanning..." indicator with pulsing dot

### Success Modal
- Backdrop blur overlay
- Spring-animated white modal with:
  - Green CheckCircle2 icon with spring scale animation
  - Contextual message: "Attendance Logged!" or "Book Scanned!"
  - Description text
  - Timestamp display with Clock icon
  - "Scan Again" button (outline) and "Done" button (purple filled)
- Staggered entrance animations for each element

### Flash/Torch Toggle
- Toggle button for flash on/off
- Yellow highlight when active (Zap icon with fill)
- White/10% background when inactive

### Navigation
- Close button (X) in top-right with backdrop blur
- Returns to home screen

---

## 6. My Loans (Borrowed Books)

### Tab Navigation
- Active / History tabs in purple-50 container
- Active tab has white background with shadow
- Tab labels show count: "Active (2)", "History (1)"
- Animated tab switch with horizontal slide (10px)

### Summary Stats Bar
- Purple dot + "X Active"
- Emerald dot + "Y Returned"

### Active Borrows List
- Each card features:
  - Cover image (or purple gradient placeholder with BookOpen icon)
  - Left gradient accent border (purple gradient)
  - Title, author
  - Borrow date and due date
  - Urgency badge:
    - Green: > 3 days left
    - Yellow: ≤ 3 days left
    - Red: Overdue
  - "Return" button with RotateCcw icon
  - Return calls `/api/borrow/[id]/return` PUT endpoint
  - Loading spinner on return button during processing
- Staggered entrance animation (0.07s delay per card)

### Borrow History
- Each card features:
  - Cover image or placeholder
  - Title, author
  - "Returned on [date]" badge with CheckCircle2 icon (emerald)
  - "View" button with ChevronRight to navigate to book detail

### Empty State
- BookOpen icon in purple circle
- "No books yet" / "Your borrowing history will appear here"
- "Browse Catalog" CTA button (on Active tab only)

---

## 7. Book Detail

### Header
- Purple gradient background with cover-pattern-overlay
- Decorative circles (white/5% opacity)
- Back button (ArrowLeft) with white/10% background
- "Book Details" label
- Share button (Share2) with white/10% background

### Book Cover Section
- Overlapping card (-mt-12 from header)
- Cover image (if available) with gradient overlay, category badge, favorite button
- Or purple gradient placeholder with:
  - Large BookOpen icon (white/30%)
  - Decorative border circles
  - Category badge (top-right)
  - Heart favorite button (top-left) with:
    - Active: Red filled heart with scale-110
    - Inactive: White heart outline
    - Toggle calls `toggleFavorite()` in store
    - Toast notification on toggle

### Book Information
- Title (large, bold)
- Author
- Availability badge: green "X/Y available" or red "Unavailable"
- Shelf location with MapPin icon
- ISBN with Hash icon (if available)
- Publication date with Calendar icon (if available)
- Subject tag (purple-50 background)
- "About this book" description section
- Tag pills (purple-50, 10px font)

### Action Buttons
- **Borrow** button (when available): Purple filled, BookOpen icon
- **Reserve** button (when unavailable): Purple-50 outline, Bookmark icon
- Processing state with spinner animation
- **Share** button (outline)
- Both buttons call respective API endpoints with loading states

### More Resources
- "More Resources" section with related books
- Fetched from `/api/resources?limit=4`, filtered to exclude current book (max 3)
- Each item: purple gradient icon, title, author, ChevronRight
- Tap to navigate to that book's detail

### Share Feature
- Uses `navigator.share` API on supported devices
- Falls back to clipboard copy
- "Copied to clipboard!" toast with bottom positioning and animation

---

## 8. Profile

### Profile Header
- Purple gradient background with `rounded-b-[2rem]`
- Decorative circles (3 positions, white/5%)
- Avatar circle with initials (white/20% backdrop blur, ring-4)
- Full name, email (with Mail icon)
- Role badge pill (white/20% background)
- Program + Year Level (with GraduationCap icon)
- University ID (mono font, white/40%)
- Spring entrance animation for avatar

### Stats Cards
- 3-column grid overlapping header (-mt-6):
  - **Borrowed**: BookOpen icon, purple theme, total count (active + history)
  - **Visits**: MapPin icon, emerald theme, attendance count
  - **Streak**: Flame icon, orange theme, streak count
- Staggered entrance animation (0.1s delay each)

### Reading Goal Card
- Circular SVG progress ring (36x36 viewBox)
- Track: #E8D5F3, Progress: #652D90
- Center text: "current/goal" count
- Default goal: 24 books/year
- "Change" button reveals picker: 12, 24, 36, 48 options
- Selected goal has purple filled state
- Dynamic message: "X more books to reach your goal" or celebration emoji

### Reading Stats Card
- Mini bar chart (7 months: Sep-Mar)
- Current month bar is purple, others are purple-200
- Animated bar heights with staggered delay
- "Total: X books this year"
- "Avg: X.X/mo" average calculation
- BookOpen icon header

### Favorite Books Section
- Heart icon (red filled) card
- "{X} books saved to your collection"
- ChevronRight to navigate to favorites screen
- Card hover effect

### Member Info Card
- Clock icon in purple-50 background
- "Member since [Month Year]"

### Menu Items
7 menu items in white card:
1. **Edit Profile** — Edit icon, navigates to settings
2. **My Favorites** — Heart icon (red), shows saved count, navigates to favorites
3. **My Reservations** — BookOpen icon, navigates to reservations
4. **Notification Preferences** — Bell icon, navigates to settings
5. **Privacy Policy** — Shield icon, navigates to settings
6. **Help & Support** — HelpCircle icon, navigates to settings
7. **About** — Info icon, "Version 1.0.0", navigates to settings

### Log Out
- Red-outlined button with LogOut icon
- Resets all user state (auth, onboarding, search, favorites, etc.)
- Navigates to login screen

---

## 9. Settings

### Header
- Back button with ArrowLeft
- "Settings" title

### Account Section
- User avatar (purple circle with initials)
- Full name and email display
- **Change Password** button: Opens bottom sheet modal
- **Email** display with "Verified" badge

### Change Password Modal
- Bottom sheet with spring animation (slides up from bottom)
- Backdrop blur overlay (click outside to close)
- Handle bar at top
- Fields:
  - Current Password (with show/hide toggle)
  - New Password (with show/hide toggle + strength indicator)
  - Confirm New Password
- Validation: minimum 6 chars, must match, must differ from current
- Error display in red box
- Cancel / Change Password buttons
- Calls `/api/auth/update` PUT endpoint

### Notifications Section
- **Due Date Reminders**: Toggle switch, calls API on change
- **Reservation Alerts**: Toggle switch, calls API on change
- **System Announcements**: Toggle switch, calls API on change
- All toggles have purple checked state (`data-[state=checked]:bg-lib-purple`)
- Each toggle updates via `/api/auth/update` PUT with user ID

### Appearance Section
- **Dark Mode**: Toggle switch using `next-themes`
- Sun/Moon icon based on current theme
- Persists theme preference across sessions

### Library Section
- **Library Hours**: Opening/closing time from `/api/settings` API
- Open/Closed status badge (green/red)
- **Attendance History**: Link to attendance screen

### About Section
- App Version: 1.0.0
- Privacy Policy link
- Terms of Service link

### Log Out
- Red-outlined button, calls `logout()` and navigates to login

---

## 10. Notifications

### Header
- Back button with ArrowLeft
- "Notifications" title
- "Mark all read" button (CheckCheck icon) — visible when unread notifications exist

### Filter Tabs
- 3 pill filters: All, Unread, Mentions
- Active: purple background with white text + shadow
- Inactive: gray-100 background
- Unread tab shows count badge
- Mentions filters for reservation-type notifications

### Notification Cards
- Swipe-to-dismiss gesture (drag > 100px triggers dismiss)
- Spring-back animation if drag < 100px
- Color-coded left border:
  - Orange: due_date notifications
  - Purple: reservation notifications
  - Blue: announcement notifications
- Type-specific icon in colored background circle
- Title, message, relative time (Just now / Xh ago / Xd ago / date)
- Unread indicator: purple dot

### Date Grouping
- Groups: Today, Yesterday, This Week, Earlier
- Group headers with purple uppercase label, divider line, and count

### Empty State
- BookOpen icon in purple circle
- "No unread notifications" / "No notifications" message

---

## 11. Attendance History

### Summary Cards
- 3-column grid:
  - **Total Visits**: MapPin icon, current month count
  - **Total Hours**: Clock icon, calculated from durations
  - **Day Streak**: Flame icon (orange), from user data

### Calendar Heat Map
- Full month grid with day-of-week headers (Sun-Sat)
- Purple-filled cells for attended days
- Gray cells for non-attended past days
- Light gray cells for future days
- Today highlighted with purple ring
- "Today" dot indicator below date
- Month/year display with Calendar icon
- Visit count badge
- Legend: Attended (purple), No visit (gray), Today (ring)
- Per-cell entrance animation

### Recent Visits
- Sorted by date (most recent first, max 10)
- Each record shows:
  - Calendar icon in purple-50 circle
  - Formatted date ("Mon, Mar 11")
  - Time range ("8:15 AM → 11:30 AM")
  - Duration badge (e.g., "3h 15m")

### Data Sources
- Primary: `/api/attendance?userId=X` API
- Fallback: Mock data (11 records for March 2026) when API returns empty

---

## 12. Favorites

### Header
- Back button with ArrowLeft
- "My Favorites" title with count subtitle
- Heart icon in red-50 circle

### Favorites List
- Each card shows:
  - Cover image (or purple gradient placeholder)
  - Title, author
  - Category badge (color-coded)
  - Availability indicator (green/red dot + count)
  - Remove button (Trash2 icon) with hover state turning red
- Animated entrance (0.05s stagger)
- Swipe-to-remove (exit animation: slide left + collapse)

### Empty State
- Large Heart icon in purple circle
- "No favorites yet" message
- "Tap the heart icon on any book to save it here" instruction
- "Browse Catalog" CTA button

### Data Flow
- Favorites stored in Zustand store with localStorage persistence
- `toggleFavorite(id)` / `isFavorite(id)` methods
- Resource details fetched from `/api/resources/[id]` for each favorite

---

## 13. Reservations

### Header
- Back button with ArrowLeft
- "My Reservations" title with active count
- Bookmark icon in purple-50 circle

### Filter Tabs
- 3 pill filters: All, Pending, Fulfilled
- Active: purple filled, Inactive: purple-50 outline
- Pending tab shows count badge

### Reservation Cards
- Cover image (or purple gradient placeholder)
- Title, author
- Status badge:
  - Pending: Clock icon, yellow-100 background
  - Fulfilled: CheckCircle2 icon, green-100 background
  - Cancelled: XCircle icon, red-100 background
- Created date
- **Pending**: "Cancel" button (XCircle icon, red text) — calls `/api/reservations/[id]` DELETE
- **Fulfilled**: "Borrow Now" button — navigates to book detail

### Empty State
- Bookmark icon in purple circle
- Contextual message based on active filter
- "Browse Catalog" CTA button

---

## 14. Bottom Navigation

### Navigation Items
5 nav items with icons:
1. **Home** — Home icon
2. **Search** — Search icon
3. **Scan** — ScanLine icon (center, elevated)
4. **Borrowed** — BookOpen icon (with active borrow count badge)
5. **Profile** — User icon

### Center Scan Button
- Elevated (-mt-6) above nav bar
- Full purple circle (56x56) with shadow
- White icon
- whileTap scale animation (0.9)

### Active State
- Active item: purple icon color, semibold label
- Active indicator: animated dot (layoutId="navIndicator")
- Inactive: gray-400 color

### Borrow Badge
- Shows count of active borrows on "Borrowed" nav item
- Purple circle badge with white text (8px font)
- Position: -top-1.5, -right-2
- Fetched from `/api/borrow?userId=X&status=active`

### Styling
- Glass-effect background (frosted glass)
- Border-top with purple-100 color
- Safe-area bottom padding

---

## 15. Dark Mode

### Implementation
- Powered by `next-themes` library
- ThemeProvider wraps app in layout.tsx
- Toggle in Settings screen
- Persists across sessions via next-themes storage

### Dark Mode Styling
- Custom CSS variables for dark backgrounds
- Enhanced styles for: purple gradients, glass effects, custom scrollbars, skeleton shimmers
- Proper contrast ratios for text and interactive elements

---

## 16. Backend API Endpoints

### Authentication
| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Register new user with full profile data |
| `/api/auth/login` | POST | Login with email/password, returns user data |
| `/api/auth/update` | PUT | Update user profile, notification prefs, or change password |

### Resources
| Endpoint | Method | Description |
|---|---|---|
| `/api/resources` | GET | List resources with optional search, category, subject, limit params |
| `/api/resources/[id]` | GET | Get single resource by ID |

### Borrowing
| Endpoint | Method | Description |
|---|---|---|
| `/api/borrow` | GET | Get borrow records by userId + optional status filter |
| `/api/borrow` | POST | Borrow a resource (validates limits, creates record, decrements availability) |
| `/api/borrow/[id]/return` | PUT | Return a borrowed book (marks returned, increments availability) |

### Attendance
| Endpoint | Method | Description |
|---|---|---|
| `/api/attendance` | GET | Get attendance records by userId |
| `/api/attendance` | POST | Create new attendance record |

### Reservations
| Endpoint | Method | Description |
|---|---|---|
| `/api/reservations` | GET | Get reservations by userId |
| `/api/reservations` | POST | Create a reservation for a resource |
| `/api/reservations/[id]` | DELETE | Cancel a reservation |

### Notifications
| Endpoint | Method | Description |
|---|---|---|
| `/api/notifications` | GET | Get notifications by userId (returns `{notifications, unreadCount}`) |
| `/api/notifications/[id]/read` | PUT | Mark a notification as read |

### Settings
| Endpoint | Method | Description |
|---|---|---|
| `/api/settings` | GET | Get library settings (hours, borrow limits, etc.) |

### Announcements
| Endpoint | Method | Description |
|---|---|---|
| `/api/announcements` | GET | Get active announcements |

---

## 17. Database Schema (8 Models)

### User
- id, email (unique), password, fullName, universityId (unique)
- role (student/faculty/visitor/librarian), program, department, yearLevel
- avatarInitials, notificationDueDate, notificationReservation, notificationAnnouncements
- streakCount, streakLastDate, isOnboarded
- Relations: borrowedBooks[], attendance[], reservations[], notifications[]

### Resource
- id, title, author, isbn, issn, category (book/research/magazine)
- copies, availableCopies, shelfLocation, abstract, publicationDate
- coverImage, subject, tags (comma-separated), status
- Relations: borrowRecords[], reservations[]

### BorrowRecord
- id, userId, resourceId, borrowDate, dueDate, returnDate
- status (active/returned/overdue), isLate
- Relations: user, resource

### Attendance
- id, userId, date (YYYY-MM-DD), timeIn, timeOut, duration (minutes)
- Relations: user

### Reservation
- id, userId, resourceId, status (pending/fulfilled/cancelled)
- Relations: user, resource

### Notification
- id, userId, type (due_date/reservation/announcement/inquiry)
- title, message, isRead
- Relations: user

### LibrarySettings
- id, isOpen, closingTime, openingTime
- maxBorrowStudent (3), maxBorrowFaculty (10), maxBorrowVisitor (1)
- borrowDaysStudent (14), borrowDaysFaculty (30), borrowDaysVisitor (7)
- qrValidityMinutes (15)

### Announcement
- id, title, message, targetRoles (all/student/faculty/visitor), isActive

---

## 18. State Management (Zustand + Persist)

### Navigation State
- `currentScreen`: Active screen identifier
- `previousScreen`: For back navigation
- `setCurrentScreen()`: Navigate to screen
- `goBack()`: Return to previous screen

### Authentication State
- `isAuthenticated`: Login status
- `user`: Full user profile object (UserState)
- `setUser()`: Set authenticated user
- `logout()`: Clear all state and return to login

### Onboarding State
- `onboardingStep`: Current step (0-4)
- `onboardingData`: Role, name, universityId, program, department, yearLevel, email, password, notification prefs
- `resetOnboarding()`: Clear all onboarding data

### Search State
- `searchQuery`: Current search text
- `searchCategory`: Active category filter (all/book/research/magazine)

### Notification State
- `unreadCount`: Number of unread notifications

### Favorites State
- `favorites`: Array of resource IDs
- `toggleFavorite(id)`: Add/remove favorite
- `isFavorite(id)`: Check if favorited

### Persistence
- Zustand `persist` middleware with `liblog-store` localStorage key
- Partialized: currentScreen, isAuthenticated, user, onboardingStep, onboardingData, favorites

---

## 19. Animations & Micro-Interactions

### Framer Motion Animations
- **Page transitions**: opacity + y-translate (200ms, easeInOut) via AnimatePresence
- **Staggered entrances**: Section-level (0.08s delay) and card-level (0.03-0.07s delay)
- **Spring animations**: Avatars, modals, success icons (stiffness: 200-300, damping: 12-25)
- **Swipe gestures**: Notification dismiss (drag > 100px threshold)
- **Pull-to-refresh**: Touch-based with animated height indicator
- **Tab switches**: Horizontal slide (10px) with AnimatePresence
- **Greeting transitions**: Animated text swap on time-of-day change
- **Scale on tap**: Buttons (0.93-0.98), nav items (0.9)
- **Confetti**: 20 particles with random positions, colors, rotation, and scale

### CSS Animations
- `animate-float-icon`: Floating decorative icons
- `animate-micro-pulse-glow`: Subtle glow pulse on logos
- `floating-animation`: Gentle up-down float for empty state icons
- `animate-spin`: Loading spinners
- `shimmer-loading`: Shimmer effect on buttons
- `gradient-shift`: Animated gradient background
- `cover-pattern-overlay`: Decorative SVG pattern on book covers
- `card-hover-effect`: Hover elevation on cards
- `glass-effect`: Frosted glass backdrop blur

---

## 20. Seed Data

### Users (3)
1. **Juan Dela Cruz** — Student, CS-2024-0001, Computer Science, 3rd Year, 5-day streak
2. **Maria Santos** — Faculty, FAC-2024-0001, Nursing department
3. **Alex Reyes** — Visitor, VIS-2024-0001

### Resources (17)
- 10 Books (Intro to Algorithms, Clean Code, Design Patterns, Deep Learning, etc.)
- 4 Research papers (NeurIPS, ACM Computing Surveys, etc.)
- 3 Magazines (Scientific American, National Geographic, Time)

### Borrow Records (5)
- 2 active borrows for Juan (Intro to Algorithms, AI: A Modern Approach)
- 2 active borrows for Maria
- 1 returned book for Juan

### Notifications (6)
- Due date reminders, reservation alerts, announcements

### Announcements (2)
- Extended Library Hours for Finals Week
- New Arrivals: AI & Machine Learning Collection

### Library Settings
- Open 7:00 AM – 9:00 PM
- Student: 3 books max, 14 days
- Faculty: 10 books max, 30 days
- Visitor: 1 book max, 7 days

---

## 21. Design System

### Color Theme
- **Primary**: `#652D90` (LibPurple)
- **Primary Light**: `#9B5BBF`
- **Primary Lighter**: `#B87DD4`
- **Primary 50**: `#F3E8FA` (lightest purple tint)
- **Primary 100**: `#E8D5F3`
- **Background**: `#FFFFFF`
- **Surface**: `#F9FAFB` (gray-50)
- **Text**: Foreground / Muted Foreground

### Typography
- Headings: Bold, various sizes (10px-2xl)
- Body: Regular/medium weight
- Labels: 10-12px, uppercase tracking for section headers
- Mono: University IDs

### Component Patterns
- Rounded corners: `rounded-xl` (inputs), `rounded-2xl` (cards), `rounded-3xl` (modals)
- Card shadows: `shadow-sm` default, `shadow-lg` for emphasis
- Icon containers: 36-48px rounded-xl with colored backgrounds
- Badge pills: `rounded-full` with 10px text
- Section dividers: Gradient from transparent via purple/gray to transparent

### Mobile-First Design
- Max container width: 430px
- Touch targets: minimum 44px
- Bottom safe area padding for navigation
- Pull-to-refresh gesture support
- Horizontal scroll with hidden scrollbar (`hide-scrollbar`)

---

## 22. Test Accounts

| Email | Password | Role | Program |
|---|---|---|---|
| juan@university.edu | password123 | Student | Computer Science |
| maria@university.edu | password123 | Faculty | Nursing |
| alex@university.edu | password123 | Visitor | — |

---

*Last updated: April 22, 2026*
*App Version: 1.0.0*
