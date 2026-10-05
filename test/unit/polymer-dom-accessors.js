suite('Polymer.dom accessors', function() {
  var noDistribute, distribute;

  suiteSetup(function() {
    noDistribute = document.querySelector('.accessors x-test-no-distribute');
    distribute = document.querySelector('.accessors x-project');
  });

  test('Polymer.dom node accessors (no distribute)', function() {
    var child = Polymer.dom(noDistribute).children[0];
    assert.isTrue(child.classList.contains('child'), 'test node could not be found');
    var before = document.createElement('div');
    var after = document.createElement('div');
    Polymer.dom(noDistribute).insertBefore(before, child);
    Polymer.dom(noDistribute).appendChild(after);
    assert.equal(Polymer.dom(noDistribute).firstChild, before, 'firstChild incorrect');
    assert.equal(Polymer.dom(noDistribute).lastChild, after, 'lastChild incorrect');
    assert.equal(Polymer.dom(before).nextSibling, child, 'nextSibling incorrect');
    assert.equal(Polymer.dom(child).nextSibling, after, 'nextSibling incorrect');
    assert.equal(Polymer.dom(after).previousSibling, child, 'previousSibling incorrect');
    assert.equal(Polymer.dom(child).previousSibling, before, 'previousSibling incorrect');
  });

  test('Polymer.dom node accessors (distribute)', function() {
    var child = Polymer.dom(distribute).children[0];
    assert.isTrue(child.classList.contains('child'), 'test node could not be found');
    var before = document.createElement('div');
    var after = document.createElement('div');
    Polymer.dom(distribute).insertBefore(before, child);
    Polymer.dom(distribute).appendChild(after);
    assert.equal(Polymer.dom(distribute).firstChild, before, 'firstChild incorrect');
    assert.equal(Polymer.dom(distribute).lastChild, after, 'lastChild incorrect');
    assert.equal(Polymer.dom(before).nextSibling, child, 'nextSibling incorrect');
    assert.equal(Polymer.dom(child).nextSibling, after, 'nextSibling incorrect');
    assert.equal(Polymer.dom(after).previousSibling, child, 'previousSibling incorrect');
    assert.equal(Polymer.dom(child).previousSibling, before, 'previousSibling incorrect');
  });

  test('Polymer.dom element accessors (no distribute)', function() {
    var parent = document.createElement('x-test-no-distribute');
    var child = document.createElement('div');
    Polymer.dom(parent).appendChild(child);
    var before = document.createElement('div');
    var after = document.createElement('div');
    Polymer.dom(parent).insertBefore(before, child);
    Polymer.dom(parent).appendChild(after);
    assert.equal(Polymer.dom(parent).firstElementChild, before, 'firstElementChild incorrect');
    assert.equal(Polymer.dom(parent).lastElementChild, after, 'lastElementChild incorrect');
    assert.equal(Polymer.dom(before).nextElementSibling, child, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(child).nextElementSibling, after, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(after).previousElementSibling, child, 'previousElementSibling incorrect');
    assert.equal(Polymer.dom(child).previousElementSibling, before, 'previousElementSibling incorrect');
  });

  test('Polymer.dom element accessors (distribute)', function() {
    var parent = document.createElement('x-project');
    var child = document.createElement('div');
    Polymer.dom(parent).appendChild(child);
    var before = document.createElement('div');
    var after = document.createElement('div');
    Polymer.dom(parent).insertBefore(before, child);
    Polymer.dom(parent).appendChild(after);
    assert.equal(Polymer.dom(parent).firstElementChild, before, 'firstElementChild incorrect');
    assert.equal(Polymer.dom(parent).lastElementChild, after, 'lastElementChild incorrect');
    assert.equal(Polymer.dom(before).nextElementSibling, child, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(child).nextElementSibling, after, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(after).previousElementSibling, child, 'previousElementSibling incorrect');
    assert.equal(Polymer.dom(child).previousElementSibling, before, 'previousElementSibling incorrect');
  });

  test('Polymer.dom node accessors (empty logical tree)', function() {
    var element = document.createElement('x-simple');
    assert.equal(Polymer.dom(element).parentNode, null, 'parentNode incorrect');
    assert.equal(Polymer.dom(element).firstChild, null, 'firstChild incorrect');
    assert.equal(Polymer.dom(element).lastChild, null, 'lastChild incorrect');
    assert.equal(Polymer.dom(element).nextSibling, null, 'nextSibling incorrect');
    assert.equal(Polymer.dom(element).previousSibling, null, 'previousSibling incorrect');
    assert.equal(Polymer.dom(element).firstElementChild, null, 'firstElementChild incorrect');
    assert.equal(Polymer.dom(element).lastElementChild, null, 'lastElementChild incorrect');
    assert.equal(Polymer.dom(element).nextElementSibling, null, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(element).previousElementSibling, null, 'previousElementSibling incorrect');
  });

  test('Polymer.dom node accessors (unmanaged logical tree)', function() {
    var element = document.createElement('div');
    var child1 = document.createElement('div');
    var child2 = document.createElement('div');
    element.appendChild(child1);
    element.appendChild(child2);
    assert.equal(Polymer.dom(element).parentNode, null, 'parentNode incorrect');
    assert.equal(Polymer.dom(element).firstChild, child1, 'firstChild incorrect');
    assert.equal(Polymer.dom(element).lastChild, child2, 'lastChild incorrect');
    assert.equal(Polymer.dom(element).nextSibling, null, 'nextSibling incorrect');
    assert.equal(Polymer.dom(element).previousSibling, null, 'previousSibling incorrect');
    assert.equal(Polymer.dom(element).firstElementChild, child1, 'firstElementChild incorrect');
    assert.equal(Polymer.dom(element).lastElementChild, child2, 'lastElementChild incorrect');
    assert.equal(Polymer.dom(element).nextElementSibling, null, 'nextElementSibling incorrect');
    assert.equal(Polymer.dom(element).previousElementSibling, null, 'previousElementSibling incorrect');
  });

  test('Polymer.dom textContent', function() {
    var testElement = document.createElement('x-project');
    Polymer.dom(testElement).textContent = 'Hello World';
    assert.equal(Polymer.dom(testElement).textContent, 'Hello World', 'textContent getter incorrect');
    if (testElement.shadyRoot) {
      Polymer.dom.flush();
      assert.equal(Polymer.TreeApi.Composed.getChildNodes(testElement)[1].textContent, 'Hello World', 'text content setter incorrect');
    }
    testElement = document.createElement('x-commented');
    assert.equal(Polymer.dom(testElement.root).textContent, '[]', 'text content getter with comment incorrect');

    var textNode = document.createTextNode('foo');
    assert.equal(Polymer.dom(textNode).textContent, 'foo', 'text content getter on textnode incorrect');
    Polymer.dom(textNode).textContent = 'bar';
    assert.equal(textNode.textContent, 'bar', 'text content setter on textnode incorrect');

    var commentNode = document.createComment('foo');
    assert.equal(Polymer.dom(commentNode).textContent, 'foo', 'text content getter on commentnode incorrect');
    Polymer.dom(commentNode).textContent = 'bar';
    assert.equal(commentNode.textContent, 'bar', 'text content setter on commentnode incorrect');
  });

  test('Polymer.dom innerHTML', function() {
    var testElement = document.createElement('x-project');
    Polymer.dom(testElement).innerHTML = '<div>Hello World</div><div>2</div><div>3</div>';
    var added = Polymer.dom(testElement).firstChild;
    assert.equal(added.textContent , 'Hello World', 'innerHTML setter incorrect');
    assert.equal(Polymer.dom(testElement).innerHTML , '<div>Hello World</div><div>2</div><div>3</div>', 'innerHTML getter incorrect');
    if (testElement.shadyRoot) {
      Polymer.dom.flush();
      var children = Polymer.TreeApi.Composed.getChildNodes(testElement);
      assert.equal(children[1], added, 'innerHTML setter composed incorrectly');
      assert.equal(children[2].textContent, '2', 'innerHTML setter composed incorrectly');
      assert.equal(children[3].textContent, '3', 'innerHTML setter composed incorrectly');
    }
  });

  test('Polymer.dom innerHTML (non-composed)', function() {
    var testElement = document.createElement('div');
    document.body.appendChild(testElement);
    Polymer.dom(testElement).innerHTML = '<div>Hello World</div><div>2</div><div>3</div>';
    var added = Polymer.dom(testElement).firstChild;
    assert.equal(added.textContent , 'Hello World', 'innerHTML setter incorrect');
    assert.equal(Polymer.dom(testElement).innerHTML , '<div>Hello World</div><div>2</div><div>3</div>', 'innerHTML getter incorrect');
    assert.equal(testElement.children.length, 3);
  });
});
