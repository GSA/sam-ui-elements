import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

/**
 * Static file server for the built test-app demo, used only by the DAST job
 * in `.github/workflows/security.yml`. It serves `test-app/dist/browser`
 * with representative production security headers so the OWASP ZAP baseline
 * scan exercises the headers a real deployment would emit, rather than the
 * bare, header-less defaults of a dev file server.
 *
 * test-app is internal render-harness tooling (see AGENTS.md's Playwright
 * gallery-route convention); the published package is raw `.ts`/`.scss`
 * source under `src/ui-kit` and `src/formly`, which has no standalone
 * runtime surface of its own -- the consumer's own Angular build compiles
 * and serves it. This scan is therefore defense-in-depth on the harness, not
 * a control over the shipped source, mirroring the same caveat recorded for
 * the sibling sam-styles/ngx-uswds/ngx-uswds-icons DAST scans.
 */
const root = resolve("test-app/dist/browser");
const port = Number(process.env.SECURITY_SCAN_PORT ?? 4200);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "no-referrer",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url ?? "/", "http://localhost").pathname
    );
  } catch {
    // Malformed percent-encoding (e.g. `%zz`) must not crash the server.
    response.writeHead(400, securityHeaders).end("Bad request");
    return;
  }
  const requestedPath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
  let filePath = join(root, requestedPath);

  // Prevent path traversal outside the served root: reject immediately
  // with a 404 rather than falling back to the SPA index, so a traversal
  // attempt never receives any served content.
  if (!filePath.startsWith(root)) {
    response.writeHead(404, securityHeaders).end("Not found");
    return;
  }
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    const candidate = existsSync(filePath)
      ? join(filePath, "index.html")
      : filePath;
    filePath = existsSync(candidate) ? candidate : join(root, "index.html");
  }
  if (!existsSync(filePath)) {
    response.writeHead(404, securityHeaders).end("Not found");
    return;
  }

  response.writeHead(200, {
    ...securityHeaders,
    "Content-Type":
      contentTypes[extname(filePath)] ?? "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () =>
  console.log(`Security scan server listening on http://127.0.0.1:${port}`)
);
