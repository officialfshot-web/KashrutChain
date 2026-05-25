# KashrutChain

**AI + Blockchain kosher verification. Works on any device.**

[🚀 Try it now](https://officialfshot-web.github.io/KashrutChain/) | [📱 Android App (coming soon)](https://github.com/officialfshot-web/KashrutChain/releases)

## What It Does

Point your camera at any food label. KashrutChain uses AI to read the kosher symbol, analyze ingredients, and verify the certification on an immutable blockchain ledger.

- **Fraud Detection** — Flags counterfeit symbols instantly
- **Ingredient Analysis** — AI spots hidden non-kosher ingredients
- **Blockchain Proof** — Every verification is publicly auditable
- **Offline Ready** — Cached symbol database works without internet

## Why It Matters

Counterfeit kosher certification is a $500M+ fraud problem. Consumers currently verify symbols by calling certifiers or checking static PDFs. KashrutChain brings this into the 21st century with AI and blockchain.

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (PWA)
- **AI:** OpenAI GPT-4o for label parsing
- **Blockchain:** Polygon PoS smart contract for immutable certification registry
- **Mobile App:** Kotlin, Jetpack Compose, CameraX, ML Kit OCR (Android MVP in development)

## Architecture

```
Camera → OCR (ML Kit / Google Vision) → AI Parser (OpenAI GPT-4o) 
→ Blockchain Verification (Polygon PoS) → Result Display
```

## Roadmap

- [x] PWA scanner (live now)
- [ ] OpenAI integration with real label parsing
- [ ] Polygon smart contract deployment
- [ ] Android native app with offline-first architecture
- [ ] iOS support via Kotlin Multiplatform
- [ ] SMS verification for feature phones

## About the Author

Built by Kevin Armendraiz, a mechanical engineer turned Android developer, for the Handshake AI Showcase.
