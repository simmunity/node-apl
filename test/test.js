(function() {
  var F, S, all, eq, exec, fail, fails, gives, identityFunction, nFailed, nTests, parser, queue, repr, t0, trampoline;
  parser = require('../lib/parser').parser;
  exec = require('../lib/interpreter').exec;
  trampoline = require('../lib/helpers').trampoline;
  repr = JSON.stringify;
  nTests = 0;
  nFailed = 0;
  identityFunction = function() {
    return this;
  };
  all = function(a, f) {
    var x, _i, _len;
        if (f != null) {
      f;
    } else {
      f = identityFunction;
    };
    for (_i = 0, _len = a.length; _i < _len; _i++) {
      x = a[_i];
      if (!f.call(x)) {
        return false;
      }
    }
    return true;
  };
  eq = function(x, y) {
    var _i, _ref, _ref2, _results;
    if (typeof x !== typeof y) {
      return false;
    } else if ((_ref = typeof x) === 'number' || _ref === 'string') {
      return x === y;
    } else if (x.length !== y.length) {
      return false;
    } else {
      return all((function() {
        _results = [];
        for (var _i = 0, _ref2 = x.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; 0 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this, arguments), function() {
        return eq(x[this], y[this]);
      });
    }
  };
  fail = function(reason, err) {
    nFailed++;
    console.error(reason);
    if (err) {
      return console.error(err.stack);
    }
  };
  queue = [];
  gives = function(code, expectedResult) {
    nTests++;
    return queue.push(function(next) {
      return exec(code, function(err, actualResult) {
        return trampoline(function() {
          if (err) {
            fail("Test " + (repr(code)) + " failed with " + err, err);
          } else if (!eq(expectedResult, actualResult)) {
            fail("Test " + (repr(code)) + " failed: expected " + (repr(expectedResult)) + " but got " + (repr(actualResult)));
          }
          return next;
        });
      });
    });
  };
  fails = function(code, expectedErrorMessage) {
    nTests++;
    return queue.push(function(next) {
      return exec(code, function(err, _) {
        return trampoline(function() {
          if (!err) {
            fail("Code " + (repr(code)) + " should have failed, but didn't");
          } else if (expectedErrorMessage && err.message.slice(0, expectedErrorMessage.length) !== expectedErrorMessage) {
            fail("Code " + (repr(code)) + " should have failed with " + (repr(expectedErrorMessage)) + ", but it failed with " + (repr(err.message)), err);
          }
          return next;
        });
      });
    });
  };
  S = function(s) {
    return s.split('');
  };
  gives('1 2 3', [1, 2, 3]);
  gives('(1 2 3)', [1, 2, 3]);
  gives('123', 123);
  gives('¯123', -123);
  gives('(123)', 123);
  gives('"123"', ['1', '2', '3']);
  gives("'123'", ['1', '2', '3']);
  gives('1 "2" (3 4)', [1, ['2'], [3, 4]]);
  gives('1234567890', 1234567890);
  gives('12.34e56', 12.34e56);
  gives('12.34e+56', 12.34e+56);
  gives('12.34E56', 12.34e56);
  gives('¯12.34e¯56', -12.34e-56);
  gives('0Xffff', 0xffff);
  gives('¯0xffff', -0xffff);
  gives('¯0xaBcD1234', -0xabcd1234);
  gives('""', []);
  gives('"\\f\\t\\n\\r\\u1234\\xff"', S('\f\t\n\r\u1234\xff'));
  fails('"a\nb"');
  fails('"a');
  gives("(1j¯2 + ¯2j3) = ¯1j1", 1);
  gives("(1j¯2 × ¯2j3) = 4j7", 1);
  gives('  \'Let\'\'s parse it!\'  ', S('Let\'s parse it!'));
  gives('  "0x22\'s the code for ""."  ', S('0x22\'s the code for ".'));
  gives('⍳ 0', []);
  gives('⍴ 0', []);
  gives('⍬', []);
  gives('⍬⍬', [[], []]);
  gives('1⍬2⍬3', [1, [], 2, [], 3]);
  gives('', []);
  gives('1\n2', 2);
  gives('1\r2', 2);
  gives('1 ◇ 2 ◇ 3', 3);
  gives('A←5', 5);
  gives('A×A←2 5', [4, 25]);
  gives('radius ← 3\nget_circumference ← {2 × ○ radius}\nget_surface ← {○ radius ⋆ 2}\n\nbefore ← 0.01× ⌊ 100× radius circumference surface\nradius ← radius + 1\nafter  ← 0.01× ⌊ 100× radius circumference surface\n\nbefore after', [[3, 18.84, 28.27], [4, 25.13, 50.26]]);
  gives("x ← «{'⍟': function (y) { return y + 1234; }}» ◇ x ⍟ 1", 1235);
  gives("x ← «{'⍟': function (y) { return y + 1234; }}» ◇ 1 ⍟ x", 1235);
  gives("x ← «{'⍟': function (y) { return y + 1234; }}» ◇ x ⍟ 1 1", [1235, 1235]);
  gives("x ← «{'⍟': function (y) { return y + 1234; }}» ◇ x x ⍟ 1", [1235, 1235]);
  gives("x ← «{'⍟': function () { return 1234; }}» ◇ ⍟ x", 1234);
  gives("x ← «{'⍟': function () { return 1234; }}» ◇ ⍟ x", 1234);
  gives("x ← «{'⍟': function () { return 1234; }}» ◇ ⍟ x x", [1234, 1234]);
  gives('(23 54 38)[0]', 23);
  gives('(23 54 38)[1]', 54);
  gives('(23 54 38)[2]', 38);
  fails('(23 54 38)[3]');
  fails('(23 54 38)[¯1]');
  gives('(23 54 38)[0 2]', [23, 38]);
  gives('(2 3 ⍴ 100 101 102 110 111 112)[1;2]', 112);
  fails('(2 3 ⍴ 100 101 102 110 111 112)[1;¯1]');
  fails('(2 3 ⍴ 100 101 102 110 111 112)[10;1]');
  gives('"hello"[1]', 'e');
  gives('"ipodlover"[1 2 5 8 3 7 6 0 4]', S('poordevil'));
  gives('("axlrose"[4 3 0 2 5 6 1])[0 1 2 3]', S('oral'));
  gives('" X"[(3 3⍴⍳9) ∈ 1 3 6 7 8]', S(' X ' + 'X  ' + 'XXX'));
  gives('{1 + 1} 1', 2);
  gives('{⍵=0:1 ◇ 2×∇⍵−1} 5', 32);
  gives('{ ⍵<2 : 1   ◇   (∇⍵−1)+(∇⍵−2) } 8', 34);
  gives('«1234+5678»', 6912);
  gives('«"asdf"»', S('asdf'));
  gives('+4', 4);
  gives('++4', 4);
  gives('+ 4 5', [4, 5]);
  gives('+((5 6) (7 1))', [[5, 6], [7, 1]]);
  gives('+ (5 6) (7 1)', [[5, 6], [7, 1]]);
  gives('1 + 2', 3);
  gives('2 3 + 5 8', [7, 11]);
  gives('(2 3 ⍴ 1 2 3 4 5 6) +       ¯2', [-1, 0, 1, 2, 3, 4]);
  gives('(2 3 ⍴ 1 2 3 4 5 6) +   2 ⍴ ¯2', [-1, 0, 1, 2, 3, 4]);
  gives('(2 3 ⍴ 1 2 3 4 5 6) + 2 3 ⍴ ¯2', [-1, 0, 1, 2, 3, 4]);
  fails('1 2 3 + 4 5', 'Length error');
  fails('(2 3⍴⍳6) + 3 2⍴⍳6', 'Length error');
  gives('−4', -4);
  gives('− 1 2 3', [-1, -2, -3]);
  gives('1 − 3', -2);
  gives('5 − ¯3', 8);
  gives('⍳ 5', [0, 1, 2, 3, 4]);
  gives('⍴ ⍳ 5', [5]);
  gives('⍳ 0', []);
  gives('⍴ ⍳ 0', [0]);
  gives('× ¯2 ¯1 0 1 2', [-1, -1, 0, 1, 1]);
  gives('× 0÷0', 0);
  gives('7 × 8', 56);
  gives('n←6 ◇ r←?n ◇ (0≤r)∧(r<n)', 1);
  gives('?0', 0);
  gives('?1', 0);
  gives('n←100 ◇ (+/n?n)=(+/⍳n)', 1);
  gives('n←100 ◇ A←(n÷2)?n ◇ ∧/(0≤A),A<n', 1);
  gives('0?100', []);
  gives('0?0', []);
  gives('1?1', [0]);
  fails('5?3');
  gives('!5', 120);
  gives('!21', 51090942171709440000);
  gives('!0', 1);
  gives('2 ! 4', 6);
  gives('3 ! 20', 1140);
  gives('2 ! 6 12 20', [15, 66, 190]);
  gives('TABLE1 ← 2 3 ⍴ 1 + ⍳ 6\nTABLE2 ← 2 3 ⍴ 3 6 9 12 15 18\nTABLE1 ! TABLE2', [3, 15, 84, 495, 3003, 18564]);
  gives('12 = 12', 1);
  gives('2 = 12', 0);
  gives('"Q" = "Q"', [1]);
  gives('1 = "1"', [0]);
  gives('"1" = 1', [0]);
  gives('11 7 2 9 = 11 3 2 6', [1, 0, 1, 0]);
  gives('"STOAT" = "TOAST"', [0, 0, 0, 0, 1]);
  gives('8 = 2 + 2 + 2 + 2', 1);
  gives(' TABLE ← 2 3⍴1 2 3 4 5 6\nMABLE ← 2 3⍴3 3 3 5 5 5\nTABLE = MABLE ', [0, 0, 1, 0, 1, 0]);
  gives(' TABLE ← 2 3⍴1 2 3 4 5 6\nMABLE ← 2 3⍴3 3 3 5 5 5\n3 = TABLE ', [0, 0, 1, 0, 0, 0]);
  gives(' TABLE ← 2 3⍴1 2 3 4 5 6\nMABLE ← 2 3⍴3 3 3 5 5 5\n3 = TABLE MABLE ', [[0, 0, 1, 0, 0, 0], [1, 1, 1, 0, 0, 0]]);
  gives('≡4', 0);
  gives('≡⍳4', 1);
  gives('≡2 2⍴⍳4', 1);
  gives('≡"abc" 1 2 3 (23 55)', 2);
  gives('≡"abc" (2 4⍴("abc" 2 3 "k"))', 3);
  gives('3≡3', 1);
  gives('3≡,3', 0);
  gives('4 7.1 8 ≡ 4 7.2 8', 0);
  gives('(3 4⍴⍳12) ≡ 3 4⍴⍳12', 1);
  gives('(3 4⍴⍳12) ≡ ⊂3 4⍴⍳12', 0);
  gives('("ABC" "DEF") ≡ "ABCDEF"', 0);
  gives('(⍳0)≡""', 0);
  gives('(2 0⍴0)≡(0 2⍴0)', 0);
  gives('(0⍴1 2 3)≡0⍴⊂2 2⍴⍳4', 0);
  gives('3≢3', 0);
  gives('∈ 17', [17]);
  gives('⍴ ∈ (1 2 3) "ABC" (4 5 6)', [9]);
  gives('∈ 2 2⍴(1 + 2 2⍴⍳4) "DEF" (1 + 2 3⍴⍳6) (7 8 9)', [1, 2, 3, 4, 'D', 'E', 'F', 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  gives('2 3 4 5 6 ∈ 1 2 3 5 8 13 21', [1, 1, 0, 1, 0]);
  gives('5 ∈ 1 2 3 5 8 13 21', [1]);
  gives('"AN"⍷"BANANA"', [0, 1, 0, 1, 0, 0]);
  gives('"BIRDS" "NEST"⍷"BIRDS" "NEST" "SOUP"', [1, 0, 0]);
  gives('"ME"⍷"HOME AGAIN"', [0, 0, 1, 0, 0, 0, 0, 0, 0, 0]);
  gives('"DAY"⍷7 9⍴"SUNDAY   MONDAY   TUESDAY  WEDNESDAYTHURSDAY FRIDAY   SATURDAY "', [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
  gives('(2 2⍴"ABCD")⍷"ABCD"', [0, 0, 0, 0]);
  gives('(1 2) (3 4) ⍷ "START" (1 2 3) (1 2) (3 4)', [0, 0, 1, 0]);
  gives('(2 2⍴7 8 12 13)⍷ 1+ 4 5⍴⍳20', [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  gives('1∧1', 1);
  gives('1∧0', 0);
  gives('0∧1', 0);
  gives('0∧0', 0);
  gives('0 0 1 1 ∧ 0 1 0 1', [0, 0, 0, 1]);
  gives('0 0 0 1 1 ∧ 1 1 1 1 0', [0, 0, 0, 1, 0]);
  gives('t ← 3 3 ⍴ 1 1 1 0 0 0 1 0 1   ◇   1 ∧ t', [1, 1, 1, 0, 0, 0, 1, 0, 1]);
  gives('t ← 3 3 ⍴ 1 1 1 0 0 0 1 0 1   ◇   ∧/ t', [1, 0, 0]);
  gives('12∧18', 36);
  gives('299∧323', 96577);
  gives('12345∧12345', 12345);
  gives('0∧123', 0);
  gives('1∨1', 1);
  gives('1∨0', 1);
  gives('0∨1', 1);
  gives('0∨0', 0);
  gives('0 0 1 1 ∨ 0 1 0 1', [0, 1, 1, 1]);
  gives('12∨18', 6);
  gives('299∨323', 1);
  gives('12345∨12345', 12345);
  gives('0∨123', 123);
  gives('⍴ 1 2 3 ⍴ 0', [1, 2, 3]);
  gives('⍴ ⍴ 1 2 3 ⍴ 0', [3]);
  gives('3 3 ⍴ ⍳ 4', [0, 1, 2, 3, 0, 1, 2, 3, 0]);
  gives('10,66', [10, 66]);
  gives("'10 ','MAY ','1985'", S('10 MAY 1985'));
  gives('⌽ 1 2 3 4 5 6', [6, 5, 4, 3, 2, 1]);
  gives('⌽ (1 2) (3 4) (5 6)', [[5, 6], [3, 4], [1, 2]]);
  gives('⌽ "BOB WON POTS"', S('STOP NOW BOB'));
  gives('⌽    2 5 ⍴ 1 2 3 4 5 6 7 8 9 0', [5, 4, 3, 2, 1, 0, 9, 8, 7, 6]);
  gives('⌽[0] 2 5 ⍴ 1 2 3 4 5 6 7 8 9 0', [6, 7, 8, 9, 0, 1, 2, 3, 4, 5]);
  gives('1 ⌽ 1 2 3 4 5 6', [2, 3, 4, 5, 6, 1]);
  gives("3 ⌽ 'ABCDEFGH'", S('DEFGHABC'));
  gives('3  ⌽ 2 5 ⍴  1 2 3 4 5  6 7 8 9 0', [4, 5, 1, 2, 3, 9, 0, 6, 7, 8]);
  gives('¯2 ⌽ "ABCDEFGH"', S('GHABCDEF'));
  gives('1 ⌽ 3 3 ⍴ ⍳ 9', [1, 2, 0, 4, 5, 3, 7, 8, 6]);
  gives('⊖ 1 2 3 4 5 6', [6, 5, 4, 3, 2, 1]);
  gives('⊖ (1 2) (3 4) (5 6)', [[5, 6], [3, 4], [1, 2]]);
  gives('⊖ "BOB WON POTS"', S('STOP NOW BOB'));
  gives('⊖    2 5 ⍴ 1 2 3 4 5 6 7 8 9 0', [6, 7, 8, 9, 0, 1, 2, 3, 4, 5]);
  gives('⊖[1] 2 5 ⍴ 1 2 3 4 5 6 7 8 9 0', [5, 4, 3, 2, 1, 0, 9, 8, 7, 6]);
  gives('1 ⊖ 3 3 ⍴ ⍳ 9', [3, 4, 5, 6, 7, 8, 0, 1, 2]);
  gives('⍉ 2 3 ⍴ 1 2 3 6 7 8', [1, 6, 2, 7, 3, 8]);
  gives('⍴ ⍉ 2 3 ⍴ 1 2 3 6 7 8', [3, 2]);
  gives('⍉ 1 2 3', [1, 2, 3]);
  gives('⍉ 2 3 4 ⍴ ⍳ 24', [0, 12, 4, 16, 8, 20, 1, 13, 5, 17, 9, 21, 2, 14, 6, 18, 10, 22, 3, 15, 7, 19, 11, 23]);
  gives('5 ↑ "ABCDEFGH"', S('ABCDE'));
  gives('¯3 ↑ "ABCDEFGH"', S('FGH'));
  gives('3 ↑ 22 2 19 12', [22, 2, 19]);
  gives('¯1 ↑ 22 2 19 12', [12]);
  gives('⍴ 1 ↑ (2 2 ⍴ ⍳ 4) (⍳ 10)', [1]);
  gives('5 ↑ 40 92 11', [40, 92, 11, 0, 0]);
  gives('¯5 ↑ 40 92 11', [0, 0, 40, 92, 11]);
  gives('3 3 ↑ 1 1 ⍴ 0', [0, 0, 0, 0, 0, 0, 0, 0, 0]);
  gives('5 ↑ "abc"', S('abc  '));
  gives('¯5 ↑ "abc"', S('  abc'));
  gives('3 3 ↑ 1 1 ⍴ "a"', S('a        '));
  gives('1 + 4 3 ⍴ ⍳ 12', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  gives('2 3 ↑ 1 + 4 3 ⍴ ⍳ 12', [1, 2, 3, 4, 5, 6]);
  gives('¯1 3 ↑ 1 + 4 3 ⍴ ⍳ 12', [10, 11, 12]);
  gives('1 2 ↑ 1 + 4 3 ⍴ ⍳ 12', [1, 2]);
  gives("4↓'OVERBOARD'", S('BOARD'));
  gives("¯5↓'OVERBOARD'", S('OVER'));
  gives("⍴10↓'OVERBOARD'", [0]);
  gives("0 ¯2↓ 3 3 ⍴ 'ONEFATFLY'", S('OFF'));
  gives("¯2 ¯1↓ 3 3 ⍴ 'ONEFATFLY'", S('ON'));
  gives("1↓ 3 3 ⍴ 'ONEFATFLY'", S('FATFLY'));
  gives('1 1↓ 2 3 4⍴"ABCDEFGHIJKLMNOPQRSTUVWXYZ"', S('QRSTUVWX'));
  gives('¯1 ¯1↓ 2 3 4⍴"ABCDEFGHIJKLMNOPQRSTUVWXYZ"', S('ABCDEFGH'));
  gives('⍴ ⊂ 2 3⍴⍳6', []);
  gives('⍴⍴ ⊂ 2 3⍴⍳6', [0]);
  gives('⊃ (1 2 3) (4 5 6)', [1, 2, 3, 4, 5, 6], [2, 3]);
  gives('⍴⊃ (1 2 3) (4 5 6)', [2, 3]);
  gives('⊃ (1 2) (3 4 5)', [1, 2, 0, 3, 4, 5]);
  gives('⍴⊃ (1 2) (3 4 5)', [2, 3]);
  gives('⊃ (1 2 3) "AB"', [1, 2, 3, 'A', 'B', ' ']);
  gives('⍴⊃ (1 2 3) "AB"', [2, 3]);
  gives('⊃123', 123);
  gives('1 ⌷ 3 5 8', 5);
  gives('(3 5 8)[1]', 5);
  gives('⌷←{⍺+¨⍵}  ◇  (3 5 8)[1]', [4, 6, 9]);
  gives('⍋13 8 122 4', [3, 1, 0, 2]);
  gives('a←13 8 122 4  ◇  a[⍋a]', [4, 8, 13, 122]);
  gives('⍋"ZAMBIA"', [1, 5, 3, 4, 2, 0]);
  gives('s←"ZAMBIA"  ◇  s[⍋s]', S('AABIMZ'));
  gives('t←3 3⍴"BOBALFZAK"  ◇  ⍋t', [1, 0, 2]);
  gives('t←3 3⍴4 5 6 1 1 3 1 1 2  ◇  ⍋t', [2, 1, 0]);
  gives('t←3 3⍴4 5 6 1 1 3 1 1 2  ◇  t[⍋t;]', [1, 1, 2, 1, 1, 3, 4, 5, 6]);
  gives('a←3 2 3⍴2 3 4 0 1 0 1 1 3 4 5 6 1 1 2 10 11 12  ◇  a[⍋a;;]', [1, 1, 2, 10, 11, 12, 1, 1, 3, 4, 5, 6, 2, 3, 4, 0, 1, 0]);
  gives('a←3 2 5⍴"joe  doe  bob  jonesbob  zwart"  ◇  a[⍋a;;]', S('bob  jonesbob  zwartjoe  doe  '));
  gives('"ZYXWVUTSRQPONMLKJIHGFEDCBA"⍋"ZAMBIA"', [0, 2, 4, 3, 1, 5]);
  gives('⎕A←"ABCDEFGHIJKLMNOPQRSTUVWXYZ"\n(⌽⎕A)⍋3 3⍴"BOBALFZAK"', [2, 0, 1]);
  gives('data←6 4⍴"ABLEaBLEACREABELaBELACES"\ncoll←2 26⍴"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"\ndata[coll⍋data;]', S('ABELaBELABLEaBLEACESACRE'));
  gives('data←6 4⍴"ABLEaBLEACREABELaBELACES"\ncoll1←"AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"\ndata[coll1⍋data;]', S('ABELABLEACESACREaBELaBLE'));
  gives('⍒3 1 8', [2, 0, 1]);
  gives('1760 3 12⊤75', [2, 0, 3]);
  gives('3 12⊤75', [0, 3]);
  gives('100000 12⊤75', [6, 3]);
  gives('16 16 16 16⊤100', [0, 0, 6, 4]);
  gives('1760 3 12⊤75.3', [2, 0, 75.3 - 72]);
  gives('0 1⊤75.3', [75, 75.3 - 75]);
  gives('2 2 2 2 2⊤1 2 3 4 5', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1]);
  gives('10⊤5 15 125', [5, 5, 5]);
  gives('0 10⊤5 15 125', [0, 1, 12, 5, 5, 5]);
  gives('(8 3⍴ 2 0 0\
             2 0 0\
             2 0 0\
             2 0 0\
             2 8 0\
             2 8 0\
             2 8 16\
             2 8 16) ⊤ 75', [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 4, 1, 3, 11]);
  gives('+/ 3', 3);
  gives('+/ 3 5 8', 16);
  gives('+/ 2 4 6', 12);
  gives('⌈/ 82 66 93 13', 93);
  gives('×/ 2 3 ⍴ 1 2 3 4 5 6', [6, 120]);
  gives("2 ,/ 'AB' 'CD' 'EF' 'HI'", [S('ABCD'), S('CDEF'), S('EFHI')]);
  gives("3 ,/ 'AB' 'CD' 'EF' 'HI'", [S('ABCDEF'), S('CDEFHI')]);
  gives('2 +/ 1 + ⍳10', [3, 5, 7, 9, 11, 13, 15, 17, 19]);
  gives('5 +/ 1 + ⍳10', [15, 20, 25, 30, 35, 40]);
  gives('10 +/ 1 + ⍳10', [55]);
  gives('11 +/ 1 + ⍳10', []);
  gives('2 −/ 3 4 9 7', [-1, -5, 2]);
  gives('¯2 −/ 3 4 9 7', [1, 5, -2]);
  gives('0 1 0 1 / "ABCD"', S('BD'));
  gives('1 1 1 1 0 / 12 14 16 18 20', [12, 14, 16, 18]);
  gives(' MARKS←45 60 33 50 66 19\nPASS←MARKS≥50\nPASS/MARKS ', [60, 50, 66]);
  gives(' MARKS←45 60 33 50 66 19\n(MARKS=50)/⍳⍴MARKS ', [3]);
  gives('1/"FREDERIC"', S('FREDERIC'));
  gives('0/"FREDERIC"', []);
  gives('t←1+2 3⍴⍳6  ◇  0 1 0/t', [2, 5]);
  gives('t←1+2 3⍴⍳6  ◇  1 0/[0]t', [1, 2, 3]);
  gives('t←1+2 3⍴⍳6  ◇  1 0⌿t', [1, 2, 3]);
  gives('t←1+2 3⍴⍳6  ◇  2 ¯2 2/t', [1, 1, 0, 0, 3, 3, 4, 4, 0, 0, 6, 6]);
  gives('t←1+2 3⍴⍳6  ◇  2 ¯2 2 ¯2 2/t', [1, 1, 0, 0, 2, 2, 0, 0, 3, 3, 4, 4, 0, 0, 5, 5, 0, 0, 6, 6]);
  gives('1 1 ¯2 1 1 / 1 2 (2 2⍴⍳4) 3 4', [1, 2, [0, 0, 0, 0], [0, 0, 0, 0], 3, 4]);
  gives('1 1 ¯2 1 1 1 / 1 2 (2 2⍴⍳4) 3 4', [1, 2, 0, 0, [0, 1, 2, 3], 3, 4]);
  gives('2 3 2 / "ABC"', S('AABBBCC'));
  gives('2 / "DEF"', S('DDEEFF'));
  gives('5 0 5 / 1 2 3', [1, 1, 1, 1, 1, 3, 3, 3, 3, 3]);
  gives('t←1+2 3⍴⍳6  ◇  2/t', [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
  gives('t←1+2 3⍴⍳6  ◇  2⌿t', [1, 2, 3, 1, 2, 3, 4, 5, 6, 4, 5, 6]);
  gives('2 3/3 1⍴"ABC"', ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'C', 'C', 'C', 'C', 'C']);
  gives('2 ¯1 2/[1]3 1⍴(7 8 9)', [7, 7, 0, 7, 7, 8, 8, 0, 8, 8, 9, 9, 0, 9, 9]);
  gives('2 ¯1 2/[1]3 1⍴"ABC"', ['A', 'A', ' ', 'A', 'A', 'B', 'B', ' ', 'B', 'B', 'C', 'C', ' ', 'C', 'C']);
  gives('+⌿ 2 3 ⍴ 1 2 3 10 20 30', [11, 22, 33]);
  gives('2 3 4 ∘.× 1 2 3 4', [2, 4, 6, 8, 3, 6, 9, 12, 4, 8, 12, 16]);
  gives('0 1 2 3 4 ∘.! 0 1 2 3 4', [1, 1, 1, 1, 1, 0, 1, 2, 3, 4, 0, 0, 1, 3, 6, 0, 0, 0, 1, 4, 0, 0, 0, 0, 1]);
  gives('1 2 ∘., 1+⍳3', [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3]]);
  gives('⍴ 1 2 ∘., 1+⍳3', [2, 3]);
  gives('2 3 ∘.↑ 1 2', [[1, 0], [2, 0], [1, 0, 0], [2, 0, 0]]);
  gives('⍴ 2 3 ∘.↑ 1 2', [2, 2]);
  gives('⍴ ((4 3 ⍴ 0) ∘.+ (5 2 ⍴ 0))', [4, 3, 5, 2]);
  gives('2 3 ∘.× 4 5', [8, 10, 12, 15]);
  gives('2 3 ∘.{⍺×⍵} 4 5', [8, 10, 12, 15]);
  gives('(1 3 5 7) +.= 2 3 6 7', 2);
  gives('(1 3 5 7) ∧.= 2 3 6 7', 0);
  gives('(1 3 5 7) ∧.= 1 3 5 7', 1);
  gives('⍴¨ (0 0 0 0) (0 0 0)', [[4], [3]]);
  gives('⍴¨ "MONDAY" "TUESDAY"', [[6], [7]]);
  gives('⍴    (2 2⍴⍳4) (⍳10) 97.3 (3 4⍴"K")', [4]);
  gives('⍴¨   (2 2⍴⍳4) (⍳10) 97.3 (3 4⍴"K")', [[2, 2], [10], [], [3, 4]]);
  gives('⍴⍴¨  (2 2⍴⍳4) (⍳10) 97.3 (3 4⍴"K")', [4]);
  gives('⍴¨⍴¨ (2 2⍴⍳4) (⍳10) 97.3 (3 4⍴"K")', [[2], [1], [0], [2]]);
  gives('(1 2 3) ,¨ 4 5 6', [[1, 4], [2, 5], [3, 6]]);
  gives("2 3 ↑¨ 'MONDAY' 'TUESDAY'", [S('MO'), S('TUE')]);
  gives("2 ↑¨ 'MONDAY' 'TUESDAY'", [S('MO'), S('TU')]);
  gives('2 3 ⍴¨ 1 2', [[1, 1], [2, 2, 2]]);
  gives('4 5 ⍴¨ "THE" "CAT"', [S('THET'), S('CATCA')]);
  gives('({⍵+1}⍣5) 3', 8);
  gives('({⍵+1}⍣0) 3', 3);
  gives('(⍴⍣3) 2 2⍴⍳4', [1]);
  gives('r ← (3 3 ⍴ ⍳ 9) ∈ 1 2 3 4 7', [0, 1, 1, 1, 1, 0, 0, 1, 0]);
  gives('r ← (3 3 ⍴ ⍳ 9) ∈ 1 2 3 4 7\n¯1 ⊖ ¯2 ⌽ 5 7 ↑ r', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  gives('r ← (3 3 ⍴ ⍳ 9) ∈ 1 2 3 4 7\nR ← ¯1 ⊖ ¯2 ⌽ 5 7 ↑ r\n1 0 ¯1 ⌽¨ R R R', [[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
  t0 = Date.now();
  console.info('Running tests...');
  trampoline((F = function() {
    if (queue.length) {
      return function() {
        return queue.shift()(F);
      };
    } else {
      if (nFailed) {
        console.info("Done.  " + nFailed + " of " + nTests + " tests failed.");
      } else {
        console.info("Done.  All " + nTests + " tests passed in " + (Date.now() - t0) + " ms.");
      }
      return 0;
    }
  }));
}).call(this);
