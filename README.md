# Polymer

[![CI](https://github.com/PreCogSecurity/polymer/actions/workflows/ci.yml/badge.svg)](https://github.com/PreCogSecurity/polymer/actions/workflows/ci.yml)
[![Security Policy](https://img.shields.io/badge/security-policy-blue.svg)](SECURITY.md)

Polymer lets you build encapsulated, re-usable elements that work just like standard HTML elements, to use in building web applications.

```html
<!-- Polyfill Web Components for older browsers -->
<script src="webcomponentsjs/webcomponents-lite.min.js"></script>

<!-- Import element -->
<link rel="import" href="google-map.html">

<!-- Use element -->
<google-map latitude="37.790" longitude="-122.390"></google-map>
```

Check out [polymer-project.org](https://www.polymer-project.org) for all of the library documentation, including getting started guides, tutorials, developer reference, and more.

Or if you'd just like to download the library, check out our [releases page](https://github.com/polymer/polymer/releases).

## Overview

Polymer is a lightweight library built on top of the web standards-based [Web Components](http://webcomponents.org/) API's, and makes it easier to build your very own custom HTML elements. Creating re-usable custom elements - and using elements built by others - can make building complex web applications easier and more efficient. By being based on the Web Components API's built in the browser (or [polyfilled](https://github.com/webcomponents/webcomponentsjs) where needed), Polymer elements are interoperable at the browser level, and can be used with other frameworks or libraries that work with modern browsers.

Among many ways to leverage custom elements, they can be particularly useful for building re-usable UI components. Instead of continually re-building a specific navigation bar or button in different frameworks and for different projects, you can define this element once using Polymer, and then reuse it throughout your project or in any future project.

Polymer provides a declarative syntax to easily create your own custom elements, using all standard web technologies - define the structure of the element with HTML, style it with CSS, and add interactions to the element with JavaScript. 

Polymer also provides optional two-way data-binding, meaning:

1. When properties in the model for an element get updated, the element can update itself in response.
2. When the element is updated internally, the changes can be propagated back to the model.

Polymer is designed to be flexible, lightweight, and close to the web platform - the library doesn't invent complex new abstractions and magic, but uses the best features of the web platform in straightforward ways to simply sugar the creation of custom elements.

In addition to the Polymer library for building your own custom elements, the Polymer project includes a collection of [pre-built elements](https://elements.polymer-project.org) that you can  drop on a page and use immediately, or use as starting points for your own custom elements.

## Polymer in 1 Minute

Polymer adds convenient features to make it easy to build complex elements:

**Create and register a custom element**

```js
/**
 * A not-very-useful inline element
 */
Polymer({
    is: 'my-element'
});
```

```html
<!-- use the element -->
<my-element></my-element>
```

**Add markup to your element**

```html
<!-- define the markup that your element will use -->
<dom-module id="my-simple-namecard">
  <template>
    <div>
      Hi! My name is <span>Jane</span>
    </div>
  </template>

  <script>
    Polymer({
        is: 'my-simple-namecard'
    });
  </script>
</dom-module>
```

**Configure properties on your element...**

```js
// Create an element that takes a property
Polymer({
    is: 'my-property-namecard',
    properties: {
      myName: {
        type: String
      }
    },
    ready: function() {
      this.textContent = 'Hi! My name is ' + this.myName;
    }
});
```

**...and have them set using declarative attributes**

```html
<!-- using the element -->
<my-property-namecard my-name="Jim"></my-property-namecard>
```

> Hi! My name is Jim

**Bind data into your element using the familiar mustache-syntax**

```html
<!-- define markup with bindings -->
<dom-module id="my-bound-namecard">
  <template>
    <div>
      Hi! My name is <span>{{myName}}</span>
    </div>
  </template>

  <script>
    Polymer({
      is: 'my-bound-namecard',
      properties: {
        myName: {
          type: String
        }
      }
    });
  </script>
</dom-module>
```

```html
<!-- using the element -->
<my-bound-namecard my-name="Josh"></my-bound-namecard>
```

> Hi! My name is Josh

**Style the internals of your element, without the style leaking out**

```html
<!-- add style to your element -->
<dom-module id="my-styled-namecard">
  <template>
    <style>
      /* This would be crazy in non webcomponents. */
      span {
        font-weight: bold;
      }
    </style>

    <div>
      Hi! My name is <span>{{myName}}</span>
    </div>
  </template>

  <script>
    Polymer({
      is: 'my-styled-namecard',
      properties: {
        myName: {
          type: String
        }
      }
    });
  </script>
</dom-module>
```

```html
<!-- using the element -->
<my-styled-namecard my-name="Jesse"></my-styled-namecard>
```

> Hi! My name is **Jesse**

**and so much more!**

Web components are an incredibly powerful new set of primitives baked into the web platform, and open up a whole new world of possibility when it comes to componentizing front-end code and easily creating powerful, immersive, app-like experiences on the web.

By being based on Web Components, elements built with Polymer are:

* Built from the platform up
* Self-contained
* Don't require an overarching framework - are interoperable across frameworks
* Re-usable

## Running Tests

Requires a supported Node runtime (`>=22`; see `.nvmrc`) and a clean checkout.
Install from the committed lockfile so the dependency tree is exactly what CI
uses:

```bash
nvm use            # honours .nvmrc
npm ci
npm test
```

`npm test` runs ESLint over every source and test file, then the Node unit
suite for the release build tooling (`test/node/`). It needs no browser and no
external accounts, and it exits non-zero on failure.

| Command | What it does |
| ------- | ------------ |
| `npm test` | Lint + Node unit tests. The default gate. |
| `npm run lint` | ESLint only. `lint:src` covers `src/` and `test/unit/`, `lint:build` covers the Node build tooling. |
| `npm run test:node` | Node unit tests only. |
| `npm run test:coverage` | Node unit tests with V8 coverage reporting. |
| `npm run test:browser` | The full `web-component-tester` suite in `test/unit/`. Needs real browsers (see below). |
| `npm run audit` | `npm audit`, failing on high and critical advisories. |
| `npm run build` | Legacy `gulp` release build (see limitations below). |

### Containerised run

If you would rather not install the toolchain locally:

```bash
docker build --tag polymer-test .
docker run --rm polymer-test          # lint + unit tests
```

### Continuous integration

`.github/workflows/ci.yml` is the blocking gate. It runs on a pinned
`ubuntu-24.04` image against Node 22 and Node 24, and its only steps are the
three commands above, so a red check is always reproducible locally:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm run lint
npm run test:node
npm run test:coverage
```

`--ignore-scripts` matches the Dockerfile: nothing on the lint or unit-test
path needs an install script, and skipping them keeps the install from running
code and fetching binaries on behalf of ~900 transitive devDependencies.

Two further workflows are not part of the gate and run on demand or on a
schedule: `browser-tests.yml` (the WCT suites, which need real browsers) and
`docker-verify.yml` (builds the image and runs `npm test` inside it).

All workflows pin third-party actions to immutable commit SHAs rather than
mutable tags and run with `contents: read`. Dependabot
(`.github/dependabot.yml`) tracks the npm, bower, and `github-actions`
ecosystems and is what moves those SHAs forward.

### Browser suites

The browser suite (`test/unit/*.html`) is served and driven by
`web-component-tester`, which launches real browsers and also needs the bower
`webcomponentsjs` dependency:

```bash
bower install
npm run test:browser
```

Two suites run in more than one DOM mode (`?dom=shadow`); the runner in
`test/runner.html` is the source of truth for the suite list.

### Known toolchain limitations

The build toolchain is the 2016-era Polymer 1.x stack and is pinned as-is:

- `gulp` 3 depends on `graceful-fs` 3, which crashes on Node 12 and newer
  (`ReferenceError: primordials is not defined`). Linting and unit testing
  therefore invoke `eslint` and `node --test` directly instead of going
  through gulp, so `npm test` works on a current Node.
- `npm run build` still requires the legacy toolchain and is expected to run
  on Node 10 or older. Migrating it is tracked separately; until then the
  published artifacts are unchanged.

## Security

See [SECURITY.md](SECURITY.md) for the threat model, supported versions, and
how to report a vulnerability. Do not report security issues through public
issues.

## Contributing

The Polymer team loves contributions from the community! Take a look at our [contributing guide](CONTRIBUTING.md) for more information on how to contribute.

## Communicating with the Polymer team

Beyond Github, we try to have a variety of different lines of communication available:

* [Blog](https://blog.polymer-project.org/)
* [Twitter](https://twitter.com/polymer)
* [Google+ community](https://plus.google.com/communities/115626364525706131031)
* [Mailing list](https://groups.google.com/forum/#!forum/polymer-dev)
* [Slack channel](https://bit.ly/polymerslack)

# License

The Polymer library uses a BSD-like license available [here](./LICENSE.txt)
