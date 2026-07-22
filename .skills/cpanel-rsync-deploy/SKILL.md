---
name: cpanel-rsync-deploy
description: Use when deploying a static site to cPanel shared hosting from CI — there is usually no official CLI; publish to public_html via rsync over SSH (often a non-standard port), with an FTP fallback, keeping all credentials in CI secrets.
---

# cPanel static deploy

Technique for publishing a built static site to cPanel-style shared hosting.

## No vendor CLI

Shared cPanel hosts rarely ship a first-party CLI. Publishing to `public_html` is
done with standard tools: **rsync over SSH** (preferred) or **FTP** (fallback).
Automate it from CI (GitHub Actions), not from a vendor tool.

## SSH is often off by default, on a non-standard port

Shared plans commonly disable SSH — enable it through the host's panel or support.
The port is frequently **not 22** (many cPanel hosts use `2222`); confirm it for
your host. Add your CI key's public half to `~/.ssh/authorized_keys` on the server.

## rsync deploy (preferred)

```bash
rsync -avzr --delete -e 'ssh -p 2222' dist/ user@host:/home/USER/public_html/
```

- `--delete` mirrors: files removed locally are removed on the server. Point it at
  `public_html`, never at `~`.
- rsync transfers only changed files — cheap on shared hosting.
- In GitHub Actions, use an rsync-over-SSH action and pass host/user/key/target/port
  from **secrets**; commit nothing sensitive.

## FTP fallback

If SSH cannot be enabled, keep the same build and swap only the transport
(`SamKirkland/FTP-Deploy-Action` with `server-dir: public_html/`). Slower, less
secure, but works on any plan.

## Apache layer (.htaccess)

cPanel hosts run Apache. Ship a minimal `.htaccess` in the build output for HTTPS
canonicalization, gzip, and cache headers (immutable for fingerprinted `/_astro/`
assets, no-cache for HTML). Keep it minimal and test against the live host —
shared-Apache rules are easy to get subtly wrong.

## Secrets discipline

Host, user, key/password, and port live only in CI secrets. The repository
contains no host, no credential, no key. Any legacy-URL redirects, if needed, also
belong in `.htaccess`.
