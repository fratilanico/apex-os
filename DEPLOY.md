# Deployment Guide for vibe.infoacademy.ro

## 1. Hosting the Static Site

Upload the contents of the `dist/` folder to your web server (e.g., cPanel, Apache, Nginx) for `vibe.infoacademy.ro`.

### Required Server Headers
For the embed to work in LearnWorlds, you **MUST** configure your server to allow the iframe.

**For Apache (.htaccess):**
```apache
<IfModule mod_headers.c>
    Header always unset X-Frame-Options
    Header set Content-Security-Policy "frame-ancestors https://*.learnworlds.com https://infoacademy.ro https://www.infoacademy.ro;"
</IfModule>
```

**For Nginx (nginx.conf):**
```nginx
add_header X-Frame-Options "";
add_header Content-Security-Policy "frame-ancestors https://*.learnworlds.com https://infoacademy.ro https://www.infoacademy.ro;";
```

**For Netlify/Vercel (vercel.json / netlify.toml):**
Ensure `X-Frame-Options` is NOT set to DENY or SAMEORIGIN.

---

## 2. LearnWorlds Landing Page Integration

1. Go to your **LearnWorlds Landing Page Builder**.
2. Add a **Custom HTML** section (or a widget that accepts code).
3. Paste the following snippet:

```html
<!-- The Vibe Coder Portfolio Embed -->
<div style="width: 100%; min-height: 100vh; overflow: hidden;">
  <iframe
    src="https://vibe.infoacademy.ro"
    title="The Vibe Coder Portfolio"
    style="width: 100%; height: 100vh; border: 0; display: block;"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    loading="eager"
  ></iframe>
</div>
<script>
  // Optional: Auto-resize iframe if cross-origin communication is set up
  // Otherwise, 100vh ensures full screen.
</script>
```

## 3. Important Note
Since you are using a subdomain (`vibe.infoacademy.ro`), the default build settings (Base URL `/`) are correct. No changes needed to `vite.config.ts`.
