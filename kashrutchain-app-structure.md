# KashrutChain — App Architecture & Operating Systems Plan

**Project:** KashrutChain — AI + Blockchain Kosher Verification  
**Date:** May 25, 2026  
**Author:** Kevin Armendraiz  

---

## 1. Supported Operating Systems

### Primary Platform
| OS | Version | Target Device | Rationale |
|---|---|---|---|
| **Android** | API 26+ (Android 8.0) to API 34+ | Smartphones, tablets, in-store kiosks | Native Kotlin expertise; dominates kosher-keeping market outside iOS-heavy US segments |

### Secondary Platform (Phase 2)
| OS | Version | Target Device | Rationale |
|---|---|---|---|
| **Android (Kosher Phone OS)** | TAG OS, Meshimer OS, KosherCell OS | Filtered smartphones | Requires app store submission to curated kosher app marketplaces |

### Web Fallback (Phase 2)
| OS | Version | Target Device | Rationale |
|---|---|---|---|
| **Any (browser-based)** | Modern browsers (Chrome, Firefox, Safari) | Laptops, desktops, iPhones, staff workstations | For mashgichim (inspectors) and grocery store managers who need dashboard access |

### Not in Scope
- **iOS native app** — Kotlin Multiplatform or React Native wrapper possible in Phase 3
- **Wearables** — No clear use case for smartwatch scanning

---

## 2. App Module Structure

```
com.kashrutchain/
├── app/                          # Application layer
│   ├── KashrutChainApp.kt        # Application class, dependency injection setup
│   └── MainActivity.kt           # Single-activity architecture with Compose navigation
│
├── core/                         # Shared core utilities
│   ├── common/
│   │   ├── Result.kt             # Sealed class for success/error states
│   │   ├── Resource.kt           # Loading/Success/Error wrapper for UI states
│   │   └── Constants.kt          # API endpoints, contract addresses, config
│   ├── di/
│   │   └── AppModule.kt          # Hilt dependency injection bindings
│   └── util/
│       ├── ImageUtils.kt         # Bitmap preprocessing, rotation, compression
│       ├── NetworkUtils.kt       # Connectivity checks, offline mode detection
│       └── SecurityUtils.kt      # Hashing, encryption for sensitive data
│
├── data/                         # Data layer (Repository pattern)
│   ├── local/                    # Room database — offline cache
│   │   ├── KashrutDatabase.kt    # Database class
│   │   ├── dao/
│   │   │   ├── SymbolDao.kt      # Kosher symbol queries
│   │   │   ├── ProductDao.kt     # Product verification cache
│   │   │   └── VerificationDao.kt # User scan history
│   │   ├── entities/
│   │   │   ├── SymbolEntity.kt   # Kosher symbol record (id, agency, symbolHash, isValid)
│   │   │   ├── ProductEntity.kt  # Cached product (barcode, name, certifier, status)
│   │   │   └── VerificationEntity.kt # Scan log (timestamp, product, result, blockchainTx)
│   │   └── converters/           # Type converters for complex objects
│   │
│   ├── remote/                   # API and blockchain communication
│   │   ├── api/
│   │   │   ├── OpenAiApi.kt      # Retrofit interface for OpenAI GPT-4o
│   │   │   ├── BlockchainApi.kt  # Alchemy/Infura RPC calls for Polygon
│   │   │   └── AgencyApi.kt      # REST API for agency-specific metadata
│   │   ├── dto/
│   │   │   ├── OpenAiRequest.kt  # Prompt structure for OCR text parsing
│   │   │   ├── OpenAiResponse.kt # Structured JSON: symbols, ingredients, flags
│   │   │   ├── BlockchainTransaction.kt # Tx hash, block number, timestamp
│   │   │   └── AgencyProductData.kt # Registered formula, certifier, batch number
│   │   └── blockchain/
│   │       ├── Web3Client.kt     # Web3j wrapper for smart contract interaction
│   │       ├── KashrutContract.kt # Smart contract ABI and address
│   │       └── TransactionManager.kt # Gas estimation, nonce management, retry logic
│   │
│   └── repository/
│       ├── VerificationRepository.kt      # Main orchestrator: OCR → AI → Blockchain → Cache
│       ├── SymbolRepository.kt            # Local + remote symbol lookup
│       └── ProductRepository.kt           # Product data aggregation
│
├── domain/                       # Business logic layer
│   ├── model/
│   │   ├── KosherSymbol.kt       # Domain model: agency, symbolImage, status, registryUrl
│   │   ├── Product.kt            # Domain model: name, barcode, ingredients, certifier, status
│   │   ├── VerificationResult.kt # Domain model: isValid, confidence, issues, blockchainProof
│   │   └── ScanResult.kt         # Domain model: raw image, extracted text, parsed data, final result
│   ├── usecase/
│   │   ├── ScanProductUseCase.kt          # Full pipeline: capture → OCR → AI → verify
│   │   ├── VerifySymbolUseCase.kt         # Quick symbol-only check
│   │   ├── CheckIngredientsUseCase.kt     # Ingredient list AI analysis
│   │   ├── GetOfflineCacheUseCase.kt      # Retrieve cached verifications
│   │   └── SubmitFraudReportUseCase.kt   # Report counterfeit to agency
│   └── util/
│       └── KosherRuleEngine.kt   # Local rule validation: dairy/meat/pareve logic, forbidden ingredients
│
├── ai/                           # AI / ML layer
│   ├── ocr/
│   │   ├── MlKitOcrEngine.kt     # ML Kit Text Recognition wrapper
│   │   └── OcrPreprocessor.kt    # Image enhancement: denoise, sharpen, perspective correction
│   ├── parser/
│   │   ├── OpenAiParser.kt       # GPT-4o prompt builder and response handler
│   │   ├── PromptTemplates.kt    # Reusable prompt strings for different document types
│   │   └── ResponseValidator.kt  # JSON schema validation, error recovery
│   └── model/
│       ├── ExtractedSymbol.kt    # Parsed symbol data from AI
│       ├── ParsedIngredients.kt  # Structured ingredient list with risk flags
│       └── AiConfidence.kt       # Confidence score and explanation
│
├── blockchain/                   # Blockchain interaction layer
│   ├── contract/
│   │   ├── KashrutRegistry.sol   # Solidity source (mirrored for reference)
│   │   └── ContractAbi.json      # Generated ABI for Web3j
│   ├── service/
│   │   ├── RegistryService.kt    # Read/write to smart contract
│   │   ├── EventListener.kt      # Listen for new verification events
│   │   └── ProofGenerator.kt     # Generate verification proof for offline sharing
│   └── model/
│       ├── BlockchainProof.kt    # Tx hash, block number, timestamp, certifier address
│       └── VerificationEvent.kt  # Smart contract event data
│
├── presentation/                 # UI layer (Jetpack Compose)
│   ├── components/               # Reusable UI components
│   │   ├── CameraPreview.kt      # CameraX preview with overlay guides
│   │   ├── ScanOverlay.kt        # Real-time bounding boxes, focus reticle
│   │   ├── VerificationBadge.kt  # Green/yellow/red animated badge
│   │   ├── BlockchainProofCard.kt # Display tx hash with copy/link to explorer
│   │   ├── IngredientList.kt     # Scrollable ingredient list with risk highlights
│   │   ├── StatCard.kt           # Dashboard stat cards (reused from ShelfLife)
│   │   └── AnimatedChart.kt      # Verification history charts (reused from ShelfLife)
│   │
│   ├── screens/
│   │   ├── scan/
│   │   │   ├── ScanScreen.kt         # Main scanning screen
│   │   │   ├── ScanViewModel.kt      # Camera state, scan pipeline orchestration
│   │   │   └── ScanUiState.kt        # Loading, Preview, Success, Error states
│   │   ├── result/
│   │   │   ├── ResultScreen.kt       # Full verification result display
│   │   │   ├── ResultViewModel.kt    # Format data for presentation
│   │   │   └── ResultUiState.kt      # Product, symbol, ingredients, blockchain proof
│   │   ├── history/
│   │   │   ├── HistoryScreen.kt      # Past scans list
│   │   │   ├── HistoryViewModel.kt   # Query scan history
│   │   │   └── HistoryUiState.kt     # Filtered scan list with search
│   │   ├── dashboard/
│   │   │   ├── DashboardScreen.kt    # For agency/grocery staff: analytics, fraud alerts
│   │   │   ├── DashboardViewModel.kt # Aggregate stats
│   │   │   └── DashboardUiState.kt   # Charts, alerts, recent activity
│   │   └── settings/
│   │       ├── SettingsScreen.kt     # Offline mode, language, account
│   │       └── SettingsViewModel.kt
│   │
│   ├── navigation/
│   │   ├── KashrutNavHost.kt     # Compose Navigation graph
│   │   └── ScreenRoutes.kt       # Sealed class for route definitions
│   └── theme/
│       ├── Color.kt              # Primary (green trust), error (red fraud), warning (yellow)
│       ├── Type.kt               # Typography scale
│       └── Theme.kt              # Light/dark theme with kosher-inspired palette
│
├── worker/                       # Background processing (WorkManager)
│   ├── SyncSymbolsWorker.kt      # Weekly sync of updated symbol registry
│   ├── SyncProductsWorker.kt     # Nightly sync of product database
│   ├── UploadPendingWorker.kt    # Retry failed blockchain submissions when online
│   └── CleanupWorker.kt          # Expire old cache entries
│
└── service/                      # Foreground services and notifications
    ├── ScanNotificationService.kt  # Progress notification during multi-step verification
    └── FraudAlertService.kt      # Push notification for reported counterfeit in your area
```

---

## 3. Data Flow Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CameraX   │────▶│  ML Kit     │────▶│  OpenAI     │────▶│  Blockchain │
│  (Capture)  │     │   (OCR)     │     │  (Parse)    │     │  (Verify)   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                              ┌─────────────────────────────────────┘
                              ▼
                        ┌─────────────┐     ┌─────────────┐
                        │    Room     │◄────│   Firebase  │
                        │   (Cache)   │     │   (Cloud)   │
                        └─────────────┘     └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │   Jetpack   │
                        │  Compose UI │
                        └─────────────┘
```

### Step-by-Step Flow
1. **User captures image** → CameraX preview frame or full-resolution photo
2. **OCR extraction** → ML Kit returns raw text string + bounding boxes
3. **Preprocessing** → Crop to label region, enhance contrast, denoise
4. **AI parsing** → OpenAI GPT-4o receives OCR text + prompt template → returns structured JSON (symbols, ingredients, product name, batch number)
5. **Local validation** → KosherRuleEngine checks for known forbidden ingredients, dairy/meat conflicts
6. **Blockchain query** → Web3j calls `KashrutRegistry.verify(symbolHash, productHash)` on Polygon PoS
7. **Result assembly** → VerificationRepository combines AI result + blockchain proof + local rules → VerificationResult domain model
8. **Cache & display** → Room stores result; Compose UI renders badge, ingredient list, blockchain proof card
9. **Background sync** → WorkManager uploads scan metadata to Firebase for aggregate analytics (anonymized)

---

## 4. Screen-by-Screen Breakdown

### Screen 1: Scanner (Main Screen)
| Element | Detail |
|---|---|
| **Layout** | Full-screen CameraX preview with bottom sheet for controls |
| **Controls** | Capture button, flashlight toggle, gallery import, manual barcode entry |
| **Overlay** | Real-time bounding box around detected text; focus reticle when label centered |
| **States** | Idle → Focusing → Capturing → OCR Processing → AI Parsing → Blockchain Querying → Result Ready |
| **Animations** | Pulse ring during processing; progress bar with step labels |

### Screen 2: Verification Result
| Element | Detail |
|---|---|
| **Header** | Large verification badge (green check / yellow warning / red fraud) |
| **Symbol Card** | Enlarged kosher symbol, certifier name, registry status, blockchain proof link |
| **Ingredient List** | Scrollable list; each item color-coded (safe / caution / forbidden); tap for explanation |
| **Blockchain Proof** | Transaction hash (copyable), block timestamp, link to Polygonscan |
| **Actions** | Save to history, share result, report fraud, scan another |
| **Offline Notice** | Banner if verification used cached data instead of live blockchain |

### Screen 3: Scan History
| Element | Detail |
|---|---|
| **List** | Chronological scan cards with thumbnail, product name, date, status badge |
| **Filter** | By date range, status (verified / flagged / failed), certifier |
| **Search** | Product name or barcode lookup |
| **Empty State** | "No scans yet. Start by scanning a product label." |

### Screen 4: Dashboard (Agency/Grocery Mode)
| Element | Detail |
|---|---|
| **Stats Row** | Total scans today, fraud alerts, top flagged products, verification success rate |
| **Chart** | Line chart of scans over time; pie chart of status breakdown |
| **Alert Feed** | Real-time fraud reports with product image, location, timestamp |
| **Export** | CSV/JSON export of verification history for compliance audits |

### Screen 5: Settings
| Element | Detail |
|---|---|
| **Account** | Sign in (Firebase Auth), subscription status (Premium/Free) |
| **Offline** | Download full symbol database (Wi-Fi only toggle), cache size indicator |
| **Notifications** | Fraud alerts in my area, new symbol database available, scan reminders |
| **Language** | English, Spanish, Hebrew (UI labels only; OCR supports Latin + Hebrew) |
| **About** | App version, privacy policy, blockchain explorer link, open-source licenses |

---

## 5. Offline-First Architecture

### Why It Matters
Kosher grocery stores often have poor cell service. Shabbat prep happens in basement stores or at 2 AM. The app must work without internet.

### Strategy
| Layer | Offline Behavior |
|---|---|
| **Symbol Database** | Pre-loaded Room database with 1,000+ known symbols; weekly sync via WorkManager |
| **Product Cache** | Recent verifications cached locally; LRU eviction after 500 entries |
| **Blockchain Fallback** | If offline, check local cache for known-good products; queue new verifications for retry |
| **AI Parser** | Requires internet (OpenAI API). If offline: use local rule engine for basic ingredient flags |
| **Sync Queue** | Pending blockchain verifications stored in Room; WorkManager retries when online |

### Data Freshness Indicators
- Green dot: Verified against live blockchain within 24 hours
- Yellow dot: Cached result, last verified > 24 hours ago
- Gray dot: Offline-only check, no blockchain confirmation yet

---

## 6. Security & Privacy Architecture

| Concern | Solution |
|---|---|
| **Blockchain data is public** | Store only product hashes and symbol hashes, never personal data or full ingredient lists |
| **User scan history** | Encrypted at rest (Room SQLCipher); optional cloud backup with Firebase Auth |
| **API keys (OpenAI, Alchemy)** | Stored in local.properties (never committed); use BuildConfig injection |
| **Fraud report authenticity** | Require Firebase Auth; rate-limit submissions; manual review queue for agencies |
| **Camera permission** | Runtime permission with rationale; no image stored without explicit user action |

---

## 7. Third-Party Dependencies

```groovy
// Core Android
def compose_version = "2024.02.00"
implementation "androidx.core:core-ktx:1.12.0"
implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.7.0"
implementation "androidx.activity:activity-compose:1.8.2"
implementation "androidx.navigation:navigation-compose:2.7.6"

// Jetpack Compose
implementation "androidx.compose.ui:ui:$compose_version"
implementation "androidx.compose.material3:material3:1.2.0"
implementation "androidx.compose.material:material-icons-extended:$compose_version"

// CameraX + ML Kit
implementation "androidx.camera:camera-core:1.3.1"
implementation "androidx.camera:camera-camera2:1.3.1"
implementation "androidx.camera:camera-lifecycle:1.3.1"
implementation "androidx.camera:camera-view:1.3.1"
implementation "com.google.mlkit:text-recognition:16.0.0"

// Room (offline cache)
implementation "androidx.room:room-runtime:2.6.1"
implementation "androidx.room:room-ktx:2.6.1"
kapt "androidx.room:room-compiler:2.6.1"

// WorkManager (background sync)
implementation "androidx.work:work-runtime-ktx:2.9.0"

// Retrofit + networking
implementation "com.squareup.retrofit2:retrofit:2.9.0"
implementation "com.squareup.retrofit2:converter-gson:2.9.0"
implementation "com.squareup.okhttp3:logging-interceptor:4.12.0"

// Web3j (blockchain)
implementation "org.web3j:core:4.10.3"

// Firebase
implementation "com.google.firebase:firebase-auth-ktx:22.3.1"
implementation "com.google.firebase:firebase-firestore-ktx:24.10.1"
implementation "com.google.firebase:firebase-messaging-ktx:23.4.0"

// Dependency Injection
implementation "com.google.dagger:hilt-android:2.50"
kapt "com.google.dagger:hilt-compiler:2.50"
implementation "androidx.hilt:hilt-work:1.1.0"

// Coroutines + Flow
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3"
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-play-services:1.7.3"

// Image processing
implementation "androidx.exifinterface:exifinterface:1.3.7"

// Logging
implementation "com.jakewharton.timber:timber:5.0.1"
```

---

## 8. Build Variants & Flavors

```groovy
android {
    buildTypes {
        debug {
            buildConfigField "String", "BLOCKCHAIN_RPC", "\"https://polygon-mumbai.g.alchemy.com/v2/TEST_KEY\""
            buildConfigField "String", "CONTRACT_ADDRESS", "\"0xTEST...\""
            buildConfigField "String", "OPENAI_BASE_URL", "\"https://api.openai.com/v1/\""
        }
        release {
            buildConfigField "String", "BLOCKCHAIN_RPC", "\"https://polygon-mainnet.g.alchemy.com/v2/PROD_KEY\""
            buildConfigField "String", "CONTRACT_ADDRESS", "\"0xPROD...\""
            buildConfigField "String", "OPENAI_BASE_URL", "\"https://api.openai.com/v1/\""
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    productFlavors {
        consumer {
            applicationIdSuffix ".consumer"
            resValue "string", "app_name", "KashrutChain"
        }
        agency {
            applicationIdSuffix ".agency"
            resValue "string", "app_name", "KashrutChain Pro"
            // Enables dashboard screen, export features, multi-user support
        }
    }
}
```

---

## 9. Testing Strategy

| Test Type | Scope | Tools |
|---|---|---|
| **Unit Tests** | Use cases, repositories, rule engine | JUnit 5, Mockito, Turbine (Flow testing) |
| **Integration Tests** | AI parser with mocked OpenAI response | Retrofit MockWebServer |
| **UI Tests** | End-to-end scan flow | Compose UI Test, Espresso |
| **Blockchain Tests** | Smart contract interaction on testnet | Ganache local blockchain, Web3j test utilities |
| **Device Tests** | Camera focus on small text, offline behavior | Firebase Test Lab (Pixel, Samsung Galaxy) |

---

## 10. Deployment & Release Checklist

### Phase 1: MVP (Week 3)
- [ ] Google Play Console developer account setup
- [ ] Privacy policy page (required for camera permission)
- [ ] Internal testing track (invite-only, 20 testers)
- [ ] Screenshots: scanner, result screen, blockchain proof, history
- [ ] App signing keystore generated and backed up

### Phase 2: Public Beta (Month 2)
- [ ] Open testing track on Google Play
- [ ] Beta landing page with email signup
- [ ] OU/Star-K agency outreach for pilot partnership
- [ ] In-app feedback mechanism (Firebase Crashlytics + Analytics)

### Phase 3: Kosher Phone Distribution (Month 4)
- [ ] TAG Technologies app store submission
- [ ] Meshimer app store submission
- [ ] Rabbinic advisory board formation for app-level hechsher
- [ ] Compliance documentation for filtered internet compatibility

---

*Document version 1.0 — Architecture prepared for Handshake AI Showcase and MVP development*
