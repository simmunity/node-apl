{assert} = require './helpers'
{APLArray} = require './array'
{Complex} = require './complex'

@['⎕aplify'] = (x) ->
  assert x?
  if typeof x is 'string'
    if x.length is 1
      APLArray.scalar x
    else
      new APLArray x
  else if typeof x is 'number'
    APLArray.scalar x
  else if x instanceof Array
    new APLArray(
      for y in x
        if y instanceof APLArray and y.shape.length is 0 then y.unbox() else y
    )
  else if x instanceof APLArray
    x
  else
    throw Error 'Cannot aplify object ' + x

@['⎕complex'] = (re, im) ->
  APLArray.scalar new Complex re, im

@['⎕bool'] = (x) ->
  assert x instanceof APLArray
  if not x.isSingleton() then throw Error 'LENGTH ERROR'
  r = x.unbox()
  if r not in [0, 1] then throw Error 'DOMAIN ERROR: cannot convert to boolean: ' + r
  r


lazyRequires =
  './vocabulary/arithmetic':  '+−×÷⋆⍟∣'
  './vocabulary/floorceil':   '⌊⌈'
  './vocabulary/question':    '?'
  './vocabulary/exclamation': '!'
  './vocabulary/circle':      '○'
  './vocabulary/comparisons': '=≠<>≤≥≡≢'
  './vocabulary/logic':       '∼∨∧⍱⍲'
  './vocabulary/rho':         '⍴'
  './vocabulary/iota':        '⍳'
  './vocabulary/rotate':      '⌽⊖'
  './vocabulary/transpose':   '⍉'
  './vocabulary/epsilon':     '∈'
  './vocabulary/zilde':       ['get_⍬', 'set_⍬']
  './vocabulary/comma':       ',⍪'
  './vocabulary/grade':       '⍋⍒'
  './vocabulary/take':        '↑'
  './vocabulary/squish':      '⌷'
  './vocabulary/quad':        ['get_⎕', 'set_⎕']
  './vocabulary/format':      '⍕'
  './vocabulary/forkhook':    ['⎕fork', '⎕hook']
  './vocabulary/each':        '¨'
  './vocabulary/commute':     '⍨'

createLazyRequire = (obj, name, fromModule) ->
  obj[name] = (args...) ->
    obj[name] = f = require(fromModule)[name]
    f.aplName = name
    f.aplMetaInfo = arguments.callee.aplMetaInfo
    f args...

for fromModule, names of lazyRequires
  for name in names
    createLazyRequire @, name, fromModule

for name in '⍨¨' then (@[name].aplMetaInfo ?= {}).isPostfixAdverb = true

do =>
  for k, v of @ when typeof v is 'function'
    v.aplName = k
