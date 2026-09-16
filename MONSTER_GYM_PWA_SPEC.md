# Monster Gym — PWA Management System Specification

**Gym Name:** Monster Gym  
**Owner / Sole Administrator:** Dastagir Kanth  
**Target Platform:** Mobile-First Progressive Web App (PWA) — Optimized for iOS Safari & WebKit Standalone  
**Design Reference:** Modern Dark CRM Dashboard (Deep Slate `#0B0E14`, Charcoal `#141923`, Emerald `#10B981`, Amber `#F59E0B`)

---

## 1. Project Overview & Architecture

### 1.1 Objective
A single-tenant mobile Progressive Web App (PWA) built specifically for gym owner **Dastagir Kanth** to operate **Monster Gym** directly from an iPhone. The system eliminates paper registers, tracks monthly cash and digital flows, flags members whose passes expire in 48 hours, and enables one-touch WhatsApp reminder dispatching.

### 1.2 Recommended Tech Stack
* **Frontend Framework:** React 19 + TypeScript + Vite
* **Styling & Icons:** Tailwind CSS v4 + Lucide React
* **State & Data Fetching:** TanStack Query (React Query) + Supabase JS Client (or LocalStorage/IndexedDB fallback)
* **Backend / Database:** Supabase (PostgreSQL with Row Level Security) or SQLite via Cloudflare D1 / Express API
* **PWA Engine:** `vite-plugin-pwa` with Workbox caching strategies and iOS meta headers

### 1.3 iOS Standalone Experience Requirements
To deliver a native app feel on iOS Safari:
* `apple-mobile-web-app-capable`: `yes`
* `apple-mobile-web-app-status-bar-style`: `black-translucent`
* `viewport-fit=cover` with safe-area paddings:
  * `padding-top: env(safe-area-inset-top)`
  * `padding-bottom: env(safe-area-inset-bottom)`
* `overscroll-behavior-y: none` to eliminate rubber-band bouncing on navigation elements.
* `inputmode="numeric"` / `inputmode="tel"` for rapid keypad entry without layout shifts.

---

## 2. Business Rules & Financial Model

### 2.1 Fee Structure
* **Admission Fee:** Variable one-off charge assessed strictly during Month 1 registration (e.g., PKR 1,000, PKR 1,500, or PKR 0 for special promotions).
* **Regular Monthly Fee:** Fixed at **PKR 2,500 / month**.
* **First Month Collection:** `Admission Fee + Regular Fee (PKR 2,500)`.
* **Subsequent Renewals:** `PKR 2,500 / month`.

### 2.2 Payment Methods & Channels
* `CASH`
* `BANK_TRANSFER` with channel tags:
  * `EasyPaisa`
  * `JazzCash`
  * `Bank Transfer / Raast`

### 2.3 Expiry & Renewal Window
* Each payment extends membership validity by **30 calendar days**.
* **Expiring Soon Trigger:** Members whose `expiry_date` falls between `Today` and `Today + 2 Days`.
* **Automated WhatsApp Message Template:**
  > *"Hey [Member Name], your membership at Monster Gym is about to expire on [Expiry Date]. Make sure to pay your fee at a time. Regards, Dastagir Kanth (Monster Gym)."*

---

## 3. Screen-by-Screen Functional Specifications

### Screen 1: Executive Revenue Dashboard (`/dashboard`)
* **Header:** "Monster Gym" branding with active administrator label ("Dastagir Kanth") and month selector.
* **Top Metric Cards:**
  * **Monthly Revenue:** Total PKR collected in current calendar month (segmented into Admission vs. Monthly Renewals).
  * **Active Members:** Count of paid-up members whose passes are currently valid.
  * **Expiring (48 Hours):** Red/amber count chip with one-tap link directly to Expirations.
  * **Channel Breakdown:** Visual breakdown of Cash, EasyPaisa, JazzCash, and Bank Transfers.
* **Recent Activity Feed:** Real-time log of the latest fee payments with member name, timestamp, payment method badge, and amount.

### Screen 2: Members Directory (`/members`)
* **Search & Filters:** Real-time search by full name or mobile number with quick filter pills: `All`, `Active`, `Expiring`, `Overdue`.
* **Member Card UI:**
  * Member Name & Clean Mobile Number.
  * Status Badge: `Active` (Green), `Expiring Soon` (Amber), `Overdue` (Red).
  * Expiration date countdown (e.g., "Expires in 1 day", "Expired 3 days ago").
  * Quick-actions: Call button, direct WhatsApp link, and "Log Fee" button.

### Screen 3: New Member Registration (`/members/new`)
* **Fields:**
  * **Full Name** (Text, Required)
  * **Phone Number** (Tel, Formatted for Pakistan e.g., `03001234567` / `923001234567`)
  * **Joining Date** (Date picker, default: Today)
  * **Admission Fee** (Number, e.g., `1500`, Default: `0`)
  * **Monthly Fee** (Number, Readonly/Default: `2500`)
  * **Payment Method** (Selectable Chips: `Cash`, `EasyPaisa`, `JazzCash`, `Bank Transfer`)
  * **Notes** (Optional Text)
* **Actions on Submit:**
  * Generates member profile record.
  * Creates initial payment entry totaling `Admission Fee + 2500`.
  * Computes and records `expiry_date = joining_date + 30 days`.

### Screen 4: Expirations & WhatsApp Alerts (`/expiring`)
* **List Query:** Filtered strictly to members where `expiry_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '2 DAYS')`.
* **Member Card & WhatsApp Trigger:**
  * Displays member's name, phone, and exact expiry date.
  * **Send WhatsApp Reminder Button:** Automatically generates and opens WhatsApp URL:
    `https://wa.me/{phone}?text={encoded_message}`
  * Displays visual checkmark "Reminder Sent" when tapped.
* **Quick Renew Button:** Opens fee collection modal directly from this view.

### Screen 5: Log Fee Modal / Bottom Sheet
* **Triggerable from:** Expiring screen, Members directory, or Global Floating Action Button (+).
* **Fields:**
  * Member Selector / Pre-selected Member.
  * Renewal Amount (Default: `2500`).
  * Payment Date (Default: Today).
  * Method: `Cash` | `EasyPaisa` | `JazzCash` | `Bank Transfer`.
  * Reference Note / Transaction ID (Optional).
* **Actions on Submit:**
  * Inserts transaction into `payments`.
  * Increments member `expiry_date` by 30 days (or sets to `Today + 30 days` if already expired).

---

## 4. UI Design System (CRM Dashboard Theme)

```
================================================================================
| Token               | Value     | Description                                |
|---------------------|-----------|--------------------------------------------|
| Background Base     | #0B0E14   | Deep matte carbon for iOS OLED display     |
| Surface Card        | #141923   | Elevated container background              |
| Border Stroke       | #222B3D   | 1px subtle divider                         |
| Primary Accent      | #10B981   | Emerald neon for CTAs, revenue, active state|
| Warning / Expiring  | #F59E0B   | Warm amber for 48h expiry warnings         |
| Danger / Overdue    | #EF4444   | Crimson red for expired records            |
| Text Primary        | #F9FAFB   | Clean high-contrast white                  |
| Text Secondary      | #9CA3AF   | Muted slate grey for metadata              |
================================================================================
```

### Bottom Navigation Bar (Fixed iOS Shell)
* **Tab 1: Revenue** (`TrendingUp` Icon)
* **Tab 2: Members** (`Users` Icon)
* **Tab 3: Add Member (+)** (Elevated Center Button)
* **Tab 4: Expiring** (`ClockAlert` Icon with dynamic counter badge)

---

## 5. PostgreSQL Database Schema (Supabase DDL)

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Members Table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    admission_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    monthly_fee NUMERIC(10, 2) NOT NULL DEFAULT 2500.00,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRING, EXPIRED
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Payments & Financial Transactions Table
CREATE TYPE payment_channel_enum AS ENUM ('CASH', 'EASYPAISA', 'JAZZCASH', 'BANK_TRANSFER');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    fee_type VARCHAR(30) NOT NULL, -- 'FIRST_MONTH_PACKAGE' or 'MONTHLY_RENEWAL'
    channel payment_channel_enum NOT NULL DEFAULT 'CASH',
    transaction_ref VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    valid_until DATE NOT NULL
);

-- 3. Fast Lookup Indexes for Mobile
CREATE INDEX idx_members_expiry ON members(expiry_date);
CREATE INDEX idx_members_phone ON members(phone);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);
```

---

## 6. Frontend Utility Implementations

### 6.1 WhatsApp Deep-Link Builder
```typescript
export function buildWhatsAppReminderUrl(fullName: string, phone: string, expiryDate: string): string {
  // Normalize phone for Pakistani networks (e.g. 03001234567 -> 923001234567)
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '92' + cleanPhone.slice(1);
  }

  const message = `Hey ${fullName}, your membership at Monster Gym is about to expire on ${expiryDate}. Make sure to pay your fee at a time. Regards, Dastagir Kanth (Monster Gym).`;
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
```

### 6.2 Membership Expiry Classifier
```typescript
export type MembershipStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';

export function checkMembershipStatus(expiryDateIso: string): { status: MembershipStatus; daysRemaining: number } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateIso);
  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { status: 'EXPIRED', daysRemaining: diffDays };
  if (diffDays <= 2) return { status: 'EXPIRING_SOON', daysRemaining: diffDays };
  return { status: 'ACTIVE', daysRemaining: diffDays };
}
```

---
*Monster Gym PWA Architecture Specification — Document Prepared for Dastagir Kanth.*