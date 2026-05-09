# `src/components/layout` and `src/components/screens` Guide

## Overview

The `src/components` directory is organized by responsibility rather than by low-level UI atoms.

- `layout/` contains shared structural components that shape the app shell and navigation.
- `screens/` contains full-page or full-view React components that represent major application screens.
- This separation keeps navigation chrome reusable while allowing each screen to focus on its own data, state, and rendering logic.

> Note: the workspace folder names use `components`, not `componenets`.

---

## `src/components/layout`

### Purpose

The `layout` folder holds components that are responsible for the user interface structure that persists across multiple views. These components are usually rendered at the app level and coordinate navigation, screen switching, and persistent controls.

### Current file

#### `BottomNav.tsx`

`BottomNav` is the only layout component currently present in the folder. It provides the persistent bottom navigation bar used throughout the app.

### Responsibilities

- **Navigation control:** switches between major app screens such as `home`, `search`, `borrowed`, `profile`, and `qr-scan`.

### Behavior details- **Responsive shell behavior:** acts as a reusable navigation strip rather than screen-specific content.- **Primary action support:** includes the dedicated QR scan button as a standout action.- **Status feedback:** displays an active borrow badge on the `Borrowed` tab.- **Global state integration:** reads and updates app-wide state through `useAppStore`.

- The component reads `currentScreen`, `setCurrentScreen`, and `user` from the app store.
- It fetches active borrow counts from `/api/borrow?userId=...&status=active` and uses that count as a badge on the `Borrowed` tab.
- It highlights the active tab by comparing `currentScreen` with each nav item.
- It exposes a separate scan button that activates the `qr-scan` screen.
- It uses icons from `lucide-react` to keep the navigation compact and visually consistent.

### Design role in the app

`BottomNav` is part of the app shell. In a screen-based app architecture, this kind of component is typically rendered once and stays visible while the center content changes. That makes it ideal for:

- preserving navigation across the app,

- providing quick access to primary workflows,
- showing high-value state such as unread or active item counts.

### Key dependencies

- `@/lib/store` for app state and screen switching.

- `lucide-react` for icons.

- React hooks such as `useState`, `useEffect`, and `useCallback` for local UI state and side effects.

---

## `src/components/screens`

### Purpose

The `screens` folder contains the app’s main view components. Each file represents a self-contained screen that usually corresponds to a navigation destination or a major task flow.

These components commonly:

- fetch their own data,
- manage local loading and UI state,
- render a full screen layout,
- interact with the global store when navigation or shared app data is required.

### Common screen patterns

Most screen components in this folder follow a similar structure:

1. **Client rendering:** they begin with `'use client'` because they rely on hooks and browser-only behavior.
2. **Store usage:** they read from `useAppStore` for user information, screen changes, or back navigation.
3. **API calls:** they fetch data from `api/*` routes.
4. **Loading states:** they show skeletons, fallback data, or placeholders while loading.
5. **Motion and transitions:** many screens use `framer-motion` for subtle entry animations.
6. **Icon-led UI:** most views use `lucide-react` icons for compact visual cues.

---

## Screen-by-screen explanation

### `AttendanceScreen.tsx`

A dedicated attendance analytics screen for library visits.

**Main responsibilities:**

- fetches attendance records for the current user,
- falls back to mock attendance data when the API is unavailable,
- calculates summary metrics such as visits, total hours, and streak,
- renders a month calendar heat map showing attended days,
- shows recent visit records in descending date order.

**Important implementation details:**

- Uses `useAppStore` to access `user` and `goBack`.
- Converts API timestamps into readable `timeIn` and `timeOut` strings.
- Uses `useMemo` to derive attended days and recent records efficiently.
- Combines summary cards, calendar grid, and recent history into one dashboard-like view.

### `HomeScreen.tsx`

The most complex screen in the folder and likely the main landing page.

**Main responsibilities:**

- loads borrowed books, recommendations, trending items, announcements, and reading sessions,
- displays dashboard-style summaries and personalized content,
- supports pull-to-refresh behavior,
- updates library status information such as opening state and closing time,
- shows unread notifications and progress-related information.

**Important implementation details:**

- Uses many state variables because it aggregates several data sources.
- Fetches multiple endpoints, including borrow, attendance, resources, announcements, reading sessions, and settings.
- Builds richer UI experiences with skeletons, animated sections, and content carousels.
- Serves as a central content hub rather than a narrow task screen.

### `BookDetailScreen.tsx`

A detail view for a single book or resource.

**Typical role:**

- presents metadata such as title, author, category, and availability,
- likely supports user actions like borrowing, reserving, or favoriting,
- focuses on one resource at a time rather than list browsing.

### `BorrowedScreen.tsx`

A user-focused screen for active and past borrows.

**Typical role:**

- lists borrowed items,
- highlights due dates, overdue status, or active borrow information,
- gives users a clear way to track books they currently have.

### `EditProfileScreen.tsx`

A form-oriented screen for editing user profile details.

**Typical role:**

- lets users update personal data,
- likely handles form validation and save actions,
- may integrate with the user section of the app store or profile API.

### `FavoritesScreen.tsx`

A collection screen for saved or bookmarked resources.

**Typical role:**

- shows items the user has marked as favorites,
- helps users quickly return to preferred books or resources,
- usually relies on list rendering and empty-state handling.

### `LoginScreen.tsx`

The authentication entry screen.

**Typical role:**

- accepts user credentials or identity data,
- redirects into the app after successful login,
- usually controls access to the rest of the screen system.

### `NotificationsScreen.tsx`

A screen for system messages and alerts.

**Typical role:**

- displays notifications such as reminders, updates, or announcements,
- may support unread counts and read-state updates,
- often connects to both personal activity and library-wide events.

### `OnboardingScreen.tsx`

The first-time user introduction flow.

**Typical role:**

- introduces the app’s features,
- helps new users understand navigation and value,
- may show a multi-step welcome or tutorial experience.

### `ProfileScreen.tsx`

The user profile dashboard.

**Typical role:**

- displays user identity and account information,
- often contains shortcuts to attendance, settings, favorites, or edit profile,
- acts as the personal account center.

### `QRScanScreen.tsx`

A focused screen for scanning QR codes.

**Typical role:**

- supports camera-driven or scan-based workflows,
- likely used for checking in, borrowing, or opening resource actions,
- is treated as a primary action rather than a regular tab.

### `ReservationsScreen.tsx`

A screen for reserved items.

**Typical role:**

- shows books or resources that the user has reserved,
- helps track queue position, pickup readiness, or reservation status,
- complements the borrowed-items experience.

### `SearchScreen.tsx`

The catalog discovery screen.

**Typical role:**

- lets users search and filter library resources,
- likely includes query input, category filters, and browse results,
- acts as the main discovery surface for the catalog.

### `SettingsScreen.tsx`

The configuration screen for app and user preferences.

**Typical role:**

- exposes app settings, account preferences, or behavioral toggles,
- may include library settings if the user has admin-level access,
- often contains options that affect global app behavior.

---

## How the two folders work together

### Navigation flow

- `layout/` provides persistent navigation such as `BottomNav`.
- `screens/` provides the views that navigation switches between.
- The app store acts as the bridge between the two by holding `currentScreen` and related state.

### Responsibility split

| Folder     | Responsibility                      | Example                                  |
| ---------- | ----------------------------------- | ---------------------------------------- |
| `layout/`  | Persistent structure and navigation | `BottomNav.tsx`                          |
| `screens/` | Full-page application views         | `HomeScreen.tsx`, `AttendanceScreen.tsx` |

### Why this structure is useful

- **Maintainability:** each screen can grow without affecting shared navigation.
- **Reusability:** layout components can be reused across many views.
- **Clarity:** it is easy to tell whether a file controls app structure or a specific user flow.
- **Scalability:** new screens can be added without redesigning the shared shell.

---

## Recommended conventions for these folders

### For `layout/`

- Keep components focused on app shell concerns.
- Avoid putting page-specific business logic here.
- Prefer reusable controls that appear across many screens.
- Keep navigation state synchronized with the global store.

### For `screens/`

- Treat each file as a self-contained page-level component.
- Keep data fetching close to the screen that needs it.
- Move reusable subcomponents out only when they start repeating.
- Use loading and empty states so each screen feels complete on its own.

### For file naming

- Use `PascalCase` for component files, which the project already follows.
- Keep names descriptive and tied to the user task, such as `SearchScreen.tsx` or `ProfileScreen.tsx`.
- Avoid mixing layout concerns into screen files unless the component is truly page-specific.

---

## Quick summary

- `src/components/layout` contains shared navigation and shell UI.
- `src/components/screens` contains complete app views and user workflows.
- `BottomNav.tsx` is the main layout component currently present.
- `HomeScreen.tsx` and `AttendanceScreen.tsx` show the app’s pattern of fetching data, managing state, and rendering rich screen layouts.
- The structure is designed to keep navigation stable while individual screens remain independent and easy to extend.
