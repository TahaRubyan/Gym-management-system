<div align="center">

# 🏋️‍♂️ MONSTER GYM — ENTERPRISE MANAGEMENT SYSTEM
### *High-Performance Mobile-First Progressive Web App (PWA) & Offline Operating System*

**Tailored Exclusively for Dastagir Kanth (Founder & Sole Proprietor)**

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

**Monster Gym Management System** is an ultra-luxury, mobile-first Progressive Web Application (PWA) architected specifically for gym owner **Dastagir Kanth**. Built to replace manual paper registers, it provides real-time financial telemetry, an institutional multi-channel revenue console, instant 48-hour expiration radars, and single-tap automated WhatsApp payment reminder dispatching tailored for Pakistani cellular networks.

### 🌟 Key Highlights
- **100% Offline-First Persistence**: Powered by **Dexie.js (IndexedDB)** with `navigator.storage.persist()`. Data is saved permanently on the device and never evicted until the owner explicitly deletes records.
- **Cinematic Welcome Splash Screen**: Executive intro featuring **MONSTER GYM**, owner credential plate for **DASTAGIR KANTH**, and the dynamic React Bits `<RotatingText />` component.
- **Zero-Lag State Synchronicity**: Dexie reactive queries automatically refresh metrics, countdowns, and roster badges upon every mutation with zero hallucination.
- **iOS WebKit Standalone Optimization**: Native iPhone app feel with safe-area padding (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`), `overscroll-behavior-y: none`, and numeric/tel keypads.
- **Automated WhatsApp Dispatch**: Automatically normalizes Pakistani mobile numbers (`0300...` → `92300...`) and generates pre-filled official fee collection alerts.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["📱 iOS Safari / PWA Standalone"]
        UI["Executive UI Layer (React 19 + Motion)"]
        Splash["Welcome Splash (React Bits RotatingText)"]
        Dashboard["Revenue Telemetry Console"]
        Members["Active Roster & Search"]
        Expiring["48-Hour Urgency Radar"]
        WA["1-Tap WhatsApp Reminder Engine"]
    end

    subgraph Storage["💾 Persistent Local Storage Layer"]
        Dexie["Dexie.js IndexedDB Database"]
        MembersTable[("members (id, full_name, phone, expiry_date, status)")]
        PaymentsTable[("payments (id, member_id, amount, fee_type, channel)")]
        RemindersTable[("reminders (id, member_id, sent_at, expiry_date)")]
    end

    Splash -->|Enter Console| Dashboard
    Dashboard --> UI
    Members --> UI
    Expiring --> WA
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
| **Admission Fee** | `admission_fee` | Variable numeric entered at registration (defaults to `0` if promotional). Assessed **exclusively on Month 1**. |
| **Base Monthly Fee** | `monthly_fee` | Strictly fixed at **PKR 2,500 / month**. |
| **Month 1 Collection** | Total Due | `Admission Fee + PKR 2,500` (e.g. `1,500 + 2,500 = PKR 4,000`). |
| **Subsequent Renewals** | Total Due | Strictly **PKR 2,500**. |
| **Renewal Extension** | `expiry_date` | Each payment extends validity by **strictly 30 calendar days**. |
| **Expired Renewal Rule** | Anchor Date | If already expired when renewed: `New Expiry = Today + 30 Days`. If active: `Current Expiry + 30 Days`. |
| **48-Hour Threshold** | `EXPIRING_SOON` | Member is flagged if: `expiry_date >= Today AND expiry_date <= Today + 2 Days`. |
| **Payment Channels** | Supported | `CASH`, `EASYPAISA`, `JAZZCASH`, `BANK_TRANSFER` (Raast / IBFT). |

---

## 📲 WhatsApp Automation Dispatch

The system formats Pakistani telephone numbers and generates instant deep-links compliant with iOS Safari:

### Phone Normalization
- Converts local numbers `03001234567` → `923001234567`.
- Removes non-numeric artifacts (`+`, `-`, spaces).
- Validates 11–12 digit mobile networks.

### Official Message Template
```text
Hey [Member Name], your membership at Monster Gym is about to expire on [YYYY-MM-DD]. Make sure to pay your fee at a time. Regards, Dastagir Kanth (Monster Gym).
```

### Generated Deep Link
```
https://wa.me/923001234567?text=Hey%20Hamza%20Tariq%2C%20your%20membership%20at%20Monster%20Gym%20is%20about%20to%20expire%20on%202026-09-14.%20Make%20sure%20to%20pay%20your%20fee%20at%20a%20time.%20Regards%2C%20Dastagir%20Kanth%20(Monster%20Gym).
```

---

## 🖥️ Screen-by-Screen Breakdown

### 1. Cinematic Welcome Splash
- Animated brand emblem with glowing orbital aura.
- **MONSTER GYM** soft platinum typography with **React Bits `<RotatingText />`** cycling:
  `['EXCLUSIVE ATHLETIC CLUB', 'HIGH-PERFORMANCE SYSTEM', 'REVENUE & TELEMETRY ENGINE', 'DASTAGIR KANTH EDITION']`
- Verified Owner Credential Badge for **DASTAGIR KANTH**.
- **"ENTER MANAGEMENT CONSOLE"** transition trigger.

### 2. Executive Revenue Console (`/dashboard`)
- **Monthly Capital Inflow Hero Card**: High-precision gross revenue total with live sync status.
- **Admission vs. Renewal Split**: Breakout of Month 1 one-offs vs. recurring PKR 2,500 renewals.
- **Active Roster Health Gauge**: Ratio and cyber-bar tracking health of active passes.
- **48-Hour Expiry Radar**: Amber glowing alert badge linking directly to urgent renewals.
- **Multi-Channel Allocation**: Real-time breakdown of Cash, EasyPaisa, JazzCash, and Bank / Raast.
- **Recent Ledger Feed**: Institutional timestamped payment transactions.

### 3. Active Roster Directory (`/members`)
- Instant client-side search by full name or mobile number.
- Filter pills (`All`, `Active`, `Expiring`, `Expired`) with real-time count chips.
- Titanium glass member cards with status indicator lines, countdown pills, and 1-tap Call, WhatsApp, and Log Fee actions.
- Slide-over detail drawer for complete payment history and profile editing.

### 4. 48-Hour Expirations Radar (`/expiring`)
- Filtered strictly to members expiring within the 48-hour window.
- 1-Tap WhatsApp button with visual "Sent" state confirmation.
- Direct "Renew 2.5K" button opening the fee logger pre-filled.

### 5. Add Member Form (`/members/new`)
- Thumb-friendly single-handed layout for iPhone.
- Automatic Month 1 Total calculation (`Admission Fee + PKR 2,500`).
- Payment channel selector and Pakistani phone validation.

### 6. Quick Fee Renewal Sheet
- Pre-selects member and displays current vs. new validity projection (`+30 Days`).
- Locked base fee of PKR 2,500.
- Channel selection and instant offline balance commit.

---

## 🎨 Design System & Color Tokens

```
================================================================================
| Token               | Hex Code    | Description                              |
|---------------------|-------------|------------------------------------------|
| Canvas Background   | #080B11     | Deep matte carbon for OLED displays      |
| Surface Card        | #0F1522     | Elevated container background            |
| Card Border         | #1E2B3E     | Subtle titanium divider                  |
| Text Platinum       | #E2E8F0     | High-contrast soft platinum text         |
| Text Slate          | #94A3B8     | Secondary metadata label grey            |
| Accent Emerald      | #10B981     | Neon emerald for active states & inflows |
| Amber Warning       | #F59E0B     | Warm champagne amber for 48h radar       |
| Danger Crimson      | #EF4444     | Ruby red for expired & overdue records   |
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
