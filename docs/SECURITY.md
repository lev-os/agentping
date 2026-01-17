# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅ Current release |

## Reporting a Vulnerability

We take security seriously at Kingly Agency. If you discover a security vulnerability in AgentPing, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email us at: **security@kingly.agency** (or create a private security advisory)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Resolution Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

### Security Best Practices

When deploying AgentPing:

1. **API Security**: Use HTTPS in production
2. **Webhook Secrets**: Always configure HMAC signatures
3. **Access Control**: Restrict who can respond to pings
4. **Audit Logs**: Monitor the audit log for suspicious activity
5. **Updates**: Keep dependencies updated

## Scope

This policy covers:
- All packages in the `@agentping/*` namespace
- The official documentation
- The official Docker images (when available)

---

Thank you for helping keep AgentPing secure! 🔒

<p align="center">
  <a href="https://github.com/Kingly-Agency">Kingly Agency</a>
</p>
