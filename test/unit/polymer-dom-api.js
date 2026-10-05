// Core Polymer.dom API surface: flushing, cloning, importing and event retargeting.
suite('Polymer.dom api', function() {

  var testElement;
  var wrap = window.wrap || function(n){ return n; };

  suiteSetup(function() {
    testElement = document.querySelector('x-test');
  });

  test('distribute (forced)', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var s = document.createElement('span');
    s.id = 'light';
    s.textContent = 'Light';
    Polymer.dom(rere).appendChild(s);
    assert.equal(Polymer.dom(rere).querySelector('#light'), s);
    assert.equal(Polymer.dom(s).parentNode, rere);
    if (rere.shadyRoot) {
      assert.notEqual(Polymer.TreeApi.Composed.getParentNode(s), rere);
    }
    Polymer.dom(testElement).flush();
    if (rere.shadyRoot) {
      assert.equal(Polymer.TreeApi.Composed.getParentNode(s), p);
    }
    Polymer.dom(rere).removeChild(s);
    if (rere.shadyRoot) {
      assert.equal(Polymer.TreeApi.Composed.getParentNode(s), p);
    }
    Polymer.dom(testElement).flush();
    if (rere.shadyRoot) {
      assert.equal(Polymer.TreeApi.Composed.getParentNode(s), null);
    }
  });

  test('queryDistributedElements', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var d$ = Polymer.dom(p.root).queryDistributedElements('*');
    assert.equal(d$.length, 1);
    assert.equal(d$[0], projected);

  });

  test('getEffectiveChildNodes', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    var c$ = Polymer.dom(re).getEffectiveChildNodes();
    assert.equal(c$.length, 3);
    assert.equal(c$[1], projected);
  });

  test('Polymer.dom.querySelector', function() {
    assert.equal(test, testElement, 'Polymer.dom().querySelector finds the test element');
    var rere = Polymer.dom().querySelector('x-rereproject');
    var projected = Polymer.dom().querySelector('#projected');
    assert.ok(testElement);
    assert.notOk(rere);
    assert.notOk(projected);
  });

  test('Polymer.dom event', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var re = Polymer.dom(rere.root).querySelector('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var eventHandled = 0;
    testElement.addEventListener('test-event', function(e) {
      eventHandled++;
      assert.equal(Polymer.dom(e).rootTarget, p);
      assert.equal(Polymer.dom(e).localTarget, testElement);
      var path = Polymer.dom(e).path;
      // path includes window only on more recent Shadow DOM implementations
      // account for that here.
      assert.ok(path.length >= 10);
      assert.equal(path[0], p);
      assert.equal(path[2], re);
      assert.equal(path[4], rere);
      assert.equal(path[6], testElement);
      // event.path *should* be an array
      assert.isArray(path);
      assert.isFunction(path.indexOf);
      assert(path.indexOf(testElement) > -1);
    });

    rere.addEventListener('test-event', function(e) {
      eventHandled++;
      assert.equal(Polymer.dom(e).localTarget, rere);
    });

    p.fire('test-event');
    assert.equal(eventHandled, 2);
  });

  test('parentNode', function() {
    var rere = Polymer.dom(testElement.root).querySelector('x-rereproject');
    var projected = Polymer.dom(testElement.root).querySelector('#projected');
    assert.equal(Polymer.dom(testElement).parentNode, wrap(document.body));
    assert.equal(Polymer.dom(projected).parentNode, rere);
  });

  test('Polymer.dom.childNodes is an array', function() {
    assert.isTrue(Array.isArray(Polymer.dom(document.body).childNodes));
  });

  test('Polymer.dom cloneNode shallow', function() {
    var a = document.createElement('div');
    a.innerHTML = '<x-clonate><span>1</span><span>2</span></x-clonate>';
    var b = Polymer.dom(Polymer.dom(a).firstElementChild).cloneNode();
    Polymer.dom(document.body).appendChild(b);
    assert.equal(Polymer.dom(b).childNodes.length, 0, 'shallow copy has incorrect children');
    if (b.shadyRoot) {
      assert.equal(b.children.length, 2, 'shallow copy has incorrect composed children');
    }
  });

  test('Polymer.dom cloneNode deep', function() {
    var a = document.createElement('div');
    a.innerHTML = '<x-clonate><span>1</span><span>2</span></x-clonate>';
    var b = Polymer.dom(a).cloneNode(true);
    Polymer.dom(document.body).appendChild(b);
    assert.equal(Polymer.dom(b.firstElementChild).childNodes.length, 2, 'deep copy has incorrect children');
    if (b.shadyRoot) {
      assert.equal(b.children.length, 4, 'deep copy has incorrect composed children');
    }
  });

  test('Polymer.dom importNode shallow', function() {
    var a = document.createElement('div');
    a.innerHTML = '<x-clonate><span>1</span><span>2</span></x-clonate>';
    var b = Polymer.dom(document).importNode(Polymer.dom(a).firstElementChild);
    Polymer.dom(document.body).appendChild(b);
    assert.equal(Polymer.dom(b).childNodes.length, 0, 'shallow import has incorrect children');
    if (b.shadyRoot) {
      assert.equal(b.children.length, 2, 'shallow import has incorrect composed children');
    }
  });

  test('Polymer.dom importNode deep', function() {
    var a = document.createElement('div');
    a.innerHTML = '<x-clonate><span>1</span><span>2</span></x-clonate>';
    var b = Polymer.dom(document).importNode(a, true);
    Polymer.dom(document.body).appendChild(b);
    assert.equal(Polymer.dom(b.firstElementChild).childNodes.length, 2, 'deep copy has incorrect children');
    if (b.shadyRoot) {
      assert.equal(b.children.length, 4, 'deep copy has incorrect composed children');
    }
  });

  test('flush causes attached and re-flushes if necessary', function(done) {
    var a = document.createElement('x-attach1');
    Polymer.dom(document.body).appendChild(a);
    Polymer.dom.flush();
    function testHeight() {
      assert.equal(a.offsetHeight, 540);
      done();
    }
    // note: CustomElements.takeRecords doesn't process all mutations under
    // SD polyfill and therefore we have no measurement guarantee in that case.
    if (Polymer.Settings.useShadow && !Polymer.Settings.useNativeShadow) {
      setTimeout(testHeight);
    } else {
      testHeight();
    }

  });

  test('Polymer.dom.flush reentrancy', function() {
    // Setup callbacks
    var order = [];
    var cb1 = sinon.spy(function() { order.push(cb1); });
    var cb2 = sinon.spy(function() { order.push(cb2); });
    var cb3 = sinon.spy(function() { order.push(cb3); });
    var cb4 = sinon.spy(function() { order.push(cb4); });
    var cbReentrant = sinon.spy(function() {
      order.push(cbReentrant);
      Polymer.dom.addDebouncer(Polymer.Debounce(null, cb3));
      Polymer.dom.flush();
      Polymer.dom.addDebouncer(Polymer.Debounce(null, cb4));
    });
    // Enqueue debouncers
    Polymer.dom.addDebouncer(Polymer.Debounce(null, cb1));
    Polymer.dom.addDebouncer(Polymer.Debounce(null, cbReentrant));
    Polymer.dom.addDebouncer(Polymer.Debounce(null, cb2));
    // Flush
    Polymer.dom.flush();
    // Check callbacks called and in correct order
    assert.isTrue(cb1.calledOnce);
    assert.isTrue(cb2.calledOnce);
    assert.isTrue(cb3.calledOnce);
    assert.isTrue(cb4.calledOnce);
    assert.isTrue(cbReentrant.calledOnce);
    assert.sameMembers(order, [cb1, cbReentrant, cb2, cb3, cb4]);
  });

  test('path correctly calculated for elements with destination insertion points', function(done) {
    var re = document.createElement('x-reproject');
    var p = Polymer.dom(re.root).querySelector('x-project');
    var child = document.createElement('p');
    child.innerHTML = "hello";
    // child will be inserted into p after distributeContent is performed.
    Polymer.dom(re).appendChild(child);
    Polymer.dom(document.body).appendChild(re);
    Polymer.dom.flush();
    child.addEventListener('child-event', function(e){
      var path = Polymer.dom(e).path;
      assert.isTrue(path.indexOf(p) !== -1, 'path contains p');
      assert.isTrue(path.indexOf(re) !== -1, 'path contains re');
      done();
    });
    var evt = new CustomEvent('child-event');
    child.dispatchEvent(evt);
  });
});
