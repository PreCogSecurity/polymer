/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http:polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http:polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http:polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http:polymer.github.io/PATENTS.txt
 */

'use strict';

/**
 * Node test suite for the release build tooling.
 *
 * This suite is deliberately dependency-free (built-in `node:test` +
 * `node:assert`) and browser-free, so `npm test` is runnable on a fresh clone
 * of the repository with nothing but a supported Node runtime. The WCT browser
 * suites under test/unit are run separately via `npm run test:browser`.
 */

const test = require('node:test');
const assert = require('node:assert');

const minimalDocument = require('../../util/minimalDocument');
const dom5 = require('dom5');

/**
 * Minimal stand-in for a gulp/vinyl file: `minimalDocument` only reads
 * `contents`, `relative` and `path`, so a vinyl dependency is not required.
 *
 * @param {string} source document source.
 * @param {string=} relative file name reported in error messages.
 * @return {{contents: Buffer, relative: string, path: string}} vinyl-like file.
 */
function makeFile(source, relative) {
  const name = relative || 'polymer.html';
  return {
    contents: Buffer.from(source, 'utf8'),
    relative: name,
    path: '/repo/' + name
  };
}

/**
 * Runs a single file object through the transform.
 *
 * @param {{contents: (Buffer|string), relative: string, path: string}} file vinyl-like file.
 * @return {Promise<{contents: Buffer, relative: string}>} the transformed file.
 */
function transformFile(file) {
  return new Promise((resolve, reject) => {
    const stream = minimalDocument();
    let out = null;
    stream.on('data', (f) => {
      out = f;
    });
    stream.on('error', reject);
    stream.on('end', () => {
      try {
        assert.ok(out, 'expected the transform to emit a file');
        resolve(out);
      } catch (err) {
        reject(err);
      }
    });
    stream.write(file);
    stream.end();
  });
}

/**
 * Runs a single document through the transform.
 *
 * @param {string} source document source.
 * @param {string=} relative file name reported in error messages.
 * @return {Promise<string>} the transformed document source.
 */
async function transform(source, relative) {
  const out = await transformFile(makeFile(source, relative));
  return out.contents.toString('utf8');
}

/**
 * Asserts that transforming `source` fails with a message matching `pattern`.
 *
 * @param {string} source document source.
 * @param {RegExp} pattern expected error message.
 * @param {string=} relative file name reported in error messages.
 * @return {Promise<void>} resolves once the failure is observed.
 */
async function assertRejects(source, pattern, relative) {
  await assert.rejects(() => transform(source, relative), (err) => {
    assert.ok(err instanceof Error, 'expected an Error');
    assert.match(err.message, pattern);
    return true;
  });
}

/**
 * Collects every descendant text node of `node`.
 *
 * dom5's queryAll only understands its own rule objects, so the tree is walked
 * directly here.
 *
 * @param {Node} node subtree root.
 * @return {Array<Node>} the descendant text nodes in document order.
 */
function collectTextNodes(node) {
  const found = [];
  (node.childNodes || []).forEach((child) => {
    if (dom5.isTextNode(child)) {
      found.push(child);
    }
    found.push(...collectTextNodes(child));
  });
  return found;
}

test('minimalDocument: isBlankTextNode only accepts whitespace-only text', () => {
  const {isBlankTextNode} = minimalDocument;
  const doc = dom5.parse('<body>  <div><span>x</span></div>\n</body>');
  const textNodes = collectTextNodes(doc);

  assert.ok(textNodes.length >= 3, 'expected text nodes in the fixture');

  const blank = textNodes.filter(isBlankTextNode);
  assert.strictEqual(blank.length, 2,
      'the two whitespace-only text nodes should be blank');

  const nonBlank = textNodes.filter((n) => !isBlankTextNode(n));
  assert.strictEqual(nonBlank.length, 1, 'exactly one text node has content');
  assert.strictEqual(dom5.getTextContent(nonBlank[0]), 'x');

  assert.ok(!isBlankTextNode(dom5.query(doc, dom5.predicates.hasTagName('div'))),
      'an element is not a blank text node');
  assert.ok(!isBlankTextNode(null), 'null is not a blank text node');
  assert.ok(!isBlankTextNode(undefined), 'undefined is not a blank text node');
});

test('minimalDocument: replaceWithChildren is a no-op for detached nodes', () => {
  // Guards the build against a TypeError when handed a node that is not
  // actually part of a parent tree.
  const {replaceWithChildren} = minimalDocument;
  const orphan = {childNodes: []};

  assert.doesNotThrow(() => replaceWithChildren(null));
  assert.doesNotThrow(() => replaceWithChildren(undefined));
  assert.doesNotThrow(() => replaceWithChildren(orphan));

  const doc = dom5.parse('<body><div>a</div></body>');
  const detached = dom5.query(doc, dom5.predicates.hasTagName('div'));
  detached.parentNode = null;
  assert.doesNotThrow(() => replaceWithChildren(detached));

  // A node whose parentNode does not list it as a child is equally unusable;
  // the guard keeps that from throwing too.
  assert.doesNotThrow(() => replaceWithChildren({
    parentNode: {childNodes: []},
    childNodes: []
  }));
});

test('minimalDocument: readSource decodes buffers as utf-8', () => {
  const {readSource} = minimalDocument;

  assert.strictEqual(
      readSource({contents: Buffer.from('café', 'utf8')}, 'x.html'), 'café');
  assert.strictEqual(readSource({contents: 'plain string'}, 'x.html'),
      'plain string');
  assert.throws(() => readSource({}, 'x.html'), /has no readable Buffer\/string/);
  assert.throws(() => readSource({contents: 7}, 'x.html'),
      /has no readable Buffer\/string/);
});

test('minimalDocument: strips the html/head/body wrapper', async () => {
  const out = await transform([
    '<html>',
    '<head>',
    '<style>.a{color:red}</style>',
    '</head>',
    '<body>',
    '<div class="b">hello</div>',
    '<script>var a = 1;</script>',
    '</body>',
    '</html>'
  ].join('\n'));

  assert.doesNotMatch(out, /<html[\s>]/, 'html wrapper should be removed');
  assert.doesNotMatch(out, /<head[\s>]/, 'head wrapper should be removed');
  assert.doesNotMatch(out, /<body[\s>]/, 'body wrapper should be removed');
  assert.match(out, /<style>\.a\{color:red\}<\/style>/,
      'head contents should be inlined into the output');
  assert.match(out, /<div class="b">hello<\/div>/,
      'body contents should be inlined into the output');
  assert.match(out, /<script>var a = 1;<\/script>/,
      'the script element should survive');
});

test('minimalDocument: drops the whitespace text node trailing an unwrapped node', async () => {
  const out = await transform([
    '<html>',
    '<head>',
    '</head>',
    '<body>',
    '<div>a</div>',
    '<script>var a = 1;</script>',
    '</body>',
    '</html>'
  ].join('\n'));

  // Exact-output assertion: this pins the transform's whitespace contract.
  // Unwrapping <head> drops the newline text node that separated </head> from
  // <body>; the newlines inside <head> and <body> are preserved as-is.
  assert.strictEqual(out, '\n\n<div>a</div>\n<script>var a = 1;</script>\n\n');
});

test('minimalDocument: removes the UTF-8 charset declaration', async () => {
  const out = await transform([
    '<html>',
    '<head>',
    '<meta charset="UTF-8">',
    '</head>',
    '<body>',
    '<script>var a = 1;</script>',
    '</body>',
    '</html>'
  ].join('\n'));

  assert.doesNotMatch(out, /charset/i, 'charset meta should be removed');
  assert.match(out, /var a = 1;/);
});

test('minimalDocument: inlines the hidden by-vulcanize div', async () => {
  const out = await transform([
    '<html>',
    '<head></head>',
    '<body>',
    '<div by-vulcanize hidden><p>from vulcanize</p></div>',
    '<script>var a = 1;</script>',
    '</body>',
    '</html>'
  ].join('\n'));

  assert.doesNotMatch(out, /by-vulcanize/,
      'the by-vulcanize placeholder should be unwrapped');
  assert.doesNotMatch(out, /\shidden\b/,
      'the hidden placeholder attribute should be unwrapped');
  assert.match(out, /<p>from vulcanize<\/p>/,
      'placeholder children should be preserved');
});

test('minimalDocument: is a no-op for by-vulcanize when absent', async () => {
  const out = await transform(
      '<html><head></head><body><script>var a = 1;</script></body></html>');
  assert.strictEqual(out, '<script>var a = 1;</script>');
});

test('minimalDocument: collects every inline script into the first script', async () => {
  const out = await transform([
    '<html>',
    '<head>',
    '<script>var head = 1;</script>',
    '</head>',
    '<body>',
    '<script>var body = 2;</script>',
    '<script>var body2 = 3;</script>',
    '</body>',
    '</html>'
  ].join('\n'));

  assert.strictEqual((out.match(/<script/g) || []).length, 1,
      'exactly one script element should survive');
  assert.match(out, /var head = 1;/);
  assert.match(out, /var body = 2;/);
  assert.match(out, /var body2 = 3;/);
  assert.ok(out.indexOf('var head = 1;') < out.indexOf('var body = 2;'),
      'scripts should be concatenated in document order');
  assert.ok(out.indexOf('var body = 2;') < out.indexOf('var body2 = 3;'),
      'scripts should be concatenated in document order');
});

test('minimalDocument: output is UTF-8 encoded', async () => {
  // Regression guard: `new Buffer(...)` decoded the serialized string using
  // the deprecated Buffer constructor, which mangles multi-byte content.
  const out = await transform(
      '<html><head></head><body><script>var s = "café — ünïcode";</script></body></html>');

  assert.match(out, /café — ünïcode/,
      'multi-byte characters must survive the round trip');
  assert.ok(!/Ã|â€|Â/.test(out), 'output must not be double-encoded');
});

test('minimalDocument: emits a Buffer so downstream gulp plugins work', async () => {
  const stream = minimalDocument();
  const file = makeFile(
      '<html><head></head><body><script>var a = 1;</script></body></html>');
  const out = await new Promise((resolve, reject) => {
    stream.on('data', resolve);
    stream.on('error', reject);
    stream.write(file);
    stream.end();
  });

  assert.ok(Buffer.isBuffer(out.contents), 'contents must be a Buffer');
  assert.strictEqual(out.relative, 'polymer.html', 'file metadata preserved');
  assert.strictEqual(out.contents.toString('utf8'), '<script>var a = 1;</script>');
});

test('minimalDocument: rejects a document with no script element', async () => {
  await assertRejects(
      '<html><head></head><body><div>no scripts here</div></body></html>',
      /contains no <script> element/,
      'broken.html');
});

test('minimalDocument: names the offending file in the error', async () => {
  await assertRejects('<html><head></head><body></body></html>',
      /\(while processing broken\.html\)/,
      'broken.html');
});

test('minimalDocument: rejects a file with unreadable contents', async () => {
  // A vinyl file whose contents were never populated would otherwise be
  // stringified to "[object Object]" and parsed as markup.
  await assert.rejects(
      () => transformFile({
        contents: 42,
        relative: 'empty.html',
        path: '/repo/empty.html'
      }),
      /has no readable Buffer\/string contents/);
});

test('minimalDocument: surfaces input errors on the stream, not as a throw', async () => {
  // A thrown error inside a through2 transform would be an uncaught exception
  // that takes down the whole gulp process instead of failing one task.
  const stream = minimalDocument();
  const err = await new Promise((resolve, reject) => {
    stream.on('error', resolve);
    stream.on('data', () => reject(new Error('expected no output')));
    stream.write(makeFile('not a document at all', 'garbage.html'));
    stream.end();
  });
  assert.match(err.message, /while processing garbage\.html/);
});
