---
name: hostgator-rsync-deploy
description: Use when deploying a static site to HostGator (or similar cPanel shared hosting) from CI — there is no official CLI; publish to public_html via rsync over SSH on port 2222, with an FTP fallback, keeping all credentials in CI secrets.
---

# HostGator static deploy

Technique for publishing a built static site to HostGator shared hosting.

## There is no HostGator CLI

HostGator ships no first-party CLI. Publishing to `public_html` is done with
standard tools: **rsync over SSH** (preferred) or **FTP** (fallback). Automate it
from CI (GitHub Actions), not from a vendor tool.

## SSH is off by default and on port 2222

Shared plans disable SSH; enable it through support. The port is **2222**, not 22.
Add your CI key's public half to `~/.ssh/authorized_keys` on the host.

## rsync deploy (preferred)

```bash
rsync -avzr --delete -e 'ssh -p 2222' dist/ user@host:/home/USER/public_html/
```

- `--delete` mirrors: files removed locally are removed on the server. Point it at
  `public_html`, never at `~`.
- rsync transfers only changed files — cheap on shared hosting.
- In GitHub Actions, use an rsync-over-SSH action and pass host/user/key/target
  from **secrets**; commit nothing sensitive.

## FTP fallback

If SSH cannot be enabled, keep the same build and swap only the transport
(`SamKirkland/FTP-Deploy-Action` with `server-dir: public_html/`). Slower, less
secure, but works on any plan.

## Apache layer (.htaccess)

HostGator runs Apache. Ship a minimal `.htaccess` in the build output for HTTPS
canonicalization, gzip, and cache headers (immutable for fingerprinted `/_astro/`
assets, no-cache for HTML). Keep it minimal and test against the live host —
shared-Apache rules are easy to get subtly wrong.

## Secrets discipline

Host, user, key/password live only in CI secrets. The repository contains no host,
no credential, no key. Old-WordPress→new-URL redirects, if needed, also belong in
`.htaccess`.
