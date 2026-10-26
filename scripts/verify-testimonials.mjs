import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';

// Exercise the component's actual browser script without a browser or network.
const source = await readFile(new URL('../src/components/Testimonials.astro', import.meta.url), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'Testimonial component has a script');
const javascript = stripTypeScriptTypes(script);

class Element {
  attributes = new Map();
  listeners = new Map();
  classes = new Set();
  hidden = false;
  inert = false;
  textContent = '';
  innerHTML = '';
  classList = {
    toggle: (name, active) => active ? this.classes.add(name) : this.classes.delete(name),
  };
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name); }
  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }
  emit(type) { for (const listener of this.listeners.get(type) || []) listener(); }
}

function fixture({ reducedMotion = false, hidden = false } = {}) {
  const slides = Array.from({ length: 4 }, (_, index) => {
    const slide = new Element();
    slide.classList.toggle('is-active', index === 0);
    slide.setAttribute('aria-hidden', String(index !== 0));
    slide.inert = index !== 0;
    return slide;
  });
  const carousel = new Element();
  const controls = new Element();
  controls.hidden = true;
  const previous = new Element();
  const next = new Element();
  const playback = new Element();
  const count = new Element();
  count.textContent = '1 / 4';
  const region = new Element();
  const elements = new Map([
    ['.testimonial-controls', controls], ['[data-previous]', previous],
    ['[data-next]', next], ['[data-playback]', playback],
    ['.testimonial-count', count], ['.testimonial-slides', region],
  ]);
  carousel.querySelector = selector => elements.get(selector) || null;
  carousel.querySelectorAll = selector => selector === '.testimonial-slide' ? slides : [];
  const document = new Element();
  document.hidden = hidden;
  document.querySelectorAll = selector => selector === '[data-testimonial-carousel]' ? [carousel] : [];
  const media = new Element();
  media.matches = reducedMotion;
  const timers = new Map();
  let nextTimer = 1;
  let intersection;

  runInNewContext(javascript, {
    document,
    matchMedia: query => {
      assert.equal(query, '(prefers-reduced-motion: reduce)');
      return media;
    },
    setTimeout: (callback, delay) => {
      const id = nextTimer++;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeout: id => timers.delete(id),
    IntersectionObserver: class {
      constructor(callback) { intersection = callback; }
      observe(target) { assert.equal(target, carousel); }
    },
  }, { filename: 'Testimonials.astro', timeout: 1000 });

  return {
    carousel, controls, previous, next, playback, count, region, document, media,
    visibility: visible => intersection([{ isIntersecting: visible }]),
    timerCount: () => timers.size,
    scheduled: () => {
      assert.equal(timers.size, 1, 'Exactly one autoplay timer is pending');
      assert.equal([...timers.values()][0].delay, 3000, 'Autoplay waits three seconds');
    },
    tick: () => {
      assert.equal(timers.size, 1, 'A timer must exist before advancing');
      const [id, timer] = [...timers.entries()][0];
      timers.delete(id);
      timer.callback();
    },
    active: expected => {
      assert.equal(slides.filter(slide => slide.classes.has('is-active')).length, 1, 'One active slide');
      slides.forEach((slide, index) => {
        assert.equal(slide.classes.has('is-active'), index === expected);
        assert.equal(slide.getAttribute('aria-hidden'), String(index !== expected));
        assert.equal(slide.inert, index !== expected);
      });
      assert.equal(count.textContent, `${expected + 1} / ${slides.length}`);
    },
  };
}

const auto = fixture();
assert.equal(auto.controls.hidden, false, 'Controls are revealed');
assert.equal(auto.timerCount(), 0, 'Offscreen carousel does not auto-advance');
auto.active(0);
auto.visibility(true);
auto.scheduled();
assert.equal(auto.region.getAttribute('aria-live'), 'off');
auto.tick();
auto.active(1);
auto.scheduled();
auto.playback.emit('click');
assert.equal(auto.timerCount(), 0, 'Pause cancels autoplay');
assert.equal(auto.playback.getAttribute('aria-label'), 'Play automatic testimonials');
assert.equal(auto.region.getAttribute('aria-live'), 'polite');
auto.playback.emit('click');
auto.scheduled();
auto.next.emit('click');
auto.active(2);
assert.equal(auto.timerCount(), 0, 'Manual next stops autoplay');
auto.previous.emit('click');
auto.active(1);
auto.previous.emit('click');
auto.active(0);
auto.previous.emit('click');
auto.active(3);
auto.next.emit('click');
auto.active(0);
assert.equal(auto.timerCount(), 0, 'Manual arrows remain paused and wrap both ways');

const visibility = fixture();
visibility.visibility(true);
visibility.carousel.emit('mouseenter');
assert.equal(visibility.timerCount(), 0, 'Hover pauses autoplay');
visibility.carousel.emit('mouseleave');
visibility.scheduled();
visibility.document.hidden = true;
visibility.document.emit('visibilitychange');
assert.equal(visibility.timerCount(), 0, 'Hidden browser tab cancels autoplay');
visibility.document.hidden = false;
visibility.document.emit('visibilitychange');
visibility.scheduled();
visibility.visibility(false);
assert.equal(visibility.timerCount(), 0, 'Leaving the viewport cancels autoplay');
visibility.visibility(true);
visibility.scheduled();

const focus = fixture();
focus.visibility(true);
focus.carousel.emit('focusin');
assert.equal(focus.timerCount(), 0, 'Keyboard focus pauses autoplay');
focus.carousel.emit('mouseleave');
assert.equal(focus.timerCount(), 0, 'Pointer movement does not undo focus pause');
focus.next.emit('click');
focus.active(1);
focus.playback.emit('click');
focus.scheduled();

const reduced = fixture({ reducedMotion: true });
reduced.visibility(true);
assert.equal(reduced.timerCount(), 0, 'Reduced motion disables initial autoplay');
assert.equal(reduced.playback.getAttribute('aria-label'), 'Play automatic testimonials');
reduced.next.emit('click');
reduced.active(1);
reduced.playback.emit('click');
reduced.scheduled();
reduced.media.emit('change');
assert.equal(reduced.timerCount(), 0, 'A reduced-motion change stops explicit playback');

console.log('PASS: actual testimonial script uses three-second autoplay, one active accessible slide, working pause/play/arrows, hover/focus/visibility guards and reduced-motion protection. No browser or network requests used.');
