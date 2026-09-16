<div align="center">

# 🏋️‍♂️ MONSTER'S GYM — ENTERPRISE MANAGEMENT SYSTEM
### *High-Performance Mobile-First Progressive Web App (PWA) & Offline Operating System*

**Tailored Exclusively for DASTGIR KANTH (Founder & Sole Proprietor)**

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Dexie.js](https://img.shields.io/badge/Dexie.js-IndexedDB-00599C?style=for-the-badge&logo=sqlite&logoColor=white)](https://dexie.org/)
[![iOS PWA](https://img.shields.io/badge/iOS-Standalone_WebKit-000000?style=for-the-badge&logo=apple&logoColor=white)](https://developer.apple.com/)

---

```
  __  __  ____  _   _  ____ _____ _____ ____     ______   ____  __ 
 |  \/  |/ __ \| \ | |/ ____|_   _|  ___|  _ \   / ___\ \ / /  \/  |
 | \  / | |  | |  \| | (___   | | | |__ | |_) | | |  _ \ V /| |\/| |
 | |\/| | |  | | . ` |\___ \  | | |  __||  _ <  | |_| | | | | |  | |
 | |  | | |__| | |\  |____) |_| |_| |___| |_) |  \____| |_| |_|  |_|
 |_|  |_|\____/|_| \_|_____/|_____|_____|____/    SYSTEM CONSOLE    
```

</div>

---

## ⚡ Executive Overview

**MONSTER'S GYM Management System** is an ultra-luxury, mobile-first Progressive Web Application (PWA) architected specifically for gym owner **DASTGIR KANTH**. Built to replace manual paper registers, it provides real-time financial telemetry, an institutional multi-channel revenue console, instant 48-hour expiration radars, live member photo capture, overdue payment date anchoring, and customizable WhatsApp payment reminder dispatching tailored for Pakistani cellular networks.

### 🌟 Key Highlights
- **100% Offline-First Persistence**: Powered by **Dexie.js (IndexedDB)** with `navigator.storage.persist()`. Custom data is permanently preserved and safely merged with test data without deletion.
- **4-Digit Security Entrance PIN**: Owner protection with numeric keypad, error shake animation, and customizable PIN (default `1234`) configured in Settings.
- **Cinematic Welcome Splash Screen**: Executive entrance featuring **MONSTER'S GYM**, dynamic React Bits `<RotatingText />` on **DASTGIR KANTH**, and smooth transition into PIN verification.
- **Live Member Photo Capture**: Built-in webcam viewfinder with center crop and mobile camera fallback. Member photos appear directly on member cards, rosters, and drawers for effortless visual tracing.
- **Overdue Payment Date Anchoring**: When an expired member renews, the owner can flexibly choose between **"Renew from Today (Payment Date + 30 Days)"** or **"From Old Expiry (Carry Forward)"**.
- **Dedicated Settings Console**: Adjust monthly fee rates, default admission fees, gym & owner identity, customizable WhatsApp message templates, and non-destructive demo data merging.
- **Instant Test Members in 48-Hour Radar**: Pre-seeded with **TAHA RUBYAN** (`03481488937`) and **FARHAN BUTT** (`03177769001`) for immediate 1-tap WhatsApp testing.
- **iOS WebKit Standalone Optimization**: Native iPhone app feel with safe-area padding (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`), `overscroll-behavior-y: none`, and numeric/tel keypads.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["📱 iOS Safari / PWA Standalone"]
        UI["Executive UI Layer (React 19 + Motion)"]
        Splash["Welcome Splash & PIN Lock (React Bits RotatingText on Dastgir Kanth)"]
        Dashboard["Fintech Revenue Telemetry Console"]
        Members["Active Roster & Search (with Live Member Photos)"]
        Expiring["48-Hour Urgency Radar (Taha Rubyan & Farhan Butt)"]
        Settings["System Settings & Customizer"]
        WA["1-Tap WhatsApp Reminder Engine"]
    end

    subgraph Storage["💾 Persistent Local Storage Layer"]
        Dexie["Dexie.js IndexedDB Database"]
        MembersTable[("members (id, full_name, phone, expiry_date, photo_url, status)")]
        PaymentsTable[("payments (id, member_id, amount, fee_type, channel)")]
        RemindersTable[("reminders (id, member_id, sent_at, expiry_date)")]
        LocalStorage[("localStorage (GymSettings & Security PIN)")]
    end

    Splash -->|Enter 4-Digit PIN| Dashboard
    Dashboard --> UI
    Members --> UI
    Expiring --> WA
    Settings --> LocalStorage
    WA -->|Deep Link (wa.me/923...)| WhatsAppApp["💬 WhatsApp Native Client"]
    UI <-->|Reactive Live Queries| Dexie
    Dexie --> MembersTable
    Dexie --> PaymentsTable
    Dexie --> RemindersTable
```

---

## 💎 Financial Engine & Business Rules

| Business Rule | Parameter | Specification & Logic |
|---|---|---|
| **Security PIN** | `securityPin` | 4-digit PIN (default `1234`), required on login, changeable in Settings. |
| **Admission Fee** | `admission_fee` | Variable numeric entered at registration (defaults to Settings value). Assessed **exclusively on Month 1**. |
| **Base Monthly Fee** | `monthly_fee` | Defaults to **PKR 2,500 / month**, configurable in Settings. |
| **Month 1 Collection** | Total Due | `Admission Fee + Monthly Fee` (e.g. `1,000 + 2,500 = PKR 3,500`). |
| **Subsequent Renewals** | Total Due | Standard Monthly Fee (default **PKR 2,500**). |
| **Renewal Extension** | `expiry_date` | Each payment extends validity by **strictly 30 calendar days**. |
| **Overdue Anchor Option** | Anchor Mode | Expired members can be renewed from **Current Payment Date** (`Today + 30 Days`) or **Previous Expiry** (`Old Expiry + 30 Days`). |
| **48-Hour Threshold** | `EXPIRING_SOON` | Member is flagged if: `expiry_date >= Today AND expiry_date <= Today + 2 Days`. |
| **Live Photo Capture** | `photo_url` | 320x320 JPEG captured via webcam or mobile upload, displayed on member cards. |
| **Payment Channels** | Supported | `CASH`, `EASYPAISA`, `JAZZCASH`, `BANK_TRANSFER` (Raast / IBFT). |

---

## 📲 WhatsApp Automation Dispatch & Test Members

The system formats Pakistani telephone numbers and generates instant deep-links compliant with iOS Safari:

### Pre-Configured Test Members for Immediate Verification:
1. **TAHA RUBYAN** — `03481488937` *(Expires Today — High Priority Radar)*
2. **FARHAN BUTT** — `03177769001` *(Expires Tomorrow — Urgent Radar)*

### Official WhatsApp Renewal Message Template (With Spacing & Emojis)
```text
Assalam-o-Alaikum [Member Name]! 🏋️‍♂️

This is an official renewal reminder from *MONSTER'S GYM*.

📅 *Membership Expiry:* [Formatted Date] ([YYYY-MM-DD])
💰 *Monthly Fee:* PKR 2,500

✨ *Important Note:*
Kindly renew your membership by your expiry date to enjoy uninterrupted gym floor, professional equipment, and locker access.

💳 *Accepted Payment Methods:*
• 💵 Cash at Front Desk
• 📱 EasyPaisa
• 📲 JazzCash

If you have already paid or have questions, feel free to reply to this message.

Stay fit, stay strong! 💪🔥

Warm Regards,
*DASTGIR KANTH*
Owner & Founder, MONSTER'S GYM 👑
```

### Official WhatsApp Welcome Message Template
```text
Assalam-o-Alaikum [Member Name]! 🏋️‍♂️🎉

Welcome to the *MONSTER'S GYM* family! Your membership has been successfully registered.

📋 *Membership Pass Details:*
• 👤 *Member Name:* [Member Name]
• 📅 *Pass Valid Until:* [Formatted Date]
• 💰 *Monthly Renewal Fee:* PKR 2,500

✨ *Gym Facilities & Guidelines:*
• 🏋️ Full access to gym floor & heavy workout stations
• 🔒 Safe locker facility available
• ⏱️ Training hours: Monday to Saturday

We are excited to partner with you on your fitness transformation. Let's crush your goals together! 💪🔥

Warm Regards,
*DASTGIR KANTH*
Owner & Head Coach, MONSTER'S GYM 👑
```

---

## 🌊 Scroll Effects & System Interactions

- **Dynamic Interactive Header Scroll**: Listens to scroll position, compacting padding and transitioning from transparent glass to elevated frosted backdrop (`backdrop-blur-2xl bg-white/95 border-b border-[#E9ECEF] shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)]`).
- **Floating Spring Scroll-to-Top Button**: Smoothly animates in when the user scrolls beyond 200px down any page, allowing single-tap smooth glide back to the top.
- **Card Viewport Reveal Animations**: Cards on the Dashboard, Roster, and Expiring feeds smoothly fade in and glide up as the user scrolls into view (`whileInView`).
- **Automatic Scroll Reset on Navigation**: Smoothly resets scroll to top whenever changing bottom navigation tabs.
- **iOS WebKit Momentum Scrolling**: Full `-webkit-overflow-scrolling: touch` with `scroll-behavior: smooth`.

---

## 🖥️ Screen-by-Screen Breakdown

### 1. Cinematic Welcome Splash
- Animated brand emblem with glowing electric blue orb.
- **MONSTER GYM** typography with balanced letter spacing, paired with **React Bits `<RotatingText />`** transition rotating across:
  `['DASTAGIR KANTH', 'THE FOUNDER', 'EXECUTIVE OWNER', 'CHIEF TRAINER']`
- **Prominent Mobile "CONTINUE TO DASHBOARD →" Button** pinned dynamically to the viewport bottom (`safe-bottom`), guaranteeing visibility across all mobile screens and iOS Safari URL bar states.

### 2. Modern Fintech Revenue Console (`/dashboard`)
- **"You are on Top of your Gym Finances"** hero headline matching fintech design aesthetics.
- **Total Inflow Card**: Elevated pure white card (`bg-white rounded-[28px]`) with smooth SVG sparkline curve, live collection count, and real-time offline sync indicator.
- **Renewals & Admissions Split**: Side-by-side metric tiles with ↗ trend chips.
- **48-Hour Urgency Radar Card**: Displays urgent count with instant navigation to 1-tap WhatsApp notifications.
- **Recent Inflows Feed**: Timestamped payment ledger with circular member avatar pills and payment channel badges.

### 3. Active Roster Directory (`/members`)
- Instant client-side search by full name or mobile number.
- 50px rounded search bar and electric blue filter pills (`All`, `Active`, `Expiring`, `Expired`).
- Clean white member cards (`rounded-[22px]`) with active status pill badges, countdown tags, and 1-tap Call, WhatsApp, and Log Fee actions.
- Slide-over detail drawer for complete payment history and profile editing.

### 4. 48-Hour Expirations Radar (`/expiring`)
- Filtered strictly to members expiring within the 48-hour window.
- Pre-populated with **TAHA RUBYAN** and **FARHAN BUTT** featuring prominent `TEST` tags.
- 1-Tap WhatsApp button with visual "Sent" confirmation indicator.
- Direct "Renew 2.5K" button opening the fee logger pre-filled.

### 5. Phased Member Registration & Celebration Wizard (`/members/new`)
- **Phase 1 (Customer Details)**: Full name, Pakistani mobile number (with real-time validation), joining date, and optional notes/locker ID.
- **Phase 2 (Amount & Channel)**: Strictly fixed monthly base fee of PKR 2,500 + variable admission fee with live Month 1 calculation (`Admission + PKR 2,500`), 30-day projection, and multi-channel selector.
- **Celebration Phase**: Fluid spring animation upon enrollment featuring pulsing verification badge in electric blue, confirmation card, one-tap WhatsApp welcome trigger, and direct roster navigation.

### 6. Quick Fee Renewal Sheet
- Pre-selects member and displays current vs. new validity projection (`+30 Days`).
- Locked base fee of PKR 2,500.
- Channel selection and instant offline balance commit.

---

## 🎨 Custom Modern Fintech Design System

Crafted with high-contrast legibility, **Plus Jakarta Sans** eyesight-friendly typography, 50px input ergonomics, 48px touch targets, and modern fintech palette tokens:

```
================================================================================
| Token               | Hex Code    | Description                              |
|---------------------|-------------|------------------------------------------|
| Primary Brand Blue  | #1A3EEA     | Primary buttons, active tabs, CTAs       |
| Blue Hover State    | #1534D8     | Button hover & active interaction states |
| Soft Sky Tint       | #EBF1FF     | Active pill backgrounds, subtle tags     |
| Canvas Background   | #F4F6F9     | Clean, modern off-white page canvas      |
| Pure White Card     | #FFFFFF     | Elevated rounded-[24px]/[28px] cards      |
| High-Contrast Dark  | #0F172A     | Headings, primary text, prominent figures|
| Secondary Slate     | #64748B     | Subtitles, timestamps, field labels       |
| Light Slate Border  | #E9ECEF     | Subtle dividers, card borders             |
| Deep Black Control  | #111827     | Header quick action button                |
================================================================================
```

---

## 🧪 Automated Verification Suite

The repository includes an automated business logic and boundary verification suite:

```bash
npm test
```

### Test Results
```
=== TEST 1: Pakistani Phone Normalization & Validation ===
  ✓ Leading 0 is replaced by 92
  ✓ Hyphens stripped and normalized
  ✓ + and spaces stripped, 92 preserved
  ✓ 10 digits starting with 3 prepends 92
  ✓ 03001234567 is valid Pakistani phone
  ✓ +923219876543 is valid Pakistani phone
  ✓ Too short phone number rejected
  ✓ Landline prefix (021) rejected for mobile

=== TEST 2: WhatsApp Deep-Link Builder & Exact Message Format ===
  ✓ Target URL prefix is correct
  ✓ Message text matches required spec verbatim

=== TEST 3: Fixed Fee & First Month Calculation ===
  ✓ Base monthly fee is strictly PKR 2,500
  ✓ First month collection is Admission Fee + PKR 2,500
  ✓ First month with 0 admission fee is PKR 2,500

=== TEST 4: 48-Hour Expiring Window Classification ===
  ✓ Expires today is EXPIRING_SOON
  ✓ Expires tomorrow is EXPIRING_SOON
  ✓ Expires in 2 days is EXPIRING_SOON
  ✓ Expires in 3 days is ACTIVE
  ✓ Expired yesterday is EXPIRED

=== TEST 5: Renewal Lifecycle & Boundary Logic ===
  ✓ Active renewal adds 30 calendar days to current expiry
  ✓ Expired renewal anchors from today + 30 calendar days
  ✓ Renewal across Feb 29 leap year calculates accurately (+30 days)

======================================
TOTAL TESTS: 21 | PASSED: 21 | FAILED: 0
ALL VERIFICATIONS PASSED SUCCESSFULLY!
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone repository
git clone https://github.com/TahaRubyan/Gym-management-system.git
cd Gym-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Preview
```bash
# Compile TypeScript & bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 📱 iOS PWA Installation Guide (For Dastagir Kanth)

1. Open Safari on iPhone and navigate to the deployed URL.
2. Tap the **Share** button in the Safari navigation bar.
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top right corner.
5. The **Monster Gym** app icon will appear on your iOS home screen, launching full-screen without browser toolbars.

---

## 👤 Owner & Architecture Credits

- **Gym Owner & Sole Operator**: Dastagir Kanth
- **Repository**: [TahaRubyan/Gym-management-system](https://github.com/TahaRubyan/Gym-management-system)
- **License**: Proprietary / Private Enterprise

---
*Monster Gym PWA Management Console — High-Performance Athletic Operating System.*
