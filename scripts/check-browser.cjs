/* Development-only: Playwright, pngjs, and axe-core. No site runtime code. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const axe = require('axe-core');

const root = path.resolve(__dirname, '..');
const site = path.join(root, 'site');
const output = path.join(root, 'docs/screenshots');
const mime = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const viewports = [
  ['desktop-1440x900', 1440, 900, true],
  ['laptop-1366x768', 1366, 768, true],
  ['mobile-390x844', 390, 844, true],
  ['tablet-768x1024', 768, 1024, false],
  ['narrow-320x740', 320, 740, false],
];
const approved = {
  'root-barlow-lockup-dark-transparent.svg': 'd69d588a6d99d299634680b74aff1ed1294a4fcd1a423ba812d442d4980d6e01',
  'root-archive.svg': 'f19b8443313a707f05125438cb0425d021cea5992b50d5196f4dab198b80f4f2',
  'root-competitions.svg': '7499c9db9d3c96a78cb58d2f11a92d27fa5cc5d4a29707c7de4aca6a6799ec13',
  'root.svg': 'e9ae1f50351aad17c8a34743d0372ed02ea2228e5f11e9da6971ffe0c7cc97f8',
};

function colorFraction(png, box, color) {
  let matching = 0, total = 0;
  for (let y = Math.ceil(box.y); y < Math.floor(box.y + box.height); y++) {
    for (let x = Math.ceil(box.x); x < Math.floor(box.x + box.width); x++) {
      const index = (y * png.width + x) * 4;
      if (color.every((channel, i) => Math.abs(png.data[index + i] - channel) <= 3)) matching++;
      total++;
    }
  }
  return matching / total;
}

async function main() {
  await fs.mkdir(output, { recursive: true });
  for (const [file, hash] of Object.entries(approved)) {
    assert.equal(createHash('sha256').update(await fs.readFile(path.join(site, 'assets/brand', file))).digest('hex'), hash, `Approved asset changed: ${file}`);
  }
  const headers = Object.fromEntries((await fs.readFile(path.join(site, '_headers'), 'utf8'))
    .split('\n\n')[0].split('\n').slice(1).filter(Boolean).map(line => {
      const separator = line.indexOf(':');
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }));
  const server = http.createServer(async (request, response) => {
    try {
      let requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (requested.endsWith('/')) requested += 'index.html';
      const target = path.resolve(site, '.' + requested);
      if (!target.startsWith(site + path.sep)) { response.writeHead(403); response.end(); return; }
      let data, status = 200;
      try { data = await fs.readFile(target); }
      catch { data = await fs.readFile(path.join(site, '404.html')); status = 404; }
      response.writeHead(status, { ...headers, 'Content-Type': status === 404 ? 'text/html' : mime[path.extname(target)] || 'text/plain' });
      response.end(data);
    } catch { response.writeHead(500); response.end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const results = [];
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    for (const [name, width, height, save] of viewports) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [], externalRequests = [], failedResponses = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('request', request => { if (!request.url().startsWith(origin)) externalRequests.push(request.url()); });
      page.on('response', response => { if (response.status() >= 400) failedResponses.push(response.url()); });
      assert.equal((await page.goto(origin)).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
      assert.equal(dimensions.width, width, `${name}: horizontal overflow`);
      if (width > 1000) assert.equal(dimensions.height, height, `${name}: desktop must fit naturally in one viewport`);
      assert(await page.evaluate(() => document.fonts.check('500 16px Manrope')));
      assert(await page.locator('.brand img').evaluate(img => {
        const box = img.getBoundingClientRect();
        return img.complete && img.naturalWidth > 0 && Math.abs(box.width / box.height - 900 / 330) < .01;
      }));
      const image = await page.screenshot({ fullPage: true });
      if (save) await fs.writeFile(path.join(output, `${name}.png`), image);
      const png = PNG.sync.read(image);
      const projectPixels = [];
      for (const [index, selector] of ['.project-archive img'].entries()) {
        const locator = page.locator(selector);
        const box = await locator.boundingBox();
        assert(box.width >= 190 && box.width <= 245 && Math.abs(box.width - box.height) < .01, `${name}: project artwork size/proportions`);
        assert(await locator.evaluate(img => img.complete && img.naturalWidth > 0 && getComputedStyle(img).clipPath === 'none' && getComputedStyle(img).filter === 'none'));
        const ink = colorFraction(png, box, [152, 47, 34]);
        const background = colorFraction(png, box, [233, 237, 227]);
        assert(ink > .025 && ink < .09, `${name}: actual approved mark must be visible in screenshot (${ink})`);
        assert(background > .8, `${name}: approved logo background must be visible (${background})`);
        projectPixels.push({ width: box.width, height: box.height, inkFraction: ink, backgroundFraction: background });
      }
      await page.evaluate(axe.source);
      const accessibility = await page.evaluate(async () => {
        const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } });
        return result.violations.map(({ id, impact, nodes }) => ({ id, impact, elements: nodes.map(node => node.target) }));
      });
      assert.deepEqual(accessibility, [], `${name}: axe violations`);
      assert.deepEqual(errors, [], `${name}: browser console/page errors`);
      assert.deepEqual(externalRequests, [], `${name}: third-party requests`);
      assert.deepEqual(failedResponses, [], `${name}: failed assets`);
      results.push({ name, viewport: { width, height }, document: dimensions, projectPixels, axeViolations: 0, consoleErrors: 0, externalRequests: 0 });
      await page.close();
    }

    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(origin);
    const expectedTabs = ['#main', '#top', '#about', '#connect', 'https://archive.rootamman.com', 'https://www.linkedin.com/company/rootamman/'];
    for (const href of expectedTabs) {
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), href, 'Keyboard tab sequence');
      assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
    }
    await page.reload();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'main', 'Skip link must focus main');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), 'https://archive.rootamman.com');
    await page.locator('.project-archive').hover();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.project-archive .project-art')).transform === 'matrix(1, 0, 0, 1, 0, -2)');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.project-archive').hover();
    assert.equal(await page.locator('.project-archive .project-art').evaluate(el => getComputedStyle(el).transform), 'none');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    assert.equal(await page.locator('.project-art').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    await page.route('https://archive.rootamman.com/**', route => route.fulfill({ status: 200, contentType: 'text/plain', body: 'Navigation test stub' }));
    await page.locator('.project-archive img').click();
    await page.waitForURL('https://archive.rootamman.com/');
    assert.equal((await page.goto(origin + '/missing-page')).status(), 404);
    assert.equal(await page.title(), 'Page not found — root');
    await page.close();
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ browser: await browser.version(), axe: axe.version, viewports: results, keyboard: 'pass', reducedMotion: 'pass', archiveNavigation: 'pass (intercepted test response)', custom404: 'pass', approvedAssetHashes: approved }, null, 2) + '\n');
    console.log(JSON.stringify({ passed: results.map(result => result.name), axeViolations: 0, keyboard: 'pass', hover: 'pass', reducedMotion: 'pass', actualLogoPixels: 'pass', assetIntegrity: 'pass', custom404: 'pass' }, null, 2));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
