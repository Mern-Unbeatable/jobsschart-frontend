# Donation Page Changes

Date: 2026-08-23

Hero section was **not** changed in this task (already updated separately by the developer).  
Items still waiting on the client (not implemented yet):

- New main hero picture (client will send)
- New text under the picture (client will send)

---

## Summary of client requests handled

| Request | Status |
|---|---|
| Replace main picture | Pending (client will send) |
| Replace text under picture | Pending (client will send) |
| “Support Network Mediums” → “Support Illorac” | Done |
| Soft light-green design (less white) | Done |
| Dutch “Donor/Donator” → “Donateur” | Done |
| Benefit/Support Cause → free text | Done |
| Dutch donor type labels | Done |
| Remove minimum donation (€100) | Done |
| Simpler donate flow + payment methods info | Done |
| Hero section | Skipped (already changed) |

---

## File-by-file changes

### 1. `src/pages/donation/Donation.jsx`

| Before | After |
|---|---|
| Page background `#FBFDFF` (cool white/blue) | Page background `#F3FAF5` (soft light green) |
| Default `benefit: "Feed a Family"` | Default `benefit: ""` (blank free text) |

---

### 2. `src/pages/donation/sections/ImpactSection.jsx`

| Before | After |
|---|---|
| White/blue bg `#FBFDFF` | Soft green bg `#F3FAF5` |
| Purple accents (`#6E35AE`, `#F8F3FD`, `#E9D5FF`) | Emerald/green accents |
| Large vertical spacing (`py-14 md:py-20`, `mb-14 md:mb-20`) | Tighter spacing to reduce empty white space |
| Large heading sizes / purple underline | Slightly smaller headings + emerald underline |

---

### 3. `src/pages/donation/sections/DonationFormSection.jsx`

| Before | After |
|---|---|
| `MIN_DONATION_AMOUNT = 100` enforced | No minimum; any amount `> 0` allowed |
| Benefit field = fixed `<select>` options | Benefit field = free `<textarea>` |
| Purple-tinted form chrome / gray-white blocks | Soft emerald/green form styling |
| Submit: `Donate €{{amount}} Now` style CTA | Clear **Donate / Doneren** pill button |
| No payment method hints | Shows iDEAL, Visa, Bank payment chips |
| Amount hint: “Minimum donation: €100.00” | Hint: choose freely how much to donate |
| Hardcoded English label “Benefit / Support Cause” | Uses i18n keys |

Payment still goes through Mollie checkout (same API). Users pick iDEAL / Visa / bank on the Mollie payment screen after clicking Donate.

---

### 4. `src/locales/en.json` (`donationForm` + related)

| Key / text | Before | After |
|---|---|---|
| `donationForm.header.title` | Support Network mediums | Support Illorac |
| `donationForm.formHeader.title` | Choose Your Contribution | Donate |
| `donationForm.fields.amount.hint` | Minimum donation: €100.00 | Choose freely how much you want to donate. |
| `donationForm.fields.amount.minError` | Minimum €100 message | Removed (replaced by `invalidError`) |
| `donationForm.fields.benefit` | (missing) | Free-text label + placeholder added |
| `donationForm.donorType.*` | Donator Type / Individual Donator / Business Donator | Donor type: / Individual Donor / Business Donor |
| `donationForm.button` | Donate €{{amount}} Now | Donate (+ `buttonWithAmount`) |
| `donationForm.paymentMethods` | (missing) | iDEAL, Visa, Bank payment |
| `donation.benefit` copy | “Donators” wording | “Donors” wording |

---

### 5. `src/locales/nl.json` (`donationForm` + related)

| Key / text | Before | After |
|---|---|---|
| `donationForm.header.title` | Ondersteuning van netwerkmedia | Support Illorac |
| `donationForm.formHeader.title` | Kies je bijdrage | Doneren |
| `donationForm.fields.amount.hint` | Minimumdonatie: €100.00 | Kies zelf hoeveel je wilt doneren. |
| `donationForm.fields.amount.minError` | Minimum €100 message | Removed (replaced by `invalidError`) |
| `donationForm.fields.benefit` | (missing) | Free-text label + placeholder added |
| `donationForm.donorType.label` | Donator type | Donateur type: |
| `donationForm.donorType.individual` | Individuele donator | Individuele Donateur |
| `donationForm.donorType.business` | Zakelijke donator | Zakelijke Donateur |
| `donationForm.benefits.title` | Voordelen zakelijke donator | Voordelen zakelijke donateur |
| `donationForm.button` | €{{amount}} nu doneren | Doneren (+ `buttonWithAmount`) |
| `donationForm.paymentMethods` | (missing) | iDEAL, Visa, Bankbetaling |
| `donation.benefit` copy | “donatoren” | “donateurs” |

---

### 6. `src/pages/donation/sections/HeroSection.jsx`

**Not changed in this task** (already updated earlier by developer).

---

## Notes for client follow-up

1. When the new hero image arrives → replace `public/donation.jpeg` (or update the `src` in `HeroSection.jsx`).
2. When the new under-image text arrives → update `donation.grow.*` / `donation.impact.*` in `en.json` + `nl.json` (and optionally trim `ImpactSection.jsx` further).
3. Backend must also allow donations below €100 if it currently enforces a server-side minimum; frontend no longer blocks lower amounts.
