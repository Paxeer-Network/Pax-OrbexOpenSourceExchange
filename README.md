<p align="center">
  <img src="https://www.paxeer.app/_astro/logo.DexyTq8F.png" alt="Paxeer Network" width="200">
</p>

# Orbex Exchange

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.md)
[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8.svg)](https://golang.org/)
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-green.svg)]()
[![Multi-Network](https://img.shields.io/badge/Multi--Network-Supported-purple.svg)]()
[![Paxeer Network](https://img.shields.io/badge/Paxeer-Network-orange.svg)]()

---

## About

Orbex Exchange is a production-grade, multi-network cryptocurrency exchange platform. This project is a joint venture developed by **PaxLabs** and **Sidiora Markets**, the R&D and Liquidity Management divisions of Paxeer Network.

This platform is open-sourced with a singular objective: to empower the community to contribute, enhance, and ultimately deploy it as the primary exchange infrastructure for the Paxeer Network ecosystem.

This is not a proof-of-concept. It is a complete, end-to-end cryptocurrency exchange solution engineered for institutional-grade performance and reliability.

---

## Paxeer Network

Paxeer is a capital orchestration network designed to implement a capital-to-user pipeline: a system where protocol-level balance sheet, risk, and execution are composed into a single substrate that continuously allocates on-chain resources to users, agents, and strategies.

### Capital-to-User Model

Paxeer generalizes the prop firm construct from isolated trading accounts into a network-level funding plane. Instead of capital being siloed inside a single broker or account, a protocol-governed pool of resources is continuously allocated across builders, traders, liquidity providers, and autonomous agents operating on-chain.

The network composes **ChainFlow V2** as a capital routing and risk assessment engine, **Paxeer** as the deterministic settlement layer, and **OpenNet** as an external execution environment into a single pipeline: capital, risk model, user wallet, on-chain action.

### Protocol-Funded Smart Wallets

Instead of provisioning monolithic prop accounts, Paxeer issues ChainFlow smart wallets to users. These are programmatic accounts whose funding is derived from the network's capital pool. Each wallet is treated as a first-class capital conduit, able to deploy applications, trade on any on-chain protocol, provide liquidity, or hold portfolio allocations.

### Network-Level Funding Pools

Capital originates from community funding pools denominated in ETH and OP, economically backed by approximately 1.5B USD worth of collateralized, staked PAX coins. The protocol continuously routes this capital across users, strategies, and risk buckets, ensuring that size is allocated where risk-adjusted utility is highest.

### LLM-Powered Risk Engine

A proprietary, network-wide risk and payout engine continuously ingests more than 500 on-chain and behavioral data points per funded wallet. Large Language Models and domain-specific risk models operate as an ensemble to determine dynamic entitlements, capital limits, and automated payouts.

---

## Project Vision

Paxeer Network has made the strategic decision to release this exchange platform to the open-source community. The intent is to leverage collective expertise to refine, extend, and harden the platform before it assumes its role as the official trading infrastructure for the network.

Community contributions are not merely welcomed; they are essential to the long-term success of this initiative.

---

## Platform Overview

Orbex Exchange delivers a comprehensive feature set covering every aspect of cryptocurrency exchange operations:

- **Spot Trading** - Full order book trading with limit, market, and stop orders
- **P2P Trading** - Peer-to-peer marketplace with escrow and dispute resolution
- **Futures Trading** - Leveraged perpetual and dated futures contracts
- **ICO Launchpad** - Token sale platform with multi-phase allocation
- **NFT Marketplace** - Create, buy, sell, and auction digital assets
- **Staking Pools** - Proof-of-stake reward distribution
- **AI Investment** - Automated portfolio management and trading strategies
- **Forex Investment** - Signal-based forex trading accounts
- **Multi-Network Wallets** - EVM, Solana, Tron, TON, and Bitcoin support
- **KYC/AML Compliance** - Identity verification and regulatory compliance
- **Admin Dashboard** - Complete back-office management interface

---

## Technical Architecture

The platform is built on a TypeScript and Go architecture optimized for performance and maintainability.

### Primary Stack (TypeScript)

```
orbex-exchange/
├── src/                        # Next.js Frontend (1,796 files)
│   ├── components/             # React components library
│   ├── pages/                  # Next.js page routes
│   ├── stores/                 # Zustand state management
│   ├── hooks/                  # Custom React hooks
│   ├── context/                # React context providers
│   ├── layouts/                # Page layout components
│   ├── styles/                 # Global styles and themes
│   └── utils/                  # Frontend utilities
├── backend/                    # Node.js API Server (1,172 files)
│   ├── api/                    # REST API endpoints
│   │   ├── admin/              # Admin panel APIs (755 endpoints)
│   │   ├── exchange/           # Trading APIs
│   │   ├── finance/            # Wallet and transaction APIs
│   │   ├── auth/               # Authentication APIs
│   │   ├── ext/                # Extension module APIs
│   │   └── user/               # User management APIs
│   ├── blockchains/            # Multi-chain integrations
│   ├── handler/                # Request handlers
│   └── utils/                  # Backend utilities
├── models/                     # Sequelize ORM Models (110+ entities)
├── types/                      # TypeScript type definitions
├── themes/                     # UI theme configurations
└── public/                     # Static assets
```

### High-Performance Layer (Go)

```
go backend/
├── cmd/                        # Application entry points
│   ├── api-server/             # HTTP API server
│   ├── matching-engine/        # Order matching engine
│   └── background-workers/     # Background job processors
├── internal/                   # Private application code
│   ├── database/               # MySQL, ScyllaDB, Redis connections
│   ├── handlers/               # HTTP and WebSocket handlers
│   └── services/               # Business logic services
└── migrations/                 # Database migrations
```

---

## Core Modules

### Trading Systems
| Module | Description |
|--------|-------------|
| Spot Exchange | Order book trading with real-time matching engine |
| P2P Trading | Peer-to-peer trades with escrow and dispute management |
| Futures | Leveraged trading with liquidation engine |
| Binary Options | Time-based option contracts |

### Asset Management
| Module | Description |
|--------|-------------|
| Multi-Chain Wallets | EVM, Solana, Tron, TON, Bitcoin custody |
| Staking | Flexible and locked staking pools |
| AI Investment | Algorithmic trading plans with duration options |
| Forex | Signal-based forex investment accounts |

### Marketplace
| Module | Description |
|--------|-------------|
| ICO Launchpad | Multi-phase token sales with allocation tiers |
| NFT Platform | Mint, trade, auction, and collect digital assets |
| E-commerce | Physical and digital goods marketplace |

### Infrastructure
| Module | Description |
|--------|-------------|
| KYC System | Identity verification with template-based workflows |
| Admin Panel | 755+ management endpoints for full platform control |
| Notifications | Email, SMS, and push notification system |
| MLM/Referral | Binary and unilevel referral reward structures |

---

## Data Infrastructure

- **MySQL** - Primary database for users, orders, wallets, and all transactional data (110+ tables)
- **ScyllaDB** - High-throughput storage for order books, trades, and OHLCV candles
- **Redis** - Caching, session management, real-time pub/sub, and job queues (Bull/BullMQ)

---

## Blockchain Integrations

| Network | Capabilities |
|---------|--------------|
| EVM Chains | Ethereum, Polygon, BSC, Arbitrum, Optimism via ethers.js |
| Solana | SPL tokens and native SOL via @solana/web3.js |
| Tron | TRC-20 tokens via TronWeb |
| TON | Native TON and Jettons via TonWeb |
| Bitcoin | UTXO management via bitcoinjs-lib |

---

## Performance Characteristics

- 10,000+ orders per second (Go matching engine)
- Sub-5ms API response times
- Real-time WebSocket streaming via uWebSockets.js
- Connection pooling and prepared statements
- Multi-tier caching with Redis

---

## Getting Started

### System Requirements

| Component | Minimum Version |
|-----------|-----------------|
| Node.js   | 18.0+           |
| pnpm      | 8.0+            |
| MySQL     | 8.0+            |
| Redis     | 7.0+            |
| ScyllaDB  | 5.2+ (optional) |
| Go        | 1.21+ (optional)|

### Installation

Clone the repository:
```bash
git clone https://github.com/paxeer-network/orbex-exchange.git
cd orbex-exchange
```

Install dependencies:
```bash
pnpm install
```

Configure the environment:
```bash
cp .env.example .env
```

Run database seeders:
```bash
pnpm seed
```

### Development

**Start Frontend (Next.js)**
```bash
pnpm dev
```

**Start Backend (Node.js)**
```bash
pnpm dev:backend
```

**Start Background Workers**
```bash
pnpm dev:thread
```

### Production Build

```bash
pnpm build:all
pnpm start
```

### Docker Deployment

```bash
docker-compose up -d
```

### Go Matching Engine (Optional)

For high-frequency trading environments, the Go matching engine provides enhanced throughput:

```bash
cd "go backend"
go mod download
go run cmd/matching-engine/main.go
```

---

## API Reference

### Authenticated Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/exchange/order` | Submit new order |
| GET    | `/api/exchange/order` | Retrieve user orders |
| GET    | `/api/exchange/order/:id` | Retrieve specific order |
| DELETE | `/api/exchange/order/:id` | Cancel order |
| GET    | `/api/exchange/orderbook/:currency/:pair` | Retrieve order book |
| GET    | `/api/finance/wallet` | Retrieve user wallets |

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/exchange/market` | Retrieve all markets |
| GET    | `/api/exchange/ticker` | Retrieve all tickers |
| GET    | `/api/exchange/ticker/:symbol` | Retrieve specific ticker |

### WebSocket Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/exchange/order` | Real-time order updates |
| `/api/exchange/market` | Real-time market data |

---

## Configuration

The platform supports YAML-based configuration with environment variable overrides:

```yaml
port: 4000
log_level: "info"

mysql:
  host: "localhost"
  port: 3306
  database: "exchange_db"
  username: "exchange_user"
  password: ""

scylladb:
  hosts:
    - "127.0.0.1:9042"
  keyspace: "trading"

redis:
  host: "localhost"
  port: 6379
  db: 0

jwt:
  access_secret: "your-secret-key"
  access_expiry: "30m"

rate_limit:
  requests_per_minute: 100
  window_seconds: 60
```

---

## Testing

Execute the test suite:
```bash
go test ./tests/...
```

Execute with coverage reporting:
```bash
go test -cover ./tests/...
```

---

## Security

The platform implements enterprise-grade security measures:

- **Authentication** - JWT-based token authentication with configurable expiration
- **Rate Limiting** - Redis-backed distributed rate limiting
- **Input Validation** - Comprehensive request validation and sanitization
- **CORS Protection** - Configurable cross-origin resource sharing policies
- **Audit Logging** - Structured logging for compliance and forensic analysis

---

## Monitoring

- Structured JSON logging with configurable verbosity levels
- Health check endpoints for service availability monitoring
- Database connection pool monitoring
- Performance metrics collection and export
- Alerting integration support

---

## Production Deployment

### Recommendations

- Configure all sensitive values via environment variables
- Implement proper database connection pooling
- Deploy log aggregation infrastructure
- Establish monitoring and alerting pipelines
- Deploy behind load balancers for high availability

### Docker Deployment
```bash
docker build -t orbex-exchange .
docker run -p 4000:4000 orbex-exchange
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines and development setup |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community standards and expected behavior |
| [SECURITY.md](SECURITY.md) | Security policy and vulnerability reporting |
| [SUPPORT.md](SUPPORT.md) | Support channels and getting help |
| [CHANGELOG.md](CHANGELOG.md) | Version history and release notes |

---

## Contributing

Paxeer Network encourages community participation in the development of this platform. Please read our [Contributing Guide](CONTRIBUTING.md) before submitting pull requests.

1. Fork the repository
2. Create a feature branch from `main`
3. Implement changes with appropriate test coverage
4. Ensure all existing tests pass
5. Submit a pull request with a detailed description

All contributions will be reviewed by the Paxeer Network development team.

---

## License

This project is licensed under the Apache License 2.0. See the [LICENSE.md](LICENSE.md) file for complete terms.

---

## Contact

| Channel | Purpose |
|---------|---------|
| [GitHub Issues](https://github.com/Paxeer-Network/Pax-OrbexOpenSourceExchange/issues) | Bug reports and feature requests |
| [GitHub Discussions](https://github.com/Paxeer-Network/Pax-OrbexOpenSourceExchange/discussions) | Questions and community discussion |
| security@paxeer.network | Security vulnerability reports |
| enterprise@paxeer.network | Enterprise support inquiries |

---

**Orbex Exchange** - A PaxLabs and Sidiora Markets Venture for Paxeer Network
