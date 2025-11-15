# Professional Experience - Tushar Saxena

## Personal Information

- **Name**: Tushar Saxena
- **Email**: [redacted]
- **Phone**: +91 [redacted]
- **GitHub**: keogami
- **LinkedIn**: keogami--
- **Location**: Meerut, India

## Experience

### Senior Full-Stack Rust Engineer | YRAL (Bitcoin Social Platform) | Remote | 2024 - 2025 

- Developed Yral, a social media platform on the blockchain, written entirely in rust.
- Enhance performance of multiple key features of the app. 99.5% increase on wallet, 91.6% increase on main feed, for instance.
- Successfully moved our video library of 200,000 videos to decentralized storage, without affecting production.
- Developed PumpDump Game getting 100k players at its peak.
- Help research and drive key infrastructural decisions.

Contributed to the following components:

#### Offchain agent
https://github.com/dolr-ai/off-chain-agent
 **74 commits** (11,104 lines added, 7,109 removed) across **19 merged PRs** over 10 months (Dec 2024 - Sep 2025) to critical off-chain infrastructure for YRAL/Hot-or-Not decentralized social platform.
- Architected and implemented distributed video deduplication system using perceptual hashing algorithms (wavelet-based and color-based hashing with FFmpeg frame extraction) with initial SpacetimeDB integration, migrated to Internet Computer canister-based index for reduced latency, and engineered early-stopping pipeline optimization that prevented 30%+ redundant NSFW processing by checking duplicates before expensive ML operations.
- Built end-to-end Storj decentralized storage integration pipeline for video replication including automatic content duplication from Cloudflare to Storj buckets, NSFW-aware routing (separate buckets for sensitive content), metadata preservation (post_id, timestamp, canister_id), asynchronous job queuing via Upstash QStash, and custom storj-interface service integration enabling decentralized Web3 video delivery.
- Developed multi-cloud video processing orchestration coordinating Cloudflare Stream/R2, Google Cloud Storage, BigQuery, and Storj using Rust async/await with Axum web framework, managing complex multi-stage job choreography (upload → frame extraction → NSFW v1 → NSFW v2 → Storj replication) through Upstash QStash with flow control headers (rate limiting: 20 req/s, parallelism: 10), 10-minute stage delays, and automatic error handling with context propagation.
- Established comprehensive code quality infrastructure including strict Clippy linting rules, rustfmt project-wide formatting standards, rust-analyzer remote-first development configuration, bacon.toml for continuous compilation checks, GitHub Actions automated CI/CD workflows, structured logging with Sentry context, and major IC dependencies upgrade (#229: 747 additions, 464 deletions) resolving all Clippy deprecation warnings improving codebase maintainability and reducing production bugs.
- Optimized video processing performance by implementing RAM-based temporary storage (/dev/shm), parallel frame processing with Rayon for concurrent operations, efficient resource cleanup patterns with proper temp directory management, and intelligent pipeline ordering to minimize cloud service costs reducing processing time by 40% for high-volume video ingestion.
- Integrated Internet Computer blockchain canisters with off-chain cloud services building bridges between on-chain storage and cloud infrastructure using IC Agent SDK and Candid interface definitions for backup systems, video deduplication index queries, monitoring workflows, and event processing enabling seamless Web3/Web2 hybrid architecture for decentralized social media platform.
- tech: Rust, Qstash, Axum, Fly.io, BigQuery

#### Leptos frontend
https://github.com/dolr-ai/hot-or-not-web-leptos-ssr
- Architected and developed complete Pump and Dump real-time gaming platform from scratch using Leptos (Rust WASM framework) and WebSocket infrastructure, enabling crypto token betting with Bull/Bear mechanics; contributed 11,849 lines across 149 commits serving production users
- Engineered bidirectional WebSocket system for live game state synchronization with automatic reconnection, optimistic UI updates, and comprehensive error handling, reducing perceived latency and ensuring real-time gameplay experience
- Built end-to-end wallet and withdrawal system with backend API integration supporting decimal precision token transactions, balance tracking across multiple token types, and success/failure flows with visual feedback
- Designed multi-tenancy architecture supporting three distinct platforms (YRAL, ICPump, Pumpdump) with shared codebase; refactored navigation system using type-safe AppType abstraction replacing legacy SiteHost enum
- Developed reusable component library including skeleton loaders with Tailwind animations, interactive buttons with haptic/audio feedback, responsive cards with infinite scrolling, and mobile-optimized onboarding flows
- Implemented OAuth 2.0 authentication for Pumpdump across preview, staging, and production environments; configured Google OAuth clients, redirect URLs, and secrets in CI/CD pipelines (GitHub Actions, Fly.io deployment)
- Integrated heterogeneous backend services including Firestore for token data, Cloudflare Workers for game state management, and gRPC APIs for balance information with action-based async loading and request throttling
- Built comprehensive profile system displaying total earnings, game statistics, and history with lazy-loaded assets; integrated backend APIs returning user-specific game data filtered by principal authentication
- Established end-to-end testing infrastructure with Playwright for wallet functionality, game mechanics, and authentication flows; created testbeds for local development and managed test stability across deployments
- Led large-scale refactoring initiatives moving 500+ lines across module boundaries, extracting monolithic components into separate files, adding comprehensive documentation, and performing codebase-wide renaming (71 changes across 15 files)
- Enhanced progressive web app capabilities with manifest configuration, Android icons (192x192, 512x512), mobile-optimized interactions, and responsive scaling for devices with varying screen sizes
- Optimized dependency management switching to revision-based imports preventing false cache hits, bumping yral-common versions, and managing Cargo.lock updates ensuring reproducible builds
- Implemented financial precision fixes preventing calculation errors in token amount computations, tooltip alignment improvements preventing UI bleeding, and zoom handling for game card interactions
- Contributed to infrastructure configuration including OAuth client setup across environments, Google Analytics 4 integration, and Fly.io deployment configurations for preview/staging/production environments
- tech: Rust, Leptos, axum, Fly.io

### Rust Developer | Secneural LLC, QATAR | On-Site | 2023 - 2024

- Led a team at Secneural to design and document system architecture using IcePanel.
- Implemented an optimized isolated runtime leveraging Linux namespaces, emphasizing security.
- Designed a constraint-based process orchestration algorithm.
- Developed a custom package manager built on ALPM.
- Conducted extensive research on various filesystems including OverlayFS and OrangeFS.
- Researched and implemented network technologies such as bridges and VLANs.
- Adopted security-focused coding practices and architectural decisions influenced by a security-oriented environment.
- tech: Rust, ZeroMQ, ratatui, Linux (advanced), Direct Linux kernel syscalls


## Projects

### Boolviz
https://github.com/quasilevel/boolviz
- **Architected and developed Boolviz**, an interactive boolean circuit visualizer web application using TypeScript and Canvas API, enabling real-time design, simulation, and sharing of digital logic circuits with 7+ gate types (AND, OR, XOR, NOT, NAND, NOR, XNOR)
- **Engineered a custom type-safe finite state machine library** using TypeScript discriminated unions and generics to manage complex application state across 4 concurrent state machines (program modes, gate selection, sharing workflow, UI widgets)
- **Implemented a reactive circuit solver** with lazy evaluation, memoization, and topological sorting to efficiently evaluate boolean expressions and propagate signal changes through connected gate networks in real-time
- **Designed custom spatial hash map data structure** for O(1) gate lookups on infinite canvas, enabling efficient collision detection and hover interactions across pan/zoom transformations
- **Built sharing system with PocketBase backend integration** supporting circuit serialization to JSON, URL-based embedding with query parameters, and iframe generation for educational content distribution
- **Achieved zero framework dependencies** by implementing all functionality in vanilla TypeScript with functional programming patterns including higher-order functions, function composition, and immutable data transformations
- **Developed advanced Canvas API features** including transform matrix management for pan/zoom, animated bezier curve connections with signal flow visualization, and SVG-to-Canvas path rendering pipeline
- **Implemented real-time validation system** that analyzes circuit topology, detects missing/extra connections with visual error indicators, and prevents execution of invalid circuits
- **Created educational interface** with interactive infinite grid canvas, responsive delete widgets that follow viewport transforms, welcome banner for first-time users, and comprehensive tutorial content
- **Deployed production application to Netlify** with 100% type-safe codebase using strict TypeScript compilation (strictNullChecks, noImplicitAny) and ES2022 module system
- tech: Typescript, Canvas API, Browser Geometry API, PocketBase, Node Theory
- first commit: March 2022

### Dbussy
https://github.com/keogami/dbussy
- Developed **dbussy**, a Rust-based D-Bus signal monitoring tool with embedded JQ query integration, enabling real-time filtering and transformation of inter-process communication messages on Linux systems
- Engineered custom serialization layer to bridge D-Bus variant types (zvariant) and JSON, implementing type-safe recursive conversion for 11 distinct D-Bus data types including primitives (U8, U16, U32, U64, I16, I32, I64, F64, Bool), strings, file descriptors, nested structures, arrays, and dictionaries
- Implemented cross-platform CI/CD pipeline using GitHub Actions with automated builds for 4 target architectures (x86_64 Linux, ARM64 Linux, x86_64 Windows, x86_64 macOS) with commit hash-based version tagging and automated release artifacts
- Built efficient message processing pipeline integrating zbus 2.3.2 blocking API with jq-rs bindings, processing D-Bus signals with metadata extraction (signature, signal name) and JSON transformation in under 200 lines of production Rust code
- Designed dual-mode signal listener supporting both System and Session D-Bus instances with flexible filtering capabilities: specific signal name matching and JQ query-based data transformation for targeted event monitoring
- Implemented robust error handling using anyhow for context propagation throughout the application, with type-safe proxy generation and generic interface supporting multiple D-Bus bus types
- Created intuitive CLI using clap derive macros with arguments for bus type selection, service name, interface path, object path specification, JQ query strings, and optional signal name filtering for comprehensive D-Bus inspection capabilities
- tech: Rust, Linux DBus
- first commit: August 2022

### Keydict
https://github.com/keogami/keydict
- Engineered a high-performance T9-style dictionary search system in Rust using custom prefix tree (trie) data structure with BTreeMap-based nodes, achieving 27-microsecond prefix search latency on 370,000+ word English dictionary
- Implemented four distinct search algorithms: exact string lookup (O(m)), keypad-to-word mapping with multi-character ambiguity resolution, prefix-based autocomplete, and keypad prefix autocomplete combining both techniques with recursive tree traversal and early termination optimization
- Optimized memory footprint and I/O performance using memory-mapped file access (fmmap) and CBOR binary serialization, reducing dictionary load time to ~298ms and storage size compared to JSON format
- Designed type-safe CLI interface with Clap derive macros featuring five subcommands (generate-tree, search-string, search, complete-string, complete) with compile-time validation and enum-based command routing
- Leveraged Rust's type system for zero-cost abstractions including macro-generated TryFrom trait implementations across 8 numeric types for keypad input validation and strong typing to prevent invalid key sequences at compile-time
- Developed keypad mapping system replicating traditional phone layout (2=abc through 9=wxyz) with bidirectional conversion supporting both string parsing and numeric key sequence interpretation for T9-style input simulation
- tech: Rust, Clap
- first commit: June 2025

### Gitwatch
https://github.com/keogami/gitwatch
- Architected and deployed a serverless Telegram bot on Netlify Edge Functions using Deno and TypeScript (~833 lines across 14 modules) that delivers real-time GitHub webhook notifications to Telegram chats, supporting both repository-level and organization-wide event monitoring with scalable edge computing for global low-latency webhook processing
- Implemented complete GitHub OAuth 2.0 authentication flow with CSRF protection via state parameter validation, secure token storage in Redis, and scope management for `write:repo_hook`, `admin:org_hook`, `user`, and `read:org` permissions, using SHA-1 hash-based session management
- Developed interactive multi-level conversation interface using Grammy framework with dynamic menu navigation, repository pagination (5 items per page), organization/repository selection workflows, and confirmation dialogs with custom payload encoding format for state preservation across menu transitions
- Engineered webhook management system supporting both repository and organization-level webhook creation via GitHub REST API with wildcard event subscription, admin-only setup through Telegram role verification (creator/administrator), and context-based routing using cryptographic hash mapping of webhook IDs to chat/user IDs
- Built type-safe GitHub event processing pipeline using Octokit webhook types with formatted push event notifications including action detection (created/deleted/forced/standard), commit lists with shortened hashes and clickable links, HTML-formatted Telegram messages, and sender attribution, utilizing extensible Strategy pattern for easy addition of new event types
- Designed custom Redis abstraction layer implementing Repository pattern with `DBMap` interface and `RedisMap` implementation featuring scoped key namespacing for environment isolation, JSON serialization for complex objects, and three specialized data stores (tokenStore, webhookContextStore, oauthSessions) for distributed state management across serverless functions
- Optimized GitHub API interactions using GraphQL queries for efficient data fetching with pagination support (`pageInfo`), organization count queries, repository listing with `UPDATED_AT` ordering, and combined user login + organizations retrieval in single requests to minimize API calls
- Applied functional programming patterns throughout codebase including Result monads for explicit error handling in webhook setup, Option monads for safe null handling in client creation, pure functions with no side effects in event formatters, and type-safe discriminated unions for payload routing
- Implemented comprehensive security measures including OAuth state parameter CSRF validation, context-based webhook authentication using SHA-1 cryptographic hashes, admin-only webhook setup verification through Telegram API role checks, and environment variable validation on startup with development mode detection
- Structured 368-line menu system implementing State Machine pattern with dynamic navigation, nested submenus, boundary-aware pagination (load flags for prev/next button control), and custom serialization format (`r:owner:name:page:uid:load`) for encoding menu state in callback payloads with type discrimination via prefixes
- tech: Typescript, Github API, Graphql, Telegram Bot API
- first commit: Oct 2022

### Financial Programming Language
https://github.com/keogami/fpl (private, request access)
Technical Write-up: https://keogami.dev/blog/dategen
- Architected a domain-specific financial modeling system in Rust with iterator-based lazy evaluation, supporting programmatic generation of time-series transactions across multiple concurrent schedules
- Implemented a custom date arithmetic library handling leap years, month boundaries, and temporal deltas with type-safe validation preventing invalid dates at compile-time where possible
- Designed a priority-queue-based event scheduler using BinaryHeap to efficiently merge multiple asynchronous event streams sorted chronologically, enabling complex recurring transaction patterns
- Built date iteration framework supporting configurable cycles (daily, weekly, monthly, quarterly, yearly) with customizable period lengths to handle edge cases like month-end date normalization
- Created double-entry accounting engine that automatically generates debit/credit journal entries from high-level transaction specifications, validating entity types (Asset, Liability, Income, Expense) with polymorphic buffer accounts
- Developed financial entity tracking system maintaining real-time balance calculations and entity valuations as transactions are processed through the iterator pipeline
- Implemented JSON serialization pipeline for exporting generated financial journals with complete audit trail including accounts, metadata, and chronologically-ordered entries
- Engineered modular workspace architecture with four specialized crates (dategen, program, fpl, printjournal) totaling ~1000 lines of documented Rust code with comprehensive error handling using thiserror and anyhow
- Applied zero-cost abstractions and Rust's ownership system to ensure memory safety and prevent data races in stateful financial computations without runtime overhead
- Designed declarative macro-based DSL (dategen!, date!) enabling concise expression of complex temporal patterns and date ranges with compile-time validation
- tech: Rust, Dotgraphs, Programming Language Design
- first commit: Feb 2024

## Zenpull
- Developed concurrent file downloader in Go using goroutine worker pools and channels for parallel downloads with configurable concurrency
- Implemented HTTP Range requests with automatic retry logic for resumable downloads resilient to network failures
- Designed SHA-1-based content addressing for idempotent downloads and automatic file deduplication
- Created automatic file organization system by extension with lazy directory creation and memoized existence checks
- Optimized streaming I/O with 2MB buffered writes and minimal memory footprint for efficient large file downloads
- Built GitHub Actions CI/CD pipeline for cross-compilation to 4 architectures (Linux/Windows × amd64/arm64) with automated releases
- Integrated pprof memory profiling for runtime performance analysis and optimization
- Delivered zero-configuration CLI with custom flag handling requiring no external dependencies or database
- tech: Go, HTTP2.0 (Advanced)
- first commit: Nov 2021


## Education

### Bachelors in Computer Applications | IIMT Mall Road | India | 2019 - 2022
- Started the first Programming Club
- Represented college in Govt Manthan Hackathon
- Mentored 30+ Students through the Club
- Became the College's brand ambassador


## Skills

### Programming Languages
Rust, TypeScript, Nushell, JavaScript, Go, SQL, Python (not prefered)

### Rust Ecosystem
Tokio, Axum, Serde, sea-orm, smol , Rayon, reqwest, clap

### Backend & Databases
PostgreSQL, Redis, MongoDB, MySQL

### Web & APIs
REST APIs, WebSockets, gRPC, Protocol Buffers, GraphQL, JSON-RPC

### DevOps & Tools
Docker, Kubernetes, GCP, Vercel, Git, GitHub Actions, CI/CD, Nginx, Linux (arch, btw)

### Blockchain & Web3
Internet Computer Protocol

### Software Engineering
Async/Concurrent Programming, System Design, Microservices, Hexagonal Architecture, Agile/Scrum

### Languages Spoken
- English (Fluent - Professional working proficiency)
- Hindi (Native)
