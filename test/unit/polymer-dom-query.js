// Query, projection and distribution behaviour of the Polymer.dom API.
suite('Polymer.dom query and distribution', function() {

  var testElement;

  suiteSetup(function() {
    testElement = document.querySelector('x-test');
  });

  test('querySelector (local)', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    assert.equal(projected.textContent, 'projected');
    var p2 = Polymer.dom(testElement).querySelector('#projected');
    assert.isNull(p2);
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(rere.is, 'x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    assert.equal(re.is, 'x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(p.is, 'x-project');
  });

  test('querySelectorAll (local)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var rereList = Polymer.dom(rere.root).querySelectorAll('*');
    assert.include(rereList, re);
    assert.equal(rereList.length, 2);
    var reList = Polymer.dom(re.root).querySelectorAll('*');
    assert.include(reList, p);
    assert.equal(reList.length, 2);
    var pList = Polymer.dom(p.root).querySelectorAll('*');
    assert.equal(pList.length, 1);
  });

  test('querySelector (light)', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(Polymer.dom(rere).querySelector('#projected'), projected);
    assert(Polymer.dom(re).querySelector('content'));
    assert(Polymer.dom(p).querySelector('content'));
  });

  test('querySelectorAll (light)', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(Polymer.dom(rere).querySelectorAll('#projected')[0], projected);
    assert(Polymer.dom(re).querySelectorAll('content').length, 1);
    assert(Polymer.dom(p).querySelectorAll('content').length, 1);
  });

  test('querySelectorAll with dom-repeat', function() {
    var el = document.createElement('polymer-dom-repeat');
    document.body.appendChild(el);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(el.$.container).querySelectorAll('*').length, 6, 'querySelectorAll finds repeated elements');
    document.body.removeChild(el);
  });

  test('querySelector document', function() {
    assert.ok(Polymer.dom().querySelector('body'));
  });

  test('projection', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    assert.equal(projected.textContent, 'projected');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(rere.is, 'x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    assert.equal(re.is, 'x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(p.is, 'x-project');
    var c1 = Polymer.dom(rere.root).querySelector('content');
    assert.include(Polymer.dom(c1).getDistributedNodes(), projected);
    var c2 = Polymer.dom(re.root).querySelector('content');
    assert.include(Polymer.dom(c2).getDistributedNodes(), projected);
    var c3 = Polymer.dom(p.root).querySelector('content');
    assert.include(Polymer.dom(c3).getDistributedNodes(), projected);
    var ip$ = [c1, c2, c3];
    assert.deepEqual(Polymer.dom(projected).getDestinationInsertionPoints(), ip$);
  });

  test('distributeContent', function() {
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var c1 = Polymer.dom(rere.root).querySelector('content');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var c2 = Polymer.dom(re.root).querySelector('content');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var c3 = Polymer.dom(p.root).querySelector('content');
    var ip$ = [c1, c2, c3];
    testElement.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(projected).getDestinationInsertionPoints(), ip$);
    rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    assert.equal(rere.is, 'x-rereproject');
    rere.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(projected).getDestinationInsertionPoints(), ip$);
    re = Polymer.dom(rere.root).querySelector('x-reproject');
    assert.equal(re.is, 'x-reproject');
    re.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(projected).getDestinationInsertionPoints(), ip$);
    p = Polymer.dom(re.root).querySelector('x-project');
    assert.equal(p.is, 'x-project');
  });

  test('distributeContent (reproject)', function() {
    var select = document.querySelector('x-select1');
    var child = Polymer.dom(select).firstElementChild;
    var c1 = Polymer.dom(select.root).querySelector('content');
    var c2 = Polymer.dom(select.$.select.root).querySelector('content');
    var c3 = Polymer.dom(select.$.select.$.select.root).querySelector('content');
    assert.equal(c1.getAttribute('select'), '[s1]');
    assert.equal(c2.getAttribute('select'), '[s2]');
    assert.equal(c3.getAttribute('select'), '[s3]');
    assert.equal(child.className, 'select-child');
    assert.equal(Polymer.dom(child).getDestinationInsertionPoints().length, 0);
    child.setAttribute('s1', '');
    select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    child.setAttribute('s2', '');
    select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    child.setAttribute('s3', '');
    select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    child.removeAttribute('s1');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
    child.setAttribute('s1', '');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    child.removeAttribute('s2');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    child.setAttribute('s2', '');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    child.removeAttribute('s3');
    select.$.select.$.select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    child.removeAttribute('s2');
    child.removeAttribute('s1');
    select.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
  });

  test('Polymer.dom.setAttribute (reproject)', function() {
    var select = document.querySelector('x-select1');
    var child = Polymer.dom(select).firstElementChild;
    var c1 = Polymer.dom(select.root).querySelector('content');
    var c2 = Polymer.dom(select.$.select.root).querySelector('content');
    var c3 = Polymer.dom(select.$.select.$.select.root).querySelector('content');
    assert.equal(c1.getAttribute('select'), '[s1]');
    assert.equal(c2.getAttribute('select'), '[s2]');
    assert.equal(c3.getAttribute('select'), '[s3]');
    assert.equal(child.className, 'select-child');
    assert.equal(Polymer.dom(child).getDestinationInsertionPoints().length, 0);
    Polymer.dom(child).setAttribute('s1', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    Polymer.dom(child).setAttribute('s2', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    Polymer.dom(child).setAttribute('s3', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).removeAttribute('s1');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
    Polymer.dom(child).setAttribute('s1', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).removeAttribute('s2');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    Polymer.dom(child).setAttribute('s2', '');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).removeAttribute('s3');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    Polymer.dom(child).removeAttribute('s2');
    Polymer.dom(child).removeAttribute('s1');
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
  });

  test('Polymer.dom.classListAdd/Remove/Toggle/Contains (reproject)', function() {
    var select = document.querySelector('x-select-class1');
    var child = Polymer.dom(select).firstElementChild;
    var c1 = Polymer.dom(select.root).querySelector('content');
    var c2 = Polymer.dom(select.$.select.root).querySelector('content');
    var c3 = Polymer.dom(select.$.select.$.select.root).querySelector('content');
    assert.equal(c1.getAttribute('select'), '.s1');
    assert.equal(c2.getAttribute('select'), '.s2');
    assert.equal(c3.getAttribute('select'), '.s3');
    assert.equal(Polymer.dom(child).getDestinationInsertionPoints().length, 0);
    Polymer.dom(child).classList.add('s1');
    assert.isTrue(Polymer.dom(child).classList.contains('s1'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    Polymer.dom(child).classList.add('s2');
    assert.isTrue(Polymer.dom(child).classList.contains('s2'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    Polymer.dom(child).classList.add('s3');
    assert.isTrue(Polymer.dom(child).classList.contains('s3'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).classList.toggle('s1');
    assert.isFalse(Polymer.dom(child).classList.contains('s1'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
    Polymer.dom(child).classList.toggle('s1');
    assert.isTrue(Polymer.dom(child).classList.contains('s1'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).classList.remove('s2');
    assert.isFalse(Polymer.dom(child).classList.contains('s2'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1]);
    Polymer.dom(child).classList.toggle('s2');
    assert.isTrue(Polymer.dom(child).classList.contains('s2'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2, c3]);
    Polymer.dom(child).classList.remove('s3');
    assert.isFalse(Polymer.dom(child).classList.contains('s3'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [c1, c2]);
    Polymer.dom(child).classList.remove('s2');
    Polymer.dom(child).classList.remove('s1');
    assert.isFalse(Polymer.dom(child).classList.contains('s2'));
    assert.isFalse(Polymer.dom(child).classList.contains('s1'));
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), []);
  });

  test('re-distribution results in correct logical tree when outer host remove a node from pool of inner host', function() {
    var r = document.querySelector('x-redistribute-a-b');
    var rc = Polymer.dom(r.root).querySelectorAll('content');
    var ec1 = Polymer.dom(r.$.echo1.root).querySelector('content');
    var ec2 = Polymer.dom(r.$.echo2.root).querySelector('content');
    var child = document.createElement('div');
    child.className = 'a';
    Polymer.dom(r).appendChild(child);
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [rc[0], ec1]);
    assert.deepEqual(Polymer.dom(rc[0]).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(rc[1]).getDistributedNodes(), []);
    assert.deepEqual(Polymer.dom(ec1).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(ec2).getDistributedNodes(), []);
    child.className = 'b';
    r.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [rc[1], ec2]);
    assert.deepEqual(Polymer.dom(rc[0]).getDistributedNodes(), []);
    assert.deepEqual(Polymer.dom(rc[1]).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(ec1).getDistributedNodes(), []);
    assert.deepEqual(Polymer.dom(ec2).getDistributedNodes(), [child]);
    child.className = 'a';
    r.distributeContent();
    Polymer.dom.flush();
    assert.deepEqual(Polymer.dom(child).getDestinationInsertionPoints(), [rc[0], ec1]);
    assert.deepEqual(Polymer.dom(rc[0]).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(rc[1]).getDistributedNodes(), []);
    assert.deepEqual(Polymer.dom(ec1).getDistributedNodes(), [child]);
    assert.deepEqual(Polymer.dom(ec2).getDistributedNodes(), []);
  });

  test('without a host setting hostAttributes/reflecting properties provokes distribution', function() {
    var e = document.querySelector('x-select-attr');
    var ip$ = Polymer.dom(e.root).querySelectorAll('content');
    var c = Polymer.dom(e).firstElementChild;
    assert.equal(Polymer.dom(c).getDestinationInsertionPoints()[0], ip$[1], 'child not distributed based on host attribute');
    c.foo = true;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c).getDestinationInsertionPoints()[0], ip$[0], 'child not distributed based on reflecting attribute');
    c.foo = false;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c).getDestinationInsertionPoints()[0], ip$[1], 'child not distributed based on reflecting attribute');
  });

  test('within a host setting hostAttributes/reflecting properties provokes distribution', function() {
    // TODO(sorvell): disabling this test failure until it can be diagnosed
    // filed as issue #1595
    if (window.ShadowDOMPolyfill) {
        return;
    }
    var e = document.querySelector('x-compose-select-attr');
    var ip$ = Polymer.dom(e.$.select.root).querySelectorAll('content');
    var c1 = e.$.attr1;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c1).getDestinationInsertionPoints()[0], ip$[1], 'child not distributed based on host attribute');
    c1.foo = true;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c1).getDestinationInsertionPoints()[0], ip$[0], 'child not distributed based on reflecting attribute');
    c1.foo = false;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c1).getDestinationInsertionPoints()[0], ip$[1], 'child not distributed based on reflecting attribute');
    var c2 = e.$.attr2;
    Polymer.dom.flush();
    assert.equal(Polymer.dom(c2).getDestinationInsertionPoints()[0], ip$[0], 'child not distributed based on default value');
  });
});
