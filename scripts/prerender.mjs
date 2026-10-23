#!/usr/bin/env node
/**
 * Build-time prerender for search engines.
 *
 * Runs after `vite build`. Uses dist/index.html as a template and writes one
 * static HTML file per route (dist/<route>/index.html) with its own title,
 * description, canonical URL, and crawlable content (headings, tables, links).
 * React replaces the #root content when it mounts, so users still get the app.
 *
 * Also writes dist/sitemap.xml (every prerendered URL) and dist/404.html.
 *
 * Data source: the live data files published daily by the fetcher Lambda.
 * Override with PRERENDER_DATA_DIR=/path/containing/complete-data.json+services.json
 * to build offline.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  NOT_FOUND_META,
  SITE_NAME,
  SITE_URL,
  STATIC_PAGES,
  regionPageMeta,
  regionPath,
  servicePageMeta,
  servicePath,
} from '../src/utils/seo.js';
import { buildAwsIndex } from '../src/utils/awsIndex.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const loadJson = async (file) => {
  if (process.env.PRERENDER_DATA_DIR) {
    return JSON.parse(await readFile(path.join(process.env.PRERENDER_DATA_DIR, file), 'utf8'));
  }
  const url = `${SITE_URL}/data/${file}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const formatLaunchDate = (date) => {
  const parsed = new Date(date);
  if (!date || Number.isNaN(parsed.getTime()) || parsed.getFullYear() < 1970) return 'Not available';
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
};

// ---------------------------------------------------------------------------
// Template handling
// ---------------------------------------------------------------------------

const replaceOnce = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender: could not find ${label} in dist/index.html`);
  }
  return html.replace(pattern, replacement);
};

const setMeta = (html, attr, key, value) =>
  replaceOnce(
    html,
    new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/>`),
    `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`,
    `<meta ${attr}="${key}">`
  );

const renderPage = (template, { urlPath, title, description, noindex = false, body, jsonLd = [] }) => {
  const url = `${SITE_URL}${urlPath === '/' ? '/' : urlPath}`;
  let html = template;

  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`, '<title>');
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'name', 'twitter:url', url);

  const robots = noindex ? 'noindex, follow' : 'index, follow';
  html = setMeta(html, 'name', 'robots', robots);
  html = setMeta(html, 'name', 'googlebot', robots);

  const headExtras = [
    noindex ? '' : `<link rel="canonical" href="${escapeHtml(url)}" />`,
    ...jsonLd.map(
      (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
    ),
  ]
    .filter(Boolean)
    .join('\n    ');
  html = replaceOnce(html, /<\/head>/, `    ${headExtras}\n  </head>`, '</head>');

  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`, '<div id="root">');
  return html;
};

const writeRoute = async (urlPath, html) => {
  const file = urlPath === '/' ? path.join(DIST, 'index.html') : path.join(DIST, urlPath, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
};

// ---------------------------------------------------------------------------
// Static markup (Tailwind classes must also appear in src/ so they survive purge)
// ---------------------------------------------------------------------------

const link = (href, text, className = 'text-primary hover:text-primary-light') =>
  `<a href="${escapeHtml(href)}" class="${className}">${escapeHtml(text)}</a>`;

const siteNav = () => `
<header class="border-b border-border-light dark:border-border">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-4 text-sm" aria-label="Main">
    ${link('/', SITE_NAME, 'font-semibold text-text-light-primary dark:text-text-primary')}
    ${link('/regions', 'Regions')}
    ${link('/services', 'Services')}
    ${link('/coverage', 'Coverage')}
    ${link('/whats-new', "What's New")}
    ${link('/reports', 'Reports')}
    ${link('/about', 'About')}
  </nav>
</header>`;

const pageShell = ({ breadcrumb = [], heading, intro, sections = [] }) => `
${siteNav()}
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  ${
    breadcrumb.length
      ? `<nav class="mb-4 text-sm text-text-light-secondary dark:text-text-secondary" aria-label="Breadcrumb">${breadcrumb
          .map((crumb) => (crumb.href ? link(crumb.href, crumb.name) : `<span>${escapeHtml(crumb.name)}</span>`))
          .join('<span class="mx-2">/</span>')}</nav>`
      : ''
  }
  <h1 class="text-4xl font-bold text-text-light-primary dark:text-text-primary mb-2">${escapeHtml(heading)}</h1>
  <p class="text-text-light-secondary dark:text-text-secondary text-lg mb-8">${intro}</p>
  ${sections.join('\n')}
</main>`;

const section = (title, content) => `
<section class="mb-8">
  <h2 class="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-3">${escapeHtml(title)}</h2>
  ${content}
</section>`;

const table = (headers, rows) => `
<div class="overflow-x-auto">
<table class="w-full text-sm">
  <thead><tr>${headers.map((h) => `<th class="px-4 py-3 text-left font-semibold">${escapeHtml(h)}</th>`).join('')}</tr></thead>
  <tbody>
    ${rows.map((cells) => `<tr>${cells.map((c) => `<td class="px-4 py-3">${c}</td>`).join('')}</tr>`).join('\n    ')}
  </tbody>
</table>
</div>`;

const linkList = (items) => `
<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
  ${items
    .map(
      (item) =>
        `<li>${link(item.href, item.name)} <span class="text-xs text-text-light-secondary dark:text-text-secondary font-mono">${escapeHtml(item.code)}</span></li>`
    )
    .join('\n  ')}
</ul>`;

const regionsTable = (index) =>
  table(
    ['Region', 'Code', 'AWS services available', 'Availability zones'],
    index.regions.map((region) => [
      link(regionPath(region.code), region.name),
      `<span class="font-mono">${escapeHtml(region.code)}</span>`,
      `${region.services.length} / ${index.services.length}`,
      escapeHtml(region.availabilityZones ?? ''),
    ])
  );

const servicesTable = (index) =>
  table(
    ['Service', 'Code', 'Regions available'],
    index.services.map((service) => [
      link(servicePath(service.code), service.name),
      `<span class="font-mono">${escapeHtml(service.code)}</span>`,
      `${service.regions.length} / ${index.regions.length}`,
    ])
  );

const breadcrumbJsonLd = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: `${SITE_URL}${crumb.href}`,
  })),
});

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

const staticPageBody = (urlPath, index, updated) => {
  const page = STATIC_PAGES[urlPath];
  const counts = `${index.services.length} AWS services across ${index.regions.length} AWS regions`;
  const intro = `${escapeHtml(page.description)} Data last updated ${escapeHtml(updated)}.`;

  switch (urlPath) {
    case '/':
      return pageShell({
        heading: page.heading,
        intro,
        sections: [
          section(
            'Browse AWS service availability',
            `<p class="mb-4">Tracking ${escapeHtml(counts)}. ${link('/coverage', 'Open the full services-by-region matrix')}, or pick a region below.</p>`
          ),
          section('AWS regions', regionsTable(index)),
        ],
      });
    case '/regions':
      return pageShell({ heading: page.heading, intro, sections: [section(`All ${index.regions.length} AWS regions`, regionsTable(index))] });
    case '/services':
      return pageShell({ heading: page.heading, intro, sections: [section(`All ${index.services.length} AWS services`, servicesTable(index))] });
    case '/coverage':
      return pageShell({
        heading: page.heading,
        intro,
        sections: [
          section('AWS services by region: summary per region', regionsTable(index)),
          section('AWS services by region: summary per service', servicesTable(index)),
        ],
      });
    default:
      return pageShell({ heading: page.heading, intro });
  }
};

const regionPageBody = (region, index) => {
  const meta = regionPageMeta(region, region.services.length);
  const available = new Set(region.services);
  const toItem = (service) => ({ href: servicePath(service.code), name: service.name, code: service.code });
  const availableServices = index.services.filter((s) => available.has(s.code)).map(toItem);
  const unavailableServices = index.services.filter((s) => !available.has(s.code)).map(toItem);

  return pageShell({
    breadcrumb: [{ name: 'Regions', href: '/regions' }, { name: region.code }],
    heading: meta.heading,
    intro: `${availableServices.length} of ${index.services.length} AWS services are available in ${escapeHtml(region.name)} (<span class="font-mono">${escapeHtml(region.code)}</span>).`,
    sections: [
      `<ul class="mb-8">
  <li>Region code: <span class="font-mono">${escapeHtml(region.code)}</span></li>
  <li>Availability zones: ${escapeHtml(region.availabilityZones ?? 'Not available')}</li>
  <li>Launch date: ${escapeHtml(formatLaunchDate(region.launchDate))}</li>
  ${region.blogUrl ? `<li><a href="${escapeHtml(region.blogUrl)}" rel="noopener noreferrer" class="text-primary hover:text-primary-light">Region launch blog post</a></li>` : ''}
</ul>`,
      section(`Services available in ${region.name} (${availableServices.length})`, linkList(availableServices)),
      unavailableServices.length
        ? section(`Services not yet available in ${region.name} (${unavailableServices.length})`, linkList(unavailableServices))
        : '',
    ],
  });
};

const servicePageBody = (service, index) => {
  const meta = servicePageMeta(service, service.regions.length, index.regions.length);
  const available = new Set(service.regions);
  const toItem = (region) => ({ href: regionPath(region.code), name: region.name, code: region.code });
  const availableRegions = index.regions.filter((r) => available.has(r.code)).map(toItem);
  const unavailableRegions = index.regions.filter((r) => !available.has(r.code)).map(toItem);

  return pageShell({
    breadcrumb: [{ name: 'Services', href: '/services' }, { name: service.code }],
    heading: meta.heading,
    intro: `${escapeHtml(service.name)} (<span class="font-mono">${escapeHtml(service.code)}</span>) is available in ${availableRegions.length} of ${index.regions.length} AWS regions.`,
    sections: [
      section(`Regions where ${service.name} is available (${availableRegions.length})`, linkList(availableRegions)),
      unavailableRegions.length
        ? section(`Regions where ${service.name} is not available (${unavailableRegions.length})`, linkList(unavailableRegions))
        : '',
    ],
  });
};

const sitemapXml = (entries) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ urlPath, lastmod }) =>
      `  <url>\n    <loc>${escapeHtml(`${SITE_URL}${urlPath}`)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
  )
  .join('\n')}
</urlset>
`;

// ---------------------------------------------------------------------------

const main = async () => {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('prerender: dist/index.html is already prerendered; run `vite build` first');
  }

  const [data, serviceNames] = await Promise.all([loadJson('complete-data.json'), loadJson('services.json')]);
  const index = buildAwsIndex(data, serviceNames.services || []);
  if (index.regions.length === 0 || index.services.length === 0) {
    throw new Error('prerender: data files contained no regions or services');
  }

  const dataDate = new Date(data.metadata.timestamp).toISOString().split('T')[0];
  const updated = new Date(data.metadata.timestamp).toUTCString();
  const sitemap = [];

  // 404 page first, from the untouched template
  await writeFile(
    path.join(DIST, '404.html'),
    renderPage(template, {
      urlPath: '/404',
      ...NOT_FOUND_META,
      body: pageShell({ heading: 'Page not found', intro: `The page you were looking for does not exist. ${link('/', 'Go to the dashboard')}.` }),
    })
  );

  for (const [urlPath, page] of Object.entries(STATIC_PAGES)) {
    await writeRoute(
      urlPath,
      renderPage(template, { urlPath, title: page.title, description: page.description, body: staticPageBody(urlPath, index, updated) })
    );
    sitemap.push({ urlPath, lastmod: urlPath === '/about' ? null : dataDate });
  }

  for (const region of index.regions) {
    const urlPath = regionPath(region.code);
    const meta = regionPageMeta(region, region.services.length);
    await writeRoute(
      urlPath,
      renderPage(template, {
        urlPath,
        title: meta.title,
        description: meta.description,
        body: regionPageBody(region, index),
        jsonLd: [breadcrumbJsonLd([{ name: 'Regions', href: '/regions' }, { name: region.name, href: urlPath }])],
      })
    );
    sitemap.push({ urlPath, lastmod: dataDate });
  }

  for (const service of index.services) {
    const urlPath = servicePath(service.code);
    const meta = servicePageMeta(service, service.regions.length, index.regions.length);
    await writeRoute(
      urlPath,
      renderPage(template, {
        urlPath,
        title: meta.title,
        description: meta.description,
        body: servicePageBody(service, index),
        jsonLd: [breadcrumbJsonLd([{ name: 'Services', href: '/services' }, { name: service.name, href: urlPath }])],
      })
    );
    sitemap.push({ urlPath, lastmod: dataDate });
  }

  await writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml(sitemap));

  console.warn(
    `prerender: wrote ${sitemap.length} pages (${index.regions.length} regions, ${index.services.length} services) + 404.html + sitemap.xml (data ${dataDate})`
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
