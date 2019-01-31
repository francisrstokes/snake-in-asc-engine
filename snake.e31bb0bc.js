// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/vec-la-fp/dist/vec.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// curry :: (a -> b -> ... -> n) -> (a -> b) -> (b -> ...) -> (... -> n)
var curry = function curry(fn) {
  var curried = function curried() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length >= fn.length) {
      return fn.apply(undefined, args);
    }
    return function () {
      for (var _len2 = arguments.length, argsNext = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        argsNext[_key2] = arguments[_key2];
      }

      return curried.apply(undefined, args.concat(argsNext));
    };
  };
  return curried;
};

// pipe :: (a -> b) -> (b -> ...) -> (... -> n)
var pipe = function pipe(fn1) {
  for (var _len3 = arguments.length, functions = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    functions[_key3 - 1] = arguments[_key3];
  }

  return function () {
    return functions.reduce(function (acc, fn) {
      return fn(acc);
    }, fn1.apply(undefined, arguments));
  };
};

// compose :: (... -> n) -> (b -> ...) -> (a -> b)
var compose = function compose() {
  for (var _len4 = arguments.length, functions = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    functions[_key4] = arguments[_key4];
  }

  return pipe.apply(undefined, _toConsumableArray(functions.reverse()));
};

// vAdd :: Vector -> Vector -> Vector
var vAdd = curry(function (v, v2) {
  return [v[0] + v2[0], v[1] + v2[1]];
});

// vAdd3 :: Vector -> Vector -> Vector -> Vector
var vAdd3 = curry(function (v, v2, v3) {
  return [v[0] + v2[0] + v3[0], v[1] + v2[1] + v3[1]];
});

// vAddAll :: [Vector] -> Vector
var vAddAll = function vAddAll(vs) {
  return vs.reduce(vAdd, [0, 0]);
};

// vSub :: Vector -> Vector -> Vector
var vSub = curry(function (v, v2) {
  return [v[0] - v2[0], v[1] - v2[1]];
});

// vSub3 :: Vector -> Vector -> Vector -> Vector
var vSub3 = curry(function (v, v2, v3) {
  return [v[0] - v2[0] - v3[0], v[1] - v2[1] - v3[1]];
});

// vSubAll :: [Vector] -> Vector
var vSubAll = function vSubAll(vs) {
  return vs.slice(1).reduce(vSub, vs.slice(0, 1)[0]);
};

// vMag :: Vector -> Number
var vMag = function vMag(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

// vNormal :: Vector -> Vector
var vNormal = function vNormal(v) {
  return [-v[1], v[0]];
};

// vScale :: Number -> Vector
var vScale = curry(function (sc, v) {
  return [v[0] * sc, v[1] * sc];
});

// vTowards :: Number -> Vector -> Vector -> Vector
var vTowards = curry(function (t, v1, v2) {
  var d = vSub(v2, v1);
  var sc = vMag(d) * t;
  return vAdd(v1, vScale(sc, vNorm(d)));
});

// vLerp :: Vector -> Vector -> Number -> Vector
var vLerp = curry(function (v1, v2, t) {
  return vTowards(t, v1, v2);
});

// vNorm :: Vector -> Vector
var vNorm = function vNorm(v) {
  var mag = vMag(v);
  return [v[0] / mag, v[1] / mag];
};

// mId :: Matrix
var mId = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);

// vCreateMatrix :: Number -> Number -> Number -> Number -> Number -> Number -> Matrix
var vCreateMatrix = function vCreateMatrix() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  return [a, c, tx, b, d, ty, 0, 0, 1];
};

// vTransform :: Matrix -> Vector -> Vector
var vTransform = curry(function (m, v) {
  return [v[0] * m[0] + v[1] * m[1] + m[2], v[0] * m[3] + v[1] * m[4] + m[5]];
});

// mCompose :: Matrix -> Matrix -> Matrix
var mCompose = curry(function (m, m2) {
  return [m[0] * m2[0] + m[1] * m2[3] + m[2] * m2[6], m[0] * m2[1] + m[1] * m2[4] + m[2] * m2[7], m[0] * m2[2] + m[1] * m2[5] + m[2] * m2[8], m[3] * m2[0] + m[4] * m2[3] + m[5] * m2[6], m[3] * m2[1] + m[4] * m2[4] + m[5] * m2[7], m[3] * m2[2] + m[4] * m2[5] + m[5] * m2[8], m[6] * m2[0] + m[7] * m2[3] + m[8] * m2[6], m[6] * m2[1] + m[7] * m2[4] + m[8] * m2[7], m[6] * m2[2] + m[7] * m2[5] + m[8] * m2[8]];
});

// mRotate :: Number -> Matrix -> Matrix
var mRotate = function mRotate(a) {
  return mCompose([Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1]);
};

// mTranslate :: Vector -> Matrix -> Matrix
var mTranslate = function mTranslate(v) {
  return mCompose([1, 0, v[0], 0, 1, v[1], 0, 0, 1]);
};

// mScale :: Vector -> Matrix -> Matrix
var mScale = function mScale(v) {
  return mCompose([v[0], 0, 0, 0, v[1], 0, 0, 0, 1]);
};

// mShear :: Vector -> Matrix -> Matrix
var mShear = function mShear(v) {
  return mCompose([1, v[0], 0, v[1], 1, 0, 0, 0, 1]);
};

// vRotate :: Number -> Vector -> Vector
var vRotate = curry(function (a, v) {
  return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
});

// vRotatePointAround :: Number -> Vector -> Vector -> Vector
var vRotatePointAround = curry(function (a, cp, v) {
  var v2 = vSub(v, cp);
  return vAdd(cp, [v2[0] * Math.cos(a) - v2[1] * Math.sin(a), v2[0] * Math.sin(a) + v2[1] * Math.cos(a)]);
});

// vMidpoint :: Vector -> Vector -> Vector
var vMidpoint = curry(function (v, v2) {
  return vScale(0.5, vAdd(v, v2));
});

// vAngle :: Number -> Vector
var vAngle = function vAngle(a) {
  return [Math.cos(a), Math.sin(a)];
};

// vAlongAngle :: Number -> Number -> Vector
var vAlongAngle = curry(function (a, r, v) {
  return compose(vAdd(v), vScale(r), vAngle)(a);
});

// vFastDist :: Vector -> Vector -> Number
var vFastDist = curry(function (v, v2) {
  return Math.pow(v2[0] - v[0], 2) + Math.pow(v2[1] - v[1], 2);
});

// vDist :: Vector -> Vector -> Number
var vDist = curry(function (v, v2) {
  return Math.hypot(v2[0] - v[0], v2[1] - v[1]);
});

// vDot :: Vector -> Vector -> Number
var vDot = curry(function (v, v2) {
  return v[0] * v2[0] + v[1] * v2[1];
});

// vDet :: Matrix -> Number
var vDet = function vDet(m) {
  return m[0] * m[4] - m[3] * m[1];
};

var vec = {
  add: vAdd,
  add3: vAdd3,
  addAll: vAddAll,
  sub: vSub,
  sub3: vSub3,
  subAll: vSubAll,
  mag: vMag,
  normal: vNormal,
  scale: vScale,
  towards: vTowards,
  lerp: vLerp,
  norm: vNorm,
  mId: mId,
  createMatrix: vCreateMatrix,
  transform: vTransform,
  mCompose: mCompose,
  mRotate: mRotate,
  mTranslate: mTranslate,
  mScale: mScale,
  mShear: mShear,
  rotate: vRotate,
  rotatePointAround: vRotatePointAround,
  midpoint: vMidpoint,
  angle: vAngle,
  alongAngle: vAlongAngle,
  fastDist: vFastDist,
  dist: vDist,
  dot: vDot,
  det: vDet
};

/* start exports */
exports.default = vec;
exports.vec = vec;
exports.vAdd = vAdd;
exports.vAdd3 = vAdd3;
exports.vAddAll = vAddAll;
exports.vSub = vSub;
exports.vSub3 = vSub3;
exports.vSubAll = vSubAll;
exports.vMag = vMag;
exports.vNormal = vNormal;
exports.vScale = vScale;
exports.vTowards = vTowards;
exports.vLerp = vLerp;
exports.vNorm = vNorm;
exports.mId = mId;
exports.vCreateMatrix = vCreateMatrix;
exports.vTransform = vTransform;
exports.mCompose = mCompose;
exports.mRotate = mRotate;
exports.mTranslate = mTranslate;
exports.mScale = mScale;
exports.mShear = mShear;
exports.vRotate = vRotate;
exports.vRotatePointAround = vRotatePointAround;
exports.vMidpoint = vMidpoint;
exports.vAngle = vAngle;
exports.vAlongAngle = vAlongAngle;
exports.vFastDist = vFastDist;
exports.vDist = vDist;
exports.vDot = vDot;
exports.vDet = vDet;
/* end exports */
},{}],"node_modules/kandinsky-js/dist/kandinsky.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.kandinsky = {})));
}(this, (function (exports) { 'use strict';

  // curry :: (a -> b -> ... -> n) -> (a -> b) -> (b -> ...) -> (... -> n)
  const curry = (fn) => {
    const curried = (...args) => {
      if (args.length >= fn.length) {
        return fn(...args);
      }
      return (...argsNext) => curried(...args, ...argsNext);
    };
    return curried;
  };

  // pipe :: (a -> b) -> (b -> ...) -> (... -> n)
  const pipe = (fn1, ...functions) =>
    (...args) =>
      functions.reduce((acc, fn) => fn(acc), fn1(...args));

  // wrapValue :: Number -> Number -> Number -> Number
  const wrapValue = curry((m, M, v) => {
    if (v < m) {
      const diff = M - v - 1;
      return wrapValue(m, M, M - diff);
    }
    if (v > M) {
      const diff = v - M - 1;
      return wrapValue(m, M, m + diff);
    }
    return v;
  });

  // wrapNorm :: Number -> Number
  const wrapNorm = wrapValue(0, 1);

  // clamp :: Number -> Number -> Number
  const clamp = curry((min, max, n) => {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  });

  // clampNorm :: Int -> Int
  const clampNorm = clamp(0, 1);

  const padHex = hexStr => hexStr.length === 1 ? `0${hexStr}` : hexStr;

  // rgb2hsl :: [Number, Number, Number] -> [Number, Number, Number]
  const rgb2hsl = ([r, g, b]) => {
    const nr = r / 255;
    const ng = g / 255;
    const nb = b / 255;

    const max = Math.max(nr, ng, nb);
    const min = Math.min(nr, ng, nb);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = 0;
      s = 0;
    } else {
      const d = max - min;
      s = (l > 0.5)
        ? d / (2 - max - min)
        : d / (max + min);

      switch(max){
        case nr:
          h = (ng - nb) / d + (ng < nb ? 6 : 0);
          break;

        case ng:
          h = (nb - nr) / d + 2;
          break;

        case nb:
          h = (nr - ng) / d + 4;
          break;
      }

      h /= 6;
    }
    return [h, s, l];
  };

  // hue2rgb :: Int -> Int -> Int -> Int
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;

    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;

    return p;
  };

  // hsl2rgb :: [Number, Number, Number] -> [Number, Number, Number]
  const hsl2rgb = ([h, s, l]) => {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = (l < 0.5)
          ? l * (1 + s)
          : l + s - l * s;

        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // hex2rgb :: String -> [Number, Number, Number]
  const hex2rgb = hex => {
    const hs = hex[0] === '#' ? hex.slice(1) : hex;
    return [
      parseInt(hs[0] + hs[1], 16),
      parseInt(hs[2] + hs[3], 16),
      parseInt(hs[4] + hs[5], 16)
    ];
  };

  // rgb2hex :: [Number, Number, Number] -> String
  const rgb2hex = rgb => rgb.reduce((hex, c) => hex + padHex(c.toString(16)), '#');

  // hex2hsl :: String -> [Number, Number, Number]
  const hex2hsl = pipe(hex2rgb, rgb2hsl);

  // hsl2hex :: [Number, Number, Number] -> String
  const hsl2hex = pipe(hsl2rgb, rgb2hex);

  // darkenRgb :: [Number, Number, Number] -> [Number, Number, Number]
  const darkenRgb = curry((amount, rgb) =>
    rgb.map(c => Math.round(Math.min(Math.max(0, c + (c * -amount)), 255)))
  );

  // lightenRgb :: [Number, Number, Number] -> [Number, Number, Number]
  const lightenRgb = curry((amount, rgb) =>
    rgb.map(c => Math.round(Math.min(Math.max(0, c + (c * amount)), 255)))
  );

  // darkenHsl :: [Number, Number, Number] -> [Number, Number, Number]
  const darkenHsl = curry((amount, [h, s, l]) => {
    return [h, s, clampNorm(l - (l * amount))];
  });

  // lightenHsl :: [Number, Number, Number] -> [Number, Number, Number]
  const lightenHsl = curry((amount, [h, s, l]) => {
    return [h, s, clampNorm(l + (l * amount))];
  });

  // lightenHex :: String -> [Number, Number, Number]
  const lightenHex = curry((amount, hex) => pipe(
    hex2rgb,
    lightenRgb(amount),
    rgb2hex
  )(hex));

  // darkenHex :: String -> [Number, Number, Number]
  const darkenHex = curry((amount, hex) => pipe(
    hex2rgb,
    darkenRgb(amount),
    rgb2hex
  )(hex));

  // lerp3 :: Int -> [Number, Number, Number] -> [Number, Number, Number] -> [Number, Number, Number]
  const lerp3 = curry((t, [a1, b1, c1], [a2, b2, c2]) => [
    a1 + t * (a2 - a1),
    b1 + t * (b2 - b1),
    c1 + t * (c2 - c1),
  ]);

  // linearGradient :: Int -> [Number, Number, Number] -> [Number, Number, Number] -> [[Number, Number, Number]]
  const linearGradient = curry((n, c1, c2) => {
    const d = (n-1 !== 0) ? n-1 : 1;
    return Array.from(Array(n), (_, i) => lerp3(i / d, c1, c2));
  });

  // gradient :: Function -> Int -> [Number, Number, Number] -> [Number, Number, Number] -> [[Number, Number, Number]]
  const gradient = curry((ease, n, c1, c2) => {
    const d = (n-1 !== 0) ? n-1 : 1;
    return Array.from(Array(n), (_, i) => lerp3(ease(i / d), c1, c2));
  });

  // multiGradient :: Int -> [[Number, Number, Number]] -> [[Number, Number, Number]]
  const multiGradient = curry((n, colors) => {
    return colors.reduce((grad, col, i) => {
      if (i === 0) return grad;
      const roundingFn = (i === colors.length-1 || i === 1)
        ? Math.ceil
        : Math.round;

      const col1 = colors[i-1];
      const col2 = col;

      return [
        ...grad,
        ...linearGradient(roundingFn(n/(colors.length - 1)), col1, col2)
      ];
    }, []);
  });

  // rGradient :: Function -> Int -> [Number, Number, Number] -> [Number, Number, Number] -> [[Int, Int, Int]]
  const rGradient = curry((ease, n, c1, c2) => gradient(ease, n, c1, c2).map(color => color.map(Math.round)));

  // rLinearGradient :: Int -> [Number, Number, Number] -> [Number, Number, Number] -> [[Int, Int, Int]]
  const rLinearGradient = curry((n, c1, c2) => linearGradient(n, c1, c2).map(color => color.map(Math.round)));

  // multiGradient :: Int -> [[Number, Number, Number]] -> [[Int, Int, Int]]
  const rMultiGradient = curry((n, colors) => multiGradient(n, colors).map(color => color.map(Math.round)));

  // complimentHsl :: Int -> [Number, Number, Number] -> [Number, Number, Number]
  const complimentHsl = curry((n, [h, s, l]) => Array.from(Array(n), (_, i) => [
    wrapNorm(h - (i/n)),
    s,
    l
  ]));

  // complimentRgb :: Int -> [Number, Number, Number] -> [Number, Number, Number]
  const complimentRgb = curry((n, rgb) => pipe(
    rgb2hsl,
    complimentHsl(n),
    rgbs => rgbs.map(hsl2rgb),
  )(rgb));

  // complimentHex :: Int -> String -> [String]
  const complimentHex = curry((n, hex) => pipe(
    hex2hsl,
    complimentHsl(n),
    hsls => hsls.map(hsl2hex),
  )(hex));

  // rgb2css :: Number -> [Number, Number, Number] -> String
  const rgb2css = curry((alpha, rgb) => {
    const a = typeof alpha === 'number' ? clampNorm(alpha) : 1;
    const [r, g, b] = rgb.map(pipe(Math.round, clamp(0, 255)));
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  });

  // hsl2css :: Number -> [Number, Number, Number] -> String
  const hsl2css = curry((alpha, [h, s, l]) => {
    const a = typeof alpha === 'number' ? clampNorm(alpha) : 1;
    const H = Math.round(h * 360);
    const S = Math.round(s * 100);
    const L = Math.round(l * 100);
    return `hsl(${H}, ${S}%, ${L}%, ${a})`;
  });

  const polute = (target = window) => {
    target.rgb2hsl = rgb2hsl;
    target.hsl2rgb = hsl2rgb;
    target.hex2rgb = hex2rgb;
    target.rgb2hex = rgb2hex;
    target.hex2hsl = hex2hsl;
    target.hsl2hex = hsl2hex;
    target.darkenRgb = darkenRgb;
    target.lightenRgb = lightenRgb;
    target.darkenHsl = darkenHsl;
    target.lightenHsl = lightenHsl;
    target.lightenHex = lightenHex;
    target.darkenHex = darkenHex;
    target.lerp3 = lerp3;
    target.linearGradient = linearGradient;
    target.gradient = gradient;
    target.multiGradient = multiGradient;
    target.rGradient = rGradient;
    target.rLinearGradient = rLinearGradient;
    target.rMultiGradient = rMultiGradient;
    target.complimentHsl = complimentHsl;
    target.complimentRgb = complimentRgb;
    target.complimentHex = complimentHex;
    target.rgb2css = rgb2css;
    target.hsl2css = hsl2css;
  };

  exports.polute = polute;
  exports.rgb2hsl = rgb2hsl;
  exports.hsl2rgb = hsl2rgb;
  exports.hex2rgb = hex2rgb;
  exports.rgb2hex = rgb2hex;
  exports.hex2hsl = hex2hsl;
  exports.hsl2hex = hsl2hex;
  exports.darkenRgb = darkenRgb;
  exports.lightenRgb = lightenRgb;
  exports.darkenHsl = darkenHsl;
  exports.lightenHsl = lightenHsl;
  exports.lightenHex = lightenHex;
  exports.darkenHex = darkenHex;
  exports.lerp3 = lerp3;
  exports.linearGradient = linearGradient;
  exports.gradient = gradient;
  exports.multiGradient = multiGradient;
  exports.rGradient = rGradient;
  exports.rLinearGradient = rLinearGradient;
  exports.rMultiGradient = rMultiGradient;
  exports.complimentHsl = complimentHsl;
  exports.complimentRgb = complimentRgb;
  exports.complimentHex = complimentHex;
  exports.rgb2css = rgb2css;
  exports.hsl2css = hsl2css;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],"node_modules/asc-engine/src/constants.js":[function(require,module,exports) {
const LAYERS = Object.freeze({
  HUD: 0,
  BG : 1,
  MG : 2,
  FG : 3
});

module.exports = Object.freeze({
  LAYERS
});

},{}],"node_modules/asc-engine/src/util.js":[function(require,module,exports) {
const posToGridIndex = ([x, y], gw) => {
  return x + gw * y;
};

const posFromGridIndex = (i, gw) => [(i % gw)|0, (i / gw)|0];

const pick = (props, obj) => {
  const out = {};
  for (const p of props) {
    out[p] = obj[p];
  }
  return out;
};

const fromify = cons => (...args) => new cons(...args);

module.exports = {
  posToGridIndex,
  posFromGridIndex,
  pick,
  fromify
};

},{}],"node_modules/asc-engine/src/GameState.js":[function(require,module,exports) {
class GameState {
  constructor() {
    this.state = {};
  }

  load(state) {
    this.state = state;
  }

  serialize() {
    return this.state;
  }
}

module.exports = GameState;

},{}],"node_modules/asc-engine/src/Input.js":[function(require,module,exports) {
class Input {
  constructor() {
    this.keyStates = {};
    const keydownHandler = e => {
      if (!this.keyStates[e.key]) {
        this.keyStates[e.key] = {
          state: true,
          downThisFrame: true,
          upThisFrame: false
        };
        return;
      }

      this.keyStates[e.key].state = true;
      this.keyStates[e.key].downThisFrame = true;
      this.keyStates[e.key].upThisFrame = false;
    };

    const keyupHandler = e => {
      if (!this.keyStates[e.key]) {
        this.keyStates[e.key] = {
          state: false,
          downThisFrame: false,
          upThisFrame: true
        };
        return;
      }

      this.keyStates[e.key].state = false;
      this.keyStates[e.key].downThisFrame = false;
      this.keyStates[e.key].upThisFrame = true;
    };

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    this.cleanup = () => {
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
    };
  }

  keyIsDown(key) {
    if (!(key in this.keyStates)) {
      this.keyStates[key] = {
        state: false,
        downThisFrame: false,
        upThisFrame: false
      };
      return false;
    }
    return this.keyStates[key].state;
  }

  keyPressed(key) {
    return this.keyIsDown(key) && this.keyStates.downThisFrame;
  }

  keyReleased(key) {
    return !this.keyIsDown(key) && this.keyStates.upThisFrame;
  }

  update() {
    Object.values(this.keyStates).forEach(ks => {
      ks.downThisFrame = false;
      ks.upThisFrame = false;
    });
  }
}

module.exports = Input;
},{}],"node_modules/asc-engine/src/PubSub.js":[function(require,module,exports) {
class PubSub {
  constructor() {
    this.topics = {};
    this._nextId = 0;
  }

  nextId() {
    return this._nextId++;
  }

  subscribe(topic, handler) {
    if (!(topic in this.topics)) {
      this.topics[topic] = {};
    }

    const fixedId = this.nextId();
    this.topics[topic][fixedId] = handler;

    return () => {
      delete this.topics[topic][fixedId];
    }
  }

  publish(topic, data) {
    if (topic in this.topics) {
      Object.values(this.topics[topic]).forEach(fn => fn(data));
    }
  }
}

module.exports = PubSub;

},{}],"node_modules/asc-engine/src/Renderer.js":[function(require,module,exports) {
const {pick} = require('./util');

const FONT = `'Source Code Pro', monospace`;

class Renderer {
  constructor(canvas, canvasWidth, canvasHeight) {
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    this._styleStack = [];
    this.ctx = canvas.getContext('2d');
    this.ctx.textBaseline = 'top';

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.setTileSize(20);

    this.buffers = [ [], [], [], [] ];
  }

  commit() {
    this.pushStyle();
    for (let i = 0; i < this.buffers.length; i++) {
      while (this.buffers[i].length) {
        const {pos, color, char, draw} = this.buffers[i].pop();
        if (draw) {
          this.ctx.fillStyle = color;
          this.ctx.fillText(char, pos[0], pos[1]);
        }
      }
    }
    this.popStyle();
  }

  pushStyle() {
    const props = ['fillStyle', 'strokeStyle', 'font', 'filter', 'lineWidth'];
    this._styleStack.push(pick(props, this.ctx));
  }

  popStyle() {
    if (this._styleStack.length > 0) {
      const entries = Object.entries(this._styleStack.pop());
      for (const [key, value] of entries) {
        this.ctx[key] = value;
      }
    } else {
      throw new RangeError(`No styles to pop in the stack`);
    }
  }

  setTileSize(size) {
    if (size !== this.size) {
      this.size = size;
      this.ctx.font = `${this.size}px ${FONT}`;
    }
  }

  clearBackground(col) {
    this.pushStyle();
    this.ctx.fillStyle = col;
    this.ctx.beginPath()
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fill();
    this.ctx.closePath();
    this.popStyle();
  }

  drawTile({char, color, zPos}, pos) {
    this.buffers[zPos].unshift({
      pos,
      char,
      color,
      draw: true
    });
  }

  drawRect(fill, stroke, [x, y], w, h, strokeWeight = 1) {
    this.pushStyle();
    this.ctx.fillStyle = fill;
    this.ctx.strokeStyle = stroke;
    this.ctx.lineWidth = strokeWeight;

    this.ctx.fillRect(x, y, w, h);
    this.ctx.rect(x, y, w, h);
    this.ctx.stroke();
    this.popStyle();
  }

  drawCircle(fill, stroke, [x, y], r, strokeWeight = 1) {
    this.pushStyle();
    this.ctx.fillStyle = fill;
    this.ctx.strokeStyle = stroke;
    this.ctx.lineWidth = strokeWeight;

    this.ctx.beginPath();
    this.ctx.ellipse(x, y, r, r, 0, 0, Math.PI*2, false);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();

    this.popStyle();
  }
}

module.exports = Renderer;

},{"./util":"node_modules/asc-engine/src/util.js"}],"node_modules/asc-engine/src/Game.js":[function(require,module,exports) {
const {vAdd, vScale} = require('vec-la-fp');

const GameState = require('./GameState');
const Input = require('./Input');
const PubSub = require('./PubSub');
const Renderer = require('./Renderer');
const {posToGridIndex} = require('./util');

class Game {
  constructor(canvasId, canvasWidth, canvasHeight) {
    const events = new PubSub();
    this.subscribe = events.subscribe.bind(events);
    this.publish = events.publish.bind(events);

    const canvas = document.getElementById(canvasId);
    this.renderer = new Renderer(canvas, canvasWidth, canvasHeight);

    this.area = null;

    this.input = new Input();
    this.state = new GameState();

    this.deltaTime = 0;
    this.lastTime = Date.now();
    this.frames = 0;
    this.boundDraw = this.draw.bind(this);

    this.onUpdate = () => {};
    this.onDraw = () => {};
  }

  createScreenRegion(pos, getTileSize) {
    return tileXY => vAdd(vScale(getTileSize(), tileXY), pos);
  }

  setCurrentArea(area) {
    this.area = area;
    this.renderer.setTileSize(area.size);
  }

  getTile(pos) {
    const [x, y] = pos;
    const {width:w, height:h} = this.area;
    if (x >= w || y >= h || x < 0 || y < 0) return null;
    const index = posToGridIndex(pos, w)
    return this.area.grid[index];
  }

  start() {
    requestAnimationFrame(this.boundDraw);
  }

  draw() {
    this.deltaTime += Date.now() - this.lastTime;
    if (this.deltaTime >= 16) {
      this.deltaTime = 0;
      this.frames++;

      this.publish('@@FRAME_BEFORE_UPDATE');
      this.onUpdate();

      this.publish('@@FRAME_BEFORE_DRAW');
      this.onDraw();

      this.publish('@@FRAME_BEFORE_RENDER_COMMIT');
      this.renderer.commit();

      // Reset the frame values for input
      this.input.update();

      this.publish('@@FRAME_COMPLETE');
    }

    requestAnimationFrame(this.boundDraw);
  }
}

module.exports = Game;

},{"vec-la-fp":"node_modules/vec-la-fp/dist/vec.module.js","./GameState":"node_modules/asc-engine/src/GameState.js","./Input":"node_modules/asc-engine/src/Input.js","./PubSub":"node_modules/asc-engine/src/PubSub.js","./Renderer":"node_modules/asc-engine/src/Renderer.js","./util":"node_modules/asc-engine/src/util.js"}],"node_modules/asc-engine/src/Area.js":[function(require,module,exports) {
const {posToGridIndex, fromify} = require('./util');

class Area {
  constructor(width, height, offset, size) {
    this.width = width;
    this.height = height;
    this.offset = offset;
    this.size = size;

    this.grid = [];

    this.actors = [];

    this.items = [];

    this.handlers = {};
  }

  setGrid(grid) {
    this.grid = grid;
  }

  setGridAtPos(tile, pos) {
    const i = posToGridIndex(pos, this.width);
    if (i >= this.grid.length) {
      throw new RangeError(`Can't set out of range index ${i} (${x}, ${y}) on grid with only ${this.grid.length} tiles`);
    }
    this.grid[i] = tile;
  }
}

Area.from = fromify(Area);

module.exports = Area;

},{"./util":"node_modules/asc-engine/src/util.js"}],"node_modules/asc-engine/src/Tile.js":[function(require,module,exports) {
const {fromify} = require('./util');
const {LAYERS} = require('./constants');

class Tile {
  constructor(char, color, zPos = LAYERS.BG) {
    this.char = char;
    this.color = color;
    this.zPos = zPos;
    this.properties = [];
  }

  hasProperty(prop) {
    return this.properties.includes(prop);
  }

  addProperty(prop) {
    this.properties.push(prop);
    return this;
  }
}

Tile.from = fromify(Tile);

module.exports = Tile;

},{"./util":"node_modules/asc-engine/src/util.js","./constants":"node_modules/asc-engine/src/constants.js"}],"index.js":[function(require,module,exports) {
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('vec-la-fp'),
    vAdd = _require.vAdd,
    vDist = _require.vDist;

var _require2 = require('kandinsky-js'),
    darkenHex = _require2.darkenHex;

var _require3 = require('asc-engine/src/constants'),
    LAYERS = _require3.LAYERS;

var _require4 = require('asc-engine/src/util'),
    posFromGridIndex = _require4.posFromGridIndex;

var Game = require('asc-engine/src/Game');

var Area = require('asc-engine/src/Area');

var Tile = require('asc-engine/src/Tile');

var vEqual = function vEqual(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 2),
      x = _ref3[0],
      y = _ref3[1];

  var _ref4 = _slicedToArray(_ref2, 2),
      x2 = _ref4[0],
      y2 = _ref4[1];

  return x === x2 && y === y2;
};

var game = new Game('main', 1000, 700);
var toGameArea = game.createScreenRegion([12 * 20, 2 * 20], function () {
  return game.area.size;
});
var toTitleArea = game.createScreenRegion([0, 0], function () {
  return game.area.size;
});
var toScoreArea = game.createScreenRegion([40 * 20, 0], function () {
  return game.area.size;
});
var snake = {
  tile: new Tile('@', '#ff0000', LAYERS.FG),
  body: [[13, 17]],
  dir: [0, -1],
  getHead: function getHead() {
    return snake.body[0];
  },
  reset: function reset() {
    return snake.body = [[13, 17]];
  }
};
var food = {
  tile: new Tile('*', '#0f0'),
  pos: [1 + Math.floor(Math.random() * 24), 1 + Math.floor(Math.random() * 31)],
  next: function next() {
    return food.pos = [1 + Math.floor(Math.random() * 24), 1 + Math.floor(Math.random() * 31)];
  }
};
var title = new Tile('S . N . A . K . E', '#f11', LAYERS.HUD);
var scoreTile = new Tile('Score: 0', '#0f0', LAYERS.HUD);
var score = 0;
var speed = 5;
var FRAME_TIME = 16.6;
var lastTime = Date.now();
var currentTime = lastTime;
var UP = [0, -1];
var DOWN = [0, 1];
var LEFT = [-1, 0];
var RIGHT = [1, 0];

game.onUpdate = function () {
  if (game.input.keyIsDown('ArrowUp') && !vEqual(snake.dir, DOWN)) {
    snake.dir = UP;
  } else if (game.input.keyIsDown('ArrowDown') && !vEqual(snake.dir, UP)) {
    snake.dir = DOWN;
  } else if (game.input.keyIsDown('ArrowLeft') && !vEqual(snake.dir, RIGHT)) {
    snake.dir = LEFT;
  } else if (game.input.keyIsDown('ArrowRight') && !vEqual(snake.dir, LEFT)) {
    snake.dir = RIGHT;
  }

  currentTime = Date.now();

  if (currentTime - lastTime >= FRAME_TIME * speed) {
    lastTime = currentTime;
    var head = snake.getHead();
    var targetPos = vAdd(head, snake.dir);
    var targetTile = game.getTile(targetPos);
    var hit = targetTile.properties.includes('SOLID') || snake.body.slice(1).some(function (p) {
      return vEqual(targetPos, p);
    });

    if (!hit) {
      for (var i = 0; i < snake.body.length; i++) {
        var oldPos = snake.body[i];
        snake.body[i] = targetPos;
        targetPos = oldPos;
      }

      head = snake.getHead();

      if (vEqual(head, food.pos)) {
        food.next();
        snake.body.push(head);
        score += 10;
        scoreTile.char = "Score: ".concat(score);
      }
    } else {
      snake.reset();
      score = 0;
      scoreTile.char = 'Score: 0';
    }
  }
};

game.onDraw = function () {
  var _this = this;

  this.renderer.clearBackground('#000');
  this.renderer.setTileSize(this.area.size);
  this.area.grid.forEach(function (t, i) {
    var pos = toGameArea(posFromGridIndex(i, _this.area.width, _this.area.height));

    _this.renderer.drawTile(t, pos);
  });
  snake.body.forEach(function (p, i) {
    var pc = Math.max(0, i / snake.body.length - 0.2);

    var tile = _objectSpread({}, snake.tile);

    tile.color = darkenHex(pc, tile.color);
    game.renderer.drawTile(tile, toGameArea(p));
  });
  game.renderer.drawTile(food.tile, toGameArea(food.pos));
  game.renderer.drawTile(title, toTitleArea([1, 1]));
  game.renderer.drawTile(scoreTile, toScoreArea([0, 1]));
};

var renderEffects = function renderEffects() {
  var pos = toGameArea(snake.getHead());
  var s = Math.ceil(Math.pow(snake.body.length, 0.5));
  game.renderer.buffers[LAYERS.BG].forEach(function (cell) {
    if (vDist(cell.pos, pos) > s * game.area.size) {
      cell.color = darkenHex(cell.char === '.' ? 0.75 : 0.35, cell.color);
    }
  });
};

var S = Tile.from('#', '#999999');
S.addProperty('SOLID');
var F = Tile.from('.', '#aaaaaa');
var tiles = [S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S];
var gameArea = new Area(26, 33, [0, 0], 20);
gameArea.setGrid(tiles);
game.setCurrentArea(gameArea);
game.start();
game.subscribe('@@FRAME_BEFORE_RENDER_COMMIT', renderEffects);
},{"vec-la-fp":"node_modules/vec-la-fp/dist/vec.module.js","kandinsky-js":"node_modules/kandinsky-js/dist/kandinsky.js","asc-engine/src/constants":"node_modules/asc-engine/src/constants.js","asc-engine/src/util":"node_modules/asc-engine/src/util.js","asc-engine/src/Game":"node_modules/asc-engine/src/Game.js","asc-engine/src/Area":"node_modules/asc-engine/src/Area.js","asc-engine/src/Tile":"node_modules/asc-engine/src/Tile.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56117" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/snake.e31bb0bc.map