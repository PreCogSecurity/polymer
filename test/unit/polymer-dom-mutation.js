// Child mutation (appendChild/insertBefore/removeChild, DocumentFragment) behaviour.
suite('Polymer.dom mutation', function() {

  var testElement;

  suiteSetup(function() {
    testElement = document.querySelector('x-test');
  });

  test('appendChild (light)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var s = document.createElement('span');
    s.id = 'added';
    s.textContent = 'Added';
    Polymer.dom(rere).appendChild(s);
    assert.equal(Polymer.dom(testElement.root).querySelector('#added'), s);
  });

  test('insertBefore (light)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var ref = Polymer.dom(testElement.root).querySelector('#added');
    var s = document.createElement('span');
    s.id = 'added2';
    s.textContent = 'Added2';
    Polymer.dom(rere).insertBefore(s, ref);
    assert.equal(Polymer.dom(testElement.root).querySelector('#added2'), s);
  });

  test('removeChild (light)', function() {
    var added = Polymer.dom(testElement.root).querySelector('#added');
    var added2 = Polymer.dom(testElement.root).querySelector('#added2');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(Polymer.dom(testElement.root).querySelectorAll('*').length, 4);
    Polymer.dom(rere).removeChild(added);
    Polymer.dom(rere).removeChild(added2);
    assert.equal(Polymer.dom(testElement.root).querySelectorAll('*').length, 2);
  });

  test('appendChild (local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var s = document.createElement('span');
    s.id = 'local';
    s.textContent = 'Local';
    Polymer.dom(rere.root).appendChild(s);
    assert.equal(Polymer.dom(rere.root).querySelector('#local'), s);
  });

  test('insertBefore (local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var ref = Polymer.dom(testElement.root).querySelector('#local');
    var s = document.createElement('span');
    s.id = 'local2';
    s.textContent = 'Local2';
    Polymer.dom(rere.root).insertBefore(s, ref);
    assert.equal(Polymer.dom(rere.root).querySelector('#local2'), s);
  });

  test('removeChild (local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var local = Polymer.dom(rere.root).querySelector('#local');
    var local2 = Polymer.dom(rere.root).querySelector('#local2');
    Polymer.dom(rere.root).removeChild(local);
    Polymer.dom(rere.root).removeChild(local2);
    assert.equal(Polymer.dom(rere.root).querySelectorAll('#local').length, 0);
  });

  test('localDom.insertBefore first element results in minimal change', function() {
    var children = Polymer.dom(testElement.root).childNodes;
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(rere.attachedCount, 1);
    var s = document.createElement('span');
    s.id = 'local-first';
    s.textContent = 'Local First';
    Polymer.dom(testElement.root).insertBefore(s, children[0]);
    assert.equal(Polymer.dom(testElement.root).querySelector('#local-first'), s);
    assert.equal(rere.attachedCount, 1);
    Polymer.dom(testElement.root).removeChild(s);
    assert.equal(rere.attachedCount, 1);
  });

  test('appendChild (fragment, local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var fragment = document.createDocumentFragment();
    var childCount = 5;
    for (var i=0; i < childCount; i++) {
      var s = document.createElement('span');
      s.textContent = i;
      fragment.appendChild(s);
    }
    Polymer.dom(rere.root).appendChild(fragment);
    var added = Polymer.dom(rere.root).querySelectorAll('span');
    assert.equal(added.length, childCount);
    for (i=0; i < added.length; i++) {
      Polymer.dom(rere.root).removeChild(added[i]);
    }
    assert.equal(Polymer.dom(rere.root).querySelectorAll('span').length, 0);
  });

  test('insertBefore (fragment, local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var fragment = document.createDocumentFragment();
    var childCount = 5;
    for (var i=0; i < childCount; i++) {
      var s = document.createElement('span');
      s.textContent = i;
      fragment.appendChild(s);
    }
    var l = document.createElement('span');
    l.textContent = 'last';
    Polymer.dom(rere.root).appendChild(l);
    Polymer.dom(rere.root).insertBefore(fragment, l);
    var added = Polymer.dom(rere.root).querySelectorAll('span');
    assert.equal(added.length, childCount+1);
    assert.equal(added[added.length-1], l);
    for (i=0; i < added.length; i++) {
      Polymer.dom(rere.root).removeChild(added[i]);
    }
    assert.equal(Polymer.dom(rere.root).querySelectorAll('span').length, 0);
  });

  test('mutations using fragments without logical dom', function() {
    var d = document.createElement('div');
    document.body.appendChild(d);
    assert.equal(Polymer.dom(d).childNodes.length, 0);
    var frag = document.createDocumentFragment();
    var c = document.createElement('div');
    frag.appendChild(c);
    Polymer.dom(d).appendChild(frag);
    assert.equal(Polymer.dom(d).childNodes.length, 1);
    assert.equal(Polymer.dom(d).firstChild, c);
    var c1 = document.createElement('div');
    frag.appendChild(c1);
    Polymer.dom(d).appendChild(frag);
    assert.equal(Polymer.dom(d).childNodes.length, 2);
    assert.equal(Polymer.dom(d).firstChild, c);
    assert.equal(Polymer.dom(d).lastChild, c1);
  });

  test('appendChild interacts with unmanaged parent tree', function() {
    var container = document.querySelector('#container');
    var echo = Polymer.dom(container).firstElementChild;
    assert.equal(echo.localName, 'x-echo');
    var s1 = Polymer.dom(echo).nextElementSibling;
    assert.equal(s1.textContent, '1');
    var s2 = Polymer.dom(s1).nextElementSibling;
    assert.equal(s2.textContent, '2');
    assert.equal(Polymer.dom(container).children.length, 3);
    Polymer.dom(echo).appendChild(s1);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(container).children.length, 2);
    assert.equal(Polymer.dom(echo).nextElementSibling, s2);
    Polymer.dom(echo).appendChild(s2);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(container).children.length, 1);
    assert.equal(Polymer.dom(echo).nextElementSibling, null);
    Polymer.dom(container).appendChild(s1);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(container).children.length, 2);
    assert.equal(Polymer.dom(echo).nextElementSibling, s1);
    Polymer.dom(container).appendChild(s2);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(container).children.length, 3);
    assert.equal(Polymer.dom(echo).nextElementSibling, s1);
    assert.equal(Polymer.dom(s1).nextElementSibling, s2);
  });
});
