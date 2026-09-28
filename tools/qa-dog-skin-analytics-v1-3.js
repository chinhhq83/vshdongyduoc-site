const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const wrapperContext = {
  window: {},
  document: {
    querySelector: () => null,
    createElement: () => ({ dataset: {} }),
    head: { appendChild: () => {} },
  },
  location: { hostname: 'example.test' },
  console: { log: () => {} },
};
vm.runInNewContext(read('analytics.js'), wrapperContext);
wrapperContext.window.VSHAnalytics.track('page_view', { campaign: 'dog_skin_coat' });
assert(wrapperContext.window.vaq.length === 1, 'VSHAnalytics wrapper did not queue an event');
assert(wrapperContext.window.vaq[0][1].name === 'page_view', 'VSHAnalytics wrapper changed the event name');
assert(JSON.stringify(wrapperContext.window.vaq[0][1].data) === JSON.stringify({ campaign: 'dog_skin_coat' }), 'VSHAnalytics wrapper changed the payload');

const recorded = [];
const listeners = {};
const filter = { value: '', dataset: { filter: 'price' }, addEventListener: (name, fn) => { listeners[`filter:${name}`] = fn; } };
const search = { value: '', addEventListener: (name, fn) => { listeners[`search:${name}`] = fn; } };
const count = { textContent: '' };
const row = { dataset: { search: 'sample asin', price: 'LOW' }, hidden: false };
const amazon = { dataset: { analyticsEvent: 'amazon_click', asin: 'B0002AB9FS' }, addEventListener: (name, fn) => { listeners[`amazon:${name}`] = fn; } };
const analysis = { dataset: { analyticsEvent: 'full_analysis_click', asin: 'B0002AB9FS' }, addEventListener: (name, fn) => { listeners[`analysis:${name}`] = fn; } };
const mainContext = {
  window: { VSHAnalytics: { track: (name, data) => recorded.push({ name, data }) } },
  document: {
    addEventListener: (name, fn) => { if (name === 'DOMContentLoaded') fn(); },
    querySelectorAll: (selector) => selector === '[data-product-row]' ? [row] : selector === '[data-filter]' ? [filter] : [amazon, analysis],
    getElementById: (id) => id === 'q' ? search : count,
  },
};
vm.runInNewContext(read('assets/js/dog-skin-coat.js'), mainContext);
filter.value = 'LOW';
listeners['filter:change']();
listeners['amazon:click']();
listeners['analysis:click']();
assert(recorded.some((x) => x.name === 'page_view' && JSON.stringify(x.data) === JSON.stringify({ campaign: 'dog_skin_coat' })), 'page_view payload failed');
assert(recorded.some((x) => x.name === 'filter_used' && JSON.stringify(x.data) === JSON.stringify({ campaign: 'dog_skin_coat', filter: 'price' })), 'filter_used payload failed');
assert(recorded.some((x) => x.name === 'amazon_click' && JSON.stringify(x.data) === JSON.stringify({ campaign: 'dog_skin_coat', asin: 'B0002AB9FS' })), 'amazon_click payload failed');
assert(recorded.some((x) => x.name === 'full_analysis_click' && JSON.stringify(x.data) === JSON.stringify({ campaign: 'dog_skin_coat', asin: 'B0002AB9FS' })), 'full_analysis_click payload failed');

function lastInlineScript(html) {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  return scripts.at(-1)[1];
}

function testPageEvent(file, expectedName, asin) {
  const events = [];
  const context = {
    window: { VSHAnalytics: { track: (name, data) => events.push({ name, data }) } },
    document: { addEventListener: (name, fn) => { if (name === 'DOMContentLoaded') fn(); }, querySelectorAll: () => [] },
  };
  vm.runInNewContext(lastInlineScript(read(file)), context);
  assert(events.length === 1 && events[0].name === expectedName, `${expectedName} did not fire`);
  assert(JSON.stringify(events[0].data) === JSON.stringify({ campaign: 'dog_skin_coat', asin }), `${expectedName} payload failed`);
}

testPageEvent('pet/dog-skin-coat/products/grizzly-wild-alaskan-salmon-oil-dog-food-supplement-omega-3-fatty-acid-b0002ab9fs/index.html', 'product_detail_view', 'B0002AB9FS');
testPageEvent('pet/dog-skin-coat/evidence/b0002ab9fs/index.html', 'evidence_page_view', 'B0002AB9FS');

async function testContact(success) {
  const events = [];
  let submitHandler;
  let redirected = false;
  const button = { disabled: false };
  const status = { textContent: '' };
  const form = {
    action: 'https://example.test/submit',
    elements: { inquiry_type: { value: 'NEW_STUDY_EVIDENCE' }, redirect: { value: 'https://example.test/thank-you' } },
    addEventListener: (name, fn) => { if (name === 'submit') submitHandler = fn; },
    querySelector: () => button,
    reportValidity: () => true,
  };
  const context = {
    window: { VSHAnalytics: { track: (name, data) => events.push({ name, data }) }, location: { assign: () => { redirected = true; } } },
    document: { addEventListener: (name, fn) => { if (name === 'DOMContentLoaded') fn(); }, querySelector: () => form, getElementById: () => status },
    fetch: async () => ({ ok: success, json: async () => ({ success }) }),
    FormData: function () {},
  };
  vm.runInNewContext(lastInlineScript(read('contact.html')), context);
  await submitHandler({ preventDefault: () => {} });
  return { events, redirected, button, status };
}

(async () => {
  const success = await testContact(true);
  assert(success.events.length === 1 && success.events[0].name === 'contact_submit', 'contact_submit did not fire after success');
  assert(JSON.stringify(success.events[0].data) === JSON.stringify({ inquiry_type: 'NEW_STUDY_EVIDENCE' }), 'contact_submit payload is not inquiry_type only');
  assert(success.redirected, 'successful contact submission did not redirect');
  const failure = await testContact(false);
  assert(failure.events.length === 0, 'contact_submit fired after failed submission');
  assert(!failure.redirected, 'failed contact submission redirected');
  if (failures.length) {
    console.error(JSON.stringify({ result: 'FAIL', failures }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ result: 'PASS', verifiedEvents: ['page_view', 'product_detail_view', 'evidence_page_view', 'amazon_click', 'full_analysis_click', 'filter_used', 'contact_submit'], contactSuccessGated: true, piiPayloadFields: [] }, null, 2));
})();
