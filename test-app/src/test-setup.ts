// Vitest setup file — runs before each test file.
// Mirrors what src/test.ts did for Karma, scoped to Vitest's per-file model.
//
// @analogjs/vitest-angular's setup-zone script patches Vitest's
// describe/it/beforeEach/afterEach so test bodies run inside a ProxyZone,
// which zone.js-based Angular tests (waitForAsync, fakeAsync, tick) require.
//
// setupTestBed() itself is not used here: it depends on
// @angular/core/testing's ɵgetCleanupHook export, which only exists from
// Angular 20 onward. This library targets Angular 19, so TestBed is
// initialized directly instead (same approach used by the iae-sam-front-end
// precedent on the same Angular 19 / Analog 2.5.1 stack).
import "@analogjs/vitest-angular/setup-zone";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

// jsdom does not implement scrollIntoView. Several specs call it via
// native DOM elements (e.g. the sds-autocomplete keyboard-navigation
// tests); without a stub the call throws inside a fakeAsync zone, which
// leaves a pending macrotask and hangs every subsequent tick() in the
// same file.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

// jsdom intentionally does not implement innerText (it requires a real
// layout engine to compute rendered/visible text). Several specs read or
// write innerText directly on native elements; fall back to textContent,
// which is close enough for jsdom's non-rendering DOM.
if (!("innerText" in Element.prototype)) {
  Object.defineProperty(Element.prototype, "innerText", {
    get() {
      return this.textContent;
    },
    set(value) {
      this.textContent = value;
    },
    configurable: true,
  });
}

// jsdom does not implement the Web Animations API. @angular/animations'
// renderer calls element.animate() unconditionally when a component uses
// [@trigger] bindings; without a stub this throws mid-render inside a
// handful of specs (download, autocomplete-multiselect) that render
// animated components. A no-op Animation with the methods Angular's
// WebAnimationsPlayer touches is sufficient for tests that don't assert on
// animation timing.
if (!Element.prototype.animate) {
  Element.prototype.animate = function () {
    return {
      cancel() {},
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      onfinish: null,
      oncancel: null,
      currentTime: 0,
      playState: "finished",
      addEventListener() {},
      removeEventListener() {},
    };
  };
}

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true } }
);
