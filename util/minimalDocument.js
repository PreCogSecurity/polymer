/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http:polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http:polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http:polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http:polymer.github.io/PATENTS.txt
 */

// jshint node: true
'use strict';

var dom5 = require('dom5');
var through2 = require('through2');

var p = dom5.predicates;

/**
 * True when `node` is a text node containing nothing but whitespace.
 *
 * @param {?Node} node candidate node; null/undefined yields false.
 * @return {boolean} true only for whitespace-only text nodes.
 */
function isBlankTextNode(node) {
  return !!node && dom5.isTextNode(node) && !/\S/.test(dom5.getTextContent(node));
}

/**
 * Splices `node`'s children into its parent in place of `node`, also dropping
 * the whitespace text node that trailed `node`.
 *
 * @param {?Node} node node to unwrap; a falsy value is a no-op.
 * @return {void}
 */
function replaceWithChildren(node) {
  if (!node) {
    return;
  }
  var parent = node.parentNode;
  if (!parent || !parent.childNodes) {
    // Detached node: there is no parent to unwrap into. Bail out instead of
    // throwing a TypeError from inside the build.
    return;
  }
  var idx = parent.childNodes.indexOf(node);
  if (idx < 0) {
    return;
  }
  var children = node.childNodes;
  children.forEach(function(n) {
    n.parentNode = parent;
  });
  var til = idx + 1;
  var next = parent.childNodes[til];
  // remove newline text node as well
  while (isBlankTextNode(next)) {
    til++;
    next = parent.childNodes[til];
  }
  parent.childNodes = parent.childNodes.slice(0, idx).concat(children, parent.childNodes.slice(til));
  node.childNodes = [];
}

/**
 * Reads `file.contents` as UTF-8 text.
 *
 * Rejects anything that is not a Buffer or string so that a malformed vinyl
 * file fails with an actionable message instead of being coerced to the
 * literal string "[object Object]" and parsed as HTML.
 *
 * @param {{contents: (Buffer|string)}} file vinyl-like file object.
 * @param {string} label human readable file name used in error messages.
 * @return {string} decoded document source.
 */
function readSource(file, label) {
  var contents = file && file.contents;
  if (!Buffer.isBuffer(contents) && typeof contents !== 'string') {
    throw new TypeError('minimalDocument: ' + label + ' has no readable ' +
        'Buffer/string contents (got ' + typeof contents + ')');
  }
  return Buffer.isBuffer(contents) ? contents.toString('utf8') : contents;
}

/**
 * through2 transform that strips the html/head/body wrapper from an already
 * vulcanized HTML document and hoists every inline <script> body into the
 * first script element.
 *
 * Rejects malformed input by failing the stream with a descriptive Error
 * rather than throwing inside the pipeline.
 *
 * @return {stream.Transform} object-mode through2 stream over vinyl files.
 */
module.exports = function() {
  return through2.obj(function(file, enc, cb) {
    var label = (file && file.relative) || (file && file.path) || '<stream>';
    try {
      var doc = dom5.parse(readSource(file, label));
      var head = dom5.query(doc, p.hasTagName('head'));
      var body = dom5.query(doc, p.hasTagName('body'));
      var html = dom5.query(doc, p.hasTagName('html'));
      var vulc = dom5.query(body, p.AND(p.hasTagName('div'), p.hasAttr('by-vulcanize'), p.hasAttr('hidden')));
      var charset = dom5.query(doc, p.AND(p.hasTagName('meta'), p.hasAttrValue('charset', 'UTF-8')));

      if (charset) {
        dom5.remove(charset);
      }

      replaceWithChildren(head);
      replaceWithChildren(vulc);
      replaceWithChildren(body);

      var scripts = dom5.queryAll(doc, p.hasTagName('script'));
      if (!scripts.length) {
        // Previously this reached dom5.setTextContent(undefined, ...) and threw
        // "Cannot read properties of undefined (reading 'nodeName')".
        throw new TypeError('minimalDocument: ' + label + ' contains no ' +
            '<script> element to collect inline scripts into');
      }
      var collector = scripts[0];
      var contents = [];
      for (var i = 0, s; i < scripts.length; i++) {
        s = scripts[i];
        if (i > 0) {
          dom5.remove(s);
        }
        contents.push(dom5.getTextContent(s));
      }
      dom5.setTextContent(collector, contents.join(''));

      replaceWithChildren(html);

      file.contents = Buffer.from(dom5.serialize(doc), 'utf8');

      cb(null, file);
    } catch (err) {
      // Name the offending file so build failures are actionable.
      err.message = err.message + ' (while processing ' + label + ')';
      cb(err);
    }
  });
};

// Exposed for unit testing (test/node/minimalDocument.test.js). The build only
// consumes the transform function itself.
module.exports.isBlankTextNode = isBlankTextNode;
module.exports.replaceWithChildren = replaceWithChildren;
module.exports.readSource = readSource;
