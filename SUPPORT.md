# Support

This document provides information on how to get support for the Orbex Exchange platform.

---

## Documentation

Before seeking support, please review the available documentation:

- [README.md](README.md) - Project overview and quick start guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [SECURITY.md](SECURITY.md) - Security policy and vulnerability reporting
- [CHANGELOG.md](CHANGELOG.md) - Version history and release notes

---

## Getting Help

### GitHub Issues

For bug reports and feature requests, please use GitHub Issues:

**Repository:** [Paxeer-Network/Pax-OrbexOpenSourceExchange](https://github.com/Paxeer-Network/Pax-OrbexOpenSourceExchange/issues)

Before opening a new issue:
1. Search existing issues to avoid duplicates
2. Use the appropriate issue template
3. Provide detailed information about your environment

### GitHub Discussions

For questions, ideas, and general discussions:

**Discussions:** [GitHub Discussions](https://github.com/Paxeer-Network/Pax-OrbexOpenSourceExchange/discussions)

Categories:
- **Q&A** - Ask questions and get answers
- **Ideas** - Share ideas for new features
- **Show and Tell** - Share your implementations
- **General** - General discussion about the project

---

## Community Channels

### Discord

Join the Paxeer Network Discord server for real-time community support:

**Discord:** [discord.gg/paxeer](https://discord.gg/paxeer)

Channels:
- `#orbex-support` - General support questions
- `#orbex-dev` - Development discussions
- `#orbex-announcements` - Project announcements

### Telegram

**Telegram:** [@PaxeerNetwork](https://t.me/PaxeerNetwork)

---

## Enterprise Support

For organizations requiring dedicated support, service level agreements, or custom development:

**Email:** enterprise@paxeer.network

Enterprise support includes:
- Priority issue resolution
- Dedicated technical contact
- Custom feature development
- Deployment assistance
- Security audit support

---

## Reporting Security Issues

**Do not report security vulnerabilities through public channels.**

For security-related issues, please follow our [Security Policy](SECURITY.md) and report to:

**Email:** security@paxeer.network

---

## Frequently Asked Questions

### Installation Issues

**Q: pnpm install fails with dependency errors**

A: Ensure you are using Node.js 18+ and pnpm 8+. Clear the cache and retry:
```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

**Q: Database connection errors**

A: Verify your `.env` configuration matches your database setup. Ensure MySQL is running and the database exists.

### Development Issues

**Q: Hot reload not working**

A: Check that you're running the correct development command (`pnpm dev` for frontend, `pnpm dev:backend` for backend).

**Q: TypeScript compilation errors**

A: Run `pnpm lint` to identify issues. Ensure all type definitions are properly imported.

### Deployment Issues

**Q: Production build fails**

A: Run `pnpm build:all` locally to identify build errors before deployment.

**Q: WebSocket connections failing in production**

A: Ensure your reverse proxy is configured to forward WebSocket connections properly.

---

## Response Times

| Channel | Expected Response |
|---------|-------------------|
| GitHub Issues | 2-5 business days |
| GitHub Discussions | Community-driven |
| Discord | Community-driven |
| Enterprise Support | Within 24 hours |
| Security Reports | Within 48 hours |

---

## Contributing to Support

Help improve support resources by:
- Answering questions in GitHub Discussions
- Helping other users on Discord
- Improving documentation through pull requests
- Creating tutorials or guides

---

## Contact

**General Inquiries:** info@paxeer.network

**Enterprise Support:** enterprise@paxeer.network

**Security Issues:** security@paxeer.network

---

**Orbex Exchange** - A PaxLabs and Sidiora Markets Venture for Paxeer Network
