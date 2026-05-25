# KashrutChain — Master Project Planner

**Project:** KashrutChain — AI + Blockchain Kosher Verification  
**Goal:** Handshake AI Showcase submission + live portfolio project  
**Timeline:** 3 weeks to showcase  
**Author:** Kevin Armendraiz  

---

## Week 1: Go Live ASAP (PWA + Landing)

### Day 1 (Today) — PWA Deployment
| Task | Status | Notes |
|---|---|---|
| Create KashrutChain GitHub repo | ⬜ | `officialfshot-web/KashrutChain` |
| Build `index.html` landing page | ⬜ | Dark theme, value prop, scan CTA |
| Build `scan.html` camera scanner | ⬜ | getUserMedia, capture, gallery upload |
| Build `result.html` result display | ⬜ | Badge, ingredients, blockchain proof card |
| Push to GitHub + enable Pages | ⬜ | `github.io/KashrutChain/` live |
| Test on phone (Safari + Chrome) | ⬜ | Verify camera permissions work |
| Add repo to Handshake profile | ⬜ | Link in AI Showcase section |
| Share link for feedback | ⬜ | WhatsApp, LinkedIn, Discord |

**Deliverable:** Live URL anyone can visit on any device.

### Day 2-3 — Content & Docs
| Task | Status | Notes |
|---|---|---|
| Write polished README.md | ⬜ | Problem, solution, tech stack, architecture diagram |
| Add architecture diagram (ASCII or draw.io) | ⬜ | Visual explanation of data flow |
| Record 60-second demo video (screen + phone) | ⬜ | Show scan → result on real product |
| Post video to LinkedIn + Handshake | ⬜ | Tag #HandshakeAI #KashrutChain |
| Set up project board (GitHub Projects) | ⬜ | Track issues, milestones |

**Deliverable:** Professional GitHub presence + social proof.

### Day 4-7 — Mock AI Integration
| Task | Status | Notes |
|---|---|---|
| Wire OpenAI API to PWA (Firebase Cloud Function) | ⬜ | Node.js function receives image → calls GPT-4o |
| Build prompt pipeline | ⬜ | OCR text → structured JSON extraction |
| Add real-ish demo with cached responses | ⬜ | Faster than live API for demo purposes |
| Error handling: bad image, no symbol found | ⬜ | Graceful fallback UI |
| Loading states & animations | ⬜ | Pulse rings, progress steps |

**Deliverable:** PWA shows realistic AI analysis (even if cached for speed).

---

## Week 2: Android MVP

### Day 8-10 — Core Scanner
| Task | Status | Notes |
|---|---|---|
| Create Android Studio project | ⬜ | Package: `com.kashrutchain` |
| Set up Hilt DI, Navigation, Compose theme | ⬜ | Reuse patterns from ShelfLife |
| CameraX preview + capture | ⬜ | Reuse ShelfLife camera module |
| ML Kit OCR integration | ⬜ | TextRecognition v2, Latin + Hebrew |
| Image preprocessing (crop, enhance, denoise) | ⬜ | Focus on small curved labels |
| Basic scan result screen (mock data) | ⬜ | Green/yellow/red badge |

**Deliverable:** Android app captures label and shows mock result.

### Day 11-13 — AI + Rules Engine
| Task | Status | Notes |
|---|---|---|
| Retrofit + OpenAI API client | ⬜ | Reuse ShelfLife Retrofit setup |
| Prompt templates (full label, symbol-only, ingredients) | ⬜ | See `kashrutchain-contract-prompts.md` |
| JSON response parsing with Kotlinx Serialization | ⬜ | Handle nulls gracefully |
| Local KosherRuleEngine | ⬜ | Flag known ingredients without AI call |
| Ingredient list UI with color-coded rows | ⬜ | Safe (green), Caution (yellow), Forbidden (red) |
| Confidence scores + explanations | ⬜ | Tap ingredient for why it's flagged |

**Deliverable:** Real AI-powered analysis in Android app.

### Day 14 — Polish & Offline
| Task | Status | Notes |
|---|---|---|
| Room database for offline symbol cache | ⬜ | Pre-load 100+ known symbols |
| WorkManager sync (weekly symbol update) | ⬜ | Reuse ShelfLife WorkManager pattern |
| Scan history screen | ⬜ | Chronological list with thumbnails |
| Settings (language, offline mode, notifications) | ⬜ | Basic but functional |
| Splash screen + app icon | ⬜ | Green blockchain-themed icon |

**Deliverable:** Android MVP feels like a real app.

---

## Week 3: Blockchain + Showcase Prep

### Day 15-17 — Smart Contract & Blockchain
| Task | Status | Notes |
|---|---|---|
| Write `KashrutRegistry.sol` | ⬜ | See `kashrutchain-contract-prompts.md` for full spec |
| Deploy to Polygon Mumbai testnet | ⬜ | Free, fast, EVM-compatible |
| Generate Web3j Java wrapper | ⬜ | From compiled ABI |
| Hash generation utility (`HashUtil.kt`) | ⬜ | Product + symbol keccak256 |
| `verifyProduct()` read integration | ⬜ | Query contract from Android |
| Display blockchain proof card (tx hash, explorer link) | ⬜ | Tap to open Polygonscan |
| Mock certifier data for demo | ⬜ | Register 5-10 fake products on testnet |

**Deliverable:** Real blockchain verification in demo (testnet is fine for showcase).

### Day 18-19 — Agency Dashboard (B2B Demo)
| Task | Status | Notes |
|---|---|---|
| Build `DashboardScreen.kt` | ⬜ | Stats cards, recent scans, fraud alerts |
| Reuse animated charts from ShelfLife | ⬜ | Line chart (scans over time), pie chart (status breakdown) |
| Mock analytics data | ⬜ | 30 days of simulated scan history |
| Export verification report (CSV) | ⬜ | For compliance audit demos |
| Multi-user role simulation | ⬜ | Inspector vs. Admin views |

**Deliverable:** Can demo both consumer app + agency dashboard.

### Day 20-21 — Showcase Polish
| Task | Status | Notes |
|---|---|---|
| Record 3-minute pitch video | ⬜ | Script from market research doc |
| Prepare live demo products | ⬜ | 1 real kosher product + 1 fake/mock product |
| Practice scan → result flow until smooth | ⬜ | < 30 seconds from capture to result |
| Prepare FAQ answers | ⬜ | "How do you handle kosher phones?" → PWA + SMS |
| Update Handshake AI Showcase profile | ⬜ | Add project, video, GitHub link |
| Backup plan: if live demo fails, show recorded video | ⬜ | Always have a fallback |

**Deliverable:** Submission-ready for Handshake AI Showcase.

---

## Post-Showcase (Month 2+)

| Task | Priority | Notes |
|---|---|---|
| Real OpenAI integration (not cached) | High | Pay-as-you-go API key |
| Deploy smart contract to Polygon mainnet | High | Requires real MATIC + security audit |
| PWA → real backend (Firebase Functions) | High | Replace mock with live AI calls |
| iOS PWA improvements (add to home screen prompt) | Medium | `beforeinstallprompt` for Android |
| Outreach to OU/Star-K for pilot | High | Cold email + LinkedIn to operations directors |
| Kosher app store submissions (TAG, Meshimer) | Medium | Requires rabbinic advisory board |
| SMS verification service (Twilio) | Low | Feature phone fallback |
| Kotlin Multiplatform shared core | Low | iOS native app Phase 3 |

---

## Daily Standup Questions

Ask yourself each morning:
1. What did I finish yesterday?
2. What am I building today?
3. What's blocking me?

If blocked > 2 hours, pivot to next task. Don't get stuck.

---

## Files Inventory

| File | Purpose | Location |
|---|---|---|
| `kashrutchain-market-research.md` | Market size, segments, revenue model, competitive analysis | `windsurf-project-9/` |
| `kashrutchain-app-structure.md` | Android module tree, data flow, screen specs, dependencies | `windsurf-project-9/` |
| `kashrutchain-contract-prompts.md` | Solidity contract, OpenAI prompts, Kotlin implementation, costs | `windsurf-project-9/` |
| `kashrutchain-cross-platform.md` | PWA, KMP, SMS distribution strategy | `windsurf-project-9/` |
| `kashrutchain-planner.md` | This file — master roadmap | `windsurf-project-9/` |
| `index.html` | PWA landing page | `KashrutChain/` repo |
| `scan.html` | Camera scanner | `KashrutChain/` repo |
| `result.html` | Verification result display | `KashrutChain/` repo |
| `README.md` | GitHub project page | `KashrutChain/` repo |

---

## Budget

| Item | Cost | When |
|---|---|---|
| GitHub Pages hosting | Free | Always |
| Firebase Spark plan | Free | Always |
| OpenAI API (development) | ~$10-20 | Week 2-3 |
| Polygon Mumbai testnet | Free | Week 3 |
| Polygon mainnet deployment | ~$50-100 in MATIC | Post-showcase |
| Google Play Developer account | $25 one-time | Post-showcase |
| Apple Developer account | $99/year | iOS Phase 3 |
| Domain (optional) | $12/year | `kashrutchain.com` |

**Total showcase budget: $0-25.** Everything else is pay-as-you-go after you have traction.

---

## Success Criteria

**Minimum viable showcase:**
- [ ] Live PWA URL on GitHub Pages
- [ ] Android app APK that scans + shows result
- [ ] 3-minute demo video or live pitch
- [ ] GitHub repo with clean README

**Stretch goals:**
- [ ] Real OpenAI API integration (not mocked)
- [ ] Smart contract deployed on testnet
- [ ] Blockchain proof card in result screen
- [ ] Agency dashboard with charts
- [ ] 1,000+ people visited the PWA

---

*Last updated: May 25, 2026 — Day 1 of build*
