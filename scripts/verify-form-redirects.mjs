import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { isFormspreeSuccess, getFormspreeFieldErrors } from '../src/utils/formspree-response.ts';
import { rememberFormConfirmation, consumeFormConfirmation, FORM_CONFIRMATION_MAX_AGE_MS } from '../src/utils/form-confirmation.ts';

// Run the actual Astro browser handlers against an isolated DOM/fetch fixture.
// No inquiries, network requests, analytics events or browser storage are used.
const now = 1_800_000_000_000;
function memoryStorage() {
  const values = new Map();
  return {
    values,
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  };
}

assert.equal(rememberFormConfirmation(), false, 'SSR without window is safe');
assert.equal(consumeFormConfirmation(), false, 'SSR confirmation is false');
const storage = memoryStorage();
assert.equal(consumeFormConfirmation(storage, now), false, 'Direct visits are not confirmed');
assert.equal(rememberFormConfirmation(storage, now), true);
assert.deepEqual([...storage.values.values()], [String(now)], 'Only a timestamp is stored');
assert.equal(consumeFormConfirmation(storage, now), true);
assert.equal(consumeFormConfirmation(storage, now), false, 'A reload cannot consume the marker twice');
for (const [age, expected] of [[FORM_CONFIRMATION_MAX_AGE_MS, true], [FORM_CONFIRMATION_MAX_AGE_MS + 1, false], [-1, false]]) {
  rememberFormConfirmation(storage, now);
  assert.equal(consumeFormConfirmation(storage, now + age), expected, `Marker age ${age}`);
  assert.equal(storage.values.size, 0, 'Stale/future timestamps are also removed');
}
for (const invalid of ['NaN', '', 'Infinity', '-1', '0', 'not-a-timestamp']) {
  storage.setItem('techsavvy-form-confirmed-at', invalid);
  assert.equal(consumeFormConfirmation(storage, now), false);
}
for (const invalid of [NaN, Infinity, -1, 0]) assert.equal(rememberFormConfirmation(storage, invalid), false);
const blockedStorage = {
  getItem() { throw new Error('Storage blocked'); },
  setItem() { throw new Error('Storage blocked'); },
  removeItem() { throw new Error('Storage blocked'); },
};
assert.equal(rememberFormConfirmation(blockedStorage, now), false);
assert.equal(consumeFormConfirmation(blockedStorage, now), false);

class Element {
  attributes = new Map();
  listeners = new Map();
  dataset = {};
  hidden = false;
  disabled = false;
  textContent = '';
  children = [];
  focused = false;
  setAttribute(key, value) { this.attributes.set(key, String(value)); }
  removeAttribute(key) { this.attributes.delete(key); }
  hasAttribute(key) { return this.attributes.has(key); }
  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }
  emit(type, event = {}) { return Promise.all((this.listeners.get(type) || []).map(listener => listener(event))); }
  focus() { this.focused = true; }
  append(element) { this.children.push(element); }
}

function response({ httpOk = true, contentType = 'application/json', data = { ok: true }, badJson = false } = {}) {
  return {
    ok: httpOk,
    headers: { get: name => name === 'content-type' ? contentType : null },
    json: async () => { if (badJson) throw new Error('Invalid JSON'); return data; },
  };
}

function fixture(javascript, {
  mode = 'ajax', valid = true, successUrl = '/thank-you', navigationBlocked = false,
  responseOptions, networkError = false, deferred = false, storageBlocked = false,
} = {}) {
  const form = new Element();
  form.action = 'https://formspree.io/f/mvkkkwyn';
  form.dataset = { submissionMode: mode, successUrl };
  form.reportValidity = () => valid;
  const fields = ['name', 'email', 'company', 'message'].map(name => {
    const field = new Element();
    field.name = name;
    field.value = `Original ${name}`;
    field.validationMessage = `${name} is required`;
    return field;
  });
  fields[2].disabled = true; // Existing disabled states must survive failures/back.
  const originalDisabled = fields.map(field => field.disabled);
  const errors = fields.map(field => {
    const error = new Element();
    error.dataset.fieldError = field.name;
    return error;
  });
  let resets = 0;
  form.reset = () => { resets++; fields.forEach(field => { field.value = ''; }); };
  const submit = new Element();
  const label = new Element();
  label.textContent = 'Send message';
  const status = new Element();
  const errorStatus = new Element();
  status.hidden = errorStatus.hidden = true;
  const selectors = new Map([
    ['button[type="submit"]', submit], ['[data-submit-label]', label],
    ['[data-form-status]', status], ['[data-form-error]', errorStatus],
  ]);
  form.querySelector = selector => selectors.get(selector) || null;
  form.querySelectorAll = selector => selector === '[data-field-error]' ? errors : fields;
  const document = {
    querySelectorAll: () => [form],
    createElement: tag => { assert.equal(tag, 'a'); return new Element(); },
  };
  const window = new Element();
  const destinations = [];
  window.location = {
    href: 'https://www.techsavvy.consulting/contact',
    origin: 'https://www.techsavvy.consulting',
    assign: href => {
      if (navigationBlocked) throw new Error('Navigation blocked');
      destinations.push(href);
    },
  };
  const timers = new Map();
  let timerId = 0;
  window.setTimeout = (callback, delay) => { timers.set(++timerId, { callback, delay }); return timerId; };
  window.clearTimeout = id => timers.delete(id);
  const calls = [];
  let resolveFetch;
  const markerStorage = storageBlocked ? blockedStorage : memoryStorage();
  runInNewContext(javascript, {
    document, window, URL, AbortController,
    isFormspreeSuccess, getFormspreeFieldErrors,
    rememberFormConfirmation: () => rememberFormConfirmation(markerStorage, now),
    FormData: class {
      constructor(target) {
        assert.equal(target, form);
        assert.deepEqual(fields.map(field => field.disabled), originalDisabled, 'Serialize before freezing fields');
        this.entries = fields.filter(field => !field.disabled).map(field => [field.name, field.value]);
      }
    },
    fetch: (url, options) => {
      calls.push({ url, options });
      if (networkError) return Promise.reject(new Error('Network interrupted'));
      if (deferred) return new Promise((resolve, reject) => {
        resolveFetch = () => resolve(response(responseOptions));
        options.signal.addEventListener('abort', () => reject(new Error('Aborted')));
      });
      return Promise.resolve(response(responseOptions));
    },
  }, { filename: 'Form.astro', timeout: 1000 });
  return {
    form, fields, errors, submit, label, status, errorStatus, window, calls, destinations, markerStorage,
    submitForm: async () => {
      const event = { prevented: false, preventDefault() { this.prevented = true; } };
      await form.emit('submit', event);
      return event;
    },
    resolve: () => resolveFetch(),
    abort: () => {
      assert.equal(timers.size, 1);
      const timer = [...timers.values()][0];
      assert.equal(timer.delay, 20000);
      timer.callback();
    },
    controlsRestored: () => {
      assert.equal(submit.disabled, false);
      assert.equal(label.textContent, 'Send message');
      assert.deepEqual(fields.map(field => field.disabled), originalDisabled);
    },
    noRedirect: () => {
      assert.equal(destinations.length, 0);
      assert.equal(resets, 0, 'Unconfirmed submissions retain all entries');
      assert.ok(fields.every(field => field.value.startsWith('Original ')));
      assert.equal(consumeFormConfirmation(markerStorage, now), false);
    },
    timerCount: () => timers.size,
    resets: () => resets,
  };
}

for (const [name, filename] of [
  ['homepage', 'ContactForm.astro'], ['contact', 'ContactForm.astro'], ['paid landing', 'PaidLandingForm.astro'],
]) {
  const source = await readFile(new URL(`../src/components/${filename}`, import.meta.url), 'utf8');
  assert.match(source, /data-success-url=\{previewPath\('\/thank-you'\)\}/);
  assert.match(source, /method="POST"/, 'No-JS native POST is retained');
  assert.doesNotMatch(source, /gtag\(|googletagmanager|google-analytics|facebook\.net|cloudflareinsights/i);
  const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const javascript = stripTypeScriptTypes(script.replace(/^\s*import .+?;\s*$/gm, ''));

  const success = fixture(javascript);
  assert.equal((await success.submitForm()).prevented, true);
  assert.deepEqual(success.destinations, ['https://www.techsavvy.consulting/thank-you']);
  assert.equal(success.resets(), 1);
  assert.equal(success.calls.length, 1);
  assert.equal(success.calls[0].options.credentials, 'omit');
  assert.equal(success.calls[0].options.headers.Accept, 'application/json');
  assert.equal(success.submit.disabled, true, 'Submission remains locked while navigating');
  assert.equal(success.timerCount(), 0);
  assert.equal(consumeFormConfirmation(success.markerStorage, now), true);
  await success.window.emit('pageshow', { persisted: true });
  success.controlsRestored();
  assert.equal(success.status.hidden, true, 'Back does not display stale confirmation');

  for (const responseOptions of [
    { httpOk: false }, { contentType: 'text/html' }, { contentType: null }, { data: {} },
    { data: { ok: false } }, { data: { ok: 'true' } }, { badJson: true },
    { data: { ok: true, error: 'Rejected' } },
    { data: { ok: true, errors: [{ field: 'email', message: 'Please check your email.' }] } },
  ]) {
    const failure = fixture(javascript, { responseOptions });
    await failure.submitForm();
    failure.noRedirect();
    failure.controlsRestored();
    assert.equal(failure.errorStatus.hidden, false);
    assert.equal(failure.calls.length, 1, 'No automatic retry');
    assert.equal(failure.timerCount(), 0);
    if (responseOptions.data?.errors) {
      assert.equal(failure.fields[1].hasAttribute('aria-invalid'), true);
      assert.equal(failure.errors[1].textContent, 'Please check your email.');
    }
  }

  const interrupted = fixture(javascript, { networkError: true });
  await interrupted.submitForm();
  interrupted.noRedirect();
  interrupted.controlsRestored();
  assert.equal(interrupted.calls.length, 1);

  const timedOut = fixture(javascript, { deferred: true });
  const timeoutSubmission = timedOut.submitForm();
  timedOut.abort();
  await timeoutSubmission;
  timedOut.noRedirect();
  timedOut.controlsRestored();
  assert.equal(timedOut.calls.length, 1);

  const duplicate = fixture(javascript, { deferred: true });
  const firstSubmission = duplicate.submitForm();
  assert.equal(duplicate.submit.disabled, true);
  assert.equal((await duplicate.submitForm()).prevented, true);
  assert.equal(duplicate.calls.length, 1, 'Double-click creates only one POST');
  duplicate.resolve();
  await firstSubmission;
  assert.equal(duplicate.destinations.length, 1);

  const invalid = fixture(javascript, { valid: false });
  assert.equal((await invalid.submitForm()).prevented, true);
  invalid.noRedirect();
  assert.equal(invalid.calls.length, 0);
  invalid.controlsRestored();

  const native = fixture(javascript, { mode: 'native' });
  assert.equal((await native.submitForm()).prevented, false, 'Native POST remains a browser default action');
  assert.equal(native.calls.length, 0);
  assert.equal(native.submit.disabled, true);
  await native.window.emit('pageshow', { persisted: true });
  native.controlsRestored();

  const navigation = fixture(javascript, { navigationBlocked: true });
  await navigation.submitForm();
  assert.equal(navigation.destinations.length, 0);
  assert.equal(navigation.errorStatus.hidden, true, 'Accepted submission is not described as a failure');
  assert.match(navigation.status.textContent, /has been submitted/);
  assert.equal(navigation.status.children[0].href, 'https://www.techsavvy.consulting/thank-you');
  navigation.controlsRestored();

  const restricted = fixture(javascript, { storageBlocked: true });
  await restricted.submitForm();
  assert.equal(restricted.destinations.length, 1, 'Blocked storage cannot block the redirect');

  const external = fixture(javascript, { successUrl: 'https://untrusted.example/thank-you' });
  await external.submitForm();
  assert.equal(external.destinations.length, 0, 'Confirmation cannot redirect to another origin');
  assert.equal(external.errorStatus.hidden, true);
  external.controlsRestored();

  const basePath = fixture(javascript, { successUrl: '/review/thank-you' });
  await basePath.submitForm();
  assert.deepEqual(basePath.destinations, ['https://www.techsavvy.consulting/review/thank-you']);
  console.log(`PASS: ${name} actual handler—strict success redirect, failures, validation, timeout, duplicate guard, Back, native fallback, storage/navigation failures and same-origin routing.`);
}

console.log('PASS: timestamp-only confirmation marker expires after five minutes, is consumed once, and fails safely when storage is unavailable. No network requests or submissions sent.');
