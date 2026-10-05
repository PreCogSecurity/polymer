// activeElement retargeting across nested shadow/light DOM boundaries.
suite('Polymer.dom activeElement', function() {

  var r;
    // light
      var r_l
    // shadow
      var r_0;
        // light
          var r_0_l;
        // shadow
          var r_0_0;
            // light
              var r_0_0_l;
                // shadow
                  var r_0_0_l_0;
          var r_0_1;
            // light
              var r_0_1_l;
      var r_1;
        // light
          var r_1_l;
            // shadow
              var r_1_l_0;
        // shadow
          var r_1_0;
            // light
              var r_1_0_l;
          var r_1_1;
            // light
              var r_1_1_l;

  suiteSetup(function() {
    r = Polymer.dom(document).querySelector('x-shadow-host-root');
      r_l = Polymer.dom(r).querySelector('x-shadow-host-root-light');
      r_0 = Polymer.dom(r.root).querySelector('x-shadow-host-root-0');
        r_0_l = Polymer.dom(r_0).querySelector('x-shadow-host-root-0-light');
        r_0_0 = Polymer.dom(r_0.root).querySelector('x-shadow-host-root-0-0');
          r_0_0_l = Polymer.dom(r_0_0).querySelector('x-shadow-host-root-0-0-light');
            r_0_0_l_0 = Polymer.dom(r_0_0_l.root).querySelector('x-shadow-host-root-0-0-light-0');
        r_0_1 = Polymer.dom(r_0.root).querySelector('x-shadow-host-root-0-1');
          r_0_1_l = Polymer.dom(r_0_1).querySelector('x-shadow-host-root-0-1-light');
      r_1 = Polymer.dom(r.root).querySelector('x-shadow-host-root-1');
        r_1_l = Polymer.dom(r_1).querySelector('x-shadow-host-root-1-light');
          r_1_l_0 = Polymer.dom(r_1_l.root).querySelector('x-shadow-host-root-1-light-0');
        r_1_0 = Polymer.dom(r_1.root).querySelector('x-shadow-host-root-1-0');
          r_1_0_l = Polymer.dom(r_1_0).querySelector('x-shadow-host-root-1-0-light');
        r_1_1 = Polymer.dom(r_1.root).querySelector('x-shadow-host-root-1-1');
          r_1_1_l = Polymer.dom(r_1_1).querySelector('x-shadow-host-root-1-1-light');
  });

  test('r.focus()', function() {
    r.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, null, 'r.root.activeElement === null');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_l.focus()', function() {
    r_l.focus();

    assert.equal(Polymer.dom(document).activeElement, r_l, 'document.activeElement === r_l');
    assert.equal(Polymer.dom(r.root).activeElement, null, 'r.root.activeElement === null');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_0.focus()', function() {
    r_0.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_0_l.focus()', function() {
    r_0_l.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_0_l, 'r.root.activeElement === r_0_l');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');

    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_0_0.focus()', function() {
    r_0_0.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
    assert.equal(Polymer.dom(r_0.root).activeElement, r_0_0, 'r_0.root.activeElement === r_0_0');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_0_0_l.focus()', function() {
    r_0_0_l.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
    assert.equal(Polymer.dom(r_0.root).activeElement, r_0_0_l, 'r_0.root.activeElement === r_0_0_l');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_0_0_l_0.focus()', function() {
    r_0_0_l_0.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
    assert.equal(Polymer.dom(r_0.root).activeElement, r_0_0_l, 'r_0.root.activeElement === r_0_0_l');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0_l.root).activeElement, r_0_0_l_0, 'r_0_0_l.root.activeElement === r_0_0_l_0');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_0_1.focus()', function() {
    r_0_1.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
    assert.equal(Polymer.dom(r_0.root).activeElement, r_0_1, 'r_0.root.activeElement === r_0_1');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_0_1_l.focus()', function() {
    r_0_1_l.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_0, 'r.root.activeElement === r_0');
    assert.equal(Polymer.dom(r_0.root).activeElement, r_0_1_l, 'r_0.root.activeElement === r_0_1_l');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_1.focus()', function() {
    r_1.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_1_l.focus()', function() {
    r_1_l.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_1_l, 'r.root.activeElement === r_1_l');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_1_l_0.focus()', function() {
    r_1_l_0.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_1_l, 'r.root.activeElement === r_1_l');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, null, 'r_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_l.root).activeElement, r_1_l_0, 'r_1.root.activeElement === r_1_l_0');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_1_0.focus()', function() {
    r_1_0.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, r_1_0, 'r_1.root.activeElement === r_1_0');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_1_0_l.focus()', function() {
    r_1_0_l.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, r_1_0_l, 'r_1.root.activeElement === r_1_0_l');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_1_1.focus()', function() {
    r_1_1.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, r_1_1, 'r_1.root.activeElement === r_1_1');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('r_1_1_l.focus()', function() {
    r_1_1_l.focus();

    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, r_1_1_l, 'r_1.root.activeElement === r_1_1_l');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('setting activeElement on document has no effect', function() {
    r_1_1.focus();

    Polymer.dom(document).activeElement = "abc";
    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, r_1_1, 'r_1.root.activeElement === r_1_1');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });

  test('setting activeElement on a shadow root has no effect', function() {
    r_1_1.focus();

    Polymer.dom(r_1.root).activeElement = "abc";
    assert.equal(Polymer.dom(document).activeElement, r, 'document.activeElement === r');
    assert.equal(Polymer.dom(r.root).activeElement, r_1, 'r.root.activeElement === r_1');
    assert.equal(Polymer.dom(r_0.root).activeElement, null, 'r_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_0.root).activeElement, null, 'r_0_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_0_1.root).activeElement, null, 'r_0_1.root.activeElement === null');
    assert.equal(Polymer.dom(r_1.root).activeElement, r_1_1, 'r_1.root.activeElement === r_1_1');
    assert.equal(Polymer.dom(r_1_0.root).activeElement, null, 'r_1_0.root.activeElement === null');
    assert.equal(Polymer.dom(r_1_1.root).activeElement, null, 'r_1_1.root.activeElement === null');
  });
});
