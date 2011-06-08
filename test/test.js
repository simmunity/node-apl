(function() {
  var S, all, eq, exec, fail, fails, gives, identityFunction, nFailed, nTests, parser, puts, repr;
  puts = require('sys').puts;
  parser = require('../lib/parser').parser;
  exec = require('../lib/apl').exec;
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
  fail = function(reason) {
    nFailed++;
    return puts(reason);
  };
  gives = function(code, expectedResult) {
    var actualResult;
    nTests++;
    try {
      actualResult = exec(parser.parse(code));
      if (!eq(expectedResult, actualResult)) {
        return fail("Test " + (repr(code)) + " failed: expected " + (repr(expectedResult)) + " but got " + (repr(actualResult)));
      }
    } catch (e) {
      return fail("Test " + (repr(code)) + " failed with " + e);
    }
  };
  fails = function(code, expectedErrorMessage) {
    var m;
    nTests++;
    try {
      exec(parser.parse(code));
      return fail("Code " + (repr(code)) + " should have failed, but didn't");
    } catch (e) {
      if (expectedErrorMessage) {
        m = expectedErrorMessage.toLowerCase();
        if (e.message.slice(0, m.length) !== expectedErrorMessage) {
          return fail("Code " + (repr(code)) + " should have failed with " + (repr(expectedErrorMessage)) + ", but it failed with " + (repr(e.message)));
        }
      }
    }
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
  gives('⍳ 0', []);
  gives('⍴ 0', []);
  gives('⍬', []);
  gives('⍬⍬', [[], []]);
  gives('1⍬2⍬3', [1, [], 2, [], 3]);
  gives('', 0);
  gives('1\n2', 2);
  gives('1\r2', 2);
  gives('1 ◇ 2 ◇ 3', 3);
  gives('A←5', 5);
  gives('A×A←2 5', [4, 25]);
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
  gives('1 + 2', 3);
  gives('2 3 + 5 8', [7, 11]);
  gives('(2 3 ⍴ 1 2 3 4 5 6) +       ¯2', [-1, 0, 1, 2, 3, 4]);
  gives('(2 3 ⍴ 1 2 3 4 5 6) +   2 ⍴ ¯2', [-1, 0, 1, 2, 3, 4]);
  gives('(2 3 ⍴ 1 2 3 4 5 6) + 2 3 ⍴ ¯2', [-1, 0, 1, 2, 3, 4]);
  fails('1 2 3 + 4 5', 'Length error');
  gives('+4', 4);
  gives('++4', 4);
  gives('+ 4 5', [4, 5]);
  gives('+((5 6) (7 1))', [[5, 6], [7, 1]]);
  gives('+ (5 6) (7 1)', [[5, 6], [7, 1]]);
  gives('−4', -4);
  gives('− 1 2 3', [-1, -2, -3]);
  gives('⍳ 5', [0, 1, 2, 3, 4]);
  gives('⍴ 1 2 3 ⍴ 0', [1, 2, 3]);
  gives('⍴ ⍴ 1 2 3 ⍴ 0', [3]);
  gives('3 3 ⍴ ⍳ 4', [0, 1, 2, 3, 0, 1, 2, 3, 0]);
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
  gives('∈ 17', [17]);
  gives('⍴ ∈ (1 2 3) "ABC" (4 5 6)', [9]);
  gives('∈ 2 2⍴(1 + 2 2⍴⍳4) "DEF" (1 + 2 3⍴⍳6) (7 8 9)', [1, 2, 3, 4, 'D', 'E', 'F', 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  gives('1∧1', 1);
  gives('1∧0', 0);
  gives('0∧0', 0);
  gives('0 0 0 1 1 ∧ 1 1 1 1 0', [0, 0, 0, 1, 0]);
  gives('t ← 3 3 ⍴ 1 1 1 0 0 0 1 0 1   ◇   1 ∧ t', [1, 1, 1, 0, 0, 0, 1, 0, 1]);
  gives('t ← 3 3 ⍴ 1 1 1 0 0 0 1 0 1   ◇   ∧/ t', [1, 0, 0]);
  gives('10,66', [10, 66]);
  gives("'10 ','MAY ','1985'", S('10 MAY 1985'));
  gives('1 ⌽ 1 2 3 4 5 6', [2, 3, 4, 5, 6, 1]);
  gives("3 ⌽ 'ABCDEFGH'", S('DEFGHABC'));
  gives('3  ⌽ 2 5 ⍴  1 2 3 4 5  6 7 8 9 0', [4, 5, 1, 2, 3, 9, 0, 6, 7, 8]);
  gives('¯2 ⌽ "ABCDEFGH"', S('GHABCDEF'));
  gives('1 ⌽ 3 3 ⍴ ⍳ 9', [1, 2, 0, 4, 5, 3, 7, 8, 6]);
  gives('1 ⊖ 3 3 ⍴ ⍳ 9', [3, 4, 5, 6, 7, 8, 0, 1, 2]);
  gives('5 ↑ "ABCDEFGH"', S('ABCDE'));
  gives('¯3 ↑ "ABCDEFGH"', S('FGH'));
  gives('3 ↑ 22 2 19 12', [22, 2, 19]);
  gives('¯1 ↑ 22 2 19 12', [12]);
  gives('⍴ 1 ↑ (2 2 ⍴ ⍳ 4) (⍳ 10)', [1]);
  gives('5 ↑ 40 92 11', [40, 92, 11, 0, 0]);
  gives('¯5 ↑ 40 92 11', [0, 0, 40, 92, 11]);
  gives('3 3 ↑ 1 1 ⍴ 0', [0, 0, 0, 0, 0, 0, 0, 0, 0]);
  gives('1 + 4 3 ⍴ ⍳ 12', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  gives('2 3 ↑ 1 + 4 3 ⍴ ⍳ 12', [1, 2, 3, 4, 5, 6]);
  gives('¯1 3 ↑ 1 + 4 3 ⍴ ⍳ 12', [10, 11, 12]);
  gives('1 2 ↑ 1 + 4 3 ⍴ ⍳ 12', [1, 2]);
  gives('⍴ ⊂ 2 3⍴⍳6', []);
  gives('⍴⍴ ⊂ 2 3⍴⍳6', [0]);
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
  gives('+⌿ 2 3 ⍴ 1 2 3 10 20 30', [11, 22, 33]);
  gives('2 3 4 ∘.× 1 2 3 4', [2, 4, 6, 8, 3, 6, 9, 12, 4, 8, 12, 16]);
  gives('0 1 2 3 4 ∘.! 0 1 2 3 4', [1, 1, 1, 1, 1, 0, 1, 2, 3, 4, 0, 0, 1, 3, 6, 0, 0, 0, 1, 4, 0, 0, 0, 0, 1]);
  gives('1 2 ∘., 1+⍳3', [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3]]);
  gives('⍴ 1 2 ∘., 1+⍳3', [2, 3]);
  gives('2 3 ∘.↑ 1 2', [[1, 0], [2, 0], [1, 0, 0], [2, 0, 0]]);
  gives('⍴ 2 3 ∘.↑ 1 2', [2, 2]);
  gives('⍴ ((4 3 ⍴ 0) ∘.+ (5 2 ⍴ 0))', [4, 3, 5, 2]);
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
  gives('r ← (3 3 ⍴ ⍳ 9) ∈ 1 2 3 4 7', [0, 1, 1, 1, 1, 0, 0, 1, 0]);
  gives('r ← (3 3 ⍴ ⍳ 9) ∈ 1 2 3 4 7\n¯1 ⊖ ¯2 ⌽ 5 7 ↑ r', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  gives('r ← (3 3 ⍴ ⍳ 9) ∈ 1 2 3 4 7\nR ← ¯1 ⊖ ¯2 ⌽ 5 7 ↑ r\n1 0 ¯1 ⌽¨ R R R', [[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
  if (nFailed) {
    puts("Done.  " + nFailed + " of " + nTests + " tests failed.");
  } else {
    puts("Done.  All " + nTests + " tests passed.");
  }
}).call(this);
