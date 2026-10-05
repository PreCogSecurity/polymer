suite('Polymer.dom non-distributed elements', function() {

  var nd;

  suiteSetup(function() {
    nd = document.querySelector('#noDistribute');
  });

  test('Polymer.dom finds undistributed child', function() {
    assert.ok(Polymer.dom(nd).children.length, 2, 'light children includes distributed and non-distributed nodes');
  });

  test('Polymer.dom removes/adds undistributed child', function() {
    var b = Polymer.dom(nd).children[0];
    assert.equal(Polymer.dom(b).getDestinationInsertionPoints().length, 0, 'element improperly distributed');
    Polymer.dom(nd).removeChild(b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 1, 'children length not decremented due to element removal');
    Polymer.dom(nd).appendChild(b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 2, 'children length not incremented due to element addition');
    var d = document.createElement('div');
    d.innerHTML = 'added';
    Polymer.dom(nd).insertBefore(d, b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 3, 'children length not incremented due to element addition');
    Polymer.dom(nd).removeChild(d);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 2, 'children length not decremented due to element removal');
  });

  test('Polymer.dom removes/adds between light and local dom', function() {
    var b = Polymer.dom(nd).children[1];
    assert.equal(Polymer.dom(b).getDestinationInsertionPoints().length, 0, 'element improperly distributed');
    Polymer.dom(nd.root).appendChild(b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 1, 'children length not decremented due to element removal');
    assert.equal(Polymer.dom(nd.root).children.length, 2, 'root children length not incremented due to element addition');
    Polymer.dom(nd).appendChild(b);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(nd).children.length, 2, 'children length not incremented due to element addition');
    assert.equal(Polymer.dom(nd.root).children.length, 1, 'root children length not decremented due to element removal');
  });

  test('distributeContent correctly distributes changes to light dom', function() {
    var shady = !Polymer.Settings.useShadow;
    function testNoAttr() {
      assert.equal(Polymer.dom(child).getDestinationInsertionPoints()[0], d.$.notTestContent, 'child not distributed logically');
      if (shady) {
        assert.equal(Polymer.TreeApi.Composed.getParentNode(child), d.$.notTestContainer, 'child not rendered in composed dom');
      }
    }
    function testWithAttr() {
      assert.equal(Polymer.dom(child).getDestinationInsertionPoints()[0], d.$.testContent, 'child not distributed logically');
      if (shady) {
        assert.equal(Polymer.TreeApi.Composed.getParentNode(child), d.$.testContainer, 'child not rendered in composed dom');
      }
    }
    // test with x-distribute
    var d = document.createElement('x-distribute');
    document.body.appendChild(d);
    var child = document.createElement('div');
    child.classList.add('child');
    child.textContent = 'Child';
    Polymer.dom(d).appendChild(child);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(d).children[0], child, 'child not added to logical dom');
    testNoAttr();
    // set / unset `test` attr and see if it distributes properly
    child.setAttribute('test', '');
    d.distributeContent();
    Polymer.dom.flush();
    testWithAttr();
    //
    child.removeAttribute('test');
    d.distributeContent();
    Polymer.dom.flush();
    testNoAttr();
    //
    child.setAttribute('test', '');
    d.distributeContent();
    Polymer.dom.flush();
    testWithAttr();
  });

  test('getOwnerRoot', function() {
    var test = document.createElement('div');
    var c1 = document.createElement('x-compose');
    var c2 = document.createElement('x-compose');
    Polymer.dom(c1.$.project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    Polymer.dom(c2.$.project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c2.root, 'getOwnerRoot not correctly reset when element moved to different root');
    Polymer.dom(c1).appendChild(test);
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
  });

  test('getOwnerRoot when out of tree', function() {
    var test = document.createElement('div');
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect when not in root');
    var c1 = document.createElement('x-compose');
    var project = c1.$.project;
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    Polymer.dom(project).removeChild(test);
    Polymer.dom.flush();
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
  });

  test('getOwnerRoot when out of tree and adding subtree', function() {
    var container = document.createDocumentFragment();
    var test = document.createElement('div');
    container.appendChild(test);
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect when not in root');
    var c1 = document.createElement('x-compose');
    var project = c1.$.project;
    Polymer.dom(project).appendChild(container);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    Polymer.dom(project).removeChild(test);
    Polymer.dom.flush();
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
  });

  test('getOwnerRoot, subtree', function() {
    var test = document.createElement('div');
    var testChild = document.createElement('div');
    test.appendChild(testChild);
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect when not in root');
    var c1 = document.createElement('x-compose');
    var project = c1.$.project;
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    assert.equal(Polymer.dom(testChild).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for sub-child added to element in root');
    Polymer.dom(project).removeChild(test);
    Polymer.dom.flush();
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
    assert.notOk(Polymer.dom(testChild).getOwnerRoot(), 'getOwnerRoot incorrect for sub-child moved from a root to no root');
    Polymer.dom(project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    assert.equal(Polymer.dom(testChild).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for sub-child added to element in root');
  });

  test('getOwnerRoot (paper-ripple use case)', function() {
    var test = document.createElement('div');
    // child
    var d = document.createElement('div');
    Polymer.dom(test).appendChild(d);
    var c1 = document.createElement('x-compose');
    var c2 = document.createElement('x-compose');
    Polymer.dom(c1.$.project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c1.root, 'getOwnerRoot incorrect for child added to element in root');
    Polymer.dom(c2.$.project).appendChild(test);
    Polymer.dom.flush();
    assert.equal(Polymer.dom(test).getOwnerRoot(), c2.root, 'getOwnerRoot not correctly reset when element moved to different root');
    Polymer.dom(c1).appendChild(test);
    assert.notOk(Polymer.dom(test).getOwnerRoot(), 'getOwnerRoot incorrect for child moved from a root to no root');
  });

  test('getDistributedNodes on non-content element', function() {
    assert.equal(Polymer.dom(document.createElement('div')).getDistributedNodes().length, 0);
        assert.equal(Polymer.dom().getDistributedNodes().length, 0);
  });

  test('getDestinationInsertionPoints on non-distributable element', function() {
    assert.equal(Polymer.dom(document.createElement('div')).getDestinationInsertionPoints().length, 0);
    assert.equal(Polymer.dom(document).getDestinationInsertionPoints().length, 0);
  });

  test('Deep Contains', function() {
    var el = document.querySelector('x-deep-contains');
    var shadow = el.$.shadowed;
    var light = Polymer.dom(el).querySelector('#light');
    var notdistributed = Polymer.dom(el).children[1];
    var disconnected = document.createElement('div');
    var separate = document.createElement('div');
    document.body.appendChild(separate);

    assert.equal(Polymer.dom(el).deepContains(el), true, 'Element should deepContain itself');
    assert.equal(Polymer.dom(el).deepContains(shadow), true, 'Shadowed Child element should be found');
    assert.equal(Polymer.dom(el).deepContains(light), true, 'Light Child element should be found');
    assert.equal(Polymer.dom(el).deepContains(notdistributed), true, 'Non-distributed child element should be found');
    assert.equal(Polymer.dom(el).deepContains(disconnected), false, 'Disconnected element should not be found');
    assert.equal(Polymer.dom(el).deepContains(separate), false, 'Unassociated, attached element should not be found');

    document.body.removeChild(separate);
  });

  test('Polymer.DomApi.wrap', function() {
    var wrap = window.wrap || function(node) { return node; };

    var node = document.querySelector('x-wrapped');
    assert.equal(wrap(document), Polymer.DomApi.wrap(document), 'document should be wrapped');
    assert.equal(wrap(node), Polymer.DomApi.wrap(node), 'node should be wrapped');
    assert.equal(wrap(node), Polymer.dom(node).node, 'Polymer.dom should always wrap the input node');
  });
});
