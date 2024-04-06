var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/@angular/compiler/fesm2022/compiler.mjs
var _SELECTOR_REGEXP = new RegExp(
  `(\\:not\\()|(([\\.\\#]?)[-\\w]+)|(?:\\[([-.\\w*\\\\$]+)(?:=(["']?)([^\\]"']*)\\5)?\\])|(\\))|(\\s*,\\s*)`,
  // 8: ","
  "g"
);
var CssSelector = class _CssSelector {
  constructor() {
    this.element = null;
    this.classNames = [];
    this.attrs = [];
    this.notSelectors = [];
  }
  static parse(selector) {
    const results = [];
    const _addResult = (res, cssSel) => {
      if (cssSel.notSelectors.length > 0 && !cssSel.element && cssSel.classNames.length == 0 && cssSel.attrs.length == 0) {
        cssSel.element = "*";
      }
      res.push(cssSel);
    };
    let cssSelector = new _CssSelector();
    let match;
    let current = cssSelector;
    let inNot = false;
    _SELECTOR_REGEXP.lastIndex = 0;
    while (match = _SELECTOR_REGEXP.exec(selector)) {
      if (match[
        1
        /* SelectorRegexp.NOT */
      ]) {
        if (inNot) {
          throw new Error("Nesting :not in a selector is not allowed");
        }
        inNot = true;
        current = new _CssSelector();
        cssSelector.notSelectors.push(current);
      }
      const tag = match[
        2
        /* SelectorRegexp.TAG */
      ];
      if (tag) {
        const prefix = match[
          3
          /* SelectorRegexp.PREFIX */
        ];
        if (prefix === "#") {
          current.addAttribute("id", tag.slice(1));
        } else if (prefix === ".") {
          current.addClassName(tag.slice(1));
        } else {
          current.setElement(tag);
        }
      }
      const attribute2 = match[
        4
        /* SelectorRegexp.ATTRIBUTE */
      ];
      if (attribute2) {
        current.addAttribute(current.unescapeAttribute(attribute2), match[
          6
          /* SelectorRegexp.ATTRIBUTE_VALUE */
        ]);
      }
      if (match[
        7
        /* SelectorRegexp.NOT_END */
      ]) {
        inNot = false;
        current = cssSelector;
      }
      if (match[
        8
        /* SelectorRegexp.SEPARATOR */
      ]) {
        if (inNot) {
          throw new Error("Multiple selectors in :not are not supported");
        }
        _addResult(results, cssSelector);
        cssSelector = current = new _CssSelector();
      }
    }
    _addResult(results, cssSelector);
    return results;
  }
  /**
   * Unescape `\$` sequences from the CSS attribute selector.
   *
   * This is needed because `$` can have a special meaning in CSS selectors,
   * but we might want to match an attribute that contains `$`.
   * [MDN web link for more
   * info](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).
   * @param attr the attribute to unescape.
   * @returns the unescaped string.
   */
  unescapeAttribute(attr) {
    let result = "";
    let escaping = false;
    for (let i = 0; i < attr.length; i++) {
      const char = attr.charAt(i);
      if (char === "\\") {
        escaping = true;
        continue;
      }
      if (char === "$" && !escaping) {
        throw new Error(`Error in attribute selector "${attr}". Unescaped "$" is not supported. Please escape with "\\$".`);
      }
      escaping = false;
      result += char;
    }
    return result;
  }
  /**
   * Escape `$` sequences from the CSS attribute selector.
   *
   * This is needed because `$` can have a special meaning in CSS selectors,
   * with this method we are escaping `$` with `\$'.
   * [MDN web link for more
   * info](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).
   * @param attr the attribute to escape.
   * @returns the escaped string.
   */
  escapeAttribute(attr) {
    return attr.replace(/\\/g, "\\\\").replace(/\$/g, "\\$");
  }
  isElementSelector() {
    return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 && this.notSelectors.length === 0;
  }
  hasElementSelector() {
    return !!this.element;
  }
  setElement(element2 = null) {
    this.element = element2;
  }
  getAttrs() {
    const result = [];
    if (this.classNames.length > 0) {
      result.push("class", this.classNames.join(" "));
    }
    return result.concat(this.attrs);
  }
  addAttribute(name, value = "") {
    this.attrs.push(name, value && value.toLowerCase() || "");
  }
  addClassName(name) {
    this.classNames.push(name.toLowerCase());
  }
  toString() {
    let res = this.element || "";
    if (this.classNames) {
      this.classNames.forEach((klass) => res += `.${klass}`);
    }
    if (this.attrs) {
      for (let i = 0; i < this.attrs.length; i += 2) {
        const name = this.escapeAttribute(this.attrs[i]);
        const value = this.attrs[i + 1];
        res += `[${name}${value ? "=" + value : ""}]`;
      }
    }
    this.notSelectors.forEach((notSelector) => res += `:not(${notSelector})`);
    return res;
  }
};
var ViewEncapsulation;
(function(ViewEncapsulation2) {
  ViewEncapsulation2[ViewEncapsulation2["Emulated"] = 0] = "Emulated";
  ViewEncapsulation2[ViewEncapsulation2["None"] = 2] = "None";
  ViewEncapsulation2[ViewEncapsulation2["ShadowDom"] = 3] = "ShadowDom";
})(ViewEncapsulation || (ViewEncapsulation = {}));
var ChangeDetectionStrategy;
(function(ChangeDetectionStrategy2) {
  ChangeDetectionStrategy2[ChangeDetectionStrategy2["OnPush"] = 0] = "OnPush";
  ChangeDetectionStrategy2[ChangeDetectionStrategy2["Default"] = 1] = "Default";
})(ChangeDetectionStrategy || (ChangeDetectionStrategy = {}));
var CUSTOM_ELEMENTS_SCHEMA = {
  name: "custom-elements"
};
var NO_ERRORS_SCHEMA = {
  name: "no-errors-schema"
};
var SecurityContext;
(function(SecurityContext2) {
  SecurityContext2[SecurityContext2["NONE"] = 0] = "NONE";
  SecurityContext2[SecurityContext2["HTML"] = 1] = "HTML";
  SecurityContext2[SecurityContext2["STYLE"] = 2] = "STYLE";
  SecurityContext2[SecurityContext2["SCRIPT"] = 3] = "SCRIPT";
  SecurityContext2[SecurityContext2["URL"] = 4] = "URL";
  SecurityContext2[SecurityContext2["RESOURCE_URL"] = 5] = "RESOURCE_URL";
})(SecurityContext || (SecurityContext = {}));
var MissingTranslationStrategy;
(function(MissingTranslationStrategy2) {
  MissingTranslationStrategy2[MissingTranslationStrategy2["Error"] = 0] = "Error";
  MissingTranslationStrategy2[MissingTranslationStrategy2["Warning"] = 1] = "Warning";
  MissingTranslationStrategy2[MissingTranslationStrategy2["Ignore"] = 2] = "Ignore";
})(MissingTranslationStrategy || (MissingTranslationStrategy = {}));
function parserSelectorToSimpleSelector(selector) {
  const classes = selector.classNames && selector.classNames.length ? [8, ...selector.classNames] : [];
  const elementName = selector.element && selector.element !== "*" ? selector.element : "";
  return [elementName, ...selector.attrs, ...classes];
}
function parserSelectorToNegativeSelector(selector) {
  const classes = selector.classNames && selector.classNames.length ? [8, ...selector.classNames] : [];
  if (selector.element) {
    return [
      1 | 4,
      selector.element,
      ...selector.attrs,
      ...classes
    ];
  } else if (selector.attrs.length) {
    return [1 | 2, ...selector.attrs, ...classes];
  } else {
    return selector.classNames && selector.classNames.length ? [1 | 8, ...selector.classNames] : [];
  }
}
function parserSelectorToR3Selector(selector) {
  const positive = parserSelectorToSimpleSelector(selector);
  const negative = selector.notSelectors && selector.notSelectors.length ? selector.notSelectors.map((notSelector) => parserSelectorToNegativeSelector(notSelector)) : [];
  return positive.concat(...negative);
}
function parseSelectorToR3Selector(selector) {
  return selector ? CssSelector.parse(selector).map(parserSelectorToR3Selector) : [];
}
var BigInteger = class _BigInteger {
  static zero() {
    return new _BigInteger([0]);
  }
  static one() {
    return new _BigInteger([1]);
  }
  /**
   * Creates a big integer using its individual digits in little endian storage.
   */
  constructor(digits) {
    this.digits = digits;
  }
  /**
   * Creates a clone of this instance.
   */
  clone() {
    return new _BigInteger(this.digits.slice());
  }
  /**
   * Returns a new big integer with the sum of `this` and `other` as its value. This does not mutate
   * `this` but instead returns a new instance, unlike `addToSelf`.
   */
  add(other) {
    const result = this.clone();
    result.addToSelf(other);
    return result;
  }
  /**
   * Adds `other` to the instance itself, thereby mutating its value.
   */
  addToSelf(other) {
    const maxNrOfDigits = Math.max(this.digits.length, other.digits.length);
    let carry = 0;
    for (let i = 0; i < maxNrOfDigits; i++) {
      let digitSum = carry;
      if (i < this.digits.length) {
        digitSum += this.digits[i];
      }
      if (i < other.digits.length) {
        digitSum += other.digits[i];
      }
      if (digitSum >= 10) {
        this.digits[i] = digitSum - 10;
        carry = 1;
      } else {
        this.digits[i] = digitSum;
        carry = 0;
      }
    }
    if (carry > 0) {
      this.digits[maxNrOfDigits] = 1;
    }
  }
  /**
   * Builds the decimal string representation of the big integer. As this is stored in
   * little endian, the digits are concatenated in reverse order.
   */
  toString() {
    let res = "";
    for (let i = this.digits.length - 1; i >= 0; i--) {
      res += this.digits[i];
    }
    return res;
  }
};
var BigIntForMultiplication = class {
  constructor(value) {
    this.powerOfTwos = [value];
  }
  /**
   * Returns the big integer itself.
   */
  getValue() {
    return this.powerOfTwos[0];
  }
  /**
   * Computes the value for `num * b`, where `num` is a JS number and `b` is a big integer. The
   * value for `b` is represented by a storage model that is optimized for this computation.
   *
   * This operation is implemented in N(log2(num)) by continuous halving of the number, where the
   * least-significant bit (LSB) is tested in each iteration. If the bit is set, the bit's index is
   * used as exponent into the power-of-two multiplication of `b`.
   *
   * As an example, consider the multiplication num=42, b=1337. In binary 42 is 0b00101010 and the
   * algorithm unrolls into the following iterations:
   *
   *  Iteration | num        | LSB  | b * 2^iter | Add? | product
   * -----------|------------|------|------------|------|--------
   *  0         | 0b00101010 | 0    | 1337       | No   | 0
   *  1         | 0b00010101 | 1    | 2674       | Yes  | 2674
   *  2         | 0b00001010 | 0    | 5348       | No   | 2674
   *  3         | 0b00000101 | 1    | 10696      | Yes  | 13370
   *  4         | 0b00000010 | 0    | 21392      | No   | 13370
   *  5         | 0b00000001 | 1    | 42784      | Yes  | 56154
   *  6         | 0b00000000 | 0    | 85568      | No   | 56154
   *
   * The computed product of 56154 is indeed the correct result.
   *
   * The `BigIntForMultiplication` representation for a big integer provides memoized access to the
   * power-of-two values to reduce the workload in computing those values.
   */
  multiplyBy(num) {
    const product = BigInteger.zero();
    this.multiplyByAndAddTo(num, product);
    return product;
  }
  /**
   * See `multiplyBy()` for details. This function allows for the computed product to be added
   * directly to the provided result big integer.
   */
  multiplyByAndAddTo(num, result) {
    for (let exponent = 0; num !== 0; num = num >>> 1, exponent++) {
      if (num & 1) {
        const value = this.getMultipliedByPowerOfTwo(exponent);
        result.addToSelf(value);
      }
    }
  }
  /**
   * Computes and memoizes the big integer value for `this.number * 2^exponent`.
   */
  getMultipliedByPowerOfTwo(exponent) {
    for (let i = this.powerOfTwos.length; i <= exponent; i++) {
      const previousPower = this.powerOfTwos[i - 1];
      this.powerOfTwos[i] = previousPower.add(previousPower);
    }
    return this.powerOfTwos[exponent];
  }
};
var BigIntExponentiation = class {
  constructor(base) {
    this.base = base;
    this.exponents = [new BigIntForMultiplication(BigInteger.one())];
  }
  /**
   * Compute the value for `this.base^exponent`, resulting in a big integer that is optimized for
   * further multiplication operations.
   */
  toThePowerOf(exponent) {
    for (let i = this.exponents.length; i <= exponent; i++) {
      const value = this.exponents[i - 1].multiplyBy(this.base);
      this.exponents[i] = new BigIntForMultiplication(value);
    }
    return this.exponents[exponent];
  }
};
var textEncoder;
function computeDigest(message) {
  return sha1(serializeNodes(message.nodes).join("") + `[${message.meaning}]`);
}
function decimalDigest(message) {
  return message.id || computeDecimalDigest(message);
}
function computeDecimalDigest(message) {
  const visitor = new _SerializerIgnoreIcuExpVisitor();
  const parts = message.nodes.map((a) => a.visit(visitor, null));
  return computeMsgId(parts.join(""), message.meaning);
}
var _SerializerVisitor = class {
  visitText(text2, context) {
    return text2.value;
  }
  visitContainer(container, context) {
    return `[${container.children.map((child) => child.visit(this)).join(", ")}]`;
  }
  visitIcu(icu, context) {
    const strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
    return `{${icu.expression}, ${icu.type}, ${strCases.join(", ")}}`;
  }
  visitTagPlaceholder(ph, context) {
    return ph.isVoid ? `<ph tag name="${ph.startName}"/>` : `<ph tag name="${ph.startName}">${ph.children.map((child) => child.visit(this)).join(", ")}</ph name="${ph.closeName}">`;
  }
  visitPlaceholder(ph, context) {
    return ph.value ? `<ph name="${ph.name}">${ph.value}</ph>` : `<ph name="${ph.name}"/>`;
  }
  visitIcuPlaceholder(ph, context) {
    return `<ph icu name="${ph.name}">${ph.value.visit(this)}</ph>`;
  }
};
var serializerVisitor$1 = new _SerializerVisitor();
function serializeNodes(nodes) {
  return nodes.map((a) => a.visit(serializerVisitor$1, null));
}
var _SerializerIgnoreIcuExpVisitor = class extends _SerializerVisitor {
  visitIcu(icu, context) {
    let strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
    return `{${icu.type}, ${strCases.join(", ")}}`;
  }
};
function sha1(str) {
  textEncoder ??= new TextEncoder();
  const utf8 = [...textEncoder.encode(str)];
  const words32 = bytesToWords32(utf8, Endian.Big);
  const len = utf8.length * 8;
  const w = new Uint32Array(80);
  let a = 1732584193, b = 4023233417, c = 2562383102, d = 271733878, e = 3285377520;
  words32[len >> 5] |= 128 << 24 - len % 32;
  words32[(len + 64 >> 9 << 4) + 15] = len;
  for (let i = 0; i < words32.length; i += 16) {
    const h0 = a, h1 = b, h2 = c, h3 = d, h4 = e;
    for (let j = 0; j < 80; j++) {
      if (j < 16) {
        w[j] = words32[i + j];
      } else {
        w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      }
      const fkVal = fk(j, b, c, d);
      const f = fkVal[0];
      const k = fkVal[1];
      const temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
      e = d;
      d = c;
      c = rol32(b, 30);
      b = a;
      a = temp;
    }
    a = add32(a, h0);
    b = add32(b, h1);
    c = add32(c, h2);
    d = add32(d, h3);
    e = add32(e, h4);
  }
  return toHexU32(a) + toHexU32(b) + toHexU32(c) + toHexU32(d) + toHexU32(e);
}
function toHexU32(value) {
  return (value >>> 0).toString(16).padStart(8, "0");
}
function fk(index, b, c, d) {
  if (index < 20) {
    return [b & c | ~b & d, 1518500249];
  }
  if (index < 40) {
    return [b ^ c ^ d, 1859775393];
  }
  if (index < 60) {
    return [b & c | b & d | c & d, 2400959708];
  }
  return [b ^ c ^ d, 3395469782];
}
function fingerprint(str) {
  textEncoder ??= new TextEncoder();
  const utf8 = textEncoder.encode(str);
  const view = new DataView(utf8.buffer, utf8.byteOffset, utf8.byteLength);
  let hi = hash32(view, utf8.length, 0);
  let lo = hash32(view, utf8.length, 102072);
  if (hi == 0 && (lo == 0 || lo == 1)) {
    hi = hi ^ 319790063;
    lo = lo ^ -1801410264;
  }
  return [hi, lo];
}
function computeMsgId(msg, meaning = "") {
  let msgFingerprint = fingerprint(msg);
  if (meaning) {
    const meaningFingerprint = fingerprint(meaning);
    msgFingerprint = add64(rol64(msgFingerprint, 1), meaningFingerprint);
  }
  const hi = msgFingerprint[0];
  const lo = msgFingerprint[1];
  return wordsToDecimalString(hi & 2147483647, lo);
}
function hash32(view, length, c) {
  let a = 2654435769, b = 2654435769;
  let index = 0;
  const end = length - 12;
  for (; index <= end; index += 12) {
    a += view.getUint32(index, true);
    b += view.getUint32(index + 4, true);
    c += view.getUint32(index + 8, true);
    const res = mix(a, b, c);
    a = res[0], b = res[1], c = res[2];
  }
  const remainder = length - index;
  c += length;
  if (remainder >= 4) {
    a += view.getUint32(index, true);
    index += 4;
    if (remainder >= 8) {
      b += view.getUint32(index, true);
      index += 4;
      if (remainder >= 9) {
        c += view.getUint8(index++) << 8;
      }
      if (remainder >= 10) {
        c += view.getUint8(index++) << 16;
      }
      if (remainder === 11) {
        c += view.getUint8(index++) << 24;
      }
    } else {
      if (remainder >= 5) {
        b += view.getUint8(index++);
      }
      if (remainder >= 6) {
        b += view.getUint8(index++) << 8;
      }
      if (remainder === 7) {
        b += view.getUint8(index++) << 16;
      }
    }
  } else {
    if (remainder >= 1) {
      a += view.getUint8(index++);
    }
    if (remainder >= 2) {
      a += view.getUint8(index++) << 8;
    }
    if (remainder === 3) {
      a += view.getUint8(index++) << 16;
    }
  }
  return mix(a, b, c)[2];
}
function mix(a, b, c) {
  a -= b;
  a -= c;
  a ^= c >>> 13;
  b -= c;
  b -= a;
  b ^= a << 8;
  c -= a;
  c -= b;
  c ^= b >>> 13;
  a -= b;
  a -= c;
  a ^= c >>> 12;
  b -= c;
  b -= a;
  b ^= a << 16;
  c -= a;
  c -= b;
  c ^= b >>> 5;
  a -= b;
  a -= c;
  a ^= c >>> 3;
  b -= c;
  b -= a;
  b ^= a << 10;
  c -= a;
  c -= b;
  c ^= b >>> 15;
  return [a, b, c];
}
var Endian;
(function(Endian2) {
  Endian2[Endian2["Little"] = 0] = "Little";
  Endian2[Endian2["Big"] = 1] = "Big";
})(Endian || (Endian = {}));
function add32(a, b) {
  return add32to64(a, b)[1];
}
function add32to64(a, b) {
  const low = (a & 65535) + (b & 65535);
  const high = (a >>> 16) + (b >>> 16) + (low >>> 16);
  return [high >>> 16, high << 16 | low & 65535];
}
function add64(a, b) {
  const ah = a[0], al = a[1];
  const bh = b[0], bl = b[1];
  const result = add32to64(al, bl);
  const carry = result[0];
  const l = result[1];
  const h = add32(add32(ah, bh), carry);
  return [h, l];
}
function rol32(a, count) {
  return a << count | a >>> 32 - count;
}
function rol64(num, count) {
  const hi = num[0], lo = num[1];
  const h = hi << count | lo >>> 32 - count;
  const l = lo << count | hi >>> 32 - count;
  return [h, l];
}
function bytesToWords32(bytes, endian) {
  const size = bytes.length + 3 >>> 2;
  const words32 = [];
  for (let i = 0; i < size; i++) {
    words32[i] = wordAt(bytes, i * 4, endian);
  }
  return words32;
}
function byteAt(bytes, index) {
  return index >= bytes.length ? 0 : bytes[index];
}
function wordAt(bytes, index, endian) {
  let word = 0;
  if (endian === Endian.Big) {
    for (let i = 0; i < 4; i++) {
      word += byteAt(bytes, index + i) << 24 - 8 * i;
    }
  } else {
    for (let i = 0; i < 4; i++) {
      word += byteAt(bytes, index + i) << 8 * i;
    }
  }
  return word;
}
var base256 = new BigIntExponentiation(256);
function wordsToDecimalString(hi, lo) {
  const decimal = base256.toThePowerOf(0).multiplyBy(lo);
  base256.toThePowerOf(4).multiplyByAndAddTo(hi, decimal);
  return decimal.toString();
}
var TypeModifier;
(function(TypeModifier2) {
  TypeModifier2[TypeModifier2["None"] = 0] = "None";
  TypeModifier2[TypeModifier2["Const"] = 1] = "Const";
})(TypeModifier || (TypeModifier = {}));
var Type = class {
  constructor(modifiers = TypeModifier.None) {
    this.modifiers = modifiers;
  }
  hasModifier(modifier) {
    return (this.modifiers & modifier) !== 0;
  }
};
var BuiltinTypeName;
(function(BuiltinTypeName2) {
  BuiltinTypeName2[BuiltinTypeName2["Dynamic"] = 0] = "Dynamic";
  BuiltinTypeName2[BuiltinTypeName2["Bool"] = 1] = "Bool";
  BuiltinTypeName2[BuiltinTypeName2["String"] = 2] = "String";
  BuiltinTypeName2[BuiltinTypeName2["Int"] = 3] = "Int";
  BuiltinTypeName2[BuiltinTypeName2["Number"] = 4] = "Number";
  BuiltinTypeName2[BuiltinTypeName2["Function"] = 5] = "Function";
  BuiltinTypeName2[BuiltinTypeName2["Inferred"] = 6] = "Inferred";
  BuiltinTypeName2[BuiltinTypeName2["None"] = 7] = "None";
})(BuiltinTypeName || (BuiltinTypeName = {}));
var BuiltinType = class extends Type {
  constructor(name, modifiers) {
    super(modifiers);
    this.name = name;
  }
  visitType(visitor, context) {
    return visitor.visitBuiltinType(this, context);
  }
};
var ExpressionType = class extends Type {
  constructor(value, modifiers, typeParams = null) {
    super(modifiers);
    this.value = value;
    this.typeParams = typeParams;
  }
  visitType(visitor, context) {
    return visitor.visitExpressionType(this, context);
  }
};
var DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
var INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
var BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
var INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
var NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
var STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
var FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
var NONE_TYPE = new BuiltinType(BuiltinTypeName.None);
var UnaryOperator;
(function(UnaryOperator2) {
  UnaryOperator2[UnaryOperator2["Minus"] = 0] = "Minus";
  UnaryOperator2[UnaryOperator2["Plus"] = 1] = "Plus";
})(UnaryOperator || (UnaryOperator = {}));
var BinaryOperator;
(function(BinaryOperator2) {
  BinaryOperator2[BinaryOperator2["Equals"] = 0] = "Equals";
  BinaryOperator2[BinaryOperator2["NotEquals"] = 1] = "NotEquals";
  BinaryOperator2[BinaryOperator2["Identical"] = 2] = "Identical";
  BinaryOperator2[BinaryOperator2["NotIdentical"] = 3] = "NotIdentical";
  BinaryOperator2[BinaryOperator2["Minus"] = 4] = "Minus";
  BinaryOperator2[BinaryOperator2["Plus"] = 5] = "Plus";
  BinaryOperator2[BinaryOperator2["Divide"] = 6] = "Divide";
  BinaryOperator2[BinaryOperator2["Multiply"] = 7] = "Multiply";
  BinaryOperator2[BinaryOperator2["Modulo"] = 8] = "Modulo";
  BinaryOperator2[BinaryOperator2["And"] = 9] = "And";
  BinaryOperator2[BinaryOperator2["Or"] = 10] = "Or";
  BinaryOperator2[BinaryOperator2["BitwiseAnd"] = 11] = "BitwiseAnd";
  BinaryOperator2[BinaryOperator2["Lower"] = 12] = "Lower";
  BinaryOperator2[BinaryOperator2["LowerEquals"] = 13] = "LowerEquals";
  BinaryOperator2[BinaryOperator2["Bigger"] = 14] = "Bigger";
  BinaryOperator2[BinaryOperator2["BiggerEquals"] = 15] = "BiggerEquals";
  BinaryOperator2[BinaryOperator2["NullishCoalesce"] = 16] = "NullishCoalesce";
})(BinaryOperator || (BinaryOperator = {}));
function nullSafeIsEquivalent(base, other) {
  if (base == null || other == null) {
    return base == other;
  }
  return base.isEquivalent(other);
}
function areAllEquivalentPredicate(base, other, equivalentPredicate) {
  const len = base.length;
  if (len !== other.length) {
    return false;
  }
  for (let i = 0; i < len; i++) {
    if (!equivalentPredicate(base[i], other[i])) {
      return false;
    }
  }
  return true;
}
function areAllEquivalent(base, other) {
  return areAllEquivalentPredicate(base, other, (baseElement, otherElement) => baseElement.isEquivalent(otherElement));
}
var Expression = class {
  constructor(type, sourceSpan) {
    this.type = type || null;
    this.sourceSpan = sourceSpan || null;
  }
  prop(name, sourceSpan) {
    return new ReadPropExpr(this, name, null, sourceSpan);
  }
  key(index, type, sourceSpan) {
    return new ReadKeyExpr(this, index, type, sourceSpan);
  }
  callFn(params, sourceSpan, pure) {
    return new InvokeFunctionExpr(this, params, null, sourceSpan, pure);
  }
  instantiate(params, type, sourceSpan) {
    return new InstantiateExpr(this, params, type, sourceSpan);
  }
  conditional(trueCase, falseCase = null, sourceSpan) {
    return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
  }
  equals(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
  }
  notEquals(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
  }
  identical(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
  }
  notIdentical(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
  }
  minus(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
  }
  plus(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
  }
  divide(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
  }
  multiply(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
  }
  modulo(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
  }
  and(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
  }
  bitwiseAnd(rhs, sourceSpan, parens = true) {
    return new BinaryOperatorExpr(BinaryOperator.BitwiseAnd, this, rhs, null, sourceSpan, parens);
  }
  or(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
  }
  lower(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
  }
  lowerEquals(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
  }
  bigger(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
  }
  biggerEquals(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
  }
  isBlank(sourceSpan) {
    return this.equals(TYPED_NULL_EXPR, sourceSpan);
  }
  nullishCoalesce(rhs, sourceSpan) {
    return new BinaryOperatorExpr(BinaryOperator.NullishCoalesce, this, rhs, null, sourceSpan);
  }
  toStmt() {
    return new ExpressionStatement(this, null);
  }
};
var ReadVarExpr = class _ReadVarExpr extends Expression {
  constructor(name, type, sourceSpan) {
    super(type, sourceSpan);
    this.name = name;
  }
  isEquivalent(e) {
    return e instanceof _ReadVarExpr && this.name === e.name;
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitReadVarExpr(this, context);
  }
  clone() {
    return new _ReadVarExpr(this.name, this.type, this.sourceSpan);
  }
  set(value) {
    return new WriteVarExpr(this.name, value, null, this.sourceSpan);
  }
};
var TypeofExpr = class _TypeofExpr extends Expression {
  constructor(expr, type, sourceSpan) {
    super(type, sourceSpan);
    this.expr = expr;
  }
  visitExpression(visitor, context) {
    return visitor.visitTypeofExpr(this, context);
  }
  isEquivalent(e) {
    return e instanceof _TypeofExpr && e.expr.isEquivalent(this.expr);
  }
  isConstant() {
    return this.expr.isConstant();
  }
  clone() {
    return new _TypeofExpr(this.expr.clone());
  }
};
var WrappedNodeExpr = class _WrappedNodeExpr extends Expression {
  constructor(node, type, sourceSpan) {
    super(type, sourceSpan);
    this.node = node;
  }
  isEquivalent(e) {
    return e instanceof _WrappedNodeExpr && this.node === e.node;
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitWrappedNodeExpr(this, context);
  }
  clone() {
    return new _WrappedNodeExpr(this.node, this.type, this.sourceSpan);
  }
};
var WriteVarExpr = class _WriteVarExpr extends Expression {
  constructor(name, value, type, sourceSpan) {
    super(type || value.type, sourceSpan);
    this.name = name;
    this.value = value;
  }
  isEquivalent(e) {
    return e instanceof _WriteVarExpr && this.name === e.name && this.value.isEquivalent(e.value);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitWriteVarExpr(this, context);
  }
  clone() {
    return new _WriteVarExpr(this.name, this.value.clone(), this.type, this.sourceSpan);
  }
  toDeclStmt(type, modifiers) {
    return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
  }
  toConstDecl() {
    return this.toDeclStmt(INFERRED_TYPE, StmtModifier.Final);
  }
};
var WriteKeyExpr = class _WriteKeyExpr extends Expression {
  constructor(receiver, index, value, type, sourceSpan) {
    super(type || value.type, sourceSpan);
    this.receiver = receiver;
    this.index = index;
    this.value = value;
  }
  isEquivalent(e) {
    return e instanceof _WriteKeyExpr && this.receiver.isEquivalent(e.receiver) && this.index.isEquivalent(e.index) && this.value.isEquivalent(e.value);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitWriteKeyExpr(this, context);
  }
  clone() {
    return new _WriteKeyExpr(this.receiver.clone(), this.index.clone(), this.value.clone(), this.type, this.sourceSpan);
  }
};
var WritePropExpr = class _WritePropExpr extends Expression {
  constructor(receiver, name, value, type, sourceSpan) {
    super(type || value.type, sourceSpan);
    this.receiver = receiver;
    this.name = name;
    this.value = value;
  }
  isEquivalent(e) {
    return e instanceof _WritePropExpr && this.receiver.isEquivalent(e.receiver) && this.name === e.name && this.value.isEquivalent(e.value);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitWritePropExpr(this, context);
  }
  clone() {
    return new _WritePropExpr(this.receiver.clone(), this.name, this.value.clone(), this.type, this.sourceSpan);
  }
};
var InvokeFunctionExpr = class _InvokeFunctionExpr extends Expression {
  constructor(fn2, args, type, sourceSpan, pure = false) {
    super(type, sourceSpan);
    this.fn = fn2;
    this.args = args;
    this.pure = pure;
  }
  // An alias for fn, which allows other logic to handle calls and property reads together.
  get receiver() {
    return this.fn;
  }
  isEquivalent(e) {
    return e instanceof _InvokeFunctionExpr && this.fn.isEquivalent(e.fn) && areAllEquivalent(this.args, e.args) && this.pure === e.pure;
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitInvokeFunctionExpr(this, context);
  }
  clone() {
    return new _InvokeFunctionExpr(this.fn.clone(), this.args.map((arg) => arg.clone()), this.type, this.sourceSpan, this.pure);
  }
};
var TaggedTemplateExpr = class _TaggedTemplateExpr extends Expression {
  constructor(tag, template2, type, sourceSpan) {
    super(type, sourceSpan);
    this.tag = tag;
    this.template = template2;
  }
  isEquivalent(e) {
    return e instanceof _TaggedTemplateExpr && this.tag.isEquivalent(e.tag) && areAllEquivalentPredicate(this.template.elements, e.template.elements, (a, b) => a.text === b.text) && areAllEquivalent(this.template.expressions, e.template.expressions);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitTaggedTemplateExpr(this, context);
  }
  clone() {
    return new _TaggedTemplateExpr(this.tag.clone(), this.template.clone(), this.type, this.sourceSpan);
  }
};
var InstantiateExpr = class _InstantiateExpr extends Expression {
  constructor(classExpr, args, type, sourceSpan) {
    super(type, sourceSpan);
    this.classExpr = classExpr;
    this.args = args;
  }
  isEquivalent(e) {
    return e instanceof _InstantiateExpr && this.classExpr.isEquivalent(e.classExpr) && areAllEquivalent(this.args, e.args);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitInstantiateExpr(this, context);
  }
  clone() {
    return new _InstantiateExpr(this.classExpr.clone(), this.args.map((arg) => arg.clone()), this.type, this.sourceSpan);
  }
};
var LiteralExpr = class _LiteralExpr extends Expression {
  constructor(value, type, sourceSpan) {
    super(type, sourceSpan);
    this.value = value;
  }
  isEquivalent(e) {
    return e instanceof _LiteralExpr && this.value === e.value;
  }
  isConstant() {
    return true;
  }
  visitExpression(visitor, context) {
    return visitor.visitLiteralExpr(this, context);
  }
  clone() {
    return new _LiteralExpr(this.value, this.type, this.sourceSpan);
  }
};
var TemplateLiteral = class _TemplateLiteral {
  constructor(elements, expressions) {
    this.elements = elements;
    this.expressions = expressions;
  }
  clone() {
    return new _TemplateLiteral(this.elements.map((el) => el.clone()), this.expressions.map((expr) => expr.clone()));
  }
};
var TemplateLiteralElement = class _TemplateLiteralElement {
  constructor(text2, sourceSpan, rawText) {
    this.text = text2;
    this.sourceSpan = sourceSpan;
    this.rawText = rawText ?? sourceSpan?.toString() ?? escapeForTemplateLiteral(escapeSlashes(text2));
  }
  clone() {
    return new _TemplateLiteralElement(this.text, this.sourceSpan, this.rawText);
  }
};
var LiteralPiece = class {
  constructor(text2, sourceSpan) {
    this.text = text2;
    this.sourceSpan = sourceSpan;
  }
};
var PlaceholderPiece = class {
  /**
   * Create a new instance of a `PlaceholderPiece`.
   *
   * @param text the name of this placeholder (e.g. `PH_1`).
   * @param sourceSpan the location of this placeholder in its localized message the source code.
   * @param associatedMessage reference to another message that this placeholder is associated with.
   * The `associatedMessage` is mainly used to provide a relationship to an ICU message that has
   * been extracted out from the message containing the placeholder.
   */
  constructor(text2, sourceSpan, associatedMessage) {
    this.text = text2;
    this.sourceSpan = sourceSpan;
    this.associatedMessage = associatedMessage;
  }
};
var MEANING_SEPARATOR$1 = "|";
var ID_SEPARATOR$1 = "@@";
var LEGACY_ID_INDICATOR = "\u241F";
var LocalizedString = class _LocalizedString extends Expression {
  constructor(metaBlock, messageParts, placeHolderNames, expressions, sourceSpan) {
    super(STRING_TYPE, sourceSpan);
    this.metaBlock = metaBlock;
    this.messageParts = messageParts;
    this.placeHolderNames = placeHolderNames;
    this.expressions = expressions;
  }
  isEquivalent(e) {
    return false;
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitLocalizedString(this, context);
  }
  clone() {
    return new _LocalizedString(this.metaBlock, this.messageParts, this.placeHolderNames, this.expressions.map((expr) => expr.clone()), this.sourceSpan);
  }
  /**
   * Serialize the given `meta` and `messagePart` into "cooked" and "raw" strings that can be used
   * in a `$localize` tagged string. The format of the metadata is the same as that parsed by
   * `parseI18nMeta()`.
   *
   * @param meta The metadata to serialize
   * @param messagePart The first part of the tagged string
   */
  serializeI18nHead() {
    let metaBlock = this.metaBlock.description || "";
    if (this.metaBlock.meaning) {
      metaBlock = `${this.metaBlock.meaning}${MEANING_SEPARATOR$1}${metaBlock}`;
    }
    if (this.metaBlock.customId) {
      metaBlock = `${metaBlock}${ID_SEPARATOR$1}${this.metaBlock.customId}`;
    }
    if (this.metaBlock.legacyIds) {
      this.metaBlock.legacyIds.forEach((legacyId) => {
        metaBlock = `${metaBlock}${LEGACY_ID_INDICATOR}${legacyId}`;
      });
    }
    return createCookedRawString(metaBlock, this.messageParts[0].text, this.getMessagePartSourceSpan(0));
  }
  getMessagePartSourceSpan(i) {
    return this.messageParts[i]?.sourceSpan ?? this.sourceSpan;
  }
  getPlaceholderSourceSpan(i) {
    return this.placeHolderNames[i]?.sourceSpan ?? this.expressions[i]?.sourceSpan ?? this.sourceSpan;
  }
  /**
   * Serialize the given `placeholderName` and `messagePart` into "cooked" and "raw" strings that
   * can be used in a `$localize` tagged string.
   *
   * The format is `:<placeholder-name>[@@<associated-id>]:`.
   *
   * The `associated-id` is the message id of the (usually an ICU) message to which this placeholder
   * refers.
   *
   * @param partIndex The index of the message part to serialize.
   */
  serializeI18nTemplatePart(partIndex) {
    const placeholder = this.placeHolderNames[partIndex - 1];
    const messagePart = this.messageParts[partIndex];
    let metaBlock = placeholder.text;
    if (placeholder.associatedMessage?.legacyIds.length === 0) {
      metaBlock += `${ID_SEPARATOR$1}${computeMsgId(placeholder.associatedMessage.messageString, placeholder.associatedMessage.meaning)}`;
    }
    return createCookedRawString(metaBlock, messagePart.text, this.getMessagePartSourceSpan(partIndex));
  }
};
var escapeSlashes = (str) => str.replace(/\\/g, "\\\\");
var escapeStartingColon = (str) => str.replace(/^:/, "\\:");
var escapeColons = (str) => str.replace(/:/g, "\\:");
var escapeForTemplateLiteral = (str) => str.replace(/`/g, "\\`").replace(/\${/g, "$\\{");
function createCookedRawString(metaBlock, messagePart, range) {
  if (metaBlock === "") {
    return {
      cooked: messagePart,
      raw: escapeForTemplateLiteral(escapeStartingColon(escapeSlashes(messagePart))),
      range
    };
  } else {
    return {
      cooked: `:${metaBlock}:${messagePart}`,
      raw: escapeForTemplateLiteral(`:${escapeColons(escapeSlashes(metaBlock))}:${escapeSlashes(messagePart)}`),
      range
    };
  }
}
var ExternalExpr = class _ExternalExpr extends Expression {
  constructor(value, type, typeParams = null, sourceSpan) {
    super(type, sourceSpan);
    this.value = value;
    this.typeParams = typeParams;
  }
  isEquivalent(e) {
    return e instanceof _ExternalExpr && this.value.name === e.value.name && this.value.moduleName === e.value.moduleName && this.value.runtime === e.value.runtime;
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitExternalExpr(this, context);
  }
  clone() {
    return new _ExternalExpr(this.value, this.type, this.typeParams, this.sourceSpan);
  }
};
var ConditionalExpr = class _ConditionalExpr extends Expression {
  constructor(condition, trueCase, falseCase = null, type, sourceSpan) {
    super(type || trueCase.type, sourceSpan);
    this.condition = condition;
    this.falseCase = falseCase;
    this.trueCase = trueCase;
  }
  isEquivalent(e) {
    return e instanceof _ConditionalExpr && this.condition.isEquivalent(e.condition) && this.trueCase.isEquivalent(e.trueCase) && nullSafeIsEquivalent(this.falseCase, e.falseCase);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitConditionalExpr(this, context);
  }
  clone() {
    return new _ConditionalExpr(this.condition.clone(), this.trueCase.clone(), this.falseCase?.clone(), this.type, this.sourceSpan);
  }
};
var DynamicImportExpr = class _DynamicImportExpr extends Expression {
  constructor(url, sourceSpan) {
    super(null, sourceSpan);
    this.url = url;
  }
  isEquivalent(e) {
    return e instanceof _DynamicImportExpr && this.url === e.url;
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitDynamicImportExpr(this, context);
  }
  clone() {
    return new _DynamicImportExpr(this.url, this.sourceSpan);
  }
};
var NotExpr = class _NotExpr extends Expression {
  constructor(condition, sourceSpan) {
    super(BOOL_TYPE, sourceSpan);
    this.condition = condition;
  }
  isEquivalent(e) {
    return e instanceof _NotExpr && this.condition.isEquivalent(e.condition);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitNotExpr(this, context);
  }
  clone() {
    return new _NotExpr(this.condition.clone(), this.sourceSpan);
  }
};
var FnParam = class _FnParam {
  constructor(name, type = null) {
    this.name = name;
    this.type = type;
  }
  isEquivalent(param) {
    return this.name === param.name;
  }
  clone() {
    return new _FnParam(this.name, this.type);
  }
};
var FunctionExpr = class _FunctionExpr extends Expression {
  constructor(params, statements, type, sourceSpan, name) {
    super(type, sourceSpan);
    this.params = params;
    this.statements = statements;
    this.name = name;
  }
  isEquivalent(e) {
    return e instanceof _FunctionExpr && areAllEquivalent(this.params, e.params) && areAllEquivalent(this.statements, e.statements);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitFunctionExpr(this, context);
  }
  toDeclStmt(name, modifiers) {
    return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
  }
  clone() {
    return new _FunctionExpr(this.params.map((p) => p.clone()), this.statements, this.type, this.sourceSpan, this.name);
  }
};
var UnaryOperatorExpr = class _UnaryOperatorExpr extends Expression {
  constructor(operator, expr, type, sourceSpan, parens = true) {
    super(type || NUMBER_TYPE, sourceSpan);
    this.operator = operator;
    this.expr = expr;
    this.parens = parens;
  }
  isEquivalent(e) {
    return e instanceof _UnaryOperatorExpr && this.operator === e.operator && this.expr.isEquivalent(e.expr);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitUnaryOperatorExpr(this, context);
  }
  clone() {
    return new _UnaryOperatorExpr(this.operator, this.expr.clone(), this.type, this.sourceSpan, this.parens);
  }
};
var BinaryOperatorExpr = class _BinaryOperatorExpr extends Expression {
  constructor(operator, lhs, rhs, type, sourceSpan, parens = true) {
    super(type || lhs.type, sourceSpan);
    this.operator = operator;
    this.rhs = rhs;
    this.parens = parens;
    this.lhs = lhs;
  }
  isEquivalent(e) {
    return e instanceof _BinaryOperatorExpr && this.operator === e.operator && this.lhs.isEquivalent(e.lhs) && this.rhs.isEquivalent(e.rhs);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitBinaryOperatorExpr(this, context);
  }
  clone() {
    return new _BinaryOperatorExpr(this.operator, this.lhs.clone(), this.rhs.clone(), this.type, this.sourceSpan, this.parens);
  }
};
var ReadPropExpr = class _ReadPropExpr extends Expression {
  constructor(receiver, name, type, sourceSpan) {
    super(type, sourceSpan);
    this.receiver = receiver;
    this.name = name;
  }
  // An alias for name, which allows other logic to handle property reads and keyed reads together.
  get index() {
    return this.name;
  }
  isEquivalent(e) {
    return e instanceof _ReadPropExpr && this.receiver.isEquivalent(e.receiver) && this.name === e.name;
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitReadPropExpr(this, context);
  }
  set(value) {
    return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
  }
  clone() {
    return new _ReadPropExpr(this.receiver.clone(), this.name, this.type, this.sourceSpan);
  }
};
var ReadKeyExpr = class _ReadKeyExpr extends Expression {
  constructor(receiver, index, type, sourceSpan) {
    super(type, sourceSpan);
    this.receiver = receiver;
    this.index = index;
  }
  isEquivalent(e) {
    return e instanceof _ReadKeyExpr && this.receiver.isEquivalent(e.receiver) && this.index.isEquivalent(e.index);
  }
  isConstant() {
    return false;
  }
  visitExpression(visitor, context) {
    return visitor.visitReadKeyExpr(this, context);
  }
  set(value) {
    return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
  }
  clone() {
    return new _ReadKeyExpr(this.receiver.clone(), this.index.clone(), this.type, this.sourceSpan);
  }
};
var LiteralArrayExpr = class _LiteralArrayExpr extends Expression {
  constructor(entries, type, sourceSpan) {
    super(type, sourceSpan);
    this.entries = entries;
  }
  isConstant() {
    return this.entries.every((e) => e.isConstant());
  }
  isEquivalent(e) {
    return e instanceof _LiteralArrayExpr && areAllEquivalent(this.entries, e.entries);
  }
  visitExpression(visitor, context) {
    return visitor.visitLiteralArrayExpr(this, context);
  }
  clone() {
    return new _LiteralArrayExpr(this.entries.map((e) => e.clone()), this.type, this.sourceSpan);
  }
};
var LiteralMapEntry = class _LiteralMapEntry {
  constructor(key, value, quoted) {
    this.key = key;
    this.value = value;
    this.quoted = quoted;
  }
  isEquivalent(e) {
    return this.key === e.key && this.value.isEquivalent(e.value);
  }
  clone() {
    return new _LiteralMapEntry(this.key, this.value.clone(), this.quoted);
  }
};
var LiteralMapExpr = class _LiteralMapExpr extends Expression {
  constructor(entries, type, sourceSpan) {
    super(type, sourceSpan);
    this.entries = entries;
    this.valueType = null;
    if (type) {
      this.valueType = type.valueType;
    }
  }
  isEquivalent(e) {
    return e instanceof _LiteralMapExpr && areAllEquivalent(this.entries, e.entries);
  }
  isConstant() {
    return this.entries.every((e) => e.value.isConstant());
  }
  visitExpression(visitor, context) {
    return visitor.visitLiteralMapExpr(this, context);
  }
  clone() {
    const entriesClone = this.entries.map((entry) => entry.clone());
    return new _LiteralMapExpr(entriesClone, this.type, this.sourceSpan);
  }
};
var NULL_EXPR = new LiteralExpr(null, null, null);
var TYPED_NULL_EXPR = new LiteralExpr(null, INFERRED_TYPE, null);
var StmtModifier;
(function(StmtModifier2) {
  StmtModifier2[StmtModifier2["None"] = 0] = "None";
  StmtModifier2[StmtModifier2["Final"] = 1] = "Final";
  StmtModifier2[StmtModifier2["Private"] = 2] = "Private";
  StmtModifier2[StmtModifier2["Exported"] = 4] = "Exported";
  StmtModifier2[StmtModifier2["Static"] = 8] = "Static";
})(StmtModifier || (StmtModifier = {}));
var LeadingComment = class {
  constructor(text2, multiline, trailingNewline) {
    this.text = text2;
    this.multiline = multiline;
    this.trailingNewline = trailingNewline;
  }
  toString() {
    return this.multiline ? ` ${this.text} ` : this.text;
  }
};
var JSDocComment = class extends LeadingComment {
  constructor(tags) {
    super(
      "",
      /* multiline */
      true,
      /* trailingNewline */
      true
    );
    this.tags = tags;
  }
  toString() {
    return serializeTags(this.tags);
  }
};
var Statement = class {
  constructor(modifiers = StmtModifier.None, sourceSpan = null, leadingComments) {
    this.modifiers = modifiers;
    this.sourceSpan = sourceSpan;
    this.leadingComments = leadingComments;
  }
  hasModifier(modifier) {
    return (this.modifiers & modifier) !== 0;
  }
  addLeadingComment(leadingComment) {
    this.leadingComments = this.leadingComments ?? [];
    this.leadingComments.push(leadingComment);
  }
};
var DeclareVarStmt = class _DeclareVarStmt extends Statement {
  constructor(name, value, type, modifiers, sourceSpan, leadingComments) {
    super(modifiers, sourceSpan, leadingComments);
    this.name = name;
    this.value = value;
    this.type = type || value && value.type || null;
  }
  isEquivalent(stmt) {
    return stmt instanceof _DeclareVarStmt && this.name === stmt.name && (this.value ? !!stmt.value && this.value.isEquivalent(stmt.value) : !stmt.value);
  }
  visitStatement(visitor, context) {
    return visitor.visitDeclareVarStmt(this, context);
  }
};
var DeclareFunctionStmt = class _DeclareFunctionStmt extends Statement {
  constructor(name, params, statements, type, modifiers, sourceSpan, leadingComments) {
    super(modifiers, sourceSpan, leadingComments);
    this.name = name;
    this.params = params;
    this.statements = statements;
    this.type = type || null;
  }
  isEquivalent(stmt) {
    return stmt instanceof _DeclareFunctionStmt && areAllEquivalent(this.params, stmt.params) && areAllEquivalent(this.statements, stmt.statements);
  }
  visitStatement(visitor, context) {
    return visitor.visitDeclareFunctionStmt(this, context);
  }
};
var ExpressionStatement = class _ExpressionStatement extends Statement {
  constructor(expr, sourceSpan, leadingComments) {
    super(StmtModifier.None, sourceSpan, leadingComments);
    this.expr = expr;
  }
  isEquivalent(stmt) {
    return stmt instanceof _ExpressionStatement && this.expr.isEquivalent(stmt.expr);
  }
  visitStatement(visitor, context) {
    return visitor.visitExpressionStmt(this, context);
  }
};
var ReturnStatement = class _ReturnStatement extends Statement {
  constructor(value, sourceSpan = null, leadingComments) {
    super(StmtModifier.None, sourceSpan, leadingComments);
    this.value = value;
  }
  isEquivalent(stmt) {
    return stmt instanceof _ReturnStatement && this.value.isEquivalent(stmt.value);
  }
  visitStatement(visitor, context) {
    return visitor.visitReturnStmt(this, context);
  }
};
var IfStmt = class _IfStmt extends Statement {
  constructor(condition, trueCase, falseCase = [], sourceSpan, leadingComments) {
    super(StmtModifier.None, sourceSpan, leadingComments);
    this.condition = condition;
    this.trueCase = trueCase;
    this.falseCase = falseCase;
  }
  isEquivalent(stmt) {
    return stmt instanceof _IfStmt && this.condition.isEquivalent(stmt.condition) && areAllEquivalent(this.trueCase, stmt.trueCase) && areAllEquivalent(this.falseCase, stmt.falseCase);
  }
  visitStatement(visitor, context) {
    return visitor.visitIfStmt(this, context);
  }
};
function jsDocComment(tags = []) {
  return new JSDocComment(tags);
}
function variable(name, type, sourceSpan) {
  return new ReadVarExpr(name, type, sourceSpan);
}
function importExpr(id, typeParams = null, sourceSpan) {
  return new ExternalExpr(id, null, typeParams, sourceSpan);
}
function expressionType(expr, typeModifiers, typeParams) {
  return new ExpressionType(expr, typeModifiers, typeParams);
}
function typeofExpr(expr) {
  return new TypeofExpr(expr);
}
function literalArr(values, type, sourceSpan) {
  return new LiteralArrayExpr(values, type, sourceSpan);
}
function literalMap(values, type = null) {
  return new LiteralMapExpr(values.map((e) => new LiteralMapEntry(e.key, e.value, e.quoted)), type, null);
}
function not(expr, sourceSpan) {
  return new NotExpr(expr, sourceSpan);
}
function fn(params, body, type, sourceSpan, name) {
  return new FunctionExpr(params, body, type, sourceSpan, name);
}
function ifStmt(condition, thenClause, elseClause, sourceSpan, leadingComments) {
  return new IfStmt(condition, thenClause, elseClause, sourceSpan, leadingComments);
}
function taggedTemplate(tag, template2, type, sourceSpan) {
  return new TaggedTemplateExpr(tag, template2, type, sourceSpan);
}
function literal(value, type, sourceSpan) {
  return new LiteralExpr(value, type, sourceSpan);
}
function localizedString(metaBlock, messageParts, placeholderNames, expressions, sourceSpan) {
  return new LocalizedString(metaBlock, messageParts, placeholderNames, expressions, sourceSpan);
}
function isNull(exp) {
  return exp instanceof LiteralExpr && exp.value === null;
}
function tagToString(tag) {
  let out = "";
  if (tag.tagName) {
    out += ` @${tag.tagName}`;
  }
  if (tag.text) {
    if (tag.text.match(/\/\*|\*\//)) {
      throw new Error('JSDoc text cannot contain "/*" and "*/"');
    }
    out += " " + tag.text.replace(/@/g, "\\@");
  }
  return out;
}
function serializeTags(tags) {
  if (tags.length === 0)
    return "";
  if (tags.length === 1 && tags[0].tagName && !tags[0].text) {
    return `*${tagToString(tags[0])} `;
  }
  let out = "*\n";
  for (const tag of tags) {
    out += " *";
    out += tagToString(tag).replace(/\n/g, "\n * ");
    out += "\n";
  }
  out += " ";
  return out;
}
var CONSTANT_PREFIX = "_c";
var UNKNOWN_VALUE_KEY = variable("<unknown>");
var KEY_CONTEXT = {};
var POOL_INCLUSION_LENGTH_THRESHOLD_FOR_STRINGS = 50;
var FixupExpression = class _FixupExpression extends Expression {
  constructor(resolved) {
    super(resolved.type);
    this.resolved = resolved;
    this.shared = false;
    this.original = resolved;
  }
  visitExpression(visitor, context) {
    if (context === KEY_CONTEXT) {
      return this.original.visitExpression(visitor, context);
    } else {
      return this.resolved.visitExpression(visitor, context);
    }
  }
  isEquivalent(e) {
    return e instanceof _FixupExpression && this.resolved.isEquivalent(e.resolved);
  }
  isConstant() {
    return true;
  }
  clone() {
    throw new Error(`Not supported.`);
  }
  fixup(expression) {
    this.resolved = expression;
    this.shared = true;
  }
};
var ConstantPool = class {
  constructor(isClosureCompilerEnabled = false) {
    this.isClosureCompilerEnabled = isClosureCompilerEnabled;
    this.statements = [];
    this.literals = /* @__PURE__ */ new Map();
    this.literalFactories = /* @__PURE__ */ new Map();
    this.sharedConstants = /* @__PURE__ */ new Map();
    this.nextNameIndex = 0;
  }
  getConstLiteral(literal2, forceShared) {
    if (literal2 instanceof LiteralExpr && !isLongStringLiteral(literal2) || literal2 instanceof FixupExpression) {
      return literal2;
    }
    const key = GenericKeyFn.INSTANCE.keyOf(literal2);
    let fixup = this.literals.get(key);
    let newValue = false;
    if (!fixup) {
      fixup = new FixupExpression(literal2);
      this.literals.set(key, fixup);
      newValue = true;
    }
    if (!newValue && !fixup.shared || newValue && forceShared) {
      const name = this.freshName();
      let definition;
      let usage;
      if (this.isClosureCompilerEnabled && isLongStringLiteral(literal2)) {
        definition = variable(name).set(new FunctionExpr(
          [],
          // Params.
          [
            // Statements.
            new ReturnStatement(literal2)
          ]
        ));
        usage = variable(name).callFn([]);
      } else {
        definition = variable(name).set(literal2);
        usage = variable(name);
      }
      this.statements.push(definition.toDeclStmt(INFERRED_TYPE, StmtModifier.Final));
      fixup.fixup(usage);
    }
    return fixup;
  }
  getSharedConstant(def, expr) {
    const key = def.keyOf(expr);
    if (!this.sharedConstants.has(key)) {
      const id = this.freshName();
      this.sharedConstants.set(key, variable(id));
      this.statements.push(def.toSharedConstantDeclaration(id, expr));
    }
    return this.sharedConstants.get(key);
  }
  getLiteralFactory(literal2) {
    if (literal2 instanceof LiteralArrayExpr) {
      const argumentsForKey = literal2.entries.map((e) => e.isConstant() ? e : UNKNOWN_VALUE_KEY);
      const key = GenericKeyFn.INSTANCE.keyOf(literalArr(argumentsForKey));
      return this._getLiteralFactory(key, literal2.entries, (entries) => literalArr(entries));
    } else {
      const expressionForKey = literalMap(literal2.entries.map((e) => ({
        key: e.key,
        value: e.value.isConstant() ? e.value : UNKNOWN_VALUE_KEY,
        quoted: e.quoted
      })));
      const key = GenericKeyFn.INSTANCE.keyOf(expressionForKey);
      return this._getLiteralFactory(key, literal2.entries.map((e) => e.value), (entries) => literalMap(entries.map((value, index) => ({
        key: literal2.entries[index].key,
        value,
        quoted: literal2.entries[index].quoted
      }))));
    }
  }
  _getLiteralFactory(key, values, resultMap) {
    let literalFactory = this.literalFactories.get(key);
    const literalFactoryArguments = values.filter((e) => !e.isConstant());
    if (!literalFactory) {
      const resultExpressions = values.map((e, index) => e.isConstant() ? this.getConstLiteral(e, true) : variable(`a${index}`));
      const parameters = resultExpressions.filter(isVariable).map((e) => new FnParam(e.name, DYNAMIC_TYPE));
      const pureFunctionDeclaration = fn(parameters, [new ReturnStatement(resultMap(resultExpressions))], INFERRED_TYPE);
      const name = this.freshName();
      this.statements.push(variable(name).set(pureFunctionDeclaration).toDeclStmt(INFERRED_TYPE, StmtModifier.Final));
      literalFactory = variable(name);
      this.literalFactories.set(key, literalFactory);
    }
    return { literalFactory, literalFactoryArguments };
  }
  /**
   * Produce a unique name.
   *
   * The name might be unique among different prefixes if any of the prefixes end in
   * a digit so the prefix should be a constant string (not based on user input) and
   * must not end in a digit.
   */
  uniqueName(prefix) {
    return `${prefix}${this.nextNameIndex++}`;
  }
  freshName() {
    return this.uniqueName(CONSTANT_PREFIX);
  }
};
var _GenericKeyFn = class _GenericKeyFn {
  keyOf(expr) {
    if (expr instanceof LiteralExpr && typeof expr.value === "string") {
      return `"${expr.value}"`;
    } else if (expr instanceof LiteralExpr) {
      return String(expr.value);
    } else if (expr instanceof LiteralArrayExpr) {
      const entries = [];
      for (const entry of expr.entries) {
        entries.push(this.keyOf(entry));
      }
      return `[${entries.join(",")}]`;
    } else if (expr instanceof LiteralMapExpr) {
      const entries = [];
      for (const entry of expr.entries) {
        let key = entry.key;
        if (entry.quoted) {
          key = `"${key}"`;
        }
        entries.push(key + ":" + this.keyOf(entry.value));
      }
      return `{${entries.join(",")}}`;
    } else if (expr instanceof ExternalExpr) {
      return `import("${expr.value.moduleName}", ${expr.value.name})`;
    } else if (expr instanceof ReadVarExpr) {
      return `read(${expr.name})`;
    } else if (expr instanceof TypeofExpr) {
      return `typeof(${this.keyOf(expr.expr)})`;
    } else {
      throw new Error(`${this.constructor.name} does not handle expressions of type ${expr.constructor.name}`);
    }
  }
};
_GenericKeyFn.INSTANCE = new _GenericKeyFn();
var GenericKeyFn = _GenericKeyFn;
function isVariable(e) {
  return e instanceof ReadVarExpr;
}
function isLongStringLiteral(expr) {
  return expr instanceof LiteralExpr && typeof expr.value === "string" && expr.value.length >= POOL_INCLUSION_LENGTH_THRESHOLD_FOR_STRINGS;
}
var CORE = "@angular/core";
var _Identifiers = class _Identifiers {
};
_Identifiers.NEW_METHOD = "factory";
_Identifiers.TRANSFORM_METHOD = "transform";
_Identifiers.PATCH_DEPS = "patchedDeps";
_Identifiers.core = { name: null, moduleName: CORE };
_Identifiers.namespaceHTML = { name: "\u0275\u0275namespaceHTML", moduleName: CORE };
_Identifiers.namespaceMathML = { name: "\u0275\u0275namespaceMathML", moduleName: CORE };
_Identifiers.namespaceSVG = { name: "\u0275\u0275namespaceSVG", moduleName: CORE };
_Identifiers.element = { name: "\u0275\u0275element", moduleName: CORE };
_Identifiers.elementStart = { name: "\u0275\u0275elementStart", moduleName: CORE };
_Identifiers.elementEnd = { name: "\u0275\u0275elementEnd", moduleName: CORE };
_Identifiers.advance = { name: "\u0275\u0275advance", moduleName: CORE };
_Identifiers.syntheticHostProperty = { name: "\u0275\u0275syntheticHostProperty", moduleName: CORE };
_Identifiers.syntheticHostListener = { name: "\u0275\u0275syntheticHostListener", moduleName: CORE };
_Identifiers.attribute = { name: "\u0275\u0275attribute", moduleName: CORE };
_Identifiers.attributeInterpolate1 = { name: "\u0275\u0275attributeInterpolate1", moduleName: CORE };
_Identifiers.attributeInterpolate2 = { name: "\u0275\u0275attributeInterpolate2", moduleName: CORE };
_Identifiers.attributeInterpolate3 = { name: "\u0275\u0275attributeInterpolate3", moduleName: CORE };
_Identifiers.attributeInterpolate4 = { name: "\u0275\u0275attributeInterpolate4", moduleName: CORE };
_Identifiers.attributeInterpolate5 = { name: "\u0275\u0275attributeInterpolate5", moduleName: CORE };
_Identifiers.attributeInterpolate6 = { name: "\u0275\u0275attributeInterpolate6", moduleName: CORE };
_Identifiers.attributeInterpolate7 = { name: "\u0275\u0275attributeInterpolate7", moduleName: CORE };
_Identifiers.attributeInterpolate8 = { name: "\u0275\u0275attributeInterpolate8", moduleName: CORE };
_Identifiers.attributeInterpolateV = { name: "\u0275\u0275attributeInterpolateV", moduleName: CORE };
_Identifiers.classProp = { name: "\u0275\u0275classProp", moduleName: CORE };
_Identifiers.elementContainerStart = { name: "\u0275\u0275elementContainerStart", moduleName: CORE };
_Identifiers.elementContainerEnd = { name: "\u0275\u0275elementContainerEnd", moduleName: CORE };
_Identifiers.elementContainer = { name: "\u0275\u0275elementContainer", moduleName: CORE };
_Identifiers.styleMap = { name: "\u0275\u0275styleMap", moduleName: CORE };
_Identifiers.styleMapInterpolate1 = { name: "\u0275\u0275styleMapInterpolate1", moduleName: CORE };
_Identifiers.styleMapInterpolate2 = { name: "\u0275\u0275styleMapInterpolate2", moduleName: CORE };
_Identifiers.styleMapInterpolate3 = { name: "\u0275\u0275styleMapInterpolate3", moduleName: CORE };
_Identifiers.styleMapInterpolate4 = { name: "\u0275\u0275styleMapInterpolate4", moduleName: CORE };
_Identifiers.styleMapInterpolate5 = { name: "\u0275\u0275styleMapInterpolate5", moduleName: CORE };
_Identifiers.styleMapInterpolate6 = { name: "\u0275\u0275styleMapInterpolate6", moduleName: CORE };
_Identifiers.styleMapInterpolate7 = { name: "\u0275\u0275styleMapInterpolate7", moduleName: CORE };
_Identifiers.styleMapInterpolate8 = { name: "\u0275\u0275styleMapInterpolate8", moduleName: CORE };
_Identifiers.styleMapInterpolateV = { name: "\u0275\u0275styleMapInterpolateV", moduleName: CORE };
_Identifiers.classMap = { name: "\u0275\u0275classMap", moduleName: CORE };
_Identifiers.classMapInterpolate1 = { name: "\u0275\u0275classMapInterpolate1", moduleName: CORE };
_Identifiers.classMapInterpolate2 = { name: "\u0275\u0275classMapInterpolate2", moduleName: CORE };
_Identifiers.classMapInterpolate3 = { name: "\u0275\u0275classMapInterpolate3", moduleName: CORE };
_Identifiers.classMapInterpolate4 = { name: "\u0275\u0275classMapInterpolate4", moduleName: CORE };
_Identifiers.classMapInterpolate5 = { name: "\u0275\u0275classMapInterpolate5", moduleName: CORE };
_Identifiers.classMapInterpolate6 = { name: "\u0275\u0275classMapInterpolate6", moduleName: CORE };
_Identifiers.classMapInterpolate7 = { name: "\u0275\u0275classMapInterpolate7", moduleName: CORE };
_Identifiers.classMapInterpolate8 = { name: "\u0275\u0275classMapInterpolate8", moduleName: CORE };
_Identifiers.classMapInterpolateV = { name: "\u0275\u0275classMapInterpolateV", moduleName: CORE };
_Identifiers.styleProp = { name: "\u0275\u0275styleProp", moduleName: CORE };
_Identifiers.stylePropInterpolate1 = { name: "\u0275\u0275stylePropInterpolate1", moduleName: CORE };
_Identifiers.stylePropInterpolate2 = { name: "\u0275\u0275stylePropInterpolate2", moduleName: CORE };
_Identifiers.stylePropInterpolate3 = { name: "\u0275\u0275stylePropInterpolate3", moduleName: CORE };
_Identifiers.stylePropInterpolate4 = { name: "\u0275\u0275stylePropInterpolate4", moduleName: CORE };
_Identifiers.stylePropInterpolate5 = { name: "\u0275\u0275stylePropInterpolate5", moduleName: CORE };
_Identifiers.stylePropInterpolate6 = { name: "\u0275\u0275stylePropInterpolate6", moduleName: CORE };
_Identifiers.stylePropInterpolate7 = { name: "\u0275\u0275stylePropInterpolate7", moduleName: CORE };
_Identifiers.stylePropInterpolate8 = { name: "\u0275\u0275stylePropInterpolate8", moduleName: CORE };
_Identifiers.stylePropInterpolateV = { name: "\u0275\u0275stylePropInterpolateV", moduleName: CORE };
_Identifiers.nextContext = { name: "\u0275\u0275nextContext", moduleName: CORE };
_Identifiers.resetView = { name: "\u0275\u0275resetView", moduleName: CORE };
_Identifiers.templateCreate = { name: "\u0275\u0275template", moduleName: CORE };
_Identifiers.defer = { name: "\u0275\u0275defer", moduleName: CORE };
_Identifiers.text = { name: "\u0275\u0275text", moduleName: CORE };
_Identifiers.enableBindings = { name: "\u0275\u0275enableBindings", moduleName: CORE };
_Identifiers.disableBindings = { name: "\u0275\u0275disableBindings", moduleName: CORE };
_Identifiers.getCurrentView = { name: "\u0275\u0275getCurrentView", moduleName: CORE };
_Identifiers.textInterpolate = { name: "\u0275\u0275textInterpolate", moduleName: CORE };
_Identifiers.textInterpolate1 = { name: "\u0275\u0275textInterpolate1", moduleName: CORE };
_Identifiers.textInterpolate2 = { name: "\u0275\u0275textInterpolate2", moduleName: CORE };
_Identifiers.textInterpolate3 = { name: "\u0275\u0275textInterpolate3", moduleName: CORE };
_Identifiers.textInterpolate4 = { name: "\u0275\u0275textInterpolate4", moduleName: CORE };
_Identifiers.textInterpolate5 = { name: "\u0275\u0275textInterpolate5", moduleName: CORE };
_Identifiers.textInterpolate6 = { name: "\u0275\u0275textInterpolate6", moduleName: CORE };
_Identifiers.textInterpolate7 = { name: "\u0275\u0275textInterpolate7", moduleName: CORE };
_Identifiers.textInterpolate8 = { name: "\u0275\u0275textInterpolate8", moduleName: CORE };
_Identifiers.textInterpolateV = { name: "\u0275\u0275textInterpolateV", moduleName: CORE };
_Identifiers.restoreView = { name: "\u0275\u0275restoreView", moduleName: CORE };
_Identifiers.pureFunction0 = { name: "\u0275\u0275pureFunction0", moduleName: CORE };
_Identifiers.pureFunction1 = { name: "\u0275\u0275pureFunction1", moduleName: CORE };
_Identifiers.pureFunction2 = { name: "\u0275\u0275pureFunction2", moduleName: CORE };
_Identifiers.pureFunction3 = { name: "\u0275\u0275pureFunction3", moduleName: CORE };
_Identifiers.pureFunction4 = { name: "\u0275\u0275pureFunction4", moduleName: CORE };
_Identifiers.pureFunction5 = { name: "\u0275\u0275pureFunction5", moduleName: CORE };
_Identifiers.pureFunction6 = { name: "\u0275\u0275pureFunction6", moduleName: CORE };
_Identifiers.pureFunction7 = { name: "\u0275\u0275pureFunction7", moduleName: CORE };
_Identifiers.pureFunction8 = { name: "\u0275\u0275pureFunction8", moduleName: CORE };
_Identifiers.pureFunctionV = { name: "\u0275\u0275pureFunctionV", moduleName: CORE };
_Identifiers.pipeBind1 = { name: "\u0275\u0275pipeBind1", moduleName: CORE };
_Identifiers.pipeBind2 = { name: "\u0275\u0275pipeBind2", moduleName: CORE };
_Identifiers.pipeBind3 = { name: "\u0275\u0275pipeBind3", moduleName: CORE };
_Identifiers.pipeBind4 = { name: "\u0275\u0275pipeBind4", moduleName: CORE };
_Identifiers.pipeBindV = { name: "\u0275\u0275pipeBindV", moduleName: CORE };
_Identifiers.hostProperty = { name: "\u0275\u0275hostProperty", moduleName: CORE };
_Identifiers.property = { name: "\u0275\u0275property", moduleName: CORE };
_Identifiers.propertyInterpolate = { name: "\u0275\u0275propertyInterpolate", moduleName: CORE };
_Identifiers.propertyInterpolate1 = { name: "\u0275\u0275propertyInterpolate1", moduleName: CORE };
_Identifiers.propertyInterpolate2 = { name: "\u0275\u0275propertyInterpolate2", moduleName: CORE };
_Identifiers.propertyInterpolate3 = { name: "\u0275\u0275propertyInterpolate3", moduleName: CORE };
_Identifiers.propertyInterpolate4 = { name: "\u0275\u0275propertyInterpolate4", moduleName: CORE };
_Identifiers.propertyInterpolate5 = { name: "\u0275\u0275propertyInterpolate5", moduleName: CORE };
_Identifiers.propertyInterpolate6 = { name: "\u0275\u0275propertyInterpolate6", moduleName: CORE };
_Identifiers.propertyInterpolate7 = { name: "\u0275\u0275propertyInterpolate7", moduleName: CORE };
_Identifiers.propertyInterpolate8 = { name: "\u0275\u0275propertyInterpolate8", moduleName: CORE };
_Identifiers.propertyInterpolateV = { name: "\u0275\u0275propertyInterpolateV", moduleName: CORE };
_Identifiers.i18n = { name: "\u0275\u0275i18n", moduleName: CORE };
_Identifiers.i18nAttributes = { name: "\u0275\u0275i18nAttributes", moduleName: CORE };
_Identifiers.i18nExp = { name: "\u0275\u0275i18nExp", moduleName: CORE };
_Identifiers.i18nStart = { name: "\u0275\u0275i18nStart", moduleName: CORE };
_Identifiers.i18nEnd = { name: "\u0275\u0275i18nEnd", moduleName: CORE };
_Identifiers.i18nApply = { name: "\u0275\u0275i18nApply", moduleName: CORE };
_Identifiers.i18nPostprocess = { name: "\u0275\u0275i18nPostprocess", moduleName: CORE };
_Identifiers.pipe = { name: "\u0275\u0275pipe", moduleName: CORE };
_Identifiers.projection = { name: "\u0275\u0275projection", moduleName: CORE };
_Identifiers.projectionDef = { name: "\u0275\u0275projectionDef", moduleName: CORE };
_Identifiers.reference = { name: "\u0275\u0275reference", moduleName: CORE };
_Identifiers.inject = { name: "\u0275\u0275inject", moduleName: CORE };
_Identifiers.injectAttribute = { name: "\u0275\u0275injectAttribute", moduleName: CORE };
_Identifiers.directiveInject = { name: "\u0275\u0275directiveInject", moduleName: CORE };
_Identifiers.invalidFactory = { name: "\u0275\u0275invalidFactory", moduleName: CORE };
_Identifiers.invalidFactoryDep = { name: "\u0275\u0275invalidFactoryDep", moduleName: CORE };
_Identifiers.templateRefExtractor = { name: "\u0275\u0275templateRefExtractor", moduleName: CORE };
_Identifiers.forwardRef = { name: "forwardRef", moduleName: CORE };
_Identifiers.resolveForwardRef = { name: "resolveForwardRef", moduleName: CORE };
_Identifiers.\u0275\u0275defineInjectable = { name: "\u0275\u0275defineInjectable", moduleName: CORE };
_Identifiers.declareInjectable = { name: "\u0275\u0275ngDeclareInjectable", moduleName: CORE };
_Identifiers.InjectableDeclaration = { name: "\u0275\u0275InjectableDeclaration", moduleName: CORE };
_Identifiers.resolveWindow = { name: "\u0275\u0275resolveWindow", moduleName: CORE };
_Identifiers.resolveDocument = { name: "\u0275\u0275resolveDocument", moduleName: CORE };
_Identifiers.resolveBody = { name: "\u0275\u0275resolveBody", moduleName: CORE };
_Identifiers.defineComponent = { name: "\u0275\u0275defineComponent", moduleName: CORE };
_Identifiers.declareComponent = { name: "\u0275\u0275ngDeclareComponent", moduleName: CORE };
_Identifiers.setComponentScope = { name: "\u0275\u0275setComponentScope", moduleName: CORE };
_Identifiers.ChangeDetectionStrategy = {
  name: "ChangeDetectionStrategy",
  moduleName: CORE
};
_Identifiers.ViewEncapsulation = {
  name: "ViewEncapsulation",
  moduleName: CORE
};
_Identifiers.ComponentDeclaration = {
  name: "\u0275\u0275ComponentDeclaration",
  moduleName: CORE
};
_Identifiers.FactoryDeclaration = {
  name: "\u0275\u0275FactoryDeclaration",
  moduleName: CORE
};
_Identifiers.declareFactory = { name: "\u0275\u0275ngDeclareFactory", moduleName: CORE };
_Identifiers.FactoryTarget = { name: "\u0275\u0275FactoryTarget", moduleName: CORE };
_Identifiers.defineDirective = { name: "\u0275\u0275defineDirective", moduleName: CORE };
_Identifiers.declareDirective = { name: "\u0275\u0275ngDeclareDirective", moduleName: CORE };
_Identifiers.DirectiveDeclaration = {
  name: "\u0275\u0275DirectiveDeclaration",
  moduleName: CORE
};
_Identifiers.InjectorDef = { name: "\u0275\u0275InjectorDef", moduleName: CORE };
_Identifiers.InjectorDeclaration = { name: "\u0275\u0275InjectorDeclaration", moduleName: CORE };
_Identifiers.defineInjector = { name: "\u0275\u0275defineInjector", moduleName: CORE };
_Identifiers.declareInjector = { name: "\u0275\u0275ngDeclareInjector", moduleName: CORE };
_Identifiers.NgModuleDeclaration = {
  name: "\u0275\u0275NgModuleDeclaration",
  moduleName: CORE
};
_Identifiers.ModuleWithProviders = {
  name: "ModuleWithProviders",
  moduleName: CORE
};
_Identifiers.defineNgModule = { name: "\u0275\u0275defineNgModule", moduleName: CORE };
_Identifiers.declareNgModule = { name: "\u0275\u0275ngDeclareNgModule", moduleName: CORE };
_Identifiers.setNgModuleScope = { name: "\u0275\u0275setNgModuleScope", moduleName: CORE };
_Identifiers.registerNgModuleType = { name: "\u0275\u0275registerNgModuleType", moduleName: CORE };
_Identifiers.PipeDeclaration = { name: "\u0275\u0275PipeDeclaration", moduleName: CORE };
_Identifiers.definePipe = { name: "\u0275\u0275definePipe", moduleName: CORE };
_Identifiers.declarePipe = { name: "\u0275\u0275ngDeclarePipe", moduleName: CORE };
_Identifiers.declareClassMetadata = { name: "\u0275\u0275ngDeclareClassMetadata", moduleName: CORE };
_Identifiers.setClassMetadata = { name: "\u0275setClassMetadata", moduleName: CORE };
_Identifiers.queryRefresh = { name: "\u0275\u0275queryRefresh", moduleName: CORE };
_Identifiers.viewQuery = { name: "\u0275\u0275viewQuery", moduleName: CORE };
_Identifiers.loadQuery = { name: "\u0275\u0275loadQuery", moduleName: CORE };
_Identifiers.contentQuery = { name: "\u0275\u0275contentQuery", moduleName: CORE };
_Identifiers.NgOnChangesFeature = { name: "\u0275\u0275NgOnChangesFeature", moduleName: CORE };
_Identifiers.InheritDefinitionFeature = { name: "\u0275\u0275InheritDefinitionFeature", moduleName: CORE };
_Identifiers.CopyDefinitionFeature = { name: "\u0275\u0275CopyDefinitionFeature", moduleName: CORE };
_Identifiers.StandaloneFeature = { name: "\u0275\u0275StandaloneFeature", moduleName: CORE };
_Identifiers.ProvidersFeature = { name: "\u0275\u0275ProvidersFeature", moduleName: CORE };
_Identifiers.HostDirectivesFeature = { name: "\u0275\u0275HostDirectivesFeature", moduleName: CORE };
_Identifiers.InputTransformsFeatureFeature = { name: "\u0275\u0275InputTransformsFeature", moduleName: CORE };
_Identifiers.listener = { name: "\u0275\u0275listener", moduleName: CORE };
_Identifiers.getInheritedFactory = {
  name: "\u0275\u0275getInheritedFactory",
  moduleName: CORE
};
_Identifiers.sanitizeHtml = { name: "\u0275\u0275sanitizeHtml", moduleName: CORE };
_Identifiers.sanitizeStyle = { name: "\u0275\u0275sanitizeStyle", moduleName: CORE };
_Identifiers.sanitizeResourceUrl = { name: "\u0275\u0275sanitizeResourceUrl", moduleName: CORE };
_Identifiers.sanitizeScript = { name: "\u0275\u0275sanitizeScript", moduleName: CORE };
_Identifiers.sanitizeUrl = { name: "\u0275\u0275sanitizeUrl", moduleName: CORE };
_Identifiers.sanitizeUrlOrResourceUrl = { name: "\u0275\u0275sanitizeUrlOrResourceUrl", moduleName: CORE };
_Identifiers.trustConstantHtml = { name: "\u0275\u0275trustConstantHtml", moduleName: CORE };
_Identifiers.trustConstantResourceUrl = { name: "\u0275\u0275trustConstantResourceUrl", moduleName: CORE };
_Identifiers.validateIframeAttribute = { name: "\u0275\u0275validateIframeAttribute", moduleName: CORE };
var Identifiers = _Identifiers;
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
  return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
}
function splitAtColon(input, defaultValues) {
  return _splitAt(input, ":", defaultValues);
}
function splitAtPeriod(input, defaultValues) {
  return _splitAt(input, ".", defaultValues);
}
function _splitAt(input, character, defaultValues) {
  const characterIndex = input.indexOf(character);
  if (characterIndex == -1)
    return defaultValues;
  return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
}
function noUndefined(val) {
  return val === void 0 ? null : val;
}
function error(msg) {
  throw new Error(`Internal Error: ${msg}`);
}
function utf8Encode(str) {
  let encoded = [];
  for (let index = 0; index < str.length; index++) {
    let codePoint = str.charCodeAt(index);
    if (codePoint >= 55296 && codePoint <= 56319 && str.length > index + 1) {
      const low = str.charCodeAt(index + 1);
      if (low >= 56320 && low <= 57343) {
        index++;
        codePoint = (codePoint - 55296 << 10) + low - 56320 + 65536;
      }
    }
    if (codePoint <= 127) {
      encoded.push(codePoint);
    } else if (codePoint <= 2047) {
      encoded.push(codePoint >> 6 & 31 | 192, codePoint & 63 | 128);
    } else if (codePoint <= 65535) {
      encoded.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
    } else if (codePoint <= 2097151) {
      encoded.push(codePoint >> 18 & 7 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
    }
  }
  return encoded;
}
function stringify(token) {
  if (typeof token === "string") {
    return token;
  }
  if (Array.isArray(token)) {
    return "[" + token.map(stringify).join(", ") + "]";
  }
  if (token == null) {
    return "" + token;
  }
  if (token.overriddenName) {
    return `${token.overriddenName}`;
  }
  if (token.name) {
    return `${token.name}`;
  }
  if (!token.toString) {
    return "object";
  }
  const res = token.toString();
  if (res == null) {
    return "" + res;
  }
  const newLineIndex = res.indexOf("\n");
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
var Version = class {
  constructor(full) {
    this.full = full;
    const splits = full.split(".");
    this.major = splits[0];
    this.minor = splits[1];
    this.patch = splits.slice(2).join(".");
  }
};
var _global = globalThis;
function partitionArray(arr, conditionFn) {
  const truthy = [];
  const falsy = [];
  for (const item of arr) {
    (conditionFn(item) ? truthy : falsy).push(item);
  }
  return [truthy, falsy];
}
var VERSION$1 = 3;
var JS_B64_PREFIX = "# sourceMappingURL=data:application/json;base64,";
var SourceMapGenerator = class {
  constructor(file = null) {
    this.file = file;
    this.sourcesContent = /* @__PURE__ */ new Map();
    this.lines = [];
    this.lastCol0 = 0;
    this.hasMappings = false;
  }
  // The content is `null` when the content is expected to be loaded using the URL
  addSource(url, content = null) {
    if (!this.sourcesContent.has(url)) {
      this.sourcesContent.set(url, content);
    }
    return this;
  }
  addLine() {
    this.lines.push([]);
    this.lastCol0 = 0;
    return this;
  }
  addMapping(col0, sourceUrl, sourceLine0, sourceCol0) {
    if (!this.currentLine) {
      throw new Error(`A line must be added before mappings can be added`);
    }
    if (sourceUrl != null && !this.sourcesContent.has(sourceUrl)) {
      throw new Error(`Unknown source file "${sourceUrl}"`);
    }
    if (col0 == null) {
      throw new Error(`The column in the generated code must be provided`);
    }
    if (col0 < this.lastCol0) {
      throw new Error(`Mapping should be added in output order`);
    }
    if (sourceUrl && (sourceLine0 == null || sourceCol0 == null)) {
      throw new Error(`The source location must be provided when a source url is provided`);
    }
    this.hasMappings = true;
    this.lastCol0 = col0;
    this.currentLine.push({ col0, sourceUrl, sourceLine0, sourceCol0 });
    return this;
  }
  /**
   * @internal strip this from published d.ts files due to
   * https://github.com/microsoft/TypeScript/issues/36216
   */
  get currentLine() {
    return this.lines.slice(-1)[0];
  }
  toJSON() {
    if (!this.hasMappings) {
      return null;
    }
    const sourcesIndex = /* @__PURE__ */ new Map();
    const sources = [];
    const sourcesContent = [];
    Array.from(this.sourcesContent.keys()).forEach((url, i) => {
      sourcesIndex.set(url, i);
      sources.push(url);
      sourcesContent.push(this.sourcesContent.get(url) || null);
    });
    let mappings = "";
    let lastCol0 = 0;
    let lastSourceIndex = 0;
    let lastSourceLine0 = 0;
    let lastSourceCol0 = 0;
    this.lines.forEach((segments) => {
      lastCol0 = 0;
      mappings += segments.map((segment) => {
        let segAsStr = toBase64VLQ(segment.col0 - lastCol0);
        lastCol0 = segment.col0;
        if (segment.sourceUrl != null) {
          segAsStr += toBase64VLQ(sourcesIndex.get(segment.sourceUrl) - lastSourceIndex);
          lastSourceIndex = sourcesIndex.get(segment.sourceUrl);
          segAsStr += toBase64VLQ(segment.sourceLine0 - lastSourceLine0);
          lastSourceLine0 = segment.sourceLine0;
          segAsStr += toBase64VLQ(segment.sourceCol0 - lastSourceCol0);
          lastSourceCol0 = segment.sourceCol0;
        }
        return segAsStr;
      }).join(",");
      mappings += ";";
    });
    mappings = mappings.slice(0, -1);
    return {
      "file": this.file || "",
      "version": VERSION$1,
      "sourceRoot": "",
      "sources": sources,
      "sourcesContent": sourcesContent,
      "mappings": mappings
    };
  }
  toJsComment() {
    return this.hasMappings ? "//" + JS_B64_PREFIX + toBase64String(JSON.stringify(this, null, 0)) : "";
  }
};
function toBase64String(value) {
  let b64 = "";
  const encoded = utf8Encode(value);
  for (let i = 0; i < encoded.length; ) {
    const i1 = encoded[i++];
    const i2 = i < encoded.length ? encoded[i++] : null;
    const i3 = i < encoded.length ? encoded[i++] : null;
    b64 += toBase64Digit(i1 >> 2);
    b64 += toBase64Digit((i1 & 3) << 4 | (i2 === null ? 0 : i2 >> 4));
    b64 += i2 === null ? "=" : toBase64Digit((i2 & 15) << 2 | (i3 === null ? 0 : i3 >> 6));
    b64 += i2 === null || i3 === null ? "=" : toBase64Digit(i3 & 63);
  }
  return b64;
}
function toBase64VLQ(value) {
  value = value < 0 ? (-value << 1) + 1 : value << 1;
  let out = "";
  do {
    let digit = value & 31;
    value = value >> 5;
    if (value > 0) {
      digit = digit | 32;
    }
    out += toBase64Digit(digit);
  } while (value > 0);
  return out;
}
var B64_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function toBase64Digit(value) {
  if (value < 0 || value >= 64) {
    throw new Error(`Can only encode value in the range [0, 63]`);
  }
  return B64_DIGITS[value];
}
var _SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
var _LEGAL_IDENTIFIER_RE = /^[$A-Z_][0-9A-Z_$]*$/i;
var _INDENT_WITH = "  ";
var _EmittedLine = class {
  constructor(indent) {
    this.indent = indent;
    this.partsLength = 0;
    this.parts = [];
    this.srcSpans = [];
  }
};
var EmitterVisitorContext = class _EmitterVisitorContext {
  static createRoot() {
    return new _EmitterVisitorContext(0);
  }
  constructor(_indent) {
    this._indent = _indent;
    this._lines = [new _EmittedLine(_indent)];
  }
  /**
   * @internal strip this from published d.ts files due to
   * https://github.com/microsoft/TypeScript/issues/36216
   */
  get _currentLine() {
    return this._lines[this._lines.length - 1];
  }
  println(from, lastPart = "") {
    this.print(from || null, lastPart, true);
  }
  lineIsEmpty() {
    return this._currentLine.parts.length === 0;
  }
  lineLength() {
    return this._currentLine.indent * _INDENT_WITH.length + this._currentLine.partsLength;
  }
  print(from, part, newLine = false) {
    if (part.length > 0) {
      this._currentLine.parts.push(part);
      this._currentLine.partsLength += part.length;
      this._currentLine.srcSpans.push(from && from.sourceSpan || null);
    }
    if (newLine) {
      this._lines.push(new _EmittedLine(this._indent));
    }
  }
  removeEmptyLastLine() {
    if (this.lineIsEmpty()) {
      this._lines.pop();
    }
  }
  incIndent() {
    this._indent++;
    if (this.lineIsEmpty()) {
      this._currentLine.indent = this._indent;
    }
  }
  decIndent() {
    this._indent--;
    if (this.lineIsEmpty()) {
      this._currentLine.indent = this._indent;
    }
  }
  toSource() {
    return this.sourceLines.map((l) => l.parts.length > 0 ? _createIndent(l.indent) + l.parts.join("") : "").join("\n");
  }
  toSourceMapGenerator(genFilePath, startsAtLine = 0) {
    const map = new SourceMapGenerator(genFilePath);
    let firstOffsetMapped = false;
    const mapFirstOffsetIfNeeded = () => {
      if (!firstOffsetMapped) {
        map.addSource(genFilePath, " ").addMapping(0, genFilePath, 0, 0);
        firstOffsetMapped = true;
      }
    };
    for (let i = 0; i < startsAtLine; i++) {
      map.addLine();
      mapFirstOffsetIfNeeded();
    }
    this.sourceLines.forEach((line, lineIdx) => {
      map.addLine();
      const spans = line.srcSpans;
      const parts = line.parts;
      let col0 = line.indent * _INDENT_WITH.length;
      let spanIdx = 0;
      while (spanIdx < spans.length && !spans[spanIdx]) {
        col0 += parts[spanIdx].length;
        spanIdx++;
      }
      if (spanIdx < spans.length && lineIdx === 0 && col0 === 0) {
        firstOffsetMapped = true;
      } else {
        mapFirstOffsetIfNeeded();
      }
      while (spanIdx < spans.length) {
        const span = spans[spanIdx];
        const source = span.start.file;
        const sourceLine = span.start.line;
        const sourceCol = span.start.col;
        map.addSource(source.url, source.content).addMapping(col0, source.url, sourceLine, sourceCol);
        col0 += parts[spanIdx].length;
        spanIdx++;
        while (spanIdx < spans.length && (span === spans[spanIdx] || !spans[spanIdx])) {
          col0 += parts[spanIdx].length;
          spanIdx++;
        }
      }
    });
    return map;
  }
  spanOf(line, column) {
    const emittedLine = this._lines[line];
    if (emittedLine) {
      let columnsLeft = column - _createIndent(emittedLine.indent).length;
      for (let partIndex = 0; partIndex < emittedLine.parts.length; partIndex++) {
        const part = emittedLine.parts[partIndex];
        if (part.length > columnsLeft) {
          return emittedLine.srcSpans[partIndex];
        }
        columnsLeft -= part.length;
      }
    }
    return null;
  }
  /**
   * @internal strip this from published d.ts files due to
   * https://github.com/microsoft/TypeScript/issues/36216
   */
  get sourceLines() {
    if (this._lines.length && this._lines[this._lines.length - 1].parts.length === 0) {
      return this._lines.slice(0, -1);
    }
    return this._lines;
  }
};
var AbstractEmitterVisitor = class {
  constructor(_escapeDollarInStrings) {
    this._escapeDollarInStrings = _escapeDollarInStrings;
  }
  printLeadingComments(stmt, ctx) {
    if (stmt.leadingComments === void 0) {
      return;
    }
    for (const comment of stmt.leadingComments) {
      if (comment instanceof JSDocComment) {
        ctx.print(stmt, `/*${comment.toString()}*/`, comment.trailingNewline);
      } else {
        if (comment.multiline) {
          ctx.print(stmt, `/* ${comment.text} */`, comment.trailingNewline);
        } else {
          comment.text.split("\n").forEach((line) => {
            ctx.println(stmt, `// ${line}`);
          });
        }
      }
    }
  }
  visitExpressionStmt(stmt, ctx) {
    this.printLeadingComments(stmt, ctx);
    stmt.expr.visitExpression(this, ctx);
    ctx.println(stmt, ";");
    return null;
  }
  visitReturnStmt(stmt, ctx) {
    this.printLeadingComments(stmt, ctx);
    ctx.print(stmt, `return `);
    stmt.value.visitExpression(this, ctx);
    ctx.println(stmt, ";");
    return null;
  }
  visitIfStmt(stmt, ctx) {
    this.printLeadingComments(stmt, ctx);
    ctx.print(stmt, `if (`);
    stmt.condition.visitExpression(this, ctx);
    ctx.print(stmt, `) {`);
    const hasElseCase = stmt.falseCase != null && stmt.falseCase.length > 0;
    if (stmt.trueCase.length <= 1 && !hasElseCase) {
      ctx.print(stmt, ` `);
      this.visitAllStatements(stmt.trueCase, ctx);
      ctx.removeEmptyLastLine();
      ctx.print(stmt, ` `);
    } else {
      ctx.println();
      ctx.incIndent();
      this.visitAllStatements(stmt.trueCase, ctx);
      ctx.decIndent();
      if (hasElseCase) {
        ctx.println(stmt, `} else {`);
        ctx.incIndent();
        this.visitAllStatements(stmt.falseCase, ctx);
        ctx.decIndent();
      }
    }
    ctx.println(stmt, `}`);
    return null;
  }
  visitWriteVarExpr(expr, ctx) {
    const lineWasEmpty = ctx.lineIsEmpty();
    if (!lineWasEmpty) {
      ctx.print(expr, "(");
    }
    ctx.print(expr, `${expr.name} = `);
    expr.value.visitExpression(this, ctx);
    if (!lineWasEmpty) {
      ctx.print(expr, ")");
    }
    return null;
  }
  visitWriteKeyExpr(expr, ctx) {
    const lineWasEmpty = ctx.lineIsEmpty();
    if (!lineWasEmpty) {
      ctx.print(expr, "(");
    }
    expr.receiver.visitExpression(this, ctx);
    ctx.print(expr, `[`);
    expr.index.visitExpression(this, ctx);
    ctx.print(expr, `] = `);
    expr.value.visitExpression(this, ctx);
    if (!lineWasEmpty) {
      ctx.print(expr, ")");
    }
    return null;
  }
  visitWritePropExpr(expr, ctx) {
    const lineWasEmpty = ctx.lineIsEmpty();
    if (!lineWasEmpty) {
      ctx.print(expr, "(");
    }
    expr.receiver.visitExpression(this, ctx);
    ctx.print(expr, `.${expr.name} = `);
    expr.value.visitExpression(this, ctx);
    if (!lineWasEmpty) {
      ctx.print(expr, ")");
    }
    return null;
  }
  visitInvokeFunctionExpr(expr, ctx) {
    expr.fn.visitExpression(this, ctx);
    ctx.print(expr, `(`);
    this.visitAllExpressions(expr.args, ctx, ",");
    ctx.print(expr, `)`);
    return null;
  }
  visitTaggedTemplateExpr(expr, ctx) {
    expr.tag.visitExpression(this, ctx);
    ctx.print(expr, "`" + expr.template.elements[0].rawText);
    for (let i = 1; i < expr.template.elements.length; i++) {
      ctx.print(expr, "${");
      expr.template.expressions[i - 1].visitExpression(this, ctx);
      ctx.print(expr, `}${expr.template.elements[i].rawText}`);
    }
    ctx.print(expr, "`");
    return null;
  }
  visitWrappedNodeExpr(ast, ctx) {
    throw new Error("Abstract emitter cannot visit WrappedNodeExpr.");
  }
  visitTypeofExpr(expr, ctx) {
    ctx.print(expr, "typeof ");
    expr.expr.visitExpression(this, ctx);
  }
  visitReadVarExpr(ast, ctx) {
    ctx.print(ast, ast.name);
    return null;
  }
  visitInstantiateExpr(ast, ctx) {
    ctx.print(ast, `new `);
    ast.classExpr.visitExpression(this, ctx);
    ctx.print(ast, `(`);
    this.visitAllExpressions(ast.args, ctx, ",");
    ctx.print(ast, `)`);
    return null;
  }
  visitLiteralExpr(ast, ctx) {
    const value = ast.value;
    if (typeof value === "string") {
      ctx.print(ast, escapeIdentifier(value, this._escapeDollarInStrings));
    } else {
      ctx.print(ast, `${value}`);
    }
    return null;
  }
  visitLocalizedString(ast, ctx) {
    const head = ast.serializeI18nHead();
    ctx.print(ast, "$localize `" + head.raw);
    for (let i = 1; i < ast.messageParts.length; i++) {
      ctx.print(ast, "${");
      ast.expressions[i - 1].visitExpression(this, ctx);
      ctx.print(ast, `}${ast.serializeI18nTemplatePart(i).raw}`);
    }
    ctx.print(ast, "`");
    return null;
  }
  visitConditionalExpr(ast, ctx) {
    ctx.print(ast, `(`);
    ast.condition.visitExpression(this, ctx);
    ctx.print(ast, "? ");
    ast.trueCase.visitExpression(this, ctx);
    ctx.print(ast, ": ");
    ast.falseCase.visitExpression(this, ctx);
    ctx.print(ast, `)`);
    return null;
  }
  visitDynamicImportExpr(ast, ctx) {
    ctx.print(ast, `import(${ast.url})`);
  }
  visitNotExpr(ast, ctx) {
    ctx.print(ast, "!");
    ast.condition.visitExpression(this, ctx);
    return null;
  }
  visitUnaryOperatorExpr(ast, ctx) {
    let opStr;
    switch (ast.operator) {
      case UnaryOperator.Plus:
        opStr = "+";
        break;
      case UnaryOperator.Minus:
        opStr = "-";
        break;
      default:
        throw new Error(`Unknown operator ${ast.operator}`);
    }
    if (ast.parens)
      ctx.print(ast, `(`);
    ctx.print(ast, opStr);
    ast.expr.visitExpression(this, ctx);
    if (ast.parens)
      ctx.print(ast, `)`);
    return null;
  }
  visitBinaryOperatorExpr(ast, ctx) {
    let opStr;
    switch (ast.operator) {
      case BinaryOperator.Equals:
        opStr = "==";
        break;
      case BinaryOperator.Identical:
        opStr = "===";
        break;
      case BinaryOperator.NotEquals:
        opStr = "!=";
        break;
      case BinaryOperator.NotIdentical:
        opStr = "!==";
        break;
      case BinaryOperator.And:
        opStr = "&&";
        break;
      case BinaryOperator.BitwiseAnd:
        opStr = "&";
        break;
      case BinaryOperator.Or:
        opStr = "||";
        break;
      case BinaryOperator.Plus:
        opStr = "+";
        break;
      case BinaryOperator.Minus:
        opStr = "-";
        break;
      case BinaryOperator.Divide:
        opStr = "/";
        break;
      case BinaryOperator.Multiply:
        opStr = "*";
        break;
      case BinaryOperator.Modulo:
        opStr = "%";
        break;
      case BinaryOperator.Lower:
        opStr = "<";
        break;
      case BinaryOperator.LowerEquals:
        opStr = "<=";
        break;
      case BinaryOperator.Bigger:
        opStr = ">";
        break;
      case BinaryOperator.BiggerEquals:
        opStr = ">=";
        break;
      case BinaryOperator.NullishCoalesce:
        opStr = "??";
        break;
      default:
        throw new Error(`Unknown operator ${ast.operator}`);
    }
    if (ast.parens)
      ctx.print(ast, `(`);
    ast.lhs.visitExpression(this, ctx);
    ctx.print(ast, ` ${opStr} `);
    ast.rhs.visitExpression(this, ctx);
    if (ast.parens)
      ctx.print(ast, `)`);
    return null;
  }
  visitReadPropExpr(ast, ctx) {
    ast.receiver.visitExpression(this, ctx);
    ctx.print(ast, `.`);
    ctx.print(ast, ast.name);
    return null;
  }
  visitReadKeyExpr(ast, ctx) {
    ast.receiver.visitExpression(this, ctx);
    ctx.print(ast, `[`);
    ast.index.visitExpression(this, ctx);
    ctx.print(ast, `]`);
    return null;
  }
  visitLiteralArrayExpr(ast, ctx) {
    ctx.print(ast, `[`);
    this.visitAllExpressions(ast.entries, ctx, ",");
    ctx.print(ast, `]`);
    return null;
  }
  visitLiteralMapExpr(ast, ctx) {
    ctx.print(ast, `{`);
    this.visitAllObjects((entry) => {
      ctx.print(ast, `${escapeIdentifier(entry.key, this._escapeDollarInStrings, entry.quoted)}:`);
      entry.value.visitExpression(this, ctx);
    }, ast.entries, ctx, ",");
    ctx.print(ast, `}`);
    return null;
  }
  visitCommaExpr(ast, ctx) {
    ctx.print(ast, "(");
    this.visitAllExpressions(ast.parts, ctx, ",");
    ctx.print(ast, ")");
    return null;
  }
  visitAllExpressions(expressions, ctx, separator) {
    this.visitAllObjects((expr) => expr.visitExpression(this, ctx), expressions, ctx, separator);
  }
  visitAllObjects(handler, expressions, ctx, separator) {
    let incrementedIndent = false;
    for (let i = 0; i < expressions.length; i++) {
      if (i > 0) {
        if (ctx.lineLength() > 80) {
          ctx.print(null, separator, true);
          if (!incrementedIndent) {
            ctx.incIndent();
            ctx.incIndent();
            incrementedIndent = true;
          }
        } else {
          ctx.print(null, separator, false);
        }
      }
      handler(expressions[i]);
    }
    if (incrementedIndent) {
      ctx.decIndent();
      ctx.decIndent();
    }
  }
  visitAllStatements(statements, ctx) {
    statements.forEach((stmt) => stmt.visitStatement(this, ctx));
  }
};
function escapeIdentifier(input, escapeDollar, alwaysQuote = true) {
  if (input == null) {
    return null;
  }
  const body = input.replace(_SINGLE_QUOTE_ESCAPE_STRING_RE, (...match) => {
    if (match[0] == "$") {
      return escapeDollar ? "\\$" : "$";
    } else if (match[0] == "\n") {
      return "\\n";
    } else if (match[0] == "\r") {
      return "\\r";
    } else {
      return `\\${match[0]}`;
    }
  });
  const requiresQuotes = alwaysQuote || !_LEGAL_IDENTIFIER_RE.test(body);
  return requiresQuotes ? `'${body}'` : body;
}
function _createIndent(count) {
  let res = "";
  for (let i = 0; i < count; i++) {
    res += _INDENT_WITH;
  }
  return res;
}
function typeWithParameters(type, numParams) {
  if (numParams === 0) {
    return expressionType(type);
  }
  const params = [];
  for (let i = 0; i < numParams; i++) {
    params.push(DYNAMIC_TYPE);
  }
  return expressionType(type, void 0, params);
}
var ANIMATE_SYMBOL_PREFIX = "@";
function prepareSyntheticPropertyName(name) {
  return `${ANIMATE_SYMBOL_PREFIX}${name}`;
}
function prepareSyntheticListenerName(name, phase) {
  return `${ANIMATE_SYMBOL_PREFIX}${name}.${phase}`;
}
function getSafePropertyAccessString(accessor, name) {
  const escapedName = escapeIdentifier(name, false, false);
  return escapedName !== name ? `${accessor}[${escapedName}]` : `${accessor}.${name}`;
}
function prepareSyntheticListenerFunctionName(name, phase) {
  return `animation_${name}_${phase}`;
}
function jitOnlyGuardedExpression(expr) {
  return guardedExpression("ngJitMode", expr);
}
function guardedExpression(guard, expr) {
  const guardExpr = new ExternalExpr({ name: guard, moduleName: null });
  const guardNotDefined = new BinaryOperatorExpr(BinaryOperator.Identical, new TypeofExpr(guardExpr), literal("undefined"));
  const guardUndefinedOrTrue = new BinaryOperatorExpr(
    BinaryOperator.Or,
    guardNotDefined,
    guardExpr,
    /* type */
    void 0,
    /* sourceSpan */
    void 0,
    true
  );
  return new BinaryOperatorExpr(BinaryOperator.And, guardUndefinedOrTrue, expr);
}
function wrapReference(value) {
  const wrapped = new WrappedNodeExpr(value);
  return { value: wrapped, type: wrapped };
}
function refsToArray(refs, shouldForwardDeclare) {
  const values = literalArr(refs.map((ref) => ref.value));
  return shouldForwardDeclare ? fn([], [new ReturnStatement(values)]) : values;
}
function createMayBeForwardRefExpression(expression, forwardRef) {
  return { expression, forwardRef };
}
function convertFromMaybeForwardRefExpression({ expression, forwardRef }) {
  switch (forwardRef) {
    case 0:
    case 1:
      return expression;
    case 2:
      return generateForwardRef(expression);
  }
}
function generateForwardRef(expr) {
  return importExpr(Identifiers.forwardRef).callFn([fn([], [new ReturnStatement(expr)])]);
}
var R3FactoryDelegateType;
(function(R3FactoryDelegateType2) {
  R3FactoryDelegateType2[R3FactoryDelegateType2["Class"] = 0] = "Class";
  R3FactoryDelegateType2[R3FactoryDelegateType2["Function"] = 1] = "Function";
})(R3FactoryDelegateType || (R3FactoryDelegateType = {}));
var FactoryTarget$1;
(function(FactoryTarget2) {
  FactoryTarget2[FactoryTarget2["Directive"] = 0] = "Directive";
  FactoryTarget2[FactoryTarget2["Component"] = 1] = "Component";
  FactoryTarget2[FactoryTarget2["Injectable"] = 2] = "Injectable";
  FactoryTarget2[FactoryTarget2["Pipe"] = 3] = "Pipe";
  FactoryTarget2[FactoryTarget2["NgModule"] = 4] = "NgModule";
})(FactoryTarget$1 || (FactoryTarget$1 = {}));
function compileFactoryFunction(meta) {
  const t = variable("t");
  let baseFactoryVar = null;
  const typeForCtor = !isDelegatedFactoryMetadata(meta) ? new BinaryOperatorExpr(BinaryOperator.Or, t, meta.type.value) : t;
  let ctorExpr = null;
  if (meta.deps !== null) {
    if (meta.deps !== "invalid") {
      ctorExpr = new InstantiateExpr(typeForCtor, injectDependencies(meta.deps, meta.target));
    }
  } else {
    baseFactoryVar = variable(`\u0275${meta.name}_BaseFactory`);
    ctorExpr = baseFactoryVar.callFn([typeForCtor]);
  }
  const body = [];
  let retExpr = null;
  function makeConditionalFactory(nonCtorExpr) {
    const r = variable("r");
    body.push(r.set(NULL_EXPR).toDeclStmt());
    const ctorStmt = ctorExpr !== null ? r.set(ctorExpr).toStmt() : importExpr(Identifiers.invalidFactory).callFn([]).toStmt();
    body.push(ifStmt(t, [ctorStmt], [r.set(nonCtorExpr).toStmt()]));
    return r;
  }
  if (isDelegatedFactoryMetadata(meta)) {
    const delegateArgs = injectDependencies(meta.delegateDeps, meta.target);
    const factoryExpr = new (meta.delegateType === R3FactoryDelegateType.Class ? InstantiateExpr : InvokeFunctionExpr)(meta.delegate, delegateArgs);
    retExpr = makeConditionalFactory(factoryExpr);
  } else if (isExpressionFactoryMetadata(meta)) {
    retExpr = makeConditionalFactory(meta.expression);
  } else {
    retExpr = ctorExpr;
  }
  if (retExpr === null) {
    body.push(importExpr(Identifiers.invalidFactory).callFn([]).toStmt());
  } else if (baseFactoryVar !== null) {
    const getInheritedFactoryCall = importExpr(Identifiers.getInheritedFactory).callFn([meta.type.value]);
    const baseFactory = new BinaryOperatorExpr(BinaryOperator.Or, baseFactoryVar, baseFactoryVar.set(getInheritedFactoryCall));
    body.push(new ReturnStatement(baseFactory.callFn([typeForCtor])));
  } else {
    body.push(new ReturnStatement(retExpr));
  }
  let factoryFn = fn([new FnParam("t", DYNAMIC_TYPE)], body, INFERRED_TYPE, void 0, `${meta.name}_Factory`);
  if (baseFactoryVar !== null) {
    factoryFn = fn([], [
      new DeclareVarStmt(baseFactoryVar.name),
      new ReturnStatement(factoryFn)
    ]).callFn(
      [],
      /* sourceSpan */
      void 0,
      /* pure */
      true
    );
  }
  return {
    expression: factoryFn,
    statements: [],
    type: createFactoryType(meta)
  };
}
function createFactoryType(meta) {
  const ctorDepsType = meta.deps !== null && meta.deps !== "invalid" ? createCtorDepsType(meta.deps) : NONE_TYPE;
  return expressionType(importExpr(Identifiers.FactoryDeclaration, [typeWithParameters(meta.type.type, meta.typeArgumentCount), ctorDepsType]));
}
function injectDependencies(deps, target) {
  return deps.map((dep, index) => compileInjectDependency(dep, target, index));
}
function compileInjectDependency(dep, target, index) {
  if (dep.token === null) {
    return importExpr(Identifiers.invalidFactoryDep).callFn([literal(index)]);
  } else if (dep.attributeNameType === null) {
    const flags = 0 | (dep.self ? 2 : 0) | (dep.skipSelf ? 4 : 0) | (dep.host ? 1 : 0) | (dep.optional ? 8 : 0) | (target === FactoryTarget$1.Pipe ? 16 : 0);
    let flagsParam = flags !== 0 || dep.optional ? literal(flags) : null;
    const injectArgs = [dep.token];
    if (flagsParam) {
      injectArgs.push(flagsParam);
    }
    const injectFn = getInjectFn(target);
    return importExpr(injectFn).callFn(injectArgs);
  } else {
    return importExpr(Identifiers.injectAttribute).callFn([dep.token]);
  }
}
function createCtorDepsType(deps) {
  let hasTypes = false;
  const attributeTypes = deps.map((dep) => {
    const type = createCtorDepType(dep);
    if (type !== null) {
      hasTypes = true;
      return type;
    } else {
      return literal(null);
    }
  });
  if (hasTypes) {
    return expressionType(literalArr(attributeTypes));
  } else {
    return NONE_TYPE;
  }
}
function createCtorDepType(dep) {
  const entries = [];
  if (dep.attributeNameType !== null) {
    entries.push({ key: "attribute", value: dep.attributeNameType, quoted: false });
  }
  if (dep.optional) {
    entries.push({ key: "optional", value: literal(true), quoted: false });
  }
  if (dep.host) {
    entries.push({ key: "host", value: literal(true), quoted: false });
  }
  if (dep.self) {
    entries.push({ key: "self", value: literal(true), quoted: false });
  }
  if (dep.skipSelf) {
    entries.push({ key: "skipSelf", value: literal(true), quoted: false });
  }
  return entries.length > 0 ? literalMap(entries) : null;
}
function isDelegatedFactoryMetadata(meta) {
  return meta.delegateType !== void 0;
}
function isExpressionFactoryMetadata(meta) {
  return meta.expression !== void 0;
}
function getInjectFn(target) {
  switch (target) {
    case FactoryTarget$1.Component:
    case FactoryTarget$1.Directive:
    case FactoryTarget$1.Pipe:
      return Identifiers.directiveInject;
    case FactoryTarget$1.NgModule:
    case FactoryTarget$1.Injectable:
    default:
      return Identifiers.inject;
  }
}
var Comment$1 = class {
  constructor(value, sourceSpan) {
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  visit(_visitor2) {
    throw new Error("visit() not implemented for Comment");
  }
};
var Text$3 = class {
  constructor(value, sourceSpan) {
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor) {
    return visitor.visitText(this);
  }
};
var BoundText = class {
  constructor(value, sourceSpan, i18n) {
    this.value = value;
    this.sourceSpan = sourceSpan;
    this.i18n = i18n;
  }
  visit(visitor) {
    return visitor.visitBoundText(this);
  }
};
var TextAttribute = class {
  constructor(name, value, sourceSpan, keySpan, valueSpan, i18n) {
    this.name = name;
    this.value = value;
    this.sourceSpan = sourceSpan;
    this.keySpan = keySpan;
    this.valueSpan = valueSpan;
    this.i18n = i18n;
  }
  visit(visitor) {
    return visitor.visitTextAttribute(this);
  }
};
var BoundAttribute = class _BoundAttribute {
  constructor(name, type, securityContext, value, unit, sourceSpan, keySpan, valueSpan, i18n) {
    this.name = name;
    this.type = type;
    this.securityContext = securityContext;
    this.value = value;
    this.unit = unit;
    this.sourceSpan = sourceSpan;
    this.keySpan = keySpan;
    this.valueSpan = valueSpan;
    this.i18n = i18n;
  }
  static fromBoundElementProperty(prop, i18n) {
    if (prop.keySpan === void 0) {
      throw new Error(`Unexpected state: keySpan must be defined for bound attributes but was not for ${prop.name}: ${prop.sourceSpan}`);
    }
    return new _BoundAttribute(prop.name, prop.type, prop.securityContext, prop.value, prop.unit, prop.sourceSpan, prop.keySpan, prop.valueSpan, i18n);
  }
  visit(visitor) {
    return visitor.visitBoundAttribute(this);
  }
};
var BoundEvent = class _BoundEvent {
  constructor(name, type, handler, target, phase, sourceSpan, handlerSpan, keySpan) {
    this.name = name;
    this.type = type;
    this.handler = handler;
    this.target = target;
    this.phase = phase;
    this.sourceSpan = sourceSpan;
    this.handlerSpan = handlerSpan;
    this.keySpan = keySpan;
  }
  static fromParsedEvent(event) {
    const target = event.type === 0 ? event.targetOrPhase : null;
    const phase = event.type === 1 ? event.targetOrPhase : null;
    if (event.keySpan === void 0) {
      throw new Error(`Unexpected state: keySpan must be defined for bound event but was not for ${event.name}: ${event.sourceSpan}`);
    }
    return new _BoundEvent(event.name, event.type, event.handler, target, phase, event.sourceSpan, event.handlerSpan, event.keySpan);
  }
  visit(visitor) {
    return visitor.visitBoundEvent(this);
  }
};
var Element$1 = class {
  constructor(name, attributes, inputs, outputs, children, references, sourceSpan, startSourceSpan, endSourceSpan, i18n) {
    this.name = name;
    this.attributes = attributes;
    this.inputs = inputs;
    this.outputs = outputs;
    this.children = children;
    this.references = references;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
    this.i18n = i18n;
  }
  visit(visitor) {
    return visitor.visitElement(this);
  }
};
var DeferredTrigger = class {
  constructor(sourceSpan) {
    this.sourceSpan = sourceSpan;
  }
  visit(visitor) {
    return visitor.visitDeferredTrigger(this);
  }
};
var BoundDeferredTrigger = class extends DeferredTrigger {
  constructor(value, sourceSpan) {
    super(sourceSpan);
    this.value = value;
  }
};
var IdleDeferredTrigger = class extends DeferredTrigger {
};
var ImmediateDeferredTrigger = class extends DeferredTrigger {
};
var HoverDeferredTrigger = class extends DeferredTrigger {
};
var TimerDeferredTrigger = class extends DeferredTrigger {
  constructor(delay, sourceSpan) {
    super(sourceSpan);
    this.delay = delay;
  }
};
var InteractionDeferredTrigger = class extends DeferredTrigger {
  constructor(reference2, sourceSpan) {
    super(sourceSpan);
    this.reference = reference2;
  }
};
var ViewportDeferredTrigger = class extends DeferredTrigger {
  constructor(reference2, sourceSpan) {
    super(sourceSpan);
    this.reference = reference2;
  }
};
var DeferredBlockPlaceholder = class {
  constructor(children, minimumTime, sourceSpan, startSourceSpan, endSourceSpan) {
    this.children = children;
    this.minimumTime = minimumTime;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor) {
    return visitor.visitDeferredBlockPlaceholder(this);
  }
};
var DeferredBlockLoading = class {
  constructor(children, afterTime, minimumTime, sourceSpan, startSourceSpan, endSourceSpan) {
    this.children = children;
    this.afterTime = afterTime;
    this.minimumTime = minimumTime;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor) {
    return visitor.visitDeferredBlockLoading(this);
  }
};
var DeferredBlockError = class {
  constructor(children, sourceSpan, startSourceSpan, endSourceSpan) {
    this.children = children;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor) {
    return visitor.visitDeferredBlockError(this);
  }
};
var DeferredBlock = class {
  constructor(children, triggers, prefetchTriggers, placeholder, loading, error2, sourceSpan, startSourceSpan, endSourceSpan) {
    this.children = children;
    this.triggers = triggers;
    this.prefetchTriggers = prefetchTriggers;
    this.placeholder = placeholder;
    this.loading = loading;
    this.error = error2;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor) {
    return visitor.visitDeferredBlock(this);
  }
};
var Template = class {
  constructor(tagName, attributes, inputs, outputs, templateAttrs, children, references, variables, sourceSpan, startSourceSpan, endSourceSpan, i18n) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.inputs = inputs;
    this.outputs = outputs;
    this.templateAttrs = templateAttrs;
    this.children = children;
    this.references = references;
    this.variables = variables;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
    this.i18n = i18n;
  }
  visit(visitor) {
    return visitor.visitTemplate(this);
  }
};
var Content = class {
  constructor(selector, attributes, sourceSpan, i18n) {
    this.selector = selector;
    this.attributes = attributes;
    this.sourceSpan = sourceSpan;
    this.i18n = i18n;
    this.name = "ng-content";
  }
  visit(visitor) {
    return visitor.visitContent(this);
  }
};
var Variable = class {
  constructor(name, value, sourceSpan, keySpan, valueSpan) {
    this.name = name;
    this.value = value;
    this.sourceSpan = sourceSpan;
    this.keySpan = keySpan;
    this.valueSpan = valueSpan;
  }
  visit(visitor) {
    return visitor.visitVariable(this);
  }
};
var Reference = class {
  constructor(name, value, sourceSpan, keySpan, valueSpan) {
    this.name = name;
    this.value = value;
    this.sourceSpan = sourceSpan;
    this.keySpan = keySpan;
    this.valueSpan = valueSpan;
  }
  visit(visitor) {
    return visitor.visitReference(this);
  }
};
var Icu$1 = class {
  constructor(vars, placeholders, sourceSpan, i18n) {
    this.vars = vars;
    this.placeholders = placeholders;
    this.sourceSpan = sourceSpan;
    this.i18n = i18n;
  }
  visit(visitor) {
    return visitor.visitIcu(this);
  }
};
function visitAll$1(visitor, nodes) {
  const result = [];
  if (visitor.visit) {
    for (const node of nodes) {
      visitor.visit(node) || node.visit(visitor);
    }
  } else {
    for (const node of nodes) {
      const newNode = node.visit(visitor);
      if (newNode) {
        result.push(newNode);
      }
    }
  }
  return result;
}
var Message = class {
  /**
   * @param nodes message AST
   * @param placeholders maps placeholder names to static content and their source spans
   * @param placeholderToMessage maps placeholder names to messages (used for nested ICU messages)
   * @param meaning
   * @param description
   * @param customId
   */
  constructor(nodes, placeholders, placeholderToMessage, meaning, description, customId) {
    this.nodes = nodes;
    this.placeholders = placeholders;
    this.placeholderToMessage = placeholderToMessage;
    this.meaning = meaning;
    this.description = description;
    this.customId = customId;
    this.legacyIds = [];
    this.id = this.customId;
    this.messageString = serializeMessage(this.nodes);
    if (nodes.length) {
      this.sources = [{
        filePath: nodes[0].sourceSpan.start.file.url,
        startLine: nodes[0].sourceSpan.start.line + 1,
        startCol: nodes[0].sourceSpan.start.col + 1,
        endLine: nodes[nodes.length - 1].sourceSpan.end.line + 1,
        endCol: nodes[0].sourceSpan.start.col + 1
      }];
    } else {
      this.sources = [];
    }
  }
};
var Text$2 = class {
  constructor(value, sourceSpan) {
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitText(this, context);
  }
};
var Container = class {
  constructor(children, sourceSpan) {
    this.children = children;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitContainer(this, context);
  }
};
var Icu = class {
  constructor(expression, type, cases, sourceSpan, expressionPlaceholder) {
    this.expression = expression;
    this.type = type;
    this.cases = cases;
    this.sourceSpan = sourceSpan;
    this.expressionPlaceholder = expressionPlaceholder;
  }
  visit(visitor, context) {
    return visitor.visitIcu(this, context);
  }
};
var TagPlaceholder = class {
  constructor(tag, attrs, startName, closeName, children, isVoid, sourceSpan, startSourceSpan, endSourceSpan) {
    this.tag = tag;
    this.attrs = attrs;
    this.startName = startName;
    this.closeName = closeName;
    this.children = children;
    this.isVoid = isVoid;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitTagPlaceholder(this, context);
  }
};
var Placeholder = class {
  constructor(value, name, sourceSpan) {
    this.value = value;
    this.name = name;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitPlaceholder(this, context);
  }
};
var IcuPlaceholder = class {
  constructor(value, name, sourceSpan) {
    this.value = value;
    this.name = name;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitIcuPlaceholder(this, context);
  }
};
function serializeMessage(messageNodes) {
  const visitor = new LocalizeMessageStringVisitor();
  const str = messageNodes.map((n) => n.visit(visitor)).join("");
  return str;
}
var LocalizeMessageStringVisitor = class {
  visitText(text2) {
    return text2.value;
  }
  visitContainer(container) {
    return container.children.map((child) => child.visit(this)).join("");
  }
  visitIcu(icu) {
    const strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
    return `{${icu.expressionPlaceholder}, ${icu.type}, ${strCases.join(" ")}}`;
  }
  visitTagPlaceholder(ph) {
    const children = ph.children.map((child) => child.visit(this)).join("");
    return `{$${ph.startName}}${children}{$${ph.closeName}}`;
  }
  visitPlaceholder(ph) {
    return `{$${ph.name}}`;
  }
  visitIcuPlaceholder(ph) {
    return `{$${ph.name}}`;
  }
};
var _Visitor$2 = class {
  visitTag(tag) {
    const strAttrs = this._serializeAttributes(tag.attrs);
    if (tag.children.length == 0) {
      return `<${tag.name}${strAttrs}/>`;
    }
    const strChildren = tag.children.map((node) => node.visit(this));
    return `<${tag.name}${strAttrs}>${strChildren.join("")}</${tag.name}>`;
  }
  visitText(text2) {
    return text2.value;
  }
  visitDeclaration(decl) {
    return `<?xml${this._serializeAttributes(decl.attrs)} ?>`;
  }
  _serializeAttributes(attrs) {
    const strAttrs = Object.keys(attrs).map((name) => `${name}="${attrs[name]}"`).join(" ");
    return strAttrs.length > 0 ? " " + strAttrs : "";
  }
  visitDoctype(doctype) {
    return `<!DOCTYPE ${doctype.rootTag} [
${doctype.dtd}
]>`;
  }
};
var _visitor = new _Visitor$2();
function toPublicName(internalName) {
  return internalName.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
}
var CLOSURE_TRANSLATION_VAR_PREFIX = "MSG_";
var TRANSLATION_VAR_PREFIX = "i18n_";
var I18N_ATTR = "i18n";
var I18N_ATTR_PREFIX = "i18n-";
var I18N_ICU_VAR_PREFIX = "VAR_";
var I18N_ICU_MAPPING_PREFIX = "I18N_EXP_";
var I18N_PLACEHOLDER_SYMBOL = "\uFFFD";
function isI18nAttribute(name) {
  return name === I18N_ATTR || name.startsWith(I18N_ATTR_PREFIX);
}
function isI18nRootNode(meta) {
  return meta instanceof Message;
}
function isSingleI18nIcu(meta) {
  return isI18nRootNode(meta) && meta.nodes.length === 1 && meta.nodes[0] instanceof Icu;
}
function hasI18nMeta(node) {
  return !!node.i18n;
}
function hasI18nAttrs(element2) {
  return element2.attrs.some((attr) => isI18nAttribute(attr.name));
}
function icuFromI18nMessage(message) {
  return message.nodes[0];
}
function wrapI18nPlaceholder(content, contextId = 0) {
  const blockId = contextId > 0 ? `:${contextId}` : "";
  return `${I18N_PLACEHOLDER_SYMBOL}${content}${blockId}${I18N_PLACEHOLDER_SYMBOL}`;
}
function assembleI18nBoundString(strings, bindingStartIndex = 0, contextId = 0) {
  if (!strings.length)
    return "";
  let acc = "";
  const lastIdx = strings.length - 1;
  for (let i = 0; i < lastIdx; i++) {
    acc += `${strings[i]}${wrapI18nPlaceholder(bindingStartIndex + i, contextId)}`;
  }
  acc += strings[lastIdx];
  return acc;
}
function getSeqNumberGenerator(startsAt = 0) {
  let current = startsAt;
  return () => current++;
}
function placeholdersToParams(placeholders) {
  const params = {};
  placeholders.forEach((values, key) => {
    params[key] = literal(values.length > 1 ? `[${values.join("|")}]` : values[0]);
  });
  return params;
}
function updatePlaceholderMap(map, name, ...values) {
  const current = map.get(name) || [];
  current.push(...values);
  map.set(name, current);
}
function assembleBoundTextPlaceholders(meta, bindingStartIndex = 0, contextId = 0) {
  const startIdx = bindingStartIndex;
  const placeholders = /* @__PURE__ */ new Map();
  const node = meta instanceof Message ? meta.nodes.find((node2) => node2 instanceof Container) : meta;
  if (node) {
    node.children.filter((child) => child instanceof Placeholder).forEach((child, idx) => {
      const content = wrapI18nPlaceholder(startIdx + idx, contextId);
      updatePlaceholderMap(placeholders, child.name, content);
    });
  }
  return placeholders;
}
function formatI18nPlaceholderNamesInMap(params = {}, useCamelCase) {
  const _params = {};
  if (params && Object.keys(params).length) {
    Object.keys(params).forEach((key) => _params[formatI18nPlaceholderName(key, useCamelCase)] = params[key]);
  }
  return _params;
}
function formatI18nPlaceholderName(name, useCamelCase = true) {
  const publicName = toPublicName(name);
  if (!useCamelCase) {
    return publicName;
  }
  const chunks = publicName.split("_");
  if (chunks.length === 1) {
    return name.toLowerCase();
  }
  let postfix;
  if (/^\d+$/.test(chunks[chunks.length - 1])) {
    postfix = chunks.pop();
  }
  let raw = chunks.shift().toLowerCase();
  if (chunks.length) {
    raw += chunks.map((c) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()).join("");
  }
  return postfix ? `${raw}_${postfix}` : raw;
}
function getTranslationConstPrefix(extra) {
  return `${CLOSURE_TRANSLATION_VAR_PREFIX}${extra}`.toUpperCase();
}
function declareI18nVariable(variable2) {
  return new DeclareVarStmt(variable2.name, void 0, INFERRED_TYPE, void 0, variable2.sourceSpan);
}
var UNSAFE_OBJECT_KEY_NAME_REGEXP = /[-.]/;
var TEMPORARY_NAME = "_t";
var CONTEXT_NAME = "ctx";
var RENDER_FLAGS = "rf";
var REFERENCE_PREFIX = "_r";
var IMPLICIT_REFERENCE = "$implicit";
var NON_BINDABLE_ATTR = "ngNonBindable";
var RESTORED_VIEW_CONTEXT_NAME = "restoredCtx";
var MAX_CHAIN_LENGTH = 500;
var CHAINABLE_INSTRUCTIONS = /* @__PURE__ */ new Set([
  Identifiers.element,
  Identifiers.elementStart,
  Identifiers.elementEnd,
  Identifiers.elementContainer,
  Identifiers.elementContainerStart,
  Identifiers.elementContainerEnd,
  Identifiers.i18nExp,
  Identifiers.listener,
  Identifiers.classProp,
  Identifiers.syntheticHostListener,
  Identifiers.hostProperty,
  Identifiers.syntheticHostProperty,
  Identifiers.property,
  Identifiers.propertyInterpolate1,
  Identifiers.propertyInterpolate2,
  Identifiers.propertyInterpolate3,
  Identifiers.propertyInterpolate4,
  Identifiers.propertyInterpolate5,
  Identifiers.propertyInterpolate6,
  Identifiers.propertyInterpolate7,
  Identifiers.propertyInterpolate8,
  Identifiers.propertyInterpolateV,
  Identifiers.attribute,
  Identifiers.attributeInterpolate1,
  Identifiers.attributeInterpolate2,
  Identifiers.attributeInterpolate3,
  Identifiers.attributeInterpolate4,
  Identifiers.attributeInterpolate5,
  Identifiers.attributeInterpolate6,
  Identifiers.attributeInterpolate7,
  Identifiers.attributeInterpolate8,
  Identifiers.attributeInterpolateV,
  Identifiers.styleProp,
  Identifiers.stylePropInterpolate1,
  Identifiers.stylePropInterpolate2,
  Identifiers.stylePropInterpolate3,
  Identifiers.stylePropInterpolate4,
  Identifiers.stylePropInterpolate5,
  Identifiers.stylePropInterpolate6,
  Identifiers.stylePropInterpolate7,
  Identifiers.stylePropInterpolate8,
  Identifiers.stylePropInterpolateV,
  Identifiers.textInterpolate,
  Identifiers.textInterpolate1,
  Identifiers.textInterpolate2,
  Identifiers.textInterpolate3,
  Identifiers.textInterpolate4,
  Identifiers.textInterpolate5,
  Identifiers.textInterpolate6,
  Identifiers.textInterpolate7,
  Identifiers.textInterpolate8,
  Identifiers.textInterpolateV
]);
function invokeInstruction(span, reference2, params) {
  return importExpr(reference2, null, span).callFn(params, span);
}
function temporaryAllocator(statements, name) {
  let temp = null;
  return () => {
    if (!temp) {
      statements.push(new DeclareVarStmt(TEMPORARY_NAME, void 0, DYNAMIC_TYPE));
      temp = variable(name);
    }
    return temp;
  };
}
function invalid(arg) {
  throw new Error(`Invalid state: Visitor ${this.constructor.name} doesn't handle ${arg.constructor.name}`);
}
function asLiteral(value) {
  if (Array.isArray(value)) {
    return literalArr(value.map(asLiteral));
  }
  return literal(value, INFERRED_TYPE);
}
function conditionallyCreateDirectiveBindingLiteral(map, keepDeclared) {
  const keys = Object.getOwnPropertyNames(map);
  if (keys.length === 0) {
    return null;
  }
  return literalMap(keys.map((key) => {
    const value = map[key];
    let declaredName;
    let publicName;
    let minifiedName;
    let expressionValue;
    if (typeof value === "string") {
      declaredName = key;
      minifiedName = key;
      publicName = value;
      expressionValue = asLiteral(publicName);
    } else {
      minifiedName = key;
      declaredName = value.classPropertyName;
      publicName = value.bindingPropertyName;
      if (keepDeclared && (publicName !== declaredName || value.transformFunction != null)) {
        const expressionKeys = [asLiteral(publicName), asLiteral(declaredName)];
        if (value.transformFunction != null) {
          expressionKeys.push(value.transformFunction);
        }
        expressionValue = literalArr(expressionKeys);
      } else {
        expressionValue = asLiteral(publicName);
      }
    }
    return {
      key: minifiedName,
      // put quotes around keys that contain potentially unsafe characters
      quoted: UNSAFE_OBJECT_KEY_NAME_REGEXP.test(minifiedName),
      value: expressionValue
    };
  }));
}
function trimTrailingNulls(parameters) {
  while (isNull(parameters[parameters.length - 1])) {
    parameters.pop();
  }
  return parameters;
}
function getQueryPredicate(query, constantPool) {
  if (Array.isArray(query.predicate)) {
    let predicate = [];
    query.predicate.forEach((selector) => {
      const selectors = selector.split(",").map((token) => literal(token.trim()));
      predicate.push(...selectors);
    });
    return constantPool.getConstLiteral(literalArr(predicate), true);
  } else {
    switch (query.predicate.forwardRef) {
      case 0:
      case 2:
        return query.predicate.expression;
      case 1:
        return importExpr(Identifiers.resolveForwardRef).callFn([query.predicate.expression]);
    }
  }
}
var DefinitionMap = class {
  constructor() {
    this.values = [];
  }
  set(key, value) {
    if (value) {
      this.values.push({ key, value, quoted: false });
    }
  }
  toLiteralMap() {
    return literalMap(this.values);
  }
};
function getInterpolationArgsLength(interpolation) {
  const { expressions, strings } = interpolation;
  if (expressions.length === 1 && strings.length === 2 && strings[0] === "" && strings[1] === "") {
    return 1;
  } else {
    return expressions.length + strings.length;
  }
}
function getInstructionStatements(instructions) {
  const statements = [];
  let pendingExpression = null;
  let pendingExpressionType = null;
  let chainLength = 0;
  for (const current of instructions) {
    const resolvedParams = (typeof current.paramsOrFn === "function" ? current.paramsOrFn() : current.paramsOrFn) ?? [];
    const params = Array.isArray(resolvedParams) ? resolvedParams : [resolvedParams];
    if (chainLength < MAX_CHAIN_LENGTH && pendingExpressionType === current.reference && CHAINABLE_INSTRUCTIONS.has(pendingExpressionType)) {
      pendingExpression = pendingExpression.callFn(params, pendingExpression.sourceSpan);
      chainLength++;
    } else {
      if (pendingExpression !== null) {
        statements.push(pendingExpression.toStmt());
      }
      pendingExpression = invokeInstruction(current.span, current.reference, params);
      pendingExpressionType = current.reference;
      chainLength = 0;
    }
  }
  if (pendingExpression !== null) {
    statements.push(pendingExpression.toStmt());
  }
  return statements;
}
function compileInjectable(meta, resolveForwardRefs) {
  let result = null;
  const factoryMeta = {
    name: meta.name,
    type: meta.type,
    typeArgumentCount: meta.typeArgumentCount,
    deps: [],
    target: FactoryTarget$1.Injectable
  };
  if (meta.useClass !== void 0) {
    const useClassOnSelf = meta.useClass.expression.isEquivalent(meta.type.value);
    let deps = void 0;
    if (meta.deps !== void 0) {
      deps = meta.deps;
    }
    if (deps !== void 0) {
      result = compileFactoryFunction(__spreadProps(__spreadValues({}, factoryMeta), {
        delegate: meta.useClass.expression,
        delegateDeps: deps,
        delegateType: R3FactoryDelegateType.Class
      }));
    } else if (useClassOnSelf) {
      result = compileFactoryFunction(factoryMeta);
    } else {
      result = {
        statements: [],
        expression: delegateToFactory(meta.type.value, meta.useClass.expression, resolveForwardRefs)
      };
    }
  } else if (meta.useFactory !== void 0) {
    if (meta.deps !== void 0) {
      result = compileFactoryFunction(__spreadProps(__spreadValues({}, factoryMeta), {
        delegate: meta.useFactory,
        delegateDeps: meta.deps || [],
        delegateType: R3FactoryDelegateType.Function
      }));
    } else {
      result = {
        statements: [],
        expression: fn([], [new ReturnStatement(meta.useFactory.callFn([]))])
      };
    }
  } else if (meta.useValue !== void 0) {
    result = compileFactoryFunction(__spreadProps(__spreadValues({}, factoryMeta), {
      expression: meta.useValue.expression
    }));
  } else if (meta.useExisting !== void 0) {
    result = compileFactoryFunction(__spreadProps(__spreadValues({}, factoryMeta), {
      expression: importExpr(Identifiers.inject).callFn([meta.useExisting.expression])
    }));
  } else {
    result = {
      statements: [],
      expression: delegateToFactory(meta.type.value, meta.type.value, resolveForwardRefs)
    };
  }
  const token = meta.type.value;
  const injectableProps = new DefinitionMap();
  injectableProps.set("token", token);
  injectableProps.set("factory", result.expression);
  if (meta.providedIn.expression.value !== null) {
    injectableProps.set("providedIn", convertFromMaybeForwardRefExpression(meta.providedIn));
  }
  const expression = importExpr(Identifiers.\u0275\u0275defineInjectable).callFn([injectableProps.toLiteralMap()], void 0, true);
  return {
    expression,
    type: createInjectableType(meta),
    statements: result.statements
  };
}
function createInjectableType(meta) {
  return new ExpressionType(importExpr(Identifiers.InjectableDeclaration, [typeWithParameters(meta.type.type, meta.typeArgumentCount)]));
}
function delegateToFactory(type, useType, unwrapForwardRefs) {
  if (type.node === useType.node) {
    return useType.prop("\u0275fac");
  }
  if (!unwrapForwardRefs) {
    return createFactoryFunction(useType);
  }
  const unwrappedType = importExpr(Identifiers.resolveForwardRef).callFn([useType]);
  return createFactoryFunction(unwrappedType);
}
function createFactoryFunction(type) {
  return fn([new FnParam("t", DYNAMIC_TYPE)], [new ReturnStatement(type.prop("\u0275fac").callFn([variable("t")]))]);
}
var UNUSABLE_INTERPOLATION_REGEXPS = [
  /^\s*$/,
  /[<>]/,
  /^[{}]$/,
  /&(#|[a-z])/i,
  /^\/\//
  // comment
];
function assertInterpolationSymbols(identifier, value) {
  if (value != null && !(Array.isArray(value) && value.length == 2)) {
    throw new Error(`Expected '${identifier}' to be an array, [start, end].`);
  } else if (value != null) {
    const start = value[0];
    const end = value[1];
    UNUSABLE_INTERPOLATION_REGEXPS.forEach((regexp) => {
      if (regexp.test(start) || regexp.test(end)) {
        throw new Error(`['${start}', '${end}'] contains unusable interpolation symbol.`);
      }
    });
  }
}
var InterpolationConfig = class _InterpolationConfig {
  static fromArray(markers) {
    if (!markers) {
      return DEFAULT_INTERPOLATION_CONFIG;
    }
    assertInterpolationSymbols("interpolation", markers);
    return new _InterpolationConfig(markers[0], markers[1]);
  }
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
};
var DEFAULT_INTERPOLATION_CONFIG = new InterpolationConfig("{{", "}}");
var $EOF = 0;
var $BSPACE = 8;
var $TAB = 9;
var $LF = 10;
var $VTAB = 11;
var $FF = 12;
var $CR = 13;
var $SPACE = 32;
var $BANG = 33;
var $DQ = 34;
var $HASH = 35;
var $$ = 36;
var $PERCENT = 37;
var $AMPERSAND = 38;
var $SQ = 39;
var $LPAREN = 40;
var $RPAREN = 41;
var $STAR = 42;
var $PLUS = 43;
var $COMMA = 44;
var $MINUS = 45;
var $PERIOD = 46;
var $SLASH = 47;
var $COLON = 58;
var $SEMICOLON = 59;
var $LT = 60;
var $EQ = 61;
var $GT = 62;
var $QUESTION = 63;
var $0 = 48;
var $7 = 55;
var $9 = 57;
var $A = 65;
var $E = 69;
var $F = 70;
var $X = 88;
var $Z = 90;
var $LBRACKET = 91;
var $BACKSLASH = 92;
var $RBRACKET = 93;
var $CARET = 94;
var $_ = 95;
var $a = 97;
var $b = 98;
var $e = 101;
var $f = 102;
var $n = 110;
var $r = 114;
var $t = 116;
var $u = 117;
var $v = 118;
var $x = 120;
var $z = 122;
var $LBRACE = 123;
var $BAR = 124;
var $RBRACE = 125;
var $NBSP = 160;
var $BT = 96;
function isWhitespace(code) {
  return code >= $TAB && code <= $SPACE || code == $NBSP;
}
function isDigit(code) {
  return $0 <= code && code <= $9;
}
function isAsciiLetter(code) {
  return code >= $a && code <= $z || code >= $A && code <= $Z;
}
function isAsciiHexDigit(code) {
  return code >= $a && code <= $f || code >= $A && code <= $F || isDigit(code);
}
function isNewLine(code) {
  return code === $LF || code === $CR;
}
function isOctalDigit(code) {
  return $0 <= code && code <= $7;
}
function isQuote(code) {
  return code === $SQ || code === $DQ || code === $BT;
}
var ParseLocation = class _ParseLocation {
  constructor(file, offset, line, col) {
    this.file = file;
    this.offset = offset;
    this.line = line;
    this.col = col;
  }
  toString() {
    return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
  }
  moveBy(delta) {
    const source = this.file.content;
    const len = source.length;
    let offset = this.offset;
    let line = this.line;
    let col = this.col;
    while (offset > 0 && delta < 0) {
      offset--;
      delta++;
      const ch = source.charCodeAt(offset);
      if (ch == $LF) {
        line--;
        const priorLine = source.substring(0, offset - 1).lastIndexOf(String.fromCharCode($LF));
        col = priorLine > 0 ? offset - priorLine : offset;
      } else {
        col--;
      }
    }
    while (offset < len && delta > 0) {
      const ch = source.charCodeAt(offset);
      offset++;
      delta--;
      if (ch == $LF) {
        line++;
        col = 0;
      } else {
        col++;
      }
    }
    return new _ParseLocation(this.file, offset, line, col);
  }
  // Return the source around the location
  // Up to `maxChars` or `maxLines` on each side of the location
  getContext(maxChars, maxLines) {
    const content = this.file.content;
    let startOffset = this.offset;
    if (startOffset != null) {
      if (startOffset > content.length - 1) {
        startOffset = content.length - 1;
      }
      let endOffset = startOffset;
      let ctxChars = 0;
      let ctxLines = 0;
      while (ctxChars < maxChars && startOffset > 0) {
        startOffset--;
        ctxChars++;
        if (content[startOffset] == "\n") {
          if (++ctxLines == maxLines) {
            break;
          }
        }
      }
      ctxChars = 0;
      ctxLines = 0;
      while (ctxChars < maxChars && endOffset < content.length - 1) {
        endOffset++;
        ctxChars++;
        if (content[endOffset] == "\n") {
          if (++ctxLines == maxLines) {
            break;
          }
        }
      }
      return {
        before: content.substring(startOffset, this.offset),
        after: content.substring(this.offset, endOffset + 1)
      };
    }
    return null;
  }
};
var ParseSourceFile = class {
  constructor(content, url) {
    this.content = content;
    this.url = url;
  }
};
var ParseSourceSpan = class {
  /**
   * Create an object that holds information about spans of tokens/nodes captured during
   * lexing/parsing of text.
   *
   * @param start
   * The location of the start of the span (having skipped leading trivia).
   * Skipping leading trivia makes source-spans more "user friendly", since things like HTML
   * elements will appear to begin at the start of the opening tag, rather than at the start of any
   * leading trivia, which could include newlines.
   *
   * @param end
   * The location of the end of the span.
   *
   * @param fullStart
   * The start of the token without skipping the leading trivia.
   * This is used by tooling that splits tokens further, such as extracting Angular interpolations
   * from text tokens. Such tooling creates new source-spans relative to the original token's
   * source-span. If leading trivia characters have been skipped then the new source-spans may be
   * incorrectly offset.
   *
   * @param details
   * Additional information (such as identifier names) that should be associated with the span.
   */
  constructor(start, end, fullStart = start, details = null) {
    this.start = start;
    this.end = end;
    this.fullStart = fullStart;
    this.details = details;
  }
  toString() {
    return this.start.file.content.substring(this.start.offset, this.end.offset);
  }
};
var ParseErrorLevel;
(function(ParseErrorLevel2) {
  ParseErrorLevel2[ParseErrorLevel2["WARNING"] = 0] = "WARNING";
  ParseErrorLevel2[ParseErrorLevel2["ERROR"] = 1] = "ERROR";
})(ParseErrorLevel || (ParseErrorLevel = {}));
var ParseError = class {
  constructor(span, msg, level = ParseErrorLevel.ERROR) {
    this.span = span;
    this.msg = msg;
    this.level = level;
  }
  contextualMessage() {
    const ctx = this.span.start.getContext(100, 3);
    return ctx ? `${this.msg} ("${ctx.before}[${ParseErrorLevel[this.level]} ->]${ctx.after}")` : this.msg;
  }
  toString() {
    const details = this.span.details ? `, ${this.span.details}` : "";
    return `${this.contextualMessage()}: ${this.span.start}${details}`;
  }
};
function r3JitTypeSourceSpan(kind, typeName, sourceUrl) {
  const sourceFileName = `in ${kind} ${typeName} in ${sourceUrl}`;
  const sourceFile = new ParseSourceFile("", sourceFileName);
  return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
}
var _anonymousTypeIndex = 0;
function identifierName(compileIdentifier) {
  if (!compileIdentifier || !compileIdentifier.reference) {
    return null;
  }
  const ref = compileIdentifier.reference;
  if (ref["__anonymousType"]) {
    return ref["__anonymousType"];
  }
  if (ref["__forward_ref__"]) {
    return "__forward_ref__";
  }
  let identifier = stringify(ref);
  if (identifier.indexOf("(") >= 0) {
    identifier = `anonymous_${_anonymousTypeIndex++}`;
    ref["__anonymousType"] = identifier;
  } else {
    identifier = sanitizeIdentifier(identifier);
  }
  return identifier;
}
function sanitizeIdentifier(name) {
  return name.replace(/\W/g, "_");
}
var makeTemplateObjectPolyfill = '(this&&this.__makeTemplateObject||function(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e})';
var AbstractJsEmitterVisitor = class extends AbstractEmitterVisitor {
  constructor() {
    super(false);
  }
  visitWrappedNodeExpr(ast, ctx) {
    throw new Error("Cannot emit a WrappedNodeExpr in Javascript.");
  }
  visitDeclareVarStmt(stmt, ctx) {
    ctx.print(stmt, `var ${stmt.name}`);
    if (stmt.value) {
      ctx.print(stmt, " = ");
      stmt.value.visitExpression(this, ctx);
    }
    ctx.println(stmt, `;`);
    return null;
  }
  visitTaggedTemplateExpr(ast, ctx) {
    const elements = ast.template.elements;
    ast.tag.visitExpression(this, ctx);
    ctx.print(ast, `(${makeTemplateObjectPolyfill}(`);
    ctx.print(ast, `[${elements.map((part) => escapeIdentifier(part.text, false)).join(", ")}], `);
    ctx.print(ast, `[${elements.map((part) => escapeIdentifier(part.rawText, false)).join(", ")}])`);
    ast.template.expressions.forEach((expression) => {
      ctx.print(ast, ", ");
      expression.visitExpression(this, ctx);
    });
    ctx.print(ast, ")");
    return null;
  }
  visitFunctionExpr(ast, ctx) {
    ctx.print(ast, `function${ast.name ? " " + ast.name : ""}(`);
    this._visitParams(ast.params, ctx);
    ctx.println(ast, `) {`);
    ctx.incIndent();
    this.visitAllStatements(ast.statements, ctx);
    ctx.decIndent();
    ctx.print(ast, `}`);
    return null;
  }
  visitDeclareFunctionStmt(stmt, ctx) {
    ctx.print(stmt, `function ${stmt.name}(`);
    this._visitParams(stmt.params, ctx);
    ctx.println(stmt, `) {`);
    ctx.incIndent();
    this.visitAllStatements(stmt.statements, ctx);
    ctx.decIndent();
    ctx.println(stmt, `}`);
    return null;
  }
  visitLocalizedString(ast, ctx) {
    ctx.print(ast, `$localize(${makeTemplateObjectPolyfill}(`);
    const parts = [ast.serializeI18nHead()];
    for (let i = 1; i < ast.messageParts.length; i++) {
      parts.push(ast.serializeI18nTemplatePart(i));
    }
    ctx.print(ast, `[${parts.map((part) => escapeIdentifier(part.cooked, false)).join(", ")}], `);
    ctx.print(ast, `[${parts.map((part) => escapeIdentifier(part.raw, false)).join(", ")}])`);
    ast.expressions.forEach((expression) => {
      ctx.print(ast, ", ");
      expression.visitExpression(this, ctx);
    });
    ctx.print(ast, ")");
    return null;
  }
  _visitParams(params, ctx) {
    this.visitAllObjects((param) => ctx.print(null, param.name), params, ctx, ",");
  }
};
var policy;
function getPolicy() {
  if (policy === void 0) {
    policy = null;
    if (_global.trustedTypes) {
      try {
        policy = _global.trustedTypes.createPolicy("angular#unsafe-jit", {
          createScript: (s) => s
        });
      } catch {
      }
    }
  }
  return policy;
}
function trustedScriptFromString(script) {
  return getPolicy()?.createScript(script) || script;
}
function newTrustedFunctionForJIT(...args) {
  if (!_global.trustedTypes) {
    return new Function(...args);
  }
  const fnArgs = args.slice(0, -1).join(",");
  const fnBody = args[args.length - 1];
  const body = `(function anonymous(${fnArgs}
) { ${fnBody}
})`;
  const fn2 = _global["eval"](trustedScriptFromString(body));
  if (fn2.bind === void 0) {
    return new Function(...args);
  }
  fn2.toString = () => body;
  return fn2.bind(_global);
}
var JitEvaluator = class {
  /**
   *
   * @param sourceUrl The URL of the generated code.
   * @param statements An array of Angular statement AST nodes to be evaluated.
   * @param refResolver Resolves `o.ExternalReference`s into values.
   * @param createSourceMaps If true then create a source-map for the generated code and include it
   * inline as a source-map comment.
   * @returns A map of all the variables in the generated code.
   */
  evaluateStatements(sourceUrl, statements, refResolver, createSourceMaps) {
    const converter = new JitEmitterVisitor(refResolver);
    const ctx = EmitterVisitorContext.createRoot();
    if (statements.length > 0 && !isUseStrictStatement(statements[0])) {
      statements = [
        literal("use strict").toStmt(),
        ...statements
      ];
    }
    converter.visitAllStatements(statements, ctx);
    converter.createReturnStmt(ctx);
    return this.evaluateCode(sourceUrl, ctx, converter.getArgs(), createSourceMaps);
  }
  /**
   * Evaluate a piece of JIT generated code.
   * @param sourceUrl The URL of this generated code.
   * @param ctx A context object that contains an AST of the code to be evaluated.
   * @param vars A map containing the names and values of variables that the evaluated code might
   * reference.
   * @param createSourceMap If true then create a source-map for the generated code and include it
   * inline as a source-map comment.
   * @returns The result of evaluating the code.
   */
  evaluateCode(sourceUrl, ctx, vars, createSourceMap) {
    let fnBody = `"use strict";${ctx.toSource()}
//# sourceURL=${sourceUrl}`;
    const fnArgNames = [];
    const fnArgValues = [];
    for (const argName in vars) {
      fnArgValues.push(vars[argName]);
      fnArgNames.push(argName);
    }
    if (createSourceMap) {
      const emptyFn = newTrustedFunctionForJIT(...fnArgNames.concat("return null;")).toString();
      const headerLines = emptyFn.slice(0, emptyFn.indexOf("return null;")).split("\n").length - 1;
      fnBody += `
${ctx.toSourceMapGenerator(sourceUrl, headerLines).toJsComment()}`;
    }
    const fn2 = newTrustedFunctionForJIT(...fnArgNames.concat(fnBody));
    return this.executeFunction(fn2, fnArgValues);
  }
  /**
   * Execute a JIT generated function by calling it.
   *
   * This method can be overridden in tests to capture the functions that are generated
   * by this `JitEvaluator` class.
   *
   * @param fn A function to execute.
   * @param args The arguments to pass to the function being executed.
   * @returns The return value of the executed function.
   */
  executeFunction(fn2, args) {
    return fn2(...args);
  }
};
var JitEmitterVisitor = class extends AbstractJsEmitterVisitor {
  constructor(refResolver) {
    super();
    this.refResolver = refResolver;
    this._evalArgNames = [];
    this._evalArgValues = [];
    this._evalExportedVars = [];
  }
  createReturnStmt(ctx) {
    const stmt = new ReturnStatement(new LiteralMapExpr(this._evalExportedVars.map((resultVar) => new LiteralMapEntry(resultVar, variable(resultVar), false))));
    stmt.visitStatement(this, ctx);
  }
  getArgs() {
    const result = {};
    for (let i = 0; i < this._evalArgNames.length; i++) {
      result[this._evalArgNames[i]] = this._evalArgValues[i];
    }
    return result;
  }
  visitExternalExpr(ast, ctx) {
    this._emitReferenceToExternal(ast, this.refResolver.resolveExternalReference(ast.value), ctx);
    return null;
  }
  visitWrappedNodeExpr(ast, ctx) {
    this._emitReferenceToExternal(ast, ast.node, ctx);
    return null;
  }
  visitDeclareVarStmt(stmt, ctx) {
    if (stmt.hasModifier(StmtModifier.Exported)) {
      this._evalExportedVars.push(stmt.name);
    }
    return super.visitDeclareVarStmt(stmt, ctx);
  }
  visitDeclareFunctionStmt(stmt, ctx) {
    if (stmt.hasModifier(StmtModifier.Exported)) {
      this._evalExportedVars.push(stmt.name);
    }
    return super.visitDeclareFunctionStmt(stmt, ctx);
  }
  _emitReferenceToExternal(ast, value, ctx) {
    let id = this._evalArgValues.indexOf(value);
    if (id === -1) {
      id = this._evalArgValues.length;
      this._evalArgValues.push(value);
      const name = identifierName({ reference: value }) || "val";
      this._evalArgNames.push(`jit_${name}_${id}`);
    }
    ctx.print(ast, this._evalArgNames[id]);
  }
};
function isUseStrictStatement(statement) {
  return statement.isEquivalent(literal("use strict").toStmt());
}
function compileInjector(meta) {
  const definitionMap = new DefinitionMap();
  if (meta.providers !== null) {
    definitionMap.set("providers", meta.providers);
  }
  if (meta.imports.length > 0) {
    definitionMap.set("imports", literalArr(meta.imports));
  }
  const expression = importExpr(Identifiers.defineInjector).callFn([definitionMap.toLiteralMap()], void 0, true);
  const type = createInjectorType(meta);
  return { expression, type, statements: [] };
}
function createInjectorType(meta) {
  return new ExpressionType(importExpr(Identifiers.InjectorDeclaration, [new ExpressionType(meta.type.type)]));
}
var R3JitReflector = class {
  constructor(context) {
    this.context = context;
  }
  resolveExternalReference(ref) {
    if (ref.moduleName !== "@angular/core") {
      throw new Error(`Cannot resolve external reference to ${ref.moduleName}, only references to @angular/core are supported.`);
    }
    if (!this.context.hasOwnProperty(ref.name)) {
      throw new Error(`No value provided for @angular/core symbol '${ref.name}'.`);
    }
    return this.context[ref.name];
  }
};
var R3SelectorScopeMode;
(function(R3SelectorScopeMode2) {
  R3SelectorScopeMode2[R3SelectorScopeMode2["Inline"] = 0] = "Inline";
  R3SelectorScopeMode2[R3SelectorScopeMode2["SideEffect"] = 1] = "SideEffect";
  R3SelectorScopeMode2[R3SelectorScopeMode2["Omit"] = 2] = "Omit";
})(R3SelectorScopeMode || (R3SelectorScopeMode = {}));
var R3NgModuleMetadataKind;
(function(R3NgModuleMetadataKind2) {
  R3NgModuleMetadataKind2[R3NgModuleMetadataKind2["Global"] = 0] = "Global";
  R3NgModuleMetadataKind2[R3NgModuleMetadataKind2["Local"] = 1] = "Local";
})(R3NgModuleMetadataKind || (R3NgModuleMetadataKind = {}));
function compileNgModule(meta) {
  const statements = [];
  const definitionMap = new DefinitionMap();
  definitionMap.set("type", meta.type.value);
  if (meta.kind === R3NgModuleMetadataKind.Global) {
    if (meta.bootstrap.length > 0) {
      definitionMap.set("bootstrap", refsToArray(meta.bootstrap, meta.containsForwardDecls));
    }
  } else {
    if (meta.bootstrapExpression) {
      definitionMap.set("bootstrap", meta.bootstrapExpression);
    }
  }
  if (meta.selectorScopeMode === R3SelectorScopeMode.Inline) {
    if (meta.declarations.length > 0) {
      definitionMap.set("declarations", refsToArray(meta.declarations, meta.containsForwardDecls));
    }
    if (meta.imports.length > 0) {
      definitionMap.set("imports", refsToArray(meta.imports, meta.containsForwardDecls));
    }
    if (meta.exports.length > 0) {
      definitionMap.set("exports", refsToArray(meta.exports, meta.containsForwardDecls));
    }
  } else if (meta.selectorScopeMode === R3SelectorScopeMode.SideEffect) {
    const setNgModuleScopeCall = generateSetNgModuleScopeCall(meta);
    if (setNgModuleScopeCall !== null) {
      statements.push(setNgModuleScopeCall);
    }
  } else {
  }
  if (meta.schemas !== null && meta.schemas.length > 0) {
    definitionMap.set("schemas", literalArr(meta.schemas.map((ref) => ref.value)));
  }
  if (meta.id !== null) {
    definitionMap.set("id", meta.id);
    statements.push(importExpr(Identifiers.registerNgModuleType).callFn([meta.type.value, meta.id]).toStmt());
  }
  const expression = importExpr(Identifiers.defineNgModule).callFn([definitionMap.toLiteralMap()], void 0, true);
  const type = createNgModuleType(meta);
  return { expression, type, statements };
}
function compileNgModuleDeclarationExpression(meta) {
  const definitionMap = new DefinitionMap();
  definitionMap.set("type", new WrappedNodeExpr(meta.type));
  if (meta.bootstrap !== void 0) {
    definitionMap.set("bootstrap", new WrappedNodeExpr(meta.bootstrap));
  }
  if (meta.declarations !== void 0) {
    definitionMap.set("declarations", new WrappedNodeExpr(meta.declarations));
  }
  if (meta.imports !== void 0) {
    definitionMap.set("imports", new WrappedNodeExpr(meta.imports));
  }
  if (meta.exports !== void 0) {
    definitionMap.set("exports", new WrappedNodeExpr(meta.exports));
  }
  if (meta.schemas !== void 0) {
    definitionMap.set("schemas", new WrappedNodeExpr(meta.schemas));
  }
  if (meta.id !== void 0) {
    definitionMap.set("id", new WrappedNodeExpr(meta.id));
  }
  return importExpr(Identifiers.defineNgModule).callFn([definitionMap.toLiteralMap()]);
}
function createNgModuleType(meta) {
  if (meta.kind === R3NgModuleMetadataKind.Local) {
    return new ExpressionType(meta.type.value);
  }
  const { type: moduleType, declarations, exports, imports, includeImportTypes, publicDeclarationTypes } = meta;
  return new ExpressionType(importExpr(Identifiers.NgModuleDeclaration, [
    new ExpressionType(moduleType.type),
    publicDeclarationTypes === null ? tupleTypeOf(declarations) : tupleOfTypes(publicDeclarationTypes),
    includeImportTypes ? tupleTypeOf(imports) : NONE_TYPE,
    tupleTypeOf(exports)
  ]));
}
function generateSetNgModuleScopeCall(meta) {
  const scopeMap = new DefinitionMap();
  if (meta.kind === R3NgModuleMetadataKind.Global) {
    if (meta.declarations.length > 0) {
      scopeMap.set("declarations", refsToArray(meta.declarations, meta.containsForwardDecls));
    }
  } else {
    if (meta.declarationsExpression) {
      scopeMap.set("declarations", meta.declarationsExpression);
    }
  }
  if (meta.kind === R3NgModuleMetadataKind.Global) {
    if (meta.imports.length > 0) {
      scopeMap.set("imports", refsToArray(meta.imports, meta.containsForwardDecls));
    }
  } else {
    if (meta.importsExpression) {
      scopeMap.set("imports", meta.importsExpression);
    }
  }
  if (meta.kind === R3NgModuleMetadataKind.Global) {
    if (meta.exports.length > 0) {
      scopeMap.set("exports", refsToArray(meta.exports, meta.containsForwardDecls));
    }
  } else {
    if (meta.exportsExpression) {
      scopeMap.set("exports", meta.exportsExpression);
    }
  }
  if (Object.keys(scopeMap.values).length === 0) {
    return null;
  }
  const fnCall = new InvokeFunctionExpr(
    /* fn */
    importExpr(Identifiers.setNgModuleScope),
    /* args */
    [meta.type.value, scopeMap.toLiteralMap()]
  );
  const guardedCall = jitOnlyGuardedExpression(fnCall);
  const iife = new FunctionExpr(
    /* params */
    [],
    /* statements */
    [guardedCall.toStmt()]
  );
  const iifeCall = new InvokeFunctionExpr(
    /* fn */
    iife,
    /* args */
    []
  );
  return iifeCall.toStmt();
}
function tupleTypeOf(exp) {
  const types = exp.map((ref) => typeofExpr(ref.type));
  return exp.length > 0 ? expressionType(literalArr(types)) : NONE_TYPE;
}
function tupleOfTypes(types) {
  const typeofTypes = types.map((type) => typeofExpr(type));
  return types.length > 0 ? expressionType(literalArr(typeofTypes)) : NONE_TYPE;
}
function compilePipeFromMetadata(metadata) {
  const definitionMapValues = [];
  definitionMapValues.push({ key: "name", value: literal(metadata.pipeName), quoted: false });
  definitionMapValues.push({ key: "type", value: metadata.type.value, quoted: false });
  definitionMapValues.push({ key: "pure", value: literal(metadata.pure), quoted: false });
  if (metadata.isStandalone) {
    definitionMapValues.push({ key: "standalone", value: literal(true), quoted: false });
  }
  const expression = importExpr(Identifiers.definePipe).callFn([literalMap(definitionMapValues)], void 0, true);
  const type = createPipeType(metadata);
  return { expression, type, statements: [] };
}
function createPipeType(metadata) {
  return new ExpressionType(importExpr(Identifiers.PipeDeclaration, [
    typeWithParameters(metadata.type.type, metadata.typeArgumentCount),
    new ExpressionType(new LiteralExpr(metadata.pipeName)),
    new ExpressionType(new LiteralExpr(metadata.isStandalone))
  ]));
}
var R3TemplateDependencyKind;
(function(R3TemplateDependencyKind2) {
  R3TemplateDependencyKind2[R3TemplateDependencyKind2["Directive"] = 0] = "Directive";
  R3TemplateDependencyKind2[R3TemplateDependencyKind2["Pipe"] = 1] = "Pipe";
  R3TemplateDependencyKind2[R3TemplateDependencyKind2["NgModule"] = 2] = "NgModule";
})(R3TemplateDependencyKind || (R3TemplateDependencyKind = {}));
var ParserError = class {
  constructor(message, input, errLocation, ctxLocation) {
    this.input = input;
    this.errLocation = errLocation;
    this.ctxLocation = ctxLocation;
    this.message = `Parser Error: ${message} ${errLocation} [${input}] in ${ctxLocation}`;
  }
};
var ParseSpan = class {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  toAbsolute(absoluteOffset) {
    return new AbsoluteSourceSpan(absoluteOffset + this.start, absoluteOffset + this.end);
  }
};
var AST = class {
  constructor(span, sourceSpan) {
    this.span = span;
    this.sourceSpan = sourceSpan;
  }
  toString() {
    return "AST";
  }
};
var ASTWithName = class extends AST {
  constructor(span, sourceSpan, nameSpan) {
    super(span, sourceSpan);
    this.nameSpan = nameSpan;
  }
};
var EmptyExpr$1 = class extends AST {
  visit(visitor, context = null) {
  }
};
var ImplicitReceiver = class extends AST {
  visit(visitor, context = null) {
    return visitor.visitImplicitReceiver(this, context);
  }
};
var ThisReceiver = class extends ImplicitReceiver {
  visit(visitor, context = null) {
    return visitor.visitThisReceiver?.(this, context);
  }
};
var Chain = class extends AST {
  constructor(span, sourceSpan, expressions) {
    super(span, sourceSpan);
    this.expressions = expressions;
  }
  visit(visitor, context = null) {
    return visitor.visitChain(this, context);
  }
};
var Conditional = class extends AST {
  constructor(span, sourceSpan, condition, trueExp, falseExp) {
    super(span, sourceSpan);
    this.condition = condition;
    this.trueExp = trueExp;
    this.falseExp = falseExp;
  }
  visit(visitor, context = null) {
    return visitor.visitConditional(this, context);
  }
};
var PropertyRead = class extends ASTWithName {
  constructor(span, sourceSpan, nameSpan, receiver, name) {
    super(span, sourceSpan, nameSpan);
    this.receiver = receiver;
    this.name = name;
  }
  visit(visitor, context = null) {
    return visitor.visitPropertyRead(this, context);
  }
};
var PropertyWrite = class extends ASTWithName {
  constructor(span, sourceSpan, nameSpan, receiver, name, value) {
    super(span, sourceSpan, nameSpan);
    this.receiver = receiver;
    this.name = name;
    this.value = value;
  }
  visit(visitor, context = null) {
    return visitor.visitPropertyWrite(this, context);
  }
};
var SafePropertyRead = class extends ASTWithName {
  constructor(span, sourceSpan, nameSpan, receiver, name) {
    super(span, sourceSpan, nameSpan);
    this.receiver = receiver;
    this.name = name;
  }
  visit(visitor, context = null) {
    return visitor.visitSafePropertyRead(this, context);
  }
};
var KeyedRead = class extends AST {
  constructor(span, sourceSpan, receiver, key) {
    super(span, sourceSpan);
    this.receiver = receiver;
    this.key = key;
  }
  visit(visitor, context = null) {
    return visitor.visitKeyedRead(this, context);
  }
};
var SafeKeyedRead = class extends AST {
  constructor(span, sourceSpan, receiver, key) {
    super(span, sourceSpan);
    this.receiver = receiver;
    this.key = key;
  }
  visit(visitor, context = null) {
    return visitor.visitSafeKeyedRead(this, context);
  }
};
var KeyedWrite = class extends AST {
  constructor(span, sourceSpan, receiver, key, value) {
    super(span, sourceSpan);
    this.receiver = receiver;
    this.key = key;
    this.value = value;
  }
  visit(visitor, context = null) {
    return visitor.visitKeyedWrite(this, context);
  }
};
var BindingPipe = class extends ASTWithName {
  constructor(span, sourceSpan, exp, name, args, nameSpan) {
    super(span, sourceSpan, nameSpan);
    this.exp = exp;
    this.name = name;
    this.args = args;
  }
  visit(visitor, context = null) {
    return visitor.visitPipe(this, context);
  }
};
var LiteralPrimitive = class extends AST {
  constructor(span, sourceSpan, value) {
    super(span, sourceSpan);
    this.value = value;
  }
  visit(visitor, context = null) {
    return visitor.visitLiteralPrimitive(this, context);
  }
};
var LiteralArray = class extends AST {
  constructor(span, sourceSpan, expressions) {
    super(span, sourceSpan);
    this.expressions = expressions;
  }
  visit(visitor, context = null) {
    return visitor.visitLiteralArray(this, context);
  }
};
var LiteralMap = class extends AST {
  constructor(span, sourceSpan, keys, values) {
    super(span, sourceSpan);
    this.keys = keys;
    this.values = values;
  }
  visit(visitor, context = null) {
    return visitor.visitLiteralMap(this, context);
  }
};
var Interpolation$1 = class extends AST {
  constructor(span, sourceSpan, strings, expressions) {
    super(span, sourceSpan);
    this.strings = strings;
    this.expressions = expressions;
  }
  visit(visitor, context = null) {
    return visitor.visitInterpolation(this, context);
  }
};
var Binary = class extends AST {
  constructor(span, sourceSpan, operation, left, right) {
    super(span, sourceSpan);
    this.operation = operation;
    this.left = left;
    this.right = right;
  }
  visit(visitor, context = null) {
    return visitor.visitBinary(this, context);
  }
};
var Unary = class _Unary extends Binary {
  /**
   * Creates a unary minus expression "-x", represented as `Binary` using "0 - x".
   */
  static createMinus(span, sourceSpan, expr) {
    return new _Unary(span, sourceSpan, "-", expr, "-", new LiteralPrimitive(span, sourceSpan, 0), expr);
  }
  /**
   * Creates a unary plus expression "+x", represented as `Binary` using "x - 0".
   */
  static createPlus(span, sourceSpan, expr) {
    return new _Unary(span, sourceSpan, "+", expr, "-", expr, new LiteralPrimitive(span, sourceSpan, 0));
  }
  /**
   * During the deprecation period this constructor is private, to avoid consumers from creating
   * a `Unary` with the fallback properties for `Binary`.
   */
  constructor(span, sourceSpan, operator, expr, binaryOp, binaryLeft, binaryRight) {
    super(span, sourceSpan, binaryOp, binaryLeft, binaryRight);
    this.operator = operator;
    this.expr = expr;
    this.left = null;
    this.right = null;
    this.operation = null;
  }
  visit(visitor, context = null) {
    if (visitor.visitUnary !== void 0) {
      return visitor.visitUnary(this, context);
    }
    return visitor.visitBinary(this, context);
  }
};
var PrefixNot = class extends AST {
  constructor(span, sourceSpan, expression) {
    super(span, sourceSpan);
    this.expression = expression;
  }
  visit(visitor, context = null) {
    return visitor.visitPrefixNot(this, context);
  }
};
var NonNullAssert = class extends AST {
  constructor(span, sourceSpan, expression) {
    super(span, sourceSpan);
    this.expression = expression;
  }
  visit(visitor, context = null) {
    return visitor.visitNonNullAssert(this, context);
  }
};
var Call = class extends AST {
  constructor(span, sourceSpan, receiver, args, argumentSpan) {
    super(span, sourceSpan);
    this.receiver = receiver;
    this.args = args;
    this.argumentSpan = argumentSpan;
  }
  visit(visitor, context = null) {
    return visitor.visitCall(this, context);
  }
};
var SafeCall = class extends AST {
  constructor(span, sourceSpan, receiver, args, argumentSpan) {
    super(span, sourceSpan);
    this.receiver = receiver;
    this.args = args;
    this.argumentSpan = argumentSpan;
  }
  visit(visitor, context = null) {
    return visitor.visitSafeCall(this, context);
  }
};
var AbsoluteSourceSpan = class {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
};
var ASTWithSource = class extends AST {
  constructor(ast, source, location, absoluteOffset, errors) {
    super(new ParseSpan(0, source === null ? 0 : source.length), new AbsoluteSourceSpan(absoluteOffset, source === null ? absoluteOffset : absoluteOffset + source.length));
    this.ast = ast;
    this.source = source;
    this.location = location;
    this.errors = errors;
  }
  visit(visitor, context = null) {
    if (visitor.visitASTWithSource) {
      return visitor.visitASTWithSource(this, context);
    }
    return this.ast.visit(visitor, context);
  }
  toString() {
    return `${this.source} in ${this.location}`;
  }
};
var VariableBinding = class {
  /**
   * @param sourceSpan entire span of the binding.
   * @param key name of the LHS along with its span.
   * @param value optional value for the RHS along with its span.
   */
  constructor(sourceSpan, key, value) {
    this.sourceSpan = sourceSpan;
    this.key = key;
    this.value = value;
  }
};
var ExpressionBinding = class {
  /**
   * @param sourceSpan entire span of the binding.
   * @param key binding name, like ngForOf, ngForTrackBy, ngIf, along with its
   * span. Note that the length of the span may not be the same as
   * `key.source.length`. For example,
   * 1. key.source = ngFor, key.span is for "ngFor"
   * 2. key.source = ngForOf, key.span is for "of"
   * 3. key.source = ngForTrackBy, key.span is for "trackBy"
   * @param value optional expression for the RHS.
   */
  constructor(sourceSpan, key, value) {
    this.sourceSpan = sourceSpan;
    this.key = key;
    this.value = value;
  }
};
var RecursiveAstVisitor = class {
  visit(ast, context) {
    ast.visit(this, context);
  }
  visitUnary(ast, context) {
    this.visit(ast.expr, context);
  }
  visitBinary(ast, context) {
    this.visit(ast.left, context);
    this.visit(ast.right, context);
  }
  visitChain(ast, context) {
    this.visitAll(ast.expressions, context);
  }
  visitConditional(ast, context) {
    this.visit(ast.condition, context);
    this.visit(ast.trueExp, context);
    this.visit(ast.falseExp, context);
  }
  visitPipe(ast, context) {
    this.visit(ast.exp, context);
    this.visitAll(ast.args, context);
  }
  visitImplicitReceiver(ast, context) {
  }
  visitThisReceiver(ast, context) {
  }
  visitInterpolation(ast, context) {
    this.visitAll(ast.expressions, context);
  }
  visitKeyedRead(ast, context) {
    this.visit(ast.receiver, context);
    this.visit(ast.key, context);
  }
  visitKeyedWrite(ast, context) {
    this.visit(ast.receiver, context);
    this.visit(ast.key, context);
    this.visit(ast.value, context);
  }
  visitLiteralArray(ast, context) {
    this.visitAll(ast.expressions, context);
  }
  visitLiteralMap(ast, context) {
    this.visitAll(ast.values, context);
  }
  visitLiteralPrimitive(ast, context) {
  }
  visitPrefixNot(ast, context) {
    this.visit(ast.expression, context);
  }
  visitNonNullAssert(ast, context) {
    this.visit(ast.expression, context);
  }
  visitPropertyRead(ast, context) {
    this.visit(ast.receiver, context);
  }
  visitPropertyWrite(ast, context) {
    this.visit(ast.receiver, context);
    this.visit(ast.value, context);
  }
  visitSafePropertyRead(ast, context) {
    this.visit(ast.receiver, context);
  }
  visitSafeKeyedRead(ast, context) {
    this.visit(ast.receiver, context);
    this.visit(ast.key, context);
  }
  visitCall(ast, context) {
    this.visit(ast.receiver, context);
    this.visitAll(ast.args, context);
  }
  visitSafeCall(ast, context) {
    this.visit(ast.receiver, context);
    this.visitAll(ast.args, context);
  }
  // This is not part of the AstVisitor interface, just a helper method
  visitAll(asts, context) {
    for (const ast of asts) {
      this.visit(ast, context);
    }
  }
};
var AstTransformer = class {
  visitImplicitReceiver(ast, context) {
    return ast;
  }
  visitThisReceiver(ast, context) {
    return ast;
  }
  visitInterpolation(ast, context) {
    return new Interpolation$1(ast.span, ast.sourceSpan, ast.strings, this.visitAll(ast.expressions));
  }
  visitLiteralPrimitive(ast, context) {
    return new LiteralPrimitive(ast.span, ast.sourceSpan, ast.value);
  }
  visitPropertyRead(ast, context) {
    return new PropertyRead(ast.span, ast.sourceSpan, ast.nameSpan, ast.receiver.visit(this), ast.name);
  }
  visitPropertyWrite(ast, context) {
    return new PropertyWrite(ast.span, ast.sourceSpan, ast.nameSpan, ast.receiver.visit(this), ast.name, ast.value.visit(this));
  }
  visitSafePropertyRead(ast, context) {
    return new SafePropertyRead(ast.span, ast.sourceSpan, ast.nameSpan, ast.receiver.visit(this), ast.name);
  }
  visitLiteralArray(ast, context) {
    return new LiteralArray(ast.span, ast.sourceSpan, this.visitAll(ast.expressions));
  }
  visitLiteralMap(ast, context) {
    return new LiteralMap(ast.span, ast.sourceSpan, ast.keys, this.visitAll(ast.values));
  }
  visitUnary(ast, context) {
    switch (ast.operator) {
      case "+":
        return Unary.createPlus(ast.span, ast.sourceSpan, ast.expr.visit(this));
      case "-":
        return Unary.createMinus(ast.span, ast.sourceSpan, ast.expr.visit(this));
      default:
        throw new Error(`Unknown unary operator ${ast.operator}`);
    }
  }
  visitBinary(ast, context) {
    return new Binary(ast.span, ast.sourceSpan, ast.operation, ast.left.visit(this), ast.right.visit(this));
  }
  visitPrefixNot(ast, context) {
    return new PrefixNot(ast.span, ast.sourceSpan, ast.expression.visit(this));
  }
  visitNonNullAssert(ast, context) {
    return new NonNullAssert(ast.span, ast.sourceSpan, ast.expression.visit(this));
  }
  visitConditional(ast, context) {
    return new Conditional(ast.span, ast.sourceSpan, ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
  }
  visitPipe(ast, context) {
    return new BindingPipe(ast.span, ast.sourceSpan, ast.exp.visit(this), ast.name, this.visitAll(ast.args), ast.nameSpan);
  }
  visitKeyedRead(ast, context) {
    return new KeyedRead(ast.span, ast.sourceSpan, ast.receiver.visit(this), ast.key.visit(this));
  }
  visitKeyedWrite(ast, context) {
    return new KeyedWrite(ast.span, ast.sourceSpan, ast.receiver.visit(this), ast.key.visit(this), ast.value.visit(this));
  }
  visitCall(ast, context) {
    return new Call(ast.span, ast.sourceSpan, ast.receiver.visit(this), this.visitAll(ast.args), ast.argumentSpan);
  }
  visitSafeCall(ast, context) {
    return new SafeCall(ast.span, ast.sourceSpan, ast.receiver.visit(this), this.visitAll(ast.args), ast.argumentSpan);
  }
  visitAll(asts) {
    const res = [];
    for (let i = 0; i < asts.length; ++i) {
      res[i] = asts[i].visit(this);
    }
    return res;
  }
  visitChain(ast, context) {
    return new Chain(ast.span, ast.sourceSpan, this.visitAll(ast.expressions));
  }
  visitSafeKeyedRead(ast, context) {
    return new SafeKeyedRead(ast.span, ast.sourceSpan, ast.receiver.visit(this), ast.key.visit(this));
  }
};
var AstMemoryEfficientTransformer = class {
  visitImplicitReceiver(ast, context) {
    return ast;
  }
  visitThisReceiver(ast, context) {
    return ast;
  }
  visitInterpolation(ast, context) {
    const expressions = this.visitAll(ast.expressions);
    if (expressions !== ast.expressions)
      return new Interpolation$1(ast.span, ast.sourceSpan, ast.strings, expressions);
    return ast;
  }
  visitLiteralPrimitive(ast, context) {
    return ast;
  }
  visitPropertyRead(ast, context) {
    const receiver = ast.receiver.visit(this);
    if (receiver !== ast.receiver) {
      return new PropertyRead(ast.span, ast.sourceSpan, ast.nameSpan, receiver, ast.name);
    }
    return ast;
  }
  visitPropertyWrite(ast, context) {
    const receiver = ast.receiver.visit(this);
    const value = ast.value.visit(this);
    if (receiver !== ast.receiver || value !== ast.value) {
      return new PropertyWrite(ast.span, ast.sourceSpan, ast.nameSpan, receiver, ast.name, value);
    }
    return ast;
  }
  visitSafePropertyRead(ast, context) {
    const receiver = ast.receiver.visit(this);
    if (receiver !== ast.receiver) {
      return new SafePropertyRead(ast.span, ast.sourceSpan, ast.nameSpan, receiver, ast.name);
    }
    return ast;
  }
  visitLiteralArray(ast, context) {
    const expressions = this.visitAll(ast.expressions);
    if (expressions !== ast.expressions) {
      return new LiteralArray(ast.span, ast.sourceSpan, expressions);
    }
    return ast;
  }
  visitLiteralMap(ast, context) {
    const values = this.visitAll(ast.values);
    if (values !== ast.values) {
      return new LiteralMap(ast.span, ast.sourceSpan, ast.keys, values);
    }
    return ast;
  }
  visitUnary(ast, context) {
    const expr = ast.expr.visit(this);
    if (expr !== ast.expr) {
      switch (ast.operator) {
        case "+":
          return Unary.createPlus(ast.span, ast.sourceSpan, expr);
        case "-":
          return Unary.createMinus(ast.span, ast.sourceSpan, expr);
        default:
          throw new Error(`Unknown unary operator ${ast.operator}`);
      }
    }
    return ast;
  }
  visitBinary(ast, context) {
    const left = ast.left.visit(this);
    const right = ast.right.visit(this);
    if (left !== ast.left || right !== ast.right) {
      return new Binary(ast.span, ast.sourceSpan, ast.operation, left, right);
    }
    return ast;
  }
  visitPrefixNot(ast, context) {
    const expression = ast.expression.visit(this);
    if (expression !== ast.expression) {
      return new PrefixNot(ast.span, ast.sourceSpan, expression);
    }
    return ast;
  }
  visitNonNullAssert(ast, context) {
    const expression = ast.expression.visit(this);
    if (expression !== ast.expression) {
      return new NonNullAssert(ast.span, ast.sourceSpan, expression);
    }
    return ast;
  }
  visitConditional(ast, context) {
    const condition = ast.condition.visit(this);
    const trueExp = ast.trueExp.visit(this);
    const falseExp = ast.falseExp.visit(this);
    if (condition !== ast.condition || trueExp !== ast.trueExp || falseExp !== ast.falseExp) {
      return new Conditional(ast.span, ast.sourceSpan, condition, trueExp, falseExp);
    }
    return ast;
  }
  visitPipe(ast, context) {
    const exp = ast.exp.visit(this);
    const args = this.visitAll(ast.args);
    if (exp !== ast.exp || args !== ast.args) {
      return new BindingPipe(ast.span, ast.sourceSpan, exp, ast.name, args, ast.nameSpan);
    }
    return ast;
  }
  visitKeyedRead(ast, context) {
    const obj = ast.receiver.visit(this);
    const key = ast.key.visit(this);
    if (obj !== ast.receiver || key !== ast.key) {
      return new KeyedRead(ast.span, ast.sourceSpan, obj, key);
    }
    return ast;
  }
  visitKeyedWrite(ast, context) {
    const obj = ast.receiver.visit(this);
    const key = ast.key.visit(this);
    const value = ast.value.visit(this);
    if (obj !== ast.receiver || key !== ast.key || value !== ast.value) {
      return new KeyedWrite(ast.span, ast.sourceSpan, obj, key, value);
    }
    return ast;
  }
  visitAll(asts) {
    const res = [];
    let modified = false;
    for (let i = 0; i < asts.length; ++i) {
      const original = asts[i];
      const value = original.visit(this);
      res[i] = value;
      modified = modified || value !== original;
    }
    return modified ? res : asts;
  }
  visitChain(ast, context) {
    const expressions = this.visitAll(ast.expressions);
    if (expressions !== ast.expressions) {
      return new Chain(ast.span, ast.sourceSpan, expressions);
    }
    return ast;
  }
  visitCall(ast, context) {
    const receiver = ast.receiver.visit(this);
    const args = this.visitAll(ast.args);
    if (receiver !== ast.receiver || args !== ast.args) {
      return new Call(ast.span, ast.sourceSpan, receiver, args, ast.argumentSpan);
    }
    return ast;
  }
  visitSafeCall(ast, context) {
    const receiver = ast.receiver.visit(this);
    const args = this.visitAll(ast.args);
    if (receiver !== ast.receiver || args !== ast.args) {
      return new SafeCall(ast.span, ast.sourceSpan, receiver, args, ast.argumentSpan);
    }
    return ast;
  }
  visitSafeKeyedRead(ast, context) {
    const obj = ast.receiver.visit(this);
    const key = ast.key.visit(this);
    if (obj !== ast.receiver || key !== ast.key) {
      return new SafeKeyedRead(ast.span, ast.sourceSpan, obj, key);
    }
    return ast;
  }
};
var ParsedProperty = class {
  constructor(name, expression, type, sourceSpan, keySpan, valueSpan) {
    this.name = name;
    this.expression = expression;
    this.type = type;
    this.sourceSpan = sourceSpan;
    this.keySpan = keySpan;
    this.valueSpan = valueSpan;
    this.isLiteral = this.type === ParsedPropertyType.LITERAL_ATTR;
    this.isAnimation = this.type === ParsedPropertyType.ANIMATION;
  }
};
var ParsedPropertyType;
(function(ParsedPropertyType2) {
  ParsedPropertyType2[ParsedPropertyType2["DEFAULT"] = 0] = "DEFAULT";
  ParsedPropertyType2[ParsedPropertyType2["LITERAL_ATTR"] = 1] = "LITERAL_ATTR";
  ParsedPropertyType2[ParsedPropertyType2["ANIMATION"] = 2] = "ANIMATION";
})(ParsedPropertyType || (ParsedPropertyType = {}));
var ParsedEvent = class {
  // Regular events have a target
  // Animation events have a phase
  constructor(name, targetOrPhase, type, handler, sourceSpan, handlerSpan, keySpan) {
    this.name = name;
    this.targetOrPhase = targetOrPhase;
    this.type = type;
    this.handler = handler;
    this.sourceSpan = sourceSpan;
    this.handlerSpan = handlerSpan;
    this.keySpan = keySpan;
  }
};
var ParsedVariable = class {
  constructor(name, value, sourceSpan, keySpan, valueSpan) {
    this.name = name;
    this.value = value;
    this.sourceSpan = sourceSpan;
    this.keySpan = keySpan;
    this.valueSpan = valueSpan;
  }
};
var BoundElementProperty = class {
  constructor(name, type, securityContext, value, unit, sourceSpan, keySpan, valueSpan) {
    this.name = name;
    this.type = type;
    this.securityContext = securityContext;
    this.value = value;
    this.unit = unit;
    this.sourceSpan = sourceSpan;
    this.keySpan = keySpan;
    this.valueSpan = valueSpan;
  }
};
var _EventHandlerVars = class _EventHandlerVars {
};
_EventHandlerVars.event = variable("$event");
var EventHandlerVars = _EventHandlerVars;
function convertActionBinding(localResolver, implicitReceiver, action, bindingId, baseSourceSpan, implicitReceiverAccesses, globals) {
  if (!localResolver) {
    localResolver = new DefaultLocalResolver(globals);
  }
  const actionWithoutBuiltins = convertPropertyBindingBuiltins({
    createLiteralArrayConverter: (argCount) => {
      return (args) => literalArr(args);
    },
    createLiteralMapConverter: (keys) => {
      return (values) => {
        const entries = keys.map((k, i) => ({
          key: k.key,
          value: values[i],
          quoted: k.quoted
        }));
        return literalMap(entries);
      };
    },
    createPipeConverter: (name) => {
      throw new Error(`Illegal State: Actions are not allowed to contain pipes. Pipe: ${name}`);
    }
  }, action);
  const visitor = new _AstToIrVisitor(
    localResolver,
    implicitReceiver,
    bindingId,
    /* supportsInterpolation */
    false,
    baseSourceSpan,
    implicitReceiverAccesses
  );
  const actionStmts = [];
  flattenStatements(actionWithoutBuiltins.visit(visitor, _Mode.Statement), actionStmts);
  prependTemporaryDecls(visitor.temporaryCount, bindingId, actionStmts);
  if (visitor.usesImplicitReceiver) {
    localResolver.notifyImplicitReceiverUse();
  }
  const lastIndex = actionStmts.length - 1;
  if (lastIndex >= 0) {
    const lastStatement = actionStmts[lastIndex];
    if (lastStatement instanceof ExpressionStatement) {
      actionStmts[lastIndex] = new ReturnStatement(lastStatement.expr);
    }
  }
  return actionStmts;
}
function convertPropertyBindingBuiltins(converterFactory, ast) {
  return convertBuiltins(converterFactory, ast);
}
var ConvertPropertyBindingResult = class {
  constructor(stmts, currValExpr) {
    this.stmts = stmts;
    this.currValExpr = currValExpr;
  }
};
function convertPropertyBinding(localResolver, implicitReceiver, expressionWithoutBuiltins, bindingId) {
  if (!localResolver) {
    localResolver = new DefaultLocalResolver();
  }
  const visitor = new _AstToIrVisitor(
    localResolver,
    implicitReceiver,
    bindingId,
    /* supportsInterpolation */
    false
  );
  const outputExpr = expressionWithoutBuiltins.visit(visitor, _Mode.Expression);
  const stmts = getStatementsFromVisitor(visitor, bindingId);
  if (visitor.usesImplicitReceiver) {
    localResolver.notifyImplicitReceiverUse();
  }
  return new ConvertPropertyBindingResult(stmts, outputExpr);
}
function convertUpdateArguments(localResolver, contextVariableExpression, expressionWithArgumentsToExtract, bindingId) {
  const visitor = new _AstToIrVisitor(
    localResolver,
    contextVariableExpression,
    bindingId,
    /* supportsInterpolation */
    true
  );
  const outputExpr = visitor.visitInterpolation(expressionWithArgumentsToExtract, _Mode.Expression);
  if (visitor.usesImplicitReceiver) {
    localResolver.notifyImplicitReceiverUse();
  }
  const stmts = getStatementsFromVisitor(visitor, bindingId);
  const args = outputExpr.args;
  return { stmts, args };
}
function getStatementsFromVisitor(visitor, bindingId) {
  const stmts = [];
  for (let i = 0; i < visitor.temporaryCount; i++) {
    stmts.push(temporaryDeclaration(bindingId, i));
  }
  return stmts;
}
function convertBuiltins(converterFactory, ast) {
  const visitor = new _BuiltinAstConverter(converterFactory);
  return ast.visit(visitor);
}
function temporaryName(bindingId, temporaryNumber) {
  return `tmp_${bindingId}_${temporaryNumber}`;
}
function temporaryDeclaration(bindingId, temporaryNumber) {
  return new DeclareVarStmt(temporaryName(bindingId, temporaryNumber));
}
function prependTemporaryDecls(temporaryCount, bindingId, statements) {
  for (let i = temporaryCount - 1; i >= 0; i--) {
    statements.unshift(temporaryDeclaration(bindingId, i));
  }
}
var _Mode;
(function(_Mode2) {
  _Mode2[_Mode2["Statement"] = 0] = "Statement";
  _Mode2[_Mode2["Expression"] = 1] = "Expression";
})(_Mode || (_Mode = {}));
function ensureStatementMode(mode, ast) {
  if (mode !== _Mode.Statement) {
    throw new Error(`Expected a statement, but saw ${ast}`);
  }
}
function ensureExpressionMode(mode, ast) {
  if (mode !== _Mode.Expression) {
    throw new Error(`Expected an expression, but saw ${ast}`);
  }
}
function convertToStatementIfNeeded(mode, expr) {
  if (mode === _Mode.Statement) {
    return expr.toStmt();
  } else {
    return expr;
  }
}
var _BuiltinAstConverter = class extends AstTransformer {
  constructor(_converterFactory) {
    super();
    this._converterFactory = _converterFactory;
  }
  visitPipe(ast, context) {
    const args = [ast.exp, ...ast.args].map((ast2) => ast2.visit(this, context));
    return new BuiltinFunctionCall(ast.span, ast.sourceSpan, args, this._converterFactory.createPipeConverter(ast.name, args.length));
  }
  visitLiteralArray(ast, context) {
    const args = ast.expressions.map((ast2) => ast2.visit(this, context));
    return new BuiltinFunctionCall(ast.span, ast.sourceSpan, args, this._converterFactory.createLiteralArrayConverter(ast.expressions.length));
  }
  visitLiteralMap(ast, context) {
    const args = ast.values.map((ast2) => ast2.visit(this, context));
    return new BuiltinFunctionCall(ast.span, ast.sourceSpan, args, this._converterFactory.createLiteralMapConverter(ast.keys));
  }
};
var _AstToIrVisitor = class {
  constructor(_localResolver, _implicitReceiver, bindingId, supportsInterpolation, baseSourceSpan, implicitReceiverAccesses) {
    this._localResolver = _localResolver;
    this._implicitReceiver = _implicitReceiver;
    this.bindingId = bindingId;
    this.supportsInterpolation = supportsInterpolation;
    this.baseSourceSpan = baseSourceSpan;
    this.implicitReceiverAccesses = implicitReceiverAccesses;
    this._nodeMap = /* @__PURE__ */ new Map();
    this._resultMap = /* @__PURE__ */ new Map();
    this._currentTemporary = 0;
    this.temporaryCount = 0;
    this.usesImplicitReceiver = false;
  }
  visitUnary(ast, mode) {
    let op;
    switch (ast.operator) {
      case "+":
        op = UnaryOperator.Plus;
        break;
      case "-":
        op = UnaryOperator.Minus;
        break;
      default:
        throw new Error(`Unsupported operator ${ast.operator}`);
    }
    return convertToStatementIfNeeded(mode, new UnaryOperatorExpr(op, this._visit(ast.expr, _Mode.Expression), void 0, this.convertSourceSpan(ast.span)));
  }
  visitBinary(ast, mode) {
    let op;
    switch (ast.operation) {
      case "+":
        op = BinaryOperator.Plus;
        break;
      case "-":
        op = BinaryOperator.Minus;
        break;
      case "*":
        op = BinaryOperator.Multiply;
        break;
      case "/":
        op = BinaryOperator.Divide;
        break;
      case "%":
        op = BinaryOperator.Modulo;
        break;
      case "&&":
        op = BinaryOperator.And;
        break;
      case "||":
        op = BinaryOperator.Or;
        break;
      case "==":
        op = BinaryOperator.Equals;
        break;
      case "!=":
        op = BinaryOperator.NotEquals;
        break;
      case "===":
        op = BinaryOperator.Identical;
        break;
      case "!==":
        op = BinaryOperator.NotIdentical;
        break;
      case "<":
        op = BinaryOperator.Lower;
        break;
      case ">":
        op = BinaryOperator.Bigger;
        break;
      case "<=":
        op = BinaryOperator.LowerEquals;
        break;
      case ">=":
        op = BinaryOperator.BiggerEquals;
        break;
      case "??":
        return this.convertNullishCoalesce(ast, mode);
      default:
        throw new Error(`Unsupported operation ${ast.operation}`);
    }
    return convertToStatementIfNeeded(mode, new BinaryOperatorExpr(op, this._visit(ast.left, _Mode.Expression), this._visit(ast.right, _Mode.Expression), void 0, this.convertSourceSpan(ast.span)));
  }
  visitChain(ast, mode) {
    ensureStatementMode(mode, ast);
    return this.visitAll(ast.expressions, mode);
  }
  visitConditional(ast, mode) {
    const value = this._visit(ast.condition, _Mode.Expression);
    return convertToStatementIfNeeded(mode, value.conditional(this._visit(ast.trueExp, _Mode.Expression), this._visit(ast.falseExp, _Mode.Expression), this.convertSourceSpan(ast.span)));
  }
  visitPipe(ast, mode) {
    throw new Error(`Illegal state: Pipes should have been converted into functions. Pipe: ${ast.name}`);
  }
  visitImplicitReceiver(ast, mode) {
    ensureExpressionMode(mode, ast);
    this.usesImplicitReceiver = true;
    return this._implicitReceiver;
  }
  visitThisReceiver(ast, mode) {
    return this.visitImplicitReceiver(ast, mode);
  }
  visitInterpolation(ast, mode) {
    if (!this.supportsInterpolation) {
      throw new Error("Unexpected interpolation");
    }
    ensureExpressionMode(mode, ast);
    let args = [];
    for (let i = 0; i < ast.strings.length - 1; i++) {
      args.push(literal(ast.strings[i]));
      args.push(this._visit(ast.expressions[i], _Mode.Expression));
    }
    args.push(literal(ast.strings[ast.strings.length - 1]));
    const strings = ast.strings;
    if (strings.length === 2 && strings[0] === "" && strings[1] === "") {
      args = [args[1]];
    } else if (ast.expressions.length >= 9) {
      args = [literalArr(args)];
    }
    return new InterpolationExpression(args);
  }
  visitKeyedRead(ast, mode) {
    const leftMostSafe = this.leftMostSafeNode(ast);
    if (leftMostSafe) {
      return this.convertSafeAccess(ast, leftMostSafe, mode);
    } else {
      return convertToStatementIfNeeded(mode, this._visit(ast.receiver, _Mode.Expression).key(this._visit(ast.key, _Mode.Expression)));
    }
  }
  visitKeyedWrite(ast, mode) {
    const obj = this._visit(ast.receiver, _Mode.Expression);
    const key = this._visit(ast.key, _Mode.Expression);
    const value = this._visit(ast.value, _Mode.Expression);
    if (obj === this._implicitReceiver) {
      this._localResolver.maybeRestoreView();
    }
    return convertToStatementIfNeeded(mode, obj.key(key).set(value));
  }
  visitLiteralArray(ast, mode) {
    throw new Error(`Illegal State: literal arrays should have been converted into functions`);
  }
  visitLiteralMap(ast, mode) {
    throw new Error(`Illegal State: literal maps should have been converted into functions`);
  }
  visitLiteralPrimitive(ast, mode) {
    const type = ast.value === null || ast.value === void 0 || ast.value === true || ast.value === true ? INFERRED_TYPE : void 0;
    return convertToStatementIfNeeded(mode, literal(ast.value, type, this.convertSourceSpan(ast.span)));
  }
  _getLocal(name, receiver) {
    if (this._localResolver.globals?.has(name) && receiver instanceof ThisReceiver) {
      return null;
    }
    return this._localResolver.getLocal(name);
  }
  visitPrefixNot(ast, mode) {
    return convertToStatementIfNeeded(mode, not(this._visit(ast.expression, _Mode.Expression)));
  }
  visitNonNullAssert(ast, mode) {
    return convertToStatementIfNeeded(mode, this._visit(ast.expression, _Mode.Expression));
  }
  visitPropertyRead(ast, mode) {
    const leftMostSafe = this.leftMostSafeNode(ast);
    if (leftMostSafe) {
      return this.convertSafeAccess(ast, leftMostSafe, mode);
    } else {
      let result = null;
      const prevUsesImplicitReceiver = this.usesImplicitReceiver;
      const receiver = this._visit(ast.receiver, _Mode.Expression);
      if (receiver === this._implicitReceiver) {
        result = this._getLocal(ast.name, ast.receiver);
        if (result) {
          this.usesImplicitReceiver = prevUsesImplicitReceiver;
          this.addImplicitReceiverAccess(ast.name);
        }
      }
      if (result == null) {
        result = receiver.prop(ast.name, this.convertSourceSpan(ast.span));
      }
      return convertToStatementIfNeeded(mode, result);
    }
  }
  visitPropertyWrite(ast, mode) {
    const receiver = this._visit(ast.receiver, _Mode.Expression);
    const prevUsesImplicitReceiver = this.usesImplicitReceiver;
    let varExpr = null;
    if (receiver === this._implicitReceiver) {
      const localExpr = this._getLocal(ast.name, ast.receiver);
      if (localExpr) {
        if (localExpr instanceof ReadPropExpr) {
          varExpr = localExpr;
          this.usesImplicitReceiver = prevUsesImplicitReceiver;
          this.addImplicitReceiverAccess(ast.name);
        } else {
          const receiver2 = ast.name;
          const value = ast.value instanceof PropertyRead ? ast.value.name : void 0;
          throw new Error(`Cannot assign value "${value}" to template variable "${receiver2}". Template variables are read-only.`);
        }
      }
    }
    if (varExpr === null) {
      varExpr = receiver.prop(ast.name, this.convertSourceSpan(ast.span));
    }
    return convertToStatementIfNeeded(mode, varExpr.set(this._visit(ast.value, _Mode.Expression)));
  }
  visitSafePropertyRead(ast, mode) {
    return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
  }
  visitSafeKeyedRead(ast, mode) {
    return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
  }
  visitAll(asts, mode) {
    return asts.map((ast) => this._visit(ast, mode));
  }
  visitCall(ast, mode) {
    const leftMostSafe = this.leftMostSafeNode(ast);
    if (leftMostSafe) {
      return this.convertSafeAccess(ast, leftMostSafe, mode);
    }
    const convertedArgs = this.visitAll(ast.args, _Mode.Expression);
    if (ast instanceof BuiltinFunctionCall) {
      return convertToStatementIfNeeded(mode, ast.converter(convertedArgs));
    }
    const receiver = ast.receiver;
    if (receiver instanceof PropertyRead && receiver.receiver instanceof ImplicitReceiver && !(receiver.receiver instanceof ThisReceiver) && receiver.name === "$any") {
      if (convertedArgs.length !== 1) {
        throw new Error(`Invalid call to $any, expected 1 argument but received ${convertedArgs.length || "none"}`);
      }
      return convertToStatementIfNeeded(mode, convertedArgs[0]);
    }
    const call2 = this._visit(receiver, _Mode.Expression).callFn(convertedArgs, this.convertSourceSpan(ast.span));
    return convertToStatementIfNeeded(mode, call2);
  }
  visitSafeCall(ast, mode) {
    return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
  }
  _visit(ast, mode) {
    const result = this._resultMap.get(ast);
    if (result)
      return result;
    return (this._nodeMap.get(ast) || ast).visit(this, mode);
  }
  convertSafeAccess(ast, leftMostSafe, mode) {
    let guardedExpression2 = this._visit(leftMostSafe.receiver, _Mode.Expression);
    let temporary = void 0;
    if (this.needsTemporaryInSafeAccess(leftMostSafe.receiver)) {
      temporary = this.allocateTemporary();
      guardedExpression2 = temporary.set(guardedExpression2);
      this._resultMap.set(leftMostSafe.receiver, temporary);
    }
    const condition = guardedExpression2.isBlank();
    if (leftMostSafe instanceof SafeCall) {
      this._nodeMap.set(leftMostSafe, new Call(leftMostSafe.span, leftMostSafe.sourceSpan, leftMostSafe.receiver, leftMostSafe.args, leftMostSafe.argumentSpan));
    } else if (leftMostSafe instanceof SafeKeyedRead) {
      this._nodeMap.set(leftMostSafe, new KeyedRead(leftMostSafe.span, leftMostSafe.sourceSpan, leftMostSafe.receiver, leftMostSafe.key));
    } else {
      this._nodeMap.set(leftMostSafe, new PropertyRead(leftMostSafe.span, leftMostSafe.sourceSpan, leftMostSafe.nameSpan, leftMostSafe.receiver, leftMostSafe.name));
    }
    const access = this._visit(ast, _Mode.Expression);
    this._nodeMap.delete(leftMostSafe);
    if (temporary) {
      this.releaseTemporary(temporary);
    }
    return convertToStatementIfNeeded(mode, condition.conditional(NULL_EXPR, access));
  }
  convertNullishCoalesce(ast, mode) {
    const left = this._visit(ast.left, _Mode.Expression);
    const right = this._visit(ast.right, _Mode.Expression);
    const temporary = this.allocateTemporary();
    this.releaseTemporary(temporary);
    return convertToStatementIfNeeded(mode, temporary.set(left).notIdentical(NULL_EXPR).and(temporary.notIdentical(literal(void 0))).conditional(temporary, right));
  }
  // Given an expression of the form a?.b.c?.d.e then the left most safe node is
  // the (a?.b). The . and ?. are left associative thus can be rewritten as:
  // ((((a?.c).b).c)?.d).e. This returns the most deeply nested safe read or
  // safe method call as this needs to be transformed initially to:
  //   a == null ? null : a.c.b.c?.d.e
  // then to:
  //   a == null ? null : a.b.c == null ? null : a.b.c.d.e
  leftMostSafeNode(ast) {
    const visit = (visitor, ast2) => {
      return (this._nodeMap.get(ast2) || ast2).visit(visitor);
    };
    return ast.visit({
      visitUnary(ast2) {
        return null;
      },
      visitBinary(ast2) {
        return null;
      },
      visitChain(ast2) {
        return null;
      },
      visitConditional(ast2) {
        return null;
      },
      visitCall(ast2) {
        return visit(this, ast2.receiver);
      },
      visitSafeCall(ast2) {
        return visit(this, ast2.receiver) || ast2;
      },
      visitImplicitReceiver(ast2) {
        return null;
      },
      visitThisReceiver(ast2) {
        return null;
      },
      visitInterpolation(ast2) {
        return null;
      },
      visitKeyedRead(ast2) {
        return visit(this, ast2.receiver);
      },
      visitKeyedWrite(ast2) {
        return null;
      },
      visitLiteralArray(ast2) {
        return null;
      },
      visitLiteralMap(ast2) {
        return null;
      },
      visitLiteralPrimitive(ast2) {
        return null;
      },
      visitPipe(ast2) {
        return null;
      },
      visitPrefixNot(ast2) {
        return null;
      },
      visitNonNullAssert(ast2) {
        return visit(this, ast2.expression);
      },
      visitPropertyRead(ast2) {
        return visit(this, ast2.receiver);
      },
      visitPropertyWrite(ast2) {
        return null;
      },
      visitSafePropertyRead(ast2) {
        return visit(this, ast2.receiver) || ast2;
      },
      visitSafeKeyedRead(ast2) {
        return visit(this, ast2.receiver) || ast2;
      }
    });
  }
  // Returns true of the AST includes a method or a pipe indicating that, if the
  // expression is used as the target of a safe property or method access then
  // the expression should be stored into a temporary variable.
  needsTemporaryInSafeAccess(ast) {
    const visit = (visitor, ast2) => {
      return ast2 && (this._nodeMap.get(ast2) || ast2).visit(visitor);
    };
    const visitSome = (visitor, ast2) => {
      return ast2.some((ast3) => visit(visitor, ast3));
    };
    return ast.visit({
      visitUnary(ast2) {
        return visit(this, ast2.expr);
      },
      visitBinary(ast2) {
        return visit(this, ast2.left) || visit(this, ast2.right);
      },
      visitChain(ast2) {
        return false;
      },
      visitConditional(ast2) {
        return visit(this, ast2.condition) || visit(this, ast2.trueExp) || visit(this, ast2.falseExp);
      },
      visitCall(ast2) {
        return true;
      },
      visitSafeCall(ast2) {
        return true;
      },
      visitImplicitReceiver(ast2) {
        return false;
      },
      visitThisReceiver(ast2) {
        return false;
      },
      visitInterpolation(ast2) {
        return visitSome(this, ast2.expressions);
      },
      visitKeyedRead(ast2) {
        return false;
      },
      visitKeyedWrite(ast2) {
        return false;
      },
      visitLiteralArray(ast2) {
        return true;
      },
      visitLiteralMap(ast2) {
        return true;
      },
      visitLiteralPrimitive(ast2) {
        return false;
      },
      visitPipe(ast2) {
        return true;
      },
      visitPrefixNot(ast2) {
        return visit(this, ast2.expression);
      },
      visitNonNullAssert(ast2) {
        return visit(this, ast2.expression);
      },
      visitPropertyRead(ast2) {
        return false;
      },
      visitPropertyWrite(ast2) {
        return false;
      },
      visitSafePropertyRead(ast2) {
        return false;
      },
      visitSafeKeyedRead(ast2) {
        return false;
      }
    });
  }
  allocateTemporary() {
    const tempNumber = this._currentTemporary++;
    this.temporaryCount = Math.max(this._currentTemporary, this.temporaryCount);
    return new ReadVarExpr(temporaryName(this.bindingId, tempNumber));
  }
  releaseTemporary(temporary) {
    this._currentTemporary--;
    if (temporary.name != temporaryName(this.bindingId, this._currentTemporary)) {
      throw new Error(`Temporary ${temporary.name} released out of order`);
    }
  }
  /**
   * Creates an absolute `ParseSourceSpan` from the relative `ParseSpan`.
   *
   * `ParseSpan` objects are relative to the start of the expression.
   * This method converts these to full `ParseSourceSpan` objects that
   * show where the span is within the overall source file.
   *
   * @param span the relative span to convert.
   * @returns a `ParseSourceSpan` for the given span or null if no
   * `baseSourceSpan` was provided to this class.
   */
  convertSourceSpan(span) {
    if (this.baseSourceSpan) {
      const start = this.baseSourceSpan.start.moveBy(span.start);
      const end = this.baseSourceSpan.start.moveBy(span.end);
      const fullStart = this.baseSourceSpan.fullStart.moveBy(span.start);
      return new ParseSourceSpan(start, end, fullStart);
    } else {
      return null;
    }
  }
  /** Adds the name of an AST to the list of implicit receiver accesses. */
  addImplicitReceiverAccess(name) {
    if (this.implicitReceiverAccesses) {
      this.implicitReceiverAccesses.add(name);
    }
  }
};
function flattenStatements(arg, output) {
  if (Array.isArray(arg)) {
    arg.forEach((entry) => flattenStatements(entry, output));
  } else {
    output.push(arg);
  }
}
function unsupported() {
  throw new Error("Unsupported operation");
}
var InterpolationExpression = class extends Expression {
  constructor(args) {
    super(null, null);
    this.args = args;
    this.isConstant = unsupported;
    this.isEquivalent = unsupported;
    this.visitExpression = unsupported;
    this.clone = unsupported;
  }
};
var DefaultLocalResolver = class {
  constructor(globals) {
    this.globals = globals;
  }
  notifyImplicitReceiverUse() {
  }
  maybeRestoreView() {
  }
  getLocal(name) {
    if (name === EventHandlerVars.event.name) {
      return EventHandlerVars.event;
    }
    return null;
  }
};
var BuiltinFunctionCall = class extends Call {
  constructor(span, sourceSpan, args, converter) {
    super(span, sourceSpan, new EmptyExpr$1(span, sourceSpan), args, null);
    this.converter = converter;
  }
};
var _SECURITY_SCHEMA;
function SECURITY_SCHEMA() {
  if (!_SECURITY_SCHEMA) {
    _SECURITY_SCHEMA = {};
    registerContext(SecurityContext.HTML, [
      "iframe|srcdoc",
      "*|innerHTML",
      "*|outerHTML"
    ]);
    registerContext(SecurityContext.STYLE, ["*|style"]);
    registerContext(SecurityContext.URL, [
      "*|formAction",
      "area|href",
      "area|ping",
      "audio|src",
      "a|href",
      "a|ping",
      "blockquote|cite",
      "body|background",
      "del|cite",
      "form|action",
      "img|src",
      "input|src",
      "ins|cite",
      "q|cite",
      "source|src",
      "track|src",
      "video|poster",
      "video|src"
    ]);
    registerContext(SecurityContext.RESOURCE_URL, [
      "applet|code",
      "applet|codebase",
      "base|href",
      "embed|src",
      "frame|src",
      "head|profile",
      "html|manifest",
      "iframe|src",
      "link|href",
      "media|src",
      "object|codebase",
      "object|data",
      "script|src"
    ]);
  }
  return _SECURITY_SCHEMA;
}
function registerContext(ctx, specs) {
  for (const spec of specs)
    _SECURITY_SCHEMA[spec.toLowerCase()] = ctx;
}
var IFRAME_SECURITY_SENSITIVE_ATTRS = /* @__PURE__ */ new Set(["sandbox", "allow", "allowfullscreen", "referrerpolicy", "csp", "fetchpriority"]);
function isIframeSecuritySensitiveAttr(attrName) {
  return IFRAME_SECURITY_SENSITIVE_ATTRS.has(attrName.toLowerCase());
}
var animationKeywords = /* @__PURE__ */ new Set([
  // global values
  "inherit",
  "initial",
  "revert",
  "unset",
  // animation-direction
  "alternate",
  "alternate-reverse",
  "normal",
  "reverse",
  // animation-fill-mode
  "backwards",
  "both",
  "forwards",
  "none",
  // animation-play-state
  "paused",
  "running",
  // animation-timing-function
  "ease",
  "ease-in",
  "ease-in-out",
  "ease-out",
  "linear",
  "step-start",
  "step-end",
  // `steps()` function
  "end",
  "jump-both",
  "jump-end",
  "jump-none",
  "jump-start",
  "start"
]);
var ShadowCss = class {
  constructor() {
    this._animationDeclarationKeyframesRe = /(^|\s+)(?:(?:(['"])((?:\\\\|\\\2|(?!\2).)+)\2)|(-?[A-Za-z][\w\-]*))(?=[,\s]|$)/g;
  }
  /*
   * Shim some cssText with the given selector. Returns cssText that can be included in the document
   *
   * The selector is the attribute added to all elements inside the host,
   * The hostSelector is the attribute added to the host itself.
   */
  shimCssText(cssText, selector, hostSelector = "") {
    const comments = [];
    cssText = cssText.replace(_commentRe, (m) => {
      if (m.match(_commentWithHashRe)) {
        comments.push(m);
      } else {
        const newLinesMatches = m.match(_newLinesRe);
        comments.push((newLinesMatches?.join("") ?? "") + "\n");
      }
      return COMMENT_PLACEHOLDER;
    });
    cssText = this._insertDirectives(cssText);
    const scopedCssText = this._scopeCssText(cssText, selector, hostSelector);
    let commentIdx = 0;
    return scopedCssText.replace(_commentWithHashPlaceHolderRe, () => comments[commentIdx++]);
  }
  _insertDirectives(cssText) {
    cssText = this._insertPolyfillDirectivesInCssText(cssText);
    return this._insertPolyfillRulesInCssText(cssText);
  }
  /**
   * Process styles to add scope to keyframes.
   *
   * Modify both the names of the keyframes defined in the component styles and also the css
   * animation rules using them.
   *
   * Animation rules using keyframes defined elsewhere are not modified to allow for globally
   * defined keyframes.
   *
   * For example, we convert this css:
   *
   * ```
   * .box {
   *   animation: box-animation 1s forwards;
   * }
   *
   * @keyframes box-animation {
   *   to {
   *     background-color: green;
   *   }
   * }
   * ```
   *
   * to this:
   *
   * ```
   * .box {
   *   animation: scopeName_box-animation 1s forwards;
   * }
   *
   * @keyframes scopeName_box-animation {
   *   to {
   *     background-color: green;
   *   }
   * }
   * ```
   *
   * @param cssText the component's css text that needs to be scoped.
   * @param scopeSelector the component's scope selector.
   *
   * @returns the scoped css text.
   */
  _scopeKeyframesRelatedCss(cssText, scopeSelector) {
    const unscopedKeyframesSet = /* @__PURE__ */ new Set();
    const scopedKeyframesCssText = processRules(cssText, (rule) => this._scopeLocalKeyframeDeclarations(rule, scopeSelector, unscopedKeyframesSet));
    return processRules(scopedKeyframesCssText, (rule) => this._scopeAnimationRule(rule, scopeSelector, unscopedKeyframesSet));
  }
  /**
   * Scopes local keyframes names, returning the updated css rule and it also
   * adds the original keyframe name to a provided set to collect all keyframes names
   * so that it can later be used to scope the animation rules.
   *
   * For example, it takes a rule such as:
   *
   * ```
   * @keyframes box-animation {
   *   to {
   *     background-color: green;
   *   }
   * }
   * ```
   *
   * and returns:
   *
   * ```
   * @keyframes scopeName_box-animation {
   *   to {
   *     background-color: green;
   *   }
   * }
   * ```
   * and as a side effect it adds "box-animation" to the `unscopedKeyframesSet` set
   *
   * @param cssRule the css rule to process.
   * @param scopeSelector the component's scope selector.
   * @param unscopedKeyframesSet the set of unscoped keyframes names (which can be
   * modified as a side effect)
   *
   * @returns the css rule modified with the scoped keyframes name.
   */
  _scopeLocalKeyframeDeclarations(rule, scopeSelector, unscopedKeyframesSet) {
    return __spreadProps(__spreadValues({}, rule), {
      selector: rule.selector.replace(/(^@(?:-webkit-)?keyframes(?:\s+))(['"]?)(.+)\2(\s*)$/, (_, start, quote, keyframeName, endSpaces) => {
        unscopedKeyframesSet.add(unescapeQuotes(keyframeName, quote));
        return `${start}${quote}${scopeSelector}_${keyframeName}${quote}${endSpaces}`;
      })
    });
  }
  /**
   * Function used to scope a keyframes name (obtained from an animation declaration)
   * using an existing set of unscopedKeyframes names to discern if the scoping needs to be
   * performed (keyframes names of keyframes not defined in the component's css need not to be
   * scoped).
   *
   * @param keyframe the keyframes name to check.
   * @param scopeSelector the component's scope selector.
   * @param unscopedKeyframesSet the set of unscoped keyframes names.
   *
   * @returns the scoped name of the keyframe, or the original name is the name need not to be
   * scoped.
   */
  _scopeAnimationKeyframe(keyframe, scopeSelector, unscopedKeyframesSet) {
    return keyframe.replace(/^(\s*)(['"]?)(.+?)\2(\s*)$/, (_, spaces1, quote, name, spaces2) => {
      name = `${unscopedKeyframesSet.has(unescapeQuotes(name, quote)) ? scopeSelector + "_" : ""}${name}`;
      return `${spaces1}${quote}${name}${quote}${spaces2}`;
    });
  }
  /**
   * Scope an animation rule so that the keyframes mentioned in such rule
   * are scoped if defined in the component's css and left untouched otherwise.
   *
   * It can scope values of both the 'animation' and 'animation-name' properties.
   *
   * @param rule css rule to scope.
   * @param scopeSelector the component's scope selector.
   * @param unscopedKeyframesSet the set of unscoped keyframes names.
   *
   * @returns the updated css rule.
   **/
  _scopeAnimationRule(rule, scopeSelector, unscopedKeyframesSet) {
    let content = rule.content.replace(/((?:^|\s+|;)(?:-webkit-)?animation(?:\s*):(?:\s*))([^;]+)/g, (_, start, animationDeclarations) => start + animationDeclarations.replace(this._animationDeclarationKeyframesRe, (original, leadingSpaces, quote = "", quotedName, nonQuotedName) => {
      if (quotedName) {
        return `${leadingSpaces}${this._scopeAnimationKeyframe(`${quote}${quotedName}${quote}`, scopeSelector, unscopedKeyframesSet)}`;
      } else {
        return animationKeywords.has(nonQuotedName) ? original : `${leadingSpaces}${this._scopeAnimationKeyframe(nonQuotedName, scopeSelector, unscopedKeyframesSet)}`;
      }
    }));
    content = content.replace(/((?:^|\s+|;)(?:-webkit-)?animation-name(?:\s*):(?:\s*))([^;]+)/g, (_match, start, commaSeparatedKeyframes) => `${start}${commaSeparatedKeyframes.split(",").map((keyframe) => this._scopeAnimationKeyframe(keyframe, scopeSelector, unscopedKeyframesSet)).join(",")}`);
    return __spreadProps(__spreadValues({}, rule), { content });
  }
  /*
   * Process styles to convert native ShadowDOM rules that will trip
   * up the css parser; we rely on decorating the stylesheet with inert rules.
   *
   * For example, we convert this rule:
   *
   * polyfill-next-selector { content: ':host menu-item'; }
   * ::content menu-item {
   *
   * to this:
   *
   * scopeName menu-item {
   *
   **/
  _insertPolyfillDirectivesInCssText(cssText) {
    return cssText.replace(_cssContentNextSelectorRe, function(...m) {
      return m[2] + "{";
    });
  }
  /*
   * Process styles to add rules which will only apply under the polyfill
   *
   * For example, we convert this rule:
   *
   * polyfill-rule {
   *   content: ':host menu-item';
   * ...
   * }
   *
   * to this:
   *
   * scopeName menu-item {...}
   *
   **/
  _insertPolyfillRulesInCssText(cssText) {
    return cssText.replace(_cssContentRuleRe, (...m) => {
      const rule = m[0].replace(m[1], "").replace(m[2], "");
      return m[4] + rule;
    });
  }
  /* Ensure styles are scoped. Pseudo-scoping takes a rule like:
   *
   *  .foo {... }
   *
   *  and converts this to
   *
   *  scopeName .foo { ... }
   */
  _scopeCssText(cssText, scopeSelector, hostSelector) {
    const unscopedRules = this._extractUnscopedRulesFromCssText(cssText);
    cssText = this._insertPolyfillHostInCssText(cssText);
    cssText = this._convertColonHost(cssText);
    cssText = this._convertColonHostContext(cssText);
    cssText = this._convertShadowDOMSelectors(cssText);
    if (scopeSelector) {
      cssText = this._scopeKeyframesRelatedCss(cssText, scopeSelector);
      cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
    }
    cssText = cssText + "\n" + unscopedRules;
    return cssText.trim();
  }
  /*
   * Process styles to add rules which will only apply under the polyfill
   * and do not process via CSSOM. (CSSOM is destructive to rules on rare
   * occasions, e.g. -webkit-calc on Safari.)
   * For example, we convert this rule:
   *
   * @polyfill-unscoped-rule {
   *   content: 'menu-item';
   * ... }
   *
   * to this:
   *
   * menu-item {...}
   *
   **/
  _extractUnscopedRulesFromCssText(cssText) {
    let r = "";
    let m;
    _cssContentUnscopedRuleRe.lastIndex = 0;
    while ((m = _cssContentUnscopedRuleRe.exec(cssText)) !== null) {
      const rule = m[0].replace(m[2], "").replace(m[1], m[4]);
      r += rule + "\n\n";
    }
    return r;
  }
  /*
   * convert a rule like :host(.foo) > .bar { }
   *
   * to
   *
   * .foo<scopeName> > .bar
   */
  _convertColonHost(cssText) {
    return cssText.replace(_cssColonHostRe, (_, hostSelectors, otherSelectors) => {
      if (hostSelectors) {
        const convertedSelectors = [];
        const hostSelectorArray = hostSelectors.split(",").map((p) => p.trim());
        for (const hostSelector of hostSelectorArray) {
          if (!hostSelector)
            break;
          const convertedSelector = _polyfillHostNoCombinator + hostSelector.replace(_polyfillHost, "") + otherSelectors;
          convertedSelectors.push(convertedSelector);
        }
        return convertedSelectors.join(",");
      } else {
        return _polyfillHostNoCombinator + otherSelectors;
      }
    });
  }
  /*
   * convert a rule like :host-context(.foo) > .bar { }
   *
   * to
   *
   * .foo<scopeName> > .bar, .foo <scopeName> > .bar { }
   *
   * and
   *
   * :host-context(.foo:host) .bar { ... }
   *
   * to
   *
   * .foo<scopeName> .bar { ... }
   */
  _convertColonHostContext(cssText) {
    return cssText.replace(_cssColonHostContextReGlobal, (selectorText) => {
      const contextSelectorGroups = [[]];
      let match;
      while (match = _cssColonHostContextRe.exec(selectorText)) {
        const newContextSelectors = (match[1] ?? "").trim().split(",").map((m) => m.trim()).filter((m) => m !== "");
        const contextSelectorGroupsLength = contextSelectorGroups.length;
        repeatGroups(contextSelectorGroups, newContextSelectors.length);
        for (let i = 0; i < newContextSelectors.length; i++) {
          for (let j = 0; j < contextSelectorGroupsLength; j++) {
            contextSelectorGroups[j + i * contextSelectorGroupsLength].push(newContextSelectors[i]);
          }
        }
        selectorText = match[2];
      }
      return contextSelectorGroups.map((contextSelectors) => combineHostContextSelectors(contextSelectors, selectorText)).join(", ");
    });
  }
  /*
   * Convert combinators like ::shadow and pseudo-elements like ::content
   * by replacing with space.
   */
  _convertShadowDOMSelectors(cssText) {
    return _shadowDOMSelectorsRe.reduce((result, pattern) => result.replace(pattern, " "), cssText);
  }
  // change a selector like 'div' to 'name div'
  _scopeSelectors(cssText, scopeSelector, hostSelector) {
    return processRules(cssText, (rule) => {
      let selector = rule.selector;
      let content = rule.content;
      if (rule.selector[0] !== "@") {
        selector = this._scopeSelector(rule.selector, scopeSelector, hostSelector);
      } else if (rule.selector.startsWith("@media") || rule.selector.startsWith("@supports") || rule.selector.startsWith("@document") || rule.selector.startsWith("@layer") || rule.selector.startsWith("@container") || rule.selector.startsWith("@scope")) {
        content = this._scopeSelectors(rule.content, scopeSelector, hostSelector);
      } else if (rule.selector.startsWith("@font-face") || rule.selector.startsWith("@page")) {
        content = this._stripScopingSelectors(rule.content);
      }
      return new CssRule(selector, content);
    });
  }
  /**
   * Handle a css text that is within a rule that should not contain scope selectors by simply
   * removing them! An example of such a rule is `@font-face`.
   *
   * `@font-face` rules cannot contain nested selectors. Nor can they be nested under a selector.
   * Normally this would be a syntax error by the author of the styles. But in some rare cases, such
   * as importing styles from a library, and applying `:host ::ng-deep` to the imported styles, we
   * can end up with broken css if the imported styles happen to contain @font-face rules.
   *
   * For example:
   *
   * ```
   * :host ::ng-deep {
   *   import 'some/lib/containing/font-face';
   * }
   *
   * Similar logic applies to `@page` rules which can contain a particular set of properties,
   * as well as some specific at-rules. Since they can't be encapsulated, we have to strip
   * any scoping selectors from them. For more information: https://www.w3.org/TR/css-page-3
   * ```
   */
  _stripScopingSelectors(cssText) {
    return processRules(cssText, (rule) => {
      const selector = rule.selector.replace(_shadowDeepSelectors, " ").replace(_polyfillHostNoCombinatorRe, " ");
      return new CssRule(selector, rule.content);
    });
  }
  _scopeSelector(selector, scopeSelector, hostSelector) {
    return selector.split(",").map((part) => part.trim().split(_shadowDeepSelectors)).map((deepParts) => {
      const [shallowPart, ...otherParts] = deepParts;
      const applyScope = (shallowPart2) => {
        if (this._selectorNeedsScoping(shallowPart2, scopeSelector)) {
          return this._applySelectorScope(shallowPart2, scopeSelector, hostSelector);
        } else {
          return shallowPart2;
        }
      };
      return [applyScope(shallowPart), ...otherParts].join(" ");
    }).join(", ");
  }
  _selectorNeedsScoping(selector, scopeSelector) {
    const re = this._makeScopeMatcher(scopeSelector);
    return !re.test(selector);
  }
  _makeScopeMatcher(scopeSelector) {
    const lre = /\[/g;
    const rre = /\]/g;
    scopeSelector = scopeSelector.replace(lre, "\\[").replace(rre, "\\]");
    return new RegExp("^(" + scopeSelector + ")" + _selectorReSuffix, "m");
  }
  // scope via name and [is=name]
  _applySimpleSelectorScope(selector, scopeSelector, hostSelector) {
    _polyfillHostRe.lastIndex = 0;
    if (_polyfillHostRe.test(selector)) {
      const replaceBy = `[${hostSelector}]`;
      return selector.replace(_polyfillHostNoCombinatorRe, (hnc, selector2) => {
        return selector2.replace(/([^:]*)(:*)(.*)/, (_, before, colon, after) => {
          return before + replaceBy + colon + after;
        });
      }).replace(_polyfillHostRe, replaceBy + " ");
    }
    return scopeSelector + " " + selector;
  }
  // return a selector with [name] suffix on each simple selector
  // e.g. .foo.bar > .zot becomes .foo[name].bar[name] > .zot[name]  /** @internal */
  _applySelectorScope(selector, scopeSelector, hostSelector) {
    const isRe = /\[is=([^\]]*)\]/g;
    scopeSelector = scopeSelector.replace(isRe, (_, ...parts) => parts[0]);
    const attrName = "[" + scopeSelector + "]";
    const _scopeSelectorPart = (p) => {
      let scopedP = p.trim();
      if (!scopedP) {
        return "";
      }
      if (p.indexOf(_polyfillHostNoCombinator) > -1) {
        scopedP = this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
      } else {
        const t = p.replace(_polyfillHostRe, "");
        if (t.length > 0) {
          const matches = t.match(/([^:]*)(:*)(.*)/);
          if (matches) {
            scopedP = matches[1] + attrName + matches[2] + matches[3];
          }
        }
      }
      return scopedP;
    };
    const safeContent = new SafeSelector(selector);
    selector = safeContent.content();
    let scopedSelector = "";
    let startIndex = 0;
    let res;
    const sep = /( |>|\+|~(?!=))\s*/g;
    const hasHost = selector.indexOf(_polyfillHostNoCombinator) > -1;
    let shouldScope = !hasHost;
    while ((res = sep.exec(selector)) !== null) {
      const separator = res[1];
      const part2 = selector.slice(startIndex, res.index).trim();
      if (part2.match(_placeholderRe) && selector[res.index + 1]?.match(/[a-fA-F\d]/)) {
        continue;
      }
      shouldScope = shouldScope || part2.indexOf(_polyfillHostNoCombinator) > -1;
      const scopedPart = shouldScope ? _scopeSelectorPart(part2) : part2;
      scopedSelector += `${scopedPart} ${separator} `;
      startIndex = sep.lastIndex;
    }
    const part = selector.substring(startIndex);
    shouldScope = shouldScope || part.indexOf(_polyfillHostNoCombinator) > -1;
    scopedSelector += shouldScope ? _scopeSelectorPart(part) : part;
    return safeContent.restore(scopedSelector);
  }
  _insertPolyfillHostInCssText(selector) {
    return selector.replace(_colonHostContextRe, _polyfillHostContext).replace(_colonHostRe, _polyfillHost);
  }
};
var SafeSelector = class {
  constructor(selector) {
    this.placeholders = [];
    this.index = 0;
    selector = this._escapeRegexMatches(selector, /(\[[^\]]*\])/g);
    selector = this._escapeRegexMatches(selector, /(\\.)/g);
    this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, (_, pseudo, exp) => {
      const replaceBy = `__ph-${this.index}__`;
      this.placeholders.push(exp);
      this.index++;
      return pseudo + replaceBy;
    });
  }
  restore(content) {
    return content.replace(_placeholderRe, (_ph, index) => this.placeholders[+index]);
  }
  content() {
    return this._content;
  }
  /**
   * Replaces all of the substrings that match a regex within a
   * special string (e.g. `__ph-0__`, `__ph-1__`, etc).
   */
  _escapeRegexMatches(content, pattern) {
    return content.replace(pattern, (_, keep) => {
      const replaceBy = `__ph-${this.index}__`;
      this.placeholders.push(keep);
      this.index++;
      return replaceBy;
    });
  }
};
var _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim;
var _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var _polyfillHost = "-shadowcsshost";
var _polyfillHostContext = "-shadowcsscontext";
var _parenSuffix = "(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)";
var _cssColonHostRe = new RegExp(_polyfillHost + _parenSuffix, "gim");
var _cssColonHostContextReGlobal = new RegExp(_polyfillHostContext + _parenSuffix, "gim");
var _cssColonHostContextRe = new RegExp(_polyfillHostContext + _parenSuffix, "im");
var _polyfillHostNoCombinator = _polyfillHost + "-no-combinator";
var _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
var _shadowDOMSelectorsRe = [
  /::shadow/g,
  /::content/g,
  // Deprecated selectors
  /\/shadow-deep\//g,
  /\/shadow\//g
];
var _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)|(?:::ng-deep)/g;
var _selectorReSuffix = "([>\\s~+[.,{:][\\s\\S]*)?$";
var _polyfillHostRe = /-shadowcsshost/gim;
var _colonHostRe = /:host/gim;
var _colonHostContextRe = /:host-context/gim;
var _newLinesRe = /\r?\n/g;
var _commentRe = /\/\*[\s\S]*?\*\//g;
var _commentWithHashRe = /\/\*\s*#\s*source(Mapping)?URL=/g;
var COMMENT_PLACEHOLDER = "%COMMENT%";
var _commentWithHashPlaceHolderRe = new RegExp(COMMENT_PLACEHOLDER, "g");
var _placeholderRe = /__ph-(\d+)__/g;
var BLOCK_PLACEHOLDER = "%BLOCK%";
var _ruleRe = new RegExp(`(\\s*(?:${COMMENT_PLACEHOLDER}\\s*)*)([^;\\{\\}]+?)(\\s*)((?:{%BLOCK%}?\\s*;?)|(?:\\s*;))`, "g");
var CONTENT_PAIRS = /* @__PURE__ */ new Map([["{", "}"]]);
var COMMA_IN_PLACEHOLDER = "%COMMA_IN_PLACEHOLDER%";
var SEMI_IN_PLACEHOLDER = "%SEMI_IN_PLACEHOLDER%";
var COLON_IN_PLACEHOLDER = "%COLON_IN_PLACEHOLDER%";
var _cssCommaInPlaceholderReGlobal = new RegExp(COMMA_IN_PLACEHOLDER, "g");
var _cssSemiInPlaceholderReGlobal = new RegExp(SEMI_IN_PLACEHOLDER, "g");
var _cssColonInPlaceholderReGlobal = new RegExp(COLON_IN_PLACEHOLDER, "g");
var CssRule = class {
  constructor(selector, content) {
    this.selector = selector;
    this.content = content;
  }
};
function processRules(input, ruleCallback) {
  const escaped = escapeInStrings(input);
  const inputWithEscapedBlocks = escapeBlocks(escaped, CONTENT_PAIRS, BLOCK_PLACEHOLDER);
  let nextBlockIndex = 0;
  const escapedResult = inputWithEscapedBlocks.escapedString.replace(_ruleRe, (...m) => {
    const selector = m[2];
    let content = "";
    let suffix = m[4];
    let contentPrefix = "";
    if (suffix && suffix.startsWith("{" + BLOCK_PLACEHOLDER)) {
      content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
      suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
      contentPrefix = "{";
    }
    const rule = ruleCallback(new CssRule(selector, content));
    return `${m[1]}${rule.selector}${m[3]}${contentPrefix}${rule.content}${suffix}`;
  });
  return unescapeInStrings(escapedResult);
}
var StringWithEscapedBlocks = class {
  constructor(escapedString, blocks) {
    this.escapedString = escapedString;
    this.blocks = blocks;
  }
};
function escapeBlocks(input, charPairs, placeholder) {
  const resultParts = [];
  const escapedBlocks = [];
  let openCharCount = 0;
  let nonBlockStartIndex = 0;
  let blockStartIndex = -1;
  let openChar;
  let closeChar;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === "\\") {
      i++;
    } else if (char === closeChar) {
      openCharCount--;
      if (openCharCount === 0) {
        escapedBlocks.push(input.substring(blockStartIndex, i));
        resultParts.push(placeholder);
        nonBlockStartIndex = i;
        blockStartIndex = -1;
        openChar = closeChar = void 0;
      }
    } else if (char === openChar) {
      openCharCount++;
    } else if (openCharCount === 0 && charPairs.has(char)) {
      openChar = char;
      closeChar = charPairs.get(char);
      openCharCount = 1;
      blockStartIndex = i + 1;
      resultParts.push(input.substring(nonBlockStartIndex, blockStartIndex));
    }
  }
  if (blockStartIndex !== -1) {
    escapedBlocks.push(input.substring(blockStartIndex));
    resultParts.push(placeholder);
  } else {
    resultParts.push(input.substring(nonBlockStartIndex));
  }
  return new StringWithEscapedBlocks(resultParts.join(""), escapedBlocks);
}
var ESCAPE_IN_STRING_MAP = {
  ";": SEMI_IN_PLACEHOLDER,
  ",": COMMA_IN_PLACEHOLDER,
  ":": COLON_IN_PLACEHOLDER
};
function escapeInStrings(input) {
  let result = input;
  let currentQuoteChar = null;
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    if (char === "\\") {
      i++;
    } else {
      if (currentQuoteChar !== null) {
        if (char === currentQuoteChar) {
          currentQuoteChar = null;
        } else {
          const placeholder = ESCAPE_IN_STRING_MAP[char];
          if (placeholder) {
            result = `${result.substr(0, i)}${placeholder}${result.substr(i + 1)}`;
            i += placeholder.length - 1;
          }
        }
      } else if (char === "'" || char === '"') {
        currentQuoteChar = char;
      }
    }
  }
  return result;
}
function unescapeInStrings(input) {
  let result = input.replace(_cssCommaInPlaceholderReGlobal, ",");
  result = result.replace(_cssSemiInPlaceholderReGlobal, ";");
  result = result.replace(_cssColonInPlaceholderReGlobal, ":");
  return result;
}
function unescapeQuotes(str, isQuoted) {
  return !isQuoted ? str : str.replace(/((?:^|[^\\])(?:\\\\)*)\\(?=['"])/g, "$1");
}
function combineHostContextSelectors(contextSelectors, otherSelectors) {
  const hostMarker = _polyfillHostNoCombinator;
  _polyfillHostRe.lastIndex = 0;
  const otherSelectorsHasHost = _polyfillHostRe.test(otherSelectors);
  if (contextSelectors.length === 0) {
    return hostMarker + otherSelectors;
  }
  const combined = [contextSelectors.pop() || ""];
  while (contextSelectors.length > 0) {
    const length = combined.length;
    const contextSelector = contextSelectors.pop();
    for (let i = 0; i < length; i++) {
      const previousSelectors = combined[i];
      combined[length * 2 + i] = previousSelectors + " " + contextSelector;
      combined[length + i] = contextSelector + " " + previousSelectors;
      combined[i] = contextSelector + previousSelectors;
    }
  }
  return combined.map((s) => otherSelectorsHasHost ? `${s}${otherSelectors}` : `${s}${hostMarker}${otherSelectors}, ${s} ${hostMarker}${otherSelectors}`).join(",");
}
function repeatGroups(groups, multiples) {
  const length = groups.length;
  for (let i = 1; i < multiples; i++) {
    for (let j = 0; j < length; j++) {
      groups[j + i * length] = groups[j].slice(0);
    }
  }
}
var TagContentType;
(function(TagContentType2) {
  TagContentType2[TagContentType2["RAW_TEXT"] = 0] = "RAW_TEXT";
  TagContentType2[TagContentType2["ESCAPABLE_RAW_TEXT"] = 1] = "ESCAPABLE_RAW_TEXT";
  TagContentType2[TagContentType2["PARSABLE_DATA"] = 2] = "PARSABLE_DATA";
})(TagContentType || (TagContentType = {}));
function splitNsName(elementName) {
  if (elementName[0] != ":") {
    return [null, elementName];
  }
  const colonIndex = elementName.indexOf(":", 1);
  if (colonIndex === -1) {
    throw new Error(`Unsupported format "${elementName}" expecting ":namespace:name"`);
  }
  return [elementName.slice(1, colonIndex), elementName.slice(colonIndex + 1)];
}
function isNgContainer(tagName) {
  return splitNsName(tagName)[1] === "ng-container";
}
function isNgContent(tagName) {
  return splitNsName(tagName)[1] === "ng-content";
}
function isNgTemplate(tagName) {
  return splitNsName(tagName)[1] === "ng-template";
}
function getNsPrefix(fullName) {
  return fullName === null ? null : splitNsName(fullName)[0];
}
function mergeNsAndName(prefix, localName) {
  return prefix ? `:${prefix}:${localName}` : localName;
}
var BindingKind;
(function(BindingKind2) {
  BindingKind2[BindingKind2["Attribute"] = 0] = "Attribute";
  BindingKind2[BindingKind2["ClassName"] = 1] = "ClassName";
  BindingKind2[BindingKind2["StyleProperty"] = 2] = "StyleProperty";
  BindingKind2[BindingKind2["Property"] = 3] = "Property";
  BindingKind2[BindingKind2["Template"] = 4] = "Template";
  BindingKind2[BindingKind2["I18n"] = 5] = "I18n";
  BindingKind2[BindingKind2["Animation"] = 6] = "Animation";
})(BindingKind || (BindingKind = {}));
var FLYWEIGHT_ARRAY = Object.freeze([]);
var ElementAttributes = class {
  constructor() {
    this.known = /* @__PURE__ */ new Set();
    this.byKind = /* @__PURE__ */ new Map();
    this.projectAs = null;
  }
  get attributes() {
    return this.byKind.get(BindingKind.Attribute) ?? FLYWEIGHT_ARRAY;
  }
  get classes() {
    return this.byKind.get(BindingKind.ClassName) ?? FLYWEIGHT_ARRAY;
  }
  get styles() {
    return this.byKind.get(BindingKind.StyleProperty) ?? FLYWEIGHT_ARRAY;
  }
  get bindings() {
    return this.byKind.get(BindingKind.Property) ?? FLYWEIGHT_ARRAY;
  }
  get template() {
    return this.byKind.get(BindingKind.Template) ?? FLYWEIGHT_ARRAY;
  }
  get i18n() {
    return this.byKind.get(BindingKind.I18n) ?? FLYWEIGHT_ARRAY;
  }
  add(kind, name, value) {
    if (this.known.has(name)) {
      return;
    }
    this.known.add(name);
    const array = this.arrayFor(kind);
    array.push(...getAttributeNameLiterals$1(name));
    if (kind === BindingKind.Attribute || kind === BindingKind.StyleProperty) {
      if (value === null) {
        throw Error("Attribute & style element attributes must have a value");
      }
      array.push(value);
    }
  }
  arrayFor(kind) {
    if (!this.byKind.has(kind)) {
      this.byKind.set(kind, []);
    }
    return this.byKind.get(kind);
  }
};
function getAttributeNameLiterals$1(name) {
  const [attributeNamespace, attributeName] = splitNsName(name);
  const nameLiteral = literal(attributeName);
  if (attributeNamespace) {
    return [
      literal(
        0
        /* core.AttributeMarker.NamespaceURI */
      ),
      literal(attributeNamespace),
      nameLiteral
    ];
  }
  return [nameLiteral];
}
function assertIsElementAttributes(attrs) {
  if (!(attrs instanceof ElementAttributes)) {
    throw new Error(`AssertionError: ElementAttributes has already been coalesced into the view constants`);
  }
}
var OpKind;
(function(OpKind2) {
  OpKind2[OpKind2["ListEnd"] = 0] = "ListEnd";
  OpKind2[OpKind2["Statement"] = 1] = "Statement";
  OpKind2[OpKind2["Variable"] = 2] = "Variable";
  OpKind2[OpKind2["ElementStart"] = 3] = "ElementStart";
  OpKind2[OpKind2["Element"] = 4] = "Element";
  OpKind2[OpKind2["Template"] = 5] = "Template";
  OpKind2[OpKind2["ElementEnd"] = 6] = "ElementEnd";
  OpKind2[OpKind2["ContainerStart"] = 7] = "ContainerStart";
  OpKind2[OpKind2["Container"] = 8] = "Container";
  OpKind2[OpKind2["ContainerEnd"] = 9] = "ContainerEnd";
  OpKind2[OpKind2["DisableBindings"] = 10] = "DisableBindings";
  OpKind2[OpKind2["EnableBindings"] = 11] = "EnableBindings";
  OpKind2[OpKind2["Text"] = 12] = "Text";
  OpKind2[OpKind2["Listener"] = 13] = "Listener";
  OpKind2[OpKind2["InterpolateText"] = 14] = "InterpolateText";
  OpKind2[OpKind2["Binding"] = 15] = "Binding";
  OpKind2[OpKind2["Property"] = 16] = "Property";
  OpKind2[OpKind2["StyleProp"] = 17] = "StyleProp";
  OpKind2[OpKind2["ClassProp"] = 18] = "ClassProp";
  OpKind2[OpKind2["StyleMap"] = 19] = "StyleMap";
  OpKind2[OpKind2["ClassMap"] = 20] = "ClassMap";
  OpKind2[OpKind2["Advance"] = 21] = "Advance";
  OpKind2[OpKind2["Pipe"] = 22] = "Pipe";
  OpKind2[OpKind2["Attribute"] = 23] = "Attribute";
  OpKind2[OpKind2["HostProperty"] = 24] = "HostProperty";
  OpKind2[OpKind2["Namespace"] = 25] = "Namespace";
})(OpKind || (OpKind = {}));
var ExpressionKind;
(function(ExpressionKind2) {
  ExpressionKind2[ExpressionKind2["LexicalRead"] = 0] = "LexicalRead";
  ExpressionKind2[ExpressionKind2["Context"] = 1] = "Context";
  ExpressionKind2[ExpressionKind2["ReadVariable"] = 2] = "ReadVariable";
  ExpressionKind2[ExpressionKind2["NextContext"] = 3] = "NextContext";
  ExpressionKind2[ExpressionKind2["Reference"] = 4] = "Reference";
  ExpressionKind2[ExpressionKind2["GetCurrentView"] = 5] = "GetCurrentView";
  ExpressionKind2[ExpressionKind2["RestoreView"] = 6] = "RestoreView";
  ExpressionKind2[ExpressionKind2["ResetView"] = 7] = "ResetView";
  ExpressionKind2[ExpressionKind2["PureFunctionExpr"] = 8] = "PureFunctionExpr";
  ExpressionKind2[ExpressionKind2["PureFunctionParameterExpr"] = 9] = "PureFunctionParameterExpr";
  ExpressionKind2[ExpressionKind2["PipeBinding"] = 10] = "PipeBinding";
  ExpressionKind2[ExpressionKind2["PipeBindingVariadic"] = 11] = "PipeBindingVariadic";
  ExpressionKind2[ExpressionKind2["SafePropertyRead"] = 12] = "SafePropertyRead";
  ExpressionKind2[ExpressionKind2["SafeKeyedRead"] = 13] = "SafeKeyedRead";
  ExpressionKind2[ExpressionKind2["SafeInvokeFunction"] = 14] = "SafeInvokeFunction";
  ExpressionKind2[ExpressionKind2["SafeTernaryExpr"] = 15] = "SafeTernaryExpr";
  ExpressionKind2[ExpressionKind2["EmptyExpr"] = 16] = "EmptyExpr";
  ExpressionKind2[ExpressionKind2["AssignTemporaryExpr"] = 17] = "AssignTemporaryExpr";
  ExpressionKind2[ExpressionKind2["ReadTemporaryExpr"] = 18] = "ReadTemporaryExpr";
  ExpressionKind2[ExpressionKind2["SanitizerExpr"] = 19] = "SanitizerExpr";
})(ExpressionKind || (ExpressionKind = {}));
var SemanticVariableKind;
(function(SemanticVariableKind2) {
  SemanticVariableKind2[SemanticVariableKind2["Context"] = 0] = "Context";
  SemanticVariableKind2[SemanticVariableKind2["Identifier"] = 1] = "Identifier";
  SemanticVariableKind2[SemanticVariableKind2["SavedView"] = 2] = "SavedView";
})(SemanticVariableKind || (SemanticVariableKind = {}));
var CompatibilityMode;
(function(CompatibilityMode2) {
  CompatibilityMode2[CompatibilityMode2["Normal"] = 0] = "Normal";
  CompatibilityMode2[CompatibilityMode2["TemplateDefinitionBuilder"] = 1] = "TemplateDefinitionBuilder";
})(CompatibilityMode || (CompatibilityMode = {}));
var SanitizerFn;
(function(SanitizerFn2) {
  SanitizerFn2[SanitizerFn2["Html"] = 0] = "Html";
  SanitizerFn2[SanitizerFn2["Script"] = 1] = "Script";
  SanitizerFn2[SanitizerFn2["Style"] = 2] = "Style";
  SanitizerFn2[SanitizerFn2["Url"] = 3] = "Url";
  SanitizerFn2[SanitizerFn2["ResourceUrl"] = 4] = "ResourceUrl";
  SanitizerFn2[SanitizerFn2["IframeAttribute"] = 5] = "IframeAttribute";
})(SanitizerFn || (SanitizerFn = {}));
var ConsumesSlot = Symbol("ConsumesSlot");
var DependsOnSlotContext = Symbol("DependsOnSlotContext");
var UsesSlotIndex = Symbol("UsesSlotIndex");
var ConsumesVarsTrait = Symbol("ConsumesVars");
var UsesVarOffset = Symbol("UsesVarOffset");
var TRAIT_CONSUMES_SLOT = {
  [ConsumesSlot]: true,
  slot: null,
  numSlotsUsed: 1
};
var TRAIT_USES_SLOT_INDEX = {
  [UsesSlotIndex]: true,
  slot: null
};
var TRAIT_DEPENDS_ON_SLOT_CONTEXT = {
  [DependsOnSlotContext]: true
};
var TRAIT_CONSUMES_VARS = {
  [ConsumesVarsTrait]: true
};
var TRAIT_USES_VAR_OFFSET = {
  [UsesVarOffset]: true,
  varOffset: null
};
function hasConsumesSlotTrait(op) {
  return op[ConsumesSlot] === true;
}
function hasDependsOnSlotContextTrait(op) {
  return op[DependsOnSlotContext] === true;
}
function hasConsumesVarsTrait(value) {
  return value[ConsumesVarsTrait] === true;
}
function hasUsesVarOffsetTrait(expr) {
  return expr[UsesVarOffset] === true;
}
function hasUsesSlotIndexTrait(value) {
  return value[UsesSlotIndex] === true;
}
function createStatementOp(statement) {
  return __spreadValues({
    kind: OpKind.Statement,
    statement
  }, NEW_OP);
}
function createVariableOp(xref, variable2, initializer) {
  return __spreadValues({
    kind: OpKind.Variable,
    xref,
    variable: variable2,
    initializer
  }, NEW_OP);
}
var NEW_OP = {
  debugListId: null,
  prev: null,
  next: null
};
function createInterpolateTextOp(xref, interpolation, sourceSpan) {
  return __spreadValues(__spreadValues(__spreadValues({
    kind: OpKind.InterpolateText,
    target: xref,
    interpolation,
    sourceSpan
  }, TRAIT_DEPENDS_ON_SLOT_CONTEXT), TRAIT_CONSUMES_VARS), NEW_OP);
}
var Interpolation = class {
  constructor(strings, expressions) {
    this.strings = strings;
    this.expressions = expressions;
  }
};
function createBindingOp(target, kind, name, expression, unit, securityContext, isTemplate, sourceSpan) {
  return __spreadValues({
    kind: OpKind.Binding,
    bindingKind: kind,
    target,
    name,
    expression,
    unit,
    securityContext,
    isTemplate,
    sourceSpan
  }, NEW_OP);
}
function createPropertyOp(target, name, expression, isAnimationTrigger, securityContext, isTemplate, sourceSpan) {
  return __spreadValues(__spreadValues(__spreadValues({
    kind: OpKind.Property,
    target,
    name,
    expression,
    isAnimationTrigger,
    securityContext,
    sanitizer: null,
    isTemplate,
    sourceSpan
  }, TRAIT_DEPENDS_ON_SLOT_CONTEXT), TRAIT_CONSUMES_VARS), NEW_OP);
}
function createStylePropOp(xref, name, expression, unit, sourceSpan) {
  return __spreadValues(__spreadValues(__spreadValues({
    kind: OpKind.StyleProp,
    target: xref,
    name,
    expression,
    unit,
    sourceSpan
  }, TRAIT_DEPENDS_ON_SLOT_CONTEXT), TRAIT_CONSUMES_VARS), NEW_OP);
}
function createClassPropOp(xref, name, expression, sourceSpan) {
  return __spreadValues(__spreadValues(__spreadValues({
    kind: OpKind.ClassProp,
    target: xref,
    name,
    expression,
    sourceSpan
  }, TRAIT_DEPENDS_ON_SLOT_CONTEXT), TRAIT_CONSUMES_VARS), NEW_OP);
}
function createStyleMapOp(xref, expression, sourceSpan) {
  return __spreadValues(__spreadValues(__spreadValues({
    kind: OpKind.StyleMap,
    target: xref,
    expression,
    sourceSpan
  }, TRAIT_DEPENDS_ON_SLOT_CONTEXT), TRAIT_CONSUMES_VARS), NEW_OP);
}
function createClassMapOp(xref, expression, sourceSpan) {
  return __spreadValues(__spreadValues(__spreadValues({
    kind: OpKind.ClassMap,
    target: xref,
    expression,
    sourceSpan
  }, TRAIT_DEPENDS_ON_SLOT_CONTEXT), TRAIT_CONSUMES_VARS), NEW_OP);
}
function createAttributeOp(target, name, expression, securityContext, isTemplate, sourceSpan) {
  return __spreadValues(__spreadValues(__spreadValues({
    kind: OpKind.Attribute,
    target,
    name,
    expression,
    securityContext,
    sanitizer: null,
    isTemplate,
    sourceSpan
  }, TRAIT_DEPENDS_ON_SLOT_CONTEXT), TRAIT_CONSUMES_VARS), NEW_OP);
}
function createAdvanceOp(delta, sourceSpan) {
  return __spreadValues({
    kind: OpKind.Advance,
    delta,
    sourceSpan
  }, NEW_OP);
}
var _a;
var _b;
var _c;
var _d;
var _e;
var _f;
var _g;
var _h;
var _j;
function isIrExpression(expr) {
  return expr instanceof ExpressionBase;
}
var ExpressionBase = class extends Expression {
  constructor(sourceSpan = null) {
    super(null, sourceSpan);
  }
};
var LexicalReadExpr = class _LexicalReadExpr extends ExpressionBase {
  constructor(name) {
    super();
    this.name = name;
    this.kind = ExpressionKind.LexicalRead;
  }
  visitExpression(visitor, context) {
  }
  isEquivalent() {
    return false;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions() {
  }
  clone() {
    return new _LexicalReadExpr(this.name);
  }
};
var _ReferenceExpr = class _ReferenceExpr extends ExpressionBase {
  constructor(target, offset) {
    super();
    this.target = target;
    this.offset = offset;
    this.kind = ExpressionKind.Reference;
    this[_a] = true;
    this.slot = null;
  }
  visitExpression() {
  }
  isEquivalent(e) {
    return e instanceof _ReferenceExpr && e.target === this.target;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions() {
  }
  clone() {
    const expr = new _ReferenceExpr(this.target, this.offset);
    expr.slot = this.slot;
    return expr;
  }
};
_a = UsesSlotIndex;
var ReferenceExpr = _ReferenceExpr;
var ContextExpr = class _ContextExpr extends ExpressionBase {
  constructor(view) {
    super();
    this.view = view;
    this.kind = ExpressionKind.Context;
  }
  visitExpression() {
  }
  isEquivalent(e) {
    return e instanceof _ContextExpr && e.view === this.view;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions() {
  }
  clone() {
    return new _ContextExpr(this.view);
  }
};
var NextContextExpr = class _NextContextExpr extends ExpressionBase {
  constructor() {
    super();
    this.kind = ExpressionKind.NextContext;
    this.steps = 1;
  }
  visitExpression() {
  }
  isEquivalent(e) {
    return e instanceof _NextContextExpr && e.steps === this.steps;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions() {
  }
  clone() {
    const expr = new _NextContextExpr();
    expr.steps = this.steps;
    return expr;
  }
};
var GetCurrentViewExpr = class _GetCurrentViewExpr extends ExpressionBase {
  constructor() {
    super();
    this.kind = ExpressionKind.GetCurrentView;
  }
  visitExpression() {
  }
  isEquivalent(e) {
    return e instanceof _GetCurrentViewExpr;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions() {
  }
  clone() {
    return new _GetCurrentViewExpr();
  }
};
var RestoreViewExpr = class _RestoreViewExpr extends ExpressionBase {
  constructor(view) {
    super();
    this.view = view;
    this.kind = ExpressionKind.RestoreView;
  }
  visitExpression(visitor, context) {
    if (typeof this.view !== "number") {
      this.view.visitExpression(visitor, context);
    }
  }
  isEquivalent(e) {
    if (!(e instanceof _RestoreViewExpr) || typeof e.view !== typeof this.view) {
      return false;
    }
    if (typeof this.view === "number") {
      return this.view === e.view;
    } else {
      return this.view.isEquivalent(e.view);
    }
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    if (typeof this.view !== "number") {
      this.view = transformExpressionsInExpression(this.view, transform, flags);
    }
  }
  clone() {
    return new _RestoreViewExpr(this.view instanceof Expression ? this.view.clone() : this.view);
  }
};
var ResetViewExpr = class _ResetViewExpr extends ExpressionBase {
  constructor(expr) {
    super();
    this.expr = expr;
    this.kind = ExpressionKind.ResetView;
  }
  visitExpression(visitor, context) {
    this.expr.visitExpression(visitor, context);
  }
  isEquivalent(e) {
    return e instanceof _ResetViewExpr && this.expr.isEquivalent(e.expr);
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    this.expr = transformExpressionsInExpression(this.expr, transform, flags);
  }
  clone() {
    return new _ResetViewExpr(this.expr.clone());
  }
};
var ReadVariableExpr = class _ReadVariableExpr extends ExpressionBase {
  constructor(xref) {
    super();
    this.xref = xref;
    this.kind = ExpressionKind.ReadVariable;
    this.name = null;
  }
  visitExpression() {
  }
  isEquivalent(other) {
    return other instanceof _ReadVariableExpr && other.xref === this.xref;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions() {
  }
  clone() {
    const expr = new _ReadVariableExpr(this.xref);
    expr.name = this.name;
    return expr;
  }
};
var _PureFunctionExpr = class _PureFunctionExpr extends ExpressionBase {
  constructor(expression, args) {
    super();
    this.kind = ExpressionKind.PureFunctionExpr;
    this[_b] = true;
    this[_c] = true;
    this.varOffset = null;
    this.fn = null;
    this.body = expression;
    this.args = args;
  }
  visitExpression(visitor, context) {
    this.body?.visitExpression(visitor, context);
    for (const arg of this.args) {
      arg.visitExpression(visitor, context);
    }
  }
  isEquivalent(other) {
    if (!(other instanceof _PureFunctionExpr) || other.args.length !== this.args.length) {
      return false;
    }
    return other.body !== null && this.body !== null && other.body.isEquivalent(this.body) && other.args.every((arg, idx) => arg.isEquivalent(this.args[idx]));
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    if (this.body !== null) {
      this.body = transformExpressionsInExpression(this.body, transform, flags | VisitorContextFlag.InChildOperation);
    } else if (this.fn !== null) {
      this.fn = transformExpressionsInExpression(this.fn, transform, flags);
    }
    for (let i = 0; i < this.args.length; i++) {
      this.args[i] = transformExpressionsInExpression(this.args[i], transform, flags);
    }
  }
  clone() {
    const expr = new _PureFunctionExpr(this.body?.clone() ?? null, this.args.map((arg) => arg.clone()));
    expr.fn = this.fn?.clone() ?? null;
    expr.varOffset = this.varOffset;
    return expr;
  }
};
_b = ConsumesVarsTrait, _c = UsesVarOffset;
var PureFunctionExpr = _PureFunctionExpr;
var PureFunctionParameterExpr = class _PureFunctionParameterExpr extends ExpressionBase {
  constructor(index) {
    super();
    this.index = index;
    this.kind = ExpressionKind.PureFunctionParameterExpr;
  }
  visitExpression() {
  }
  isEquivalent(other) {
    return other instanceof _PureFunctionParameterExpr && other.index === this.index;
  }
  isConstant() {
    return true;
  }
  transformInternalExpressions() {
  }
  clone() {
    return new _PureFunctionParameterExpr(this.index);
  }
};
var _PipeBindingExpr = class _PipeBindingExpr extends ExpressionBase {
  constructor(target, name, args) {
    super();
    this.target = target;
    this.name = name;
    this.args = args;
    this.kind = ExpressionKind.PipeBinding;
    this[_d] = true;
    this[_e] = true;
    this[_f] = true;
    this.slot = null;
    this.varOffset = null;
  }
  visitExpression(visitor, context) {
    for (const arg of this.args) {
      arg.visitExpression(visitor, context);
    }
  }
  isEquivalent() {
    return false;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    for (let idx = 0; idx < this.args.length; idx++) {
      this.args[idx] = transformExpressionsInExpression(this.args[idx], transform, flags);
    }
  }
  clone() {
    const r = new _PipeBindingExpr(this.target, this.name, this.args.map((a) => a.clone()));
    r.slot = this.slot;
    r.varOffset = this.varOffset;
    return r;
  }
};
_d = UsesSlotIndex, _e = ConsumesVarsTrait, _f = UsesVarOffset;
var PipeBindingExpr = _PipeBindingExpr;
var _PipeBindingVariadicExpr = class _PipeBindingVariadicExpr extends ExpressionBase {
  constructor(target, name, args, numArgs) {
    super();
    this.target = target;
    this.name = name;
    this.args = args;
    this.numArgs = numArgs;
    this.kind = ExpressionKind.PipeBindingVariadic;
    this[_g] = true;
    this[_h] = true;
    this[_j] = true;
    this.slot = null;
    this.varOffset = null;
  }
  visitExpression(visitor, context) {
    this.args.visitExpression(visitor, context);
  }
  isEquivalent() {
    return false;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    this.args = transformExpressionsInExpression(this.args, transform, flags);
  }
  clone() {
    const r = new _PipeBindingVariadicExpr(this.target, this.name, this.args.clone(), this.numArgs);
    r.slot = this.slot;
    r.varOffset = this.varOffset;
    return r;
  }
};
_g = UsesSlotIndex, _h = ConsumesVarsTrait, _j = UsesVarOffset;
var PipeBindingVariadicExpr = _PipeBindingVariadicExpr;
var SafePropertyReadExpr = class _SafePropertyReadExpr extends ExpressionBase {
  constructor(receiver, name) {
    super();
    this.receiver = receiver;
    this.name = name;
    this.kind = ExpressionKind.SafePropertyRead;
  }
  // An alias for name, which allows other logic to handle property reads and keyed reads together.
  get index() {
    return this.name;
  }
  visitExpression(visitor, context) {
    this.receiver.visitExpression(visitor, context);
  }
  isEquivalent() {
    return false;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    this.receiver = transformExpressionsInExpression(this.receiver, transform, flags);
  }
  clone() {
    return new _SafePropertyReadExpr(this.receiver.clone(), this.name);
  }
};
var SafeKeyedReadExpr = class _SafeKeyedReadExpr extends ExpressionBase {
  constructor(receiver, index) {
    super();
    this.receiver = receiver;
    this.index = index;
    this.kind = ExpressionKind.SafeKeyedRead;
  }
  visitExpression(visitor, context) {
    this.receiver.visitExpression(visitor, context);
    this.index.visitExpression(visitor, context);
  }
  isEquivalent() {
    return false;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    this.receiver = transformExpressionsInExpression(this.receiver, transform, flags);
    this.index = transformExpressionsInExpression(this.index, transform, flags);
  }
  clone() {
    return new _SafeKeyedReadExpr(this.receiver.clone(), this.index.clone());
  }
};
var SafeInvokeFunctionExpr = class _SafeInvokeFunctionExpr extends ExpressionBase {
  constructor(receiver, args) {
    super();
    this.receiver = receiver;
    this.args = args;
    this.kind = ExpressionKind.SafeInvokeFunction;
  }
  visitExpression(visitor, context) {
    this.receiver.visitExpression(visitor, context);
    for (const a of this.args) {
      a.visitExpression(visitor, context);
    }
  }
  isEquivalent() {
    return false;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    this.receiver = transformExpressionsInExpression(this.receiver, transform, flags);
    for (let i = 0; i < this.args.length; i++) {
      this.args[i] = transformExpressionsInExpression(this.args[i], transform, flags);
    }
  }
  clone() {
    return new _SafeInvokeFunctionExpr(this.receiver.clone(), this.args.map((a) => a.clone()));
  }
};
var SafeTernaryExpr = class _SafeTernaryExpr extends ExpressionBase {
  constructor(guard, expr) {
    super();
    this.guard = guard;
    this.expr = expr;
    this.kind = ExpressionKind.SafeTernaryExpr;
  }
  visitExpression(visitor, context) {
    this.guard.visitExpression(visitor, context);
    this.expr.visitExpression(visitor, context);
  }
  isEquivalent() {
    return false;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    this.guard = transformExpressionsInExpression(this.guard, transform, flags);
    this.expr = transformExpressionsInExpression(this.expr, transform, flags);
  }
  clone() {
    return new _SafeTernaryExpr(this.guard.clone(), this.expr.clone());
  }
};
var EmptyExpr = class _EmptyExpr extends ExpressionBase {
  constructor() {
    super(...arguments);
    this.kind = ExpressionKind.EmptyExpr;
  }
  visitExpression(visitor, context) {
  }
  isEquivalent(e) {
    return e instanceof _EmptyExpr;
  }
  isConstant() {
    return true;
  }
  clone() {
    return new _EmptyExpr();
  }
  transformInternalExpressions() {
  }
};
var AssignTemporaryExpr = class _AssignTemporaryExpr extends ExpressionBase {
  constructor(expr, xref) {
    super();
    this.expr = expr;
    this.xref = xref;
    this.kind = ExpressionKind.AssignTemporaryExpr;
    this.name = null;
  }
  visitExpression(visitor, context) {
    this.expr.visitExpression(visitor, context);
  }
  isEquivalent() {
    return false;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
    this.expr = transformExpressionsInExpression(this.expr, transform, flags);
  }
  clone() {
    const a = new _AssignTemporaryExpr(this.expr.clone(), this.xref);
    a.name = this.name;
    return a;
  }
};
var ReadTemporaryExpr = class _ReadTemporaryExpr extends ExpressionBase {
  constructor(xref) {
    super();
    this.xref = xref;
    this.kind = ExpressionKind.ReadTemporaryExpr;
    this.name = null;
  }
  visitExpression(visitor, context) {
  }
  isEquivalent() {
    return this.xref === this.xref;
  }
  isConstant() {
    return false;
  }
  transformInternalExpressions(transform, flags) {
  }
  clone() {
    const r = new _ReadTemporaryExpr(this.xref);
    r.name = this.name;
    return r;
  }
};
var SanitizerExpr = class _SanitizerExpr extends ExpressionBase {
  constructor(fn2) {
    super();
    this.fn = fn2;
    this.kind = ExpressionKind.SanitizerExpr;
  }
  visitExpression(visitor, context) {
  }
  isEquivalent(e) {
    return e instanceof _SanitizerExpr && e.fn === this.fn;
  }
  isConstant() {
    return true;
  }
  clone() {
    return new _SanitizerExpr(this.fn);
  }
  transformInternalExpressions() {
  }
};
function visitExpressionsInOp(op, visitor) {
  transformExpressionsInOp(op, (expr, flags) => {
    visitor(expr, flags);
    return expr;
  }, VisitorContextFlag.None);
}
var VisitorContextFlag;
(function(VisitorContextFlag2) {
  VisitorContextFlag2[VisitorContextFlag2["None"] = 0] = "None";
  VisitorContextFlag2[VisitorContextFlag2["InChildOperation"] = 1] = "InChildOperation";
})(VisitorContextFlag || (VisitorContextFlag = {}));
function transformExpressionsInInterpolation(interpolation, transform, flags) {
  for (let i = 0; i < interpolation.expressions.length; i++) {
    interpolation.expressions[i] = transformExpressionsInExpression(interpolation.expressions[i], transform, flags);
  }
}
function transformExpressionsInOp(op, transform, flags) {
  switch (op.kind) {
    case OpKind.StyleProp:
    case OpKind.StyleMap:
    case OpKind.ClassProp:
    case OpKind.ClassMap:
    case OpKind.Binding:
    case OpKind.HostProperty:
      if (op.expression instanceof Interpolation) {
        transformExpressionsInInterpolation(op.expression, transform, flags);
      } else {
        op.expression = transformExpressionsInExpression(op.expression, transform, flags);
      }
      break;
    case OpKind.Property:
    case OpKind.Attribute:
      if (op.expression instanceof Interpolation) {
        transformExpressionsInInterpolation(op.expression, transform, flags);
      } else {
        op.expression = transformExpressionsInExpression(op.expression, transform, flags);
      }
      op.sanitizer = op.sanitizer && transformExpressionsInExpression(op.sanitizer, transform, flags);
      break;
    case OpKind.InterpolateText:
      transformExpressionsInInterpolation(op.interpolation, transform, flags);
      break;
    case OpKind.Statement:
      transformExpressionsInStatement(op.statement, transform, flags);
      break;
    case OpKind.Variable:
      op.initializer = transformExpressionsInExpression(op.initializer, transform, flags);
      break;
    case OpKind.Listener:
      for (const innerOp of op.handlerOps) {
        transformExpressionsInOp(innerOp, transform, flags | VisitorContextFlag.InChildOperation);
      }
      break;
    case OpKind.Element:
    case OpKind.ElementStart:
    case OpKind.ElementEnd:
    case OpKind.Container:
    case OpKind.ContainerStart:
    case OpKind.ContainerEnd:
    case OpKind.Template:
    case OpKind.DisableBindings:
    case OpKind.EnableBindings:
    case OpKind.Text:
    case OpKind.Pipe:
    case OpKind.Advance:
    case OpKind.Namespace:
      break;
    default:
      throw new Error(`AssertionError: transformExpressionsInOp doesn't handle ${OpKind[op.kind]}`);
  }
}
function transformExpressionsInExpression(expr, transform, flags) {
  if (expr instanceof ExpressionBase) {
    expr.transformInternalExpressions(transform, flags);
  } else if (expr instanceof BinaryOperatorExpr) {
    expr.lhs = transformExpressionsInExpression(expr.lhs, transform, flags);
    expr.rhs = transformExpressionsInExpression(expr.rhs, transform, flags);
  } else if (expr instanceof ReadPropExpr) {
    expr.receiver = transformExpressionsInExpression(expr.receiver, transform, flags);
  } else if (expr instanceof ReadKeyExpr) {
    expr.receiver = transformExpressionsInExpression(expr.receiver, transform, flags);
    expr.index = transformExpressionsInExpression(expr.index, transform, flags);
  } else if (expr instanceof WritePropExpr) {
    expr.receiver = transformExpressionsInExpression(expr.receiver, transform, flags);
    expr.value = transformExpressionsInExpression(expr.value, transform, flags);
  } else if (expr instanceof WriteKeyExpr) {
    expr.receiver = transformExpressionsInExpression(expr.receiver, transform, flags);
    expr.index = transformExpressionsInExpression(expr.index, transform, flags);
    expr.value = transformExpressionsInExpression(expr.value, transform, flags);
  } else if (expr instanceof InvokeFunctionExpr) {
    expr.fn = transformExpressionsInExpression(expr.fn, transform, flags);
    for (let i = 0; i < expr.args.length; i++) {
      expr.args[i] = transformExpressionsInExpression(expr.args[i], transform, flags);
    }
  } else if (expr instanceof LiteralArrayExpr) {
    for (let i = 0; i < expr.entries.length; i++) {
      expr.entries[i] = transformExpressionsInExpression(expr.entries[i], transform, flags);
    }
  } else if (expr instanceof LiteralMapExpr) {
    for (let i = 0; i < expr.entries.length; i++) {
      expr.entries[i].value = transformExpressionsInExpression(expr.entries[i].value, transform, flags);
    }
  } else if (expr instanceof ConditionalExpr) {
    expr.condition = transformExpressionsInExpression(expr.condition, transform, flags);
    expr.trueCase = transformExpressionsInExpression(expr.trueCase, transform, flags);
    if (expr.falseCase !== null) {
      expr.falseCase = transformExpressionsInExpression(expr.falseCase, transform, flags);
    }
  } else if (expr instanceof ReadVarExpr || expr instanceof ExternalExpr || expr instanceof LiteralExpr) {
  } else {
    throw new Error(`Unhandled expression kind: ${expr.constructor.name}`);
  }
  return transform(expr, flags);
}
function transformExpressionsInStatement(stmt, transform, flags) {
  if (stmt instanceof ExpressionStatement) {
    stmt.expr = transformExpressionsInExpression(stmt.expr, transform, flags);
  } else if (stmt instanceof ReturnStatement) {
    stmt.value = transformExpressionsInExpression(stmt.value, transform, flags);
  } else if (stmt instanceof DeclareVarStmt) {
    if (stmt.value !== void 0) {
      stmt.value = transformExpressionsInExpression(stmt.value, transform, flags);
    }
  } else {
    throw new Error(`Unhandled statement kind: ${stmt.constructor.name}`);
  }
}
var _OpList = class _OpList {
  constructor() {
    this.debugListId = _OpList.nextListId++;
    this.head = {
      kind: OpKind.ListEnd,
      next: null,
      prev: null,
      debugListId: this.debugListId
    };
    this.tail = {
      kind: OpKind.ListEnd,
      next: null,
      prev: null,
      debugListId: this.debugListId
    };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  /**
   * Push a new operation to the tail of the list.
   */
  push(op) {
    _OpList.assertIsNotEnd(op);
    _OpList.assertIsUnowned(op);
    op.debugListId = this.debugListId;
    const oldLast = this.tail.prev;
    op.prev = oldLast;
    oldLast.next = op;
    op.next = this.tail;
    this.tail.prev = op;
  }
  /**
   * Prepend one or more nodes to the start of the list.
   */
  prepend(ops) {
    if (ops.length === 0) {
      return;
    }
    for (const op of ops) {
      _OpList.assertIsNotEnd(op);
      _OpList.assertIsUnowned(op);
      op.debugListId = this.debugListId;
    }
    const first = this.head.next;
    let prev = this.head;
    for (const op of ops) {
      prev.next = op;
      op.prev = prev;
      prev = op;
    }
    prev.next = first;
    first.prev = prev;
  }
  /**
   * `OpList` is iterable via the iteration protocol.
   *
   * It's safe to mutate the part of the list that has already been returned by the iterator, up to
   * and including the last operation returned. Mutations beyond that point _may_ be safe, but may
   * also corrupt the iteration position and should be avoided.
   */
  *[Symbol.iterator]() {
    let current = this.head.next;
    while (current !== this.tail) {
      _OpList.assertIsOwned(current, this.debugListId);
      const next = current.next;
      yield current;
      current = next;
    }
  }
  *reversed() {
    let current = this.tail.prev;
    while (current !== this.head) {
      _OpList.assertIsOwned(current, this.debugListId);
      const prev = current.prev;
      yield current;
      current = prev;
    }
  }
  /**
   * Replace `oldOp` with `newOp` in the list.
   */
  static replace(oldOp, newOp) {
    _OpList.assertIsNotEnd(oldOp);
    _OpList.assertIsNotEnd(newOp);
    _OpList.assertIsOwned(oldOp);
    _OpList.assertIsUnowned(newOp);
    newOp.debugListId = oldOp.debugListId;
    if (oldOp.prev !== null) {
      oldOp.prev.next = newOp;
      newOp.prev = oldOp.prev;
    }
    if (oldOp.next !== null) {
      oldOp.next.prev = newOp;
      newOp.next = oldOp.next;
    }
    oldOp.debugListId = null;
    oldOp.prev = null;
    oldOp.next = null;
  }
  /**
   * Replace `oldOp` with some number of new operations in the list (which may include `oldOp`).
   */
  static replaceWithMany(oldOp, newOps) {
    if (newOps.length === 0) {
      _OpList.remove(oldOp);
      return;
    }
    _OpList.assertIsNotEnd(oldOp);
    _OpList.assertIsOwned(oldOp);
    const listId = oldOp.debugListId;
    oldOp.debugListId = null;
    for (const newOp of newOps) {
      _OpList.assertIsNotEnd(newOp);
      _OpList.assertIsUnowned(newOp);
    }
    const { prev: oldPrev, next: oldNext } = oldOp;
    oldOp.prev = null;
    oldOp.next = null;
    let prev = oldPrev;
    for (const newOp of newOps) {
      this.assertIsUnowned(newOp);
      newOp.debugListId = listId;
      prev.next = newOp;
      newOp.prev = prev;
      newOp.next = null;
      prev = newOp;
    }
    const first = newOps[0];
    const last = prev;
    if (oldPrev !== null) {
      oldPrev.next = first;
      first.prev = oldOp.prev;
    }
    if (oldNext !== null) {
      oldNext.prev = last;
      last.next = oldNext;
    }
  }
  /**
   * Remove the given node from the list which contains it.
   */
  static remove(op) {
    _OpList.assertIsNotEnd(op);
    _OpList.assertIsOwned(op);
    op.prev.next = op.next;
    op.next.prev = op.prev;
    op.debugListId = null;
    op.prev = null;
    op.next = null;
  }
  /**
   * Insert `op` before `target`.
   */
  static insertBefore(op, target) {
    _OpList.assertIsOwned(target);
    if (target.prev === null) {
      throw new Error(`AssertionError: illegal operation on list start`);
    }
    _OpList.assertIsNotEnd(op);
    _OpList.assertIsUnowned(op);
    op.debugListId = target.debugListId;
    op.prev = null;
    target.prev.next = op;
    op.prev = target.prev;
    op.next = target;
    target.prev = op;
  }
  /**
   * Insert `op` after `target`.
   */
  static insertAfter(op, target) {
    _OpList.assertIsOwned(target);
    if (target.next === null) {
      throw new Error(`AssertionError: illegal operation on list end`);
    }
    _OpList.assertIsNotEnd(op);
    _OpList.assertIsUnowned(op);
    op.debugListId = target.debugListId;
    target.next.prev = op;
    op.next = target.next;
    op.prev = target;
    target.next = op;
  }
  /**
   * Asserts that `op` does not currently belong to a list.
   */
  static assertIsUnowned(op) {
    if (op.debugListId !== null) {
      throw new Error(`AssertionError: illegal operation on owned node: ${OpKind[op.kind]}`);
    }
  }
  /**
   * Asserts that `op` currently belongs to a list. If `byList` is passed, `op` is asserted to
   * specifically belong to that list.
   */
  static assertIsOwned(op, byList) {
    if (op.debugListId === null) {
      throw new Error(`AssertionError: illegal operation on unowned node: ${OpKind[op.kind]}`);
    } else if (byList !== void 0 && op.debugListId !== byList) {
      throw new Error(`AssertionError: node belongs to the wrong list (expected ${byList}, actual ${op.debugListId})`);
    }
  }
  /**
   * Asserts that `op` is not a special `ListEnd` node.
   */
  static assertIsNotEnd(op) {
    if (op.kind === OpKind.ListEnd) {
      throw new Error(`AssertionError: illegal operation on list head or tail`);
    }
  }
};
_OpList.nextListId = 0;
var OpList = _OpList;
var elementContainerOpKinds = /* @__PURE__ */ new Set([
  OpKind.Element,
  OpKind.ElementStart,
  OpKind.Container,
  OpKind.ContainerStart,
  OpKind.Template
]);
function isElementOrContainerOp(op) {
  return elementContainerOpKinds.has(op.kind);
}
function createElementStartOp(tag, xref, namespace, sourceSpan) {
  return __spreadValues(__spreadValues({
    kind: OpKind.ElementStart,
    xref,
    tag,
    attributes: new ElementAttributes(),
    localRefs: [],
    nonBindable: false,
    namespace,
    sourceSpan
  }, TRAIT_CONSUMES_SLOT), NEW_OP);
}
function createTemplateOp(xref, tag, namespace, sourceSpan) {
  return __spreadValues(__spreadValues({
    kind: OpKind.Template,
    xref,
    attributes: new ElementAttributes(),
    tag,
    decls: null,
    vars: null,
    localRefs: [],
    nonBindable: false,
    namespace,
    sourceSpan
  }, TRAIT_CONSUMES_SLOT), NEW_OP);
}
function createElementEndOp(xref, sourceSpan) {
  return __spreadValues({
    kind: OpKind.ElementEnd,
    xref,
    sourceSpan
  }, NEW_OP);
}
function createDisableBindingsOp(xref) {
  return __spreadValues({
    kind: OpKind.DisableBindings,
    xref
  }, NEW_OP);
}
function createEnableBindingsOp(xref) {
  return __spreadValues({
    kind: OpKind.EnableBindings,
    xref
  }, NEW_OP);
}
function createTextOp(xref, initialValue, sourceSpan) {
  return __spreadValues(__spreadValues({
    kind: OpKind.Text,
    xref,
    initialValue,
    sourceSpan
  }, TRAIT_CONSUMES_SLOT), NEW_OP);
}
function createListenerOp(target, name, tag) {
  return __spreadValues(__spreadValues({
    kind: OpKind.Listener,
    target,
    tag,
    name,
    handlerOps: new OpList(),
    handlerFnName: null,
    consumesDollarEvent: false,
    isAnimationListener: false,
    animationPhase: null
  }, NEW_OP), TRAIT_USES_SLOT_INDEX);
}
function createListenerOpForAnimation(target, name, animationPhase, tag) {
  return __spreadValues(__spreadValues({
    kind: OpKind.Listener,
    target,
    tag,
    name,
    handlerOps: new OpList(),
    handlerFnName: null,
    consumesDollarEvent: false,
    isAnimationListener: true,
    animationPhase
  }, NEW_OP), TRAIT_USES_SLOT_INDEX);
}
function createPipeOp(xref, name) {
  return __spreadValues(__spreadValues({
    kind: OpKind.Pipe,
    xref,
    name
  }, NEW_OP), TRAIT_CONSUMES_SLOT);
}
var Namespace;
(function(Namespace2) {
  Namespace2[Namespace2["HTML"] = 0] = "HTML";
  Namespace2[Namespace2["SVG"] = 1] = "SVG";
  Namespace2[Namespace2["Math"] = 2] = "Math";
})(Namespace || (Namespace = {}));
function createNamespaceOp(namespace) {
  return __spreadValues({
    kind: OpKind.Namespace,
    active: namespace
  }, NEW_OP);
}
function createHostPropertyOp(name, expression, sourceSpan) {
  return __spreadValues(__spreadValues({
    kind: OpKind.HostProperty,
    name,
    expression,
    sourceSpan
  }, TRAIT_CONSUMES_VARS), NEW_OP);
}
var CompilationUnit = class {
  constructor(xref) {
    this.xref = xref;
    this.create = new OpList();
    this.update = new OpList();
    this.fnName = null;
    this.vars = null;
  }
  /**
   * Iterate over all `ir.Op`s within this view.
   *
   * Some operations may have child operations, which this iterator will visit.
   */
  *ops() {
    for (const op of this.create) {
      yield op;
      if (op.kind === OpKind.Listener) {
        for (const listenerOp of op.handlerOps) {
          yield listenerOp;
        }
      }
    }
    for (const op of this.update) {
      yield op;
    }
  }
};
var HostBindingCompilationJob = class extends CompilationUnit {
  // TODO: Perhaps we should accept a reference to the enclosing component, and get the name from
  // there?
  constructor(componentName, pool, compatibility) {
    super(0);
    this.componentName = componentName;
    this.pool = pool;
    this.compatibility = compatibility;
    this.fnSuffix = "HostBindings";
    this.units = [this];
    this.nextXrefId = 1;
  }
  get job() {
    return this;
  }
  get root() {
    return this;
  }
  allocateXrefId() {
    return this.nextXrefId++;
  }
};
var ComponentCompilationJob = class {
  get units() {
    return this.views.values();
  }
  constructor(componentName, pool, compatibility) {
    this.componentName = componentName;
    this.pool = pool;
    this.compatibility = compatibility;
    this.fnSuffix = "Template";
    this.nextXrefId = 0;
    this.views = /* @__PURE__ */ new Map();
    this.consts = [];
    const root = new ViewCompilationUnit(this, this.allocateXrefId(), null);
    this.views.set(root.xref, root);
    this.root = root;
  }
  /**
   * Add a `ViewCompilation` for a new embedded view to this compilation.
   */
  allocateView(parent) {
    const view = new ViewCompilationUnit(this, this.allocateXrefId(), parent);
    this.views.set(view.xref, view);
    return view;
  }
  /**
   * Generate a new unique `ir.XrefId` in this job.
   */
  allocateXrefId() {
    return this.nextXrefId++;
  }
  /**
   * Add a constant `o.Expression` to the compilation and return its index in the `consts` array.
   */
  addConst(newConst) {
    for (let idx2 = 0; idx2 < this.consts.length; idx2++) {
      if (this.consts[idx2].isEquivalent(newConst)) {
        return idx2;
      }
    }
    const idx = this.consts.length;
    this.consts.push(newConst);
    return idx;
  }
};
var ViewCompilationUnit = class extends CompilationUnit {
  constructor(job, xref, parent) {
    super(xref);
    this.job = job;
    this.parent = parent;
    this.contextVariables = /* @__PURE__ */ new Map();
    this.decls = null;
  }
  get compatibility() {
    return this.job.compatibility;
  }
};
function phaseVarCounting(job) {
  for (const unit of job.units) {
    let varCount = 0;
    for (const op of unit.ops()) {
      if (hasConsumesVarsTrait(op)) {
        varCount += varsUsedByOp(op);
      }
      visitExpressionsInOp(op, (expr) => {
        if (!isIrExpression(expr)) {
          return;
        }
        if (hasUsesVarOffsetTrait(expr)) {
          expr.varOffset = varCount;
        }
        if (hasConsumesVarsTrait(expr)) {
          varCount += varsUsedByIrExpression(expr);
        }
      });
    }
    unit.vars = varCount;
  }
  if (job instanceof ComponentCompilationJob) {
    for (const view of job.views.values()) {
      for (const op of view.create) {
        if (op.kind !== OpKind.Template) {
          continue;
        }
        const childView = job.views.get(op.xref);
        op.vars = childView.vars;
      }
    }
  }
}
function varsUsedByOp(op) {
  let slots;
  switch (op.kind) {
    case OpKind.Property:
    case OpKind.HostProperty:
    case OpKind.Attribute:
      slots = 1;
      if (op.expression instanceof Interpolation) {
        slots += op.expression.expressions.length;
      }
      return slots;
    case OpKind.StyleProp:
    case OpKind.ClassProp:
    case OpKind.StyleMap:
    case OpKind.ClassMap:
      slots = 2;
      if (op.expression instanceof Interpolation) {
        slots += op.expression.expressions.length;
      }
      return slots;
    case OpKind.InterpolateText:
      return op.interpolation.expressions.length;
    default:
      throw new Error(`Unhandled op: ${OpKind[op.kind]}`);
  }
}
function varsUsedByIrExpression(expr) {
  switch (expr.kind) {
    case ExpressionKind.PureFunctionExpr:
      return 1 + expr.args.length;
    case ExpressionKind.PipeBinding:
      return 1 + expr.args.length;
    case ExpressionKind.PipeBindingVariadic:
      return 1 + expr.numArgs;
    default:
      throw new Error(`AssertionError: unhandled ConsumesVarsTrait expression ${expr.constructor.name}`);
  }
}
function phaseAlignPipeVariadicVarOffset(cpl) {
  for (const view of cpl.views.values()) {
    for (const op of view.update) {
      visitExpressionsInOp(op, (expr) => {
        if (!(expr instanceof PipeBindingVariadicExpr)) {
          return expr;
        }
        if (!(expr.args instanceof PureFunctionExpr)) {
          return expr;
        }
        if (expr.varOffset === null || expr.args.varOffset === null) {
          throw new Error(`Must run after variable counting`);
        }
        expr.varOffset = expr.args.varOffset;
        expr.args.varOffset = expr.varOffset + varsUsedByIrExpression(expr);
      });
    }
  }
}
function phaseFindAnyCasts(cpl) {
  for (const [_, view] of cpl.views) {
    for (const op of view.ops()) {
      transformExpressionsInOp(op, removeAnys, VisitorContextFlag.None);
    }
  }
}
function removeAnys(e) {
  if (e instanceof InvokeFunctionExpr && e.fn instanceof LexicalReadExpr && e.fn.name === "$any") {
    if (e.args.length !== 1) {
      throw new Error("The $any builtin function expects exactly one argument.");
    }
    return e.args[0];
  }
  return e;
}
function parse(value) {
  const styles = [];
  let i = 0;
  let parenDepth = 0;
  let quote = 0;
  let valueStart = 0;
  let propStart = 0;
  let currentProp = null;
  while (i < value.length) {
    const token = value.charCodeAt(i++);
    switch (token) {
      case 40:
        parenDepth++;
        break;
      case 41:
        parenDepth--;
        break;
      case 39:
        if (quote === 0) {
          quote = 39;
        } else if (quote === 39 && value.charCodeAt(i - 1) !== 92) {
          quote = 0;
        }
        break;
      case 34:
        if (quote === 0) {
          quote = 34;
        } else if (quote === 34 && value.charCodeAt(i - 1) !== 92) {
          quote = 0;
        }
        break;
      case 58:
        if (!currentProp && parenDepth === 0 && quote === 0) {
          currentProp = hyphenate$1(value.substring(propStart, i - 1).trim());
          valueStart = i;
        }
        break;
      case 59:
        if (currentProp && valueStart > 0 && parenDepth === 0 && quote === 0) {
          const styleVal = value.substring(valueStart, i - 1).trim();
          styles.push(currentProp, styleVal);
          propStart = i;
          valueStart = 0;
          currentProp = null;
        }
        break;
    }
  }
  if (currentProp && valueStart) {
    const styleVal = value.slice(valueStart).trim();
    styles.push(currentProp, styleVal);
  }
  return styles;
}
function hyphenate$1(value) {
  return value.replace(/[a-z][A-Z]/g, (v) => {
    return v.charAt(0) + "-" + v.charAt(1);
  }).toLowerCase();
}
function getElementsByXrefId(view) {
  const elements = /* @__PURE__ */ new Map();
  for (const op of view.create) {
    if (!isElementOrContainerOp(op)) {
      continue;
    }
    elements.set(op.xref, op);
  }
  return elements;
}
function phaseAttributeExtraction(cpl) {
  for (const [_, view] of cpl.views) {
    populateElementAttributes(view);
  }
}
function lookupElement$2(elements, xref) {
  const el = elements.get(xref);
  if (el === void 0) {
    throw new Error("All attributes should have an element-like target.");
  }
  return el;
}
function populateElementAttributes(view) {
  const elements = getElementsByXrefId(view);
  for (const op of view.ops()) {
    let ownerOp;
    switch (op.kind) {
      case OpKind.Attribute:
        extractAttributeOp(view, op, elements);
        break;
      case OpKind.Property:
        if (op.isAnimationTrigger) {
          continue;
        }
        ownerOp = lookupElement$2(elements, op.target);
        assertIsElementAttributes(ownerOp.attributes);
        ownerOp.attributes.add(op.isTemplate ? BindingKind.Template : BindingKind.Property, op.name, null);
        break;
      case OpKind.StyleProp:
      case OpKind.ClassProp:
        ownerOp = lookupElement$2(elements, op.target);
        assertIsElementAttributes(ownerOp.attributes);
        if (view.compatibility === CompatibilityMode.TemplateDefinitionBuilder && op.expression instanceof EmptyExpr) {
          ownerOp.attributes.add(BindingKind.Property, op.name, null);
        }
        break;
      case OpKind.Listener:
        if (op.isAnimationListener) {
          continue;
        }
        ownerOp = lookupElement$2(elements, op.target);
        assertIsElementAttributes(ownerOp.attributes);
        ownerOp.attributes.add(BindingKind.Property, op.name, null);
        break;
    }
  }
}
function isStringLiteral(expr) {
  return expr instanceof LiteralExpr && typeof expr.value === "string";
}
function extractAttributeOp(view, op, elements) {
  if (op.expression instanceof Interpolation) {
    return;
  }
  const ownerOp = lookupElement$2(elements, op.target);
  assertIsElementAttributes(ownerOp.attributes);
  if (op.name === "style" && isStringLiteral(op.expression)) {
    if (view.compatibility === CompatibilityMode.TemplateDefinitionBuilder && op.securityContext !== SecurityContext.NONE) {
      return;
    }
    const parsedStyles = parse(op.expression.value);
    for (let i = 0; i < parsedStyles.length - 1; i += 2) {
      ownerOp.attributes.add(BindingKind.StyleProperty, parsedStyles[i], literal(parsedStyles[i + 1]));
    }
    OpList.remove(op);
  } else {
    let extractable = view.compatibility === CompatibilityMode.TemplateDefinitionBuilder ? op.expression instanceof LiteralExpr && typeof op.expression.value === "string" : op.expression.isConstant();
    if (extractable) {
      ownerOp.attributes.add(op.isTemplate ? BindingKind.Template : BindingKind.Attribute, op.name, op.expression);
      OpList.remove(op);
    }
  }
}
function lookupElement$1(elements, xref) {
  const el = elements.get(xref);
  if (el === void 0) {
    throw new Error("All attributes should have an element-like target.");
  }
  return el;
}
function phaseBindingSpecialization(job) {
  const elements = /* @__PURE__ */ new Map();
  for (const unit of job.units) {
    for (const op of unit.create) {
      if (!isElementOrContainerOp(op)) {
        continue;
      }
      elements.set(op.xref, op);
    }
  }
  for (const unit of job.units) {
    for (const op of unit.ops()) {
      if (op.kind !== OpKind.Binding) {
        continue;
      }
      switch (op.bindingKind) {
        case BindingKind.Attribute:
          if (op.name === "ngNonBindable") {
            OpList.remove(op);
            const target = lookupElement$1(elements, op.target);
            target.nonBindable = true;
          } else {
            OpList.replace(op, createAttributeOp(op.target, op.name, op.expression, op.securityContext, op.isTemplate, op.sourceSpan));
          }
          break;
        case BindingKind.Property:
        case BindingKind.Animation:
          if (job instanceof HostBindingCompilationJob) {
            OpList.replace(op, createHostPropertyOp(op.name, op.expression, op.sourceSpan));
          } else {
            OpList.replace(op, createPropertyOp(op.target, op.name, op.expression, op.bindingKind === BindingKind.Animation, op.securityContext, op.isTemplate, op.sourceSpan));
          }
          break;
        case BindingKind.I18n:
        case BindingKind.ClassName:
        case BindingKind.StyleProperty:
          throw new Error(`Unhandled binding of kind ${BindingKind[op.bindingKind]}`);
      }
    }
  }
}
var CHAINABLE = /* @__PURE__ */ new Set([
  Identifiers.elementStart,
  Identifiers.elementEnd,
  Identifiers.element,
  Identifiers.property,
  Identifiers.hostProperty,
  Identifiers.styleProp,
  Identifiers.attribute,
  Identifiers.stylePropInterpolate1,
  Identifiers.stylePropInterpolate2,
  Identifiers.stylePropInterpolate3,
  Identifiers.stylePropInterpolate4,
  Identifiers.stylePropInterpolate5,
  Identifiers.stylePropInterpolate6,
  Identifiers.stylePropInterpolate7,
  Identifiers.stylePropInterpolate8,
  Identifiers.stylePropInterpolateV,
  Identifiers.classProp,
  Identifiers.listener,
  Identifiers.elementContainerStart,
  Identifiers.elementContainerEnd,
  Identifiers.elementContainer,
  Identifiers.listener
]);
function phaseChaining(job) {
  for (const unit of job.units) {
    chainOperationsInList(unit.create);
    chainOperationsInList(unit.update);
  }
}
function chainOperationsInList(opList) {
  let chain = null;
  for (const op of opList) {
    if (op.kind !== OpKind.Statement || !(op.statement instanceof ExpressionStatement)) {
      chain = null;
      continue;
    }
    if (!(op.statement.expr instanceof InvokeFunctionExpr) || !(op.statement.expr.fn instanceof ExternalExpr)) {
      chain = null;
      continue;
    }
    const instruction = op.statement.expr.fn.value;
    if (!CHAINABLE.has(instruction)) {
      chain = null;
      continue;
    }
    if (chain !== null && chain.instruction === instruction) {
      const expression = chain.expression.callFn(op.statement.expr.args, op.statement.expr.sourceSpan, op.statement.expr.pure);
      chain.expression = expression;
      chain.op.statement = expression.toStmt();
      OpList.remove(op);
    } else {
      chain = {
        op,
        instruction,
        expression: op.statement.expr
      };
    }
  }
}
function phaseConstCollection(cpl) {
  for (const [_, view] of cpl.views) {
    for (const op of view.create) {
      if (op.kind !== OpKind.ElementStart && op.kind !== OpKind.Element && op.kind !== OpKind.Template) {
        continue;
      } else if (!(op.attributes instanceof ElementAttributes)) {
        continue;
      }
      const attrArray = serializeAttributes(op.attributes);
      if (attrArray.entries.length > 0) {
        op.attributes = cpl.addConst(attrArray);
      } else {
        op.attributes = null;
      }
    }
  }
}
function serializeAttributes({ attributes, bindings, classes, i18n, projectAs, styles, template: template2 }) {
  const attrArray = [...attributes];
  if (projectAs !== null) {
    attrArray.push(literal(
      5
      /* core.AttributeMarker.ProjectAs */
    ), literal(projectAs));
  }
  if (classes.length > 0) {
    attrArray.push(literal(
      1
      /* core.AttributeMarker.Classes */
    ), ...classes);
  }
  if (styles.length > 0) {
    attrArray.push(literal(
      2
      /* core.AttributeMarker.Styles */
    ), ...styles);
  }
  if (bindings.length > 0) {
    attrArray.push(literal(
      3
      /* core.AttributeMarker.Bindings */
    ), ...bindings);
  }
  if (template2.length > 0) {
    attrArray.push(literal(
      4
      /* core.AttributeMarker.Template */
    ), ...template2);
  }
  if (i18n.length > 0) {
    attrArray.push(literal(
      6
      /* core.AttributeMarker.I18n */
    ), ...i18n);
  }
  return literalArr(attrArray);
}
var REPLACEMENTS = /* @__PURE__ */ new Map([
  [OpKind.ElementEnd, [OpKind.ElementStart, OpKind.Element]],
  [OpKind.ContainerEnd, [OpKind.ContainerStart, OpKind.Container]]
]);
function phaseEmptyElements(cpl) {
  for (const [_, view] of cpl.views) {
    for (const op of view.create) {
      const opReplacements = REPLACEMENTS.get(op.kind);
      if (opReplacements === void 0) {
        continue;
      }
      const [startKind, mergedKind] = opReplacements;
      if (op.prev !== null && op.prev.kind === startKind) {
        op.prev.kind = mergedKind;
        OpList.remove(op);
      }
    }
  }
}
function phaseExpandSafeReads(job) {
  for (const unit of job.units) {
    for (const op of unit.ops()) {
      transformExpressionsInOp(op, (e) => safeTransform(e, { job }), VisitorContextFlag.None);
      transformExpressionsInOp(op, ternaryTransform, VisitorContextFlag.None);
    }
  }
}
var requiresTemporary = [
  InvokeFunctionExpr,
  LiteralArrayExpr,
  LiteralMapExpr,
  SafeInvokeFunctionExpr,
  PipeBindingExpr
].map((e) => e.constructor.name);
function needsTemporaryInSafeAccess(e) {
  if (e instanceof UnaryOperatorExpr) {
    return needsTemporaryInSafeAccess(e.expr);
  } else if (e instanceof BinaryOperatorExpr) {
    return needsTemporaryInSafeAccess(e.lhs) || needsTemporaryInSafeAccess(e.rhs);
  } else if (e instanceof ConditionalExpr) {
    if (e.falseCase && needsTemporaryInSafeAccess(e.falseCase))
      return true;
    return needsTemporaryInSafeAccess(e.condition) || needsTemporaryInSafeAccess(e.trueCase);
  } else if (e instanceof NotExpr) {
    return needsTemporaryInSafeAccess(e.condition);
  } else if (e instanceof AssignTemporaryExpr) {
    return needsTemporaryInSafeAccess(e.expr);
  } else if (e instanceof ReadPropExpr) {
    return needsTemporaryInSafeAccess(e.receiver);
  } else if (e instanceof ReadKeyExpr) {
    return needsTemporaryInSafeAccess(e.receiver) || needsTemporaryInSafeAccess(e.index);
  }
  return e instanceof InvokeFunctionExpr || e instanceof LiteralArrayExpr || e instanceof LiteralMapExpr || e instanceof SafeInvokeFunctionExpr || e instanceof PipeBindingExpr;
}
function temporariesIn(e) {
  const temporaries = /* @__PURE__ */ new Set();
  transformExpressionsInExpression(e, (e2) => {
    if (e2 instanceof AssignTemporaryExpr) {
      temporaries.add(e2.xref);
    }
    return e2;
  }, VisitorContextFlag.None);
  return temporaries;
}
function eliminateTemporaryAssignments(e, tmps, ctx) {
  transformExpressionsInExpression(e, (e2) => {
    if (e2 instanceof AssignTemporaryExpr && tmps.has(e2.xref)) {
      const read = new ReadTemporaryExpr(e2.xref);
      return ctx.job.compatibility === CompatibilityMode.TemplateDefinitionBuilder ? new AssignTemporaryExpr(read, read.xref) : read;
    }
    return e2;
  }, VisitorContextFlag.None);
  return e;
}
function safeTernaryWithTemporary(guard, body, ctx) {
  let result;
  if (needsTemporaryInSafeAccess(guard)) {
    const xref = ctx.job.allocateXrefId();
    result = [new AssignTemporaryExpr(guard, xref), new ReadTemporaryExpr(xref)];
  } else {
    result = [guard, guard.clone()];
    eliminateTemporaryAssignments(result[1], temporariesIn(result[0]), ctx);
  }
  return new SafeTernaryExpr(result[0], body(result[1]));
}
function isSafeAccessExpression(e) {
  return e instanceof SafePropertyReadExpr || e instanceof SafeKeyedReadExpr || e instanceof SafeInvokeFunctionExpr;
}
function isUnsafeAccessExpression(e) {
  return e instanceof ReadPropExpr || e instanceof ReadKeyExpr || e instanceof InvokeFunctionExpr;
}
function isAccessExpression(e) {
  return isSafeAccessExpression(e) || isUnsafeAccessExpression(e);
}
function deepestSafeTernary(e) {
  if (isAccessExpression(e) && e.receiver instanceof SafeTernaryExpr) {
    let st = e.receiver;
    while (st.expr instanceof SafeTernaryExpr) {
      st = st.expr;
    }
    return st;
  }
  return null;
}
function safeTransform(e, ctx) {
  if (!isAccessExpression(e)) {
    return e;
  }
  const dst = deepestSafeTernary(e);
  if (dst) {
    if (e instanceof InvokeFunctionExpr) {
      dst.expr = dst.expr.callFn(e.args);
      return e.receiver;
    }
    if (e instanceof ReadPropExpr) {
      dst.expr = dst.expr.prop(e.name);
      return e.receiver;
    }
    if (e instanceof ReadKeyExpr) {
      dst.expr = dst.expr.key(e.index);
      return e.receiver;
    }
    if (e instanceof SafeInvokeFunctionExpr) {
      dst.expr = safeTernaryWithTemporary(dst.expr, (r) => r.callFn(e.args), ctx);
      return e.receiver;
    }
    if (e instanceof SafePropertyReadExpr) {
      dst.expr = safeTernaryWithTemporary(dst.expr, (r) => r.prop(e.name), ctx);
      return e.receiver;
    }
    if (e instanceof SafeKeyedReadExpr) {
      dst.expr = safeTernaryWithTemporary(dst.expr, (r) => r.key(e.index), ctx);
      return e.receiver;
    }
  } else {
    if (e instanceof SafeInvokeFunctionExpr) {
      return safeTernaryWithTemporary(e.receiver, (r) => r.callFn(e.args), ctx);
    }
    if (e instanceof SafePropertyReadExpr) {
      return safeTernaryWithTemporary(e.receiver, (r) => r.prop(e.name), ctx);
    }
    if (e instanceof SafeKeyedReadExpr) {
      return safeTernaryWithTemporary(e.receiver, (r) => r.key(e.index), ctx);
    }
  }
  return e;
}
function ternaryTransform(e) {
  if (!(e instanceof SafeTernaryExpr)) {
    return e;
  }
  return new ConditionalExpr(new BinaryOperatorExpr(BinaryOperator.Equals, e.guard, NULL_EXPR), NULL_EXPR, e.expr);
}
function phaseGenerateAdvance(cpl) {
  for (const [_, view] of cpl.views) {
    const slotMap = /* @__PURE__ */ new Map();
    for (const op of view.create) {
      if (!hasConsumesSlotTrait(op)) {
        continue;
      } else if (op.slot === null) {
        throw new Error(`AssertionError: expected slots to have been allocated before generating advance() calls`);
      }
      slotMap.set(op.xref, op.slot);
    }
    let slotContext = 0;
    for (const op of view.update) {
      if (!hasDependsOnSlotContextTrait(op)) {
        continue;
      } else if (!slotMap.has(op.target)) {
        throw new Error(`AssertionError: reference to unknown slot for var ${op.target}`);
      }
      const slot = slotMap.get(op.target);
      if (slotContext !== slot) {
        const delta = slot - slotContext;
        if (delta < 0) {
          throw new Error(`AssertionError: slot counter should never need to move backwards`);
        }
        OpList.insertBefore(createAdvanceOp(delta, op.sourceSpan), op);
        slotContext = slot;
      }
    }
  }
}
function phaseGenerateVariables(cpl) {
  recursivelyProcessView(
    cpl.root,
    /* there is no parent scope for the root view */
    null
  );
}
function recursivelyProcessView(view, parentScope) {
  const scope = getScopeForView(view, parentScope);
  for (const op of view.create) {
    switch (op.kind) {
      case OpKind.Template:
        recursivelyProcessView(view.job.views.get(op.xref), scope);
        break;
      case OpKind.Listener:
        op.handlerOps.prepend(generateVariablesInScopeForView(view, scope));
        break;
    }
  }
  const preambleOps = generateVariablesInScopeForView(view, scope);
  view.update.prepend(preambleOps);
}
function getScopeForView(view, parent) {
  const scope = {
    view: view.xref,
    viewContextVariable: {
      kind: SemanticVariableKind.Context,
      name: null,
      view: view.xref
    },
    contextVariables: /* @__PURE__ */ new Map(),
    references: [],
    parent
  };
  for (const identifier of view.contextVariables.keys()) {
    scope.contextVariables.set(identifier, {
      kind: SemanticVariableKind.Identifier,
      name: null,
      identifier
    });
  }
  for (const op of view.create) {
    switch (op.kind) {
      case OpKind.Element:
      case OpKind.ElementStart:
      case OpKind.Template:
        if (!Array.isArray(op.localRefs)) {
          throw new Error(`AssertionError: expected localRefs to be an array`);
        }
        for (let offset = 0; offset < op.localRefs.length; offset++) {
          scope.references.push({
            name: op.localRefs[offset].name,
            targetId: op.xref,
            offset,
            variable: {
              kind: SemanticVariableKind.Identifier,
              name: null,
              identifier: op.localRefs[offset].name
            }
          });
        }
        break;
    }
  }
  return scope;
}
function generateVariablesInScopeForView(view, scope) {
  const newOps = [];
  if (scope.view !== view.xref) {
    newOps.push(createVariableOp(view.job.allocateXrefId(), scope.viewContextVariable, new NextContextExpr()));
  }
  for (const [name, value] of view.job.views.get(scope.view).contextVariables) {
    newOps.push(createVariableOp(view.job.allocateXrefId(), scope.contextVariables.get(name), new ReadPropExpr(new ContextExpr(scope.view), value)));
  }
  for (const ref of scope.references) {
    newOps.push(createVariableOp(view.job.allocateXrefId(), ref.variable, new ReferenceExpr(ref.targetId, ref.offset)));
  }
  if (scope.parent !== null) {
    newOps.push(...generateVariablesInScopeForView(view, scope.parent));
  }
  return newOps;
}
var STYLE_DOT = "style.";
var CLASS_DOT = "class.";
function phaseHostStylePropertyParsing(job) {
  for (const op of job.update) {
    if (op.kind !== OpKind.Binding) {
      continue;
    }
    if (op.name.startsWith(STYLE_DOT)) {
      op.bindingKind = BindingKind.StyleProperty;
      op.name = op.name.substring(STYLE_DOT.length);
      if (isCssCustomProperty$1(op.name)) {
        op.name = hyphenate(op.name);
      }
      const { property: property2, suffix } = parseProperty$1(op.name);
      op.name = property2;
      op.unit = suffix;
    } else if (op.name.startsWith("style!")) {
      op.name = "style";
    } else if (op.name.startsWith(CLASS_DOT)) {
      op.bindingKind = BindingKind.ClassName;
      op.name = parseProperty$1(op.name.substring(CLASS_DOT.length)).property;
    }
  }
}
function isCssCustomProperty$1(name) {
  return name.startsWith("--");
}
function hyphenate(value) {
  return value.replace(/[a-z][A-Z]/g, (v) => {
    return v.charAt(0) + "-" + v.charAt(1);
  }).toLowerCase();
}
function parseProperty$1(name) {
  const overrideIndex = name.indexOf("!important");
  if (overrideIndex !== -1) {
    name = overrideIndex > 0 ? name.substring(0, overrideIndex) : "";
  }
  let suffix = null;
  let property2 = name;
  const unitIndex = name.lastIndexOf(".");
  if (unitIndex > 0) {
    suffix = name.slice(unitIndex + 1);
    property2 = name.substring(0, unitIndex);
  }
  return { property: property2, suffix };
}
function phaseLocalRefs(cpl) {
  for (const view of cpl.views.values()) {
    for (const op of view.create) {
      switch (op.kind) {
        case OpKind.ElementStart:
        case OpKind.Element:
        case OpKind.Template:
          if (!Array.isArray(op.localRefs)) {
            throw new Error(`AssertionError: expected localRefs to be an array still`);
          }
          op.numSlotsUsed += op.localRefs.length;
          if (op.localRefs.length > 0) {
            const localRefs = serializeLocalRefs(op.localRefs);
            op.localRefs = cpl.addConst(localRefs);
          } else {
            op.localRefs = null;
          }
          break;
      }
    }
  }
}
function serializeLocalRefs(refs) {
  const constRefs = [];
  for (const ref of refs) {
    constRefs.push(literal(ref.name), literal(ref.target));
  }
  return literalArr(constRefs);
}
function phaseNamespace(job) {
  for (const [_, view] of job.views) {
    let activeNamespace = Namespace.HTML;
    for (const op of view.create) {
      if (op.kind !== OpKind.Element && op.kind !== OpKind.ElementStart) {
        continue;
      }
      if (op.namespace !== activeNamespace) {
        OpList.insertBefore(createNamespaceOp(op.namespace), op);
        activeNamespace = op.namespace;
      }
    }
  }
}
var BINARY_OPERATORS = /* @__PURE__ */ new Map([
  ["&&", BinaryOperator.And],
  [">", BinaryOperator.Bigger],
  [">=", BinaryOperator.BiggerEquals],
  ["&", BinaryOperator.BitwiseAnd],
  ["/", BinaryOperator.Divide],
  ["==", BinaryOperator.Equals],
  ["===", BinaryOperator.Identical],
  ["<", BinaryOperator.Lower],
  ["<=", BinaryOperator.LowerEquals],
  ["-", BinaryOperator.Minus],
  ["%", BinaryOperator.Modulo],
  ["*", BinaryOperator.Multiply],
  ["!=", BinaryOperator.NotEquals],
  ["!==", BinaryOperator.NotIdentical],
  ["??", BinaryOperator.NullishCoalesce],
  ["||", BinaryOperator.Or],
  ["+", BinaryOperator.Plus]
]);
var NAMESPACES = /* @__PURE__ */ new Map([["svg", Namespace.SVG], ["math", Namespace.Math]]);
function namespaceForKey(namespacePrefixKey) {
  if (namespacePrefixKey === null) {
    return Namespace.HTML;
  }
  return NAMESPACES.get(namespacePrefixKey) ?? Namespace.HTML;
}
function keyForNamespace(namespace) {
  for (const [k, n] of NAMESPACES.entries()) {
    if (n === namespace) {
      return k;
    }
  }
  return null;
}
function prefixWithNamespace(strippedTag, namespace) {
  if (namespace === Namespace.HTML) {
    return strippedTag;
  }
  return `:${keyForNamespace(namespace)}:${strippedTag}`;
}
function phaseNaming(cpl) {
  addNamesToView(cpl.root, cpl.componentName, { index: 0 }, cpl.compatibility === CompatibilityMode.TemplateDefinitionBuilder);
}
function addNamesToView(unit, baseName, state, compatibility) {
  if (unit.fnName === null) {
    unit.fnName = sanitizeIdentifier(`${baseName}_${unit.job.fnSuffix}`);
  }
  const varNames = /* @__PURE__ */ new Map();
  for (const op of unit.ops()) {
    switch (op.kind) {
      case OpKind.Property:
        if (op.isAnimationTrigger) {
          op.name = "@" + op.name;
        }
        break;
      case OpKind.Listener:
        if (op.handlerFnName === null) {
          if (op.slot === null) {
            throw new Error(`Expected a slot to be assigned`);
          }
          const safeTagName = op.tag.replace("-", "_");
          if (op.isAnimationListener) {
            op.handlerFnName = sanitizeIdentifier(`${unit.fnName}_${safeTagName}_animation_${op.name}_${op.animationPhase}_${op.slot}_listener`);
            op.name = `@${op.name}.${op.animationPhase}`;
          } else {
            op.handlerFnName = sanitizeIdentifier(`${unit.fnName}_${safeTagName}_${op.name}_${op.slot}_listener`);
          }
        }
        break;
      case OpKind.Variable:
        varNames.set(op.xref, getVariableName(op.variable, state));
        break;
      case OpKind.Template:
        if (!(unit instanceof ViewCompilationUnit)) {
          throw new Error(`AssertionError: must be compiling a component`);
        }
        const childView = unit.job.views.get(op.xref);
        if (op.slot === null) {
          throw new Error(`Expected slot to be assigned`);
        }
        addNamesToView(childView, `${baseName}_${prefixWithNamespace(op.tag, op.namespace)}_${op.slot}`, state, compatibility);
        break;
      case OpKind.StyleProp:
        op.name = normalizeStylePropName(op.name);
        if (compatibility) {
          op.name = stripImportant(op.name);
        }
        break;
      case OpKind.ClassProp:
        if (compatibility) {
          op.name = stripImportant(op.name);
        }
        break;
    }
  }
  for (const op of unit.ops()) {
    visitExpressionsInOp(op, (expr) => {
      if (!(expr instanceof ReadVariableExpr) || expr.name !== null) {
        return;
      }
      if (!varNames.has(expr.xref)) {
        throw new Error(`Variable ${expr.xref} not yet named`);
      }
      expr.name = varNames.get(expr.xref);
    });
  }
}
function getVariableName(variable2, state) {
  if (variable2.name === null) {
    switch (variable2.kind) {
      case SemanticVariableKind.Context:
        variable2.name = `ctx_r${state.index++}`;
        break;
      case SemanticVariableKind.Identifier:
        variable2.name = `${variable2.identifier}_${state.index++}`;
        break;
      default:
        variable2.name = `_r${state.index++}`;
        break;
    }
  }
  return variable2.name;
}
function normalizeStylePropName(name) {
  return name.startsWith("--") ? name : hyphenate$1(name);
}
function stripImportant(name) {
  const importantIndex = name.indexOf("!important");
  if (importantIndex > -1) {
    return name.substring(0, importantIndex);
  }
  return name;
}
function phaseMergeNextContext(cpl) {
  for (const view of cpl.views.values()) {
    for (const op of view.create) {
      if (op.kind === OpKind.Listener) {
        mergeNextContextsInOps(op.handlerOps);
      }
    }
    mergeNextContextsInOps(view.update);
  }
}
function mergeNextContextsInOps(ops) {
  for (const op of ops) {
    if (op.kind !== OpKind.Statement || !(op.statement instanceof ExpressionStatement) || !(op.statement.expr instanceof NextContextExpr)) {
      continue;
    }
    const mergeSteps = op.statement.expr.steps;
    let tryToMerge = true;
    for (let candidate = op.next; candidate.kind !== OpKind.ListEnd && tryToMerge; candidate = candidate.next) {
      visitExpressionsInOp(candidate, (expr, flags) => {
        if (!isIrExpression(expr)) {
          return expr;
        }
        if (!tryToMerge) {
          return;
        }
        if (flags & VisitorContextFlag.InChildOperation) {
          return;
        }
        switch (expr.kind) {
          case ExpressionKind.NextContext:
            expr.steps += mergeSteps;
            OpList.remove(op);
            tryToMerge = false;
            break;
          case ExpressionKind.GetCurrentView:
          case ExpressionKind.Reference:
            tryToMerge = false;
            break;
        }
      });
    }
  }
}
var CONTAINER_TAG = "ng-container";
function phaseNgContainer(cpl) {
  for (const [_, view] of cpl.views) {
    const updatedElementXrefs = /* @__PURE__ */ new Set();
    for (const op of view.create) {
      if (op.kind === OpKind.ElementStart && op.tag === CONTAINER_TAG) {
        op.kind = OpKind.ContainerStart;
        updatedElementXrefs.add(op.xref);
      }
      if (op.kind === OpKind.ElementEnd && updatedElementXrefs.has(op.xref)) {
        op.kind = OpKind.ContainerEnd;
      }
    }
  }
}
function phaseNoListenersOnTemplates(job) {
  for (const unit of job.units) {
    let inTemplate = false;
    for (const op of unit.create) {
      switch (op.kind) {
        case OpKind.Template:
          inTemplate = true;
          break;
        case OpKind.ElementStart:
        case OpKind.Element:
        case OpKind.ContainerStart:
        case OpKind.Container:
          inTemplate = false;
          break;
        case OpKind.Listener:
          if (inTemplate) {
            OpList.remove(op);
          }
          break;
      }
    }
  }
}
function lookupElement(elements, xref) {
  const el = elements.get(xref);
  if (el === void 0) {
    throw new Error("All attributes should have an element-like target.");
  }
  return el;
}
function phaseNonbindable(job) {
  const elements = /* @__PURE__ */ new Map();
  for (const view of job.units) {
    for (const op of view.create) {
      if (!isElementOrContainerOp(op)) {
        continue;
      }
      elements.set(op.xref, op);
    }
  }
  for (const [_, view] of job.views) {
    for (const op of view.create) {
      if ((op.kind === OpKind.ElementStart || op.kind === OpKind.ContainerStart) && op.nonBindable) {
        OpList.insertAfter(createDisableBindingsOp(op.xref), op);
      }
      if ((op.kind === OpKind.ElementEnd || op.kind === OpKind.ContainerEnd) && lookupElement(elements, op.xref).nonBindable) {
        OpList.insertBefore(createEnableBindingsOp(op.xref), op);
      }
    }
  }
}
function phaseNullishCoalescing(job) {
  for (const unit of job.units) {
    for (const op of unit.ops()) {
      transformExpressionsInOp(op, (expr) => {
        if (!(expr instanceof BinaryOperatorExpr) || expr.operator !== BinaryOperator.NullishCoalesce) {
          return expr;
        }
        const assignment = new AssignTemporaryExpr(expr.lhs.clone(), job.allocateXrefId());
        const read = new ReadTemporaryExpr(assignment.xref);
        return new ConditionalExpr(new BinaryOperatorExpr(BinaryOperator.And, new BinaryOperatorExpr(BinaryOperator.NotIdentical, assignment, NULL_EXPR), new BinaryOperatorExpr(BinaryOperator.NotIdentical, read, new LiteralExpr(void 0))), read.clone(), expr.rhs);
      }, VisitorContextFlag.None);
    }
  }
}
function phasePipeCreation(cpl) {
  for (const view of cpl.views.values()) {
    processPipeBindingsInView(view);
  }
}
function processPipeBindingsInView(view) {
  for (const updateOp of view.update) {
    visitExpressionsInOp(updateOp, (expr, flags) => {
      if (!isIrExpression(expr)) {
        return;
      }
      if (expr.kind !== ExpressionKind.PipeBinding) {
        return;
      }
      if (flags & VisitorContextFlag.InChildOperation) {
        throw new Error(`AssertionError: pipe bindings should not appear in child expressions`);
      }
      if (!hasDependsOnSlotContextTrait(updateOp)) {
        throw new Error(`AssertionError: pipe binding associated with non-slot operation ${OpKind[updateOp.kind]}`);
      }
      addPipeToCreationBlock(view, updateOp.target, expr);
    });
  }
}
function addPipeToCreationBlock(view, afterTargetXref, binding) {
  for (let op = view.create.head.next; op.kind !== OpKind.ListEnd; op = op.next) {
    if (!hasConsumesSlotTrait(op)) {
      continue;
    }
    if (op.xref !== afterTargetXref) {
      continue;
    }
    while (op.next.kind === OpKind.Pipe) {
      op = op.next;
    }
    const pipe2 = createPipeOp(binding.target, binding.name);
    OpList.insertBefore(pipe2, op.next);
    return;
  }
  throw new Error(`AssertionError: unable to find insertion point for pipe ${binding.name}`);
}
function phasePipeVariadic(cpl) {
  for (const view of cpl.views.values()) {
    for (const op of view.update) {
      transformExpressionsInOp(op, (expr) => {
        if (!(expr instanceof PipeBindingExpr)) {
          return expr;
        }
        if (expr.args.length <= 4) {
          return expr;
        }
        return new PipeBindingVariadicExpr(expr.target, expr.name, literalArr(expr.args), expr.args.length);
      }, VisitorContextFlag.None);
    }
  }
}
function kindTest(kind) {
  return (op) => op.kind === kind;
}
var ORDERING = [
  { test: kindTest(OpKind.StyleMap), transform: keepLast },
  { test: kindTest(OpKind.ClassMap), transform: keepLast },
  { test: kindTest(OpKind.StyleProp) },
  { test: kindTest(OpKind.ClassProp) },
  {
    test: (op) => (op.kind === OpKind.Property || op.kind === OpKind.HostProperty) && op.expression instanceof Interpolation
  },
  {
    test: (op) => (op.kind === OpKind.Property || op.kind === OpKind.HostProperty) && !(op.expression instanceof Interpolation)
  },
  { test: kindTest(OpKind.Attribute) }
];
var handledOpKinds = /* @__PURE__ */ new Set([
  OpKind.StyleMap,
  OpKind.ClassMap,
  OpKind.StyleProp,
  OpKind.ClassProp,
  OpKind.Property,
  OpKind.HostProperty,
  OpKind.Attribute
]);
function phasePropertyOrdering(cpl) {
  for (const unit of cpl.units) {
    let opsToOrder = [];
    for (const op of unit.update) {
      if (handledOpKinds.has(op.kind)) {
        opsToOrder.push(op);
        OpList.remove(op);
      } else {
        for (const orderedOp of reorder(opsToOrder)) {
          OpList.insertBefore(orderedOp, op);
        }
        opsToOrder = [];
      }
    }
    for (const orderedOp of reorder(opsToOrder)) {
      unit.update.push(orderedOp);
    }
  }
}
function reorder(ops) {
  const groups = Array.from(ORDERING, () => new Array());
  for (const op of ops) {
    const groupIndex = ORDERING.findIndex((o) => o.test(op));
    groups[groupIndex].push(op);
  }
  return groups.flatMap((group, i) => {
    const transform = ORDERING[i].transform;
    return transform ? transform(group) : group;
  });
}
function keepLast(ops) {
  return ops.slice(ops.length - 1);
}
function phasePureFunctionExtraction(job) {
  for (const view of job.units) {
    for (const op of view.ops()) {
      visitExpressionsInOp(op, (expr) => {
        if (!(expr instanceof PureFunctionExpr) || expr.body === null) {
          return;
        }
        const constantDef = new PureFunctionConstant(expr.args.length);
        expr.fn = job.pool.getSharedConstant(constantDef, expr.body);
        expr.body = null;
      });
    }
  }
}
var PureFunctionConstant = class extends GenericKeyFn {
  constructor(numArgs) {
    super();
    this.numArgs = numArgs;
  }
  keyOf(expr) {
    if (expr instanceof PureFunctionParameterExpr) {
      return `param(${expr.index})`;
    } else {
      return super.keyOf(expr);
    }
  }
  toSharedConstantDeclaration(declName, keyExpr) {
    const fnParams = [];
    for (let idx = 0; idx < this.numArgs; idx++) {
      fnParams.push(new FnParam("_p" + idx));
    }
    const returnExpr = transformExpressionsInExpression(keyExpr, (expr) => {
      if (!(expr instanceof PureFunctionParameterExpr)) {
        return expr;
      }
      return variable("_p" + expr.index);
    }, VisitorContextFlag.None);
    return new DeclareFunctionStmt(declName, fnParams, [new ReturnStatement(returnExpr)]);
  }
};
function phasePureLiteralStructures(job) {
  for (const view of job.units) {
    for (const op of view.update) {
      transformExpressionsInOp(op, (expr, flags) => {
        if (flags & VisitorContextFlag.InChildOperation) {
          return expr;
        }
        if (expr instanceof LiteralArrayExpr) {
          return transformLiteralArray(expr);
        } else if (expr instanceof LiteralMapExpr) {
          return transformLiteralMap(expr);
        }
        return expr;
      }, VisitorContextFlag.None);
    }
  }
}
function transformLiteralArray(expr) {
  const derivedEntries = [];
  const nonConstantArgs = [];
  for (const entry of expr.entries) {
    if (entry.isConstant()) {
      derivedEntries.push(entry);
    } else {
      const idx = nonConstantArgs.length;
      nonConstantArgs.push(entry);
      derivedEntries.push(new PureFunctionParameterExpr(idx));
    }
  }
  return new PureFunctionExpr(literalArr(derivedEntries), nonConstantArgs);
}
function transformLiteralMap(expr) {
  let derivedEntries = [];
  const nonConstantArgs = [];
  for (const entry of expr.entries) {
    if (entry.value.isConstant()) {
      derivedEntries.push(entry);
    } else {
      const idx = nonConstantArgs.length;
      nonConstantArgs.push(entry.value);
      derivedEntries.push(new LiteralMapEntry(entry.key, new PureFunctionParameterExpr(idx), entry.quoted));
    }
  }
  return new PureFunctionExpr(literalMap(derivedEntries), nonConstantArgs);
}
function element(slot, tag, constIndex, localRefIndex, sourceSpan) {
  return elementOrContainerBase(Identifiers.element, slot, tag, constIndex, localRefIndex, sourceSpan);
}
function elementStart(slot, tag, constIndex, localRefIndex, sourceSpan) {
  return elementOrContainerBase(Identifiers.elementStart, slot, tag, constIndex, localRefIndex, sourceSpan);
}
function elementOrContainerBase(instruction, slot, tag, constIndex, localRefIndex, sourceSpan) {
  const args = [literal(slot)];
  if (tag !== null) {
    args.push(literal(tag));
  }
  if (localRefIndex !== null) {
    args.push(
      literal(constIndex),
      // might be null, but that's okay.
      literal(localRefIndex)
    );
  } else if (constIndex !== null) {
    args.push(literal(constIndex));
  }
  return call(instruction, args, sourceSpan);
}
function elementEnd(sourceSpan) {
  return call(Identifiers.elementEnd, [], sourceSpan);
}
function elementContainerStart(slot, constIndex, localRefIndex, sourceSpan) {
  return elementOrContainerBase(
    Identifiers.elementContainerStart,
    slot,
    /* tag */
    null,
    constIndex,
    localRefIndex,
    sourceSpan
  );
}
function elementContainer(slot, constIndex, localRefIndex, sourceSpan) {
  return elementOrContainerBase(
    Identifiers.elementContainer,
    slot,
    /* tag */
    null,
    constIndex,
    localRefIndex,
    sourceSpan
  );
}
function elementContainerEnd() {
  return call(Identifiers.elementContainerEnd, [], null);
}
function template(slot, templateFnRef, decls, vars, tag, constIndex, sourceSpan) {
  return call(Identifiers.templateCreate, [
    literal(slot),
    templateFnRef,
    literal(decls),
    literal(vars),
    literal(tag),
    literal(constIndex)
  ], sourceSpan);
}
function disableBindings() {
  return call(Identifiers.disableBindings, [], null);
}
function enableBindings() {
  return call(Identifiers.enableBindings, [], null);
}
function listener(name, handlerFn) {
  return call(Identifiers.listener, [
    literal(name),
    handlerFn
  ], null);
}
function pipe(slot, name) {
  return call(Identifiers.pipe, [
    literal(slot),
    literal(name)
  ], null);
}
function namespaceHTML() {
  return call(Identifiers.namespaceHTML, [], null);
}
function namespaceSVG() {
  return call(Identifiers.namespaceSVG, [], null);
}
function namespaceMath() {
  return call(Identifiers.namespaceMathML, [], null);
}
function advance(delta, sourceSpan) {
  return call(Identifiers.advance, [
    literal(delta)
  ], sourceSpan);
}
function reference(slot) {
  return importExpr(Identifiers.reference).callFn([
    literal(slot)
  ]);
}
function nextContext(steps) {
  return importExpr(Identifiers.nextContext).callFn(steps === 1 ? [] : [literal(steps)]);
}
function getCurrentView() {
  return importExpr(Identifiers.getCurrentView).callFn([]);
}
function restoreView(savedView) {
  return importExpr(Identifiers.restoreView).callFn([
    savedView
  ]);
}
function resetView(returnValue) {
  return importExpr(Identifiers.resetView).callFn([
    returnValue
  ]);
}
function text(slot, initialValue, sourceSpan) {
  const args = [literal(slot, null)];
  if (initialValue !== "") {
    args.push(literal(initialValue));
  }
  return call(Identifiers.text, args, sourceSpan);
}
function property(name, expression, sanitizer, sourceSpan) {
  const args = [literal(name), expression];
  if (sanitizer !== null) {
    args.push(sanitizer);
  }
  return call(Identifiers.property, args, sourceSpan);
}
function attribute(name, expression, sanitizer) {
  const args = [literal(name), expression];
  if (sanitizer !== null) {
    args.push(sanitizer);
  }
  return call(Identifiers.attribute, args, null);
}
function styleProp(name, expression, unit) {
  const args = [literal(name), expression];
  if (unit !== null) {
    args.push(literal(unit));
  }
  return call(Identifiers.styleProp, args, null);
}
function classProp(name, expression) {
  return call(Identifiers.classProp, [literal(name), expression], null);
}
function styleMap(expression) {
  return call(Identifiers.styleMap, [expression], null);
}
function classMap(expression) {
  return call(Identifiers.classMap, [expression], null);
}
var PIPE_BINDINGS = [
  Identifiers.pipeBind1,
  Identifiers.pipeBind2,
  Identifiers.pipeBind3,
  Identifiers.pipeBind4
];
function pipeBind(slot, varOffset, args) {
  if (args.length < 1 || args.length > PIPE_BINDINGS.length) {
    throw new Error(`pipeBind() argument count out of bounds`);
  }
  const instruction = PIPE_BINDINGS[args.length - 1];
  return importExpr(instruction).callFn([
    literal(slot),
    literal(varOffset),
    ...args
  ]);
}
function pipeBindV(slot, varOffset, args) {
  return importExpr(Identifiers.pipeBindV).callFn([
    literal(slot),
    literal(varOffset),
    args
  ]);
}
function textInterpolate(strings, expressions, sourceSpan) {
  if (strings.length < 1 || expressions.length !== strings.length - 1) {
    throw new Error(`AssertionError: expected specific shape of args for strings/expressions in interpolation`);
  }
  const interpolationArgs = [];
  if (expressions.length === 1 && strings[0] === "" && strings[1] === "") {
    interpolationArgs.push(expressions[0]);
  } else {
    let idx;
    for (idx = 0; idx < expressions.length; idx++) {
      interpolationArgs.push(literal(strings[idx]), expressions[idx]);
    }
    interpolationArgs.push(literal(strings[idx]));
  }
  return callVariadicInstruction(TEXT_INTERPOLATE_CONFIG, [], interpolationArgs, [], sourceSpan);
}
function propertyInterpolate(name, strings, expressions, sanitizer, sourceSpan) {
  const interpolationArgs = collateInterpolationArgs(strings, expressions);
  const extraArgs = [];
  if (sanitizer !== null) {
    extraArgs.push(sanitizer);
  }
  return callVariadicInstruction(PROPERTY_INTERPOLATE_CONFIG, [literal(name)], interpolationArgs, extraArgs, sourceSpan);
}
function attributeInterpolate(name, strings, expressions, sanitizer) {
  const interpolationArgs = collateInterpolationArgs(strings, expressions);
  const extraArgs = [];
  if (sanitizer !== null) {
    extraArgs.push(sanitizer);
  }
  return callVariadicInstruction(ATTRIBUTE_INTERPOLATE_CONFIG, [literal(name)], interpolationArgs, extraArgs, null);
}
function stylePropInterpolate(name, strings, expressions, unit) {
  const interpolationArgs = collateInterpolationArgs(strings, expressions);
  const extraArgs = [];
  if (unit !== null) {
    extraArgs.push(literal(unit));
  }
  return callVariadicInstruction(STYLE_PROP_INTERPOLATE_CONFIG, [literal(name)], interpolationArgs, extraArgs, null);
}
function styleMapInterpolate(strings, expressions) {
  const interpolationArgs = collateInterpolationArgs(strings, expressions);
  return callVariadicInstruction(STYLE_MAP_INTERPOLATE_CONFIG, [], interpolationArgs, [], null);
}
function classMapInterpolate(strings, expressions) {
  const interpolationArgs = collateInterpolationArgs(strings, expressions);
  return callVariadicInstruction(CLASS_MAP_INTERPOLATE_CONFIG, [], interpolationArgs, [], null);
}
function hostProperty(name, expression) {
  return call(Identifiers.hostProperty, [literal(name), expression], null);
}
function pureFunction(varOffset, fn2, args) {
  return callVariadicInstructionExpr(PURE_FUNCTION_CONFIG, [
    literal(varOffset),
    fn2
  ], args, [], null);
}
function collateInterpolationArgs(strings, expressions) {
  if (strings.length < 1 || expressions.length !== strings.length - 1) {
    throw new Error(`AssertionError: expected specific shape of args for strings/expressions in interpolation`);
  }
  const interpolationArgs = [];
  if (expressions.length === 1 && strings[0] === "" && strings[1] === "") {
    interpolationArgs.push(expressions[0]);
  } else {
    let idx;
    for (idx = 0; idx < expressions.length; idx++) {
      interpolationArgs.push(literal(strings[idx]), expressions[idx]);
    }
    interpolationArgs.push(literal(strings[idx]));
  }
  return interpolationArgs;
}
function call(instruction, args, sourceSpan) {
  const expr = importExpr(instruction).callFn(args, sourceSpan);
  return createStatementOp(new ExpressionStatement(expr, sourceSpan));
}
var TEXT_INTERPOLATE_CONFIG = {
  constant: [
    Identifiers.textInterpolate,
    Identifiers.textInterpolate1,
    Identifiers.textInterpolate2,
    Identifiers.textInterpolate3,
    Identifiers.textInterpolate4,
    Identifiers.textInterpolate5,
    Identifiers.textInterpolate6,
    Identifiers.textInterpolate7,
    Identifiers.textInterpolate8
  ],
  variable: Identifiers.textInterpolateV,
  mapping: (n) => {
    if (n % 2 === 0) {
      throw new Error(`Expected odd number of arguments`);
    }
    return (n - 1) / 2;
  }
};
var PROPERTY_INTERPOLATE_CONFIG = {
  constant: [
    Identifiers.propertyInterpolate,
    Identifiers.propertyInterpolate1,
    Identifiers.propertyInterpolate2,
    Identifiers.propertyInterpolate3,
    Identifiers.propertyInterpolate4,
    Identifiers.propertyInterpolate5,
    Identifiers.propertyInterpolate6,
    Identifiers.propertyInterpolate7,
    Identifiers.propertyInterpolate8
  ],
  variable: Identifiers.propertyInterpolateV,
  mapping: (n) => {
    if (n % 2 === 0) {
      throw new Error(`Expected odd number of arguments`);
    }
    return (n - 1) / 2;
  }
};
var STYLE_PROP_INTERPOLATE_CONFIG = {
  constant: [
    Identifiers.styleProp,
    Identifiers.stylePropInterpolate1,
    Identifiers.stylePropInterpolate2,
    Identifiers.stylePropInterpolate3,
    Identifiers.stylePropInterpolate4,
    Identifiers.stylePropInterpolate5,
    Identifiers.stylePropInterpolate6,
    Identifiers.stylePropInterpolate7,
    Identifiers.stylePropInterpolate8
  ],
  variable: Identifiers.stylePropInterpolateV,
  mapping: (n) => {
    if (n % 2 === 0) {
      throw new Error(`Expected odd number of arguments`);
    }
    return (n - 1) / 2;
  }
};
var ATTRIBUTE_INTERPOLATE_CONFIG = {
  constant: [
    Identifiers.attribute,
    Identifiers.attributeInterpolate1,
    Identifiers.attributeInterpolate2,
    Identifiers.attributeInterpolate3,
    Identifiers.attributeInterpolate4,
    Identifiers.attributeInterpolate5,
    Identifiers.attributeInterpolate6,
    Identifiers.attributeInterpolate7,
    Identifiers.attributeInterpolate8
  ],
  variable: Identifiers.attributeInterpolateV,
  mapping: (n) => {
    if (n % 2 === 0) {
      throw new Error(`Expected odd number of arguments`);
    }
    return (n - 1) / 2;
  }
};
var STYLE_MAP_INTERPOLATE_CONFIG = {
  constant: [
    Identifiers.styleMap,
    Identifiers.styleMapInterpolate1,
    Identifiers.styleMapInterpolate2,
    Identifiers.styleMapInterpolate3,
    Identifiers.styleMapInterpolate4,
    Identifiers.styleMapInterpolate5,
    Identifiers.styleMapInterpolate6,
    Identifiers.styleMapInterpolate7,
    Identifiers.styleMapInterpolate8
  ],
  variable: Identifiers.styleMapInterpolateV,
  mapping: (n) => {
    if (n % 2 === 0) {
      throw new Error(`Expected odd number of arguments`);
    }
    return (n - 1) / 2;
  }
};
var CLASS_MAP_INTERPOLATE_CONFIG = {
  constant: [
    Identifiers.classMap,
    Identifiers.classMapInterpolate1,
    Identifiers.classMapInterpolate2,
    Identifiers.classMapInterpolate3,
    Identifiers.classMapInterpolate4,
    Identifiers.classMapInterpolate5,
    Identifiers.classMapInterpolate6,
    Identifiers.classMapInterpolate7,
    Identifiers.classMapInterpolate8
  ],
  variable: Identifiers.classMapInterpolateV,
  mapping: (n) => {
    if (n % 2 === 0) {
      throw new Error(`Expected odd number of arguments`);
    }
    return (n - 1) / 2;
  }
};
var PURE_FUNCTION_CONFIG = {
  constant: [
    Identifiers.pureFunction0,
    Identifiers.pureFunction1,
    Identifiers.pureFunction2,
    Identifiers.pureFunction3,
    Identifiers.pureFunction4,
    Identifiers.pureFunction5,
    Identifiers.pureFunction6,
    Identifiers.pureFunction7,
    Identifiers.pureFunction8
  ],
  variable: Identifiers.pureFunctionV,
  mapping: (n) => n
};
function callVariadicInstructionExpr(config, baseArgs, interpolationArgs, extraArgs, sourceSpan) {
  const n = config.mapping(interpolationArgs.length);
  if (n < config.constant.length) {
    return importExpr(config.constant[n]).callFn([...baseArgs, ...interpolationArgs, ...extraArgs], sourceSpan);
  } else if (config.variable !== null) {
    return importExpr(config.variable).callFn([...baseArgs, literalArr(interpolationArgs), ...extraArgs], sourceSpan);
  } else {
    throw new Error(`AssertionError: unable to call variadic function`);
  }
}
function callVariadicInstruction(config, baseArgs, interpolationArgs, extraArgs, sourceSpan) {
  return createStatementOp(callVariadicInstructionExpr(config, baseArgs, interpolationArgs, extraArgs, sourceSpan).toStmt());
}
var sanitizerIdentifierMap = /* @__PURE__ */ new Map([
  [SanitizerFn.Html, Identifiers.sanitizeHtml],
  [SanitizerFn.IframeAttribute, Identifiers.validateIframeAttribute],
  [SanitizerFn.ResourceUrl, Identifiers.sanitizeResourceUrl],
  [SanitizerFn.Script, Identifiers.sanitizeScript],
  [SanitizerFn.Style, Identifiers.sanitizeStyle],
  [SanitizerFn.Url, Identifiers.sanitizeUrl]
]);
function phaseReify(cpl) {
  for (const unit of cpl.units) {
    reifyCreateOperations(unit, unit.create);
    reifyUpdateOperations(unit, unit.update);
  }
}
function reifyCreateOperations(unit, ops) {
  for (const op of ops) {
    transformExpressionsInOp(op, reifyIrExpression, VisitorContextFlag.None);
    switch (op.kind) {
      case OpKind.Text:
        OpList.replace(op, text(op.slot, op.initialValue, op.sourceSpan));
        break;
      case OpKind.ElementStart:
        OpList.replace(op, elementStart(op.slot, op.tag, op.attributes, op.localRefs, op.sourceSpan));
        break;
      case OpKind.Element:
        OpList.replace(op, element(op.slot, op.tag, op.attributes, op.localRefs, op.sourceSpan));
        break;
      case OpKind.ElementEnd:
        OpList.replace(op, elementEnd(op.sourceSpan));
        break;
      case OpKind.ContainerStart:
        OpList.replace(op, elementContainerStart(op.slot, op.attributes, op.localRefs, op.sourceSpan));
        break;
      case OpKind.Container:
        OpList.replace(op, elementContainer(op.slot, op.attributes, op.localRefs, op.sourceSpan));
        break;
      case OpKind.ContainerEnd:
        OpList.replace(op, elementContainerEnd());
        break;
      case OpKind.Template:
        if (!(unit instanceof ViewCompilationUnit)) {
          throw new Error(`AssertionError: must be compiling a component`);
        }
        const childView = unit.job.views.get(op.xref);
        OpList.replace(op, template(op.slot, variable(childView.fnName), childView.decls, childView.vars, op.tag, op.attributes, op.sourceSpan));
        break;
      case OpKind.DisableBindings:
        OpList.replace(op, disableBindings());
        break;
      case OpKind.EnableBindings:
        OpList.replace(op, enableBindings());
        break;
      case OpKind.Pipe:
        OpList.replace(op, pipe(op.slot, op.name));
        break;
      case OpKind.Listener:
        const listenerFn = reifyListenerHandler(unit, op.handlerFnName, op.handlerOps, op.consumesDollarEvent);
        OpList.replace(op, listener(op.name, listenerFn));
        break;
      case OpKind.Variable:
        if (op.variable.name === null) {
          throw new Error(`AssertionError: unnamed variable ${op.xref}`);
        }
        OpList.replace(op, createStatementOp(new DeclareVarStmt(op.variable.name, op.initializer, void 0, StmtModifier.Final)));
        break;
      case OpKind.Namespace:
        switch (op.active) {
          case Namespace.HTML:
            OpList.replace(op, namespaceHTML());
            break;
          case Namespace.SVG:
            OpList.replace(op, namespaceSVG());
            break;
          case Namespace.Math:
            OpList.replace(op, namespaceMath());
            break;
        }
        break;
      case OpKind.Statement:
        break;
      default:
        throw new Error(`AssertionError: Unsupported reification of create op ${OpKind[op.kind]}`);
    }
  }
}
function reifyUpdateOperations(_unit, ops) {
  for (const op of ops) {
    transformExpressionsInOp(op, reifyIrExpression, VisitorContextFlag.None);
    switch (op.kind) {
      case OpKind.Advance:
        OpList.replace(op, advance(op.delta, op.sourceSpan));
        break;
      case OpKind.Property:
        if (op.expression instanceof Interpolation) {
          OpList.replace(op, propertyInterpolate(op.name, op.expression.strings, op.expression.expressions, op.sanitizer, op.sourceSpan));
        } else {
          OpList.replace(op, property(op.name, op.expression, op.sanitizer, op.sourceSpan));
        }
        break;
      case OpKind.StyleProp:
        if (op.expression instanceof Interpolation) {
          OpList.replace(op, stylePropInterpolate(op.name, op.expression.strings, op.expression.expressions, op.unit));
        } else {
          OpList.replace(op, styleProp(op.name, op.expression, op.unit));
        }
        break;
      case OpKind.ClassProp:
        OpList.replace(op, classProp(op.name, op.expression));
        break;
      case OpKind.StyleMap:
        if (op.expression instanceof Interpolation) {
          OpList.replace(op, styleMapInterpolate(op.expression.strings, op.expression.expressions));
        } else {
          OpList.replace(op, styleMap(op.expression));
        }
        break;
      case OpKind.ClassMap:
        if (op.expression instanceof Interpolation) {
          OpList.replace(op, classMapInterpolate(op.expression.strings, op.expression.expressions));
        } else {
          OpList.replace(op, classMap(op.expression));
        }
        break;
      case OpKind.InterpolateText:
        OpList.replace(op, textInterpolate(op.interpolation.strings, op.interpolation.expressions, op.sourceSpan));
        break;
      case OpKind.Attribute:
        if (op.expression instanceof Interpolation) {
          OpList.replace(op, attributeInterpolate(op.name, op.expression.strings, op.expression.expressions, op.sanitizer));
        } else {
          OpList.replace(op, attribute(op.name, op.expression, op.sanitizer));
        }
        break;
      case OpKind.HostProperty:
        if (op.expression instanceof Interpolation) {
          throw new Error("not yet handled");
        } else {
          OpList.replace(op, hostProperty(op.name, op.expression));
        }
        break;
      case OpKind.Variable:
        if (op.variable.name === null) {
          throw new Error(`AssertionError: unnamed variable ${op.xref}`);
        }
        OpList.replace(op, createStatementOp(new DeclareVarStmt(op.variable.name, op.initializer, void 0, StmtModifier.Final)));
        break;
      case OpKind.Statement:
        break;
      default:
        throw new Error(`AssertionError: Unsupported reification of update op ${OpKind[op.kind]}`);
    }
  }
}
function reifyIrExpression(expr) {
  if (!isIrExpression(expr)) {
    return expr;
  }
  switch (expr.kind) {
    case ExpressionKind.NextContext:
      return nextContext(expr.steps);
    case ExpressionKind.Reference:
      return reference(expr.slot + 1 + expr.offset);
    case ExpressionKind.LexicalRead:
      throw new Error(`AssertionError: unresolved LexicalRead of ${expr.name}`);
    case ExpressionKind.RestoreView:
      if (typeof expr.view === "number") {
        throw new Error(`AssertionError: unresolved RestoreView`);
      }
      return restoreView(expr.view);
    case ExpressionKind.ResetView:
      return resetView(expr.expr);
    case ExpressionKind.GetCurrentView:
      return getCurrentView();
    case ExpressionKind.ReadVariable:
      if (expr.name === null) {
        throw new Error(`Read of unnamed variable ${expr.xref}`);
      }
      return variable(expr.name);
    case ExpressionKind.ReadTemporaryExpr:
      if (expr.name === null) {
        throw new Error(`Read of unnamed temporary ${expr.xref}`);
      }
      return variable(expr.name);
    case ExpressionKind.AssignTemporaryExpr:
      if (expr.name === null) {
        throw new Error(`Assign of unnamed temporary ${expr.xref}`);
      }
      return variable(expr.name).set(expr.expr);
    case ExpressionKind.PureFunctionExpr:
      if (expr.fn === null) {
        throw new Error(`AssertionError: expected PureFunctions to have been extracted`);
      }
      return pureFunction(expr.varOffset, expr.fn, expr.args);
    case ExpressionKind.PureFunctionParameterExpr:
      throw new Error(`AssertionError: expected PureFunctionParameterExpr to have been extracted`);
    case ExpressionKind.PipeBinding:
      return pipeBind(expr.slot, expr.varOffset, expr.args);
    case ExpressionKind.PipeBindingVariadic:
      return pipeBindV(expr.slot, expr.varOffset, expr.args);
    case ExpressionKind.SanitizerExpr:
      return importExpr(sanitizerIdentifierMap.get(expr.fn));
    default:
      throw new Error(`AssertionError: Unsupported reification of ir.Expression kind: ${ExpressionKind[expr.kind]}`);
  }
}
function reifyListenerHandler(unit, name, handlerOps, consumesDollarEvent) {
  reifyUpdateOperations(unit, handlerOps);
  const handlerStmts = [];
  for (const op of handlerOps) {
    if (op.kind !== OpKind.Statement) {
      throw new Error(`AssertionError: expected reified statements, but found op ${OpKind[op.kind]}`);
    }
    handlerStmts.push(op.statement);
  }
  const params = [];
  if (consumesDollarEvent) {
    params.push(new FnParam("$event"));
  }
  return fn(params, handlerStmts, void 0, void 0, name);
}
function phaseRemoveEmptyBindings(job) {
  for (const unit of job.units) {
    for (const op of unit.update) {
      switch (op.kind) {
        case OpKind.Attribute:
        case OpKind.Binding:
        case OpKind.ClassProp:
        case OpKind.ClassMap:
        case OpKind.Property:
        case OpKind.StyleProp:
        case OpKind.StyleMap:
          if (op.expression instanceof EmptyExpr) {
            OpList.remove(op);
          }
          break;
      }
    }
  }
}
function phaseResolveContexts(cpl) {
  for (const unit of cpl.units) {
    processLexicalScope$1(unit, unit.create);
    processLexicalScope$1(unit, unit.update);
  }
}
function processLexicalScope$1(view, ops) {
  const scope = /* @__PURE__ */ new Map();
  scope.set(view.xref, variable("ctx"));
  for (const op of ops) {
    switch (op.kind) {
      case OpKind.Variable:
        switch (op.variable.kind) {
          case SemanticVariableKind.Context:
            scope.set(op.variable.view, new ReadVariableExpr(op.xref));
            break;
        }
        break;
      case OpKind.Listener:
        processLexicalScope$1(view, op.handlerOps);
        break;
    }
  }
  for (const op of ops) {
    transformExpressionsInOp(op, (expr) => {
      if (expr instanceof ContextExpr) {
        if (!scope.has(expr.view)) {
          throw new Error(`No context found for reference to view ${expr.view} from view ${view.xref}`);
        }
        return scope.get(expr.view);
      } else {
        return expr;
      }
    }, VisitorContextFlag.None);
  }
}
function phaseResolveDollarEvent(cpl) {
  for (const [_, view] of cpl.views) {
    resolveDollarEvent(view, view.create);
    resolveDollarEvent(view, view.update);
  }
}
function resolveDollarEvent(view, ops) {
  for (const op of ops) {
    if (op.kind === OpKind.Listener) {
      transformExpressionsInOp(op, (expr) => {
        if (expr instanceof LexicalReadExpr && expr.name === "$event") {
          op.consumesDollarEvent = true;
          return new ReadVarExpr(expr.name);
        }
        return expr;
      }, VisitorContextFlag.InChildOperation);
    }
  }
}
function phaseResolveNames(cpl) {
  for (const unit of cpl.units) {
    processLexicalScope(unit, unit.create, null);
    processLexicalScope(unit, unit.update, null);
  }
}
function processLexicalScope(unit, ops, savedView) {
  const scope = /* @__PURE__ */ new Map();
  for (const op of ops) {
    switch (op.kind) {
      case OpKind.Variable:
        switch (op.variable.kind) {
          case SemanticVariableKind.Identifier:
            if (scope.has(op.variable.identifier)) {
              continue;
            }
            scope.set(op.variable.identifier, op.xref);
            break;
          case SemanticVariableKind.SavedView:
            savedView = {
              view: op.variable.view,
              variable: op.xref
            };
            break;
        }
        break;
      case OpKind.Listener:
        processLexicalScope(unit, op.handlerOps, savedView);
        break;
    }
  }
  for (const op of ops) {
    if (op.kind == OpKind.Listener) {
      continue;
    }
    transformExpressionsInOp(op, (expr, flags) => {
      if (expr instanceof LexicalReadExpr) {
        if (scope.has(expr.name)) {
          return new ReadVariableExpr(scope.get(expr.name));
        } else {
          return new ReadPropExpr(new ContextExpr(unit.job.root.xref), expr.name);
        }
      } else if (expr instanceof RestoreViewExpr && typeof expr.view === "number") {
        if (savedView === null || savedView.view !== expr.view) {
          throw new Error(`AssertionError: no saved view ${expr.view} from view ${unit.xref}`);
        }
        expr.view = new ReadVariableExpr(savedView.variable);
        return expr;
      } else {
        return expr;
      }
    }, VisitorContextFlag.None);
  }
  for (const op of ops) {
    visitExpressionsInOp(op, (expr) => {
      if (expr instanceof LexicalReadExpr) {
        throw new Error(`AssertionError: no lexical reads should remain, but found read of ${expr.name}`);
      }
    });
  }
}
var sanitizers = /* @__PURE__ */ new Map([
  [SecurityContext.HTML, SanitizerFn.Html],
  [SecurityContext.SCRIPT, SanitizerFn.Script],
  [SecurityContext.STYLE, SanitizerFn.Style],
  [SecurityContext.URL, SanitizerFn.Url],
  [SecurityContext.RESOURCE_URL, SanitizerFn.ResourceUrl]
]);
function phaseResolveSanitizers(cpl) {
  for (const [_, view] of cpl.views) {
    const elements = getElementsByXrefId(view);
    let sanitizerFn;
    for (const op of view.update) {
      switch (op.kind) {
        case OpKind.Property:
        case OpKind.Attribute:
          sanitizerFn = sanitizers.get(op.securityContext) || null;
          op.sanitizer = sanitizerFn ? new SanitizerExpr(sanitizerFn) : null;
          if (op.sanitizer === null) {
            const ownerOp = elements.get(op.target);
            if (ownerOp === void 0) {
              throw Error("Property should have an element-like owner");
            }
            if (isIframeElement$1(ownerOp) && isIframeSecuritySensitiveAttr(op.name)) {
              op.sanitizer = new SanitizerExpr(SanitizerFn.IframeAttribute);
            }
          }
          break;
      }
    }
  }
}
function isIframeElement$1(op) {
  return (op.kind === OpKind.Element || op.kind === OpKind.ElementStart) && op.tag.toLowerCase() === "iframe";
}
function phaseSaveRestoreView(cpl) {
  for (const view of cpl.views.values()) {
    view.create.prepend([
      createVariableOp(view.job.allocateXrefId(), {
        kind: SemanticVariableKind.SavedView,
        name: null,
        view: view.xref
      }, new GetCurrentViewExpr())
    ]);
    for (const op of view.create) {
      if (op.kind !== OpKind.Listener) {
        continue;
      }
      let needsRestoreView = view !== cpl.root;
      if (!needsRestoreView) {
        for (const handlerOp of op.handlerOps) {
          visitExpressionsInOp(handlerOp, (expr) => {
            if (expr instanceof ReferenceExpr) {
              needsRestoreView = true;
            }
          });
        }
      }
      if (needsRestoreView) {
        addSaveRestoreViewOperationToListener(view, op);
      }
    }
  }
}
function addSaveRestoreViewOperationToListener(view, op) {
  op.handlerOps.prepend([
    createVariableOp(view.job.allocateXrefId(), {
      kind: SemanticVariableKind.Context,
      name: null,
      view: view.xref
    }, new RestoreViewExpr(view.xref))
  ]);
  for (const handlerOp of op.handlerOps) {
    if (handlerOp.kind === OpKind.Statement && handlerOp.statement instanceof ReturnStatement) {
      handlerOp.statement.value = new ResetViewExpr(handlerOp.statement.value);
    }
  }
}
function phaseSlotAllocation(cpl) {
  const slotMap = /* @__PURE__ */ new Map();
  for (const [_, view] of cpl.views) {
    let slotCount = 0;
    for (const op of view.create) {
      if (!hasConsumesSlotTrait(op)) {
        continue;
      }
      op.slot = slotCount;
      slotMap.set(op.xref, op.slot);
      slotCount += op.numSlotsUsed;
    }
    view.decls = slotCount;
  }
  for (const [_, view] of cpl.views) {
    for (const op of view.ops()) {
      if (op.kind === OpKind.Template) {
        const childView = cpl.views.get(op.xref);
        op.decls = childView.decls;
      }
      if (hasUsesSlotIndexTrait(op) && op.slot === null) {
        if (!slotMap.has(op.target)) {
          throw new Error(`AssertionError: no slot allocated for ${OpKind[op.kind]} target ${op.target}`);
        }
        op.slot = slotMap.get(op.target);
      }
      visitExpressionsInOp(op, (expr) => {
        if (!isIrExpression(expr)) {
          return;
        }
        if (!hasUsesSlotIndexTrait(expr) || expr.slot !== null) {
          return;
        }
        if (!slotMap.has(expr.target)) {
          throw new Error(`AssertionError: no slot allocated for ${expr.constructor.name} target ${expr.target}`);
        }
        expr.slot = slotMap.get(expr.target);
      });
    }
  }
}
function phaseStyleBindingSpecialization(cpl) {
  for (const unit of cpl.units) {
    for (const op of unit.update) {
      if (op.kind !== OpKind.Binding) {
        continue;
      }
      switch (op.bindingKind) {
        case BindingKind.ClassName:
          if (op.expression instanceof Interpolation) {
            throw new Error(`Unexpected interpolation in ClassName binding`);
          }
          OpList.replace(op, createClassPropOp(op.target, op.name, op.expression, op.sourceSpan));
          break;
        case BindingKind.StyleProperty:
          OpList.replace(op, createStylePropOp(op.target, op.name, op.expression, op.unit, op.sourceSpan));
          break;
        case BindingKind.Property:
        case BindingKind.Template:
          if (op.name === "style") {
            OpList.replace(op, createStyleMapOp(op.target, op.expression, op.sourceSpan));
          } else if (op.name === "class") {
            OpList.replace(op, createClassMapOp(op.target, op.expression, op.sourceSpan));
          }
          break;
      }
    }
  }
}
function phaseTemporaryVariables(cpl) {
  for (const unit of cpl.units) {
    let opCount = 0;
    let generatedStatements = [];
    for (const op of unit.ops()) {
      const finalReads = /* @__PURE__ */ new Map();
      visitExpressionsInOp(op, (expr) => {
        if (expr instanceof ReadTemporaryExpr) {
          finalReads.set(expr.xref, expr);
        }
      });
      let count = 0;
      const assigned = /* @__PURE__ */ new Set();
      const released = /* @__PURE__ */ new Set();
      const defs = /* @__PURE__ */ new Map();
      visitExpressionsInOp(op, (expr) => {
        if (expr instanceof AssignTemporaryExpr) {
          if (!assigned.has(expr.xref)) {
            assigned.add(expr.xref);
            defs.set(expr.xref, `tmp_${opCount}_${count++}`);
          }
          assignName(defs, expr);
        } else if (expr instanceof ReadTemporaryExpr) {
          if (finalReads.get(expr.xref) === expr) {
            released.add(expr.xref);
            count--;
          }
          assignName(defs, expr);
        }
      });
      generatedStatements.push(...Array.from(new Set(defs.values())).map((name) => createStatementOp(new DeclareVarStmt(name))));
      opCount++;
    }
    unit.update.prepend(generatedStatements);
  }
}
function assignName(names, expr) {
  const name = names.get(expr.xref);
  if (name === void 0) {
    throw new Error(`Found xref with unassigned name: ${expr.xref}`);
  }
  expr.name = name;
}
function phaseVariableOptimization(job) {
  for (const unit of job.units) {
    optimizeVariablesInOpList(unit.create, job.compatibility);
    optimizeVariablesInOpList(unit.update, job.compatibility);
    for (const op of unit.create) {
      if (op.kind === OpKind.Listener) {
        optimizeVariablesInOpList(op.handlerOps, job.compatibility);
      }
    }
  }
}
var Fence;
(function(Fence2) {
  Fence2[Fence2["None"] = 0] = "None";
  Fence2[Fence2["ViewContextRead"] = 1] = "ViewContextRead";
  Fence2[Fence2["ViewContextWrite"] = 3] = "ViewContextWrite";
  Fence2[Fence2["SideEffectful"] = 4] = "SideEffectful";
})(Fence || (Fence = {}));
function optimizeVariablesInOpList(ops, compatibility) {
  const varDecls = /* @__PURE__ */ new Map();
  const varUsages = /* @__PURE__ */ new Map();
  const varRemoteUsages = /* @__PURE__ */ new Set();
  const opMap = /* @__PURE__ */ new Map();
  for (const op of ops) {
    if (op.kind === OpKind.Variable) {
      if (varDecls.has(op.xref) || varUsages.has(op.xref)) {
        throw new Error(`Should not see two declarations of the same variable: ${op.xref}`);
      }
      varDecls.set(op.xref, op);
      varUsages.set(op.xref, 0);
    }
    opMap.set(op, collectOpInfo(op));
    countVariableUsages(op, varUsages, varRemoteUsages);
  }
  let contextIsUsed = false;
  for (const op of ops.reversed()) {
    const opInfo = opMap.get(op);
    if (op.kind === OpKind.Variable && varUsages.get(op.xref) === 0) {
      if (contextIsUsed && opInfo.fences & Fence.ViewContextWrite || opInfo.fences & Fence.SideEffectful) {
        const stmtOp = createStatementOp(op.initializer.toStmt());
        opMap.set(stmtOp, opInfo);
        OpList.replace(op, stmtOp);
      } else {
        uncountVariableUsages(op, varUsages);
        OpList.remove(op);
      }
      opMap.delete(op);
      varDecls.delete(op.xref);
      varUsages.delete(op.xref);
      continue;
    }
    if (opInfo.fences & Fence.ViewContextRead) {
      contextIsUsed = true;
    }
  }
  const toInline = [];
  for (const [id, count] of varUsages) {
    if (count !== 1) {
      continue;
    }
    if (varRemoteUsages.has(id)) {
      continue;
    }
    toInline.push(id);
  }
  let candidate;
  while (candidate = toInline.pop()) {
    const decl = varDecls.get(candidate);
    const varInfo = opMap.get(decl);
    for (let targetOp = decl.next; targetOp.kind !== OpKind.ListEnd; targetOp = targetOp.next) {
      const opInfo = opMap.get(targetOp);
      if (opInfo.variablesUsed.has(candidate)) {
        if (compatibility === CompatibilityMode.TemplateDefinitionBuilder && !allowConservativeInlining(decl, targetOp)) {
          break;
        }
        if (tryInlineVariableInitializer(candidate, decl.initializer, targetOp, varInfo.fences)) {
          opInfo.variablesUsed.delete(candidate);
          for (const id of varInfo.variablesUsed) {
            opInfo.variablesUsed.add(id);
          }
          opInfo.fences |= varInfo.fences;
          varDecls.delete(candidate);
          varUsages.delete(candidate);
          opMap.delete(decl);
          OpList.remove(decl);
        }
        break;
      }
      if (!safeToInlinePastFences(opInfo.fences, varInfo.fences)) {
        break;
      }
    }
  }
}
function fencesForIrExpression(expr) {
  switch (expr.kind) {
    case ExpressionKind.NextContext:
      return Fence.ViewContextWrite;
    case ExpressionKind.RestoreView:
      return Fence.ViewContextWrite | Fence.SideEffectful;
    case ExpressionKind.Reference:
      return Fence.ViewContextRead;
    default:
      return Fence.None;
  }
}
function collectOpInfo(op) {
  let fences = Fence.None;
  const variablesUsed = /* @__PURE__ */ new Set();
  visitExpressionsInOp(op, (expr) => {
    if (!isIrExpression(expr)) {
      return;
    }
    switch (expr.kind) {
      case ExpressionKind.ReadVariable:
        variablesUsed.add(expr.xref);
        break;
      default:
        fences |= fencesForIrExpression(expr);
    }
  });
  return { fences, variablesUsed };
}
function countVariableUsages(op, varUsages, varRemoteUsage) {
  visitExpressionsInOp(op, (expr, flags) => {
    if (!isIrExpression(expr)) {
      return;
    }
    if (expr.kind !== ExpressionKind.ReadVariable) {
      return;
    }
    const count = varUsages.get(expr.xref);
    if (count === void 0) {
      return;
    }
    varUsages.set(expr.xref, count + 1);
    if (flags & VisitorContextFlag.InChildOperation) {
      varRemoteUsage.add(expr.xref);
    }
  });
}
function uncountVariableUsages(op, varUsages) {
  visitExpressionsInOp(op, (expr) => {
    if (!isIrExpression(expr)) {
      return;
    }
    if (expr.kind !== ExpressionKind.ReadVariable) {
      return;
    }
    const count = varUsages.get(expr.xref);
    if (count === void 0) {
      return;
    } else if (count === 0) {
      throw new Error(`Inaccurate variable count: ${expr.xref} - found another read but count is already 0`);
    }
    varUsages.set(expr.xref, count - 1);
  });
}
function safeToInlinePastFences(fences, declFences) {
  if (fences & Fence.ViewContextWrite) {
    if (declFences & Fence.ViewContextRead) {
      return false;
    }
  } else if (fences & Fence.ViewContextRead) {
    if (declFences & Fence.ViewContextWrite) {
      return false;
    }
  }
  return true;
}
function tryInlineVariableInitializer(id, initializer, target, declFences) {
  let inlined = false;
  let inliningAllowed = true;
  transformExpressionsInOp(target, (expr, flags) => {
    if (!isIrExpression(expr)) {
      return expr;
    }
    if (inlined || !inliningAllowed) {
      return expr;
    } else if (flags & VisitorContextFlag.InChildOperation && declFences & Fence.ViewContextRead) {
      return expr;
    }
    switch (expr.kind) {
      case ExpressionKind.ReadVariable:
        if (expr.xref === id) {
          inlined = true;
          return initializer;
        }
        break;
      default:
        const exprFences = fencesForIrExpression(expr);
        inliningAllowed = inliningAllowed && safeToInlinePastFences(exprFences, declFences);
        break;
    }
    return expr;
  }, VisitorContextFlag.None);
  return inlined;
}
function allowConservativeInlining(decl, target) {
  switch (decl.variable.kind) {
    case SemanticVariableKind.Identifier:
      return false;
    case SemanticVariableKind.Context:
      return target.kind === OpKind.Variable;
    default:
      return true;
  }
}
function transformTemplate(job) {
  phaseNamespace(job);
  phaseStyleBindingSpecialization(job);
  phaseBindingSpecialization(job);
  phaseAttributeExtraction(job);
  phaseRemoveEmptyBindings(job);
  phaseNoListenersOnTemplates(job);
  phasePipeCreation(job);
  phasePipeVariadic(job);
  phasePureLiteralStructures(job);
  phaseGenerateVariables(job);
  phaseSaveRestoreView(job);
  phaseFindAnyCasts(job);
  phaseResolveDollarEvent(job);
  phaseResolveNames(job);
  phaseResolveContexts(job);
  phaseResolveSanitizers(job);
  phaseLocalRefs(job);
  phaseConstCollection(job);
  phaseNullishCoalescing(job);
  phaseExpandSafeReads(job);
  phaseTemporaryVariables(job);
  phaseSlotAllocation(job);
  phaseVarCounting(job);
  phaseGenerateAdvance(job);
  phaseVariableOptimization(job);
  phaseNaming(job);
  phaseMergeNextContext(job);
  phaseNgContainer(job);
  phaseEmptyElements(job);
  phaseNonbindable(job);
  phasePureFunctionExtraction(job);
  phaseAlignPipeVariadicVarOffset(job);
  phasePropertyOrdering(job);
  phaseReify(job);
  phaseChaining(job);
}
function transformHostBinding(job) {
  phaseHostStylePropertyParsing(job);
  phaseStyleBindingSpecialization(job);
  phaseBindingSpecialization(job);
  phasePureLiteralStructures(job);
  phaseNullishCoalescing(job);
  phaseExpandSafeReads(job);
  phaseTemporaryVariables(job);
  phaseVarCounting(job);
  phaseVariableOptimization(job);
  phaseResolveNames(job);
  phaseResolveContexts(job);
  phaseNaming(job);
  phasePureFunctionExtraction(job);
  phasePropertyOrdering(job);
  phaseReify(job);
  phaseChaining(job);
}
function emitTemplateFn(tpl, pool) {
  const rootFn = emitView(tpl.root);
  emitChildViews(tpl.root, pool);
  return rootFn;
}
function emitChildViews(parent, pool) {
  for (const view of parent.job.views.values()) {
    if (view.parent !== parent.xref) {
      continue;
    }
    emitChildViews(view, pool);
    const viewFn = emitView(view);
    pool.statements.push(viewFn.toDeclStmt(viewFn.name));
  }
}
function emitView(view) {
  if (view.fnName === null) {
    throw new Error(`AssertionError: view ${view.xref} is unnamed`);
  }
  const createStatements = [];
  for (const op of view.create) {
    if (op.kind !== OpKind.Statement) {
      throw new Error(`AssertionError: expected all create ops to have been compiled, but got ${OpKind[op.kind]}`);
    }
    createStatements.push(op.statement);
  }
  const updateStatements = [];
  for (const op of view.update) {
    if (op.kind !== OpKind.Statement) {
      throw new Error(`AssertionError: expected all update ops to have been compiled, but got ${OpKind[op.kind]}`);
    }
    updateStatements.push(op.statement);
  }
  const createCond = maybeGenerateRfBlock(1, createStatements);
  const updateCond = maybeGenerateRfBlock(2, updateStatements);
  return fn(
    [
      new FnParam("rf"),
      new FnParam("ctx")
    ],
    [
      ...createCond,
      ...updateCond
    ],
    /* type */
    void 0,
    /* sourceSpan */
    void 0,
    view.fnName
  );
}
function maybeGenerateRfBlock(flag, statements) {
  if (statements.length === 0) {
    return [];
  }
  return [
    ifStmt(new BinaryOperatorExpr(BinaryOperator.BitwiseAnd, variable("rf"), literal(flag)), statements)
  ];
}
function emitHostBindingFunction(job) {
  if (job.fnName === null) {
    throw new Error(`AssertionError: host binding function is unnamed`);
  }
  const createStatements = [];
  for (const op of job.create) {
    if (op.kind !== OpKind.Statement) {
      throw new Error(`AssertionError: expected all create ops to have been compiled, but got ${OpKind[op.kind]}`);
    }
    createStatements.push(op.statement);
  }
  const updateStatements = [];
  for (const op of job.update) {
    if (op.kind !== OpKind.Statement) {
      throw new Error(`AssertionError: expected all update ops to have been compiled, but got ${OpKind[op.kind]}`);
    }
    updateStatements.push(op.statement);
  }
  if (createStatements.length === 0 && updateStatements.length === 0) {
    return null;
  }
  const createCond = maybeGenerateRfBlock(1, createStatements);
  const updateCond = maybeGenerateRfBlock(2, updateStatements);
  return fn(
    [
      new FnParam("rf"),
      new FnParam("ctx")
    ],
    [
      ...createCond,
      ...updateCond
    ],
    /* type */
    void 0,
    /* sourceSpan */
    void 0,
    job.fnName
  );
}
var compatibilityMode = CompatibilityMode.TemplateDefinitionBuilder;
function ingestComponent(componentName, template2, constantPool) {
  const cpl = new ComponentCompilationJob(componentName, constantPool, compatibilityMode);
  ingestNodes(cpl.root, template2);
  return cpl;
}
function ingestHostBinding(input, bindingParser, constantPool) {
  const job = new HostBindingCompilationJob(input.componentName, constantPool, compatibilityMode);
  for (const property2 of input.properties ?? []) {
    ingestHostProperty(job, property2);
  }
  for (const event of input.events ?? []) {
    ingestHostEvent(job, event);
  }
  return job;
}
function ingestHostProperty(job, property2) {
  let expression;
  const ast = property2.expression.ast;
  if (ast instanceof Interpolation$1) {
    expression = new Interpolation(ast.strings, ast.expressions.map((expr) => convertAst(expr, job)));
  } else {
    expression = convertAst(ast, job);
  }
  let bindingKind = BindingKind.Property;
  if (property2.name.startsWith("attr.")) {
    property2.name = property2.name.substring("attr.".length);
    bindingKind = BindingKind.Attribute;
  }
  job.update.push(createBindingOp(job.root.xref, bindingKind, property2.name, expression, null, SecurityContext.NONE, false, property2.sourceSpan));
}
function ingestHostEvent(job, event) {
}
function ingestNodes(view, template2) {
  for (const node of template2) {
    if (node instanceof Element$1) {
      ingestElement(view, node);
    } else if (node instanceof Template) {
      ingestTemplate(view, node);
    } else if (node instanceof Text$3) {
      ingestText(view, node);
    } else if (node instanceof BoundText) {
      ingestBoundText(view, node);
    } else {
      throw new Error(`Unsupported template node: ${node.constructor.name}`);
    }
  }
}
function ingestElement(view, element2) {
  const staticAttributes = {};
  for (const attr of element2.attributes) {
    staticAttributes[attr.name] = attr.value;
  }
  const id = view.job.allocateXrefId();
  const [namespaceKey, elementName] = splitNsName(element2.name);
  const startOp = createElementStartOp(elementName, id, namespaceForKey(namespaceKey), element2.startSourceSpan);
  view.create.push(startOp);
  ingestBindings(view, startOp, element2);
  ingestReferences(startOp, element2);
  ingestNodes(view, element2.children);
  view.create.push(createElementEndOp(id, element2.endSourceSpan));
}
function ingestTemplate(view, tmpl) {
  const childView = view.job.allocateView(view.xref);
  let tagNameWithoutNamespace = tmpl.tagName;
  let namespacePrefix = "";
  if (tmpl.tagName) {
    [namespacePrefix, tagNameWithoutNamespace] = splitNsName(tmpl.tagName);
  }
  const tplOp = createTemplateOp(childView.xref, tagNameWithoutNamespace ?? "ng-template", namespaceForKey(namespacePrefix), tmpl.startSourceSpan);
  view.create.push(tplOp);
  ingestBindings(view, tplOp, tmpl);
  ingestReferences(tplOp, tmpl);
  ingestNodes(childView, tmpl.children);
  for (const { name, value } of tmpl.variables) {
    childView.contextVariables.set(name, value);
  }
}
function ingestText(view, text2) {
  view.create.push(createTextOp(view.job.allocateXrefId(), text2.value, text2.sourceSpan));
}
function ingestBoundText(view, text2) {
  let value = text2.value;
  if (value instanceof ASTWithSource) {
    value = value.ast;
  }
  if (!(value instanceof Interpolation$1)) {
    throw new Error(`AssertionError: expected Interpolation for BoundText node, got ${value.constructor.name}`);
  }
  const textXref = view.job.allocateXrefId();
  view.create.push(createTextOp(textXref, "", text2.sourceSpan));
  view.update.push(createInterpolateTextOp(textXref, new Interpolation(value.strings, value.expressions.map((expr) => convertAst(expr, view.job))), text2.sourceSpan));
}
function convertAst(ast, cpl) {
  if (ast instanceof ASTWithSource) {
    return convertAst(ast.ast, cpl);
  } else if (ast instanceof PropertyRead) {
    if (ast.receiver instanceof ImplicitReceiver && !(ast.receiver instanceof ThisReceiver)) {
      return new LexicalReadExpr(ast.name);
    } else {
      return new ReadPropExpr(convertAst(ast.receiver, cpl), ast.name);
    }
  } else if (ast instanceof PropertyWrite) {
    return new WritePropExpr(convertAst(ast.receiver, cpl), ast.name, convertAst(ast.value, cpl));
  } else if (ast instanceof KeyedWrite) {
    return new WriteKeyExpr(convertAst(ast.receiver, cpl), convertAst(ast.key, cpl), convertAst(ast.value, cpl));
  } else if (ast instanceof Call) {
    if (ast.receiver instanceof ImplicitReceiver) {
      throw new Error(`Unexpected ImplicitReceiver`);
    } else {
      return new InvokeFunctionExpr(convertAst(ast.receiver, cpl), ast.args.map((arg) => convertAst(arg, cpl)));
    }
  } else if (ast instanceof LiteralPrimitive) {
    return literal(ast.value);
  } else if (ast instanceof Binary) {
    const operator = BINARY_OPERATORS.get(ast.operation);
    if (operator === void 0) {
      throw new Error(`AssertionError: unknown binary operator ${ast.operation}`);
    }
    return new BinaryOperatorExpr(operator, convertAst(ast.left, cpl), convertAst(ast.right, cpl));
  } else if (ast instanceof ThisReceiver) {
    return new ContextExpr(cpl.root.xref);
  } else if (ast instanceof KeyedRead) {
    return new ReadKeyExpr(convertAst(ast.receiver, cpl), convertAst(ast.key, cpl));
  } else if (ast instanceof Chain) {
    throw new Error(`AssertionError: Chain in unknown context`);
  } else if (ast instanceof LiteralMap) {
    const entries = ast.keys.map((key, idx) => {
      const value = ast.values[idx];
      return new LiteralMapEntry(key.key, convertAst(value, cpl), key.quoted);
    });
    return new LiteralMapExpr(entries);
  } else if (ast instanceof LiteralArray) {
    return new LiteralArrayExpr(ast.expressions.map((expr) => convertAst(expr, cpl)));
  } else if (ast instanceof Conditional) {
    return new ConditionalExpr(convertAst(ast.condition, cpl), convertAst(ast.trueExp, cpl), convertAst(ast.falseExp, cpl));
  } else if (ast instanceof NonNullAssert) {
    return convertAst(ast.expression, cpl);
  } else if (ast instanceof BindingPipe) {
    return new PipeBindingExpr(cpl.allocateXrefId(), ast.name, [
      convertAst(ast.exp, cpl),
      ...ast.args.map((arg) => convertAst(arg, cpl))
    ]);
  } else if (ast instanceof SafeKeyedRead) {
    return new SafeKeyedReadExpr(convertAst(ast.receiver, cpl), convertAst(ast.key, cpl));
  } else if (ast instanceof SafePropertyRead) {
    return new SafePropertyReadExpr(convertAst(ast.receiver, cpl), ast.name);
  } else if (ast instanceof SafeCall) {
    return new SafeInvokeFunctionExpr(convertAst(ast.receiver, cpl), ast.args.map((a) => convertAst(a, cpl)));
  } else if (ast instanceof EmptyExpr$1) {
    return new EmptyExpr();
  } else {
    throw new Error(`Unhandled expression type: ${ast.constructor.name}`);
  }
}
function ingestBindings(view, op, element2) {
  if (element2 instanceof Template) {
    for (const attr of element2.templateAttrs) {
      if (attr instanceof TextAttribute) {
        ingestBinding(view, op.xref, attr.name, literal(attr.value), 1, null, SecurityContext.NONE, attr.sourceSpan, true);
      } else {
        ingestBinding(view, op.xref, attr.name, attr.value, attr.type, attr.unit, attr.securityContext, attr.sourceSpan, true);
      }
    }
  }
  for (const attr of element2.attributes) {
    ingestBinding(view, op.xref, attr.name, literal(attr.value), 1, null, SecurityContext.NONE, attr.sourceSpan, false);
  }
  for (const input of element2.inputs) {
    ingestBinding(view, op.xref, input.name, input.value, input.type, input.unit, input.securityContext, input.sourceSpan, false);
  }
  for (const output of element2.outputs) {
    let listenerOp;
    if (output.type === 1) {
      if (output.phase === null) {
        throw Error("Animation listener should have a phase");
      }
      listenerOp = createListenerOpForAnimation(op.xref, output.name, output.phase, op.tag);
    } else {
      listenerOp = createListenerOp(op.xref, output.name, op.tag);
    }
    let inputExprs;
    let handler = output.handler;
    if (handler instanceof ASTWithSource) {
      handler = handler.ast;
    }
    if (handler instanceof Chain) {
      inputExprs = handler.expressions;
    } else {
      inputExprs = [handler];
    }
    if (inputExprs.length === 0) {
      throw new Error("Expected listener to have non-empty expression list.");
    }
    const expressions = inputExprs.map((expr) => convertAst(expr, view.job));
    const returnExpr = expressions.pop();
    for (const expr of expressions) {
      const stmtOp = createStatementOp(new ExpressionStatement(expr));
      listenerOp.handlerOps.push(stmtOp);
    }
    listenerOp.handlerOps.push(createStatementOp(new ReturnStatement(returnExpr)));
    view.create.push(listenerOp);
  }
}
var BINDING_KINDS = /* @__PURE__ */ new Map([
  [0, BindingKind.Property],
  [1, BindingKind.Attribute],
  [2, BindingKind.ClassName],
  [3, BindingKind.StyleProperty],
  [4, BindingKind.Animation]
]);
function ingestBinding(view, xref, name, value, type, unit, securityContext, sourceSpan, isTemplateBinding) {
  if (value instanceof ASTWithSource) {
    value = value.ast;
  }
  let expression;
  if (value instanceof Interpolation$1) {
    expression = new Interpolation(value.strings, value.expressions.map((expr) => convertAst(expr, view.job)));
  } else if (value instanceof AST) {
    expression = convertAst(value, view.job);
  } else {
    expression = value;
  }
  const kind = BINDING_KINDS.get(type);
  view.update.push(createBindingOp(xref, kind, name, expression, unit, securityContext, isTemplateBinding, sourceSpan));
}
function ingestReferences(op, element2) {
  assertIsArray(op.localRefs);
  for (const { name, value } of element2.references) {
    op.localRefs.push({
      name,
      target: value
    });
  }
}
function assertIsArray(value) {
  if (!Array.isArray(value)) {
    throw new Error(`AssertionError: expected an array`);
  }
}
var USE_TEMPLATE_PIPELINE = false;
var IMPORTANT_FLAG = "!important";
var MIN_STYLING_BINDING_SLOTS_REQUIRED = 2;
var StylingBuilder = class {
  constructor(_directiveExpr) {
    this._directiveExpr = _directiveExpr;
    this._hasInitialValues = false;
    this.hasBindings = false;
    this.hasBindingsWithPipes = false;
    this._classMapInput = null;
    this._styleMapInput = null;
    this._singleStyleInputs = null;
    this._singleClassInputs = null;
    this._lastStylingInput = null;
    this._firstStylingInput = null;
    this._stylesIndex = /* @__PURE__ */ new Map();
    this._classesIndex = /* @__PURE__ */ new Map();
    this._initialStyleValues = [];
    this._initialClassValues = [];
  }
  /**
   * Registers a given input to the styling builder to be later used when producing AOT code.
   *
   * The code below will only accept the input if it is somehow tied to styling (whether it be
   * style/class bindings or static style/class attributes).
   */
  registerBoundInput(input) {
    let binding = null;
    let name = input.name;
    switch (input.type) {
      case 0:
        binding = this.registerInputBasedOnName(name, input.value, input.sourceSpan);
        break;
      case 3:
        binding = this.registerStyleInput(name, false, input.value, input.sourceSpan, input.unit);
        break;
      case 2:
        binding = this.registerClassInput(name, false, input.value, input.sourceSpan);
        break;
    }
    return binding ? true : false;
  }
  registerInputBasedOnName(name, expression, sourceSpan) {
    let binding = null;
    const prefix = name.substring(0, 6);
    const isStyle = name === "style" || prefix === "style." || prefix === "style!";
    const isClass = !isStyle && (name === "class" || prefix === "class." || prefix === "class!");
    if (isStyle || isClass) {
      const isMapBased = name.charAt(5) !== ".";
      const property2 = name.slice(isMapBased ? 5 : 6);
      if (isStyle) {
        binding = this.registerStyleInput(property2, isMapBased, expression, sourceSpan);
      } else {
        binding = this.registerClassInput(property2, isMapBased, expression, sourceSpan);
      }
    }
    return binding;
  }
  registerStyleInput(name, isMapBased, value, sourceSpan, suffix) {
    if (isEmptyExpression(value)) {
      return null;
    }
    if (!isCssCustomProperty(name)) {
      name = hyphenate$1(name);
    }
    const { property: property2, hasOverrideFlag, suffix: bindingSuffix } = parseProperty(name);
    suffix = typeof suffix === "string" && suffix.length !== 0 ? suffix : bindingSuffix;
    const entry = { name: property2, suffix, value, sourceSpan, hasOverrideFlag };
    if (isMapBased) {
      this._styleMapInput = entry;
    } else {
      (this._singleStyleInputs = this._singleStyleInputs || []).push(entry);
      registerIntoMap(this._stylesIndex, property2);
    }
    this._lastStylingInput = entry;
    this._firstStylingInput = this._firstStylingInput || entry;
    this._checkForPipes(value);
    this.hasBindings = true;
    return entry;
  }
  registerClassInput(name, isMapBased, value, sourceSpan) {
    if (isEmptyExpression(value)) {
      return null;
    }
    const { property: property2, hasOverrideFlag } = parseProperty(name);
    const entry = { name: property2, value, sourceSpan, hasOverrideFlag, suffix: null };
    if (isMapBased) {
      this._classMapInput = entry;
    } else {
      (this._singleClassInputs = this._singleClassInputs || []).push(entry);
      registerIntoMap(this._classesIndex, property2);
    }
    this._lastStylingInput = entry;
    this._firstStylingInput = this._firstStylingInput || entry;
    this._checkForPipes(value);
    this.hasBindings = true;
    return entry;
  }
  _checkForPipes(value) {
    if (value instanceof ASTWithSource && value.ast instanceof BindingPipe) {
      this.hasBindingsWithPipes = true;
    }
  }
  /**
   * Registers the element's static style string value to the builder.
   *
   * @param value the style string (e.g. `width:100px; height:200px;`)
   */
  registerStyleAttr(value) {
    this._initialStyleValues = parse(value);
    this._hasInitialValues = true;
  }
  /**
   * Registers the element's static class string value to the builder.
   *
   * @param value the className string (e.g. `disabled gold zoom`)
   */
  registerClassAttr(value) {
    this._initialClassValues = value.trim().split(/\s+/g);
    this._hasInitialValues = true;
  }
  /**
   * Appends all styling-related expressions to the provided attrs array.
   *
   * @param attrs an existing array where each of the styling expressions
   * will be inserted into.
   */
  populateInitialStylingAttrs(attrs) {
    if (this._initialClassValues.length) {
      attrs.push(literal(
        1
        /* AttributeMarker.Classes */
      ));
      for (let i = 0; i < this._initialClassValues.length; i++) {
        attrs.push(literal(this._initialClassValues[i]));
      }
    }
    if (this._initialStyleValues.length) {
      attrs.push(literal(
        2
        /* AttributeMarker.Styles */
      ));
      for (let i = 0; i < this._initialStyleValues.length; i += 2) {
        attrs.push(literal(this._initialStyleValues[i]), literal(this._initialStyleValues[i + 1]));
      }
    }
  }
  /**
   * Builds an instruction with all the expressions and parameters for `elementHostAttrs`.
   *
   * The instruction generation code below is used for producing the AOT statement code which is
   * responsible for registering initial styles (within a directive hostBindings' creation block),
   * as well as any of the provided attribute values, to the directive host element.
   */
  assignHostAttrs(attrs, definitionMap) {
    if (this._directiveExpr && (attrs.length || this._hasInitialValues)) {
      this.populateInitialStylingAttrs(attrs);
      definitionMap.set("hostAttrs", literalArr(attrs));
    }
  }
  /**
   * Builds an instruction with all the expressions and parameters for `classMap`.
   *
   * The instruction data will contain all expressions for `classMap` to function
   * which includes the `[class]` expression params.
   */
  buildClassMapInstruction(valueConverter) {
    if (this._classMapInput) {
      return this._buildMapBasedInstruction(valueConverter, true, this._classMapInput);
    }
    return null;
  }
  /**
   * Builds an instruction with all the expressions and parameters for `styleMap`.
   *
   * The instruction data will contain all expressions for `styleMap` to function
   * which includes the `[style]` expression params.
   */
  buildStyleMapInstruction(valueConverter) {
    if (this._styleMapInput) {
      return this._buildMapBasedInstruction(valueConverter, false, this._styleMapInput);
    }
    return null;
  }
  _buildMapBasedInstruction(valueConverter, isClassBased, stylingInput) {
    let totalBindingSlotsRequired = MIN_STYLING_BINDING_SLOTS_REQUIRED;
    const mapValue = stylingInput.value.visit(valueConverter);
    let reference2;
    if (mapValue instanceof Interpolation$1) {
      totalBindingSlotsRequired += mapValue.expressions.length;
      reference2 = isClassBased ? getClassMapInterpolationExpression(mapValue) : getStyleMapInterpolationExpression(mapValue);
    } else {
      reference2 = isClassBased ? Identifiers.classMap : Identifiers.styleMap;
    }
    return {
      reference: reference2,
      calls: [{
        supportsInterpolation: true,
        sourceSpan: stylingInput.sourceSpan,
        allocateBindingSlots: totalBindingSlotsRequired,
        params: (convertFn) => {
          const convertResult = convertFn(mapValue);
          const params = Array.isArray(convertResult) ? convertResult : [convertResult];
          return params;
        }
      }]
    };
  }
  _buildSingleInputs(reference2, inputs, valueConverter, getInterpolationExpressionFn, isClassBased) {
    const instructions = [];
    inputs.forEach((input) => {
      const previousInstruction = instructions[instructions.length - 1];
      const value = input.value.visit(valueConverter);
      let referenceForCall = reference2;
      let totalBindingSlotsRequired = MIN_STYLING_BINDING_SLOTS_REQUIRED;
      if (value instanceof Interpolation$1) {
        totalBindingSlotsRequired += value.expressions.length;
        if (getInterpolationExpressionFn) {
          referenceForCall = getInterpolationExpressionFn(value);
        }
      }
      const call2 = {
        sourceSpan: input.sourceSpan,
        allocateBindingSlots: totalBindingSlotsRequired,
        supportsInterpolation: !!getInterpolationExpressionFn,
        params: (convertFn) => {
          const params = [];
          params.push(literal(input.name));
          const convertResult = convertFn(value);
          if (Array.isArray(convertResult)) {
            params.push(...convertResult);
          } else {
            params.push(convertResult);
          }
          if (!isClassBased && input.suffix !== null) {
            params.push(literal(input.suffix));
          }
          return params;
        }
      };
      if (previousInstruction && previousInstruction.reference === referenceForCall) {
        previousInstruction.calls.push(call2);
      } else {
        instructions.push({ reference: referenceForCall, calls: [call2] });
      }
    });
    return instructions;
  }
  _buildClassInputs(valueConverter) {
    if (this._singleClassInputs) {
      return this._buildSingleInputs(Identifiers.classProp, this._singleClassInputs, valueConverter, null, true);
    }
    return [];
  }
  _buildStyleInputs(valueConverter) {
    if (this._singleStyleInputs) {
      return this._buildSingleInputs(Identifiers.styleProp, this._singleStyleInputs, valueConverter, getStylePropInterpolationExpression, false);
    }
    return [];
  }
  /**
   * Constructs all instructions which contain the expressions that will be placed
   * into the update block of a template function or a directive hostBindings function.
   */
  buildUpdateLevelInstructions(valueConverter) {
    const instructions = [];
    if (this.hasBindings) {
      const styleMapInstruction = this.buildStyleMapInstruction(valueConverter);
      if (styleMapInstruction) {
        instructions.push(styleMapInstruction);
      }
      const classMapInstruction = this.buildClassMapInstruction(valueConverter);
      if (classMapInstruction) {
        instructions.push(classMapInstruction);
      }
      instructions.push(...this._buildStyleInputs(valueConverter));
      instructions.push(...this._buildClassInputs(valueConverter));
    }
    return instructions;
  }
};
function registerIntoMap(map, key) {
  if (!map.has(key)) {
    map.set(key, map.size);
  }
}
function parseProperty(name) {
  let hasOverrideFlag = false;
  const overrideIndex = name.indexOf(IMPORTANT_FLAG);
  if (overrideIndex !== -1) {
    name = overrideIndex > 0 ? name.substring(0, overrideIndex) : "";
    hasOverrideFlag = true;
  }
  let suffix = null;
  let property2 = name;
  const unitIndex = name.lastIndexOf(".");
  if (unitIndex > 0) {
    suffix = name.slice(unitIndex + 1);
    property2 = name.substring(0, unitIndex);
  }
  return { property: property2, suffix, hasOverrideFlag };
}
function getClassMapInterpolationExpression(interpolation) {
  switch (getInterpolationArgsLength(interpolation)) {
    case 1:
      return Identifiers.classMap;
    case 3:
      return Identifiers.classMapInterpolate1;
    case 5:
      return Identifiers.classMapInterpolate2;
    case 7:
      return Identifiers.classMapInterpolate3;
    case 9:
      return Identifiers.classMapInterpolate4;
    case 11:
      return Identifiers.classMapInterpolate5;
    case 13:
      return Identifiers.classMapInterpolate6;
    case 15:
      return Identifiers.classMapInterpolate7;
    case 17:
      return Identifiers.classMapInterpolate8;
    default:
      return Identifiers.classMapInterpolateV;
  }
}
function getStyleMapInterpolationExpression(interpolation) {
  switch (getInterpolationArgsLength(interpolation)) {
    case 1:
      return Identifiers.styleMap;
    case 3:
      return Identifiers.styleMapInterpolate1;
    case 5:
      return Identifiers.styleMapInterpolate2;
    case 7:
      return Identifiers.styleMapInterpolate3;
    case 9:
      return Identifiers.styleMapInterpolate4;
    case 11:
      return Identifiers.styleMapInterpolate5;
    case 13:
      return Identifiers.styleMapInterpolate6;
    case 15:
      return Identifiers.styleMapInterpolate7;
    case 17:
      return Identifiers.styleMapInterpolate8;
    default:
      return Identifiers.styleMapInterpolateV;
  }
}
function getStylePropInterpolationExpression(interpolation) {
  switch (getInterpolationArgsLength(interpolation)) {
    case 1:
      return Identifiers.styleProp;
    case 3:
      return Identifiers.stylePropInterpolate1;
    case 5:
      return Identifiers.stylePropInterpolate2;
    case 7:
      return Identifiers.stylePropInterpolate3;
    case 9:
      return Identifiers.stylePropInterpolate4;
    case 11:
      return Identifiers.stylePropInterpolate5;
    case 13:
      return Identifiers.stylePropInterpolate6;
    case 15:
      return Identifiers.stylePropInterpolate7;
    case 17:
      return Identifiers.stylePropInterpolate8;
    default:
      return Identifiers.stylePropInterpolateV;
  }
}
function isCssCustomProperty(name) {
  return name.startsWith("--");
}
function isEmptyExpression(ast) {
  if (ast instanceof ASTWithSource) {
    ast = ast.ast;
  }
  return ast instanceof EmptyExpr$1;
}
var TokenType;
(function(TokenType2) {
  TokenType2[TokenType2["Character"] = 0] = "Character";
  TokenType2[TokenType2["Identifier"] = 1] = "Identifier";
  TokenType2[TokenType2["PrivateIdentifier"] = 2] = "PrivateIdentifier";
  TokenType2[TokenType2["Keyword"] = 3] = "Keyword";
  TokenType2[TokenType2["String"] = 4] = "String";
  TokenType2[TokenType2["Operator"] = 5] = "Operator";
  TokenType2[TokenType2["Number"] = 6] = "Number";
  TokenType2[TokenType2["Error"] = 7] = "Error";
})(TokenType || (TokenType = {}));
var KEYWORDS = ["var", "let", "as", "null", "undefined", "true", "false", "if", "else", "this"];
var Lexer = class {
  tokenize(text2) {
    const scanner = new _Scanner(text2);
    const tokens = [];
    let token = scanner.scanToken();
    while (token != null) {
      tokens.push(token);
      token = scanner.scanToken();
    }
    return tokens;
  }
};
var Token = class {
  constructor(index, end, type, numValue, strValue) {
    this.index = index;
    this.end = end;
    this.type = type;
    this.numValue = numValue;
    this.strValue = strValue;
  }
  isCharacter(code) {
    return this.type == TokenType.Character && this.numValue == code;
  }
  isNumber() {
    return this.type == TokenType.Number;
  }
  isString() {
    return this.type == TokenType.String;
  }
  isOperator(operator) {
    return this.type == TokenType.Operator && this.strValue == operator;
  }
  isIdentifier() {
    return this.type == TokenType.Identifier;
  }
  isPrivateIdentifier() {
    return this.type == TokenType.PrivateIdentifier;
  }
  isKeyword() {
    return this.type == TokenType.Keyword;
  }
  isKeywordLet() {
    return this.type == TokenType.Keyword && this.strValue == "let";
  }
  isKeywordAs() {
    return this.type == TokenType.Keyword && this.strValue == "as";
  }
  isKeywordNull() {
    return this.type == TokenType.Keyword && this.strValue == "null";
  }
  isKeywordUndefined() {
    return this.type == TokenType.Keyword && this.strValue == "undefined";
  }
  isKeywordTrue() {
    return this.type == TokenType.Keyword && this.strValue == "true";
  }
  isKeywordFalse() {
    return this.type == TokenType.Keyword && this.strValue == "false";
  }
  isKeywordThis() {
    return this.type == TokenType.Keyword && this.strValue == "this";
  }
  isError() {
    return this.type == TokenType.Error;
  }
  toNumber() {
    return this.type == TokenType.Number ? this.numValue : -1;
  }
  toString() {
    switch (this.type) {
      case TokenType.Character:
      case TokenType.Identifier:
      case TokenType.Keyword:
      case TokenType.Operator:
      case TokenType.PrivateIdentifier:
      case TokenType.String:
      case TokenType.Error:
        return this.strValue;
      case TokenType.Number:
        return this.numValue.toString();
      default:
        return null;
    }
  }
};
function newCharacterToken(index, end, code) {
  return new Token(index, end, TokenType.Character, code, String.fromCharCode(code));
}
function newIdentifierToken(index, end, text2) {
  return new Token(index, end, TokenType.Identifier, 0, text2);
}
function newPrivateIdentifierToken(index, end, text2) {
  return new Token(index, end, TokenType.PrivateIdentifier, 0, text2);
}
function newKeywordToken(index, end, text2) {
  return new Token(index, end, TokenType.Keyword, 0, text2);
}
function newOperatorToken(index, end, text2) {
  return new Token(index, end, TokenType.Operator, 0, text2);
}
function newStringToken(index, end, text2) {
  return new Token(index, end, TokenType.String, 0, text2);
}
function newNumberToken(index, end, n) {
  return new Token(index, end, TokenType.Number, n, "");
}
function newErrorToken(index, end, message) {
  return new Token(index, end, TokenType.Error, 0, message);
}
var EOF = new Token(-1, -1, TokenType.Character, 0, "");
var _Scanner = class {
  constructor(input) {
    this.input = input;
    this.peek = 0;
    this.index = -1;
    this.length = input.length;
    this.advance();
  }
  advance() {
    this.peek = ++this.index >= this.length ? $EOF : this.input.charCodeAt(this.index);
  }
  scanToken() {
    const input = this.input, length = this.length;
    let peek = this.peek, index = this.index;
    while (peek <= $SPACE) {
      if (++index >= length) {
        peek = $EOF;
        break;
      } else {
        peek = input.charCodeAt(index);
      }
    }
    this.peek = peek;
    this.index = index;
    if (index >= length) {
      return null;
    }
    if (isIdentifierStart(peek))
      return this.scanIdentifier();
    if (isDigit(peek))
      return this.scanNumber(index);
    const start = index;
    switch (peek) {
      case $PERIOD:
        this.advance();
        return isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, this.index, $PERIOD);
      case $LPAREN:
      case $RPAREN:
      case $LBRACE:
      case $RBRACE:
      case $LBRACKET:
      case $RBRACKET:
      case $COMMA:
      case $COLON:
      case $SEMICOLON:
        return this.scanCharacter(start, peek);
      case $SQ:
      case $DQ:
        return this.scanString();
      case $HASH:
        return this.scanPrivateIdentifier();
      case $PLUS:
      case $MINUS:
      case $STAR:
      case $SLASH:
      case $PERCENT:
      case $CARET:
        return this.scanOperator(start, String.fromCharCode(peek));
      case $QUESTION:
        return this.scanQuestion(start);
      case $LT:
      case $GT:
        return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, "=");
      case $BANG:
      case $EQ:
        return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, "=", $EQ, "=");
      case $AMPERSAND:
        return this.scanComplexOperator(start, "&", $AMPERSAND, "&");
      case $BAR:
        return this.scanComplexOperator(start, "|", $BAR, "|");
      case $NBSP:
        while (isWhitespace(this.peek))
          this.advance();
        return this.scanToken();
    }
    this.advance();
    return this.error(`Unexpected character [${String.fromCharCode(peek)}]`, 0);
  }
  scanCharacter(start, code) {
    this.advance();
    return newCharacterToken(start, this.index, code);
  }
  scanOperator(start, str) {
    this.advance();
    return newOperatorToken(start, this.index, str);
  }
  /**
   * Tokenize a 2/3 char long operator
   *
   * @param start start index in the expression
   * @param one first symbol (always part of the operator)
   * @param twoCode code point for the second symbol
   * @param two second symbol (part of the operator when the second code point matches)
   * @param threeCode code point for the third symbol
   * @param three third symbol (part of the operator when provided and matches source expression)
   */
  scanComplexOperator(start, one, twoCode, two, threeCode, three) {
    this.advance();
    let str = one;
    if (this.peek == twoCode) {
      this.advance();
      str += two;
    }
    if (threeCode != null && this.peek == threeCode) {
      this.advance();
      str += three;
    }
    return newOperatorToken(start, this.index, str);
  }
  scanIdentifier() {
    const start = this.index;
    this.advance();
    while (isIdentifierPart(this.peek))
      this.advance();
    const str = this.input.substring(start, this.index);
    return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, this.index, str) : newIdentifierToken(start, this.index, str);
  }
  /** Scans an ECMAScript private identifier. */
  scanPrivateIdentifier() {
    const start = this.index;
    this.advance();
    if (!isIdentifierStart(this.peek)) {
      return this.error("Invalid character [#]", -1);
    }
    while (isIdentifierPart(this.peek))
      this.advance();
    const identifierName2 = this.input.substring(start, this.index);
    return newPrivateIdentifierToken(start, this.index, identifierName2);
  }
  scanNumber(start) {
    let simple = this.index === start;
    let hasSeparators = false;
    this.advance();
    while (true) {
      if (isDigit(this.peek)) {
      } else if (this.peek === $_) {
        if (!isDigit(this.input.charCodeAt(this.index - 1)) || !isDigit(this.input.charCodeAt(this.index + 1))) {
          return this.error("Invalid numeric separator", 0);
        }
        hasSeparators = true;
      } else if (this.peek === $PERIOD) {
        simple = false;
      } else if (isExponentStart(this.peek)) {
        this.advance();
        if (isExponentSign(this.peek))
          this.advance();
        if (!isDigit(this.peek))
          return this.error("Invalid exponent", -1);
        simple = false;
      } else {
        break;
      }
      this.advance();
    }
    let str = this.input.substring(start, this.index);
    if (hasSeparators) {
      str = str.replace(/_/g, "");
    }
    const value = simple ? parseIntAutoRadix(str) : parseFloat(str);
    return newNumberToken(start, this.index, value);
  }
  scanString() {
    const start = this.index;
    const quote = this.peek;
    this.advance();
    let buffer = "";
    let marker = this.index;
    const input = this.input;
    while (this.peek != quote) {
      if (this.peek == $BACKSLASH) {
        buffer += input.substring(marker, this.index);
        let unescapedCode;
        this.advance();
        if (this.peek == $u) {
          const hex = input.substring(this.index + 1, this.index + 5);
          if (/^[0-9a-f]+$/i.test(hex)) {
            unescapedCode = parseInt(hex, 16);
          } else {
            return this.error(`Invalid unicode escape [\\u${hex}]`, 0);
          }
          for (let i = 0; i < 5; i++) {
            this.advance();
          }
        } else {
          unescapedCode = unescape(this.peek);
          this.advance();
        }
        buffer += String.fromCharCode(unescapedCode);
        marker = this.index;
      } else if (this.peek == $EOF) {
        return this.error("Unterminated quote", 0);
      } else {
        this.advance();
      }
    }
    const last = input.substring(marker, this.index);
    this.advance();
    return newStringToken(start, this.index, buffer + last);
  }
  scanQuestion(start) {
    this.advance();
    let str = "?";
    if (this.peek === $QUESTION || this.peek === $PERIOD) {
      str += this.peek === $PERIOD ? "." : "?";
      this.advance();
    }
    return newOperatorToken(start, this.index, str);
  }
  error(message, offset) {
    const position = this.index + offset;
    return newErrorToken(position, this.index, `Lexer Error: ${message} at column ${position} in expression [${this.input}]`);
  }
};
function isIdentifierStart(code) {
  return $a <= code && code <= $z || $A <= code && code <= $Z || code == $_ || code == $$;
}
function isIdentifierPart(code) {
  return isAsciiLetter(code) || isDigit(code) || code == $_ || code == $$;
}
function isExponentStart(code) {
  return code == $e || code == $E;
}
function isExponentSign(code) {
  return code == $MINUS || code == $PLUS;
}
function unescape(code) {
  switch (code) {
    case $n:
      return $LF;
    case $f:
      return $FF;
    case $r:
      return $CR;
    case $t:
      return $TAB;
    case $v:
      return $VTAB;
    default:
      return code;
  }
}
function parseIntAutoRadix(text2) {
  const result = parseInt(text2);
  if (isNaN(result)) {
    throw new Error("Invalid integer literal when parsing " + text2);
  }
  return result;
}
var SplitInterpolation = class {
  constructor(strings, expressions, offsets) {
    this.strings = strings;
    this.expressions = expressions;
    this.offsets = offsets;
  }
};
var TemplateBindingParseResult = class {
  constructor(templateBindings, warnings, errors) {
    this.templateBindings = templateBindings;
    this.warnings = warnings;
    this.errors = errors;
  }
};
var Parser$1 = class {
  constructor(_lexer) {
    this._lexer = _lexer;
    this.errors = [];
  }
  parseAction(input, isAssignmentEvent, location, absoluteOffset, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
    this._checkNoInterpolation(input, location, interpolationConfig);
    const sourceToLex = this._stripComments(input);
    const tokens = this._lexer.tokenize(sourceToLex);
    let flags = 1;
    if (isAssignmentEvent) {
      flags |= 2;
    }
    const ast = new _ParseAST(input, location, absoluteOffset, tokens, flags, this.errors, 0).parseChain();
    return new ASTWithSource(ast, input, location, absoluteOffset, this.errors);
  }
  parseBinding(input, location, absoluteOffset, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
    const ast = this._parseBindingAst(input, location, absoluteOffset, interpolationConfig);
    return new ASTWithSource(ast, input, location, absoluteOffset, this.errors);
  }
  checkSimpleExpression(ast) {
    const checker = new SimpleExpressionChecker();
    ast.visit(checker);
    return checker.errors;
  }
  // Host bindings parsed here
  parseSimpleBinding(input, location, absoluteOffset, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
    const ast = this._parseBindingAst(input, location, absoluteOffset, interpolationConfig);
    const errors = this.checkSimpleExpression(ast);
    if (errors.length > 0) {
      this._reportError(`Host binding expression cannot contain ${errors.join(" ")}`, input, location);
    }
    return new ASTWithSource(ast, input, location, absoluteOffset, this.errors);
  }
  _reportError(message, input, errLocation, ctxLocation) {
    this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
  }
  _parseBindingAst(input, location, absoluteOffset, interpolationConfig) {
    this._checkNoInterpolation(input, location, interpolationConfig);
    const sourceToLex = this._stripComments(input);
    const tokens = this._lexer.tokenize(sourceToLex);
    return new _ParseAST(input, location, absoluteOffset, tokens, 0, this.errors, 0).parseChain();
  }
  /**
   * Parse microsyntax template expression and return a list of bindings or
   * parsing errors in case the given expression is invalid.
   *
   * For example,
   * ```
   *   <div *ngFor="let item of items">
   *         ^      ^ absoluteValueOffset for `templateValue`
   *         absoluteKeyOffset for `templateKey`
   * ```
   * contains three bindings:
   * 1. ngFor -> null
   * 2. item -> NgForOfContext.$implicit
   * 3. ngForOf -> items
   *
   * This is apparent from the de-sugared template:
   * ```
   *   <ng-template ngFor let-item [ngForOf]="items">
   * ```
   *
   * @param templateKey name of directive, without the * prefix. For example: ngIf, ngFor
   * @param templateValue RHS of the microsyntax attribute
   * @param templateUrl template filename if it's external, component filename if it's inline
   * @param absoluteKeyOffset start of the `templateKey`
   * @param absoluteValueOffset start of the `templateValue`
   */
  parseTemplateBindings(templateKey, templateValue, templateUrl, absoluteKeyOffset, absoluteValueOffset) {
    const tokens = this._lexer.tokenize(templateValue);
    const parser = new _ParseAST(
      templateValue,
      templateUrl,
      absoluteValueOffset,
      tokens,
      0,
      this.errors,
      0
      /* relative offset */
    );
    return parser.parseTemplateBindings({
      source: templateKey,
      span: new AbsoluteSourceSpan(absoluteKeyOffset, absoluteKeyOffset + templateKey.length)
    });
  }
  parseInterpolation(input, location, absoluteOffset, interpolatedTokens, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
    const { strings, expressions, offsets } = this.splitInterpolation(input, location, interpolatedTokens, interpolationConfig);
    if (expressions.length === 0)
      return null;
    const expressionNodes = [];
    for (let i = 0; i < expressions.length; ++i) {
      const expressionText = expressions[i].text;
      const sourceToLex = this._stripComments(expressionText);
      const tokens = this._lexer.tokenize(sourceToLex);
      const ast = new _ParseAST(input, location, absoluteOffset, tokens, 0, this.errors, offsets[i]).parseChain();
      expressionNodes.push(ast);
    }
    return this.createInterpolationAst(strings.map((s) => s.text), expressionNodes, input, location, absoluteOffset);
  }
  /**
   * Similar to `parseInterpolation`, but treats the provided string as a single expression
   * element that would normally appear within the interpolation prefix and suffix (`{{` and `}}`).
   * This is used for parsing the switch expression in ICUs.
   */
  parseInterpolationExpression(expression, location, absoluteOffset) {
    const sourceToLex = this._stripComments(expression);
    const tokens = this._lexer.tokenize(sourceToLex);
    const ast = new _ParseAST(expression, location, absoluteOffset, tokens, 0, this.errors, 0).parseChain();
    const strings = ["", ""];
    return this.createInterpolationAst(strings, [ast], expression, location, absoluteOffset);
  }
  createInterpolationAst(strings, expressions, input, location, absoluteOffset) {
    const span = new ParseSpan(0, input.length);
    const interpolation = new Interpolation$1(span, span.toAbsolute(absoluteOffset), strings, expressions);
    return new ASTWithSource(interpolation, input, location, absoluteOffset, this.errors);
  }
  /**
   * Splits a string of text into "raw" text segments and expressions present in interpolations in
   * the string.
   * Returns `null` if there are no interpolations, otherwise a
   * `SplitInterpolation` with splits that look like
   *   <raw text> <expression> <raw text> ... <raw text> <expression> <raw text>
   */
  splitInterpolation(input, location, interpolatedTokens, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
    const strings = [];
    const expressions = [];
    const offsets = [];
    const inputToTemplateIndexMap = interpolatedTokens ? getIndexMapForOriginalTemplate(interpolatedTokens) : null;
    let i = 0;
    let atInterpolation = false;
    let extendLastString = false;
    let { start: interpStart, end: interpEnd } = interpolationConfig;
    while (i < input.length) {
      if (!atInterpolation) {
        const start = i;
        i = input.indexOf(interpStart, i);
        if (i === -1) {
          i = input.length;
        }
        const text2 = input.substring(start, i);
        strings.push({ text: text2, start, end: i });
        atInterpolation = true;
      } else {
        const fullStart = i;
        const exprStart = fullStart + interpStart.length;
        const exprEnd = this._getInterpolationEndIndex(input, interpEnd, exprStart);
        if (exprEnd === -1) {
          atInterpolation = false;
          extendLastString = true;
          break;
        }
        const fullEnd = exprEnd + interpEnd.length;
        const text2 = input.substring(exprStart, exprEnd);
        if (text2.trim().length === 0) {
          this._reportError("Blank expressions are not allowed in interpolated strings", input, `at column ${i} in`, location);
        }
        expressions.push({ text: text2, start: fullStart, end: fullEnd });
        const startInOriginalTemplate = inputToTemplateIndexMap?.get(fullStart) ?? fullStart;
        const offset = startInOriginalTemplate + interpStart.length;
        offsets.push(offset);
        i = fullEnd;
        atInterpolation = false;
      }
    }
    if (!atInterpolation) {
      if (extendLastString) {
        const piece = strings[strings.length - 1];
        piece.text += input.substring(i);
        piece.end = input.length;
      } else {
        strings.push({ text: input.substring(i), start: i, end: input.length });
      }
    }
    return new SplitInterpolation(strings, expressions, offsets);
  }
  wrapLiteralPrimitive(input, location, absoluteOffset) {
    const span = new ParseSpan(0, input == null ? 0 : input.length);
    return new ASTWithSource(new LiteralPrimitive(span, span.toAbsolute(absoluteOffset), input), input, location, absoluteOffset, this.errors);
  }
  _stripComments(input) {
    const i = this._commentStart(input);
    return i != null ? input.substring(0, i) : input;
  }
  _commentStart(input) {
    let outerQuote = null;
    for (let i = 0; i < input.length - 1; i++) {
      const char = input.charCodeAt(i);
      const nextChar = input.charCodeAt(i + 1);
      if (char === $SLASH && nextChar == $SLASH && outerQuote == null)
        return i;
      if (outerQuote === char) {
        outerQuote = null;
      } else if (outerQuote == null && isQuote(char)) {
        outerQuote = char;
      }
    }
    return null;
  }
  _checkNoInterpolation(input, location, { start, end }) {
    let startIndex = -1;
    let endIndex = -1;
    for (const charIndex of this._forEachUnquotedChar(input, 0)) {
      if (startIndex === -1) {
        if (input.startsWith(start)) {
          startIndex = charIndex;
        }
      } else {
        endIndex = this._getInterpolationEndIndex(input, end, charIndex);
        if (endIndex > -1) {
          break;
        }
      }
    }
    if (startIndex > -1 && endIndex > -1) {
      this._reportError(`Got interpolation (${start}${end}) where expression was expected`, input, `at column ${startIndex} in`, location);
    }
  }
  /**
   * Finds the index of the end of an interpolation expression
   * while ignoring comments and quoted content.
   */
  _getInterpolationEndIndex(input, expressionEnd, start) {
    for (const charIndex of this._forEachUnquotedChar(input, start)) {
      if (input.startsWith(expressionEnd, charIndex)) {
        return charIndex;
      }
      if (input.startsWith("//", charIndex)) {
        return input.indexOf(expressionEnd, charIndex);
      }
    }
    return -1;
  }
  /**
   * Generator used to iterate over the character indexes of a string that are outside of quotes.
   * @param input String to loop through.
   * @param start Index within the string at which to start.
   */
  *_forEachUnquotedChar(input, start) {
    let currentQuote = null;
    let escapeCount = 0;
    for (let i = start; i < input.length; i++) {
      const char = input[i];
      if (isQuote(input.charCodeAt(i)) && (currentQuote === null || currentQuote === char) && escapeCount % 2 === 0) {
        currentQuote = currentQuote === null ? char : null;
      } else if (currentQuote === null) {
        yield i;
      }
      escapeCount = char === "\\" ? escapeCount + 1 : 0;
    }
  }
};
var ParseContextFlags;
(function(ParseContextFlags2) {
  ParseContextFlags2[ParseContextFlags2["None"] = 0] = "None";
  ParseContextFlags2[ParseContextFlags2["Writable"] = 1] = "Writable";
})(ParseContextFlags || (ParseContextFlags = {}));
var _ParseAST = class {
  constructor(input, location, absoluteOffset, tokens, parseFlags, errors, offset) {
    this.input = input;
    this.location = location;
    this.absoluteOffset = absoluteOffset;
    this.tokens = tokens;
    this.parseFlags = parseFlags;
    this.errors = errors;
    this.offset = offset;
    this.rparensExpected = 0;
    this.rbracketsExpected = 0;
    this.rbracesExpected = 0;
    this.context = ParseContextFlags.None;
    this.sourceSpanCache = /* @__PURE__ */ new Map();
    this.index = 0;
  }
  peek(offset) {
    const i = this.index + offset;
    return i < this.tokens.length ? this.tokens[i] : EOF;
  }
  get next() {
    return this.peek(0);
  }
  /** Whether all the parser input has been processed. */
  get atEOF() {
    return this.index >= this.tokens.length;
  }
  /**
   * Index of the next token to be processed, or the end of the last token if all have been
   * processed.
   */
  get inputIndex() {
    return this.atEOF ? this.currentEndIndex : this.next.index + this.offset;
  }
  /**
   * End index of the last processed token, or the start of the first token if none have been
   * processed.
   */
  get currentEndIndex() {
    if (this.index > 0) {
      const curToken = this.peek(-1);
      return curToken.end + this.offset;
    }
    if (this.tokens.length === 0) {
      return this.input.length + this.offset;
    }
    return this.next.index + this.offset;
  }
  /**
   * Returns the absolute offset of the start of the current token.
   */
  get currentAbsoluteOffset() {
    return this.absoluteOffset + this.inputIndex;
  }
  /**
   * Retrieve a `ParseSpan` from `start` to the current position (or to `artificialEndIndex` if
   * provided).
   *
   * @param start Position from which the `ParseSpan` will start.
   * @param artificialEndIndex Optional ending index to be used if provided (and if greater than the
   *     natural ending index)
   */
  span(start, artificialEndIndex) {
    let endIndex = this.currentEndIndex;
    if (artificialEndIndex !== void 0 && artificialEndIndex > this.currentEndIndex) {
      endIndex = artificialEndIndex;
    }
    if (start > endIndex) {
      const tmp = endIndex;
      endIndex = start;
      start = tmp;
    }
    return new ParseSpan(start, endIndex);
  }
  sourceSpan(start, artificialEndIndex) {
    const serial = `${start}@${this.inputIndex}:${artificialEndIndex}`;
    if (!this.sourceSpanCache.has(serial)) {
      this.sourceSpanCache.set(serial, this.span(start, artificialEndIndex).toAbsolute(this.absoluteOffset));
    }
    return this.sourceSpanCache.get(serial);
  }
  advance() {
    this.index++;
  }
  /**
   * Executes a callback in the provided context.
   */
  withContext(context, cb) {
    this.context |= context;
    const ret = cb();
    this.context ^= context;
    return ret;
  }
  consumeOptionalCharacter(code) {
    if (this.next.isCharacter(code)) {
      this.advance();
      return true;
    } else {
      return false;
    }
  }
  peekKeywordLet() {
    return this.next.isKeywordLet();
  }
  peekKeywordAs() {
    return this.next.isKeywordAs();
  }
  /**
   * Consumes an expected character, otherwise emits an error about the missing expected character
   * and skips over the token stream until reaching a recoverable point.
   *
   * See `this.error` and `this.skip` for more details.
   */
  expectCharacter(code) {
    if (this.consumeOptionalCharacter(code))
      return;
    this.error(`Missing expected ${String.fromCharCode(code)}`);
  }
  consumeOptionalOperator(op) {
    if (this.next.isOperator(op)) {
      this.advance();
      return true;
    } else {
      return false;
    }
  }
  expectOperator(operator) {
    if (this.consumeOptionalOperator(operator))
      return;
    this.error(`Missing expected operator ${operator}`);
  }
  prettyPrintToken(tok) {
    return tok === EOF ? "end of input" : `token ${tok}`;
  }
  expectIdentifierOrKeyword() {
    const n = this.next;
    if (!n.isIdentifier() && !n.isKeyword()) {
      if (n.isPrivateIdentifier()) {
        this._reportErrorForPrivateIdentifier(n, "expected identifier or keyword");
      } else {
        this.error(`Unexpected ${this.prettyPrintToken(n)}, expected identifier or keyword`);
      }
      return null;
    }
    this.advance();
    return n.toString();
  }
  expectIdentifierOrKeywordOrString() {
    const n = this.next;
    if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
      if (n.isPrivateIdentifier()) {
        this._reportErrorForPrivateIdentifier(n, "expected identifier, keyword or string");
      } else {
        this.error(`Unexpected ${this.prettyPrintToken(n)}, expected identifier, keyword, or string`);
      }
      return "";
    }
    this.advance();
    return n.toString();
  }
  parseChain() {
    const exprs = [];
    const start = this.inputIndex;
    while (this.index < this.tokens.length) {
      const expr = this.parsePipe();
      exprs.push(expr);
      if (this.consumeOptionalCharacter($SEMICOLON)) {
        if (!(this.parseFlags & 1)) {
          this.error("Binding expression cannot contain chained expression");
        }
        while (this.consumeOptionalCharacter($SEMICOLON)) {
        }
      } else if (this.index < this.tokens.length) {
        const errorIndex = this.index;
        this.error(`Unexpected token '${this.next}'`);
        if (this.index === errorIndex) {
          break;
        }
      }
    }
    if (exprs.length === 0) {
      const artificialStart = this.offset;
      const artificialEnd = this.offset + this.input.length;
      return new EmptyExpr$1(this.span(artificialStart, artificialEnd), this.sourceSpan(artificialStart, artificialEnd));
    }
    if (exprs.length == 1)
      return exprs[0];
    return new Chain(this.span(start), this.sourceSpan(start), exprs);
  }
  parsePipe() {
    const start = this.inputIndex;
    let result = this.parseExpression();
    if (this.consumeOptionalOperator("|")) {
      if (this.parseFlags & 1) {
        this.error("Cannot have a pipe in an action expression");
      }
      do {
        const nameStart = this.inputIndex;
        let nameId = this.expectIdentifierOrKeyword();
        let nameSpan;
        let fullSpanEnd = void 0;
        if (nameId !== null) {
          nameSpan = this.sourceSpan(nameStart);
        } else {
          nameId = "";
          fullSpanEnd = this.next.index !== -1 ? this.next.index : this.input.length + this.offset;
          nameSpan = new ParseSpan(fullSpanEnd, fullSpanEnd).toAbsolute(this.absoluteOffset);
        }
        const args = [];
        while (this.consumeOptionalCharacter($COLON)) {
          args.push(this.parseExpression());
        }
        result = new BindingPipe(this.span(start), this.sourceSpan(start, fullSpanEnd), result, nameId, args, nameSpan);
      } while (this.consumeOptionalOperator("|"));
    }
    return result;
  }
  parseExpression() {
    return this.parseConditional();
  }
  parseConditional() {
    const start = this.inputIndex;
    const result = this.parseLogicalOr();
    if (this.consumeOptionalOperator("?")) {
      const yes = this.parsePipe();
      let no;
      if (!this.consumeOptionalCharacter($COLON)) {
        const end = this.inputIndex;
        const expression = this.input.substring(start, end);
        this.error(`Conditional expression ${expression} requires all 3 expressions`);
        no = new EmptyExpr$1(this.span(start), this.sourceSpan(start));
      } else {
        no = this.parsePipe();
      }
      return new Conditional(this.span(start), this.sourceSpan(start), result, yes, no);
    } else {
      return result;
    }
  }
  parseLogicalOr() {
    const start = this.inputIndex;
    let result = this.parseLogicalAnd();
    while (this.consumeOptionalOperator("||")) {
      const right = this.parseLogicalAnd();
      result = new Binary(this.span(start), this.sourceSpan(start), "||", result, right);
    }
    return result;
  }
  parseLogicalAnd() {
    const start = this.inputIndex;
    let result = this.parseNullishCoalescing();
    while (this.consumeOptionalOperator("&&")) {
      const right = this.parseNullishCoalescing();
      result = new Binary(this.span(start), this.sourceSpan(start), "&&", result, right);
    }
    return result;
  }
  parseNullishCoalescing() {
    const start = this.inputIndex;
    let result = this.parseEquality();
    while (this.consumeOptionalOperator("??")) {
      const right = this.parseEquality();
      result = new Binary(this.span(start), this.sourceSpan(start), "??", result, right);
    }
    return result;
  }
  parseEquality() {
    const start = this.inputIndex;
    let result = this.parseRelational();
    while (this.next.type == TokenType.Operator) {
      const operator = this.next.strValue;
      switch (operator) {
        case "==":
        case "===":
        case "!=":
        case "!==":
          this.advance();
          const right = this.parseRelational();
          result = new Binary(this.span(start), this.sourceSpan(start), operator, result, right);
          continue;
      }
      break;
    }
    return result;
  }
  parseRelational() {
    const start = this.inputIndex;
    let result = this.parseAdditive();
    while (this.next.type == TokenType.Operator) {
      const operator = this.next.strValue;
      switch (operator) {
        case "<":
        case ">":
        case "<=":
        case ">=":
          this.advance();
          const right = this.parseAdditive();
          result = new Binary(this.span(start), this.sourceSpan(start), operator, result, right);
          continue;
      }
      break;
    }
    return result;
  }
  parseAdditive() {
    const start = this.inputIndex;
    let result = this.parseMultiplicative();
    while (this.next.type == TokenType.Operator) {
      const operator = this.next.strValue;
      switch (operator) {
        case "+":
        case "-":
          this.advance();
          let right = this.parseMultiplicative();
          result = new Binary(this.span(start), this.sourceSpan(start), operator, result, right);
          continue;
      }
      break;
    }
    return result;
  }
  parseMultiplicative() {
    const start = this.inputIndex;
    let result = this.parsePrefix();
    while (this.next.type == TokenType.Operator) {
      const operator = this.next.strValue;
      switch (operator) {
        case "*":
        case "%":
        case "/":
          this.advance();
          let right = this.parsePrefix();
          result = new Binary(this.span(start), this.sourceSpan(start), operator, result, right);
          continue;
      }
      break;
    }
    return result;
  }
  parsePrefix() {
    if (this.next.type == TokenType.Operator) {
      const start = this.inputIndex;
      const operator = this.next.strValue;
      let result;
      switch (operator) {
        case "+":
          this.advance();
          result = this.parsePrefix();
          return Unary.createPlus(this.span(start), this.sourceSpan(start), result);
        case "-":
          this.advance();
          result = this.parsePrefix();
          return Unary.createMinus(this.span(start), this.sourceSpan(start), result);
        case "!":
          this.advance();
          result = this.parsePrefix();
          return new PrefixNot(this.span(start), this.sourceSpan(start), result);
      }
    }
    return this.parseCallChain();
  }
  parseCallChain() {
    const start = this.inputIndex;
    let result = this.parsePrimary();
    while (true) {
      if (this.consumeOptionalCharacter($PERIOD)) {
        result = this.parseAccessMember(result, start, false);
      } else if (this.consumeOptionalOperator("?.")) {
        if (this.consumeOptionalCharacter($LPAREN)) {
          result = this.parseCall(result, start, true);
        } else {
          result = this.consumeOptionalCharacter($LBRACKET) ? this.parseKeyedReadOrWrite(result, start, true) : this.parseAccessMember(result, start, true);
        }
      } else if (this.consumeOptionalCharacter($LBRACKET)) {
        result = this.parseKeyedReadOrWrite(result, start, false);
      } else if (this.consumeOptionalCharacter($LPAREN)) {
        result = this.parseCall(result, start, false);
      } else if (this.consumeOptionalOperator("!")) {
        result = new NonNullAssert(this.span(start), this.sourceSpan(start), result);
      } else {
        return result;
      }
    }
  }
  parsePrimary() {
    const start = this.inputIndex;
    if (this.consumeOptionalCharacter($LPAREN)) {
      this.rparensExpected++;
      const result = this.parsePipe();
      this.rparensExpected--;
      this.expectCharacter($RPAREN);
      return result;
    } else if (this.next.isKeywordNull()) {
      this.advance();
      return new LiteralPrimitive(this.span(start), this.sourceSpan(start), null);
    } else if (this.next.isKeywordUndefined()) {
      this.advance();
      return new LiteralPrimitive(this.span(start), this.sourceSpan(start), void 0);
    } else if (this.next.isKeywordTrue()) {
      this.advance();
      return new LiteralPrimitive(this.span(start), this.sourceSpan(start), true);
    } else if (this.next.isKeywordFalse()) {
      this.advance();
      return new LiteralPrimitive(this.span(start), this.sourceSpan(start), false);
    } else if (this.next.isKeywordThis()) {
      this.advance();
      return new ThisReceiver(this.span(start), this.sourceSpan(start));
    } else if (this.consumeOptionalCharacter($LBRACKET)) {
      this.rbracketsExpected++;
      const elements = this.parseExpressionList($RBRACKET);
      this.rbracketsExpected--;
      this.expectCharacter($RBRACKET);
      return new LiteralArray(this.span(start), this.sourceSpan(start), elements);
    } else if (this.next.isCharacter($LBRACE)) {
      return this.parseLiteralMap();
    } else if (this.next.isIdentifier()) {
      return this.parseAccessMember(new ImplicitReceiver(this.span(start), this.sourceSpan(start)), start, false);
    } else if (this.next.isNumber()) {
      const value = this.next.toNumber();
      this.advance();
      return new LiteralPrimitive(this.span(start), this.sourceSpan(start), value);
    } else if (this.next.isString()) {
      const literalValue = this.next.toString();
      this.advance();
      return new LiteralPrimitive(this.span(start), this.sourceSpan(start), literalValue);
    } else if (this.next.isPrivateIdentifier()) {
      this._reportErrorForPrivateIdentifier(this.next, null);
      return new EmptyExpr$1(this.span(start), this.sourceSpan(start));
    } else if (this.index >= this.tokens.length) {
      this.error(`Unexpected end of expression: ${this.input}`);
      return new EmptyExpr$1(this.span(start), this.sourceSpan(start));
    } else {
      this.error(`Unexpected token ${this.next}`);
      return new EmptyExpr$1(this.span(start), this.sourceSpan(start));
    }
  }
  parseExpressionList(terminator) {
    const result = [];
    do {
      if (!this.next.isCharacter(terminator)) {
        result.push(this.parsePipe());
      } else {
        break;
      }
    } while (this.consumeOptionalCharacter($COMMA));
    return result;
  }
  parseLiteralMap() {
    const keys = [];
    const values = [];
    const start = this.inputIndex;
    this.expectCharacter($LBRACE);
    if (!this.consumeOptionalCharacter($RBRACE)) {
      this.rbracesExpected++;
      do {
        const keyStart = this.inputIndex;
        const quoted = this.next.isString();
        const key = this.expectIdentifierOrKeywordOrString();
        keys.push({ key, quoted });
        if (quoted) {
          this.expectCharacter($COLON);
          values.push(this.parsePipe());
        } else if (this.consumeOptionalCharacter($COLON)) {
          values.push(this.parsePipe());
        } else {
          const span = this.span(keyStart);
          const sourceSpan = this.sourceSpan(keyStart);
          values.push(new PropertyRead(span, sourceSpan, sourceSpan, new ImplicitReceiver(span, sourceSpan), key));
        }
      } while (this.consumeOptionalCharacter($COMMA) && !this.next.isCharacter($RBRACE));
      this.rbracesExpected--;
      this.expectCharacter($RBRACE);
    }
    return new LiteralMap(this.span(start), this.sourceSpan(start), keys, values);
  }
  parseAccessMember(readReceiver, start, isSafe) {
    const nameStart = this.inputIndex;
    const id = this.withContext(ParseContextFlags.Writable, () => {
      const id2 = this.expectIdentifierOrKeyword() ?? "";
      if (id2.length === 0) {
        this.error(`Expected identifier for property access`, readReceiver.span.end);
      }
      return id2;
    });
    const nameSpan = this.sourceSpan(nameStart);
    let receiver;
    if (isSafe) {
      if (this.consumeOptionalAssignment()) {
        this.error("The '?.' operator cannot be used in the assignment");
        receiver = new EmptyExpr$1(this.span(start), this.sourceSpan(start));
      } else {
        receiver = new SafePropertyRead(this.span(start), this.sourceSpan(start), nameSpan, readReceiver, id);
      }
    } else {
      if (this.consumeOptionalAssignment()) {
        if (!(this.parseFlags & 1)) {
          this.error("Bindings cannot contain assignments");
          return new EmptyExpr$1(this.span(start), this.sourceSpan(start));
        }
        const value = this.parseConditional();
        receiver = new PropertyWrite(this.span(start), this.sourceSpan(start), nameSpan, readReceiver, id, value);
      } else {
        receiver = new PropertyRead(this.span(start), this.sourceSpan(start), nameSpan, readReceiver, id);
      }
    }
    return receiver;
  }
  parseCall(receiver, start, isSafe) {
    const argumentStart = this.inputIndex;
    this.rparensExpected++;
    const args = this.parseCallArguments();
    const argumentSpan = this.span(argumentStart, this.inputIndex).toAbsolute(this.absoluteOffset);
    this.expectCharacter($RPAREN);
    this.rparensExpected--;
    const span = this.span(start);
    const sourceSpan = this.sourceSpan(start);
    return isSafe ? new SafeCall(span, sourceSpan, receiver, args, argumentSpan) : new Call(span, sourceSpan, receiver, args, argumentSpan);
  }
  consumeOptionalAssignment() {
    if (this.parseFlags & 2 && this.next.isOperator("!") && this.peek(1).isOperator("=")) {
      this.advance();
      this.advance();
      return true;
    }
    return this.consumeOptionalOperator("=");
  }
  parseCallArguments() {
    if (this.next.isCharacter($RPAREN))
      return [];
    const positionals = [];
    do {
      positionals.push(this.parsePipe());
    } while (this.consumeOptionalCharacter($COMMA));
    return positionals;
  }
  /**
   * Parses an identifier, a keyword, a string with an optional `-` in between,
   * and returns the string along with its absolute source span.
   */
  expectTemplateBindingKey() {
    let result = "";
    let operatorFound = false;
    const start = this.currentAbsoluteOffset;
    do {
      result += this.expectIdentifierOrKeywordOrString();
      operatorFound = this.consumeOptionalOperator("-");
      if (operatorFound) {
        result += "-";
      }
    } while (operatorFound);
    return {
      source: result,
      span: new AbsoluteSourceSpan(start, start + result.length)
    };
  }
  /**
   * Parse microsyntax template expression and return a list of bindings or
   * parsing errors in case the given expression is invalid.
   *
   * For example,
   * ```
   *   <div *ngFor="let item of items; index as i; trackBy: func">
   * ```
   * contains five bindings:
   * 1. ngFor -> null
   * 2. item -> NgForOfContext.$implicit
   * 3. ngForOf -> items
   * 4. i -> NgForOfContext.index
   * 5. ngForTrackBy -> func
   *
   * For a full description of the microsyntax grammar, see
   * https://gist.github.com/mhevery/d3530294cff2e4a1b3fe15ff75d08855
   *
   * @param templateKey name of the microsyntax directive, like ngIf, ngFor,
   * without the *, along with its absolute span.
   */
  parseTemplateBindings(templateKey) {
    const bindings = [];
    bindings.push(...this.parseDirectiveKeywordBindings(templateKey));
    while (this.index < this.tokens.length) {
      const letBinding = this.parseLetBinding();
      if (letBinding) {
        bindings.push(letBinding);
      } else {
        const key = this.expectTemplateBindingKey();
        const binding = this.parseAsBinding(key);
        if (binding) {
          bindings.push(binding);
        } else {
          key.source = templateKey.source + key.source.charAt(0).toUpperCase() + key.source.substring(1);
          bindings.push(...this.parseDirectiveKeywordBindings(key));
        }
      }
      this.consumeStatementTerminator();
    }
    return new TemplateBindingParseResult(bindings, [], this.errors);
  }
  parseKeyedReadOrWrite(receiver, start, isSafe) {
    return this.withContext(ParseContextFlags.Writable, () => {
      this.rbracketsExpected++;
      const key = this.parsePipe();
      if (key instanceof EmptyExpr$1) {
        this.error(`Key access cannot be empty`);
      }
      this.rbracketsExpected--;
      this.expectCharacter($RBRACKET);
      if (this.consumeOptionalOperator("=")) {
        if (isSafe) {
          this.error("The '?.' operator cannot be used in the assignment");
        } else {
          const value = this.parseConditional();
          return new KeyedWrite(this.span(start), this.sourceSpan(start), receiver, key, value);
        }
      } else {
        return isSafe ? new SafeKeyedRead(this.span(start), this.sourceSpan(start), receiver, key) : new KeyedRead(this.span(start), this.sourceSpan(start), receiver, key);
      }
      return new EmptyExpr$1(this.span(start), this.sourceSpan(start));
    });
  }
  /**
   * Parse a directive keyword, followed by a mandatory expression.
   * For example, "of items", "trackBy: func".
   * The bindings are: ngForOf -> items, ngForTrackBy -> func
   * There could be an optional "as" binding that follows the expression.
   * For example,
   * ```
   *   *ngFor="let item of items | slice:0:1 as collection".
   *                    ^^ ^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^
   *               keyword    bound target   optional 'as' binding
   * ```
   *
   * @param key binding key, for example, ngFor, ngIf, ngForOf, along with its
   * absolute span.
   */
  parseDirectiveKeywordBindings(key) {
    const bindings = [];
    this.consumeOptionalCharacter($COLON);
    const value = this.getDirectiveBoundTarget();
    let spanEnd = this.currentAbsoluteOffset;
    const asBinding = this.parseAsBinding(key);
    if (!asBinding) {
      this.consumeStatementTerminator();
      spanEnd = this.currentAbsoluteOffset;
    }
    const sourceSpan = new AbsoluteSourceSpan(key.span.start, spanEnd);
    bindings.push(new ExpressionBinding(sourceSpan, key, value));
    if (asBinding) {
      bindings.push(asBinding);
    }
    return bindings;
  }
  /**
   * Return the expression AST for the bound target of a directive keyword
   * binding. For example,
   * ```
   *   *ngIf="condition | pipe"
   *          ^^^^^^^^^^^^^^^^ bound target for "ngIf"
   *   *ngFor="let item of items"
   *                       ^^^^^ bound target for "ngForOf"
   * ```
   */
  getDirectiveBoundTarget() {
    if (this.next === EOF || this.peekKeywordAs() || this.peekKeywordLet()) {
      return null;
    }
    const ast = this.parsePipe();
    const { start, end } = ast.span;
    const value = this.input.substring(start, end);
    return new ASTWithSource(ast, value, this.location, this.absoluteOffset + start, this.errors);
  }
  /**
   * Return the binding for a variable declared using `as`. Note that the order
   * of the key-value pair in this declaration is reversed. For example,
   * ```
   *   *ngFor="let item of items; index as i"
   *                              ^^^^^    ^
   *                              value    key
   * ```
   *
   * @param value name of the value in the declaration, "ngIf" in the example
   * above, along with its absolute span.
   */
  parseAsBinding(value) {
    if (!this.peekKeywordAs()) {
      return null;
    }
    this.advance();
    const key = this.expectTemplateBindingKey();
    this.consumeStatementTerminator();
    const sourceSpan = new AbsoluteSourceSpan(value.span.start, this.currentAbsoluteOffset);
    return new VariableBinding(sourceSpan, key, value);
  }
  /**
   * Return the binding for a variable declared using `let`. For example,
   * ```
   *   *ngFor="let item of items; let i=index;"
   *           ^^^^^^^^           ^^^^^^^^^^^
   * ```
   * In the first binding, `item` is bound to `NgForOfContext.$implicit`.
   * In the second binding, `i` is bound to `NgForOfContext.index`.
   */
  parseLetBinding() {
    if (!this.peekKeywordLet()) {
      return null;
    }
    const spanStart = this.currentAbsoluteOffset;
    this.advance();
    const key = this.expectTemplateBindingKey();
    let value = null;
    if (this.consumeOptionalOperator("=")) {
      value = this.expectTemplateBindingKey();
    }
    this.consumeStatementTerminator();
    const sourceSpan = new AbsoluteSourceSpan(spanStart, this.currentAbsoluteOffset);
    return new VariableBinding(sourceSpan, key, value);
  }
  /**
   * Consume the optional statement terminator: semicolon or comma.
   */
  consumeStatementTerminator() {
    this.consumeOptionalCharacter($SEMICOLON) || this.consumeOptionalCharacter($COMMA);
  }
  /**
   * Records an error and skips over the token stream until reaching a recoverable point. See
   * `this.skip` for more details on token skipping.
   */
  error(message, index = null) {
    this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
    this.skip();
  }
  locationText(index = null) {
    if (index == null)
      index = this.index;
    return index < this.tokens.length ? `at column ${this.tokens[index].index + 1} in` : `at the end of the expression`;
  }
  /**
   * Records an error for an unexpected private identifier being discovered.
   * @param token Token representing a private identifier.
   * @param extraMessage Optional additional message being appended to the error.
   */
  _reportErrorForPrivateIdentifier(token, extraMessage) {
    let errorMessage = `Private identifiers are not supported. Unexpected private identifier: ${token}`;
    if (extraMessage !== null) {
      errorMessage += `, ${extraMessage}`;
    }
    this.error(errorMessage);
  }
  /**
   * Error recovery should skip tokens until it encounters a recovery point.
   *
   * The following are treated as unconditional recovery points:
   *   - end of input
   *   - ';' (parseChain() is always the root production, and it expects a ';')
   *   - '|' (since pipes may be chained and each pipe expression may be treated independently)
   *
   * The following are conditional recovery points:
   *   - ')', '}', ']' if one of calling productions is expecting one of these symbols
   *     - This allows skip() to recover from errors such as '(a.) + 1' allowing more of the AST to
   *       be retained (it doesn't skip any tokens as the ')' is retained because of the '(' begins
   *       an '(' <expr> ')' production).
   *       The recovery points of grouping symbols must be conditional as they must be skipped if
   *       none of the calling productions are not expecting the closing token else we will never
   *       make progress in the case of an extraneous group closing symbol (such as a stray ')').
   *       That is, we skip a closing symbol if we are not in a grouping production.
   *   - '=' in a `Writable` context
   *     - In this context, we are able to recover after seeing the `=` operator, which
   *       signals the presence of an independent rvalue expression following the `=` operator.
   *
   * If a production expects one of these token it increments the corresponding nesting count,
   * and then decrements it just prior to checking if the token is in the input.
   */
  skip() {
    let n = this.next;
    while (this.index < this.tokens.length && !n.isCharacter($SEMICOLON) && !n.isOperator("|") && (this.rparensExpected <= 0 || !n.isCharacter($RPAREN)) && (this.rbracesExpected <= 0 || !n.isCharacter($RBRACE)) && (this.rbracketsExpected <= 0 || !n.isCharacter($RBRACKET)) && (!(this.context & ParseContextFlags.Writable) || !n.isOperator("="))) {
      if (this.next.isError()) {
        this.errors.push(new ParserError(this.next.toString(), this.input, this.locationText(), this.location));
      }
      this.advance();
      n = this.next;
    }
  }
};
var SimpleExpressionChecker = class extends RecursiveAstVisitor {
  constructor() {
    super(...arguments);
    this.errors = [];
  }
  visitPipe() {
    this.errors.push("pipes");
  }
};
function getIndexMapForOriginalTemplate(interpolatedTokens) {
  let offsetMap = /* @__PURE__ */ new Map();
  let consumedInOriginalTemplate = 0;
  let consumedInInput = 0;
  let tokenIndex = 0;
  while (tokenIndex < interpolatedTokens.length) {
    const currentToken = interpolatedTokens[tokenIndex];
    if (currentToken.type === 9) {
      const [decoded, encoded] = currentToken.parts;
      consumedInOriginalTemplate += encoded.length;
      consumedInInput += decoded.length;
    } else {
      const lengthOfParts = currentToken.parts.reduce((sum, current) => sum + current.length, 0);
      consumedInInput += lengthOfParts;
      consumedInOriginalTemplate += lengthOfParts;
    }
    offsetMap.set(consumedInInput, consumedInOriginalTemplate);
    tokenIndex++;
  }
  return offsetMap;
}
var NodeWithI18n = class {
  constructor(sourceSpan, i18n) {
    this.sourceSpan = sourceSpan;
    this.i18n = i18n;
  }
};
var Text = class extends NodeWithI18n {
  constructor(value, sourceSpan, tokens, i18n) {
    super(sourceSpan, i18n);
    this.value = value;
    this.tokens = tokens;
  }
  visit(visitor, context) {
    return visitor.visitText(this, context);
  }
};
var Expansion = class extends NodeWithI18n {
  constructor(switchValue, type, cases, sourceSpan, switchValueSourceSpan, i18n) {
    super(sourceSpan, i18n);
    this.switchValue = switchValue;
    this.type = type;
    this.cases = cases;
    this.switchValueSourceSpan = switchValueSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitExpansion(this, context);
  }
};
var ExpansionCase = class {
  constructor(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
    this.value = value;
    this.expression = expression;
    this.sourceSpan = sourceSpan;
    this.valueSourceSpan = valueSourceSpan;
    this.expSourceSpan = expSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitExpansionCase(this, context);
  }
};
var Attribute = class extends NodeWithI18n {
  constructor(name, value, sourceSpan, keySpan, valueSpan, valueTokens, i18n) {
    super(sourceSpan, i18n);
    this.name = name;
    this.value = value;
    this.keySpan = keySpan;
    this.valueSpan = valueSpan;
    this.valueTokens = valueTokens;
  }
  visit(visitor, context) {
    return visitor.visitAttribute(this, context);
  }
};
var Element = class extends NodeWithI18n {
  constructor(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan = null, i18n) {
    super(sourceSpan, i18n);
    this.name = name;
    this.attrs = attrs;
    this.children = children;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitElement(this, context);
  }
};
var Comment = class {
  constructor(value, sourceSpan) {
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitComment(this, context);
  }
};
var BlockGroup = class {
  constructor(blocks, sourceSpan, startSourceSpan, endSourceSpan = null) {
    this.blocks = blocks;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitBlockGroup(this, context);
  }
};
var Block = class {
  constructor(name, parameters, children, sourceSpan, startSourceSpan, endSourceSpan = null) {
    this.name = name;
    this.parameters = parameters;
    this.children = children;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitBlock(this, context);
  }
};
var BlockParameter = class {
  constructor(expression, sourceSpan) {
    this.expression = expression;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitBlockParameter(this, context);
  }
};
function visitAll(visitor, nodes, context = null) {
  const result = [];
  const visit = visitor.visit ? (ast) => visitor.visit(ast, context) || ast.visit(visitor, context) : (ast) => ast.visit(visitor, context);
  nodes.forEach((ast) => {
    const astResult = visit(ast);
    if (astResult) {
      result.push(astResult);
    }
  });
  return result;
}
var ElementSchemaRegistry = class {
};
var BOOLEAN = "boolean";
var NUMBER = "number";
var STRING = "string";
var OBJECT = "object";
var SCHEMA = [
  "[Element]|textContent,%ariaAtomic,%ariaAutoComplete,%ariaBusy,%ariaChecked,%ariaColCount,%ariaColIndex,%ariaColSpan,%ariaCurrent,%ariaDescription,%ariaDisabled,%ariaExpanded,%ariaHasPopup,%ariaHidden,%ariaKeyShortcuts,%ariaLabel,%ariaLevel,%ariaLive,%ariaModal,%ariaMultiLine,%ariaMultiSelectable,%ariaOrientation,%ariaPlaceholder,%ariaPosInSet,%ariaPressed,%ariaReadOnly,%ariaRelevant,%ariaRequired,%ariaRoleDescription,%ariaRowCount,%ariaRowIndex,%ariaRowSpan,%ariaSelected,%ariaSetSize,%ariaSort,%ariaValueMax,%ariaValueMin,%ariaValueNow,%ariaValueText,%classList,className,elementTiming,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*fullscreenchange,*fullscreenerror,*search,*webkitfullscreenchange,*webkitfullscreenerror,outerHTML,%part,#scrollLeft,#scrollTop,slot,*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored",
  "[HTMLElement]^[Element]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy",
  "abbr,address,article,aside,b,bdi,bdo,cite,content,code,dd,dfn,dt,em,figcaption,figure,footer,header,hgroup,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy",
  "media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,!preservesPitch,src,%srcObject,#volume",
  ":svg:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,%style,#tabIndex",
  ":svg:graphics^:svg:|",
  ":svg:animation^:svg:|*begin,*end,*repeat",
  ":svg:geometry^:svg:|",
  ":svg:componentTransferFunction^:svg:|",
  ":svg:gradient^:svg:|",
  ":svg:textContent^:svg:graphics|",
  ":svg:textPositioning^:svg:textContent|",
  "a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,rev,search,shape,target,text,type,username",
  "area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,search,shape,target,username",
  "audio^media|",
  "br^[HTMLElement]|clear",
  "base^[HTMLElement]|href,target",
  "body^[HTMLElement]|aLink,background,bgColor,link,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink",
  "button^[HTMLElement]|!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value",
  "canvas^[HTMLElement]|#height,#width",
  "content^[HTMLElement]|select",
  "dl^[HTMLElement]|!compact",
  "data^[HTMLElement]|value",
  "datalist^[HTMLElement]|",
  "details^[HTMLElement]|!open",
  "dialog^[HTMLElement]|!open,returnValue",
  "dir^[HTMLElement]|!compact",
  "div^[HTMLElement]|align",
  "embed^[HTMLElement]|align,height,name,src,type,width",
  "fieldset^[HTMLElement]|!disabled,name",
  "font^[HTMLElement]|color,face,size",
  "form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target",
  "frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src",
  "frameset^[HTMLElement]|cols,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows",
  "hr^[HTMLElement]|align,color,!noShade,size,width",
  "head^[HTMLElement]|",
  "h1,h2,h3,h4,h5,h6^[HTMLElement]|align",
  "html^[HTMLElement]|version",
  "iframe^[HTMLElement]|align,allow,!allowFullscreen,!allowPaymentRequest,csp,frameBorder,height,loading,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width",
  "img^[HTMLElement]|align,alt,border,%crossOrigin,decoding,#height,#hspace,!isMap,loading,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width",
  "input^[HTMLElement]|accept,align,alt,autocomplete,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width",
  "li^[HTMLElement]|type,#value",
  "label^[HTMLElement]|htmlFor",
  "legend^[HTMLElement]|align",
  "link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,imageSizes,imageSrcset,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type",
  "map^[HTMLElement]|name",
  "marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width",
  "menu^[HTMLElement]|!compact",
  "meta^[HTMLElement]|content,httpEquiv,media,name,scheme",
  "meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value",
  "ins,del^[HTMLElement]|cite,dateTime",
  "ol^[HTMLElement]|!compact,!reversed,#start,type",
  "object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width",
  "optgroup^[HTMLElement]|!disabled,label",
  "option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value",
  "output^[HTMLElement]|defaultValue,%htmlFor,name,value",
  "p^[HTMLElement]|align",
  "param^[HTMLElement]|name,type,value,valueType",
  "picture^[HTMLElement]|",
  "pre^[HTMLElement]|#width",
  "progress^[HTMLElement]|#max,#value",
  "q,blockquote,cite^[HTMLElement]|",
  "script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,!noModule,%referrerPolicy,src,text,type",
  "select^[HTMLElement]|autocomplete,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value",
  "slot^[HTMLElement]|name",
  "source^[HTMLElement]|#height,media,sizes,src,srcset,type,#width",
  "span^[HTMLElement]|",
  "style^[HTMLElement]|!disabled,media,type",
  "caption^[HTMLElement]|align",
  "th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width",
  "col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width",
  "table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width",
  "tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign",
  "tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign",
  "template^[HTMLElement]|",
  "textarea^[HTMLElement]|autocomplete,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap",
  "time^[HTMLElement]|dateTime",
  "title^[HTMLElement]|text",
  "track^[HTMLElement]|!default,kind,label,src,srclang",
  "ul^[HTMLElement]|!compact,type",
  "unknown^[HTMLElement]|",
  "video^media|!disablePictureInPicture,#height,*enterpictureinpicture,*leavepictureinpicture,!playsInline,poster,#width",
  ":svg:a^:svg:graphics|",
  ":svg:animate^:svg:animation|",
  ":svg:animateMotion^:svg:animation|",
  ":svg:animateTransform^:svg:animation|",
  ":svg:circle^:svg:geometry|",
  ":svg:clipPath^:svg:graphics|",
  ":svg:defs^:svg:graphics|",
  ":svg:desc^:svg:|",
  ":svg:discard^:svg:|",
  ":svg:ellipse^:svg:geometry|",
  ":svg:feBlend^:svg:|",
  ":svg:feColorMatrix^:svg:|",
  ":svg:feComponentTransfer^:svg:|",
  ":svg:feComposite^:svg:|",
  ":svg:feConvolveMatrix^:svg:|",
  ":svg:feDiffuseLighting^:svg:|",
  ":svg:feDisplacementMap^:svg:|",
  ":svg:feDistantLight^:svg:|",
  ":svg:feDropShadow^:svg:|",
  ":svg:feFlood^:svg:|",
  ":svg:feFuncA^:svg:componentTransferFunction|",
  ":svg:feFuncB^:svg:componentTransferFunction|",
  ":svg:feFuncG^:svg:componentTransferFunction|",
  ":svg:feFuncR^:svg:componentTransferFunction|",
  ":svg:feGaussianBlur^:svg:|",
  ":svg:feImage^:svg:|",
  ":svg:feMerge^:svg:|",
  ":svg:feMergeNode^:svg:|",
  ":svg:feMorphology^:svg:|",
  ":svg:feOffset^:svg:|",
  ":svg:fePointLight^:svg:|",
  ":svg:feSpecularLighting^:svg:|",
  ":svg:feSpotLight^:svg:|",
  ":svg:feTile^:svg:|",
  ":svg:feTurbulence^:svg:|",
  ":svg:filter^:svg:|",
  ":svg:foreignObject^:svg:graphics|",
  ":svg:g^:svg:graphics|",
  ":svg:image^:svg:graphics|decoding",
  ":svg:line^:svg:geometry|",
  ":svg:linearGradient^:svg:gradient|",
  ":svg:mpath^:svg:|",
  ":svg:marker^:svg:|",
  ":svg:mask^:svg:|",
  ":svg:metadata^:svg:|",
  ":svg:path^:svg:geometry|",
  ":svg:pattern^:svg:|",
  ":svg:polygon^:svg:geometry|",
  ":svg:polyline^:svg:geometry|",
  ":svg:radialGradient^:svg:gradient|",
  ":svg:rect^:svg:geometry|",
  ":svg:svg^:svg:graphics|#currentScale,#zoomAndPan",
  ":svg:script^:svg:|type",
  ":svg:set^:svg:animation|",
  ":svg:stop^:svg:|",
  ":svg:style^:svg:|!disabled,media,title,type",
  ":svg:switch^:svg:graphics|",
  ":svg:symbol^:svg:|",
  ":svg:tspan^:svg:textPositioning|",
  ":svg:text^:svg:textPositioning|",
  ":svg:textPath^:svg:textContent|",
  ":svg:title^:svg:|",
  ":svg:use^:svg:graphics|",
  ":svg:view^:svg:|#zoomAndPan",
  "data^[HTMLElement]|value",
  "keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name",
  "menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default",
  "summary^[HTMLElement]|",
  "time^[HTMLElement]|dateTime",
  ":svg:cursor^:svg:|"
];
var _ATTR_TO_PROP = new Map(Object.entries({
  "class": "className",
  "for": "htmlFor",
  "formaction": "formAction",
  "innerHtml": "innerHTML",
  "readonly": "readOnly",
  "tabindex": "tabIndex"
}));
var _PROP_TO_ATTR = Array.from(_ATTR_TO_PROP).reduce((inverted, [propertyName, attributeName]) => {
  inverted.set(propertyName, attributeName);
  return inverted;
}, /* @__PURE__ */ new Map());
var DomElementSchemaRegistry = class extends ElementSchemaRegistry {
  constructor() {
    super();
    this._schema = /* @__PURE__ */ new Map();
    this._eventSchema = /* @__PURE__ */ new Map();
    SCHEMA.forEach((encodedType) => {
      const type = /* @__PURE__ */ new Map();
      const events = /* @__PURE__ */ new Set();
      const [strType, strProperties] = encodedType.split("|");
      const properties = strProperties.split(",");
      const [typeNames, superName] = strType.split("^");
      typeNames.split(",").forEach((tag) => {
        this._schema.set(tag.toLowerCase(), type);
        this._eventSchema.set(tag.toLowerCase(), events);
      });
      const superType = superName && this._schema.get(superName.toLowerCase());
      if (superType) {
        for (const [prop, value] of superType) {
          type.set(prop, value);
        }
        for (const superEvent of this._eventSchema.get(superName.toLowerCase())) {
          events.add(superEvent);
        }
      }
      properties.forEach((property2) => {
        if (property2.length > 0) {
          switch (property2[0]) {
            case "*":
              events.add(property2.substring(1));
              break;
            case "!":
              type.set(property2.substring(1), BOOLEAN);
              break;
            case "#":
              type.set(property2.substring(1), NUMBER);
              break;
            case "%":
              type.set(property2.substring(1), OBJECT);
              break;
            default:
              type.set(property2, STRING);
          }
        }
      });
    });
  }
  hasProperty(tagName, propName, schemaMetas) {
    if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
      return true;
    }
    if (tagName.indexOf("-") > -1) {
      if (isNgContainer(tagName) || isNgContent(tagName)) {
        return false;
      }
      if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
        return true;
      }
    }
    const elementProperties = this._schema.get(tagName.toLowerCase()) || this._schema.get("unknown");
    return elementProperties.has(propName);
  }
  hasElement(tagName, schemaMetas) {
    if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
      return true;
    }
    if (tagName.indexOf("-") > -1) {
      if (isNgContainer(tagName) || isNgContent(tagName)) {
        return true;
      }
      if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
        return true;
      }
    }
    return this._schema.has(tagName.toLowerCase());
  }
  /**
   * securityContext returns the security context for the given property on the given DOM tag.
   *
   * Tag and property name are statically known and cannot change at runtime, i.e. it is not
   * possible to bind a value into a changing attribute or tag name.
   *
   * The filtering is based on a list of allowed tags|attributes. All attributes in the schema
   * above are assumed to have the 'NONE' security context, i.e. that they are safe inert
   * string values. Only specific well known attack vectors are assigned their appropriate context.
   */
  securityContext(tagName, propName, isAttribute) {
    if (isAttribute) {
      propName = this.getMappedPropName(propName);
    }
    tagName = tagName.toLowerCase();
    propName = propName.toLowerCase();
    let ctx = SECURITY_SCHEMA()[tagName + "|" + propName];
    if (ctx) {
      return ctx;
    }
    ctx = SECURITY_SCHEMA()["*|" + propName];
    return ctx ? ctx : SecurityContext.NONE;
  }
  getMappedPropName(propName) {
    return _ATTR_TO_PROP.get(propName) ?? propName;
  }
  getDefaultComponentElementName() {
    return "ng-component";
  }
  validateProperty(name) {
    if (name.toLowerCase().startsWith("on")) {
      const msg = `Binding to event property '${name}' is disallowed for security reasons, please use (${name.slice(2)})=...
If '${name}' is a directive input, make sure the directive is imported by the current module.`;
      return { error: true, msg };
    } else {
      return { error: false };
    }
  }
  validateAttribute(name) {
    if (name.toLowerCase().startsWith("on")) {
      const msg = `Binding to event attribute '${name}' is disallowed for security reasons, please use (${name.slice(2)})=...`;
      return { error: true, msg };
    } else {
      return { error: false };
    }
  }
  allKnownElementNames() {
    return Array.from(this._schema.keys());
  }
  allKnownAttributesOfElement(tagName) {
    const elementProperties = this._schema.get(tagName.toLowerCase()) || this._schema.get("unknown");
    return Array.from(elementProperties.keys()).map((prop) => _PROP_TO_ATTR.get(prop) ?? prop);
  }
  allKnownEventsOfElement(tagName) {
    return Array.from(this._eventSchema.get(tagName.toLowerCase()) ?? []);
  }
  normalizeAnimationStyleProperty(propName) {
    return dashCaseToCamelCase(propName);
  }
  normalizeAnimationStyleValue(camelCaseProp, userProvidedProp, val) {
    let unit = "";
    const strVal = val.toString().trim();
    let errorMsg = null;
    if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== "0") {
      if (typeof val === "number") {
        unit = "px";
      } else {
        const valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
        if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
          errorMsg = `Please provide a CSS unit value for ${userProvidedProp}:${val}`;
        }
      }
    }
    return { error: errorMsg, value: strVal + unit };
  }
};
function _isPixelDimensionStyle(prop) {
  switch (prop) {
    case "width":
    case "height":
    case "minWidth":
    case "minHeight":
    case "maxWidth":
    case "maxHeight":
    case "left":
    case "top":
    case "bottom":
    case "right":
    case "fontSize":
    case "outlineWidth":
    case "outlineOffset":
    case "paddingTop":
    case "paddingLeft":
    case "paddingBottom":
    case "paddingRight":
    case "marginTop":
    case "marginLeft":
    case "marginBottom":
    case "marginRight":
    case "borderRadius":
    case "borderWidth":
    case "borderTopWidth":
    case "borderLeftWidth":
    case "borderRightWidth":
    case "borderBottomWidth":
    case "textIndent":
      return true;
    default:
      return false;
  }
}
var HtmlTagDefinition = class {
  constructor({ closedByChildren, implicitNamespacePrefix, contentType = TagContentType.PARSABLE_DATA, closedByParent = false, isVoid = false, ignoreFirstLf = false, preventNamespaceInheritance = false, canSelfClose = false } = {}) {
    this.closedByChildren = {};
    this.closedByParent = false;
    if (closedByChildren && closedByChildren.length > 0) {
      closedByChildren.forEach((tagName) => this.closedByChildren[tagName] = true);
    }
    this.isVoid = isVoid;
    this.closedByParent = closedByParent || isVoid;
    this.implicitNamespacePrefix = implicitNamespacePrefix || null;
    this.contentType = contentType;
    this.ignoreFirstLf = ignoreFirstLf;
    this.preventNamespaceInheritance = preventNamespaceInheritance;
    this.canSelfClose = canSelfClose ?? isVoid;
  }
  isClosedByChild(name) {
    return this.isVoid || name.toLowerCase() in this.closedByChildren;
  }
  getContentType(prefix) {
    if (typeof this.contentType === "object") {
      const overrideType = prefix === void 0 ? void 0 : this.contentType[prefix];
      return overrideType ?? this.contentType.default;
    }
    return this.contentType;
  }
};
var DEFAULT_TAG_DEFINITION;
var TAG_DEFINITIONS;
function getHtmlTagDefinition(tagName) {
  if (!TAG_DEFINITIONS) {
    DEFAULT_TAG_DEFINITION = new HtmlTagDefinition({ canSelfClose: true });
    TAG_DEFINITIONS = {
      "base": new HtmlTagDefinition({ isVoid: true }),
      "meta": new HtmlTagDefinition({ isVoid: true }),
      "area": new HtmlTagDefinition({ isVoid: true }),
      "embed": new HtmlTagDefinition({ isVoid: true }),
      "link": new HtmlTagDefinition({ isVoid: true }),
      "img": new HtmlTagDefinition({ isVoid: true }),
      "input": new HtmlTagDefinition({ isVoid: true }),
      "param": new HtmlTagDefinition({ isVoid: true }),
      "hr": new HtmlTagDefinition({ isVoid: true }),
      "br": new HtmlTagDefinition({ isVoid: true }),
      "source": new HtmlTagDefinition({ isVoid: true }),
      "track": new HtmlTagDefinition({ isVoid: true }),
      "wbr": new HtmlTagDefinition({ isVoid: true }),
      "p": new HtmlTagDefinition({
        closedByChildren: [
          "address",
          "article",
          "aside",
          "blockquote",
          "div",
          "dl",
          "fieldset",
          "footer",
          "form",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "header",
          "hgroup",
          "hr",
          "main",
          "nav",
          "ol",
          "p",
          "pre",
          "section",
          "table",
          "ul"
        ],
        closedByParent: true
      }),
      "thead": new HtmlTagDefinition({ closedByChildren: ["tbody", "tfoot"] }),
      "tbody": new HtmlTagDefinition({ closedByChildren: ["tbody", "tfoot"], closedByParent: true }),
      "tfoot": new HtmlTagDefinition({ closedByChildren: ["tbody"], closedByParent: true }),
      "tr": new HtmlTagDefinition({ closedByChildren: ["tr"], closedByParent: true }),
      "td": new HtmlTagDefinition({ closedByChildren: ["td", "th"], closedByParent: true }),
      "th": new HtmlTagDefinition({ closedByChildren: ["td", "th"], closedByParent: true }),
      "col": new HtmlTagDefinition({ isVoid: true }),
      "svg": new HtmlTagDefinition({ implicitNamespacePrefix: "svg" }),
      "foreignObject": new HtmlTagDefinition({
        // Usually the implicit namespace here would be redundant since it will be inherited from
        // the parent `svg`, but we have to do it for `foreignObject`, because the way the parser
        // works is that the parent node of an end tag is its own start tag which means that
        // the `preventNamespaceInheritance` on `foreignObject` would have it default to the
        // implicit namespace which is `html`, unless specified otherwise.
        implicitNamespacePrefix: "svg",
        // We want to prevent children of foreignObject from inheriting its namespace, because
        // the point of the element is to allow nodes from other namespaces to be inserted.
        preventNamespaceInheritance: true
      }),
      "math": new HtmlTagDefinition({ implicitNamespacePrefix: "math" }),
      "li": new HtmlTagDefinition({ closedByChildren: ["li"], closedByParent: true }),
      "dt": new HtmlTagDefinition({ closedByChildren: ["dt", "dd"] }),
      "dd": new HtmlTagDefinition({ closedByChildren: ["dt", "dd"], closedByParent: true }),
      "rb": new HtmlTagDefinition({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: true }),
      "rt": new HtmlTagDefinition({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: true }),
      "rtc": new HtmlTagDefinition({ closedByChildren: ["rb", "rtc", "rp"], closedByParent: true }),
      "rp": new HtmlTagDefinition({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: true }),
      "optgroup": new HtmlTagDefinition({ closedByChildren: ["optgroup"], closedByParent: true }),
      "option": new HtmlTagDefinition({ closedByChildren: ["option", "optgroup"], closedByParent: true }),
      "pre": new HtmlTagDefinition({ ignoreFirstLf: true }),
      "listing": new HtmlTagDefinition({ ignoreFirstLf: true }),
      "style": new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
      "script": new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
      "title": new HtmlTagDefinition({
        // The browser supports two separate `title` tags which have to use
        // a different content type: `HTMLTitleElement` and `SVGTitleElement`
        contentType: { default: TagContentType.ESCAPABLE_RAW_TEXT, svg: TagContentType.PARSABLE_DATA }
      }),
      "textarea": new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true })
    };
    new DomElementSchemaRegistry().allKnownElementNames().forEach((knownTagName) => {
      if (!TAG_DEFINITIONS.hasOwnProperty(knownTagName) && getNsPrefix(knownTagName) === null) {
        TAG_DEFINITIONS[knownTagName] = new HtmlTagDefinition({ canSelfClose: false });
      }
    });
  }
  return TAG_DEFINITIONS[tagName] ?? TAG_DEFINITIONS[tagName.toLowerCase()] ?? DEFAULT_TAG_DEFINITION;
}
var NAMED_ENTITIES = {
  "AElig": "\xC6",
  "AMP": "&",
  "amp": "&",
  "Aacute": "\xC1",
  "Abreve": "\u0102",
  "Acirc": "\xC2",
  "Acy": "\u0410",
  "Afr": "\u{1D504}",
  "Agrave": "\xC0",
  "Alpha": "\u0391",
  "Amacr": "\u0100",
  "And": "\u2A53",
  "Aogon": "\u0104",
  "Aopf": "\u{1D538}",
  "ApplyFunction": "\u2061",
  "af": "\u2061",
  "Aring": "\xC5",
  "angst": "\xC5",
  "Ascr": "\u{1D49C}",
  "Assign": "\u2254",
  "colone": "\u2254",
  "coloneq": "\u2254",
  "Atilde": "\xC3",
  "Auml": "\xC4",
  "Backslash": "\u2216",
  "setminus": "\u2216",
  "setmn": "\u2216",
  "smallsetminus": "\u2216",
  "ssetmn": "\u2216",
  "Barv": "\u2AE7",
  "Barwed": "\u2306",
  "doublebarwedge": "\u2306",
  "Bcy": "\u0411",
  "Because": "\u2235",
  "becaus": "\u2235",
  "because": "\u2235",
  "Bernoullis": "\u212C",
  "Bscr": "\u212C",
  "bernou": "\u212C",
  "Beta": "\u0392",
  "Bfr": "\u{1D505}",
  "Bopf": "\u{1D539}",
  "Breve": "\u02D8",
  "breve": "\u02D8",
  "Bumpeq": "\u224E",
  "HumpDownHump": "\u224E",
  "bump": "\u224E",
  "CHcy": "\u0427",
  "COPY": "\xA9",
  "copy": "\xA9",
  "Cacute": "\u0106",
  "Cap": "\u22D2",
  "CapitalDifferentialD": "\u2145",
  "DD": "\u2145",
  "Cayleys": "\u212D",
  "Cfr": "\u212D",
  "Ccaron": "\u010C",
  "Ccedil": "\xC7",
  "Ccirc": "\u0108",
  "Cconint": "\u2230",
  "Cdot": "\u010A",
  "Cedilla": "\xB8",
  "cedil": "\xB8",
  "CenterDot": "\xB7",
  "centerdot": "\xB7",
  "middot": "\xB7",
  "Chi": "\u03A7",
  "CircleDot": "\u2299",
  "odot": "\u2299",
  "CircleMinus": "\u2296",
  "ominus": "\u2296",
  "CirclePlus": "\u2295",
  "oplus": "\u2295",
  "CircleTimes": "\u2297",
  "otimes": "\u2297",
  "ClockwiseContourIntegral": "\u2232",
  "cwconint": "\u2232",
  "CloseCurlyDoubleQuote": "\u201D",
  "rdquo": "\u201D",
  "rdquor": "\u201D",
  "CloseCurlyQuote": "\u2019",
  "rsquo": "\u2019",
  "rsquor": "\u2019",
  "Colon": "\u2237",
  "Proportion": "\u2237",
  "Colone": "\u2A74",
  "Congruent": "\u2261",
  "equiv": "\u2261",
  "Conint": "\u222F",
  "DoubleContourIntegral": "\u222F",
  "ContourIntegral": "\u222E",
  "conint": "\u222E",
  "oint": "\u222E",
  "Copf": "\u2102",
  "complexes": "\u2102",
  "Coproduct": "\u2210",
  "coprod": "\u2210",
  "CounterClockwiseContourIntegral": "\u2233",
  "awconint": "\u2233",
  "Cross": "\u2A2F",
  "Cscr": "\u{1D49E}",
  "Cup": "\u22D3",
  "CupCap": "\u224D",
  "asympeq": "\u224D",
  "DDotrahd": "\u2911",
  "DJcy": "\u0402",
  "DScy": "\u0405",
  "DZcy": "\u040F",
  "Dagger": "\u2021",
  "ddagger": "\u2021",
  "Darr": "\u21A1",
  "Dashv": "\u2AE4",
  "DoubleLeftTee": "\u2AE4",
  "Dcaron": "\u010E",
  "Dcy": "\u0414",
  "Del": "\u2207",
  "nabla": "\u2207",
  "Delta": "\u0394",
  "Dfr": "\u{1D507}",
  "DiacriticalAcute": "\xB4",
  "acute": "\xB4",
  "DiacriticalDot": "\u02D9",
  "dot": "\u02D9",
  "DiacriticalDoubleAcute": "\u02DD",
  "dblac": "\u02DD",
  "DiacriticalGrave": "`",
  "grave": "`",
  "DiacriticalTilde": "\u02DC",
  "tilde": "\u02DC",
  "Diamond": "\u22C4",
  "diam": "\u22C4",
  "diamond": "\u22C4",
  "DifferentialD": "\u2146",
  "dd": "\u2146",
  "Dopf": "\u{1D53B}",
  "Dot": "\xA8",
  "DoubleDot": "\xA8",
  "die": "\xA8",
  "uml": "\xA8",
  "DotDot": "\u20DC",
  "DotEqual": "\u2250",
  "doteq": "\u2250",
  "esdot": "\u2250",
  "DoubleDownArrow": "\u21D3",
  "Downarrow": "\u21D3",
  "dArr": "\u21D3",
  "DoubleLeftArrow": "\u21D0",
  "Leftarrow": "\u21D0",
  "lArr": "\u21D0",
  "DoubleLeftRightArrow": "\u21D4",
  "Leftrightarrow": "\u21D4",
  "hArr": "\u21D4",
  "iff": "\u21D4",
  "DoubleLongLeftArrow": "\u27F8",
  "Longleftarrow": "\u27F8",
  "xlArr": "\u27F8",
  "DoubleLongLeftRightArrow": "\u27FA",
  "Longleftrightarrow": "\u27FA",
  "xhArr": "\u27FA",
  "DoubleLongRightArrow": "\u27F9",
  "Longrightarrow": "\u27F9",
  "xrArr": "\u27F9",
  "DoubleRightArrow": "\u21D2",
  "Implies": "\u21D2",
  "Rightarrow": "\u21D2",
  "rArr": "\u21D2",
  "DoubleRightTee": "\u22A8",
  "vDash": "\u22A8",
  "DoubleUpArrow": "\u21D1",
  "Uparrow": "\u21D1",
  "uArr": "\u21D1",
  "DoubleUpDownArrow": "\u21D5",
  "Updownarrow": "\u21D5",
  "vArr": "\u21D5",
  "DoubleVerticalBar": "\u2225",
  "par": "\u2225",
  "parallel": "\u2225",
  "shortparallel": "\u2225",
  "spar": "\u2225",
  "DownArrow": "\u2193",
  "ShortDownArrow": "\u2193",
  "darr": "\u2193",
  "downarrow": "\u2193",
  "DownArrowBar": "\u2913",
  "DownArrowUpArrow": "\u21F5",
  "duarr": "\u21F5",
  "DownBreve": "\u0311",
  "DownLeftRightVector": "\u2950",
  "DownLeftTeeVector": "\u295E",
  "DownLeftVector": "\u21BD",
  "leftharpoondown": "\u21BD",
  "lhard": "\u21BD",
  "DownLeftVectorBar": "\u2956",
  "DownRightTeeVector": "\u295F",
  "DownRightVector": "\u21C1",
  "rhard": "\u21C1",
  "rightharpoondown": "\u21C1",
  "DownRightVectorBar": "\u2957",
  "DownTee": "\u22A4",
  "top": "\u22A4",
  "DownTeeArrow": "\u21A7",
  "mapstodown": "\u21A7",
  "Dscr": "\u{1D49F}",
  "Dstrok": "\u0110",
  "ENG": "\u014A",
  "ETH": "\xD0",
  "Eacute": "\xC9",
  "Ecaron": "\u011A",
  "Ecirc": "\xCA",
  "Ecy": "\u042D",
  "Edot": "\u0116",
  "Efr": "\u{1D508}",
  "Egrave": "\xC8",
  "Element": "\u2208",
  "in": "\u2208",
  "isin": "\u2208",
  "isinv": "\u2208",
  "Emacr": "\u0112",
  "EmptySmallSquare": "\u25FB",
  "EmptyVerySmallSquare": "\u25AB",
  "Eogon": "\u0118",
  "Eopf": "\u{1D53C}",
  "Epsilon": "\u0395",
  "Equal": "\u2A75",
  "EqualTilde": "\u2242",
  "eqsim": "\u2242",
  "esim": "\u2242",
  "Equilibrium": "\u21CC",
  "rightleftharpoons": "\u21CC",
  "rlhar": "\u21CC",
  "Escr": "\u2130",
  "expectation": "\u2130",
  "Esim": "\u2A73",
  "Eta": "\u0397",
  "Euml": "\xCB",
  "Exists": "\u2203",
  "exist": "\u2203",
  "ExponentialE": "\u2147",
  "ee": "\u2147",
  "exponentiale": "\u2147",
  "Fcy": "\u0424",
  "Ffr": "\u{1D509}",
  "FilledSmallSquare": "\u25FC",
  "FilledVerySmallSquare": "\u25AA",
  "blacksquare": "\u25AA",
  "squarf": "\u25AA",
  "squf": "\u25AA",
  "Fopf": "\u{1D53D}",
  "ForAll": "\u2200",
  "forall": "\u2200",
  "Fouriertrf": "\u2131",
  "Fscr": "\u2131",
  "GJcy": "\u0403",
  "GT": ">",
  "gt": ">",
  "Gamma": "\u0393",
  "Gammad": "\u03DC",
  "Gbreve": "\u011E",
  "Gcedil": "\u0122",
  "Gcirc": "\u011C",
  "Gcy": "\u0413",
  "Gdot": "\u0120",
  "Gfr": "\u{1D50A}",
  "Gg": "\u22D9",
  "ggg": "\u22D9",
  "Gopf": "\u{1D53E}",
  "GreaterEqual": "\u2265",
  "ge": "\u2265",
  "geq": "\u2265",
  "GreaterEqualLess": "\u22DB",
  "gel": "\u22DB",
  "gtreqless": "\u22DB",
  "GreaterFullEqual": "\u2267",
  "gE": "\u2267",
  "geqq": "\u2267",
  "GreaterGreater": "\u2AA2",
  "GreaterLess": "\u2277",
  "gl": "\u2277",
  "gtrless": "\u2277",
  "GreaterSlantEqual": "\u2A7E",
  "geqslant": "\u2A7E",
  "ges": "\u2A7E",
  "GreaterTilde": "\u2273",
  "gsim": "\u2273",
  "gtrsim": "\u2273",
  "Gscr": "\u{1D4A2}",
  "Gt": "\u226B",
  "NestedGreaterGreater": "\u226B",
  "gg": "\u226B",
  "HARDcy": "\u042A",
  "Hacek": "\u02C7",
  "caron": "\u02C7",
  "Hat": "^",
  "Hcirc": "\u0124",
  "Hfr": "\u210C",
  "Poincareplane": "\u210C",
  "HilbertSpace": "\u210B",
  "Hscr": "\u210B",
  "hamilt": "\u210B",
  "Hopf": "\u210D",
  "quaternions": "\u210D",
  "HorizontalLine": "\u2500",
  "boxh": "\u2500",
  "Hstrok": "\u0126",
  "HumpEqual": "\u224F",
  "bumpe": "\u224F",
  "bumpeq": "\u224F",
  "IEcy": "\u0415",
  "IJlig": "\u0132",
  "IOcy": "\u0401",
  "Iacute": "\xCD",
  "Icirc": "\xCE",
  "Icy": "\u0418",
  "Idot": "\u0130",
  "Ifr": "\u2111",
  "Im": "\u2111",
  "image": "\u2111",
  "imagpart": "\u2111",
  "Igrave": "\xCC",
  "Imacr": "\u012A",
  "ImaginaryI": "\u2148",
  "ii": "\u2148",
  "Int": "\u222C",
  "Integral": "\u222B",
  "int": "\u222B",
  "Intersection": "\u22C2",
  "bigcap": "\u22C2",
  "xcap": "\u22C2",
  "InvisibleComma": "\u2063",
  "ic": "\u2063",
  "InvisibleTimes": "\u2062",
  "it": "\u2062",
  "Iogon": "\u012E",
  "Iopf": "\u{1D540}",
  "Iota": "\u0399",
  "Iscr": "\u2110",
  "imagline": "\u2110",
  "Itilde": "\u0128",
  "Iukcy": "\u0406",
  "Iuml": "\xCF",
  "Jcirc": "\u0134",
  "Jcy": "\u0419",
  "Jfr": "\u{1D50D}",
  "Jopf": "\u{1D541}",
  "Jscr": "\u{1D4A5}",
  "Jsercy": "\u0408",
  "Jukcy": "\u0404",
  "KHcy": "\u0425",
  "KJcy": "\u040C",
  "Kappa": "\u039A",
  "Kcedil": "\u0136",
  "Kcy": "\u041A",
  "Kfr": "\u{1D50E}",
  "Kopf": "\u{1D542}",
  "Kscr": "\u{1D4A6}",
  "LJcy": "\u0409",
  "LT": "<",
  "lt": "<",
  "Lacute": "\u0139",
  "Lambda": "\u039B",
  "Lang": "\u27EA",
  "Laplacetrf": "\u2112",
  "Lscr": "\u2112",
  "lagran": "\u2112",
  "Larr": "\u219E",
  "twoheadleftarrow": "\u219E",
  "Lcaron": "\u013D",
  "Lcedil": "\u013B",
  "Lcy": "\u041B",
  "LeftAngleBracket": "\u27E8",
  "lang": "\u27E8",
  "langle": "\u27E8",
  "LeftArrow": "\u2190",
  "ShortLeftArrow": "\u2190",
  "larr": "\u2190",
  "leftarrow": "\u2190",
  "slarr": "\u2190",
  "LeftArrowBar": "\u21E4",
  "larrb": "\u21E4",
  "LeftArrowRightArrow": "\u21C6",
  "leftrightarrows": "\u21C6",
  "lrarr": "\u21C6",
  "LeftCeiling": "\u2308",
  "lceil": "\u2308",
  "LeftDoubleBracket": "\u27E6",
  "lobrk": "\u27E6",
  "LeftDownTeeVector": "\u2961",
  "LeftDownVector": "\u21C3",
  "dharl": "\u21C3",
  "downharpoonleft": "\u21C3",
  "LeftDownVectorBar": "\u2959",
  "LeftFloor": "\u230A",
  "lfloor": "\u230A",
  "LeftRightArrow": "\u2194",
  "harr": "\u2194",
  "leftrightarrow": "\u2194",
  "LeftRightVector": "\u294E",
  "LeftTee": "\u22A3",
  "dashv": "\u22A3",
  "LeftTeeArrow": "\u21A4",
  "mapstoleft": "\u21A4",
  "LeftTeeVector": "\u295A",
  "LeftTriangle": "\u22B2",
  "vartriangleleft": "\u22B2",
  "vltri": "\u22B2",
  "LeftTriangleBar": "\u29CF",
  "LeftTriangleEqual": "\u22B4",
  "ltrie": "\u22B4",
  "trianglelefteq": "\u22B4",
  "LeftUpDownVector": "\u2951",
  "LeftUpTeeVector": "\u2960",
  "LeftUpVector": "\u21BF",
  "uharl": "\u21BF",
  "upharpoonleft": "\u21BF",
  "LeftUpVectorBar": "\u2958",
  "LeftVector": "\u21BC",
  "leftharpoonup": "\u21BC",
  "lharu": "\u21BC",
  "LeftVectorBar": "\u2952",
  "LessEqualGreater": "\u22DA",
  "leg": "\u22DA",
  "lesseqgtr": "\u22DA",
  "LessFullEqual": "\u2266",
  "lE": "\u2266",
  "leqq": "\u2266",
  "LessGreater": "\u2276",
  "lessgtr": "\u2276",
  "lg": "\u2276",
  "LessLess": "\u2AA1",
  "LessSlantEqual": "\u2A7D",
  "leqslant": "\u2A7D",
  "les": "\u2A7D",
  "LessTilde": "\u2272",
  "lesssim": "\u2272",
  "lsim": "\u2272",
  "Lfr": "\u{1D50F}",
  "Ll": "\u22D8",
  "Lleftarrow": "\u21DA",
  "lAarr": "\u21DA",
  "Lmidot": "\u013F",
  "LongLeftArrow": "\u27F5",
  "longleftarrow": "\u27F5",
  "xlarr": "\u27F5",
  "LongLeftRightArrow": "\u27F7",
  "longleftrightarrow": "\u27F7",
  "xharr": "\u27F7",
  "LongRightArrow": "\u27F6",
  "longrightarrow": "\u27F6",
  "xrarr": "\u27F6",
  "Lopf": "\u{1D543}",
  "LowerLeftArrow": "\u2199",
  "swarr": "\u2199",
  "swarrow": "\u2199",
  "LowerRightArrow": "\u2198",
  "searr": "\u2198",
  "searrow": "\u2198",
  "Lsh": "\u21B0",
  "lsh": "\u21B0",
  "Lstrok": "\u0141",
  "Lt": "\u226A",
  "NestedLessLess": "\u226A",
  "ll": "\u226A",
  "Map": "\u2905",
  "Mcy": "\u041C",
  "MediumSpace": "\u205F",
  "Mellintrf": "\u2133",
  "Mscr": "\u2133",
  "phmmat": "\u2133",
  "Mfr": "\u{1D510}",
  "MinusPlus": "\u2213",
  "mnplus": "\u2213",
  "mp": "\u2213",
  "Mopf": "\u{1D544}",
  "Mu": "\u039C",
  "NJcy": "\u040A",
  "Nacute": "\u0143",
  "Ncaron": "\u0147",
  "Ncedil": "\u0145",
  "Ncy": "\u041D",
  "NegativeMediumSpace": "\u200B",
  "NegativeThickSpace": "\u200B",
  "NegativeThinSpace": "\u200B",
  "NegativeVeryThinSpace": "\u200B",
  "ZeroWidthSpace": "\u200B",
  "NewLine": "\n",
  "Nfr": "\u{1D511}",
  "NoBreak": "\u2060",
  "NonBreakingSpace": "\xA0",
  "nbsp": "\xA0",
  "Nopf": "\u2115",
  "naturals": "\u2115",
  "Not": "\u2AEC",
  "NotCongruent": "\u2262",
  "nequiv": "\u2262",
  "NotCupCap": "\u226D",
  "NotDoubleVerticalBar": "\u2226",
  "npar": "\u2226",
  "nparallel": "\u2226",
  "nshortparallel": "\u2226",
  "nspar": "\u2226",
  "NotElement": "\u2209",
  "notin": "\u2209",
  "notinva": "\u2209",
  "NotEqual": "\u2260",
  "ne": "\u2260",
  "NotEqualTilde": "\u2242\u0338",
  "nesim": "\u2242\u0338",
  "NotExists": "\u2204",
  "nexist": "\u2204",
  "nexists": "\u2204",
  "NotGreater": "\u226F",
  "ngt": "\u226F",
  "ngtr": "\u226F",
  "NotGreaterEqual": "\u2271",
  "nge": "\u2271",
  "ngeq": "\u2271",
  "NotGreaterFullEqual": "\u2267\u0338",
  "ngE": "\u2267\u0338",
  "ngeqq": "\u2267\u0338",
  "NotGreaterGreater": "\u226B\u0338",
  "nGtv": "\u226B\u0338",
  "NotGreaterLess": "\u2279",
  "ntgl": "\u2279",
  "NotGreaterSlantEqual": "\u2A7E\u0338",
  "ngeqslant": "\u2A7E\u0338",
  "nges": "\u2A7E\u0338",
  "NotGreaterTilde": "\u2275",
  "ngsim": "\u2275",
  "NotHumpDownHump": "\u224E\u0338",
  "nbump": "\u224E\u0338",
  "NotHumpEqual": "\u224F\u0338",
  "nbumpe": "\u224F\u0338",
  "NotLeftTriangle": "\u22EA",
  "nltri": "\u22EA",
  "ntriangleleft": "\u22EA",
  "NotLeftTriangleBar": "\u29CF\u0338",
  "NotLeftTriangleEqual": "\u22EC",
  "nltrie": "\u22EC",
  "ntrianglelefteq": "\u22EC",
  "NotLess": "\u226E",
  "nless": "\u226E",
  "nlt": "\u226E",
  "NotLessEqual": "\u2270",
  "nle": "\u2270",
  "nleq": "\u2270",
  "NotLessGreater": "\u2278",
  "ntlg": "\u2278",
  "NotLessLess": "\u226A\u0338",
  "nLtv": "\u226A\u0338",
  "NotLessSlantEqual": "\u2A7D\u0338",
  "nleqslant": "\u2A7D\u0338",
  "nles": "\u2A7D\u0338",
  "NotLessTilde": "\u2274",
  "nlsim": "\u2274",
  "NotNestedGreaterGreater": "\u2AA2\u0338",
  "NotNestedLessLess": "\u2AA1\u0338",
  "NotPrecedes": "\u2280",
  "npr": "\u2280",
  "nprec": "\u2280",
  "NotPrecedesEqual": "\u2AAF\u0338",
  "npre": "\u2AAF\u0338",
  "npreceq": "\u2AAF\u0338",
  "NotPrecedesSlantEqual": "\u22E0",
  "nprcue": "\u22E0",
  "NotReverseElement": "\u220C",
  "notni": "\u220C",
  "notniva": "\u220C",
  "NotRightTriangle": "\u22EB",
  "nrtri": "\u22EB",
  "ntriangleright": "\u22EB",
  "NotRightTriangleBar": "\u29D0\u0338",
  "NotRightTriangleEqual": "\u22ED",
  "nrtrie": "\u22ED",
  "ntrianglerighteq": "\u22ED",
  "NotSquareSubset": "\u228F\u0338",
  "NotSquareSubsetEqual": "\u22E2",
  "nsqsube": "\u22E2",
  "NotSquareSuperset": "\u2290\u0338",
  "NotSquareSupersetEqual": "\u22E3",
  "nsqsupe": "\u22E3",
  "NotSubset": "\u2282\u20D2",
  "nsubset": "\u2282\u20D2",
  "vnsub": "\u2282\u20D2",
  "NotSubsetEqual": "\u2288",
  "nsube": "\u2288",
  "nsubseteq": "\u2288",
  "NotSucceeds": "\u2281",
  "nsc": "\u2281",
  "nsucc": "\u2281",
  "NotSucceedsEqual": "\u2AB0\u0338",
  "nsce": "\u2AB0\u0338",
  "nsucceq": "\u2AB0\u0338",
  "NotSucceedsSlantEqual": "\u22E1",
  "nsccue": "\u22E1",
  "NotSucceedsTilde": "\u227F\u0338",
  "NotSuperset": "\u2283\u20D2",
  "nsupset": "\u2283\u20D2",
  "vnsup": "\u2283\u20D2",
  "NotSupersetEqual": "\u2289",
  "nsupe": "\u2289",
  "nsupseteq": "\u2289",
  "NotTilde": "\u2241",
  "nsim": "\u2241",
  "NotTildeEqual": "\u2244",
  "nsime": "\u2244",
  "nsimeq": "\u2244",
  "NotTildeFullEqual": "\u2247",
  "ncong": "\u2247",
  "NotTildeTilde": "\u2249",
  "nap": "\u2249",
  "napprox": "\u2249",
  "NotVerticalBar": "\u2224",
  "nmid": "\u2224",
  "nshortmid": "\u2224",
  "nsmid": "\u2224",
  "Nscr": "\u{1D4A9}",
  "Ntilde": "\xD1",
  "Nu": "\u039D",
  "OElig": "\u0152",
  "Oacute": "\xD3",
  "Ocirc": "\xD4",
  "Ocy": "\u041E",
  "Odblac": "\u0150",
  "Ofr": "\u{1D512}",
  "Ograve": "\xD2",
  "Omacr": "\u014C",
  "Omega": "\u03A9",
  "ohm": "\u03A9",
  "Omicron": "\u039F",
  "Oopf": "\u{1D546}",
  "OpenCurlyDoubleQuote": "\u201C",
  "ldquo": "\u201C",
  "OpenCurlyQuote": "\u2018",
  "lsquo": "\u2018",
  "Or": "\u2A54",
  "Oscr": "\u{1D4AA}",
  "Oslash": "\xD8",
  "Otilde": "\xD5",
  "Otimes": "\u2A37",
  "Ouml": "\xD6",
  "OverBar": "\u203E",
  "oline": "\u203E",
  "OverBrace": "\u23DE",
  "OverBracket": "\u23B4",
  "tbrk": "\u23B4",
  "OverParenthesis": "\u23DC",
  "PartialD": "\u2202",
  "part": "\u2202",
  "Pcy": "\u041F",
  "Pfr": "\u{1D513}",
  "Phi": "\u03A6",
  "Pi": "\u03A0",
  "PlusMinus": "\xB1",
  "plusmn": "\xB1",
  "pm": "\xB1",
  "Popf": "\u2119",
  "primes": "\u2119",
  "Pr": "\u2ABB",
  "Precedes": "\u227A",
  "pr": "\u227A",
  "prec": "\u227A",
  "PrecedesEqual": "\u2AAF",
  "pre": "\u2AAF",
  "preceq": "\u2AAF",
  "PrecedesSlantEqual": "\u227C",
  "prcue": "\u227C",
  "preccurlyeq": "\u227C",
  "PrecedesTilde": "\u227E",
  "precsim": "\u227E",
  "prsim": "\u227E",
  "Prime": "\u2033",
  "Product": "\u220F",
  "prod": "\u220F",
  "Proportional": "\u221D",
  "prop": "\u221D",
  "propto": "\u221D",
  "varpropto": "\u221D",
  "vprop": "\u221D",
  "Pscr": "\u{1D4AB}",
  "Psi": "\u03A8",
  "QUOT": '"',
  "quot": '"',
  "Qfr": "\u{1D514}",
  "Qopf": "\u211A",
  "rationals": "\u211A",
  "Qscr": "\u{1D4AC}",
  "RBarr": "\u2910",
  "drbkarow": "\u2910",
  "REG": "\xAE",
  "circledR": "\xAE",
  "reg": "\xAE",
  "Racute": "\u0154",
  "Rang": "\u27EB",
  "Rarr": "\u21A0",
  "twoheadrightarrow": "\u21A0",
  "Rarrtl": "\u2916",
  "Rcaron": "\u0158",
  "Rcedil": "\u0156",
  "Rcy": "\u0420",
  "Re": "\u211C",
  "Rfr": "\u211C",
  "real": "\u211C",
  "realpart": "\u211C",
  "ReverseElement": "\u220B",
  "SuchThat": "\u220B",
  "ni": "\u220B",
  "niv": "\u220B",
  "ReverseEquilibrium": "\u21CB",
  "leftrightharpoons": "\u21CB",
  "lrhar": "\u21CB",
  "ReverseUpEquilibrium": "\u296F",
  "duhar": "\u296F",
  "Rho": "\u03A1",
  "RightAngleBracket": "\u27E9",
  "rang": "\u27E9",
  "rangle": "\u27E9",
  "RightArrow": "\u2192",
  "ShortRightArrow": "\u2192",
  "rarr": "\u2192",
  "rightarrow": "\u2192",
  "srarr": "\u2192",
  "RightArrowBar": "\u21E5",
  "rarrb": "\u21E5",
  "RightArrowLeftArrow": "\u21C4",
  "rightleftarrows": "\u21C4",
  "rlarr": "\u21C4",
  "RightCeiling": "\u2309",
  "rceil": "\u2309",
  "RightDoubleBracket": "\u27E7",
  "robrk": "\u27E7",
  "RightDownTeeVector": "\u295D",
  "RightDownVector": "\u21C2",
  "dharr": "\u21C2",
  "downharpoonright": "\u21C2",
  "RightDownVectorBar": "\u2955",
  "RightFloor": "\u230B",
  "rfloor": "\u230B",
  "RightTee": "\u22A2",
  "vdash": "\u22A2",
  "RightTeeArrow": "\u21A6",
  "map": "\u21A6",
  "mapsto": "\u21A6",
  "RightTeeVector": "\u295B",
  "RightTriangle": "\u22B3",
  "vartriangleright": "\u22B3",
  "vrtri": "\u22B3",
  "RightTriangleBar": "\u29D0",
  "RightTriangleEqual": "\u22B5",
  "rtrie": "\u22B5",
  "trianglerighteq": "\u22B5",
  "RightUpDownVector": "\u294F",
  "RightUpTeeVector": "\u295C",
  "RightUpVector": "\u21BE",
  "uharr": "\u21BE",
  "upharpoonright": "\u21BE",
  "RightUpVectorBar": "\u2954",
  "RightVector": "\u21C0",
  "rharu": "\u21C0",
  "rightharpoonup": "\u21C0",
  "RightVectorBar": "\u2953",
  "Ropf": "\u211D",
  "reals": "\u211D",
  "RoundImplies": "\u2970",
  "Rrightarrow": "\u21DB",
  "rAarr": "\u21DB",
  "Rscr": "\u211B",
  "realine": "\u211B",
  "Rsh": "\u21B1",
  "rsh": "\u21B1",
  "RuleDelayed": "\u29F4",
  "SHCHcy": "\u0429",
  "SHcy": "\u0428",
  "SOFTcy": "\u042C",
  "Sacute": "\u015A",
  "Sc": "\u2ABC",
  "Scaron": "\u0160",
  "Scedil": "\u015E",
  "Scirc": "\u015C",
  "Scy": "\u0421",
  "Sfr": "\u{1D516}",
  "ShortUpArrow": "\u2191",
  "UpArrow": "\u2191",
  "uarr": "\u2191",
  "uparrow": "\u2191",
  "Sigma": "\u03A3",
  "SmallCircle": "\u2218",
  "compfn": "\u2218",
  "Sopf": "\u{1D54A}",
  "Sqrt": "\u221A",
  "radic": "\u221A",
  "Square": "\u25A1",
  "squ": "\u25A1",
  "square": "\u25A1",
  "SquareIntersection": "\u2293",
  "sqcap": "\u2293",
  "SquareSubset": "\u228F",
  "sqsub": "\u228F",
  "sqsubset": "\u228F",
  "SquareSubsetEqual": "\u2291",
  "sqsube": "\u2291",
  "sqsubseteq": "\u2291",
  "SquareSuperset": "\u2290",
  "sqsup": "\u2290",
  "sqsupset": "\u2290",
  "SquareSupersetEqual": "\u2292",
  "sqsupe": "\u2292",
  "sqsupseteq": "\u2292",
  "SquareUnion": "\u2294",
  "sqcup": "\u2294",
  "Sscr": "\u{1D4AE}",
  "Star": "\u22C6",
  "sstarf": "\u22C6",
  "Sub": "\u22D0",
  "Subset": "\u22D0",
  "SubsetEqual": "\u2286",
  "sube": "\u2286",
  "subseteq": "\u2286",
  "Succeeds": "\u227B",
  "sc": "\u227B",
  "succ": "\u227B",
  "SucceedsEqual": "\u2AB0",
  "sce": "\u2AB0",
  "succeq": "\u2AB0",
  "SucceedsSlantEqual": "\u227D",
  "sccue": "\u227D",
  "succcurlyeq": "\u227D",
  "SucceedsTilde": "\u227F",
  "scsim": "\u227F",
  "succsim": "\u227F",
  "Sum": "\u2211",
  "sum": "\u2211",
  "Sup": "\u22D1",
  "Supset": "\u22D1",
  "Superset": "\u2283",
  "sup": "\u2283",
  "supset": "\u2283",
  "SupersetEqual": "\u2287",
  "supe": "\u2287",
  "supseteq": "\u2287",
  "THORN": "\xDE",
  "TRADE": "\u2122",
  "trade": "\u2122",
  "TSHcy": "\u040B",
  "TScy": "\u0426",
  "Tab": "	",
  "Tau": "\u03A4",
  "Tcaron": "\u0164",
  "Tcedil": "\u0162",
  "Tcy": "\u0422",
  "Tfr": "\u{1D517}",
  "Therefore": "\u2234",
  "there4": "\u2234",
  "therefore": "\u2234",
  "Theta": "\u0398",
  "ThickSpace": "\u205F\u200A",
  "ThinSpace": "\u2009",
  "thinsp": "\u2009",
  "Tilde": "\u223C",
  "sim": "\u223C",
  "thicksim": "\u223C",
  "thksim": "\u223C",
  "TildeEqual": "\u2243",
  "sime": "\u2243",
  "simeq": "\u2243",
  "TildeFullEqual": "\u2245",
  "cong": "\u2245",
  "TildeTilde": "\u2248",
  "ap": "\u2248",
  "approx": "\u2248",
  "asymp": "\u2248",
  "thickapprox": "\u2248",
  "thkap": "\u2248",
  "Topf": "\u{1D54B}",
  "TripleDot": "\u20DB",
  "tdot": "\u20DB",
  "Tscr": "\u{1D4AF}",
  "Tstrok": "\u0166",
  "Uacute": "\xDA",
  "Uarr": "\u219F",
  "Uarrocir": "\u2949",
  "Ubrcy": "\u040E",
  "Ubreve": "\u016C",
  "Ucirc": "\xDB",
  "Ucy": "\u0423",
  "Udblac": "\u0170",
  "Ufr": "\u{1D518}",
  "Ugrave": "\xD9",
  "Umacr": "\u016A",
  "UnderBar": "_",
  "lowbar": "_",
  "UnderBrace": "\u23DF",
  "UnderBracket": "\u23B5",
  "bbrk": "\u23B5",
  "UnderParenthesis": "\u23DD",
  "Union": "\u22C3",
  "bigcup": "\u22C3",
  "xcup": "\u22C3",
  "UnionPlus": "\u228E",
  "uplus": "\u228E",
  "Uogon": "\u0172",
  "Uopf": "\u{1D54C}",
  "UpArrowBar": "\u2912",
  "UpArrowDownArrow": "\u21C5",
  "udarr": "\u21C5",
  "UpDownArrow": "\u2195",
  "updownarrow": "\u2195",
  "varr": "\u2195",
  "UpEquilibrium": "\u296E",
  "udhar": "\u296E",
  "UpTee": "\u22A5",
  "bot": "\u22A5",
  "bottom": "\u22A5",
  "perp": "\u22A5",
  "UpTeeArrow": "\u21A5",
  "mapstoup": "\u21A5",
  "UpperLeftArrow": "\u2196",
  "nwarr": "\u2196",
  "nwarrow": "\u2196",
  "UpperRightArrow": "\u2197",
  "nearr": "\u2197",
  "nearrow": "\u2197",
  "Upsi": "\u03D2",
  "upsih": "\u03D2",
  "Upsilon": "\u03A5",
  "Uring": "\u016E",
  "Uscr": "\u{1D4B0}",
  "Utilde": "\u0168",
  "Uuml": "\xDC",
  "VDash": "\u22AB",
  "Vbar": "\u2AEB",
  "Vcy": "\u0412",
  "Vdash": "\u22A9",
  "Vdashl": "\u2AE6",
  "Vee": "\u22C1",
  "bigvee": "\u22C1",
  "xvee": "\u22C1",
  "Verbar": "\u2016",
  "Vert": "\u2016",
  "VerticalBar": "\u2223",
  "mid": "\u2223",
  "shortmid": "\u2223",
  "smid": "\u2223",
  "VerticalLine": "|",
  "verbar": "|",
  "vert": "|",
  "VerticalSeparator": "\u2758",
  "VerticalTilde": "\u2240",
  "wr": "\u2240",
  "wreath": "\u2240",
  "VeryThinSpace": "\u200A",
  "hairsp": "\u200A",
  "Vfr": "\u{1D519}",
  "Vopf": "\u{1D54D}",
  "Vscr": "\u{1D4B1}",
  "Vvdash": "\u22AA",
  "Wcirc": "\u0174",
  "Wedge": "\u22C0",
  "bigwedge": "\u22C0",
  "xwedge": "\u22C0",
  "Wfr": "\u{1D51A}",
  "Wopf": "\u{1D54E}",
  "Wscr": "\u{1D4B2}",
  "Xfr": "\u{1D51B}",
  "Xi": "\u039E",
  "Xopf": "\u{1D54F}",
  "Xscr": "\u{1D4B3}",
  "YAcy": "\u042F",
  "YIcy": "\u0407",
  "YUcy": "\u042E",
  "Yacute": "\xDD",
  "Ycirc": "\u0176",
  "Ycy": "\u042B",
  "Yfr": "\u{1D51C}",
  "Yopf": "\u{1D550}",
  "Yscr": "\u{1D4B4}",
  "Yuml": "\u0178",
  "ZHcy": "\u0416",
  "Zacute": "\u0179",
  "Zcaron": "\u017D",
  "Zcy": "\u0417",
  "Zdot": "\u017B",
  "Zeta": "\u0396",
  "Zfr": "\u2128",
  "zeetrf": "\u2128",
  "Zopf": "\u2124",
  "integers": "\u2124",
  "Zscr": "\u{1D4B5}",
  "aacute": "\xE1",
  "abreve": "\u0103",
  "ac": "\u223E",
  "mstpos": "\u223E",
  "acE": "\u223E\u0333",
  "acd": "\u223F",
  "acirc": "\xE2",
  "acy": "\u0430",
  "aelig": "\xE6",
  "afr": "\u{1D51E}",
  "agrave": "\xE0",
  "alefsym": "\u2135",
  "aleph": "\u2135",
  "alpha": "\u03B1",
  "amacr": "\u0101",
  "amalg": "\u2A3F",
  "and": "\u2227",
  "wedge": "\u2227",
  "andand": "\u2A55",
  "andd": "\u2A5C",
  "andslope": "\u2A58",
  "andv": "\u2A5A",
  "ang": "\u2220",
  "angle": "\u2220",
  "ange": "\u29A4",
  "angmsd": "\u2221",
  "measuredangle": "\u2221",
  "angmsdaa": "\u29A8",
  "angmsdab": "\u29A9",
  "angmsdac": "\u29AA",
  "angmsdad": "\u29AB",
  "angmsdae": "\u29AC",
  "angmsdaf": "\u29AD",
  "angmsdag": "\u29AE",
  "angmsdah": "\u29AF",
  "angrt": "\u221F",
  "angrtvb": "\u22BE",
  "angrtvbd": "\u299D",
  "angsph": "\u2222",
  "angzarr": "\u237C",
  "aogon": "\u0105",
  "aopf": "\u{1D552}",
  "apE": "\u2A70",
  "apacir": "\u2A6F",
  "ape": "\u224A",
  "approxeq": "\u224A",
  "apid": "\u224B",
  "apos": "'",
  "aring": "\xE5",
  "ascr": "\u{1D4B6}",
  "ast": "*",
  "midast": "*",
  "atilde": "\xE3",
  "auml": "\xE4",
  "awint": "\u2A11",
  "bNot": "\u2AED",
  "backcong": "\u224C",
  "bcong": "\u224C",
  "backepsilon": "\u03F6",
  "bepsi": "\u03F6",
  "backprime": "\u2035",
  "bprime": "\u2035",
  "backsim": "\u223D",
  "bsim": "\u223D",
  "backsimeq": "\u22CD",
  "bsime": "\u22CD",
  "barvee": "\u22BD",
  "barwed": "\u2305",
  "barwedge": "\u2305",
  "bbrktbrk": "\u23B6",
  "bcy": "\u0431",
  "bdquo": "\u201E",
  "ldquor": "\u201E",
  "bemptyv": "\u29B0",
  "beta": "\u03B2",
  "beth": "\u2136",
  "between": "\u226C",
  "twixt": "\u226C",
  "bfr": "\u{1D51F}",
  "bigcirc": "\u25EF",
  "xcirc": "\u25EF",
  "bigodot": "\u2A00",
  "xodot": "\u2A00",
  "bigoplus": "\u2A01",
  "xoplus": "\u2A01",
  "bigotimes": "\u2A02",
  "xotime": "\u2A02",
  "bigsqcup": "\u2A06",
  "xsqcup": "\u2A06",
  "bigstar": "\u2605",
  "starf": "\u2605",
  "bigtriangledown": "\u25BD",
  "xdtri": "\u25BD",
  "bigtriangleup": "\u25B3",
  "xutri": "\u25B3",
  "biguplus": "\u2A04",
  "xuplus": "\u2A04",
  "bkarow": "\u290D",
  "rbarr": "\u290D",
  "blacklozenge": "\u29EB",
  "lozf": "\u29EB",
  "blacktriangle": "\u25B4",
  "utrif": "\u25B4",
  "blacktriangledown": "\u25BE",
  "dtrif": "\u25BE",
  "blacktriangleleft": "\u25C2",
  "ltrif": "\u25C2",
  "blacktriangleright": "\u25B8",
  "rtrif": "\u25B8",
  "blank": "\u2423",
  "blk12": "\u2592",
  "blk14": "\u2591",
  "blk34": "\u2593",
  "block": "\u2588",
  "bne": "=\u20E5",
  "bnequiv": "\u2261\u20E5",
  "bnot": "\u2310",
  "bopf": "\u{1D553}",
  "bowtie": "\u22C8",
  "boxDL": "\u2557",
  "boxDR": "\u2554",
  "boxDl": "\u2556",
  "boxDr": "\u2553",
  "boxH": "\u2550",
  "boxHD": "\u2566",
  "boxHU": "\u2569",
  "boxHd": "\u2564",
  "boxHu": "\u2567",
  "boxUL": "\u255D",
  "boxUR": "\u255A",
  "boxUl": "\u255C",
  "boxUr": "\u2559",
  "boxV": "\u2551",
  "boxVH": "\u256C",
  "boxVL": "\u2563",
  "boxVR": "\u2560",
  "boxVh": "\u256B",
  "boxVl": "\u2562",
  "boxVr": "\u255F",
  "boxbox": "\u29C9",
  "boxdL": "\u2555",
  "boxdR": "\u2552",
  "boxdl": "\u2510",
  "boxdr": "\u250C",
  "boxhD": "\u2565",
  "boxhU": "\u2568",
  "boxhd": "\u252C",
  "boxhu": "\u2534",
  "boxminus": "\u229F",
  "minusb": "\u229F",
  "boxplus": "\u229E",
  "plusb": "\u229E",
  "boxtimes": "\u22A0",
  "timesb": "\u22A0",
  "boxuL": "\u255B",
  "boxuR": "\u2558",
  "boxul": "\u2518",
  "boxur": "\u2514",
  "boxv": "\u2502",
  "boxvH": "\u256A",
  "boxvL": "\u2561",
  "boxvR": "\u255E",
  "boxvh": "\u253C",
  "boxvl": "\u2524",
  "boxvr": "\u251C",
  "brvbar": "\xA6",
  "bscr": "\u{1D4B7}",
  "bsemi": "\u204F",
  "bsol": "\\",
  "bsolb": "\u29C5",
  "bsolhsub": "\u27C8",
  "bull": "\u2022",
  "bullet": "\u2022",
  "bumpE": "\u2AAE",
  "cacute": "\u0107",
  "cap": "\u2229",
  "capand": "\u2A44",
  "capbrcup": "\u2A49",
  "capcap": "\u2A4B",
  "capcup": "\u2A47",
  "capdot": "\u2A40",
  "caps": "\u2229\uFE00",
  "caret": "\u2041",
  "ccaps": "\u2A4D",
  "ccaron": "\u010D",
  "ccedil": "\xE7",
  "ccirc": "\u0109",
  "ccups": "\u2A4C",
  "ccupssm": "\u2A50",
  "cdot": "\u010B",
  "cemptyv": "\u29B2",
  "cent": "\xA2",
  "cfr": "\u{1D520}",
  "chcy": "\u0447",
  "check": "\u2713",
  "checkmark": "\u2713",
  "chi": "\u03C7",
  "cir": "\u25CB",
  "cirE": "\u29C3",
  "circ": "\u02C6",
  "circeq": "\u2257",
  "cire": "\u2257",
  "circlearrowleft": "\u21BA",
  "olarr": "\u21BA",
  "circlearrowright": "\u21BB",
  "orarr": "\u21BB",
  "circledS": "\u24C8",
  "oS": "\u24C8",
  "circledast": "\u229B",
  "oast": "\u229B",
  "circledcirc": "\u229A",
  "ocir": "\u229A",
  "circleddash": "\u229D",
  "odash": "\u229D",
  "cirfnint": "\u2A10",
  "cirmid": "\u2AEF",
  "cirscir": "\u29C2",
  "clubs": "\u2663",
  "clubsuit": "\u2663",
  "colon": ":",
  "comma": ",",
  "commat": "@",
  "comp": "\u2201",
  "complement": "\u2201",
  "congdot": "\u2A6D",
  "copf": "\u{1D554}",
  "copysr": "\u2117",
  "crarr": "\u21B5",
  "cross": "\u2717",
  "cscr": "\u{1D4B8}",
  "csub": "\u2ACF",
  "csube": "\u2AD1",
  "csup": "\u2AD0",
  "csupe": "\u2AD2",
  "ctdot": "\u22EF",
  "cudarrl": "\u2938",
  "cudarrr": "\u2935",
  "cuepr": "\u22DE",
  "curlyeqprec": "\u22DE",
  "cuesc": "\u22DF",
  "curlyeqsucc": "\u22DF",
  "cularr": "\u21B6",
  "curvearrowleft": "\u21B6",
  "cularrp": "\u293D",
  "cup": "\u222A",
  "cupbrcap": "\u2A48",
  "cupcap": "\u2A46",
  "cupcup": "\u2A4A",
  "cupdot": "\u228D",
  "cupor": "\u2A45",
  "cups": "\u222A\uFE00",
  "curarr": "\u21B7",
  "curvearrowright": "\u21B7",
  "curarrm": "\u293C",
  "curlyvee": "\u22CE",
  "cuvee": "\u22CE",
  "curlywedge": "\u22CF",
  "cuwed": "\u22CF",
  "curren": "\xA4",
  "cwint": "\u2231",
  "cylcty": "\u232D",
  "dHar": "\u2965",
  "dagger": "\u2020",
  "daleth": "\u2138",
  "dash": "\u2010",
  "hyphen": "\u2010",
  "dbkarow": "\u290F",
  "rBarr": "\u290F",
  "dcaron": "\u010F",
  "dcy": "\u0434",
  "ddarr": "\u21CA",
  "downdownarrows": "\u21CA",
  "ddotseq": "\u2A77",
  "eDDot": "\u2A77",
  "deg": "\xB0",
  "delta": "\u03B4",
  "demptyv": "\u29B1",
  "dfisht": "\u297F",
  "dfr": "\u{1D521}",
  "diamondsuit": "\u2666",
  "diams": "\u2666",
  "digamma": "\u03DD",
  "gammad": "\u03DD",
  "disin": "\u22F2",
  "div": "\xF7",
  "divide": "\xF7",
  "divideontimes": "\u22C7",
  "divonx": "\u22C7",
  "djcy": "\u0452",
  "dlcorn": "\u231E",
  "llcorner": "\u231E",
  "dlcrop": "\u230D",
  "dollar": "$",
  "dopf": "\u{1D555}",
  "doteqdot": "\u2251",
  "eDot": "\u2251",
  "dotminus": "\u2238",
  "minusd": "\u2238",
  "dotplus": "\u2214",
  "plusdo": "\u2214",
  "dotsquare": "\u22A1",
  "sdotb": "\u22A1",
  "drcorn": "\u231F",
  "lrcorner": "\u231F",
  "drcrop": "\u230C",
  "dscr": "\u{1D4B9}",
  "dscy": "\u0455",
  "dsol": "\u29F6",
  "dstrok": "\u0111",
  "dtdot": "\u22F1",
  "dtri": "\u25BF",
  "triangledown": "\u25BF",
  "dwangle": "\u29A6",
  "dzcy": "\u045F",
  "dzigrarr": "\u27FF",
  "eacute": "\xE9",
  "easter": "\u2A6E",
  "ecaron": "\u011B",
  "ecir": "\u2256",
  "eqcirc": "\u2256",
  "ecirc": "\xEA",
  "ecolon": "\u2255",
  "eqcolon": "\u2255",
  "ecy": "\u044D",
  "edot": "\u0117",
  "efDot": "\u2252",
  "fallingdotseq": "\u2252",
  "efr": "\u{1D522}",
  "eg": "\u2A9A",
  "egrave": "\xE8",
  "egs": "\u2A96",
  "eqslantgtr": "\u2A96",
  "egsdot": "\u2A98",
  "el": "\u2A99",
  "elinters": "\u23E7",
  "ell": "\u2113",
  "els": "\u2A95",
  "eqslantless": "\u2A95",
  "elsdot": "\u2A97",
  "emacr": "\u0113",
  "empty": "\u2205",
  "emptyset": "\u2205",
  "emptyv": "\u2205",
  "varnothing": "\u2205",
  "emsp13": "\u2004",
  "emsp14": "\u2005",
  "emsp": "\u2003",
  "eng": "\u014B",
  "ensp": "\u2002",
  "eogon": "\u0119",
  "eopf": "\u{1D556}",
  "epar": "\u22D5",
  "eparsl": "\u29E3",
  "eplus": "\u2A71",
  "epsi": "\u03B5",
  "epsilon": "\u03B5",
  "epsiv": "\u03F5",
  "straightepsilon": "\u03F5",
  "varepsilon": "\u03F5",
  "equals": "=",
  "equest": "\u225F",
  "questeq": "\u225F",
  "equivDD": "\u2A78",
  "eqvparsl": "\u29E5",
  "erDot": "\u2253",
  "risingdotseq": "\u2253",
  "erarr": "\u2971",
  "escr": "\u212F",
  "eta": "\u03B7",
  "eth": "\xF0",
  "euml": "\xEB",
  "euro": "\u20AC",
  "excl": "!",
  "fcy": "\u0444",
  "female": "\u2640",
  "ffilig": "\uFB03",
  "fflig": "\uFB00",
  "ffllig": "\uFB04",
  "ffr": "\u{1D523}",
  "filig": "\uFB01",
  "fjlig": "fj",
  "flat": "\u266D",
  "fllig": "\uFB02",
  "fltns": "\u25B1",
  "fnof": "\u0192",
  "fopf": "\u{1D557}",
  "fork": "\u22D4",
  "pitchfork": "\u22D4",
  "forkv": "\u2AD9",
  "fpartint": "\u2A0D",
  "frac12": "\xBD",
  "half": "\xBD",
  "frac13": "\u2153",
  "frac14": "\xBC",
  "frac15": "\u2155",
  "frac16": "\u2159",
  "frac18": "\u215B",
  "frac23": "\u2154",
  "frac25": "\u2156",
  "frac34": "\xBE",
  "frac35": "\u2157",
  "frac38": "\u215C",
  "frac45": "\u2158",
  "frac56": "\u215A",
  "frac58": "\u215D",
  "frac78": "\u215E",
  "frasl": "\u2044",
  "frown": "\u2322",
  "sfrown": "\u2322",
  "fscr": "\u{1D4BB}",
  "gEl": "\u2A8C",
  "gtreqqless": "\u2A8C",
  "gacute": "\u01F5",
  "gamma": "\u03B3",
  "gap": "\u2A86",
  "gtrapprox": "\u2A86",
  "gbreve": "\u011F",
  "gcirc": "\u011D",
  "gcy": "\u0433",
  "gdot": "\u0121",
  "gescc": "\u2AA9",
  "gesdot": "\u2A80",
  "gesdoto": "\u2A82",
  "gesdotol": "\u2A84",
  "gesl": "\u22DB\uFE00",
  "gesles": "\u2A94",
  "gfr": "\u{1D524}",
  "gimel": "\u2137",
  "gjcy": "\u0453",
  "glE": "\u2A92",
  "gla": "\u2AA5",
  "glj": "\u2AA4",
  "gnE": "\u2269",
  "gneqq": "\u2269",
  "gnap": "\u2A8A",
  "gnapprox": "\u2A8A",
  "gne": "\u2A88",
  "gneq": "\u2A88",
  "gnsim": "\u22E7",
  "gopf": "\u{1D558}",
  "gscr": "\u210A",
  "gsime": "\u2A8E",
  "gsiml": "\u2A90",
  "gtcc": "\u2AA7",
  "gtcir": "\u2A7A",
  "gtdot": "\u22D7",
  "gtrdot": "\u22D7",
  "gtlPar": "\u2995",
  "gtquest": "\u2A7C",
  "gtrarr": "\u2978",
  "gvertneqq": "\u2269\uFE00",
  "gvnE": "\u2269\uFE00",
  "hardcy": "\u044A",
  "harrcir": "\u2948",
  "harrw": "\u21AD",
  "leftrightsquigarrow": "\u21AD",
  "hbar": "\u210F",
  "hslash": "\u210F",
  "planck": "\u210F",
  "plankv": "\u210F",
  "hcirc": "\u0125",
  "hearts": "\u2665",
  "heartsuit": "\u2665",
  "hellip": "\u2026",
  "mldr": "\u2026",
  "hercon": "\u22B9",
  "hfr": "\u{1D525}",
  "hksearow": "\u2925",
  "searhk": "\u2925",
  "hkswarow": "\u2926",
  "swarhk": "\u2926",
  "hoarr": "\u21FF",
  "homtht": "\u223B",
  "hookleftarrow": "\u21A9",
  "larrhk": "\u21A9",
  "hookrightarrow": "\u21AA",
  "rarrhk": "\u21AA",
  "hopf": "\u{1D559}",
  "horbar": "\u2015",
  "hscr": "\u{1D4BD}",
  "hstrok": "\u0127",
  "hybull": "\u2043",
  "iacute": "\xED",
  "icirc": "\xEE",
  "icy": "\u0438",
  "iecy": "\u0435",
  "iexcl": "\xA1",
  "ifr": "\u{1D526}",
  "igrave": "\xEC",
  "iiiint": "\u2A0C",
  "qint": "\u2A0C",
  "iiint": "\u222D",
  "tint": "\u222D",
  "iinfin": "\u29DC",
  "iiota": "\u2129",
  "ijlig": "\u0133",
  "imacr": "\u012B",
  "imath": "\u0131",
  "inodot": "\u0131",
  "imof": "\u22B7",
  "imped": "\u01B5",
  "incare": "\u2105",
  "infin": "\u221E",
  "infintie": "\u29DD",
  "intcal": "\u22BA",
  "intercal": "\u22BA",
  "intlarhk": "\u2A17",
  "intprod": "\u2A3C",
  "iprod": "\u2A3C",
  "iocy": "\u0451",
  "iogon": "\u012F",
  "iopf": "\u{1D55A}",
  "iota": "\u03B9",
  "iquest": "\xBF",
  "iscr": "\u{1D4BE}",
  "isinE": "\u22F9",
  "isindot": "\u22F5",
  "isins": "\u22F4",
  "isinsv": "\u22F3",
  "itilde": "\u0129",
  "iukcy": "\u0456",
  "iuml": "\xEF",
  "jcirc": "\u0135",
  "jcy": "\u0439",
  "jfr": "\u{1D527}",
  "jmath": "\u0237",
  "jopf": "\u{1D55B}",
  "jscr": "\u{1D4BF}",
  "jsercy": "\u0458",
  "jukcy": "\u0454",
  "kappa": "\u03BA",
  "kappav": "\u03F0",
  "varkappa": "\u03F0",
  "kcedil": "\u0137",
  "kcy": "\u043A",
  "kfr": "\u{1D528}",
  "kgreen": "\u0138",
  "khcy": "\u0445",
  "kjcy": "\u045C",
  "kopf": "\u{1D55C}",
  "kscr": "\u{1D4C0}",
  "lAtail": "\u291B",
  "lBarr": "\u290E",
  "lEg": "\u2A8B",
  "lesseqqgtr": "\u2A8B",
  "lHar": "\u2962",
  "lacute": "\u013A",
  "laemptyv": "\u29B4",
  "lambda": "\u03BB",
  "langd": "\u2991",
  "lap": "\u2A85",
  "lessapprox": "\u2A85",
  "laquo": "\xAB",
  "larrbfs": "\u291F",
  "larrfs": "\u291D",
  "larrlp": "\u21AB",
  "looparrowleft": "\u21AB",
  "larrpl": "\u2939",
  "larrsim": "\u2973",
  "larrtl": "\u21A2",
  "leftarrowtail": "\u21A2",
  "lat": "\u2AAB",
  "latail": "\u2919",
  "late": "\u2AAD",
  "lates": "\u2AAD\uFE00",
  "lbarr": "\u290C",
  "lbbrk": "\u2772",
  "lbrace": "{",
  "lcub": "{",
  "lbrack": "[",
  "lsqb": "[",
  "lbrke": "\u298B",
  "lbrksld": "\u298F",
  "lbrkslu": "\u298D",
  "lcaron": "\u013E",
  "lcedil": "\u013C",
  "lcy": "\u043B",
  "ldca": "\u2936",
  "ldrdhar": "\u2967",
  "ldrushar": "\u294B",
  "ldsh": "\u21B2",
  "le": "\u2264",
  "leq": "\u2264",
  "leftleftarrows": "\u21C7",
  "llarr": "\u21C7",
  "leftthreetimes": "\u22CB",
  "lthree": "\u22CB",
  "lescc": "\u2AA8",
  "lesdot": "\u2A7F",
  "lesdoto": "\u2A81",
  "lesdotor": "\u2A83",
  "lesg": "\u22DA\uFE00",
  "lesges": "\u2A93",
  "lessdot": "\u22D6",
  "ltdot": "\u22D6",
  "lfisht": "\u297C",
  "lfr": "\u{1D529}",
  "lgE": "\u2A91",
  "lharul": "\u296A",
  "lhblk": "\u2584",
  "ljcy": "\u0459",
  "llhard": "\u296B",
  "lltri": "\u25FA",
  "lmidot": "\u0140",
  "lmoust": "\u23B0",
  "lmoustache": "\u23B0",
  "lnE": "\u2268",
  "lneqq": "\u2268",
  "lnap": "\u2A89",
  "lnapprox": "\u2A89",
  "lne": "\u2A87",
  "lneq": "\u2A87",
  "lnsim": "\u22E6",
  "loang": "\u27EC",
  "loarr": "\u21FD",
  "longmapsto": "\u27FC",
  "xmap": "\u27FC",
  "looparrowright": "\u21AC",
  "rarrlp": "\u21AC",
  "lopar": "\u2985",
  "lopf": "\u{1D55D}",
  "loplus": "\u2A2D",
  "lotimes": "\u2A34",
  "lowast": "\u2217",
  "loz": "\u25CA",
  "lozenge": "\u25CA",
  "lpar": "(",
  "lparlt": "\u2993",
  "lrhard": "\u296D",
  "lrm": "\u200E",
  "lrtri": "\u22BF",
  "lsaquo": "\u2039",
  "lscr": "\u{1D4C1}",
  "lsime": "\u2A8D",
  "lsimg": "\u2A8F",
  "lsquor": "\u201A",
  "sbquo": "\u201A",
  "lstrok": "\u0142",
  "ltcc": "\u2AA6",
  "ltcir": "\u2A79",
  "ltimes": "\u22C9",
  "ltlarr": "\u2976",
  "ltquest": "\u2A7B",
  "ltrPar": "\u2996",
  "ltri": "\u25C3",
  "triangleleft": "\u25C3",
  "lurdshar": "\u294A",
  "luruhar": "\u2966",
  "lvertneqq": "\u2268\uFE00",
  "lvnE": "\u2268\uFE00",
  "mDDot": "\u223A",
  "macr": "\xAF",
  "strns": "\xAF",
  "male": "\u2642",
  "malt": "\u2720",
  "maltese": "\u2720",
  "marker": "\u25AE",
  "mcomma": "\u2A29",
  "mcy": "\u043C",
  "mdash": "\u2014",
  "mfr": "\u{1D52A}",
  "mho": "\u2127",
  "micro": "\xB5",
  "midcir": "\u2AF0",
  "minus": "\u2212",
  "minusdu": "\u2A2A",
  "mlcp": "\u2ADB",
  "models": "\u22A7",
  "mopf": "\u{1D55E}",
  "mscr": "\u{1D4C2}",
  "mu": "\u03BC",
  "multimap": "\u22B8",
  "mumap": "\u22B8",
  "nGg": "\u22D9\u0338",
  "nGt": "\u226B\u20D2",
  "nLeftarrow": "\u21CD",
  "nlArr": "\u21CD",
  "nLeftrightarrow": "\u21CE",
  "nhArr": "\u21CE",
  "nLl": "\u22D8\u0338",
  "nLt": "\u226A\u20D2",
  "nRightarrow": "\u21CF",
  "nrArr": "\u21CF",
  "nVDash": "\u22AF",
  "nVdash": "\u22AE",
  "nacute": "\u0144",
  "nang": "\u2220\u20D2",
  "napE": "\u2A70\u0338",
  "napid": "\u224B\u0338",
  "napos": "\u0149",
  "natur": "\u266E",
  "natural": "\u266E",
  "ncap": "\u2A43",
  "ncaron": "\u0148",
  "ncedil": "\u0146",
  "ncongdot": "\u2A6D\u0338",
  "ncup": "\u2A42",
  "ncy": "\u043D",
  "ndash": "\u2013",
  "neArr": "\u21D7",
  "nearhk": "\u2924",
  "nedot": "\u2250\u0338",
  "nesear": "\u2928",
  "toea": "\u2928",
  "nfr": "\u{1D52B}",
  "nharr": "\u21AE",
  "nleftrightarrow": "\u21AE",
  "nhpar": "\u2AF2",
  "nis": "\u22FC",
  "nisd": "\u22FA",
  "njcy": "\u045A",
  "nlE": "\u2266\u0338",
  "nleqq": "\u2266\u0338",
  "nlarr": "\u219A",
  "nleftarrow": "\u219A",
  "nldr": "\u2025",
  "nopf": "\u{1D55F}",
  "not": "\xAC",
  "notinE": "\u22F9\u0338",
  "notindot": "\u22F5\u0338",
  "notinvb": "\u22F7",
  "notinvc": "\u22F6",
  "notnivb": "\u22FE",
  "notnivc": "\u22FD",
  "nparsl": "\u2AFD\u20E5",
  "npart": "\u2202\u0338",
  "npolint": "\u2A14",
  "nrarr": "\u219B",
  "nrightarrow": "\u219B",
  "nrarrc": "\u2933\u0338",
  "nrarrw": "\u219D\u0338",
  "nscr": "\u{1D4C3}",
  "nsub": "\u2284",
  "nsubE": "\u2AC5\u0338",
  "nsubseteqq": "\u2AC5\u0338",
  "nsup": "\u2285",
  "nsupE": "\u2AC6\u0338",
  "nsupseteqq": "\u2AC6\u0338",
  "ntilde": "\xF1",
  "nu": "\u03BD",
  "num": "#",
  "numero": "\u2116",
  "numsp": "\u2007",
  "nvDash": "\u22AD",
  "nvHarr": "\u2904",
  "nvap": "\u224D\u20D2",
  "nvdash": "\u22AC",
  "nvge": "\u2265\u20D2",
  "nvgt": ">\u20D2",
  "nvinfin": "\u29DE",
  "nvlArr": "\u2902",
  "nvle": "\u2264\u20D2",
  "nvlt": "<\u20D2",
  "nvltrie": "\u22B4\u20D2",
  "nvrArr": "\u2903",
  "nvrtrie": "\u22B5\u20D2",
  "nvsim": "\u223C\u20D2",
  "nwArr": "\u21D6",
  "nwarhk": "\u2923",
  "nwnear": "\u2927",
  "oacute": "\xF3",
  "ocirc": "\xF4",
  "ocy": "\u043E",
  "odblac": "\u0151",
  "odiv": "\u2A38",
  "odsold": "\u29BC",
  "oelig": "\u0153",
  "ofcir": "\u29BF",
  "ofr": "\u{1D52C}",
  "ogon": "\u02DB",
  "ograve": "\xF2",
  "ogt": "\u29C1",
  "ohbar": "\u29B5",
  "olcir": "\u29BE",
  "olcross": "\u29BB",
  "olt": "\u29C0",
  "omacr": "\u014D",
  "omega": "\u03C9",
  "omicron": "\u03BF",
  "omid": "\u29B6",
  "oopf": "\u{1D560}",
  "opar": "\u29B7",
  "operp": "\u29B9",
  "or": "\u2228",
  "vee": "\u2228",
  "ord": "\u2A5D",
  "order": "\u2134",
  "orderof": "\u2134",
  "oscr": "\u2134",
  "ordf": "\xAA",
  "ordm": "\xBA",
  "origof": "\u22B6",
  "oror": "\u2A56",
  "orslope": "\u2A57",
  "orv": "\u2A5B",
  "oslash": "\xF8",
  "osol": "\u2298",
  "otilde": "\xF5",
  "otimesas": "\u2A36",
  "ouml": "\xF6",
  "ovbar": "\u233D",
  "para": "\xB6",
  "parsim": "\u2AF3",
  "parsl": "\u2AFD",
  "pcy": "\u043F",
  "percnt": "%",
  "period": ".",
  "permil": "\u2030",
  "pertenk": "\u2031",
  "pfr": "\u{1D52D}",
  "phi": "\u03C6",
  "phiv": "\u03D5",
  "straightphi": "\u03D5",
  "varphi": "\u03D5",
  "phone": "\u260E",
  "pi": "\u03C0",
  "piv": "\u03D6",
  "varpi": "\u03D6",
  "planckh": "\u210E",
  "plus": "+",
  "plusacir": "\u2A23",
  "pluscir": "\u2A22",
  "plusdu": "\u2A25",
  "pluse": "\u2A72",
  "plussim": "\u2A26",
  "plustwo": "\u2A27",
  "pointint": "\u2A15",
  "popf": "\u{1D561}",
  "pound": "\xA3",
  "prE": "\u2AB3",
  "prap": "\u2AB7",
  "precapprox": "\u2AB7",
  "precnapprox": "\u2AB9",
  "prnap": "\u2AB9",
  "precneqq": "\u2AB5",
  "prnE": "\u2AB5",
  "precnsim": "\u22E8",
  "prnsim": "\u22E8",
  "prime": "\u2032",
  "profalar": "\u232E",
  "profline": "\u2312",
  "profsurf": "\u2313",
  "prurel": "\u22B0",
  "pscr": "\u{1D4C5}",
  "psi": "\u03C8",
  "puncsp": "\u2008",
  "qfr": "\u{1D52E}",
  "qopf": "\u{1D562}",
  "qprime": "\u2057",
  "qscr": "\u{1D4C6}",
  "quatint": "\u2A16",
  "quest": "?",
  "rAtail": "\u291C",
  "rHar": "\u2964",
  "race": "\u223D\u0331",
  "racute": "\u0155",
  "raemptyv": "\u29B3",
  "rangd": "\u2992",
  "range": "\u29A5",
  "raquo": "\xBB",
  "rarrap": "\u2975",
  "rarrbfs": "\u2920",
  "rarrc": "\u2933",
  "rarrfs": "\u291E",
  "rarrpl": "\u2945",
  "rarrsim": "\u2974",
  "rarrtl": "\u21A3",
  "rightarrowtail": "\u21A3",
  "rarrw": "\u219D",
  "rightsquigarrow": "\u219D",
  "ratail": "\u291A",
  "ratio": "\u2236",
  "rbbrk": "\u2773",
  "rbrace": "}",
  "rcub": "}",
  "rbrack": "]",
  "rsqb": "]",
  "rbrke": "\u298C",
  "rbrksld": "\u298E",
  "rbrkslu": "\u2990",
  "rcaron": "\u0159",
  "rcedil": "\u0157",
  "rcy": "\u0440",
  "rdca": "\u2937",
  "rdldhar": "\u2969",
  "rdsh": "\u21B3",
  "rect": "\u25AD",
  "rfisht": "\u297D",
  "rfr": "\u{1D52F}",
  "rharul": "\u296C",
  "rho": "\u03C1",
  "rhov": "\u03F1",
  "varrho": "\u03F1",
  "rightrightarrows": "\u21C9",
  "rrarr": "\u21C9",
  "rightthreetimes": "\u22CC",
  "rthree": "\u22CC",
  "ring": "\u02DA",
  "rlm": "\u200F",
  "rmoust": "\u23B1",
  "rmoustache": "\u23B1",
  "rnmid": "\u2AEE",
  "roang": "\u27ED",
  "roarr": "\u21FE",
  "ropar": "\u2986",
  "ropf": "\u{1D563}",
  "roplus": "\u2A2E",
  "rotimes": "\u2A35",
  "rpar": ")",
  "rpargt": "\u2994",
  "rppolint": "\u2A12",
  "rsaquo": "\u203A",
  "rscr": "\u{1D4C7}",
  "rtimes": "\u22CA",
  "rtri": "\u25B9",
  "triangleright": "\u25B9",
  "rtriltri": "\u29CE",
  "ruluhar": "\u2968",
  "rx": "\u211E",
  "sacute": "\u015B",
  "scE": "\u2AB4",
  "scap": "\u2AB8",
  "succapprox": "\u2AB8",
  "scaron": "\u0161",
  "scedil": "\u015F",
  "scirc": "\u015D",
  "scnE": "\u2AB6",
  "succneqq": "\u2AB6",
  "scnap": "\u2ABA",
  "succnapprox": "\u2ABA",
  "scnsim": "\u22E9",
  "succnsim": "\u22E9",
  "scpolint": "\u2A13",
  "scy": "\u0441",
  "sdot": "\u22C5",
  "sdote": "\u2A66",
  "seArr": "\u21D8",
  "sect": "\xA7",
  "semi": ";",
  "seswar": "\u2929",
  "tosa": "\u2929",
  "sext": "\u2736",
  "sfr": "\u{1D530}",
  "sharp": "\u266F",
  "shchcy": "\u0449",
  "shcy": "\u0448",
  "shy": "\xAD",
  "sigma": "\u03C3",
  "sigmaf": "\u03C2",
  "sigmav": "\u03C2",
  "varsigma": "\u03C2",
  "simdot": "\u2A6A",
  "simg": "\u2A9E",
  "simgE": "\u2AA0",
  "siml": "\u2A9D",
  "simlE": "\u2A9F",
  "simne": "\u2246",
  "simplus": "\u2A24",
  "simrarr": "\u2972",
  "smashp": "\u2A33",
  "smeparsl": "\u29E4",
  "smile": "\u2323",
  "ssmile": "\u2323",
  "smt": "\u2AAA",
  "smte": "\u2AAC",
  "smtes": "\u2AAC\uFE00",
  "softcy": "\u044C",
  "sol": "/",
  "solb": "\u29C4",
  "solbar": "\u233F",
  "sopf": "\u{1D564}",
  "spades": "\u2660",
  "spadesuit": "\u2660",
  "sqcaps": "\u2293\uFE00",
  "sqcups": "\u2294\uFE00",
  "sscr": "\u{1D4C8}",
  "star": "\u2606",
  "sub": "\u2282",
  "subset": "\u2282",
  "subE": "\u2AC5",
  "subseteqq": "\u2AC5",
  "subdot": "\u2ABD",
  "subedot": "\u2AC3",
  "submult": "\u2AC1",
  "subnE": "\u2ACB",
  "subsetneqq": "\u2ACB",
  "subne": "\u228A",
  "subsetneq": "\u228A",
  "subplus": "\u2ABF",
  "subrarr": "\u2979",
  "subsim": "\u2AC7",
  "subsub": "\u2AD5",
  "subsup": "\u2AD3",
  "sung": "\u266A",
  "sup1": "\xB9",
  "sup2": "\xB2",
  "sup3": "\xB3",
  "supE": "\u2AC6",
  "supseteqq": "\u2AC6",
  "supdot": "\u2ABE",
  "supdsub": "\u2AD8",
  "supedot": "\u2AC4",
  "suphsol": "\u27C9",
  "suphsub": "\u2AD7",
  "suplarr": "\u297B",
  "supmult": "\u2AC2",
  "supnE": "\u2ACC",
  "supsetneqq": "\u2ACC",
  "supne": "\u228B",
  "supsetneq": "\u228B",
  "supplus": "\u2AC0",
  "supsim": "\u2AC8",
  "supsub": "\u2AD4",
  "supsup": "\u2AD6",
  "swArr": "\u21D9",
  "swnwar": "\u292A",
  "szlig": "\xDF",
  "target": "\u2316",
  "tau": "\u03C4",
  "tcaron": "\u0165",
  "tcedil": "\u0163",
  "tcy": "\u0442",
  "telrec": "\u2315",
  "tfr": "\u{1D531}",
  "theta": "\u03B8",
  "thetasym": "\u03D1",
  "thetav": "\u03D1",
  "vartheta": "\u03D1",
  "thorn": "\xFE",
  "times": "\xD7",
  "timesbar": "\u2A31",
  "timesd": "\u2A30",
  "topbot": "\u2336",
  "topcir": "\u2AF1",
  "topf": "\u{1D565}",
  "topfork": "\u2ADA",
  "tprime": "\u2034",
  "triangle": "\u25B5",
  "utri": "\u25B5",
  "triangleq": "\u225C",
  "trie": "\u225C",
  "tridot": "\u25EC",
  "triminus": "\u2A3A",
  "triplus": "\u2A39",
  "trisb": "\u29CD",
  "tritime": "\u2A3B",
  "trpezium": "\u23E2",
  "tscr": "\u{1D4C9}",
  "tscy": "\u0446",
  "tshcy": "\u045B",
  "tstrok": "\u0167",
  "uHar": "\u2963",
  "uacute": "\xFA",
  "ubrcy": "\u045E",
  "ubreve": "\u016D",
  "ucirc": "\xFB",
  "ucy": "\u0443",
  "udblac": "\u0171",
  "ufisht": "\u297E",
  "ufr": "\u{1D532}",
  "ugrave": "\xF9",
  "uhblk": "\u2580",
  "ulcorn": "\u231C",
  "ulcorner": "\u231C",
  "ulcrop": "\u230F",
  "ultri": "\u25F8",
  "umacr": "\u016B",
  "uogon": "\u0173",
  "uopf": "\u{1D566}",
  "upsi": "\u03C5",
  "upsilon": "\u03C5",
  "upuparrows": "\u21C8",
  "uuarr": "\u21C8",
  "urcorn": "\u231D",
  "urcorner": "\u231D",
  "urcrop": "\u230E",
  "uring": "\u016F",
  "urtri": "\u25F9",
  "uscr": "\u{1D4CA}",
  "utdot": "\u22F0",
  "utilde": "\u0169",
  "uuml": "\xFC",
  "uwangle": "\u29A7",
  "vBar": "\u2AE8",
  "vBarv": "\u2AE9",
  "vangrt": "\u299C",
  "varsubsetneq": "\u228A\uFE00",
  "vsubne": "\u228A\uFE00",
  "varsubsetneqq": "\u2ACB\uFE00",
  "vsubnE": "\u2ACB\uFE00",
  "varsupsetneq": "\u228B\uFE00",
  "vsupne": "\u228B\uFE00",
  "varsupsetneqq": "\u2ACC\uFE00",
  "vsupnE": "\u2ACC\uFE00",
  "vcy": "\u0432",
  "veebar": "\u22BB",
  "veeeq": "\u225A",
  "vellip": "\u22EE",
  "vfr": "\u{1D533}",
  "vopf": "\u{1D567}",
  "vscr": "\u{1D4CB}",
  "vzigzag": "\u299A",
  "wcirc": "\u0175",
  "wedbar": "\u2A5F",
  "wedgeq": "\u2259",
  "weierp": "\u2118",
  "wp": "\u2118",
  "wfr": "\u{1D534}",
  "wopf": "\u{1D568}",
  "wscr": "\u{1D4CC}",
  "xfr": "\u{1D535}",
  "xi": "\u03BE",
  "xnis": "\u22FB",
  "xopf": "\u{1D569}",
  "xscr": "\u{1D4CD}",
  "yacute": "\xFD",
  "yacy": "\u044F",
  "ycirc": "\u0177",
  "ycy": "\u044B",
  "yen": "\xA5",
  "yfr": "\u{1D536}",
  "yicy": "\u0457",
  "yopf": "\u{1D56A}",
  "yscr": "\u{1D4CE}",
  "yucy": "\u044E",
  "yuml": "\xFF",
  "zacute": "\u017A",
  "zcaron": "\u017E",
  "zcy": "\u0437",
  "zdot": "\u017C",
  "zeta": "\u03B6",
  "zfr": "\u{1D537}",
  "zhcy": "\u0436",
  "zigrarr": "\u21DD",
  "zopf": "\u{1D56B}",
  "zscr": "\u{1D4CF}",
  "zwj": "\u200D",
  "zwnj": "\u200C"
};
var NGSP_UNICODE = "\uE500";
NAMED_ENTITIES["ngsp"] = NGSP_UNICODE;
var TokenError = class extends ParseError {
  constructor(errorMsg, tokenType, span) {
    super(span, errorMsg);
    this.tokenType = tokenType;
  }
};
var TokenizeResult = class {
  constructor(tokens, errors, nonNormalizedIcuExpressions) {
    this.tokens = tokens;
    this.errors = errors;
    this.nonNormalizedIcuExpressions = nonNormalizedIcuExpressions;
  }
};
function tokenize(source, url, getTagDefinition, options = {}) {
  const tokenizer = new _Tokenizer(new ParseSourceFile(source, url), getTagDefinition, options);
  tokenizer.tokenize();
  return new TokenizeResult(mergeTextTokens(tokenizer.tokens), tokenizer.errors, tokenizer.nonNormalizedIcuExpressions);
}
var _CR_OR_CRLF_REGEXP = /\r\n?/g;
function _unexpectedCharacterErrorMsg(charCode) {
  const char = charCode === $EOF ? "EOF" : String.fromCharCode(charCode);
  return `Unexpected character "${char}"`;
}
function _unknownEntityErrorMsg(entitySrc) {
  return `Unknown entity "${entitySrc}" - use the "&#<decimal>;" or  "&#x<hex>;" syntax`;
}
function _unparsableEntityErrorMsg(type, entityStr) {
  return `Unable to parse entity "${entityStr}" - ${type} character reference entities must end with ";"`;
}
var CharacterReferenceType;
(function(CharacterReferenceType2) {
  CharacterReferenceType2["HEX"] = "hexadecimal";
  CharacterReferenceType2["DEC"] = "decimal";
})(CharacterReferenceType || (CharacterReferenceType = {}));
var _ControlFlowError = class {
  constructor(error2) {
    this.error = error2;
  }
};
var _Tokenizer = class {
  /**
   * @param _file The html source file being tokenized.
   * @param _getTagDefinition A function that will retrieve a tag definition for a given tag name.
   * @param options Configuration of the tokenization.
   */
  constructor(_file, _getTagDefinition, options) {
    this._getTagDefinition = _getTagDefinition;
    this._currentTokenStart = null;
    this._currentTokenType = null;
    this._expansionCaseStack = [];
    this._inInterpolation = false;
    this.tokens = [];
    this.errors = [];
    this.nonNormalizedIcuExpressions = [];
    this._tokenizeIcu = options.tokenizeExpansionForms || false;
    this._interpolationConfig = options.interpolationConfig || DEFAULT_INTERPOLATION_CONFIG;
    this._leadingTriviaCodePoints = options.leadingTriviaChars && options.leadingTriviaChars.map((c) => c.codePointAt(0) || 0);
    const range = options.range || { endPos: _file.content.length, startPos: 0, startLine: 0, startCol: 0 };
    this._cursor = options.escapedString ? new EscapedCharacterCursor(_file, range) : new PlainCharacterCursor(_file, range);
    this._preserveLineEndings = options.preserveLineEndings || false;
    this._i18nNormalizeLineEndingsInICUs = options.i18nNormalizeLineEndingsInICUs || false;
    this._tokenizeBlocks = options.tokenizeBlocks || false;
    try {
      this._cursor.init();
    } catch (e) {
      this.handleError(e);
    }
  }
  _processCarriageReturns(content) {
    if (this._preserveLineEndings) {
      return content;
    }
    return content.replace(_CR_OR_CRLF_REGEXP, "\n");
  }
  tokenize() {
    while (this._cursor.peek() !== $EOF) {
      const start = this._cursor.clone();
      try {
        if (this._attemptCharCode($LT)) {
          if (this._attemptCharCode($BANG)) {
            if (this._attemptCharCode($LBRACKET)) {
              this._consumeCdata(start);
            } else if (this._attemptCharCode($MINUS)) {
              this._consumeComment(start);
            } else {
              this._consumeDocType(start);
            }
          } else if (this._attemptCharCode($SLASH)) {
            this._consumeTagClose(start);
          } else {
            this._consumeTagOpen(start);
          }
        } else if (this._tokenizeBlocks && this._attemptStr("{#")) {
          this._consumeBlockGroupOpen(start);
        } else if (this._tokenizeBlocks && this._attemptStr("{/")) {
          this._consumeBlockGroupClose(start);
        } else if (this._tokenizeBlocks && this._attemptStr("{:")) {
          this._consumeBlock(start);
        } else if (!(this._tokenizeIcu && this._tokenizeExpansionForm())) {
          this._consumeWithInterpolation(5, 8, () => this._isTextEnd(), () => this._isTagStart());
        }
      } catch (e) {
        this.handleError(e);
      }
    }
    this._beginToken(
      24
      /* TokenType.EOF */
    );
    this._endToken([]);
  }
  _consumeBlockGroupOpen(start) {
    this._beginToken(25, start);
    const nameCursor = this._cursor.clone();
    this._attemptCharCodeUntilFn((code) => !isBlockNameChar(code));
    this._endToken([this._cursor.getChars(nameCursor)]);
    this._consumeBlockParameters();
    this._beginToken(
      26
      /* TokenType.BLOCK_GROUP_OPEN_END */
    );
    this._requireCharCode($RBRACE);
    this._endToken([]);
  }
  _consumeBlockGroupClose(start) {
    this._beginToken(27, start);
    const nameCursor = this._cursor.clone();
    this._attemptCharCodeUntilFn((code) => !isBlockNameChar(code));
    const name = this._cursor.getChars(nameCursor);
    this._requireCharCode($RBRACE);
    this._endToken([name]);
  }
  _consumeBlock(start) {
    this._beginToken(29, start);
    const nameCursor = this._cursor.clone();
    this._attemptCharCodeUntilFn((code) => !isBlockNameChar(code));
    this._endToken([this._cursor.getChars(nameCursor)]);
    this._consumeBlockParameters();
    this._beginToken(
      30
      /* TokenType.BLOCK_OPEN_END */
    );
    this._requireCharCode($RBRACE);
    this._endToken([]);
  }
  _consumeBlockParameters() {
    this._attemptCharCodeUntilFn(isBlockParameterChar);
    while (this._cursor.peek() !== $RBRACE && this._cursor.peek() !== $EOF) {
      this._beginToken(
        28
        /* TokenType.BLOCK_PARAMETER */
      );
      const start = this._cursor.clone();
      let inQuote = null;
      let openBraces = 0;
      while (this._cursor.peek() !== $SEMICOLON && this._cursor.peek() !== $EOF || inQuote !== null) {
        const char = this._cursor.peek();
        if (char === $BACKSLASH) {
          this._cursor.advance();
        } else if (char === inQuote) {
          inQuote = null;
        } else if (inQuote === null && isQuote(char)) {
          inQuote = char;
        } else if (char === $LBRACE && inQuote === null) {
          openBraces++;
        } else if (char === $RBRACE && inQuote === null) {
          if (openBraces === 0) {
            break;
          } else if (openBraces > 0) {
            openBraces--;
          }
        }
        this._cursor.advance();
      }
      this._endToken([this._cursor.getChars(start)]);
      this._attemptCharCodeUntilFn(isBlockParameterChar);
    }
  }
  /**
   * @returns whether an ICU token has been created
   * @internal
   */
  _tokenizeExpansionForm() {
    if (this.isExpansionFormStart()) {
      this._consumeExpansionFormStart();
      return true;
    }
    if (isExpansionCaseStart(this._cursor.peek()) && this._isInExpansionForm()) {
      this._consumeExpansionCaseStart();
      return true;
    }
    if (this._cursor.peek() === $RBRACE) {
      if (this._isInExpansionCase()) {
        this._consumeExpansionCaseEnd();
        return true;
      }
      if (this._isInExpansionForm()) {
        this._consumeExpansionFormEnd();
        return true;
      }
    }
    return false;
  }
  _beginToken(type, start = this._cursor.clone()) {
    this._currentTokenStart = start;
    this._currentTokenType = type;
  }
  _endToken(parts, end) {
    if (this._currentTokenStart === null) {
      throw new TokenError("Programming error - attempted to end a token when there was no start to the token", this._currentTokenType, this._cursor.getSpan(end));
    }
    if (this._currentTokenType === null) {
      throw new TokenError("Programming error - attempted to end a token which has no token type", null, this._cursor.getSpan(this._currentTokenStart));
    }
    const token = {
      type: this._currentTokenType,
      parts,
      sourceSpan: (end ?? this._cursor).getSpan(this._currentTokenStart, this._leadingTriviaCodePoints)
    };
    this.tokens.push(token);
    this._currentTokenStart = null;
    this._currentTokenType = null;
    return token;
  }
  _createError(msg, span) {
    if (this._isInExpansionForm()) {
      msg += ` (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)`;
    }
    const error2 = new TokenError(msg, this._currentTokenType, span);
    this._currentTokenStart = null;
    this._currentTokenType = null;
    return new _ControlFlowError(error2);
  }
  handleError(e) {
    if (e instanceof CursorError) {
      e = this._createError(e.msg, this._cursor.getSpan(e.cursor));
    }
    if (e instanceof _ControlFlowError) {
      this.errors.push(e.error);
    } else {
      throw e;
    }
  }
  _attemptCharCode(charCode) {
    if (this._cursor.peek() === charCode) {
      this._cursor.advance();
      return true;
    }
    return false;
  }
  _attemptCharCodeCaseInsensitive(charCode) {
    if (compareCharCodeCaseInsensitive(this._cursor.peek(), charCode)) {
      this._cursor.advance();
      return true;
    }
    return false;
  }
  _requireCharCode(charCode) {
    const location = this._cursor.clone();
    if (!this._attemptCharCode(charCode)) {
      throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(location));
    }
  }
  _attemptStr(chars) {
    const len = chars.length;
    if (this._cursor.charsLeft() < len) {
      return false;
    }
    const initialPosition = this._cursor.clone();
    for (let i = 0; i < len; i++) {
      if (!this._attemptCharCode(chars.charCodeAt(i))) {
        this._cursor = initialPosition;
        return false;
      }
    }
    return true;
  }
  _attemptStrCaseInsensitive(chars) {
    for (let i = 0; i < chars.length; i++) {
      if (!this._attemptCharCodeCaseInsensitive(chars.charCodeAt(i))) {
        return false;
      }
    }
    return true;
  }
  _requireStr(chars) {
    const location = this._cursor.clone();
    if (!this._attemptStr(chars)) {
      throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(location));
    }
  }
  _attemptCharCodeUntilFn(predicate) {
    while (!predicate(this._cursor.peek())) {
      this._cursor.advance();
    }
  }
  _requireCharCodeUntilFn(predicate, len) {
    const start = this._cursor.clone();
    this._attemptCharCodeUntilFn(predicate);
    if (this._cursor.diff(start) < len) {
      throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(start));
    }
  }
  _attemptUntilChar(char) {
    while (this._cursor.peek() !== char) {
      this._cursor.advance();
    }
  }
  _readChar() {
    const char = String.fromCodePoint(this._cursor.peek());
    this._cursor.advance();
    return char;
  }
  _consumeEntity(textTokenType) {
    this._beginToken(
      9
      /* TokenType.ENCODED_ENTITY */
    );
    const start = this._cursor.clone();
    this._cursor.advance();
    if (this._attemptCharCode($HASH)) {
      const isHex = this._attemptCharCode($x) || this._attemptCharCode($X);
      const codeStart = this._cursor.clone();
      this._attemptCharCodeUntilFn(isDigitEntityEnd);
      if (this._cursor.peek() != $SEMICOLON) {
        this._cursor.advance();
        const entityType = isHex ? CharacterReferenceType.HEX : CharacterReferenceType.DEC;
        throw this._createError(_unparsableEntityErrorMsg(entityType, this._cursor.getChars(start)), this._cursor.getSpan());
      }
      const strNum = this._cursor.getChars(codeStart);
      this._cursor.advance();
      try {
        const charCode = parseInt(strNum, isHex ? 16 : 10);
        this._endToken([String.fromCharCode(charCode), this._cursor.getChars(start)]);
      } catch {
        throw this._createError(_unknownEntityErrorMsg(this._cursor.getChars(start)), this._cursor.getSpan());
      }
    } else {
      const nameStart = this._cursor.clone();
      this._attemptCharCodeUntilFn(isNamedEntityEnd);
      if (this._cursor.peek() != $SEMICOLON) {
        this._beginToken(textTokenType, start);
        this._cursor = nameStart;
        this._endToken(["&"]);
      } else {
        const name = this._cursor.getChars(nameStart);
        this._cursor.advance();
        const char = NAMED_ENTITIES[name];
        if (!char) {
          throw this._createError(_unknownEntityErrorMsg(name), this._cursor.getSpan(start));
        }
        this._endToken([char, `&${name};`]);
      }
    }
  }
  _consumeRawText(consumeEntities, endMarkerPredicate) {
    this._beginToken(
      consumeEntities ? 6 : 7
      /* TokenType.RAW_TEXT */
    );
    const parts = [];
    while (true) {
      const tagCloseStart = this._cursor.clone();
      const foundEndMarker = endMarkerPredicate();
      this._cursor = tagCloseStart;
      if (foundEndMarker) {
        break;
      }
      if (consumeEntities && this._cursor.peek() === $AMPERSAND) {
        this._endToken([this._processCarriageReturns(parts.join(""))]);
        parts.length = 0;
        this._consumeEntity(
          6
          /* TokenType.ESCAPABLE_RAW_TEXT */
        );
        this._beginToken(
          6
          /* TokenType.ESCAPABLE_RAW_TEXT */
        );
      } else {
        parts.push(this._readChar());
      }
    }
    this._endToken([this._processCarriageReturns(parts.join(""))]);
  }
  _consumeComment(start) {
    this._beginToken(10, start);
    this._requireCharCode($MINUS);
    this._endToken([]);
    this._consumeRawText(false, () => this._attemptStr("-->"));
    this._beginToken(
      11
      /* TokenType.COMMENT_END */
    );
    this._requireStr("-->");
    this._endToken([]);
  }
  _consumeCdata(start) {
    this._beginToken(12, start);
    this._requireStr("CDATA[");
    this._endToken([]);
    this._consumeRawText(false, () => this._attemptStr("]]>"));
    this._beginToken(
      13
      /* TokenType.CDATA_END */
    );
    this._requireStr("]]>");
    this._endToken([]);
  }
  _consumeDocType(start) {
    this._beginToken(18, start);
    const contentStart = this._cursor.clone();
    this._attemptUntilChar($GT);
    const content = this._cursor.getChars(contentStart);
    this._cursor.advance();
    this._endToken([content]);
  }
  _consumePrefixAndName() {
    const nameOrPrefixStart = this._cursor.clone();
    let prefix = "";
    while (this._cursor.peek() !== $COLON && !isPrefixEnd(this._cursor.peek())) {
      this._cursor.advance();
    }
    let nameStart;
    if (this._cursor.peek() === $COLON) {
      prefix = this._cursor.getChars(nameOrPrefixStart);
      this._cursor.advance();
      nameStart = this._cursor.clone();
    } else {
      nameStart = nameOrPrefixStart;
    }
    this._requireCharCodeUntilFn(isNameEnd, prefix === "" ? 0 : 1);
    const name = this._cursor.getChars(nameStart);
    return [prefix, name];
  }
  _consumeTagOpen(start) {
    let tagName;
    let prefix;
    let openTagToken;
    try {
      if (!isAsciiLetter(this._cursor.peek())) {
        throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(start));
      }
      openTagToken = this._consumeTagOpenStart(start);
      prefix = openTagToken.parts[0];
      tagName = openTagToken.parts[1];
      this._attemptCharCodeUntilFn(isNotWhitespace);
      while (this._cursor.peek() !== $SLASH && this._cursor.peek() !== $GT && this._cursor.peek() !== $LT && this._cursor.peek() !== $EOF) {
        this._consumeAttributeName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        if (this._attemptCharCode($EQ)) {
          this._attemptCharCodeUntilFn(isNotWhitespace);
          this._consumeAttributeValue();
        }
        this._attemptCharCodeUntilFn(isNotWhitespace);
      }
      this._consumeTagOpenEnd();
    } catch (e) {
      if (e instanceof _ControlFlowError) {
        if (openTagToken) {
          openTagToken.type = 4;
        } else {
          this._beginToken(5, start);
          this._endToken(["<"]);
        }
        return;
      }
      throw e;
    }
    const contentTokenType = this._getTagDefinition(tagName).getContentType(prefix);
    if (contentTokenType === TagContentType.RAW_TEXT) {
      this._consumeRawTextWithTagClose(prefix, tagName, false);
    } else if (contentTokenType === TagContentType.ESCAPABLE_RAW_TEXT) {
      this._consumeRawTextWithTagClose(prefix, tagName, true);
    }
  }
  _consumeRawTextWithTagClose(prefix, tagName, consumeEntities) {
    this._consumeRawText(consumeEntities, () => {
      if (!this._attemptCharCode($LT))
        return false;
      if (!this._attemptCharCode($SLASH))
        return false;
      this._attemptCharCodeUntilFn(isNotWhitespace);
      if (!this._attemptStrCaseInsensitive(tagName))
        return false;
      this._attemptCharCodeUntilFn(isNotWhitespace);
      return this._attemptCharCode($GT);
    });
    this._beginToken(
      3
      /* TokenType.TAG_CLOSE */
    );
    this._requireCharCodeUntilFn((code) => code === $GT, 3);
    this._cursor.advance();
    this._endToken([prefix, tagName]);
  }
  _consumeTagOpenStart(start) {
    this._beginToken(0, start);
    const parts = this._consumePrefixAndName();
    return this._endToken(parts);
  }
  _consumeAttributeName() {
    const attrNameStart = this._cursor.peek();
    if (attrNameStart === $SQ || attrNameStart === $DQ) {
      throw this._createError(_unexpectedCharacterErrorMsg(attrNameStart), this._cursor.getSpan());
    }
    this._beginToken(
      14
      /* TokenType.ATTR_NAME */
    );
    const prefixAndName = this._consumePrefixAndName();
    this._endToken(prefixAndName);
  }
  _consumeAttributeValue() {
    if (this._cursor.peek() === $SQ || this._cursor.peek() === $DQ) {
      const quoteChar = this._cursor.peek();
      this._consumeQuote(quoteChar);
      const endPredicate = () => this._cursor.peek() === quoteChar;
      this._consumeWithInterpolation(16, 17, endPredicate, endPredicate);
      this._consumeQuote(quoteChar);
    } else {
      const endPredicate = () => isNameEnd(this._cursor.peek());
      this._consumeWithInterpolation(16, 17, endPredicate, endPredicate);
    }
  }
  _consumeQuote(quoteChar) {
    this._beginToken(
      15
      /* TokenType.ATTR_QUOTE */
    );
    this._requireCharCode(quoteChar);
    this._endToken([String.fromCodePoint(quoteChar)]);
  }
  _consumeTagOpenEnd() {
    const tokenType = this._attemptCharCode($SLASH) ? 2 : 1;
    this._beginToken(tokenType);
    this._requireCharCode($GT);
    this._endToken([]);
  }
  _consumeTagClose(start) {
    this._beginToken(3, start);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    const prefixAndName = this._consumePrefixAndName();
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._requireCharCode($GT);
    this._endToken(prefixAndName);
  }
  _consumeExpansionFormStart() {
    this._beginToken(
      19
      /* TokenType.EXPANSION_FORM_START */
    );
    this._requireCharCode($LBRACE);
    this._endToken([]);
    this._expansionCaseStack.push(
      19
      /* TokenType.EXPANSION_FORM_START */
    );
    this._beginToken(
      7
      /* TokenType.RAW_TEXT */
    );
    const condition = this._readUntil($COMMA);
    const normalizedCondition = this._processCarriageReturns(condition);
    if (this._i18nNormalizeLineEndingsInICUs) {
      this._endToken([normalizedCondition]);
    } else {
      const conditionToken = this._endToken([condition]);
      if (normalizedCondition !== condition) {
        this.nonNormalizedIcuExpressions.push(conditionToken);
      }
    }
    this._requireCharCode($COMMA);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._beginToken(
      7
      /* TokenType.RAW_TEXT */
    );
    const type = this._readUntil($COMMA);
    this._endToken([type]);
    this._requireCharCode($COMMA);
    this._attemptCharCodeUntilFn(isNotWhitespace);
  }
  _consumeExpansionCaseStart() {
    this._beginToken(
      20
      /* TokenType.EXPANSION_CASE_VALUE */
    );
    const value = this._readUntil($LBRACE).trim();
    this._endToken([value]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._beginToken(
      21
      /* TokenType.EXPANSION_CASE_EXP_START */
    );
    this._requireCharCode($LBRACE);
    this._endToken([]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._expansionCaseStack.push(
      21
      /* TokenType.EXPANSION_CASE_EXP_START */
    );
  }
  _consumeExpansionCaseEnd() {
    this._beginToken(
      22
      /* TokenType.EXPANSION_CASE_EXP_END */
    );
    this._requireCharCode($RBRACE);
    this._endToken([]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._expansionCaseStack.pop();
  }
  _consumeExpansionFormEnd() {
    this._beginToken(
      23
      /* TokenType.EXPANSION_FORM_END */
    );
    this._requireCharCode($RBRACE);
    this._endToken([]);
    this._expansionCaseStack.pop();
  }
  /**
   * Consume a string that may contain interpolation expressions.
   *
   * The first token consumed will be of `tokenType` and then there will be alternating
   * `interpolationTokenType` and `tokenType` tokens until the `endPredicate()` returns true.
   *
   * If an interpolation token ends prematurely it will have no end marker in its `parts` array.
   *
   * @param textTokenType the kind of tokens to interleave around interpolation tokens.
   * @param interpolationTokenType the kind of tokens that contain interpolation.
   * @param endPredicate a function that should return true when we should stop consuming.
   * @param endInterpolation a function that should return true if there is a premature end to an
   *     interpolation expression - i.e. before we get to the normal interpolation closing marker.
   */
  _consumeWithInterpolation(textTokenType, interpolationTokenType, endPredicate, endInterpolation) {
    this._beginToken(textTokenType);
    const parts = [];
    while (!endPredicate()) {
      const current = this._cursor.clone();
      if (this._interpolationConfig && this._attemptStr(this._interpolationConfig.start)) {
        this._endToken([this._processCarriageReturns(parts.join(""))], current);
        parts.length = 0;
        this._consumeInterpolation(interpolationTokenType, current, endInterpolation);
        this._beginToken(textTokenType);
      } else if (this._cursor.peek() === $AMPERSAND) {
        this._endToken([this._processCarriageReturns(parts.join(""))]);
        parts.length = 0;
        this._consumeEntity(textTokenType);
        this._beginToken(textTokenType);
      } else {
        parts.push(this._readChar());
      }
    }
    this._inInterpolation = false;
    this._endToken([this._processCarriageReturns(parts.join(""))]);
  }
  /**
   * Consume a block of text that has been interpreted as an Angular interpolation.
   *
   * @param interpolationTokenType the type of the interpolation token to generate.
   * @param interpolationStart a cursor that points to the start of this interpolation.
   * @param prematureEndPredicate a function that should return true if the next characters indicate
   *     an end to the interpolation before its normal closing marker.
   */
  _consumeInterpolation(interpolationTokenType, interpolationStart, prematureEndPredicate) {
    const parts = [];
    this._beginToken(interpolationTokenType, interpolationStart);
    parts.push(this._interpolationConfig.start);
    const expressionStart = this._cursor.clone();
    let inQuote = null;
    let inComment = false;
    while (this._cursor.peek() !== $EOF && (prematureEndPredicate === null || !prematureEndPredicate())) {
      const current = this._cursor.clone();
      if (this._isTagStart()) {
        this._cursor = current;
        parts.push(this._getProcessedChars(expressionStart, current));
        this._endToken(parts);
        return;
      }
      if (inQuote === null) {
        if (this._attemptStr(this._interpolationConfig.end)) {
          parts.push(this._getProcessedChars(expressionStart, current));
          parts.push(this._interpolationConfig.end);
          this._endToken(parts);
          return;
        } else if (this._attemptStr("//")) {
          inComment = true;
        }
      }
      const char = this._cursor.peek();
      this._cursor.advance();
      if (char === $BACKSLASH) {
        this._cursor.advance();
      } else if (char === inQuote) {
        inQuote = null;
      } else if (!inComment && inQuote === null && isQuote(char)) {
        inQuote = char;
      }
    }
    parts.push(this._getProcessedChars(expressionStart, this._cursor));
    this._endToken(parts);
  }
  _getProcessedChars(start, end) {
    return this._processCarriageReturns(end.getChars(start));
  }
  _isTextEnd() {
    if (this._isTagStart() || this._isBlockStart() || this._cursor.peek() === $EOF) {
      return true;
    }
    if (this._tokenizeIcu && !this._inInterpolation) {
      if (this.isExpansionFormStart()) {
        return true;
      }
      if (this._cursor.peek() === $RBRACE && this._isInExpansionCase()) {
        return true;
      }
    }
    return false;
  }
  /**
   * Returns true if the current cursor is pointing to the start of a tag
   * (opening/closing/comments/cdata/etc).
   */
  _isTagStart() {
    if (this._cursor.peek() === $LT) {
      const tmp = this._cursor.clone();
      tmp.advance();
      const code = tmp.peek();
      if ($a <= code && code <= $z || $A <= code && code <= $Z || code === $SLASH || code === $BANG) {
        return true;
      }
    }
    return false;
  }
  _isBlockStart() {
    if (this._tokenizeBlocks && this._cursor.peek() === $LBRACE) {
      const tmp = this._cursor.clone();
      tmp.advance();
      const next = tmp.peek();
      if (next !== $BANG && next !== $SLASH && next !== $COLON) {
        return false;
      }
      tmp.advance();
      if (isBlockNameChar(tmp.peek())) {
        return true;
      }
    }
    return false;
  }
  _readUntil(char) {
    const start = this._cursor.clone();
    this._attemptUntilChar(char);
    return this._cursor.getChars(start);
  }
  _isInExpansionCase() {
    return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 21;
  }
  _isInExpansionForm() {
    return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 19;
  }
  isExpansionFormStart() {
    if (this._cursor.peek() !== $LBRACE) {
      return false;
    }
    if (this._interpolationConfig) {
      const start = this._cursor.clone();
      const isInterpolation = this._attemptStr(this._interpolationConfig.start);
      this._cursor = start;
      return !isInterpolation;
    }
    return true;
  }
};
function isNotWhitespace(code) {
  return !isWhitespace(code) || code === $EOF;
}
function isNameEnd(code) {
  return isWhitespace(code) || code === $GT || code === $LT || code === $SLASH || code === $SQ || code === $DQ || code === $EQ || code === $EOF;
}
function isPrefixEnd(code) {
  return (code < $a || $z < code) && (code < $A || $Z < code) && (code < $0 || code > $9);
}
function isDigitEntityEnd(code) {
  return code === $SEMICOLON || code === $EOF || !isAsciiHexDigit(code);
}
function isNamedEntityEnd(code) {
  return code === $SEMICOLON || code === $EOF || !isAsciiLetter(code);
}
function isExpansionCaseStart(peek) {
  return peek !== $RBRACE;
}
function compareCharCodeCaseInsensitive(code1, code2) {
  return toUpperCaseCharCode(code1) === toUpperCaseCharCode(code2);
}
function toUpperCaseCharCode(code) {
  return code >= $a && code <= $z ? code - $a + $A : code;
}
function isBlockNameChar(code) {
  return isAsciiLetter(code) || isDigit(code) || code === $_;
}
function isBlockParameterChar(code) {
  return code !== $SEMICOLON && isNotWhitespace(code);
}
function mergeTextTokens(srcTokens) {
  const dstTokens = [];
  let lastDstToken = void 0;
  for (let i = 0; i < srcTokens.length; i++) {
    const token = srcTokens[i];
    if (lastDstToken && lastDstToken.type === 5 && token.type === 5 || lastDstToken && lastDstToken.type === 16 && token.type === 16) {
      lastDstToken.parts[0] += token.parts[0];
      lastDstToken.sourceSpan.end = token.sourceSpan.end;
    } else {
      lastDstToken = token;
      dstTokens.push(lastDstToken);
    }
  }
  return dstTokens;
}
var PlainCharacterCursor = class _PlainCharacterCursor {
  constructor(fileOrCursor, range) {
    if (fileOrCursor instanceof _PlainCharacterCursor) {
      this.file = fileOrCursor.file;
      this.input = fileOrCursor.input;
      this.end = fileOrCursor.end;
      const state = fileOrCursor.state;
      this.state = {
        peek: state.peek,
        offset: state.offset,
        line: state.line,
        column: state.column
      };
    } else {
      if (!range) {
        throw new Error("Programming error: the range argument must be provided with a file argument.");
      }
      this.file = fileOrCursor;
      this.input = fileOrCursor.content;
      this.end = range.endPos;
      this.state = {
        peek: -1,
        offset: range.startPos,
        line: range.startLine,
        column: range.startCol
      };
    }
  }
  clone() {
    return new _PlainCharacterCursor(this);
  }
  peek() {
    return this.state.peek;
  }
  charsLeft() {
    return this.end - this.state.offset;
  }
  diff(other) {
    return this.state.offset - other.state.offset;
  }
  advance() {
    this.advanceState(this.state);
  }
  init() {
    this.updatePeek(this.state);
  }
  getSpan(start, leadingTriviaCodePoints) {
    start = start || this;
    let fullStart = start;
    if (leadingTriviaCodePoints) {
      while (this.diff(start) > 0 && leadingTriviaCodePoints.indexOf(start.peek()) !== -1) {
        if (fullStart === start) {
          start = start.clone();
        }
        start.advance();
      }
    }
    const startLocation = this.locationFromCursor(start);
    const endLocation = this.locationFromCursor(this);
    const fullStartLocation = fullStart !== start ? this.locationFromCursor(fullStart) : startLocation;
    return new ParseSourceSpan(startLocation, endLocation, fullStartLocation);
  }
  getChars(start) {
    return this.input.substring(start.state.offset, this.state.offset);
  }
  charAt(pos) {
    return this.input.charCodeAt(pos);
  }
  advanceState(state) {
    if (state.offset >= this.end) {
      this.state = state;
      throw new CursorError('Unexpected character "EOF"', this);
    }
    const currentChar = this.charAt(state.offset);
    if (currentChar === $LF) {
      state.line++;
      state.column = 0;
    } else if (!isNewLine(currentChar)) {
      state.column++;
    }
    state.offset++;
    this.updatePeek(state);
  }
  updatePeek(state) {
    state.peek = state.offset >= this.end ? $EOF : this.charAt(state.offset);
  }
  locationFromCursor(cursor) {
    return new ParseLocation(cursor.file, cursor.state.offset, cursor.state.line, cursor.state.column);
  }
};
var EscapedCharacterCursor = class _EscapedCharacterCursor extends PlainCharacterCursor {
  constructor(fileOrCursor, range) {
    if (fileOrCursor instanceof _EscapedCharacterCursor) {
      super(fileOrCursor);
      this.internalState = __spreadValues({}, fileOrCursor.internalState);
    } else {
      super(fileOrCursor, range);
      this.internalState = this.state;
    }
  }
  advance() {
    this.state = this.internalState;
    super.advance();
    this.processEscapeSequence();
  }
  init() {
    super.init();
    this.processEscapeSequence();
  }
  clone() {
    return new _EscapedCharacterCursor(this);
  }
  getChars(start) {
    const cursor = start.clone();
    let chars = "";
    while (cursor.internalState.offset < this.internalState.offset) {
      chars += String.fromCodePoint(cursor.peek());
      cursor.advance();
    }
    return chars;
  }
  /**
   * Process the escape sequence that starts at the current position in the text.
   *
   * This method is called to ensure that `peek` has the unescaped value of escape sequences.
   */
  processEscapeSequence() {
    const peek = () => this.internalState.peek;
    if (peek() === $BACKSLASH) {
      this.internalState = __spreadValues({}, this.state);
      this.advanceState(this.internalState);
      if (peek() === $n) {
        this.state.peek = $LF;
      } else if (peek() === $r) {
        this.state.peek = $CR;
      } else if (peek() === $v) {
        this.state.peek = $VTAB;
      } else if (peek() === $t) {
        this.state.peek = $TAB;
      } else if (peek() === $b) {
        this.state.peek = $BSPACE;
      } else if (peek() === $f) {
        this.state.peek = $FF;
      } else if (peek() === $u) {
        this.advanceState(this.internalState);
        if (peek() === $LBRACE) {
          this.advanceState(this.internalState);
          const digitStart = this.clone();
          let length = 0;
          while (peek() !== $RBRACE) {
            this.advanceState(this.internalState);
            length++;
          }
          this.state.peek = this.decodeHexDigits(digitStart, length);
        } else {
          const digitStart = this.clone();
          this.advanceState(this.internalState);
          this.advanceState(this.internalState);
          this.advanceState(this.internalState);
          this.state.peek = this.decodeHexDigits(digitStart, 4);
        }
      } else if (peek() === $x) {
        this.advanceState(this.internalState);
        const digitStart = this.clone();
        this.advanceState(this.internalState);
        this.state.peek = this.decodeHexDigits(digitStart, 2);
      } else if (isOctalDigit(peek())) {
        let octal = "";
        let length = 0;
        let previous = this.clone();
        while (isOctalDigit(peek()) && length < 3) {
          previous = this.clone();
          octal += String.fromCodePoint(peek());
          this.advanceState(this.internalState);
          length++;
        }
        this.state.peek = parseInt(octal, 8);
        this.internalState = previous.internalState;
      } else if (isNewLine(this.internalState.peek)) {
        this.advanceState(this.internalState);
        this.state = this.internalState;
      } else {
        this.state.peek = this.internalState.peek;
      }
    }
  }
  decodeHexDigits(start, length) {
    const hex = this.input.slice(start.internalState.offset, start.internalState.offset + length);
    const charCode = parseInt(hex, 16);
    if (!isNaN(charCode)) {
      return charCode;
    } else {
      start.state = start.internalState;
      throw new CursorError("Invalid hexadecimal escape sequence", start);
    }
  }
};
var CursorError = class {
  constructor(msg, cursor) {
    this.msg = msg;
    this.cursor = cursor;
  }
};
var TreeError = class _TreeError extends ParseError {
  static create(elementName, span, msg) {
    return new _TreeError(elementName, span, msg);
  }
  constructor(elementName, span, msg) {
    super(span, msg);
    this.elementName = elementName;
  }
};
var ParseTreeResult = class {
  constructor(rootNodes, errors) {
    this.rootNodes = rootNodes;
    this.errors = errors;
  }
};
var Parser = class {
  constructor(getTagDefinition) {
    this.getTagDefinition = getTagDefinition;
  }
  parse(source, url, options) {
    const tokenizeResult = tokenize(source, url, this.getTagDefinition, options);
    const parser = new _TreeBuilder(tokenizeResult.tokens, this.getTagDefinition);
    parser.build();
    return new ParseTreeResult(parser.rootNodes, tokenizeResult.errors.concat(parser.errors));
  }
};
var _TreeBuilder = class __TreeBuilder {
  constructor(tokens, getTagDefinition) {
    this.tokens = tokens;
    this.getTagDefinition = getTagDefinition;
    this._index = -1;
    this._containerStack = [];
    this.rootNodes = [];
    this.errors = [];
    this._advance();
  }
  build() {
    while (this._peek.type !== 24) {
      if (this._peek.type === 0 || this._peek.type === 4) {
        this._consumeStartTag(this._advance());
      } else if (this._peek.type === 3) {
        this._consumeEndTag(this._advance());
      } else if (this._peek.type === 12) {
        this._closeVoidElement();
        this._consumeCdata(this._advance());
      } else if (this._peek.type === 10) {
        this._closeVoidElement();
        this._consumeComment(this._advance());
      } else if (this._peek.type === 5 || this._peek.type === 7 || this._peek.type === 6) {
        this._closeVoidElement();
        this._consumeText(this._advance());
      } else if (this._peek.type === 19) {
        this._consumeExpansion(this._advance());
      } else if (this._peek.type === 25) {
        this._closeVoidElement();
        this._consumeBlockGroupOpen(this._advance());
      } else if (this._peek.type === 29) {
        this._closeVoidElement();
        this._consumeBlock(
          this._advance(),
          30
          /* TokenType.BLOCK_OPEN_END */
        );
      } else if (this._peek.type === 27) {
        this._closeVoidElement();
        this._consumeBlockGroupClose(this._advance());
      } else {
        this._advance();
      }
    }
  }
  _advance() {
    const prev = this._peek;
    if (this._index < this.tokens.length - 1) {
      this._index++;
    }
    this._peek = this.tokens[this._index];
    return prev;
  }
  _advanceIf(type) {
    if (this._peek.type === type) {
      return this._advance();
    }
    return null;
  }
  _consumeCdata(_startToken) {
    this._consumeText(this._advance());
    this._advanceIf(
      13
      /* TokenType.CDATA_END */
    );
  }
  _consumeComment(token) {
    const text2 = this._advanceIf(
      7
      /* TokenType.RAW_TEXT */
    );
    const endToken = this._advanceIf(
      11
      /* TokenType.COMMENT_END */
    );
    const value = text2 != null ? text2.parts[0].trim() : null;
    const sourceSpan = endToken == null ? token.sourceSpan : new ParseSourceSpan(token.sourceSpan.start, endToken.sourceSpan.end, token.sourceSpan.fullStart);
    this._addToParent(new Comment(value, sourceSpan));
  }
  _consumeExpansion(token) {
    const switchValue = this._advance();
    const type = this._advance();
    const cases = [];
    while (this._peek.type === 20) {
      const expCase = this._parseExpansionCase();
      if (!expCase)
        return;
      cases.push(expCase);
    }
    if (this._peek.type !== 23) {
      this.errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '}'.`));
      return;
    }
    const sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end, token.sourceSpan.fullStart);
    this._addToParent(new Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
    this._advance();
  }
  _parseExpansionCase() {
    const value = this._advance();
    if (this._peek.type !== 21) {
      this.errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '{'.`));
      return null;
    }
    const start = this._advance();
    const exp = this._collectExpansionExpTokens(start);
    if (!exp)
      return null;
    const end = this._advance();
    exp.push({ type: 24, parts: [], sourceSpan: end.sourceSpan });
    const expansionCaseParser = new __TreeBuilder(exp, this.getTagDefinition);
    expansionCaseParser.build();
    if (expansionCaseParser.errors.length > 0) {
      this.errors = this.errors.concat(expansionCaseParser.errors);
      return null;
    }
    const sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end, value.sourceSpan.fullStart);
    const expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end, start.sourceSpan.fullStart);
    return new ExpansionCase(value.parts[0], expansionCaseParser.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
  }
  _collectExpansionExpTokens(start) {
    const exp = [];
    const expansionFormStack = [
      21
      /* TokenType.EXPANSION_CASE_EXP_START */
    ];
    while (true) {
      if (this._peek.type === 19 || this._peek.type === 21) {
        expansionFormStack.push(this._peek.type);
      }
      if (this._peek.type === 22) {
        if (lastOnStack(
          expansionFormStack,
          21
          /* TokenType.EXPANSION_CASE_EXP_START */
        )) {
          expansionFormStack.pop();
          if (expansionFormStack.length === 0)
            return exp;
        } else {
          this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
          return null;
        }
      }
      if (this._peek.type === 23) {
        if (lastOnStack(
          expansionFormStack,
          19
          /* TokenType.EXPANSION_FORM_START */
        )) {
          expansionFormStack.pop();
        } else {
          this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
          return null;
        }
      }
      if (this._peek.type === 24) {
        this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
        return null;
      }
      exp.push(this._advance());
    }
  }
  _consumeText(token) {
    const tokens = [token];
    const startSpan = token.sourceSpan;
    let text2 = token.parts[0];
    if (text2.length > 0 && text2[0] === "\n") {
      const parent = this._getContainer();
      if (parent instanceof BlockGroup) {
        this.errors.push(TreeError.create(null, startSpan, "Text cannot be placed directly inside of a block group."));
        return null;
      }
      if (parent != null && parent.children.length === 0 && this.getTagDefinition(parent.name).ignoreFirstLf) {
        text2 = text2.substring(1);
        tokens[0] = { type: token.type, sourceSpan: token.sourceSpan, parts: [text2] };
      }
    }
    while (this._peek.type === 8 || this._peek.type === 5 || this._peek.type === 9) {
      token = this._advance();
      tokens.push(token);
      if (token.type === 8) {
        text2 += token.parts.join("").replace(/&([^;]+);/g, decodeEntity);
      } else if (token.type === 9) {
        text2 += token.parts[0];
      } else {
        text2 += token.parts.join("");
      }
    }
    if (text2.length > 0) {
      const endSpan = token.sourceSpan;
      this._addToParent(new Text(text2, new ParseSourceSpan(startSpan.start, endSpan.end, startSpan.fullStart, startSpan.details), tokens));
    }
  }
  _closeVoidElement() {
    const el = this._getContainer();
    if (el instanceof Element && this.getTagDefinition(el.name).isVoid) {
      this._containerStack.pop();
    }
  }
  _consumeStartTag(startTagToken) {
    const [prefix, name] = startTagToken.parts;
    const attrs = [];
    while (this._peek.type === 14) {
      attrs.push(this._consumeAttr(this._advance()));
    }
    const fullName = this._getElementFullName(prefix, name, this._getClosestParentElement());
    let selfClosing = false;
    if (this._peek.type === 2) {
      this._advance();
      selfClosing = true;
      const tagDef = this.getTagDefinition(fullName);
      if (!(tagDef.canSelfClose || getNsPrefix(fullName) !== null || tagDef.isVoid)) {
        this.errors.push(TreeError.create(fullName, startTagToken.sourceSpan, `Only void, custom and foreign elements can be self closed "${startTagToken.parts[1]}"`));
      }
    } else if (this._peek.type === 1) {
      this._advance();
      selfClosing = false;
    }
    const end = this._peek.sourceSpan.fullStart;
    const span = new ParseSourceSpan(startTagToken.sourceSpan.start, end, startTagToken.sourceSpan.fullStart);
    const startSpan = new ParseSourceSpan(startTagToken.sourceSpan.start, end, startTagToken.sourceSpan.fullStart);
    const el = new Element(fullName, attrs, [], span, startSpan, void 0);
    const parentEl = this._getContainer();
    this._pushContainer(el, parentEl instanceof Element && this.getTagDefinition(parentEl.name).isClosedByChild(el.name));
    if (selfClosing) {
      this._popContainer(fullName, Element, span);
    } else if (startTagToken.type === 4) {
      this._popContainer(fullName, Element, null);
      this.errors.push(TreeError.create(fullName, span, `Opening tag "${fullName}" not terminated.`));
    }
  }
  _pushContainer(node, isClosedByChild) {
    if (isClosedByChild) {
      this._containerStack.pop();
    }
    this._addToParent(node);
    this._containerStack.push(node);
  }
  _consumeEndTag(endTagToken) {
    const fullName = this._getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getClosestParentElement());
    if (this.getTagDefinition(fullName).isVoid) {
      this.errors.push(TreeError.create(fullName, endTagToken.sourceSpan, `Void elements do not have end tags "${endTagToken.parts[1]}"`));
    } else if (!this._popContainer(fullName, Element, endTagToken.sourceSpan)) {
      const errMsg = `Unexpected closing tag "${fullName}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
      this.errors.push(TreeError.create(fullName, endTagToken.sourceSpan, errMsg));
    }
  }
  /**
   * Closes the nearest element with the tag name `fullName` in the parse tree.
   * `endSourceSpan` is the span of the closing tag, or null if the element does
   * not have a closing tag (for example, this happens when an incomplete
   * opening tag is recovered).
   */
  _popContainer(fullName, expectedType, endSourceSpan) {
    let unexpectedCloseTagDetected = false;
    for (let stackIndex = this._containerStack.length - 1; stackIndex >= 0; stackIndex--) {
      const node = this._containerStack[stackIndex];
      const name = node instanceof BlockGroup ? node.blocks[0]?.name : node.name;
      if (name === fullName && node instanceof expectedType) {
        node.endSourceSpan = endSourceSpan;
        node.sourceSpan.end = endSourceSpan !== null ? endSourceSpan.end : node.sourceSpan.end;
        this._containerStack.splice(stackIndex, this._containerStack.length - stackIndex);
        return !unexpectedCloseTagDetected;
      }
      if (node instanceof BlockGroup || node instanceof Element && !this.getTagDefinition(node.name).closedByParent) {
        unexpectedCloseTagDetected = true;
      }
    }
    return false;
  }
  _consumeAttr(attrName) {
    const fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
    let attrEnd = attrName.sourceSpan.end;
    if (this._peek.type === 15) {
      this._advance();
    }
    let value = "";
    const valueTokens = [];
    let valueStartSpan = void 0;
    let valueEnd = void 0;
    const nextTokenType = this._peek.type;
    if (nextTokenType === 16) {
      valueStartSpan = this._peek.sourceSpan;
      valueEnd = this._peek.sourceSpan.end;
      while (this._peek.type === 16 || this._peek.type === 17 || this._peek.type === 9) {
        const valueToken = this._advance();
        valueTokens.push(valueToken);
        if (valueToken.type === 17) {
          value += valueToken.parts.join("").replace(/&([^;]+);/g, decodeEntity);
        } else if (valueToken.type === 9) {
          value += valueToken.parts[0];
        } else {
          value += valueToken.parts.join("");
        }
        valueEnd = attrEnd = valueToken.sourceSpan.end;
      }
    }
    if (this._peek.type === 15) {
      const quoteToken = this._advance();
      attrEnd = quoteToken.sourceSpan.end;
    }
    const valueSpan = valueStartSpan && valueEnd && new ParseSourceSpan(valueStartSpan.start, valueEnd, valueStartSpan.fullStart);
    return new Attribute(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, attrEnd, attrName.sourceSpan.fullStart), attrName.sourceSpan, valueSpan, valueTokens.length > 0 ? valueTokens : void 0, void 0);
  }
  _consumeBlockGroupOpen(token) {
    const end = this._peek.sourceSpan.fullStart;
    const span = new ParseSourceSpan(token.sourceSpan.start, end, token.sourceSpan.fullStart);
    const startSpan = new ParseSourceSpan(token.sourceSpan.start, end, token.sourceSpan.fullStart);
    const blockGroup = new BlockGroup([], span, startSpan, null);
    this._pushContainer(blockGroup, false);
    const implicitBlock = this._consumeBlock(
      token,
      26
      /* TokenType.BLOCK_GROUP_OPEN_END */
    );
    startSpan.end = implicitBlock.startSourceSpan.end;
  }
  _consumeBlock(token, closeToken) {
    this._conditionallyClosePreviousBlock();
    const parameters = [];
    while (this._peek.type === 28) {
      const paramToken = this._advance();
      parameters.push(new BlockParameter(paramToken.parts[0], paramToken.sourceSpan));
    }
    if (this._peek.type === closeToken) {
      this._advance();
    }
    const end = this._peek.sourceSpan.fullStart;
    const span = new ParseSourceSpan(token.sourceSpan.start, end, token.sourceSpan.fullStart);
    const startSpan = new ParseSourceSpan(token.sourceSpan.start, end, token.sourceSpan.fullStart);
    const block = new Block(token.parts[0], parameters, [], span, startSpan);
    const parent = this._getContainer();
    if (!(parent instanceof BlockGroup)) {
      this.errors.push(TreeError.create(block.name, block.sourceSpan, "Blocks can only be placed inside of block groups."));
    } else {
      parent.blocks.push(block);
      this._containerStack.push(block);
    }
    return block;
  }
  _consumeBlockGroupClose(token) {
    const name = token.parts[0];
    const previousContainer = this._getContainer();
    this._conditionallyClosePreviousBlock();
    if (!this._popContainer(name, BlockGroup, token.sourceSpan)) {
      const context = previousContainer instanceof Element ? `There is an unclosed "${previousContainer.name}" HTML tag named that may have to be closed first.` : `The block may have been closed earlier.`;
      this.errors.push(TreeError.create(name, token.sourceSpan, `Unexpected closing block "${name}". ${context}`));
    }
  }
  _conditionallyClosePreviousBlock() {
    const container = this._getContainer();
    if (container instanceof Block) {
      const lastChild = container.children.length ? container.children[container.children.length - 1] : null;
      const endSpan = lastChild === null ? null : new ParseSourceSpan(lastChild.sourceSpan.end, lastChild.sourceSpan.end);
      this._popContainer(container.name, Block, endSpan);
    }
  }
  _getContainer() {
    return this._containerStack.length > 0 ? this._containerStack[this._containerStack.length - 1] : null;
  }
  _getClosestParentElement() {
    for (let i = this._containerStack.length - 1; i > -1; i--) {
      if (this._containerStack[i] instanceof Element) {
        return this._containerStack[i];
      }
    }
    return null;
  }
  _addToParent(node) {
    const parent = this._getContainer();
    if (parent === null) {
      this.rootNodes.push(node);
    } else if (parent instanceof BlockGroup) {
      this.errors.push(TreeError.create(null, node.sourceSpan, "Block groups can only contain blocks."));
    } else {
      parent.children.push(node);
    }
  }
  _getElementFullName(prefix, localName, parentElement) {
    if (prefix === "") {
      prefix = this.getTagDefinition(localName).implicitNamespacePrefix || "";
      if (prefix === "" && parentElement != null) {
        const parentTagName = splitNsName(parentElement.name)[1];
        const parentTagDefinition = this.getTagDefinition(parentTagName);
        if (!parentTagDefinition.preventNamespaceInheritance) {
          prefix = getNsPrefix(parentElement.name);
        }
      }
    }
    return mergeNsAndName(prefix, localName);
  }
};
function lastOnStack(stack, element2) {
  return stack.length > 0 && stack[stack.length - 1] === element2;
}
function decodeEntity(match, entity) {
  if (NAMED_ENTITIES[entity] !== void 0) {
    return NAMED_ENTITIES[entity] || match;
  }
  if (/^#x[a-f0-9]+$/i.test(entity)) {
    return String.fromCodePoint(parseInt(entity.slice(2), 16));
  }
  if (/^#\d+$/.test(entity)) {
    return String.fromCodePoint(parseInt(entity.slice(1), 10));
  }
  return match;
}
var HtmlParser = class extends Parser {
  constructor() {
    super(getHtmlTagDefinition);
  }
  parse(source, url, options) {
    return super.parse(source, url, options);
  }
};
var PRESERVE_WS_ATTR_NAME = "ngPreserveWhitespaces";
var SKIP_WS_TRIM_TAGS = /* @__PURE__ */ new Set(["pre", "template", "textarea", "script", "style"]);
var WS_CHARS = " \f\n\r	\v\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF";
var NO_WS_REGEXP = new RegExp(`[^${WS_CHARS}]`);
var WS_REPLACE_REGEXP = new RegExp(`[${WS_CHARS}]{2,}`, "g");
function hasPreserveWhitespacesAttr(attrs) {
  return attrs.some((attr) => attr.name === PRESERVE_WS_ATTR_NAME);
}
function replaceNgsp(value) {
  return value.replace(new RegExp(NGSP_UNICODE, "g"), " ");
}
var WhitespaceVisitor = class {
  visitElement(element2, context) {
    if (SKIP_WS_TRIM_TAGS.has(element2.name) || hasPreserveWhitespacesAttr(element2.attrs)) {
      return new Element(element2.name, visitAll(this, element2.attrs), element2.children, element2.sourceSpan, element2.startSourceSpan, element2.endSourceSpan, element2.i18n);
    }
    return new Element(element2.name, element2.attrs, visitAllWithSiblings(this, element2.children), element2.sourceSpan, element2.startSourceSpan, element2.endSourceSpan, element2.i18n);
  }
  visitAttribute(attribute2, context) {
    return attribute2.name !== PRESERVE_WS_ATTR_NAME ? attribute2 : null;
  }
  visitText(text2, context) {
    const isNotBlank = text2.value.match(NO_WS_REGEXP);
    const hasExpansionSibling = context && (context.prev instanceof Expansion || context.next instanceof Expansion);
    if (isNotBlank || hasExpansionSibling) {
      const tokens = text2.tokens.map((token) => token.type === 5 ? createWhitespaceProcessedTextToken(token) : token);
      const value = processWhitespace(text2.value);
      return new Text(value, text2.sourceSpan, tokens, text2.i18n);
    }
    return null;
  }
  visitComment(comment, context) {
    return comment;
  }
  visitExpansion(expansion, context) {
    return expansion;
  }
  visitExpansionCase(expansionCase, context) {
    return expansionCase;
  }
  visitBlockGroup(group, context) {
    return new BlockGroup(visitAllWithSiblings(this, group.blocks), group.sourceSpan, group.startSourceSpan, group.endSourceSpan);
  }
  visitBlock(block, context) {
    return new Block(block.name, block.parameters, visitAllWithSiblings(this, block.children), block.sourceSpan, block.startSourceSpan);
  }
  visitBlockParameter(parameter, context) {
    return parameter;
  }
};
function createWhitespaceProcessedTextToken({ type, parts, sourceSpan }) {
  return { type, parts: [processWhitespace(parts[0])], sourceSpan };
}
function processWhitespace(text2) {
  return replaceNgsp(text2).replace(WS_REPLACE_REGEXP, " ");
}
function visitAllWithSiblings(visitor, nodes) {
  const result = [];
  nodes.forEach((ast, i) => {
    const context = { prev: nodes[i - 1], next: nodes[i + 1] };
    const astResult = ast.visit(visitor, context);
    if (astResult) {
      result.push(astResult);
    }
  });
  return result;
}
function mapLiteral(obj, quoted = false) {
  return literalMap(Object.keys(obj).map((key) => ({
    key,
    quoted,
    value: obj[key]
  })));
}
var TRUSTED_TYPES_SINKS = /* @__PURE__ */ new Set([
  // NOTE: All strings in this set *must* be lowercase!
  // TrustedHTML
  "iframe|srcdoc",
  "*|innerhtml",
  "*|outerhtml",
  // NB: no TrustedScript here, as the corresponding tags are stripped by the compiler.
  // TrustedScriptURL
  "embed|src",
  "object|codebase",
  "object|data"
]);
function isTrustedTypesSink(tagName, propName) {
  tagName = tagName.toLowerCase();
  propName = propName.toLowerCase();
  return TRUSTED_TYPES_SINKS.has(tagName + "|" + propName) || TRUSTED_TYPES_SINKS.has("*|" + propName);
}
var PROPERTY_PARTS_SEPARATOR = ".";
var ATTRIBUTE_PREFIX = "attr";
var CLASS_PREFIX = "class";
var STYLE_PREFIX = "style";
var TEMPLATE_ATTR_PREFIX$1 = "*";
var ANIMATE_PROP_PREFIX = "animate-";
var BindingParser = class {
  constructor(_exprParser, _interpolationConfig, _schemaRegistry, errors) {
    this._exprParser = _exprParser;
    this._interpolationConfig = _interpolationConfig;
    this._schemaRegistry = _schemaRegistry;
    this.errors = errors;
  }
  get interpolationConfig() {
    return this._interpolationConfig;
  }
  createBoundHostProperties(properties, sourceSpan) {
    const boundProps = [];
    for (const propName of Object.keys(properties)) {
      const expression = properties[propName];
      if (typeof expression === "string") {
        this.parsePropertyBinding(
          propName,
          expression,
          true,
          sourceSpan,
          sourceSpan.start.offset,
          void 0,
          [],
          // Use the `sourceSpan` for  `keySpan`. This isn't really accurate, but neither is the
          // sourceSpan, as it represents the sourceSpan of the host itself rather than the
          // source of the host binding (which doesn't exist in the template). Regardless,
          // neither of these values are used in Ivy but are only here to satisfy the function
          // signature. This should likely be refactored in the future so that `sourceSpan`
          // isn't being used inaccurately.
          boundProps,
          sourceSpan
        );
      } else {
        this._reportError(`Value of the host property binding "${propName}" needs to be a string representing an expression but got "${expression}" (${typeof expression})`, sourceSpan);
      }
    }
    return boundProps;
  }
  createDirectiveHostEventAsts(hostListeners, sourceSpan) {
    const targetEvents = [];
    for (const propName of Object.keys(hostListeners)) {
      const expression = hostListeners[propName];
      if (typeof expression === "string") {
        this.parseEvent(
          propName,
          expression,
          /* isAssignmentEvent */
          false,
          sourceSpan,
          sourceSpan,
          [],
          targetEvents,
          sourceSpan
        );
      } else {
        this._reportError(`Value of the host listener "${propName}" needs to be a string representing an expression but got "${expression}" (${typeof expression})`, sourceSpan);
      }
    }
    return targetEvents;
  }
  parseInterpolation(value, sourceSpan, interpolatedTokens) {
    const sourceInfo = sourceSpan.start.toString();
    const absoluteOffset = sourceSpan.fullStart.offset;
    try {
      const ast = this._exprParser.parseInterpolation(value, sourceInfo, absoluteOffset, interpolatedTokens, this._interpolationConfig);
      if (ast)
        this._reportExpressionParserErrors(ast.errors, sourceSpan);
      return ast;
    } catch (e) {
      this._reportError(`${e}`, sourceSpan);
      return this._exprParser.wrapLiteralPrimitive("ERROR", sourceInfo, absoluteOffset);
    }
  }
  /**
   * Similar to `parseInterpolation`, but treats the provided string as a single expression
   * element that would normally appear within the interpolation prefix and suffix (`{{` and `}}`).
   * This is used for parsing the switch expression in ICUs.
   */
  parseInterpolationExpression(expression, sourceSpan) {
    const sourceInfo = sourceSpan.start.toString();
    const absoluteOffset = sourceSpan.start.offset;
    try {
      const ast = this._exprParser.parseInterpolationExpression(expression, sourceInfo, absoluteOffset);
      if (ast)
        this._reportExpressionParserErrors(ast.errors, sourceSpan);
      return ast;
    } catch (e) {
      this._reportError(`${e}`, sourceSpan);
      return this._exprParser.wrapLiteralPrimitive("ERROR", sourceInfo, absoluteOffset);
    }
  }
  /**
   * Parses the bindings in a microsyntax expression, and converts them to
   * `ParsedProperty` or `ParsedVariable`.
   *
   * @param tplKey template binding name
   * @param tplValue template binding value
   * @param sourceSpan span of template binding relative to entire the template
   * @param absoluteValueOffset start of the tplValue relative to the entire template
   * @param targetMatchableAttrs potential attributes to match in the template
   * @param targetProps target property bindings in the template
   * @param targetVars target variables in the template
   */
  parseInlineTemplateBinding(tplKey, tplValue, sourceSpan, absoluteValueOffset, targetMatchableAttrs, targetProps, targetVars, isIvyAst) {
    const absoluteKeyOffset = sourceSpan.start.offset + TEMPLATE_ATTR_PREFIX$1.length;
    const bindings = this._parseTemplateBindings(tplKey, tplValue, sourceSpan, absoluteKeyOffset, absoluteValueOffset);
    for (const binding of bindings) {
      const bindingSpan = moveParseSourceSpan(sourceSpan, binding.sourceSpan);
      const key = binding.key.source;
      const keySpan = moveParseSourceSpan(sourceSpan, binding.key.span);
      if (binding instanceof VariableBinding) {
        const value = binding.value ? binding.value.source : "$implicit";
        const valueSpan = binding.value ? moveParseSourceSpan(sourceSpan, binding.value.span) : void 0;
        targetVars.push(new ParsedVariable(key, value, bindingSpan, keySpan, valueSpan));
      } else if (binding.value) {
        const srcSpan = isIvyAst ? bindingSpan : sourceSpan;
        const valueSpan = moveParseSourceSpan(sourceSpan, binding.value.ast.sourceSpan);
        this._parsePropertyAst(key, binding.value, srcSpan, keySpan, valueSpan, targetMatchableAttrs, targetProps);
      } else {
        targetMatchableAttrs.push([
          key,
          ""
          /* value */
        ]);
        this.parseLiteralAttr(key, null, keySpan, absoluteValueOffset, void 0, targetMatchableAttrs, targetProps, keySpan);
      }
    }
  }
  /**
   * Parses the bindings in a microsyntax expression, e.g.
   * ```
   *    <tag *tplKey="let value1 = prop; let value2 = localVar">
   * ```
   *
   * @param tplKey template binding name
   * @param tplValue template binding value
   * @param sourceSpan span of template binding relative to entire the template
   * @param absoluteKeyOffset start of the `tplKey`
   * @param absoluteValueOffset start of the `tplValue`
   */
  _parseTemplateBindings(tplKey, tplValue, sourceSpan, absoluteKeyOffset, absoluteValueOffset) {
    const sourceInfo = sourceSpan.start.toString();
    try {
      const bindingsResult = this._exprParser.parseTemplateBindings(tplKey, tplValue, sourceInfo, absoluteKeyOffset, absoluteValueOffset);
      this._reportExpressionParserErrors(bindingsResult.errors, sourceSpan);
      bindingsResult.warnings.forEach((warning) => {
        this._reportError(warning, sourceSpan, ParseErrorLevel.WARNING);
      });
      return bindingsResult.templateBindings;
    } catch (e) {
      this._reportError(`${e}`, sourceSpan);
      return [];
    }
  }
  parseLiteralAttr(name, value, sourceSpan, absoluteOffset, valueSpan, targetMatchableAttrs, targetProps, keySpan) {
    if (isAnimationLabel(name)) {
      name = name.substring(1);
      if (keySpan !== void 0) {
        keySpan = moveParseSourceSpan(keySpan, new AbsoluteSourceSpan(keySpan.start.offset + 1, keySpan.end.offset));
      }
      if (value) {
        this._reportError(`Assigning animation triggers via @prop="exp" attributes with an expression is invalid. Use property bindings (e.g. [@prop]="exp") or use an attribute without a value (e.g. @prop) instead.`, sourceSpan, ParseErrorLevel.ERROR);
      }
      this._parseAnimation(name, value, sourceSpan, absoluteOffset, keySpan, valueSpan, targetMatchableAttrs, targetProps);
    } else {
      targetProps.push(new ParsedProperty(name, this._exprParser.wrapLiteralPrimitive(value, "", absoluteOffset), ParsedPropertyType.LITERAL_ATTR, sourceSpan, keySpan, valueSpan));
    }
  }
  parsePropertyBinding(name, expression, isHost, sourceSpan, absoluteOffset, valueSpan, targetMatchableAttrs, targetProps, keySpan) {
    if (name.length === 0) {
      this._reportError(`Property name is missing in binding`, sourceSpan);
    }
    let isAnimationProp = false;
    if (name.startsWith(ANIMATE_PROP_PREFIX)) {
      isAnimationProp = true;
      name = name.substring(ANIMATE_PROP_PREFIX.length);
      if (keySpan !== void 0) {
        keySpan = moveParseSourceSpan(keySpan, new AbsoluteSourceSpan(keySpan.start.offset + ANIMATE_PROP_PREFIX.length, keySpan.end.offset));
      }
    } else if (isAnimationLabel(name)) {
      isAnimationProp = true;
      name = name.substring(1);
      if (keySpan !== void 0) {
        keySpan = moveParseSourceSpan(keySpan, new AbsoluteSourceSpan(keySpan.start.offset + 1, keySpan.end.offset));
      }
    }
    if (isAnimationProp) {
      this._parseAnimation(name, expression, sourceSpan, absoluteOffset, keySpan, valueSpan, targetMatchableAttrs, targetProps);
    } else {
      this._parsePropertyAst(name, this.parseBinding(expression, isHost, valueSpan || sourceSpan, absoluteOffset), sourceSpan, keySpan, valueSpan, targetMatchableAttrs, targetProps);
    }
  }
  parsePropertyInterpolation(name, value, sourceSpan, valueSpan, targetMatchableAttrs, targetProps, keySpan, interpolatedTokens) {
    const expr = this.parseInterpolation(value, valueSpan || sourceSpan, interpolatedTokens);
    if (expr) {
      this._parsePropertyAst(name, expr, sourceSpan, keySpan, valueSpan, targetMatchableAttrs, targetProps);
      return true;
    }
    return false;
  }
  _parsePropertyAst(name, ast, sourceSpan, keySpan, valueSpan, targetMatchableAttrs, targetProps) {
    targetMatchableAttrs.push([name, ast.source]);
    targetProps.push(new ParsedProperty(name, ast, ParsedPropertyType.DEFAULT, sourceSpan, keySpan, valueSpan));
  }
  _parseAnimation(name, expression, sourceSpan, absoluteOffset, keySpan, valueSpan, targetMatchableAttrs, targetProps) {
    if (name.length === 0) {
      this._reportError("Animation trigger is missing", sourceSpan);
    }
    const ast = this.parseBinding(expression || "undefined", false, valueSpan || sourceSpan, absoluteOffset);
    targetMatchableAttrs.push([name, ast.source]);
    targetProps.push(new ParsedProperty(name, ast, ParsedPropertyType.ANIMATION, sourceSpan, keySpan, valueSpan));
  }
  parseBinding(value, isHostBinding2, sourceSpan, absoluteOffset) {
    const sourceInfo = (sourceSpan && sourceSpan.start || "(unknown)").toString();
    try {
      const ast = isHostBinding2 ? this._exprParser.parseSimpleBinding(value, sourceInfo, absoluteOffset, this._interpolationConfig) : this._exprParser.parseBinding(value, sourceInfo, absoluteOffset, this._interpolationConfig);
      if (ast)
        this._reportExpressionParserErrors(ast.errors, sourceSpan);
      return ast;
    } catch (e) {
      this._reportError(`${e}`, sourceSpan);
      return this._exprParser.wrapLiteralPrimitive("ERROR", sourceInfo, absoluteOffset);
    }
  }
  createBoundElementProperty(elementSelector, boundProp, skipValidation = false, mapPropertyName = true) {
    if (boundProp.isAnimation) {
      return new BoundElementProperty(boundProp.name, 4, SecurityContext.NONE, boundProp.expression, null, boundProp.sourceSpan, boundProp.keySpan, boundProp.valueSpan);
    }
    let unit = null;
    let bindingType = void 0;
    let boundPropertyName = null;
    const parts = boundProp.name.split(PROPERTY_PARTS_SEPARATOR);
    let securityContexts = void 0;
    if (parts.length > 1) {
      if (parts[0] == ATTRIBUTE_PREFIX) {
        boundPropertyName = parts.slice(1).join(PROPERTY_PARTS_SEPARATOR);
        if (!skipValidation) {
          this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, true);
        }
        securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, true);
        const nsSeparatorIdx = boundPropertyName.indexOf(":");
        if (nsSeparatorIdx > -1) {
          const ns = boundPropertyName.substring(0, nsSeparatorIdx);
          const name = boundPropertyName.substring(nsSeparatorIdx + 1);
          boundPropertyName = mergeNsAndName(ns, name);
        }
        bindingType = 1;
      } else if (parts[0] == CLASS_PREFIX) {
        boundPropertyName = parts[1];
        bindingType = 2;
        securityContexts = [SecurityContext.NONE];
      } else if (parts[0] == STYLE_PREFIX) {
        unit = parts.length > 2 ? parts[2] : null;
        boundPropertyName = parts[1];
        bindingType = 3;
        securityContexts = [SecurityContext.STYLE];
      }
    }
    if (boundPropertyName === null) {
      const mappedPropName = this._schemaRegistry.getMappedPropName(boundProp.name);
      boundPropertyName = mapPropertyName ? mappedPropName : boundProp.name;
      securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, mappedPropName, false);
      bindingType = 0;
      if (!skipValidation) {
        this._validatePropertyOrAttributeName(mappedPropName, boundProp.sourceSpan, false);
      }
    }
    return new BoundElementProperty(boundPropertyName, bindingType, securityContexts[0], boundProp.expression, unit, boundProp.sourceSpan, boundProp.keySpan, boundProp.valueSpan);
  }
  // TODO: keySpan should be required but was made optional to avoid changing VE parser.
  parseEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetMatchableAttrs, targetEvents, keySpan) {
    if (name.length === 0) {
      this._reportError(`Event name is missing in binding`, sourceSpan);
    }
    if (isAnimationLabel(name)) {
      name = name.slice(1);
      if (keySpan !== void 0) {
        keySpan = moveParseSourceSpan(keySpan, new AbsoluteSourceSpan(keySpan.start.offset + 1, keySpan.end.offset));
      }
      this._parseAnimationEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetEvents, keySpan);
    } else {
      this._parseRegularEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetMatchableAttrs, targetEvents, keySpan);
    }
  }
  calcPossibleSecurityContexts(selector, propName, isAttribute) {
    const prop = this._schemaRegistry.getMappedPropName(propName);
    return calcPossibleSecurityContexts(this._schemaRegistry, selector, prop, isAttribute);
  }
  _parseAnimationEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetEvents, keySpan) {
    const matches = splitAtPeriod(name, [name, ""]);
    const eventName = matches[0];
    const phase = matches[1].toLowerCase();
    const ast = this._parseAction(expression, isAssignmentEvent, handlerSpan);
    targetEvents.push(new ParsedEvent(eventName, phase, 1, ast, sourceSpan, handlerSpan, keySpan));
    if (eventName.length === 0) {
      this._reportError(`Animation event name is missing in binding`, sourceSpan);
    }
    if (phase) {
      if (phase !== "start" && phase !== "done") {
        this._reportError(`The provided animation output phase value "${phase}" for "@${eventName}" is not supported (use start or done)`, sourceSpan);
      }
    } else {
      this._reportError(`The animation trigger output event (@${eventName}) is missing its phase value name (start or done are currently supported)`, sourceSpan);
    }
  }
  _parseRegularEvent(name, expression, isAssignmentEvent, sourceSpan, handlerSpan, targetMatchableAttrs, targetEvents, keySpan) {
    const [target, eventName] = splitAtColon(name, [null, name]);
    const ast = this._parseAction(expression, isAssignmentEvent, handlerSpan);
    targetMatchableAttrs.push([name, ast.source]);
    targetEvents.push(new ParsedEvent(eventName, target, 0, ast, sourceSpan, handlerSpan, keySpan));
  }
  _parseAction(value, isAssignmentEvent, sourceSpan) {
    const sourceInfo = (sourceSpan && sourceSpan.start || "(unknown").toString();
    const absoluteOffset = sourceSpan && sourceSpan.start ? sourceSpan.start.offset : 0;
    try {
      const ast = this._exprParser.parseAction(value, isAssignmentEvent, sourceInfo, absoluteOffset, this._interpolationConfig);
      if (ast) {
        this._reportExpressionParserErrors(ast.errors, sourceSpan);
      }
      if (!ast || ast.ast instanceof EmptyExpr$1) {
        this._reportError(`Empty expressions are not allowed`, sourceSpan);
        return this._exprParser.wrapLiteralPrimitive("ERROR", sourceInfo, absoluteOffset);
      }
      return ast;
    } catch (e) {
      this._reportError(`${e}`, sourceSpan);
      return this._exprParser.wrapLiteralPrimitive("ERROR", sourceInfo, absoluteOffset);
    }
  }
  _reportError(message, sourceSpan, level = ParseErrorLevel.ERROR) {
    this.errors.push(new ParseError(sourceSpan, message, level));
  }
  _reportExpressionParserErrors(errors, sourceSpan) {
    for (const error2 of errors) {
      this._reportError(error2.message, sourceSpan);
    }
  }
  /**
   * @param propName the name of the property / attribute
   * @param sourceSpan
   * @param isAttr true when binding to an attribute
   */
  _validatePropertyOrAttributeName(propName, sourceSpan, isAttr) {
    const report = isAttr ? this._schemaRegistry.validateAttribute(propName) : this._schemaRegistry.validateProperty(propName);
    if (report.error) {
      this._reportError(report.msg, sourceSpan, ParseErrorLevel.ERROR);
    }
  }
};
function isAnimationLabel(name) {
  return name[0] == "@";
}
function calcPossibleSecurityContexts(registry, selector, propName, isAttribute) {
  const ctxs = [];
  CssSelector.parse(selector).forEach((selector2) => {
    const elementNames = selector2.element ? [selector2.element] : registry.allKnownElementNames();
    const notElementNames = new Set(selector2.notSelectors.filter((selector3) => selector3.isElementSelector()).map((selector3) => selector3.element));
    const possibleElementNames = elementNames.filter((elementName) => !notElementNames.has(elementName));
    ctxs.push(...possibleElementNames.map((elementName) => registry.securityContext(elementName, propName, isAttribute)));
  });
  return ctxs.length === 0 ? [SecurityContext.NONE] : Array.from(new Set(ctxs)).sort();
}
function moveParseSourceSpan(sourceSpan, absoluteSpan) {
  const startDiff = absoluteSpan.start - sourceSpan.start.offset;
  const endDiff = absoluteSpan.end - sourceSpan.end.offset;
  return new ParseSourceSpan(sourceSpan.start.moveBy(startDiff), sourceSpan.end.moveBy(endDiff), sourceSpan.fullStart.moveBy(startDiff), sourceSpan.details);
}
function isStyleUrlResolvable(url) {
  if (url == null || url.length === 0 || url[0] == "/")
    return false;
  const schemeMatch = url.match(URL_WITH_SCHEMA_REGEXP);
  return schemeMatch === null || schemeMatch[1] == "package" || schemeMatch[1] == "asset";
}
var URL_WITH_SCHEMA_REGEXP = /^([^:/?#]+):/;
var NG_CONTENT_SELECT_ATTR$1 = "select";
var LINK_ELEMENT = "link";
var LINK_STYLE_REL_ATTR = "rel";
var LINK_STYLE_HREF_ATTR = "href";
var LINK_STYLE_REL_VALUE = "stylesheet";
var STYLE_ELEMENT = "style";
var SCRIPT_ELEMENT = "script";
var NG_NON_BINDABLE_ATTR = "ngNonBindable";
var NG_PROJECT_AS = "ngProjectAs";
function preparseElement(ast) {
  let selectAttr = null;
  let hrefAttr = null;
  let relAttr = null;
  let nonBindable = false;
  let projectAs = "";
  ast.attrs.forEach((attr) => {
    const lcAttrName = attr.name.toLowerCase();
    if (lcAttrName == NG_CONTENT_SELECT_ATTR$1) {
      selectAttr = attr.value;
    } else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
      hrefAttr = attr.value;
    } else if (lcAttrName == LINK_STYLE_REL_ATTR) {
      relAttr = attr.value;
    } else if (attr.name == NG_NON_BINDABLE_ATTR) {
      nonBindable = true;
    } else if (attr.name == NG_PROJECT_AS) {
      if (attr.value.length > 0) {
        projectAs = attr.value;
      }
    }
  });
  selectAttr = normalizeNgContentSelect(selectAttr);
  const nodeName = ast.name.toLowerCase();
  let type = PreparsedElementType.OTHER;
  if (isNgContent(nodeName)) {
    type = PreparsedElementType.NG_CONTENT;
  } else if (nodeName == STYLE_ELEMENT) {
    type = PreparsedElementType.STYLE;
  } else if (nodeName == SCRIPT_ELEMENT) {
    type = PreparsedElementType.SCRIPT;
  } else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
    type = PreparsedElementType.STYLESHEET;
  }
  return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
}
var PreparsedElementType;
(function(PreparsedElementType2) {
  PreparsedElementType2[PreparsedElementType2["NG_CONTENT"] = 0] = "NG_CONTENT";
  PreparsedElementType2[PreparsedElementType2["STYLE"] = 1] = "STYLE";
  PreparsedElementType2[PreparsedElementType2["STYLESHEET"] = 2] = "STYLESHEET";
  PreparsedElementType2[PreparsedElementType2["SCRIPT"] = 3] = "SCRIPT";
  PreparsedElementType2[PreparsedElementType2["OTHER"] = 4] = "OTHER";
})(PreparsedElementType || (PreparsedElementType = {}));
var PreparsedElement = class {
  constructor(type, selectAttr, hrefAttr, nonBindable, projectAs) {
    this.type = type;
    this.selectAttr = selectAttr;
    this.hrefAttr = hrefAttr;
    this.nonBindable = nonBindable;
    this.projectAs = projectAs;
  }
};
function normalizeNgContentSelect(selectAttr) {
  if (selectAttr === null || selectAttr.length === 0) {
    return "*";
  }
  return selectAttr;
}
var TIME_PATTERN = /^\d+(ms|s)?$/;
var SEPARATOR_PATTERN = /^\s$/;
var COMMA_DELIMITED_SYNTAX = /* @__PURE__ */ new Map([
  [$LBRACE, $RBRACE],
  [$LBRACKET, $RBRACKET],
  [$LPAREN, $RPAREN]
  // Function calls
]);
var OnTriggerType;
(function(OnTriggerType2) {
  OnTriggerType2["IDLE"] = "idle";
  OnTriggerType2["TIMER"] = "timer";
  OnTriggerType2["INTERACTION"] = "interaction";
  OnTriggerType2["IMMEDIATE"] = "immediate";
  OnTriggerType2["HOVER"] = "hover";
  OnTriggerType2["VIEWPORT"] = "viewport";
})(OnTriggerType || (OnTriggerType = {}));
function parseWhenTrigger({ expression, sourceSpan }, bindingParser, errors) {
  const whenIndex = expression.indexOf("when");
  if (whenIndex === -1) {
    errors.push(new ParseError(sourceSpan, `Could not find "when" keyword in expression`));
    return null;
  }
  const start = getTriggerParametersStart(expression, whenIndex + 1);
  const parsed = bindingParser.parseBinding(expression.slice(start), false, sourceSpan, sourceSpan.start.offset + start);
  return new BoundDeferredTrigger(parsed, sourceSpan);
}
function parseOnTrigger({ expression, sourceSpan }, errors) {
  const onIndex = expression.indexOf("on");
  if (onIndex === -1) {
    errors.push(new ParseError(sourceSpan, `Could not find "on" keyword in expression`));
    return [];
  }
  const start = getTriggerParametersStart(expression, onIndex + 1);
  return new OnTriggerParser(expression, start, sourceSpan, errors).parse();
}
var OnTriggerParser = class {
  constructor(expression, start, span, errors) {
    this.expression = expression;
    this.start = start;
    this.span = span;
    this.errors = errors;
    this.index = 0;
    this.triggers = [];
    this.tokens = new Lexer().tokenize(expression.slice(start));
  }
  parse() {
    while (this.tokens.length > 0 && this.index < this.tokens.length) {
      const token = this.token();
      if (!token.isIdentifier()) {
        this.unexpectedToken(token);
        break;
      }
      if (this.isFollowedByOrLast($COMMA)) {
        this.consumeTrigger(token, []);
        this.advance();
      } else if (this.isFollowedByOrLast($LPAREN)) {
        this.advance();
        const prevErrors = this.errors.length;
        const parameters = this.consumeParameters();
        if (this.errors.length !== prevErrors) {
          break;
        }
        this.consumeTrigger(token, parameters);
        this.advance();
      } else if (this.index < this.tokens.length - 1) {
        this.unexpectedToken(this.tokens[this.index + 1]);
      }
      this.advance();
    }
    return this.triggers;
  }
  advance() {
    this.index++;
  }
  isFollowedByOrLast(char) {
    if (this.index === this.tokens.length - 1) {
      return true;
    }
    return this.tokens[this.index + 1].isCharacter(char);
  }
  token() {
    return this.tokens[Math.min(this.index, this.tokens.length - 1)];
  }
  consumeTrigger(identifier, parameters) {
    const startSpan = this.span.start.moveBy(this.start + identifier.index - this.tokens[0].index);
    const endSpan = startSpan.moveBy(this.token().end - identifier.index);
    const sourceSpan = new ParseSourceSpan(startSpan, endSpan);
    try {
      switch (identifier.toString()) {
        case OnTriggerType.IDLE:
          this.triggers.push(createIdleTrigger(parameters, sourceSpan));
          break;
        case OnTriggerType.TIMER:
          this.triggers.push(createTimerTrigger(parameters, sourceSpan));
          break;
        case OnTriggerType.INTERACTION:
          this.triggers.push(createInteractionTrigger(parameters, sourceSpan));
          break;
        case OnTriggerType.IMMEDIATE:
          this.triggers.push(createImmediateTrigger(parameters, sourceSpan));
          break;
        case OnTriggerType.HOVER:
          this.triggers.push(createHoverTrigger(parameters, sourceSpan));
          break;
        case OnTriggerType.VIEWPORT:
          this.triggers.push(createViewportTrigger(parameters, sourceSpan));
          break;
        default:
          throw new Error(`Unrecognized trigger type "${identifier}"`);
      }
    } catch (e) {
      this.error(identifier, e.message);
    }
  }
  consumeParameters() {
    const parameters = [];
    if (!this.token().isCharacter($LPAREN)) {
      this.unexpectedToken(this.token());
      return parameters;
    }
    this.advance();
    const commaDelimStack = [];
    let current = "";
    while (this.index < this.tokens.length) {
      const token = this.token();
      if (token.isCharacter($RPAREN) && commaDelimStack.length === 0) {
        if (current.length) {
          parameters.push(current);
        }
        break;
      }
      if (token.type === TokenType.Character && COMMA_DELIMITED_SYNTAX.has(token.numValue)) {
        commaDelimStack.push(COMMA_DELIMITED_SYNTAX.get(token.numValue));
      }
      if (commaDelimStack.length > 0 && token.isCharacter(commaDelimStack[commaDelimStack.length - 1])) {
        commaDelimStack.pop();
      }
      if (commaDelimStack.length === 0 && token.isCharacter($COMMA) && current.length > 0) {
        parameters.push(current);
        current = "";
        this.advance();
        continue;
      }
      current += this.tokenText();
      this.advance();
    }
    if (!this.token().isCharacter($RPAREN) || commaDelimStack.length > 0) {
      this.error(this.token(), "Unexpected end of expression");
    }
    if (this.index < this.tokens.length - 1 && !this.tokens[this.index + 1].isCharacter($COMMA)) {
      this.unexpectedToken(this.tokens[this.index + 1]);
    }
    return parameters;
  }
  tokenText() {
    return this.expression.slice(this.start + this.token().index, this.start + this.token().end);
  }
  error(token, message) {
    const newStart = this.span.start.moveBy(this.start + token.index);
    const newEnd = newStart.moveBy(token.end - token.index);
    this.errors.push(new ParseError(new ParseSourceSpan(newStart, newEnd), message));
  }
  unexpectedToken(token) {
    this.error(token, `Unexpected token "${token}"`);
  }
};
function createIdleTrigger(parameters, sourceSpan) {
  if (parameters.length > 0) {
    throw new Error(`"${OnTriggerType.IDLE}" trigger cannot have parameters`);
  }
  return new IdleDeferredTrigger(sourceSpan);
}
function createTimerTrigger(parameters, sourceSpan) {
  if (parameters.length !== 1) {
    throw new Error(`"${OnTriggerType.TIMER}" trigger must have exactly one parameter`);
  }
  const delay = parseDeferredTime(parameters[0]);
  if (delay === null) {
    throw new Error(`Could not parse time value of trigger "${OnTriggerType.TIMER}"`);
  }
  return new TimerDeferredTrigger(delay, sourceSpan);
}
function createInteractionTrigger(parameters, sourceSpan) {
  if (parameters.length > 1) {
    throw new Error(`"${OnTriggerType.INTERACTION}" trigger can only have zero or one parameters`);
  }
  return new InteractionDeferredTrigger(parameters[0] ?? null, sourceSpan);
}
function createImmediateTrigger(parameters, sourceSpan) {
  if (parameters.length > 0) {
    throw new Error(`"${OnTriggerType.IMMEDIATE}" trigger cannot have parameters`);
  }
  return new ImmediateDeferredTrigger(sourceSpan);
}
function createHoverTrigger(parameters, sourceSpan) {
  if (parameters.length > 0) {
    throw new Error(`"${OnTriggerType.HOVER}" trigger cannot have parameters`);
  }
  return new HoverDeferredTrigger(sourceSpan);
}
function createViewportTrigger(parameters, sourceSpan) {
  if (parameters.length > 1) {
    throw new Error(`"${OnTriggerType.VIEWPORT}" trigger can only have zero or one parameters`);
  }
  return new ViewportDeferredTrigger(parameters[0] ?? null, sourceSpan);
}
function getTriggerParametersStart(value, startPosition = 0) {
  let hasFoundSeparator = false;
  for (let i = startPosition; i < value.length; i++) {
    if (SEPARATOR_PATTERN.test(value[i])) {
      hasFoundSeparator = true;
    } else if (hasFoundSeparator) {
      return i;
    }
  }
  return -1;
}
function parseDeferredTime(value) {
  const match = value.match(TIME_PATTERN);
  if (!match) {
    return null;
  }
  const [time, units] = match;
  return parseInt(time) * (units === "s" ? 1e3 : 1);
}
var PREFETCH_WHEN_PATTERN = /^prefetch\s+when\s/;
var PREFETCH_ON_PATTERN = /^prefetch\s+on\s/;
var MINIMUM_PARAMETER_PATTERN = /^minimum\s/;
var AFTER_PARAMETER_PATTERN = /^after\s/;
var WHEN_PARAMETER_PATTERN = /^when\s/;
var ON_PARAMETER_PATTERN = /^on\s/;
var SecondaryDeferredBlockType;
(function(SecondaryDeferredBlockType2) {
  SecondaryDeferredBlockType2["PLACEHOLDER"] = "placeholder";
  SecondaryDeferredBlockType2["LOADING"] = "loading";
  SecondaryDeferredBlockType2["ERROR"] = "error";
})(SecondaryDeferredBlockType || (SecondaryDeferredBlockType = {}));
function createDeferredBlock(ast, visitor, bindingParser) {
  const errors = [];
  const [primaryBlock, ...secondaryBlocks] = ast.blocks;
  const { triggers, prefetchTriggers } = parsePrimaryTriggers(primaryBlock.parameters, bindingParser, errors);
  const { placeholder, loading, error: error2 } = parseSecondaryBlocks(secondaryBlocks, errors, visitor);
  return {
    node: new DeferredBlock(visitAll(visitor, primaryBlock.children), triggers, prefetchTriggers, placeholder, loading, error2, ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan),
    errors
  };
}
function parseSecondaryBlocks(blocks, errors, visitor) {
  let placeholder = null;
  let loading = null;
  let error2 = null;
  for (const block of blocks) {
    try {
      switch (block.name) {
        case SecondaryDeferredBlockType.PLACEHOLDER:
          if (placeholder !== null) {
            errors.push(new ParseError(block.startSourceSpan, `"defer" block can only have one "${SecondaryDeferredBlockType.PLACEHOLDER}" block`));
          } else {
            placeholder = parsePlaceholderBlock(block, visitor);
          }
          break;
        case SecondaryDeferredBlockType.LOADING:
          if (loading !== null) {
            errors.push(new ParseError(block.startSourceSpan, `"defer" block can only have one "${SecondaryDeferredBlockType.LOADING}" block`));
          } else {
            loading = parseLoadingBlock(block, visitor);
          }
          break;
        case SecondaryDeferredBlockType.ERROR:
          if (error2 !== null) {
            errors.push(new ParseError(block.startSourceSpan, `"defer" block can only have one "${SecondaryDeferredBlockType.ERROR}" block`));
          } else {
            error2 = parseErrorBlock(block, visitor);
          }
          break;
        default:
          errors.push(new ParseError(block.startSourceSpan, `Unrecognized block "${block.name}"`));
          break;
      }
    } catch (e) {
      errors.push(new ParseError(block.startSourceSpan, e.message));
    }
  }
  return { placeholder, loading, error: error2 };
}
function parsePlaceholderBlock(ast, visitor) {
  let minimumTime = null;
  for (const param of ast.parameters) {
    if (MINIMUM_PARAMETER_PATTERN.test(param.expression)) {
      const parsedTime = parseDeferredTime(param.expression.slice(getTriggerParametersStart(param.expression)));
      if (parsedTime === null) {
        throw new Error(`Could not parse time value of parameter "minimum"`);
      }
      minimumTime = parsedTime;
    } else {
      throw new Error(`Unrecognized parameter in "${SecondaryDeferredBlockType.PLACEHOLDER}" block: "${param.expression}"`);
    }
  }
  return new DeferredBlockPlaceholder(visitAll(visitor, ast.children), minimumTime, ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
}
function parseLoadingBlock(ast, visitor) {
  let afterTime = null;
  let minimumTime = null;
  for (const param of ast.parameters) {
    if (AFTER_PARAMETER_PATTERN.test(param.expression)) {
      const parsedTime = parseDeferredTime(param.expression.slice(getTriggerParametersStart(param.expression)));
      if (parsedTime === null) {
        throw new Error(`Could not parse time value of parameter "after"`);
      }
      afterTime = parsedTime;
    } else if (MINIMUM_PARAMETER_PATTERN.test(param.expression)) {
      const parsedTime = parseDeferredTime(param.expression.slice(getTriggerParametersStart(param.expression)));
      if (parsedTime === null) {
        throw new Error(`Could not parse time value of parameter "minimum"`);
      }
      minimumTime = parsedTime;
    } else {
      throw new Error(`Unrecognized parameter in "${SecondaryDeferredBlockType.LOADING}" block: "${param.expression}"`);
    }
  }
  return new DeferredBlockLoading(visitAll(visitor, ast.children), afterTime, minimumTime, ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
}
function parseErrorBlock(ast, visitor) {
  if (ast.parameters.length > 0) {
    throw new Error(`"${SecondaryDeferredBlockType.ERROR}" block cannot have parameters`);
  }
  return new DeferredBlockError(visitAll(visitor, ast.children), ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
}
function parsePrimaryTriggers(params, bindingParser, errors) {
  const triggers = [];
  const prefetchTriggers = [];
  for (const param of params) {
    if (WHEN_PARAMETER_PATTERN.test(param.expression)) {
      const result = parseWhenTrigger(param, bindingParser, errors);
      result !== null && triggers.push(result);
    } else if (ON_PARAMETER_PATTERN.test(param.expression)) {
      triggers.push(...parseOnTrigger(param, errors));
    } else if (PREFETCH_WHEN_PATTERN.test(param.expression)) {
      const result = parseWhenTrigger(param, bindingParser, errors);
      result !== null && prefetchTriggers.push(result);
    } else if (PREFETCH_ON_PATTERN.test(param.expression)) {
      prefetchTriggers.push(...parseOnTrigger(param, errors));
    } else {
      errors.push(new ParseError(param.sourceSpan, "Unrecognized trigger"));
    }
  }
  return { triggers, prefetchTriggers };
}
var BIND_NAME_REGEXP = /^(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.*)$/;
var KW_BIND_IDX = 1;
var KW_LET_IDX = 2;
var KW_REF_IDX = 3;
var KW_ON_IDX = 4;
var KW_BINDON_IDX = 5;
var KW_AT_IDX = 6;
var IDENT_KW_IDX = 7;
var BINDING_DELIMS = {
  BANANA_BOX: { start: "[(", end: ")]" },
  PROPERTY: { start: "[", end: "]" },
  EVENT: { start: "(", end: ")" }
};
var TEMPLATE_ATTR_PREFIX = "*";
function htmlAstToRender3Ast(htmlNodes, bindingParser, options) {
  const transformer = new HtmlAstToIvyAst(bindingParser, options);
  const ivyNodes = visitAll(transformer, htmlNodes);
  const allErrors = bindingParser.errors.concat(transformer.errors);
  const result = {
    nodes: ivyNodes,
    errors: allErrors,
    styleUrls: transformer.styleUrls,
    styles: transformer.styles,
    ngContentSelectors: transformer.ngContentSelectors
  };
  if (options.collectCommentNodes) {
    result.commentNodes = transformer.commentNodes;
  }
  return result;
}
var HtmlAstToIvyAst = class {
  constructor(bindingParser, options) {
    this.bindingParser = bindingParser;
    this.options = options;
    this.errors = [];
    this.styles = [];
    this.styleUrls = [];
    this.ngContentSelectors = [];
    this.commentNodes = [];
    this.inI18nBlock = false;
  }
  // HTML visitor
  visitElement(element2) {
    const isI18nRootElement = isI18nRootNode(element2.i18n);
    if (isI18nRootElement) {
      if (this.inI18nBlock) {
        this.reportError("Cannot mark an element as translatable inside of a translatable section. Please remove the nested i18n marker.", element2.sourceSpan);
      }
      this.inI18nBlock = true;
    }
    const preparsedElement = preparseElement(element2);
    if (preparsedElement.type === PreparsedElementType.SCRIPT) {
      return null;
    } else if (preparsedElement.type === PreparsedElementType.STYLE) {
      const contents = textContents(element2);
      if (contents !== null) {
        this.styles.push(contents);
      }
      return null;
    } else if (preparsedElement.type === PreparsedElementType.STYLESHEET && isStyleUrlResolvable(preparsedElement.hrefAttr)) {
      this.styleUrls.push(preparsedElement.hrefAttr);
      return null;
    }
    const isTemplateElement = isNgTemplate(element2.name);
    const parsedProperties = [];
    const boundEvents = [];
    const variables = [];
    const references = [];
    const attributes = [];
    const i18nAttrsMeta = {};
    const templateParsedProperties = [];
    const templateVariables = [];
    let elementHasInlineTemplate = false;
    for (const attribute2 of element2.attrs) {
      let hasBinding = false;
      const normalizedName = normalizeAttributeName(attribute2.name);
      let isTemplateBinding = false;
      if (attribute2.i18n) {
        i18nAttrsMeta[attribute2.name] = attribute2.i18n;
      }
      if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
        if (elementHasInlineTemplate) {
          this.reportError(`Can't have multiple template bindings on one element. Use only one attribute prefixed with *`, attribute2.sourceSpan);
        }
        isTemplateBinding = true;
        elementHasInlineTemplate = true;
        const templateValue = attribute2.value;
        const templateKey = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length);
        const parsedVariables = [];
        const absoluteValueOffset = attribute2.valueSpan ? attribute2.valueSpan.start.offset : (
          // If there is no value span the attribute does not have a value, like `attr` in
          //`<div attr></div>`. In this case, point to one character beyond the last character of
          // the attribute name.
          attribute2.sourceSpan.start.offset + attribute2.name.length
        );
        this.bindingParser.parseInlineTemplateBinding(
          templateKey,
          templateValue,
          attribute2.sourceSpan,
          absoluteValueOffset,
          [],
          templateParsedProperties,
          parsedVariables,
          true
          /* isIvyAst */
        );
        templateVariables.push(...parsedVariables.map((v) => new Variable(v.name, v.value, v.sourceSpan, v.keySpan, v.valueSpan)));
      } else {
        hasBinding = this.parseAttribute(isTemplateElement, attribute2, [], parsedProperties, boundEvents, variables, references);
      }
      if (!hasBinding && !isTemplateBinding) {
        attributes.push(this.visitAttribute(attribute2));
      }
    }
    let children;
    if (preparsedElement.nonBindable) {
      children = visitAll(NON_BINDABLE_VISITOR, element2.children).flat(Infinity);
    } else {
      children = visitAll(this, element2.children);
    }
    let parsedElement;
    if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
      if (element2.children && !element2.children.every((node) => isEmptyTextNode(node) || isCommentNode(node))) {
        this.reportError(`<ng-content> element cannot have content.`, element2.sourceSpan);
      }
      const selector = preparsedElement.selectAttr;
      const attrs = element2.attrs.map((attr) => this.visitAttribute(attr));
      parsedElement = new Content(selector, attrs, element2.sourceSpan, element2.i18n);
      this.ngContentSelectors.push(selector);
    } else if (isTemplateElement) {
      const attrs = this.extractAttributes(element2.name, parsedProperties, i18nAttrsMeta);
      parsedElement = new Template(element2.name, attributes, attrs.bound, boundEvents, [
        /* no template attributes */
      ], children, references, variables, element2.sourceSpan, element2.startSourceSpan, element2.endSourceSpan, element2.i18n);
    } else {
      const attrs = this.extractAttributes(element2.name, parsedProperties, i18nAttrsMeta);
      parsedElement = new Element$1(element2.name, attributes, attrs.bound, boundEvents, children, references, element2.sourceSpan, element2.startSourceSpan, element2.endSourceSpan, element2.i18n);
    }
    if (elementHasInlineTemplate) {
      const attrs = this.extractAttributes("ng-template", templateParsedProperties, i18nAttrsMeta);
      const templateAttrs = [];
      attrs.literal.forEach((attr) => templateAttrs.push(attr));
      attrs.bound.forEach((attr) => templateAttrs.push(attr));
      const hoistedAttrs = parsedElement instanceof Element$1 ? {
        attributes: parsedElement.attributes,
        inputs: parsedElement.inputs,
        outputs: parsedElement.outputs
      } : { attributes: [], inputs: [], outputs: [] };
      const i18n = isTemplateElement && isI18nRootElement ? void 0 : element2.i18n;
      const name = parsedElement instanceof Template ? null : parsedElement.name;
      parsedElement = new Template(name, hoistedAttrs.attributes, hoistedAttrs.inputs, hoistedAttrs.outputs, templateAttrs, [parsedElement], [
        /* no references */
      ], templateVariables, element2.sourceSpan, element2.startSourceSpan, element2.endSourceSpan, i18n);
    }
    if (isI18nRootElement) {
      this.inI18nBlock = false;
    }
    return parsedElement;
  }
  visitAttribute(attribute2) {
    return new TextAttribute(attribute2.name, attribute2.value, attribute2.sourceSpan, attribute2.keySpan, attribute2.valueSpan, attribute2.i18n);
  }
  visitText(text2) {
    return this._visitTextWithInterpolation(text2.value, text2.sourceSpan, text2.tokens, text2.i18n);
  }
  visitExpansion(expansion) {
    if (!expansion.i18n) {
      return null;
    }
    if (!isI18nRootNode(expansion.i18n)) {
      throw new Error(`Invalid type "${expansion.i18n.constructor}" for "i18n" property of ${expansion.sourceSpan.toString()}. Expected a "Message"`);
    }
    const message = expansion.i18n;
    const vars = {};
    const placeholders = {};
    Object.keys(message.placeholders).forEach((key) => {
      const value = message.placeholders[key];
      if (key.startsWith(I18N_ICU_VAR_PREFIX)) {
        const formattedKey = key.trim();
        const ast = this.bindingParser.parseInterpolationExpression(value.text, value.sourceSpan);
        vars[formattedKey] = new BoundText(ast, value.sourceSpan);
      } else {
        placeholders[key] = this._visitTextWithInterpolation(value.text, value.sourceSpan, null);
      }
    });
    return new Icu$1(vars, placeholders, expansion.sourceSpan, message);
  }
  visitExpansionCase(expansionCase) {
    return null;
  }
  visitComment(comment) {
    if (this.options.collectCommentNodes) {
      this.commentNodes.push(new Comment$1(comment.value || "", comment.sourceSpan));
    }
    return null;
  }
  visitBlockGroup(group, context) {
    const primaryBlock = group.blocks[0];
    if (!primaryBlock) {
      this.reportError("Block group must have at least one block.", group.sourceSpan);
      return null;
    }
    if (primaryBlock.name === "defer" && this.options.enabledBlockTypes.has(primaryBlock.name)) {
      const { node, errors } = createDeferredBlock(group, this, this.bindingParser);
      this.errors.push(...errors);
      return node;
    }
    this.reportError(`Unrecognized block "${primaryBlock.name}".`, primaryBlock.sourceSpan);
    return null;
  }
  visitBlock(block, context) {
  }
  visitBlockParameter(parameter, context) {
  }
  // convert view engine `ParsedProperty` to a format suitable for IVY
  extractAttributes(elementName, properties, i18nPropsMeta) {
    const bound = [];
    const literal2 = [];
    properties.forEach((prop) => {
      const i18n = i18nPropsMeta[prop.name];
      if (prop.isLiteral) {
        literal2.push(new TextAttribute(prop.name, prop.expression.source || "", prop.sourceSpan, prop.keySpan, prop.valueSpan, i18n));
      } else {
        const bep = this.bindingParser.createBoundElementProperty(
          elementName,
          prop,
          /* skipValidation */
          true,
          /* mapPropertyName */
          false
        );
        bound.push(BoundAttribute.fromBoundElementProperty(bep, i18n));
      }
    });
    return { bound, literal: literal2 };
  }
  parseAttribute(isTemplateElement, attribute2, matchableAttributes, parsedProperties, boundEvents, variables, references) {
    const name = normalizeAttributeName(attribute2.name);
    const value = attribute2.value;
    const srcSpan = attribute2.sourceSpan;
    const absoluteOffset = attribute2.valueSpan ? attribute2.valueSpan.start.offset : srcSpan.start.offset;
    function createKeySpan(srcSpan2, prefix, identifier) {
      const normalizationAdjustment = attribute2.name.length - name.length;
      const keySpanStart = srcSpan2.start.moveBy(prefix.length + normalizationAdjustment);
      const keySpanEnd = keySpanStart.moveBy(identifier.length);
      return new ParseSourceSpan(keySpanStart, keySpanEnd, keySpanStart, identifier);
    }
    const bindParts = name.match(BIND_NAME_REGEXP);
    if (bindParts) {
      if (bindParts[KW_BIND_IDX] != null) {
        const identifier = bindParts[IDENT_KW_IDX];
        const keySpan2 = createKeySpan(srcSpan, bindParts[KW_BIND_IDX], identifier);
        this.bindingParser.parsePropertyBinding(identifier, value, false, srcSpan, absoluteOffset, attribute2.valueSpan, matchableAttributes, parsedProperties, keySpan2);
      } else if (bindParts[KW_LET_IDX]) {
        if (isTemplateElement) {
          const identifier = bindParts[IDENT_KW_IDX];
          const keySpan2 = createKeySpan(srcSpan, bindParts[KW_LET_IDX], identifier);
          this.parseVariable(identifier, value, srcSpan, keySpan2, attribute2.valueSpan, variables);
        } else {
          this.reportError(`"let-" is only supported on ng-template elements.`, srcSpan);
        }
      } else if (bindParts[KW_REF_IDX]) {
        const identifier = bindParts[IDENT_KW_IDX];
        const keySpan2 = createKeySpan(srcSpan, bindParts[KW_REF_IDX], identifier);
        this.parseReference(identifier, value, srcSpan, keySpan2, attribute2.valueSpan, references);
      } else if (bindParts[KW_ON_IDX]) {
        const events = [];
        const identifier = bindParts[IDENT_KW_IDX];
        const keySpan2 = createKeySpan(srcSpan, bindParts[KW_ON_IDX], identifier);
        this.bindingParser.parseEvent(
          identifier,
          value,
          /* isAssignmentEvent */
          false,
          srcSpan,
          attribute2.valueSpan || srcSpan,
          matchableAttributes,
          events,
          keySpan2
        );
        addEvents(events, boundEvents);
      } else if (bindParts[KW_BINDON_IDX]) {
        const identifier = bindParts[IDENT_KW_IDX];
        const keySpan2 = createKeySpan(srcSpan, bindParts[KW_BINDON_IDX], identifier);
        this.bindingParser.parsePropertyBinding(identifier, value, false, srcSpan, absoluteOffset, attribute2.valueSpan, matchableAttributes, parsedProperties, keySpan2);
        this.parseAssignmentEvent(identifier, value, srcSpan, attribute2.valueSpan, matchableAttributes, boundEvents, keySpan2);
      } else if (bindParts[KW_AT_IDX]) {
        const keySpan2 = createKeySpan(srcSpan, "", name);
        this.bindingParser.parseLiteralAttr(name, value, srcSpan, absoluteOffset, attribute2.valueSpan, matchableAttributes, parsedProperties, keySpan2);
      }
      return true;
    }
    let delims = null;
    if (name.startsWith(BINDING_DELIMS.BANANA_BOX.start)) {
      delims = BINDING_DELIMS.BANANA_BOX;
    } else if (name.startsWith(BINDING_DELIMS.PROPERTY.start)) {
      delims = BINDING_DELIMS.PROPERTY;
    } else if (name.startsWith(BINDING_DELIMS.EVENT.start)) {
      delims = BINDING_DELIMS.EVENT;
    }
    if (delims !== null && // NOTE: older versions of the parser would match a start/end delimited
    // binding iff the property name was terminated by the ending delimiter
    // and the identifier in the binding was non-empty.
    // TODO(ayazhafiz): update this to handle malformed bindings.
    name.endsWith(delims.end) && name.length > delims.start.length + delims.end.length) {
      const identifier = name.substring(delims.start.length, name.length - delims.end.length);
      const keySpan2 = createKeySpan(srcSpan, delims.start, identifier);
      if (delims.start === BINDING_DELIMS.BANANA_BOX.start) {
        this.bindingParser.parsePropertyBinding(identifier, value, false, srcSpan, absoluteOffset, attribute2.valueSpan, matchableAttributes, parsedProperties, keySpan2);
        this.parseAssignmentEvent(identifier, value, srcSpan, attribute2.valueSpan, matchableAttributes, boundEvents, keySpan2);
      } else if (delims.start === BINDING_DELIMS.PROPERTY.start) {
        this.bindingParser.parsePropertyBinding(identifier, value, false, srcSpan, absoluteOffset, attribute2.valueSpan, matchableAttributes, parsedProperties, keySpan2);
      } else {
        const events = [];
        this.bindingParser.parseEvent(
          identifier,
          value,
          /* isAssignmentEvent */
          false,
          srcSpan,
          attribute2.valueSpan || srcSpan,
          matchableAttributes,
          events,
          keySpan2
        );
        addEvents(events, boundEvents);
      }
      return true;
    }
    const keySpan = createKeySpan(srcSpan, "", name);
    const hasBinding = this.bindingParser.parsePropertyInterpolation(name, value, srcSpan, attribute2.valueSpan, matchableAttributes, parsedProperties, keySpan, attribute2.valueTokens ?? null);
    return hasBinding;
  }
  _visitTextWithInterpolation(value, sourceSpan, interpolatedTokens, i18n) {
    const valueNoNgsp = replaceNgsp(value);
    const expr = this.bindingParser.parseInterpolation(valueNoNgsp, sourceSpan, interpolatedTokens);
    return expr ? new BoundText(expr, sourceSpan, i18n) : new Text$3(valueNoNgsp, sourceSpan);
  }
  parseVariable(identifier, value, sourceSpan, keySpan, valueSpan, variables) {
    if (identifier.indexOf("-") > -1) {
      this.reportError(`"-" is not allowed in variable names`, sourceSpan);
    } else if (identifier.length === 0) {
      this.reportError(`Variable does not have a name`, sourceSpan);
    }
    variables.push(new Variable(identifier, value, sourceSpan, keySpan, valueSpan));
  }
  parseReference(identifier, value, sourceSpan, keySpan, valueSpan, references) {
    if (identifier.indexOf("-") > -1) {
      this.reportError(`"-" is not allowed in reference names`, sourceSpan);
    } else if (identifier.length === 0) {
      this.reportError(`Reference does not have a name`, sourceSpan);
    } else if (references.some((reference2) => reference2.name === identifier)) {
      this.reportError(`Reference "#${identifier}" is defined more than once`, sourceSpan);
    }
    references.push(new Reference(identifier, value, sourceSpan, keySpan, valueSpan));
  }
  parseAssignmentEvent(name, expression, sourceSpan, valueSpan, targetMatchableAttrs, boundEvents, keySpan) {
    const events = [];
    this.bindingParser.parseEvent(
      `${name}Change`,
      `${expression} =$event`,
      /* isAssignmentEvent */
      true,
      sourceSpan,
      valueSpan || sourceSpan,
      targetMatchableAttrs,
      events,
      keySpan
    );
    addEvents(events, boundEvents);
  }
  reportError(message, sourceSpan, level = ParseErrorLevel.ERROR) {
    this.errors.push(new ParseError(sourceSpan, message, level));
  }
};
var NonBindableVisitor = class {
  visitElement(ast) {
    const preparsedElement = preparseElement(ast);
    if (preparsedElement.type === PreparsedElementType.SCRIPT || preparsedElement.type === PreparsedElementType.STYLE || preparsedElement.type === PreparsedElementType.STYLESHEET) {
      return null;
    }
    const children = visitAll(this, ast.children, null);
    return new Element$1(
      ast.name,
      visitAll(this, ast.attrs),
      /* inputs */
      [],
      /* outputs */
      [],
      children,
      /* references */
      [],
      ast.sourceSpan,
      ast.startSourceSpan,
      ast.endSourceSpan
    );
  }
  visitComment(comment) {
    return null;
  }
  visitAttribute(attribute2) {
    return new TextAttribute(attribute2.name, attribute2.value, attribute2.sourceSpan, attribute2.keySpan, attribute2.valueSpan, attribute2.i18n);
  }
  visitText(text2) {
    return new Text$3(text2.value, text2.sourceSpan);
  }
  visitExpansion(expansion) {
    return null;
  }
  visitExpansionCase(expansionCase) {
    return null;
  }
  visitBlockGroup(group, context) {
    const nodes = visitAll(this, group.blocks);
    if (group.endSourceSpan !== null) {
      nodes.push(new Text$3(group.endSourceSpan.toString(), group.endSourceSpan));
    }
    return nodes;
  }
  visitBlock(block, context) {
    return [
      // In an ngNonBindable context we treat the opening/closing tags of block as plain text.
      // This is the as if the `tokenizeBlocks` option was disabled.
      new Text$3(block.startSourceSpan.toString(), block.startSourceSpan),
      ...visitAll(this, block.children)
    ];
  }
  visitBlockParameter(parameter, context) {
    return null;
  }
};
var NON_BINDABLE_VISITOR = new NonBindableVisitor();
function normalizeAttributeName(attrName) {
  return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
}
function addEvents(events, boundEvents) {
  boundEvents.push(...events.map((e) => BoundEvent.fromParsedEvent(e)));
}
function isEmptyTextNode(node) {
  return node instanceof Text && node.value.trim().length == 0;
}
function isCommentNode(node) {
  return node instanceof Comment;
}
function textContents(node) {
  if (node.children.length !== 1 || !(node.children[0] instanceof Text)) {
    return null;
  } else {
    return node.children[0].value;
  }
}
var TagType;
(function(TagType2) {
  TagType2[TagType2["ELEMENT"] = 0] = "ELEMENT";
  TagType2[TagType2["TEMPLATE"] = 1] = "TEMPLATE";
})(TagType || (TagType = {}));
function setupRegistry() {
  return { getUniqueId: getSeqNumberGenerator(), icus: /* @__PURE__ */ new Map() };
}
var I18nContext = class _I18nContext {
  constructor(index, ref, level = 0, templateIndex = null, meta, registry) {
    this.index = index;
    this.ref = ref;
    this.level = level;
    this.templateIndex = templateIndex;
    this.meta = meta;
    this.registry = registry;
    this.bindings = /* @__PURE__ */ new Set();
    this.placeholders = /* @__PURE__ */ new Map();
    this.isEmitted = false;
    this._unresolvedCtxCount = 0;
    this._registry = registry || setupRegistry();
    this.id = this._registry.getUniqueId();
  }
  appendTag(type, node, index, closed) {
    if (node.isVoid && closed) {
      return;
    }
    const ph = node.isVoid || !closed ? node.startName : node.closeName;
    const content = { type, index, ctx: this.id, isVoid: node.isVoid, closed };
    updatePlaceholderMap(this.placeholders, ph, content);
  }
  get icus() {
    return this._registry.icus;
  }
  get isRoot() {
    return this.level === 0;
  }
  get isResolved() {
    return this._unresolvedCtxCount === 0;
  }
  getSerializedPlaceholders() {
    const result = /* @__PURE__ */ new Map();
    this.placeholders.forEach((values, key) => result.set(key, values.map(serializePlaceholderValue)));
    return result;
  }
  // public API to accumulate i18n-related content
  appendBinding(binding) {
    this.bindings.add(binding);
  }
  appendIcu(name, ref) {
    updatePlaceholderMap(this._registry.icus, name, ref);
  }
  appendBoundText(node) {
    const phs = assembleBoundTextPlaceholders(node, this.bindings.size, this.id);
    phs.forEach((values, key) => updatePlaceholderMap(this.placeholders, key, ...values));
  }
  appendTemplate(node, index) {
    this.appendTag(TagType.TEMPLATE, node, index, false);
    this.appendTag(TagType.TEMPLATE, node, index, true);
    this._unresolvedCtxCount++;
  }
  appendElement(node, index, closed) {
    this.appendTag(TagType.ELEMENT, node, index, closed);
  }
  appendProjection(node, index) {
    this.appendTag(TagType.ELEMENT, node, index, false);
    this.appendTag(TagType.ELEMENT, node, index, true);
  }
  /**
   * Generates an instance of a child context based on the root one,
   * when we enter a nested template within I18n section.
   *
   * @param index Instruction index of corresponding i18nStart, which initiates this context
   * @param templateIndex Instruction index of a template which this context belongs to
   * @param meta Meta information (id, meaning, description, etc) associated with this context
   *
   * @returns I18nContext instance
   */
  forkChildContext(index, templateIndex, meta) {
    return new _I18nContext(index, this.ref, this.level + 1, templateIndex, meta, this._registry);
  }
  /**
   * Reconciles child context into parent one once the end of the i18n block is reached (i18nEnd).
   *
   * @param context Child I18nContext instance to be reconciled with parent context.
   */
  reconcileChildContext(context) {
    ["start", "close"].forEach((op) => {
      const key = context.meta[`${op}Name`];
      const phs = this.placeholders.get(key) || [];
      const tag = phs.find(findTemplateFn(this.id, context.templateIndex));
      if (tag) {
        tag.ctx = context.id;
      }
    });
    const childPhs = context.placeholders;
    childPhs.forEach((values, key) => {
      const phs = this.placeholders.get(key);
      if (!phs) {
        this.placeholders.set(key, values);
        return;
      }
      const tmplIdx = phs.findIndex(findTemplateFn(context.id, context.templateIndex));
      if (tmplIdx >= 0) {
        const isCloseTag = key.startsWith("CLOSE");
        const isTemplateTag = key.endsWith("NG-TEMPLATE");
        if (isTemplateTag) {
          phs.splice(tmplIdx + (isCloseTag ? 0 : 1), 0, ...values);
        } else {
          const idx = isCloseTag ? values.length - 1 : 0;
          values[idx].tmpl = phs[tmplIdx];
          phs.splice(tmplIdx, 1, ...values);
        }
      } else {
        phs.push(...values);
      }
      this.placeholders.set(key, phs);
    });
    this._unresolvedCtxCount--;
  }
};
function wrap(symbol, index, contextId, closed) {
  const state = closed ? "/" : "";
  return wrapI18nPlaceholder(`${state}${symbol}${index}`, contextId);
}
function wrapTag(symbol, { index, ctx, isVoid }, closed) {
  return isVoid ? wrap(symbol, index, ctx) + wrap(symbol, index, ctx, true) : wrap(symbol, index, ctx, closed);
}
function findTemplateFn(ctx, templateIndex) {
  return (token) => typeof token === "object" && token.type === TagType.TEMPLATE && token.index === templateIndex && token.ctx === ctx;
}
function serializePlaceholderValue(value) {
  const element2 = (data, closed) => wrapTag("#", data, closed);
  const template2 = (data, closed) => wrapTag("*", data, closed);
  switch (value.type) {
    case TagType.ELEMENT:
      if (value.closed) {
        return element2(value, true) + (value.tmpl ? template2(value.tmpl, true) : "");
      }
      if (value.tmpl) {
        return template2(value.tmpl) + element2(value) + (value.isVoid ? template2(value.tmpl, true) : "");
      }
      return element2(value);
    case TagType.TEMPLATE:
      return template2(value, value.closed);
    default:
      return value;
  }
}
var IcuSerializerVisitor = class {
  visitText(text2) {
    return text2.value;
  }
  visitContainer(container) {
    return container.children.map((child) => child.visit(this)).join("");
  }
  visitIcu(icu) {
    const strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
    const result = `{${icu.expressionPlaceholder}, ${icu.type}, ${strCases.join(" ")}}`;
    return result;
  }
  visitTagPlaceholder(ph) {
    return ph.isVoid ? this.formatPh(ph.startName) : `${this.formatPh(ph.startName)}${ph.children.map((child) => child.visit(this)).join("")}${this.formatPh(ph.closeName)}`;
  }
  visitPlaceholder(ph) {
    return this.formatPh(ph.name);
  }
  visitIcuPlaceholder(ph, context) {
    return this.formatPh(ph.name);
  }
  formatPh(value) {
    return `{${formatI18nPlaceholderName(
      value,
      /* useCamelCase */
      false
    )}}`;
  }
};
var serializer = new IcuSerializerVisitor();
function serializeIcuNode(icu) {
  return icu.visit(serializer);
}
var TAG_TO_PLACEHOLDER_NAMES = {
  "A": "LINK",
  "B": "BOLD_TEXT",
  "BR": "LINE_BREAK",
  "EM": "EMPHASISED_TEXT",
  "H1": "HEADING_LEVEL1",
  "H2": "HEADING_LEVEL2",
  "H3": "HEADING_LEVEL3",
  "H4": "HEADING_LEVEL4",
  "H5": "HEADING_LEVEL5",
  "H6": "HEADING_LEVEL6",
  "HR": "HORIZONTAL_RULE",
  "I": "ITALIC_TEXT",
  "LI": "LIST_ITEM",
  "LINK": "MEDIA_LINK",
  "OL": "ORDERED_LIST",
  "P": "PARAGRAPH",
  "Q": "QUOTATION",
  "S": "STRIKETHROUGH_TEXT",
  "SMALL": "SMALL_TEXT",
  "SUB": "SUBSTRIPT",
  "SUP": "SUPERSCRIPT",
  "TBODY": "TABLE_BODY",
  "TD": "TABLE_CELL",
  "TFOOT": "TABLE_FOOTER",
  "TH": "TABLE_HEADER_CELL",
  "THEAD": "TABLE_HEADER",
  "TR": "TABLE_ROW",
  "TT": "MONOSPACED_TEXT",
  "U": "UNDERLINED_TEXT",
  "UL": "UNORDERED_LIST"
};
var PlaceholderRegistry = class {
  constructor() {
    this._placeHolderNameCounts = {};
    this._signatureToName = {};
  }
  getStartTagPlaceholderName(tag, attrs, isVoid) {
    const signature = this._hashTag(tag, attrs, isVoid);
    if (this._signatureToName[signature]) {
      return this._signatureToName[signature];
    }
    const upperTag = tag.toUpperCase();
    const baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || `TAG_${upperTag}`;
    const name = this._generateUniqueName(isVoid ? baseName : `START_${baseName}`);
    this._signatureToName[signature] = name;
    return name;
  }
  getCloseTagPlaceholderName(tag) {
    const signature = this._hashClosingTag(tag);
    if (this._signatureToName[signature]) {
      return this._signatureToName[signature];
    }
    const upperTag = tag.toUpperCase();
    const baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || `TAG_${upperTag}`;
    const name = this._generateUniqueName(`CLOSE_${baseName}`);
    this._signatureToName[signature] = name;
    return name;
  }
  getPlaceholderName(name, content) {
    const upperName = name.toUpperCase();
    const signature = `PH: ${upperName}=${content}`;
    if (this._signatureToName[signature]) {
      return this._signatureToName[signature];
    }
    const uniqueName = this._generateUniqueName(upperName);
    this._signatureToName[signature] = uniqueName;
    return uniqueName;
  }
  getUniquePlaceholder(name) {
    return this._generateUniqueName(name.toUpperCase());
  }
  // Generate a hash for a tag - does not take attribute order into account
  _hashTag(tag, attrs, isVoid) {
    const start = `<${tag}`;
    const strAttrs = Object.keys(attrs).sort().map((name) => ` ${name}=${attrs[name]}`).join("");
    const end = isVoid ? "/>" : `></${tag}>`;
    return start + strAttrs + end;
  }
  _hashClosingTag(tag) {
    return this._hashTag(`/${tag}`, {}, false);
  }
  _generateUniqueName(base) {
    const seen = this._placeHolderNameCounts.hasOwnProperty(base);
    if (!seen) {
      this._placeHolderNameCounts[base] = 1;
      return base;
    }
    const id = this._placeHolderNameCounts[base];
    this._placeHolderNameCounts[base] = id + 1;
    return `${base}_${id}`;
  }
};
var _expParser = new Parser$1(new Lexer());
function createI18nMessageFactory(interpolationConfig) {
  const visitor = new _I18nVisitor(_expParser, interpolationConfig);
  return (nodes, meaning, description, customId, visitNodeFn) => visitor.toI18nMessage(nodes, meaning, description, customId, visitNodeFn);
}
function noopVisitNodeFn(_html, i18n) {
  return i18n;
}
var _I18nVisitor = class {
  constructor(_expressionParser, _interpolationConfig) {
    this._expressionParser = _expressionParser;
    this._interpolationConfig = _interpolationConfig;
  }
  toI18nMessage(nodes, meaning = "", description = "", customId = "", visitNodeFn) {
    const context = {
      isIcu: nodes.length == 1 && nodes[0] instanceof Expansion,
      icuDepth: 0,
      placeholderRegistry: new PlaceholderRegistry(),
      placeholderToContent: {},
      placeholderToMessage: {},
      visitNodeFn: visitNodeFn || noopVisitNodeFn
    };
    const i18nodes = visitAll(this, nodes, context);
    return new Message(i18nodes, context.placeholderToContent, context.placeholderToMessage, meaning, description, customId);
  }
  visitElement(el, context) {
    const children = visitAll(this, el.children, context);
    const attrs = {};
    el.attrs.forEach((attr) => {
      attrs[attr.name] = attr.value;
    });
    const isVoid = getHtmlTagDefinition(el.name).isVoid;
    const startPhName = context.placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
    context.placeholderToContent[startPhName] = {
      text: el.startSourceSpan.toString(),
      sourceSpan: el.startSourceSpan
    };
    let closePhName = "";
    if (!isVoid) {
      closePhName = context.placeholderRegistry.getCloseTagPlaceholderName(el.name);
      context.placeholderToContent[closePhName] = {
        text: `</${el.name}>`,
        sourceSpan: el.endSourceSpan ?? el.sourceSpan
      };
    }
    const node = new TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
    return context.visitNodeFn(el, node);
  }
  visitAttribute(attribute2, context) {
    const node = attribute2.valueTokens === void 0 || attribute2.valueTokens.length === 1 ? new Text$2(attribute2.value, attribute2.valueSpan || attribute2.sourceSpan) : this._visitTextWithInterpolation(attribute2.valueTokens, attribute2.valueSpan || attribute2.sourceSpan, context, attribute2.i18n);
    return context.visitNodeFn(attribute2, node);
  }
  visitText(text2, context) {
    const node = text2.tokens.length === 1 ? new Text$2(text2.value, text2.sourceSpan) : this._visitTextWithInterpolation(text2.tokens, text2.sourceSpan, context, text2.i18n);
    return context.visitNodeFn(text2, node);
  }
  visitComment(comment, context) {
    return null;
  }
  visitExpansion(icu, context) {
    context.icuDepth++;
    const i18nIcuCases = {};
    const i18nIcu = new Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
    icu.cases.forEach((caze) => {
      i18nIcuCases[caze.value] = new Container(caze.expression.map((node2) => node2.visit(this, context)), caze.expSourceSpan);
    });
    context.icuDepth--;
    if (context.isIcu || context.icuDepth > 0) {
      const expPh = context.placeholderRegistry.getUniquePlaceholder(`VAR_${icu.type}`);
      i18nIcu.expressionPlaceholder = expPh;
      context.placeholderToContent[expPh] = {
        text: icu.switchValue,
        sourceSpan: icu.switchValueSourceSpan
      };
      return context.visitNodeFn(icu, i18nIcu);
    }
    const phName = context.placeholderRegistry.getPlaceholderName("ICU", icu.sourceSpan.toString());
    context.placeholderToMessage[phName] = this.toI18nMessage([icu], "", "", "", void 0);
    const node = new IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
    return context.visitNodeFn(icu, node);
  }
  visitExpansionCase(_icuCase, _context) {
    throw new Error("Unreachable code");
  }
  visitBlockGroup(group, context) {
    const children = visitAll(this, group.blocks, context);
    const node = new Container(children, group.sourceSpan);
    return context.visitNodeFn(group, node);
  }
  visitBlock(block, context) {
    const children = visitAll(this, block.children, context);
    const node = new Container(children, block.sourceSpan);
    return context.visitNodeFn(block, node);
  }
  visitBlockParameter(_parameter, _context) {
  }
  /**
   * Convert, text and interpolated tokens up into text and placeholder pieces.
   *
   * @param tokens The text and interpolated tokens.
   * @param sourceSpan The span of the whole of the `text` string.
   * @param context The current context of the visitor, used to compute and store placeholders.
   * @param previousI18n Any i18n metadata associated with this `text` from a previous pass.
   */
  _visitTextWithInterpolation(tokens, sourceSpan, context, previousI18n) {
    const nodes = [];
    let hasInterpolation = false;
    for (const token of tokens) {
      switch (token.type) {
        case 8:
        case 17:
          hasInterpolation = true;
          const expression = token.parts[1];
          const baseName = extractPlaceholderName(expression) || "INTERPOLATION";
          const phName = context.placeholderRegistry.getPlaceholderName(baseName, expression);
          context.placeholderToContent[phName] = {
            text: token.parts.join(""),
            sourceSpan: token.sourceSpan
          };
          nodes.push(new Placeholder(expression, phName, token.sourceSpan));
          break;
        default:
          if (token.parts[0].length > 0) {
            const previous = nodes[nodes.length - 1];
            if (previous instanceof Text$2) {
              previous.value += token.parts[0];
              previous.sourceSpan = new ParseSourceSpan(previous.sourceSpan.start, token.sourceSpan.end, previous.sourceSpan.fullStart, previous.sourceSpan.details);
            } else {
              nodes.push(new Text$2(token.parts[0], token.sourceSpan));
            }
          }
          break;
      }
    }
    if (hasInterpolation) {
      reusePreviousSourceSpans(nodes, previousI18n);
      return new Container(nodes, sourceSpan);
    } else {
      return nodes[0];
    }
  }
};
function reusePreviousSourceSpans(nodes, previousI18n) {
  if (previousI18n instanceof Message) {
    assertSingleContainerMessage(previousI18n);
    previousI18n = previousI18n.nodes[0];
  }
  if (previousI18n instanceof Container) {
    assertEquivalentNodes(previousI18n.children, nodes);
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].sourceSpan = previousI18n.children[i].sourceSpan;
    }
  }
}
function assertSingleContainerMessage(message) {
  const nodes = message.nodes;
  if (nodes.length !== 1 || !(nodes[0] instanceof Container)) {
    throw new Error("Unexpected previous i18n message - expected it to consist of only a single `Container` node.");
  }
}
function assertEquivalentNodes(previousNodes, nodes) {
  if (previousNodes.length !== nodes.length) {
    throw new Error("The number of i18n message children changed between first and second pass.");
  }
  if (previousNodes.some((node, i) => nodes[i].constructor !== node.constructor)) {
    throw new Error("The types of the i18n message children changed between first and second pass.");
  }
}
var _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
function extractPlaceholderName(input) {
  return input.split(_CUSTOM_PH_EXP)[2];
}
var I18nError = class extends ParseError {
  constructor(span, msg) {
    super(span, msg);
  }
};
var setI18nRefs = (htmlNode, i18nNode) => {
  if (htmlNode instanceof NodeWithI18n) {
    if (i18nNode instanceof IcuPlaceholder && htmlNode.i18n instanceof Message) {
      i18nNode.previousMessage = htmlNode.i18n;
    }
    htmlNode.i18n = i18nNode;
  }
  return i18nNode;
};
var I18nMetaVisitor = class {
  constructor(interpolationConfig = DEFAULT_INTERPOLATION_CONFIG, keepI18nAttrs = false, enableI18nLegacyMessageIdFormat = false) {
    this.interpolationConfig = interpolationConfig;
    this.keepI18nAttrs = keepI18nAttrs;
    this.enableI18nLegacyMessageIdFormat = enableI18nLegacyMessageIdFormat;
    this.hasI18nMeta = false;
    this._errors = [];
  }
  _generateI18nMessage(nodes, meta = "", visitNodeFn) {
    const { meaning, description, customId } = this._parseMetadata(meta);
    const createI18nMessage = createI18nMessageFactory(this.interpolationConfig);
    const message = createI18nMessage(nodes, meaning, description, customId, visitNodeFn);
    this._setMessageId(message, meta);
    this._setLegacyIds(message, meta);
    return message;
  }
  visitAllWithErrors(nodes) {
    const result = nodes.map((node) => node.visit(this, null));
    return new ParseTreeResult(result, this._errors);
  }
  visitElement(element2) {
    let message = void 0;
    if (hasI18nAttrs(element2)) {
      this.hasI18nMeta = true;
      const attrs = [];
      const attrsMeta = {};
      for (const attr of element2.attrs) {
        if (attr.name === I18N_ATTR) {
          const i18n = element2.i18n || attr.value;
          message = this._generateI18nMessage(element2.children, i18n, setI18nRefs);
          if (message.nodes.length === 0) {
            message = void 0;
          }
          element2.i18n = message;
        } else if (attr.name.startsWith(I18N_ATTR_PREFIX)) {
          const name = attr.name.slice(I18N_ATTR_PREFIX.length);
          if (isTrustedTypesSink(element2.name, name)) {
            this._reportError(attr, `Translating attribute '${name}' is disallowed for security reasons.`);
          } else {
            attrsMeta[name] = attr.value;
          }
        } else {
          attrs.push(attr);
        }
      }
      if (Object.keys(attrsMeta).length) {
        for (const attr of attrs) {
          const meta = attrsMeta[attr.name];
          if (meta !== void 0 && attr.value) {
            attr.i18n = this._generateI18nMessage([attr], attr.i18n || meta);
          }
        }
      }
      if (!this.keepI18nAttrs) {
        element2.attrs = attrs;
      }
    }
    visitAll(this, element2.children, message);
    return element2;
  }
  visitExpansion(expansion, currentMessage) {
    let message;
    const meta = expansion.i18n;
    this.hasI18nMeta = true;
    if (meta instanceof IcuPlaceholder) {
      const name = meta.name;
      message = this._generateI18nMessage([expansion], meta);
      const icu = icuFromI18nMessage(message);
      icu.name = name;
      if (currentMessage !== null) {
        currentMessage.placeholderToMessage[name] = message;
      }
    } else {
      message = this._generateI18nMessage([expansion], currentMessage || meta);
    }
    expansion.i18n = message;
    return expansion;
  }
  visitText(text2) {
    return text2;
  }
  visitAttribute(attribute2) {
    return attribute2;
  }
  visitComment(comment) {
    return comment;
  }
  visitExpansionCase(expansionCase) {
    return expansionCase;
  }
  visitBlockGroup(group, context) {
    visitAll(this, group.blocks, context);
    return group;
  }
  visitBlock(block, context) {
    visitAll(this, block.children, context);
    return block;
  }
  visitBlockParameter(parameter, context) {
    return parameter;
  }
  /**
   * Parse the general form `meta` passed into extract the explicit metadata needed to create a
   * `Message`.
   *
   * There are three possibilities for the `meta` variable
   * 1) a string from an `i18n` template attribute: parse it to extract the metadata values.
   * 2) a `Message` from a previous processing pass: reuse the metadata values in the message.
   * 4) other: ignore this and just process the message metadata as normal
   *
   * @param meta the bucket that holds information about the message
   * @returns the parsed metadata.
   */
  _parseMetadata(meta) {
    return typeof meta === "string" ? parseI18nMeta(meta) : meta instanceof Message ? meta : {};
  }
  /**
   * Generate (or restore) message id if not specified already.
   */
  _setMessageId(message, meta) {
    if (!message.id) {
      message.id = meta instanceof Message && meta.id || decimalDigest(message);
    }
  }
  /**
   * Update the `message` with a `legacyId` if necessary.
   *
   * @param message the message whose legacy id should be set
   * @param meta information about the message being processed
   */
  _setLegacyIds(message, meta) {
    if (this.enableI18nLegacyMessageIdFormat) {
      message.legacyIds = [computeDigest(message), computeDecimalDigest(message)];
    } else if (typeof meta !== "string") {
      const previousMessage = meta instanceof Message ? meta : meta instanceof IcuPlaceholder ? meta.previousMessage : void 0;
      message.legacyIds = previousMessage ? previousMessage.legacyIds : [];
    }
  }
  _reportError(node, msg) {
    this._errors.push(new I18nError(node.sourceSpan, msg));
  }
};
var I18N_MEANING_SEPARATOR = "|";
var I18N_ID_SEPARATOR = "@@";
function parseI18nMeta(meta = "") {
  let customId;
  let meaning;
  let description;
  meta = meta.trim();
  if (meta) {
    const idIndex = meta.indexOf(I18N_ID_SEPARATOR);
    const descIndex = meta.indexOf(I18N_MEANING_SEPARATOR);
    let meaningAndDesc;
    [meaningAndDesc, customId] = idIndex > -1 ? [meta.slice(0, idIndex), meta.slice(idIndex + 2)] : [meta, ""];
    [meaning, description] = descIndex > -1 ? [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] : ["", meaningAndDesc];
  }
  return { customId, meaning, description };
}
function i18nMetaToJSDoc(meta) {
  const tags = [];
  if (meta.description) {
    tags.push({ tagName: "desc", text: meta.description });
  } else {
    tags.push({ tagName: "suppress", text: "{msgDescriptions}" });
  }
  if (meta.meaning) {
    tags.push({ tagName: "meaning", text: meta.meaning });
  }
  return jsDocComment(tags);
}
var GOOG_GET_MSG = "goog.getMsg";
function createGoogleGetMsgStatements(variable$1, message, closureVar, placeholderValues) {
  const messageString = serializeI18nMessageForGetMsg(message);
  const args = [literal(messageString)];
  if (Object.keys(placeholderValues).length) {
    args.push(mapLiteral(
      formatI18nPlaceholderNamesInMap(
        placeholderValues,
        true
        /* useCamelCase */
      ),
      true
      /* quoted */
    ));
    args.push(mapLiteral({
      original_code: literalMap(Object.keys(placeholderValues).map((param) => ({
        key: formatI18nPlaceholderName(param),
        quoted: true,
        value: message.placeholders[param] ? (
          // Get source span for typical placeholder if it exists.
          literal(message.placeholders[param].sourceSpan.toString())
        ) : (
          // Otherwise must be an ICU expression, get it's source span.
          literal(message.placeholderToMessage[param].nodes.map((node) => node.sourceSpan.toString()).join(""))
        )
      })))
    }));
  }
  const googGetMsgStmt = closureVar.set(variable(GOOG_GET_MSG).callFn(args)).toConstDecl();
  googGetMsgStmt.addLeadingComment(i18nMetaToJSDoc(message));
  const i18nAssignmentStmt = new ExpressionStatement(variable$1.set(closureVar));
  return [googGetMsgStmt, i18nAssignmentStmt];
}
var GetMsgSerializerVisitor = class {
  formatPh(value) {
    return `{$${formatI18nPlaceholderName(value)}}`;
  }
  visitText(text2) {
    return text2.value;
  }
  visitContainer(container) {
    return container.children.map((child) => child.visit(this)).join("");
  }
  visitIcu(icu) {
    return serializeIcuNode(icu);
  }
  visitTagPlaceholder(ph) {
    return ph.isVoid ? this.formatPh(ph.startName) : `${this.formatPh(ph.startName)}${ph.children.map((child) => child.visit(this)).join("")}${this.formatPh(ph.closeName)}`;
  }
  visitPlaceholder(ph) {
    return this.formatPh(ph.name);
  }
  visitIcuPlaceholder(ph, context) {
    return this.formatPh(ph.name);
  }
};
var serializerVisitor = new GetMsgSerializerVisitor();
function serializeI18nMessageForGetMsg(message) {
  return message.nodes.map((node) => node.visit(serializerVisitor, null)).join("");
}
function createLocalizeStatements(variable2, message, params) {
  const { messageParts, placeHolders } = serializeI18nMessageForLocalize(message);
  const sourceSpan = getSourceSpan(message);
  const expressions = placeHolders.map((ph) => params[ph.text]);
  const localizedString$1 = localizedString(message, messageParts, placeHolders, expressions, sourceSpan);
  const variableInitialization = variable2.set(localizedString$1);
  return [new ExpressionStatement(variableInitialization)];
}
var LocalizeSerializerVisitor = class {
  constructor(placeholderToMessage, pieces) {
    this.placeholderToMessage = placeholderToMessage;
    this.pieces = pieces;
  }
  visitText(text2) {
    if (this.pieces[this.pieces.length - 1] instanceof LiteralPiece) {
      this.pieces[this.pieces.length - 1].text += text2.value;
    } else {
      const sourceSpan = new ParseSourceSpan(text2.sourceSpan.fullStart, text2.sourceSpan.end, text2.sourceSpan.fullStart, text2.sourceSpan.details);
      this.pieces.push(new LiteralPiece(text2.value, sourceSpan));
    }
  }
  visitContainer(container) {
    container.children.forEach((child) => child.visit(this));
  }
  visitIcu(icu) {
    this.pieces.push(new LiteralPiece(serializeIcuNode(icu), icu.sourceSpan));
  }
  visitTagPlaceholder(ph) {
    this.pieces.push(this.createPlaceholderPiece(ph.startName, ph.startSourceSpan ?? ph.sourceSpan));
    if (!ph.isVoid) {
      ph.children.forEach((child) => child.visit(this));
      this.pieces.push(this.createPlaceholderPiece(ph.closeName, ph.endSourceSpan ?? ph.sourceSpan));
    }
  }
  visitPlaceholder(ph) {
    this.pieces.push(this.createPlaceholderPiece(ph.name, ph.sourceSpan));
  }
  visitIcuPlaceholder(ph) {
    this.pieces.push(this.createPlaceholderPiece(ph.name, ph.sourceSpan, this.placeholderToMessage[ph.name]));
  }
  createPlaceholderPiece(name, sourceSpan, associatedMessage) {
    return new PlaceholderPiece(formatI18nPlaceholderName(
      name,
      /* useCamelCase */
      false
    ), sourceSpan, associatedMessage);
  }
};
function serializeI18nMessageForLocalize(message) {
  const pieces = [];
  const serializerVisitor2 = new LocalizeSerializerVisitor(message.placeholderToMessage, pieces);
  message.nodes.forEach((node) => node.visit(serializerVisitor2));
  return processMessagePieces(pieces);
}
function getSourceSpan(message) {
  const startNode = message.nodes[0];
  const endNode = message.nodes[message.nodes.length - 1];
  return new ParseSourceSpan(startNode.sourceSpan.fullStart, endNode.sourceSpan.end, startNode.sourceSpan.fullStart, startNode.sourceSpan.details);
}
function processMessagePieces(pieces) {
  const messageParts = [];
  const placeHolders = [];
  if (pieces[0] instanceof PlaceholderPiece) {
    messageParts.push(createEmptyMessagePart(pieces[0].sourceSpan.start));
  }
  for (let i = 0; i < pieces.length; i++) {
    const part = pieces[i];
    if (part instanceof LiteralPiece) {
      messageParts.push(part);
    } else {
      placeHolders.push(part);
      if (pieces[i - 1] instanceof PlaceholderPiece) {
        messageParts.push(createEmptyMessagePart(pieces[i - 1].sourceSpan.end));
      }
    }
  }
  if (pieces[pieces.length - 1] instanceof PlaceholderPiece) {
    messageParts.push(createEmptyMessagePart(pieces[pieces.length - 1].sourceSpan.end));
  }
  return { messageParts, placeHolders };
}
function createEmptyMessagePart(location) {
  return new LiteralPiece("", new ParseSourceSpan(location, location));
}
var NG_CONTENT_SELECT_ATTR = "select";
var NG_PROJECT_AS_ATTR_NAME = "ngProjectAs";
var EVENT_BINDING_SCOPE_GLOBALS = /* @__PURE__ */ new Set(["$event"]);
var GLOBAL_TARGET_RESOLVERS = /* @__PURE__ */ new Map([["window", Identifiers.resolveWindow], ["document", Identifiers.resolveDocument], ["body", Identifiers.resolveBody]]);
var LEADING_TRIVIA_CHARS = [" ", "\n", "\r", "	"];
function renderFlagCheckIfStmt(flags, statements) {
  return ifStmt(variable(RENDER_FLAGS).bitwiseAnd(literal(flags), null, false), statements);
}
function prepareEventListenerParameters(eventAst, handlerName = null, scope = null) {
  const { type, name, target, phase, handler } = eventAst;
  if (target && !GLOBAL_TARGET_RESOLVERS.has(target)) {
    throw new Error(`Unexpected global target '${target}' defined for '${name}' event.
        Supported list of global targets: ${Array.from(GLOBAL_TARGET_RESOLVERS.keys())}.`);
  }
  const eventArgumentName = "$event";
  const implicitReceiverAccesses = /* @__PURE__ */ new Set();
  const implicitReceiverExpr = scope === null || scope.bindingLevel === 0 ? variable(CONTEXT_NAME) : scope.getOrCreateSharedContextVar(0);
  const bindingStatements = convertActionBinding(scope, implicitReceiverExpr, handler, "b", eventAst.handlerSpan, implicitReceiverAccesses, EVENT_BINDING_SCOPE_GLOBALS);
  const statements = [];
  const variableDeclarations = scope?.variableDeclarations();
  const restoreViewStatement = scope?.restoreViewStatement();
  if (variableDeclarations) {
    statements.push(...variableDeclarations);
  }
  statements.push(...bindingStatements);
  if (restoreViewStatement) {
    statements.unshift(restoreViewStatement);
    const lastStatement = statements[statements.length - 1];
    if (lastStatement instanceof ReturnStatement) {
      statements[statements.length - 1] = new ReturnStatement(invokeInstruction(lastStatement.value.sourceSpan, Identifiers.resetView, [lastStatement.value]));
    } else {
      statements.push(new ExpressionStatement(invokeInstruction(null, Identifiers.resetView, [])));
    }
  }
  const eventName = type === 1 ? prepareSyntheticListenerName(name, phase) : name;
  const fnName = handlerName && sanitizeIdentifier(handlerName);
  const fnArgs = [];
  if (implicitReceiverAccesses.has(eventArgumentName)) {
    fnArgs.push(new FnParam(eventArgumentName, DYNAMIC_TYPE));
  }
  const handlerFn = fn(fnArgs, statements, INFERRED_TYPE, null, fnName);
  const params = [literal(eventName), handlerFn];
  if (target) {
    params.push(
      literal(false),
      // `useCapture` flag, defaults to `false`
      importExpr(GLOBAL_TARGET_RESOLVERS.get(target))
    );
  }
  return params;
}
function createComponentDefConsts() {
  return {
    prepareStatements: [],
    constExpressions: [],
    i18nVarRefsCache: /* @__PURE__ */ new Map()
  };
}
var TemplateDefinitionBuilder = class _TemplateDefinitionBuilder {
  constructor(constantPool, parentBindingScope, level = 0, contextName, i18nContext, templateIndex, templateName, _namespace, relativeContextFilePath, i18nUseExternalIds, deferBlocks, _constants = createComponentDefConsts()) {
    this.constantPool = constantPool;
    this.level = level;
    this.contextName = contextName;
    this.i18nContext = i18nContext;
    this.templateIndex = templateIndex;
    this.templateName = templateName;
    this._namespace = _namespace;
    this.i18nUseExternalIds = i18nUseExternalIds;
    this.deferBlocks = deferBlocks;
    this._constants = _constants;
    this._dataIndex = 0;
    this._bindingContext = 0;
    this._prefixCode = [];
    this._creationCodeFns = [];
    this._updateCodeFns = [];
    this._currentIndex = 0;
    this._tempVariables = [];
    this._nestedTemplateFns = [];
    this.i18n = null;
    this._pureFunctionSlots = 0;
    this._bindingSlots = 0;
    this._ngContentReservedSlots = [];
    this._ngContentSelectorsOffset = 0;
    this._implicitReceiverExpr = null;
    this.visitReference = invalid;
    this.visitVariable = invalid;
    this.visitTextAttribute = invalid;
    this.visitBoundAttribute = invalid;
    this.visitBoundEvent = invalid;
    this._bindingScope = parentBindingScope.nestedScope(level);
    this.fileBasedI18nSuffix = relativeContextFilePath.replace(/[^A-Za-z0-9]/g, "_") + "_";
    this._valueConverter = new ValueConverter(constantPool, () => this.allocateDataSlot(), (numSlots) => this.allocatePureFunctionSlots(numSlots), (name, localName, slot, value) => {
      this._bindingScope.set(this.level, localName, value);
      this.creationInstruction(null, Identifiers.pipe, [literal(slot), literal(name)]);
    });
  }
  buildTemplateFunction(nodes, variables, ngContentSelectorsOffset = 0, i18n) {
    this._ngContentSelectorsOffset = ngContentSelectorsOffset;
    if (this._namespace !== Identifiers.namespaceHTML) {
      this.creationInstruction(null, this._namespace);
    }
    variables.forEach((v) => this.registerContextVariables(v));
    const initI18nContext = this.i18nContext || isI18nRootNode(i18n) && !isSingleI18nIcu(i18n) && !(isSingleElementTemplate(nodes) && nodes[0].i18n === i18n);
    const selfClosingI18nInstruction = hasTextChildrenOnly(nodes);
    if (initI18nContext) {
      this.i18nStart(null, i18n, selfClosingI18nInstruction);
    }
    visitAll$1(this, nodes);
    this._pureFunctionSlots += this._bindingSlots;
    this._valueConverter.updatePipeSlotOffsets(this._bindingSlots);
    this._nestedTemplateFns.forEach((buildTemplateFn) => buildTemplateFn());
    if (this.level === 0 && this._ngContentReservedSlots.length) {
      const parameters = [];
      if (this._ngContentReservedSlots.length > 1 || this._ngContentReservedSlots[0] !== "*") {
        const r3ReservedSlots = this._ngContentReservedSlots.map((s) => s !== "*" ? parseSelectorToR3Selector(s) : s);
        parameters.push(this.constantPool.getConstLiteral(asLiteral(r3ReservedSlots), true));
      }
      this.creationInstruction(
        null,
        Identifiers.projectionDef,
        parameters,
        /* prepend */
        true
      );
    }
    if (initI18nContext) {
      this.i18nEnd(null, selfClosingI18nInstruction);
    }
    const creationStatements = getInstructionStatements(this._creationCodeFns);
    const updateStatements = getInstructionStatements(this._updateCodeFns);
    const creationVariables = this._bindingScope.viewSnapshotStatements();
    const updateVariables = this._bindingScope.variableDeclarations().concat(this._tempVariables);
    const creationBlock = creationStatements.length > 0 ? [renderFlagCheckIfStmt(1, creationVariables.concat(creationStatements))] : [];
    const updateBlock = updateStatements.length > 0 ? [renderFlagCheckIfStmt(2, updateVariables.concat(updateStatements))] : [];
    return fn(
      // i.e. (rf: RenderFlags, ctx: any)
      [new FnParam(RENDER_FLAGS, NUMBER_TYPE), new FnParam(CONTEXT_NAME, null)],
      [
        // Temporary variable declarations for query refresh (i.e. let _t: any;)
        ...this._prefixCode,
        // Creating mode (i.e. if (rf & RenderFlags.Create) { ... })
        ...creationBlock,
        // Binding and refresh mode (i.e. if (rf & RenderFlags.Update) {...})
        ...updateBlock
      ],
      INFERRED_TYPE,
      null,
      this.templateName
    );
  }
  // LocalResolver
  getLocal(name) {
    return this._bindingScope.get(name);
  }
  // LocalResolver
  notifyImplicitReceiverUse() {
    this._bindingScope.notifyImplicitReceiverUse();
  }
  // LocalResolver
  maybeRestoreView() {
    this._bindingScope.maybeRestoreView();
  }
  i18nTranslate(message, params = {}, ref, transformFn) {
    const _ref = ref || this.i18nGenerateMainBlockVar();
    const closureVar = this.i18nGenerateClosureVar(message.id);
    const statements = getTranslationDeclStmts(message, _ref, closureVar, params, transformFn);
    this._constants.prepareStatements.push(...statements);
    return _ref;
  }
  registerContextVariables(variable$1) {
    const scopedName = this._bindingScope.freshReferenceName();
    const retrievalLevel = this.level;
    const lhs = variable(variable$1.name + scopedName);
    this._bindingScope.set(retrievalLevel, variable$1.name, lhs, 1, (scope, relativeLevel) => {
      let rhs;
      if (scope.bindingLevel === retrievalLevel) {
        if (scope.isListenerScope() && scope.hasRestoreViewVariable()) {
          rhs = variable(RESTORED_VIEW_CONTEXT_NAME);
          scope.notifyRestoredViewContextUse();
        } else {
          rhs = variable(CONTEXT_NAME);
        }
      } else {
        const sharedCtxVar = scope.getSharedContextName(retrievalLevel);
        rhs = sharedCtxVar ? sharedCtxVar : generateNextContextExpr(relativeLevel);
      }
      return [lhs.set(rhs.prop(variable$1.value || IMPLICIT_REFERENCE)).toConstDecl()];
    });
  }
  i18nAppendBindings(expressions) {
    if (expressions.length > 0) {
      expressions.forEach((expression) => this.i18n.appendBinding(expression));
    }
  }
  i18nBindProps(props) {
    const bound = {};
    Object.keys(props).forEach((key) => {
      const prop = props[key];
      if (prop instanceof Text$3) {
        bound[key] = literal(prop.value);
      } else {
        const value = prop.value.visit(this._valueConverter);
        this.allocateBindingSlots(value);
        if (value instanceof Interpolation$1) {
          const { strings, expressions } = value;
          const { id, bindings } = this.i18n;
          const label = assembleI18nBoundString(strings, bindings.size, id);
          this.i18nAppendBindings(expressions);
          bound[key] = literal(label);
        }
      }
    });
    return bound;
  }
  // Generates top level vars for i18n blocks (i.e. `i18n_N`).
  i18nGenerateMainBlockVar() {
    return variable(this.constantPool.uniqueName(TRANSLATION_VAR_PREFIX));
  }
  // Generates vars with Closure-specific names for i18n blocks (i.e. `MSG_XXX`).
  i18nGenerateClosureVar(messageId) {
    let name;
    const suffix = this.fileBasedI18nSuffix.toUpperCase();
    if (this.i18nUseExternalIds) {
      const prefix = getTranslationConstPrefix(`EXTERNAL_`);
      const uniqueSuffix = this.constantPool.uniqueName(suffix);
      name = `${prefix}${sanitizeIdentifier(messageId)}$$${uniqueSuffix}`;
    } else {
      const prefix = getTranslationConstPrefix(suffix);
      name = this.constantPool.uniqueName(prefix);
    }
    return variable(name);
  }
  i18nUpdateRef(context) {
    const { icus, meta, isRoot, isResolved, isEmitted } = context;
    if (isRoot && isResolved && !isEmitted && !isSingleI18nIcu(meta)) {
      context.isEmitted = true;
      const placeholders = context.getSerializedPlaceholders();
      let icuMapping = {};
      let params = placeholders.size ? placeholdersToParams(placeholders) : {};
      if (icus.size) {
        icus.forEach((refs, key) => {
          if (refs.length === 1) {
            params[key] = refs[0];
          } else {
            const placeholder = wrapI18nPlaceholder(`${I18N_ICU_MAPPING_PREFIX}${key}`);
            params[key] = literal(placeholder);
            icuMapping[key] = literalArr(refs);
          }
        });
      }
      const needsPostprocessing = Array.from(placeholders.values()).some((value) => value.length > 1) || Object.keys(icuMapping).length;
      let transformFn;
      if (needsPostprocessing) {
        transformFn = (raw) => {
          const args = [raw];
          if (Object.keys(icuMapping).length) {
            args.push(mapLiteral(icuMapping, true));
          }
          return invokeInstruction(null, Identifiers.i18nPostprocess, args);
        };
      }
      this.i18nTranslate(meta, params, context.ref, transformFn);
    }
  }
  i18nStart(span = null, meta, selfClosing) {
    const index = this.allocateDataSlot();
    this.i18n = this.i18nContext ? this.i18nContext.forkChildContext(index, this.templateIndex, meta) : new I18nContext(index, this.i18nGenerateMainBlockVar(), 0, this.templateIndex, meta);
    const { id, ref } = this.i18n;
    const params = [literal(index), this.addToConsts(ref)];
    if (id > 0) {
      params.push(literal(id));
    }
    this.creationInstruction(span, selfClosing ? Identifiers.i18n : Identifiers.i18nStart, params);
  }
  i18nEnd(span = null, selfClosing) {
    if (!this.i18n) {
      throw new Error("i18nEnd is executed with no i18n context present");
    }
    if (this.i18nContext) {
      this.i18nContext.reconcileChildContext(this.i18n);
      this.i18nUpdateRef(this.i18nContext);
    } else {
      this.i18nUpdateRef(this.i18n);
    }
    const { index, bindings } = this.i18n;
    if (bindings.size) {
      for (const binding of bindings) {
        this.updateInstructionWithAdvance(this.getConstCount() - 1, span, Identifiers.i18nExp, () => this.convertPropertyBinding(binding));
      }
      this.updateInstruction(span, Identifiers.i18nApply, [literal(index)]);
    }
    if (!selfClosing) {
      this.creationInstruction(span, Identifiers.i18nEnd);
    }
    this.i18n = null;
  }
  i18nAttributesInstruction(nodeIndex, attrs, sourceSpan) {
    let hasBindings = false;
    const i18nAttrArgs = [];
    attrs.forEach((attr) => {
      const message = attr.i18n;
      const converted = attr.value.visit(this._valueConverter);
      this.allocateBindingSlots(converted);
      if (converted instanceof Interpolation$1) {
        const placeholders = assembleBoundTextPlaceholders(message);
        const params = placeholdersToParams(placeholders);
        i18nAttrArgs.push(literal(attr.name), this.i18nTranslate(message, params));
        converted.expressions.forEach((expression) => {
          hasBindings = true;
          this.updateInstructionWithAdvance(nodeIndex, sourceSpan, Identifiers.i18nExp, () => this.convertPropertyBinding(expression));
        });
      }
    });
    if (i18nAttrArgs.length > 0) {
      const index = literal(this.allocateDataSlot());
      const constIndex = this.addToConsts(literalArr(i18nAttrArgs));
      this.creationInstruction(sourceSpan, Identifiers.i18nAttributes, [index, constIndex]);
      if (hasBindings) {
        this.updateInstruction(sourceSpan, Identifiers.i18nApply, [index]);
      }
    }
  }
  getNamespaceInstruction(namespaceKey) {
    switch (namespaceKey) {
      case "math":
        return Identifiers.namespaceMathML;
      case "svg":
        return Identifiers.namespaceSVG;
      default:
        return Identifiers.namespaceHTML;
    }
  }
  addNamespaceInstruction(nsInstruction, element2) {
    this._namespace = nsInstruction;
    this.creationInstruction(element2.startSourceSpan, nsInstruction);
  }
  /**
   * Adds an update instruction for an interpolated property or attribute, such as
   * `prop="{{value}}"` or `attr.title="{{value}}"`
   */
  interpolatedUpdateInstruction(instruction, elementIndex, attrName, input, value, params) {
    this.updateInstructionWithAdvance(elementIndex, input.sourceSpan, instruction, () => [literal(attrName), ...this.getUpdateInstructionArguments(value), ...params]);
  }
  visitContent(ngContent) {
    const slot = this.allocateDataSlot();
    const projectionSlotIdx = this._ngContentSelectorsOffset + this._ngContentReservedSlots.length;
    const parameters = [literal(slot)];
    this._ngContentReservedSlots.push(ngContent.selector);
    const nonContentSelectAttributes = ngContent.attributes.filter((attr) => attr.name.toLowerCase() !== NG_CONTENT_SELECT_ATTR);
    const attributes = this.getAttributeExpressions(ngContent.name, nonContentSelectAttributes, [], []);
    if (attributes.length > 0) {
      parameters.push(literal(projectionSlotIdx), literalArr(attributes));
    } else if (projectionSlotIdx !== 0) {
      parameters.push(literal(projectionSlotIdx));
    }
    this.creationInstruction(ngContent.sourceSpan, Identifiers.projection, parameters);
    if (this.i18n) {
      this.i18n.appendProjection(ngContent.i18n, slot);
    }
  }
  visitElement(element2) {
    const elementIndex = this.allocateDataSlot();
    const stylingBuilder = new StylingBuilder(null);
    let isNonBindableMode = false;
    const isI18nRootElement = isI18nRootNode(element2.i18n) && !isSingleI18nIcu(element2.i18n);
    const outputAttrs = [];
    const [namespaceKey, elementName] = splitNsName(element2.name);
    const isNgContainer$1 = isNgContainer(element2.name);
    for (const attr of element2.attributes) {
      const { name, value } = attr;
      if (name === NON_BINDABLE_ATTR) {
        isNonBindableMode = true;
      } else if (name === "style") {
        stylingBuilder.registerStyleAttr(value);
      } else if (name === "class") {
        stylingBuilder.registerClassAttr(value);
      } else {
        outputAttrs.push(attr);
      }
    }
    const parameters = [literal(elementIndex)];
    if (!isNgContainer$1) {
      parameters.push(literal(elementName));
    }
    const allOtherInputs = [];
    const boundI18nAttrs = [];
    element2.inputs.forEach((input) => {
      const stylingInputWasSet = stylingBuilder.registerBoundInput(input);
      if (!stylingInputWasSet) {
        if (input.type === 0 && input.i18n) {
          boundI18nAttrs.push(input);
        } else {
          allOtherInputs.push(input);
        }
      }
    });
    const attributes = this.getAttributeExpressions(element2.name, outputAttrs, allOtherInputs, element2.outputs, stylingBuilder, [], boundI18nAttrs);
    parameters.push(this.addAttrsToConsts(attributes));
    const refs = this.prepareRefsArray(element2.references);
    parameters.push(this.addToConsts(refs));
    const wasInNamespace = this._namespace;
    const currentNamespace = this.getNamespaceInstruction(namespaceKey);
    if (currentNamespace !== wasInNamespace) {
      this.addNamespaceInstruction(currentNamespace, element2);
    }
    if (this.i18n) {
      this.i18n.appendElement(element2.i18n, elementIndex);
    }
    const hasChildren = !isI18nRootElement && this.i18n ? !hasTextChildrenOnly(element2.children) : element2.children.length > 0;
    const createSelfClosingInstruction = !stylingBuilder.hasBindingsWithPipes && element2.outputs.length === 0 && boundI18nAttrs.length === 0 && !hasChildren;
    const createSelfClosingI18nInstruction = !createSelfClosingInstruction && hasTextChildrenOnly(element2.children);
    if (createSelfClosingInstruction) {
      this.creationInstruction(element2.sourceSpan, isNgContainer$1 ? Identifiers.elementContainer : Identifiers.element, trimTrailingNulls(parameters));
    } else {
      this.creationInstruction(element2.startSourceSpan, isNgContainer$1 ? Identifiers.elementContainerStart : Identifiers.elementStart, trimTrailingNulls(parameters));
      if (isNonBindableMode) {
        this.creationInstruction(element2.startSourceSpan, Identifiers.disableBindings);
      }
      if (boundI18nAttrs.length > 0) {
        this.i18nAttributesInstruction(elementIndex, boundI18nAttrs, element2.startSourceSpan ?? element2.sourceSpan);
      }
      if (element2.outputs.length > 0) {
        for (const outputAst of element2.outputs) {
          this.creationInstruction(outputAst.sourceSpan, Identifiers.listener, this.prepareListenerParameter(element2.name, outputAst, elementIndex));
        }
      }
      if (isI18nRootElement) {
        this.i18nStart(element2.startSourceSpan, element2.i18n, createSelfClosingI18nInstruction);
      }
    }
    const stylingInstructions = stylingBuilder.buildUpdateLevelInstructions(this._valueConverter);
    const limit = stylingInstructions.length - 1;
    for (let i = 0; i <= limit; i++) {
      const instruction = stylingInstructions[i];
      this._bindingSlots += this.processStylingUpdateInstruction(elementIndex, instruction);
    }
    const emptyValueBindInstruction = literal(void 0);
    const propertyBindings = [];
    const attributeBindings = [];
    allOtherInputs.forEach((input) => {
      const inputType = input.type;
      if (inputType === 4) {
        const value = input.value.visit(this._valueConverter);
        const hasValue = value instanceof LiteralPrimitive ? !!value.value : true;
        this.allocateBindingSlots(value);
        propertyBindings.push({
          span: input.sourceSpan,
          paramsOrFn: getBindingFunctionParams(() => hasValue ? this.convertPropertyBinding(value) : emptyValueBindInstruction, prepareSyntheticPropertyName(input.name))
        });
      } else {
        if (input.i18n)
          return;
        const value = input.value.visit(this._valueConverter);
        if (value !== void 0) {
          const params = [];
          const [attrNamespace, attrName] = splitNsName(input.name);
          const isAttributeBinding = inputType === 1;
          let sanitizationRef = resolveSanitizationFn(input.securityContext, isAttributeBinding);
          if (!sanitizationRef) {
            if (isIframeElement(element2.name) && isIframeSecuritySensitiveAttr(input.name)) {
              sanitizationRef = importExpr(Identifiers.validateIframeAttribute);
            }
          }
          if (sanitizationRef) {
            params.push(sanitizationRef);
          }
          if (attrNamespace) {
            const namespaceLiteral = literal(attrNamespace);
            if (sanitizationRef) {
              params.push(namespaceLiteral);
            } else {
              params.push(literal(null), namespaceLiteral);
            }
          }
          this.allocateBindingSlots(value);
          if (inputType === 0) {
            if (value instanceof Interpolation$1) {
              this.interpolatedUpdateInstruction(getPropertyInterpolationExpression(value), elementIndex, attrName, input, value, params);
            } else {
              propertyBindings.push({
                span: input.sourceSpan,
                paramsOrFn: getBindingFunctionParams(() => this.convertPropertyBinding(value), attrName, params)
              });
            }
          } else if (inputType === 1) {
            if (value instanceof Interpolation$1 && getInterpolationArgsLength(value) > 1) {
              this.interpolatedUpdateInstruction(getAttributeInterpolationExpression(value), elementIndex, attrName, input, value, params);
            } else {
              const boundValue = value instanceof Interpolation$1 ? value.expressions[0] : value;
              attributeBindings.push({
                span: input.sourceSpan,
                paramsOrFn: getBindingFunctionParams(() => this.convertPropertyBinding(boundValue), attrName, params)
              });
            }
          } else {
            this.updateInstructionWithAdvance(elementIndex, input.sourceSpan, Identifiers.classProp, () => {
              return [
                literal(elementIndex),
                literal(attrName),
                this.convertPropertyBinding(value),
                ...params
              ];
            });
          }
        }
      }
    });
    for (const propertyBinding of propertyBindings) {
      this.updateInstructionWithAdvance(elementIndex, propertyBinding.span, Identifiers.property, propertyBinding.paramsOrFn);
    }
    for (const attributeBinding of attributeBindings) {
      this.updateInstructionWithAdvance(elementIndex, attributeBinding.span, Identifiers.attribute, attributeBinding.paramsOrFn);
    }
    visitAll$1(this, element2.children);
    if (!isI18nRootElement && this.i18n) {
      this.i18n.appendElement(element2.i18n, elementIndex, true);
    }
    if (!createSelfClosingInstruction) {
      const span = element2.endSourceSpan ?? element2.sourceSpan;
      if (isI18nRootElement) {
        this.i18nEnd(span, createSelfClosingI18nInstruction);
      }
      if (isNonBindableMode) {
        this.creationInstruction(span, Identifiers.enableBindings);
      }
      this.creationInstruction(span, isNgContainer$1 ? Identifiers.elementContainerEnd : Identifiers.elementEnd);
    }
  }
  visitTemplate(template2) {
    const NG_TEMPLATE_TAG_NAME = "ng-template";
    const templateIndex = this.allocateDataSlot();
    if (this.i18n) {
      this.i18n.appendTemplate(template2.i18n, templateIndex);
    }
    const tagNameWithoutNamespace = template2.tagName ? splitNsName(template2.tagName)[1] : template2.tagName;
    const contextName = `${this.contextName}${template2.tagName ? "_" + sanitizeIdentifier(template2.tagName) : ""}_${templateIndex}`;
    const templateName = `${contextName}_Template`;
    const parameters = [
      literal(templateIndex),
      variable(templateName),
      // We don't care about the tag's namespace here, because we infer
      // it based on the parent nodes inside the template instruction.
      literal(tagNameWithoutNamespace)
    ];
    const attrsExprs = this.getAttributeExpressions(NG_TEMPLATE_TAG_NAME, template2.attributes, template2.inputs, template2.outputs, void 0, template2.templateAttrs);
    parameters.push(this.addAttrsToConsts(attrsExprs));
    if (template2.references && template2.references.length) {
      const refs = this.prepareRefsArray(template2.references);
      parameters.push(this.addToConsts(refs));
      parameters.push(importExpr(Identifiers.templateRefExtractor));
    }
    const templateVisitor = new _TemplateDefinitionBuilder(this.constantPool, this._bindingScope, this.level + 1, contextName, this.i18n, templateIndex, templateName, this._namespace, this.fileBasedI18nSuffix, this.i18nUseExternalIds, this.deferBlocks, this._constants);
    this._nestedTemplateFns.push(() => {
      const templateFunctionExpr = templateVisitor.buildTemplateFunction(template2.children, template2.variables, this._ngContentReservedSlots.length + this._ngContentSelectorsOffset, template2.i18n);
      this.constantPool.statements.push(templateFunctionExpr.toDeclStmt(templateName));
      if (templateVisitor._ngContentReservedSlots.length) {
        this._ngContentReservedSlots.push(...templateVisitor._ngContentReservedSlots);
      }
    });
    this.creationInstruction(template2.sourceSpan, Identifiers.templateCreate, () => {
      parameters.splice(2, 0, literal(templateVisitor.getConstCount()), literal(templateVisitor.getVarCount()));
      return trimTrailingNulls(parameters);
    });
    this.templatePropertyBindings(templateIndex, template2.templateAttrs);
    if (tagNameWithoutNamespace === NG_TEMPLATE_TAG_NAME) {
      const [i18nInputs, inputs] = partitionArray(template2.inputs, hasI18nMeta);
      if (i18nInputs.length > 0) {
        this.i18nAttributesInstruction(templateIndex, i18nInputs, template2.startSourceSpan ?? template2.sourceSpan);
      }
      if (inputs.length > 0) {
        this.templatePropertyBindings(templateIndex, inputs);
      }
      for (const outputAst of template2.outputs) {
        this.creationInstruction(outputAst.sourceSpan, Identifiers.listener, this.prepareListenerParameter("ng_template", outputAst, templateIndex));
      }
    }
  }
  visitBoundText(text2) {
    if (this.i18n) {
      const value2 = text2.value.visit(this._valueConverter);
      this.allocateBindingSlots(value2);
      if (value2 instanceof Interpolation$1) {
        this.i18n.appendBoundText(text2.i18n);
        this.i18nAppendBindings(value2.expressions);
      }
      return;
    }
    const nodeIndex = this.allocateDataSlot();
    this.creationInstruction(text2.sourceSpan, Identifiers.text, [literal(nodeIndex)]);
    const value = text2.value.visit(this._valueConverter);
    this.allocateBindingSlots(value);
    if (value instanceof Interpolation$1) {
      this.updateInstructionWithAdvance(nodeIndex, text2.sourceSpan, getTextInterpolationExpression(value), () => this.getUpdateInstructionArguments(value));
    } else {
      error("Text nodes should be interpolated and never bound directly.");
    }
  }
  visitText(text2) {
    if (!this.i18n) {
      this.creationInstruction(text2.sourceSpan, Identifiers.text, [literal(this.allocateDataSlot()), literal(text2.value)]);
    }
  }
  visitIcu(icu) {
    let initWasInvoked = false;
    if (!this.i18n) {
      initWasInvoked = true;
      this.i18nStart(null, icu.i18n, true);
    }
    const i18n = this.i18n;
    const vars = this.i18nBindProps(icu.vars);
    const placeholders = this.i18nBindProps(icu.placeholders);
    const message = icu.i18n;
    const transformFn = (raw) => {
      const params = __spreadValues(__spreadValues({}, vars), placeholders);
      const formatted = formatI18nPlaceholderNamesInMap(
        params,
        /* useCamelCase */
        false
      );
      return invokeInstruction(null, Identifiers.i18nPostprocess, [raw, mapLiteral(formatted, true)]);
    };
    if (isSingleI18nIcu(i18n.meta)) {
      this.i18nTranslate(
        message,
        /* placeholders */
        {},
        i18n.ref,
        transformFn
      );
    } else {
      const ref = this.i18nTranslate(
        message,
        /* placeholders */
        {},
        /* ref */
        void 0,
        transformFn
      );
      i18n.appendIcu(icuFromI18nMessage(message).name, ref);
    }
    if (initWasInvoked) {
      this.i18nEnd(null, true);
    }
    return null;
  }
  visitDeferredBlock(deferred) {
    const templateIndex = this.allocateDataSlot();
    const deferredDeps = this.deferBlocks.get(deferred);
    const contextName = `${this.contextName}_Defer_${templateIndex}`;
    const depsFnName = `${contextName}_DepsFn`;
    const parameters = [
      literal(templateIndex),
      deferredDeps ? variable(depsFnName) : TYPED_NULL_EXPR
    ];
    if (deferredDeps) {
      const dependencyExp = [];
      for (const deferredDep of deferredDeps) {
        if (deferredDep.isDeferrable) {
          const innerFn = fn([new FnParam("m", DYNAMIC_TYPE)], [new ReturnStatement(variable("m").prop(deferredDep.symbolName))]);
          const fileName = deferredDep.importPath;
          const importExpr2 = new DynamicImportExpr(fileName).prop("then").callFn([innerFn]);
          dependencyExp.push(importExpr2);
        } else {
          dependencyExp.push(deferredDep.type);
        }
      }
      const depsFnBody = [];
      depsFnBody.push(new ReturnStatement(literalArr(dependencyExp)));
      const depsFnExpr = fn([], depsFnBody, INFERRED_TYPE, null, depsFnName);
      this.constantPool.statements.push(depsFnExpr.toDeclStmt(depsFnName));
    }
    this.creationInstruction(deferred.sourceSpan, Identifiers.defer, () => {
      return trimTrailingNulls(parameters);
    });
  }
  // TODO: implement nested deferred block instructions.
  visitDeferredTrigger(trigger) {
  }
  visitDeferredBlockPlaceholder(block) {
  }
  visitDeferredBlockError(block) {
  }
  visitDeferredBlockLoading(block) {
  }
  allocateDataSlot() {
    return this._dataIndex++;
  }
  getConstCount() {
    return this._dataIndex;
  }
  getVarCount() {
    return this._pureFunctionSlots;
  }
  getConsts() {
    return this._constants;
  }
  getNgContentSelectors() {
    return this._ngContentReservedSlots.length ? this.constantPool.getConstLiteral(asLiteral(this._ngContentReservedSlots), true) : null;
  }
  bindingContext() {
    return `${this._bindingContext++}`;
  }
  templatePropertyBindings(templateIndex, attrs) {
    const propertyBindings = [];
    for (const input of attrs) {
      if (!(input instanceof BoundAttribute)) {
        continue;
      }
      const value = input.value.visit(this._valueConverter);
      if (value === void 0) {
        continue;
      }
      this.allocateBindingSlots(value);
      if (value instanceof Interpolation$1) {
        const params = [];
        this.interpolatedUpdateInstruction(getPropertyInterpolationExpression(value), templateIndex, input.name, input, value, params);
      } else {
        propertyBindings.push({
          span: input.sourceSpan,
          paramsOrFn: getBindingFunctionParams(() => this.convertPropertyBinding(value), input.name)
        });
      }
    }
    for (const propertyBinding of propertyBindings) {
      this.updateInstructionWithAdvance(templateIndex, propertyBinding.span, Identifiers.property, propertyBinding.paramsOrFn);
    }
  }
  // Bindings must only be resolved after all local refs have been visited, so all
  // instructions are queued in callbacks that execute once the initial pass has completed.
  // Otherwise, we wouldn't be able to support local refs that are defined after their
  // bindings. e.g. {{ foo }} <div #foo></div>
  instructionFn(fns, span, reference2, paramsOrFn, prepend = false) {
    fns[prepend ? "unshift" : "push"]({ span, reference: reference2, paramsOrFn });
  }
  processStylingUpdateInstruction(elementIndex, instruction) {
    let allocateBindingSlots = 0;
    if (instruction) {
      for (const call2 of instruction.calls) {
        allocateBindingSlots += call2.allocateBindingSlots;
        this.updateInstructionWithAdvance(elementIndex, call2.sourceSpan, instruction.reference, () => call2.params((value) => call2.supportsInterpolation && value instanceof Interpolation$1 ? this.getUpdateInstructionArguments(value) : this.convertPropertyBinding(value)));
      }
    }
    return allocateBindingSlots;
  }
  creationInstruction(span, reference2, paramsOrFn, prepend) {
    this.instructionFn(this._creationCodeFns, span, reference2, paramsOrFn || [], prepend);
  }
  updateInstructionWithAdvance(nodeIndex, span, reference2, paramsOrFn) {
    this.addAdvanceInstructionIfNecessary(nodeIndex, span);
    this.updateInstruction(span, reference2, paramsOrFn);
  }
  updateInstruction(span, reference2, paramsOrFn) {
    this.instructionFn(this._updateCodeFns, span, reference2, paramsOrFn || []);
  }
  addAdvanceInstructionIfNecessary(nodeIndex, span) {
    if (nodeIndex !== this._currentIndex) {
      const delta = nodeIndex - this._currentIndex;
      if (delta < 1) {
        throw new Error("advance instruction can only go forwards");
      }
      this.instructionFn(this._updateCodeFns, span, Identifiers.advance, [literal(delta)]);
      this._currentIndex = nodeIndex;
    }
  }
  allocatePureFunctionSlots(numSlots) {
    const originalSlots = this._pureFunctionSlots;
    this._pureFunctionSlots += numSlots;
    return originalSlots;
  }
  allocateBindingSlots(value) {
    this._bindingSlots += value instanceof Interpolation$1 ? value.expressions.length : 1;
  }
  /**
   * Gets an expression that refers to the implicit receiver. The implicit
   * receiver is always the root level context.
   */
  getImplicitReceiverExpr() {
    if (this._implicitReceiverExpr) {
      return this._implicitReceiverExpr;
    }
    return this._implicitReceiverExpr = this.level === 0 ? variable(CONTEXT_NAME) : this._bindingScope.getOrCreateSharedContextVar(0);
  }
  convertPropertyBinding(value) {
    const convertedPropertyBinding = convertPropertyBinding(this, this.getImplicitReceiverExpr(), value, this.bindingContext());
    const valExpr = convertedPropertyBinding.currValExpr;
    this._tempVariables.push(...convertedPropertyBinding.stmts);
    return valExpr;
  }
  /**
   * Gets a list of argument expressions to pass to an update instruction expression. Also updates
   * the temp variables state with temp variables that were identified as needing to be created
   * while visiting the arguments.
   * @param value The original expression we will be resolving an arguments list from.
   */
  getUpdateInstructionArguments(value) {
    const { args, stmts } = convertUpdateArguments(this, this.getImplicitReceiverExpr(), value, this.bindingContext());
    this._tempVariables.push(...stmts);
    return args;
  }
  /**
   * Prepares all attribute expression values for the `TAttributes` array.
   *
   * The purpose of this function is to properly construct an attributes array that
   * is passed into the `elementStart` (or just `element`) functions. Because there
   * are many different types of attributes, the array needs to be constructed in a
   * special way so that `elementStart` can properly evaluate them.
   *
   * The format looks like this:
   *
   * ```
   * attrs = [prop, value, prop2, value2,
   *   PROJECT_AS, selector,
   *   CLASSES, class1, class2,
   *   STYLES, style1, value1, style2, value2,
   *   BINDINGS, name1, name2, name3,
   *   TEMPLATE, name4, name5, name6,
   *   I18N, name7, name8, ...]
   * ```
   *
   * Note that this function will fully ignore all synthetic (@foo) attribute values
   * because those values are intended to always be generated as property instructions.
   */
  getAttributeExpressions(elementName, renderAttributes, inputs, outputs, styles, templateAttrs = [], boundI18nAttrs = []) {
    const alreadySeen = /* @__PURE__ */ new Set();
    const attrExprs = [];
    let ngProjectAsAttr;
    for (const attr of renderAttributes) {
      if (attr.name === NG_PROJECT_AS_ATTR_NAME) {
        ngProjectAsAttr = attr;
      }
      if (attr.i18n) {
        const { i18nVarRefsCache } = this._constants;
        let i18nVarRef;
        if (i18nVarRefsCache.has(attr.i18n)) {
          i18nVarRef = i18nVarRefsCache.get(attr.i18n);
        } else {
          i18nVarRef = this.i18nTranslate(attr.i18n);
          i18nVarRefsCache.set(attr.i18n, i18nVarRef);
        }
        attrExprs.push(literal(attr.name), i18nVarRef);
      } else {
        attrExprs.push(...getAttributeNameLiterals(attr.name), trustedConstAttribute(elementName, attr));
      }
    }
    if (ngProjectAsAttr) {
      attrExprs.push(...getNgProjectAsLiteral(ngProjectAsAttr));
    }
    function addAttrExpr(key, value) {
      if (typeof key === "string") {
        if (!alreadySeen.has(key)) {
          attrExprs.push(...getAttributeNameLiterals(key));
          value !== void 0 && attrExprs.push(value);
          alreadySeen.add(key);
        }
      } else {
        attrExprs.push(literal(key));
      }
    }
    if (styles) {
      styles.populateInitialStylingAttrs(attrExprs);
    }
    if (inputs.length || outputs.length) {
      const attrsLengthBeforeInputs = attrExprs.length;
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (input.type !== 4 && input.type !== 1) {
          addAttrExpr(input.name);
        }
      }
      for (let i = 0; i < outputs.length; i++) {
        const output = outputs[i];
        if (output.type !== 1) {
          addAttrExpr(output.name);
        }
      }
      if (attrExprs.length !== attrsLengthBeforeInputs) {
        attrExprs.splice(attrsLengthBeforeInputs, 0, literal(
          3
          /* core.AttributeMarker.Bindings */
        ));
      }
    }
    if (templateAttrs.length) {
      attrExprs.push(literal(
        4
        /* core.AttributeMarker.Template */
      ));
      templateAttrs.forEach((attr) => addAttrExpr(attr.name));
    }
    if (boundI18nAttrs.length) {
      attrExprs.push(literal(
        6
        /* core.AttributeMarker.I18n */
      ));
      boundI18nAttrs.forEach((attr) => addAttrExpr(attr.name));
    }
    return attrExprs;
  }
  addToConsts(expression) {
    if (isNull(expression)) {
      return TYPED_NULL_EXPR;
    }
    const consts = this._constants.constExpressions;
    for (let i = 0; i < consts.length; i++) {
      if (consts[i].isEquivalent(expression)) {
        return literal(i);
      }
    }
    return literal(consts.push(expression) - 1);
  }
  addAttrsToConsts(attrs) {
    return attrs.length > 0 ? this.addToConsts(literalArr(attrs)) : TYPED_NULL_EXPR;
  }
  prepareRefsArray(references) {
    if (!references || references.length === 0) {
      return TYPED_NULL_EXPR;
    }
    const refsParam = references.flatMap((reference2) => {
      const slot = this.allocateDataSlot();
      const variableName = this._bindingScope.freshReferenceName();
      const retrievalLevel = this.level;
      const lhs = variable(variableName);
      this._bindingScope.set(retrievalLevel, reference2.name, lhs, 0, (scope, relativeLevel) => {
        const nextContextStmt = relativeLevel > 0 ? [generateNextContextExpr(relativeLevel).toStmt()] : [];
        const refExpr = lhs.set(importExpr(Identifiers.reference).callFn([literal(slot)]));
        return nextContextStmt.concat(refExpr.toConstDecl());
      }, true);
      return [reference2.name, reference2.value];
    });
    return asLiteral(refsParam);
  }
  prepareListenerParameter(tagName, outputAst, index) {
    return () => {
      const eventName = outputAst.name;
      const bindingFnName = outputAst.type === 1 ? (
        // synthetic @listener.foo values are treated the exact same as are standard listeners
        prepareSyntheticListenerFunctionName(eventName, outputAst.phase)
      ) : sanitizeIdentifier(eventName);
      const handlerName = `${this.templateName}_${tagName}_${bindingFnName}_${index}_listener`;
      const scope = this._bindingScope.nestedScope(this._bindingScope.bindingLevel, EVENT_BINDING_SCOPE_GLOBALS);
      return prepareEventListenerParameters(outputAst, handlerName, scope);
    };
  }
};
var ValueConverter = class extends AstMemoryEfficientTransformer {
  constructor(constantPool, allocateSlot, allocatePureFunctionSlots, definePipe) {
    super();
    this.constantPool = constantPool;
    this.allocateSlot = allocateSlot;
    this.allocatePureFunctionSlots = allocatePureFunctionSlots;
    this.definePipe = definePipe;
    this._pipeBindExprs = [];
  }
  // AstMemoryEfficientTransformer
  visitPipe(pipe2, context) {
    const slot = this.allocateSlot();
    const slotPseudoLocal = `PIPE:${slot}`;
    const pureFunctionSlot = this.allocatePureFunctionSlots(2 + pipe2.args.length);
    const target = new PropertyRead(pipe2.span, pipe2.sourceSpan, pipe2.nameSpan, new ImplicitReceiver(pipe2.span, pipe2.sourceSpan), slotPseudoLocal);
    const { identifier, isVarLength } = pipeBindingCallInfo(pipe2.args);
    this.definePipe(pipe2.name, slotPseudoLocal, slot, importExpr(identifier));
    const args = [pipe2.exp, ...pipe2.args];
    const convertedArgs = isVarLength ? this.visitAll([new LiteralArray(pipe2.span, pipe2.sourceSpan, args)]) : this.visitAll(args);
    const pipeBindExpr = new Call(pipe2.span, pipe2.sourceSpan, target, [
      new LiteralPrimitive(pipe2.span, pipe2.sourceSpan, slot),
      new LiteralPrimitive(pipe2.span, pipe2.sourceSpan, pureFunctionSlot),
      ...convertedArgs
    ], null);
    this._pipeBindExprs.push(pipeBindExpr);
    return pipeBindExpr;
  }
  updatePipeSlotOffsets(bindingSlots) {
    this._pipeBindExprs.forEach((pipe2) => {
      const slotOffset = pipe2.args[1];
      slotOffset.value += bindingSlots;
    });
  }
  visitLiteralArray(array, context) {
    return new BuiltinFunctionCall(array.span, array.sourceSpan, this.visitAll(array.expressions), (values) => {
      const literal2 = literalArr(values);
      return getLiteralFactory(this.constantPool, literal2, this.allocatePureFunctionSlots);
    });
  }
  visitLiteralMap(map, context) {
    return new BuiltinFunctionCall(map.span, map.sourceSpan, this.visitAll(map.values), (values) => {
      const literal2 = literalMap(values.map((value, index) => ({ key: map.keys[index].key, value, quoted: map.keys[index].quoted })));
      return getLiteralFactory(this.constantPool, literal2, this.allocatePureFunctionSlots);
    });
  }
};
var pipeBindingIdentifiers = [Identifiers.pipeBind1, Identifiers.pipeBind2, Identifiers.pipeBind3, Identifiers.pipeBind4];
function pipeBindingCallInfo(args) {
  const identifier = pipeBindingIdentifiers[args.length];
  return {
    identifier: identifier || Identifiers.pipeBindV,
    isVarLength: !identifier
  };
}
var pureFunctionIdentifiers = [
  Identifiers.pureFunction0,
  Identifiers.pureFunction1,
  Identifiers.pureFunction2,
  Identifiers.pureFunction3,
  Identifiers.pureFunction4,
  Identifiers.pureFunction5,
  Identifiers.pureFunction6,
  Identifiers.pureFunction7,
  Identifiers.pureFunction8
];
function pureFunctionCallInfo(args) {
  const identifier = pureFunctionIdentifiers[args.length];
  return {
    identifier: identifier || Identifiers.pureFunctionV,
    isVarLength: !identifier
  };
}
function generateNextContextExpr(relativeLevelDiff) {
  return importExpr(Identifiers.nextContext).callFn(relativeLevelDiff > 1 ? [literal(relativeLevelDiff)] : []);
}
function getLiteralFactory(constantPool, literal$1, allocateSlots) {
  const { literalFactory, literalFactoryArguments } = constantPool.getLiteralFactory(literal$1);
  const startSlot = allocateSlots(1 + literalFactoryArguments.length);
  const { identifier, isVarLength } = pureFunctionCallInfo(literalFactoryArguments);
  const args = [literal(startSlot), literalFactory];
  if (isVarLength) {
    args.push(literalArr(literalFactoryArguments));
  } else {
    args.push(...literalFactoryArguments);
  }
  return importExpr(identifier).callFn(args);
}
function getAttributeNameLiterals(name) {
  const [attributeNamespace, attributeName] = splitNsName(name);
  const nameLiteral = literal(attributeName);
  if (attributeNamespace) {
    return [
      literal(
        0
        /* core.AttributeMarker.NamespaceURI */
      ),
      literal(attributeNamespace),
      nameLiteral
    ];
  }
  return [nameLiteral];
}
var SHARED_CONTEXT_KEY = "$$shared_ctx$$";
var BindingScope = class _BindingScope {
  static createRootScope() {
    return new _BindingScope();
  }
  constructor(bindingLevel = 0, parent = null, globals) {
    this.bindingLevel = bindingLevel;
    this.parent = parent;
    this.globals = globals;
    this.map = /* @__PURE__ */ new Map();
    this.referenceNameIndex = 0;
    this.restoreViewVariable = null;
    this.usesRestoredViewContext = false;
    if (globals !== void 0) {
      for (const name of globals) {
        this.set(0, name, variable(name));
      }
    }
  }
  get(name) {
    let current = this;
    while (current) {
      let value = current.map.get(name);
      if (value != null) {
        if (current !== this) {
          value = {
            retrievalLevel: value.retrievalLevel,
            lhs: value.lhs,
            declareLocalCallback: value.declareLocalCallback,
            declare: false,
            priority: value.priority
          };
          this.map.set(name, value);
          this.maybeGenerateSharedContextVar(value);
          this.maybeRestoreView();
        }
        if (value.declareLocalCallback && !value.declare) {
          value.declare = true;
        }
        return value.lhs;
      }
      current = current.parent;
    }
    return this.bindingLevel === 0 ? null : this.getComponentProperty(name);
  }
  /**
   * Create a local variable for later reference.
   *
   * @param retrievalLevel The level from which this value can be retrieved
   * @param name Name of the variable.
   * @param lhs AST representing the left hand side of the `let lhs = rhs;`.
   * @param priority The sorting priority of this var
   * @param declareLocalCallback The callback to invoke when declaring this local var
   * @param localRef Whether or not this is a local ref
   */
  set(retrievalLevel, name, lhs, priority = 0, declareLocalCallback, localRef) {
    if (this.map.has(name)) {
      if (localRef) {
        return this;
      }
      error(`The name ${name} is already defined in scope to be ${this.map.get(name)}`);
    }
    this.map.set(name, {
      retrievalLevel,
      lhs,
      declare: false,
      declareLocalCallback,
      priority
    });
    return this;
  }
  // Implemented as part of LocalResolver.
  getLocal(name) {
    return this.get(name);
  }
  // Implemented as part of LocalResolver.
  notifyImplicitReceiverUse() {
    if (this.bindingLevel !== 0) {
      this.map.get(SHARED_CONTEXT_KEY + 0).declare = true;
    }
  }
  nestedScope(level, globals) {
    const newScope = new _BindingScope(level, this, globals);
    if (level > 0)
      newScope.generateSharedContextVar(0);
    return newScope;
  }
  /**
   * Gets or creates a shared context variable and returns its expression. Note that
   * this does not mean that the shared variable will be declared. Variables in the
   * binding scope will be only declared if they are used.
   */
  getOrCreateSharedContextVar(retrievalLevel) {
    const bindingKey = SHARED_CONTEXT_KEY + retrievalLevel;
    if (!this.map.has(bindingKey)) {
      this.generateSharedContextVar(retrievalLevel);
    }
    return this.map.get(bindingKey).lhs;
  }
  getSharedContextName(retrievalLevel) {
    const sharedCtxObj = this.map.get(SHARED_CONTEXT_KEY + retrievalLevel);
    return sharedCtxObj && sharedCtxObj.declare ? sharedCtxObj.lhs : null;
  }
  maybeGenerateSharedContextVar(value) {
    if (value.priority === 1 && value.retrievalLevel < this.bindingLevel) {
      const sharedCtxObj = this.map.get(SHARED_CONTEXT_KEY + value.retrievalLevel);
      if (sharedCtxObj) {
        sharedCtxObj.declare = true;
      } else {
        this.generateSharedContextVar(value.retrievalLevel);
      }
    }
  }
  generateSharedContextVar(retrievalLevel) {
    const lhs = variable(CONTEXT_NAME + this.freshReferenceName());
    this.map.set(SHARED_CONTEXT_KEY + retrievalLevel, {
      retrievalLevel,
      lhs,
      declareLocalCallback: (scope, relativeLevel) => {
        return [lhs.set(generateNextContextExpr(relativeLevel)).toConstDecl()];
      },
      declare: false,
      priority: 2
    });
  }
  getComponentProperty(name) {
    const componentValue = this.map.get(SHARED_CONTEXT_KEY + 0);
    componentValue.declare = true;
    this.maybeRestoreView();
    return componentValue.lhs.prop(name);
  }
  maybeRestoreView() {
    if (this.isListenerScope()) {
      if (!this.parent.restoreViewVariable) {
        this.parent.restoreViewVariable = variable(this.parent.freshReferenceName());
      }
      this.restoreViewVariable = this.parent.restoreViewVariable;
    }
  }
  restoreViewStatement() {
    if (this.restoreViewVariable) {
      const restoreCall = invokeInstruction(null, Identifiers.restoreView, [this.restoreViewVariable]);
      return this.usesRestoredViewContext ? variable(RESTORED_VIEW_CONTEXT_NAME).set(restoreCall).toConstDecl() : restoreCall.toStmt();
    }
    return null;
  }
  viewSnapshotStatements() {
    return this.restoreViewVariable ? [
      this.restoreViewVariable.set(invokeInstruction(null, Identifiers.getCurrentView, [])).toConstDecl()
    ] : [];
  }
  isListenerScope() {
    return this.parent && this.parent.bindingLevel === this.bindingLevel;
  }
  variableDeclarations() {
    let currentContextLevel = 0;
    return Array.from(this.map.values()).filter((value) => value.declare).sort((a, b) => b.retrievalLevel - a.retrievalLevel || b.priority - a.priority).reduce((stmts, value) => {
      const levelDiff = this.bindingLevel - value.retrievalLevel;
      const currStmts = value.declareLocalCallback(this, levelDiff - currentContextLevel);
      currentContextLevel = levelDiff;
      return stmts.concat(currStmts);
    }, []);
  }
  freshReferenceName() {
    let current = this;
    while (current.parent)
      current = current.parent;
    const ref = `${REFERENCE_PREFIX}${current.referenceNameIndex++}`;
    return ref;
  }
  hasRestoreViewVariable() {
    return !!this.restoreViewVariable;
  }
  notifyRestoredViewContextUse() {
    this.usesRestoredViewContext = true;
  }
};
function getNgProjectAsLiteral(attribute2) {
  const parsedR3Selector = parseSelectorToR3Selector(attribute2.value)[0];
  return [literal(
    5
    /* core.AttributeMarker.ProjectAs */
  ), asLiteral(parsedR3Selector)];
}
function getPropertyInterpolationExpression(interpolation) {
  switch (getInterpolationArgsLength(interpolation)) {
    case 1:
      return Identifiers.propertyInterpolate;
    case 3:
      return Identifiers.propertyInterpolate1;
    case 5:
      return Identifiers.propertyInterpolate2;
    case 7:
      return Identifiers.propertyInterpolate3;
    case 9:
      return Identifiers.propertyInterpolate4;
    case 11:
      return Identifiers.propertyInterpolate5;
    case 13:
      return Identifiers.propertyInterpolate6;
    case 15:
      return Identifiers.propertyInterpolate7;
    case 17:
      return Identifiers.propertyInterpolate8;
    default:
      return Identifiers.propertyInterpolateV;
  }
}
function getAttributeInterpolationExpression(interpolation) {
  switch (getInterpolationArgsLength(interpolation)) {
    case 3:
      return Identifiers.attributeInterpolate1;
    case 5:
      return Identifiers.attributeInterpolate2;
    case 7:
      return Identifiers.attributeInterpolate3;
    case 9:
      return Identifiers.attributeInterpolate4;
    case 11:
      return Identifiers.attributeInterpolate5;
    case 13:
      return Identifiers.attributeInterpolate6;
    case 15:
      return Identifiers.attributeInterpolate7;
    case 17:
      return Identifiers.attributeInterpolate8;
    default:
      return Identifiers.attributeInterpolateV;
  }
}
function getTextInterpolationExpression(interpolation) {
  switch (getInterpolationArgsLength(interpolation)) {
    case 1:
      return Identifiers.textInterpolate;
    case 3:
      return Identifiers.textInterpolate1;
    case 5:
      return Identifiers.textInterpolate2;
    case 7:
      return Identifiers.textInterpolate3;
    case 9:
      return Identifiers.textInterpolate4;
    case 11:
      return Identifiers.textInterpolate5;
    case 13:
      return Identifiers.textInterpolate6;
    case 15:
      return Identifiers.textInterpolate7;
    case 17:
      return Identifiers.textInterpolate8;
    default:
      return Identifiers.textInterpolateV;
  }
}
function parseTemplate(template2, templateUrl, options = {}) {
  const { interpolationConfig, preserveWhitespaces, enableI18nLegacyMessageIdFormat } = options;
  const bindingParser = makeBindingParser(interpolationConfig);
  const htmlParser = new HtmlParser();
  const parseResult = htmlParser.parse(template2, templateUrl, __spreadProps(__spreadValues({
    leadingTriviaChars: LEADING_TRIVIA_CHARS
  }, options), {
    tokenizeExpansionForms: true,
    tokenizeBlocks: options.enabledBlockTypes != null && options.enabledBlockTypes.size > 0
  }));
  if (!options.alwaysAttemptHtmlToR3AstConversion && parseResult.errors && parseResult.errors.length > 0) {
    const parsedTemplate2 = {
      interpolationConfig,
      preserveWhitespaces,
      errors: parseResult.errors,
      nodes: [],
      styleUrls: [],
      styles: [],
      ngContentSelectors: []
    };
    if (options.collectCommentNodes) {
      parsedTemplate2.commentNodes = [];
    }
    return parsedTemplate2;
  }
  let rootNodes = parseResult.rootNodes;
  const i18nMetaVisitor = new I18nMetaVisitor(
    interpolationConfig,
    /* keepI18nAttrs */
    !preserveWhitespaces,
    enableI18nLegacyMessageIdFormat
  );
  const i18nMetaResult = i18nMetaVisitor.visitAllWithErrors(rootNodes);
  if (!options.alwaysAttemptHtmlToR3AstConversion && i18nMetaResult.errors && i18nMetaResult.errors.length > 0) {
    const parsedTemplate2 = {
      interpolationConfig,
      preserveWhitespaces,
      errors: i18nMetaResult.errors,
      nodes: [],
      styleUrls: [],
      styles: [],
      ngContentSelectors: []
    };
    if (options.collectCommentNodes) {
      parsedTemplate2.commentNodes = [];
    }
    return parsedTemplate2;
  }
  rootNodes = i18nMetaResult.rootNodes;
  if (!preserveWhitespaces) {
    rootNodes = visitAll(new WhitespaceVisitor(), rootNodes);
    if (i18nMetaVisitor.hasI18nMeta) {
      rootNodes = visitAll(new I18nMetaVisitor(
        interpolationConfig,
        /* keepI18nAttrs */
        false
      ), rootNodes);
    }
  }
  const { nodes, errors, styleUrls, styles, ngContentSelectors, commentNodes } = htmlAstToRender3Ast(rootNodes, bindingParser, {
    collectCommentNodes: !!options.collectCommentNodes,
    enabledBlockTypes: options.enabledBlockTypes || /* @__PURE__ */ new Set()
  });
  errors.push(...parseResult.errors, ...i18nMetaResult.errors);
  const parsedTemplate = {
    interpolationConfig,
    preserveWhitespaces,
    errors: errors.length > 0 ? errors : null,
    nodes,
    styleUrls,
    styles,
    ngContentSelectors
  };
  if (options.collectCommentNodes) {
    parsedTemplate.commentNodes = commentNodes;
  }
  return parsedTemplate;
}
var elementRegistry = new DomElementSchemaRegistry();
function makeBindingParser(interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
  return new BindingParser(new Parser$1(new Lexer()), interpolationConfig, elementRegistry, []);
}
function resolveSanitizationFn(context, isAttribute) {
  switch (context) {
    case SecurityContext.HTML:
      return importExpr(Identifiers.sanitizeHtml);
    case SecurityContext.SCRIPT:
      return importExpr(Identifiers.sanitizeScript);
    case SecurityContext.STYLE:
      return isAttribute ? importExpr(Identifiers.sanitizeStyle) : null;
    case SecurityContext.URL:
      return importExpr(Identifiers.sanitizeUrl);
    case SecurityContext.RESOURCE_URL:
      return importExpr(Identifiers.sanitizeResourceUrl);
    default:
      return null;
  }
}
function trustedConstAttribute(tagName, attr) {
  const value = asLiteral(attr.value);
  if (isTrustedTypesSink(tagName, attr.name)) {
    switch (elementRegistry.securityContext(
      tagName,
      attr.name,
      /* isAttribute */
      true
    )) {
      case SecurityContext.HTML:
        return taggedTemplate(importExpr(Identifiers.trustConstantHtml), new TemplateLiteral([new TemplateLiteralElement(attr.value)], []), void 0, attr.valueSpan);
      case SecurityContext.RESOURCE_URL:
        return taggedTemplate(importExpr(Identifiers.trustConstantResourceUrl), new TemplateLiteral([new TemplateLiteralElement(attr.value)], []), void 0, attr.valueSpan);
      default:
        return value;
    }
  } else {
    return value;
  }
}
function isSingleElementTemplate(children) {
  return children.length === 1 && children[0] instanceof Element$1;
}
function isTextNode(node) {
  return node instanceof Text$3 || node instanceof BoundText || node instanceof Icu$1;
}
function isIframeElement(tagName) {
  return tagName.toLowerCase() === "iframe";
}
function hasTextChildrenOnly(children) {
  return children.every(isTextNode);
}
function getBindingFunctionParams(deferredParams, name, eagerParams) {
  return () => {
    const value = deferredParams();
    const fnParams = Array.isArray(value) ? value : [value];
    if (eagerParams) {
      fnParams.push(...eagerParams);
    }
    if (name) {
      fnParams.unshift(literal(name));
    }
    return fnParams;
  };
}
var NG_I18N_CLOSURE_MODE = "ngI18nClosureMode";
function getTranslationDeclStmts(message, variable2, closureVar, params = {}, transformFn) {
  const statements = [
    declareI18nVariable(variable2),
    ifStmt(createClosureModeGuard(), createGoogleGetMsgStatements(variable2, message, closureVar, params), createLocalizeStatements(variable2, message, formatI18nPlaceholderNamesInMap(
      params,
      /* useCamelCase */
      false
    )))
  ];
  if (transformFn) {
    statements.push(new ExpressionStatement(variable2.set(transformFn(variable2))));
  }
  return statements;
}
function createClosureModeGuard() {
  return typeofExpr(variable(NG_I18N_CLOSURE_MODE)).notIdentical(literal("undefined", STRING_TYPE)).and(variable(NG_I18N_CLOSURE_MODE));
}
var ATTR_REGEX = /attr\.([^\]]+)/;
var COMPONENT_VARIABLE = "%COMP%";
var HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
var CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
function baseDirectiveFields(meta, constantPool, bindingParser) {
  const definitionMap = new DefinitionMap();
  const selectors = parseSelectorToR3Selector(meta.selector);
  definitionMap.set("type", meta.type.value);
  if (selectors.length > 0) {
    definitionMap.set("selectors", asLiteral(selectors));
  }
  if (meta.queries.length > 0) {
    definitionMap.set("contentQueries", createContentQueriesFunction(meta.queries, constantPool, meta.name));
  }
  if (meta.viewQueries.length) {
    definitionMap.set("viewQuery", createViewQueriesFunction(meta.viewQueries, constantPool, meta.name));
  }
  definitionMap.set("hostBindings", createHostBindingsFunction(meta.host, meta.typeSourceSpan, bindingParser, constantPool, meta.selector || "", meta.name, definitionMap));
  definitionMap.set("inputs", conditionallyCreateDirectiveBindingLiteral(meta.inputs, true));
  definitionMap.set("outputs", conditionallyCreateDirectiveBindingLiteral(meta.outputs));
  if (meta.exportAs !== null) {
    definitionMap.set("exportAs", literalArr(meta.exportAs.map((e) => literal(e))));
  }
  if (meta.isStandalone) {
    definitionMap.set("standalone", literal(true));
  }
  if (meta.isSignal) {
    definitionMap.set("signals", literal(true));
  }
  return definitionMap;
}
function addFeatures(definitionMap, meta) {
  const features = [];
  const providers = meta.providers;
  const viewProviders = meta.viewProviders;
  const inputKeys = Object.keys(meta.inputs);
  if (providers || viewProviders) {
    const args = [providers || new LiteralArrayExpr([])];
    if (viewProviders) {
      args.push(viewProviders);
    }
    features.push(importExpr(Identifiers.ProvidersFeature).callFn(args));
  }
  for (const key of inputKeys) {
    if (meta.inputs[key].transformFunction !== null) {
      features.push(importExpr(Identifiers.InputTransformsFeatureFeature));
      break;
    }
  }
  if (meta.usesInheritance) {
    features.push(importExpr(Identifiers.InheritDefinitionFeature));
  }
  if (meta.fullInheritance) {
    features.push(importExpr(Identifiers.CopyDefinitionFeature));
  }
  if (meta.lifecycle.usesOnChanges) {
    features.push(importExpr(Identifiers.NgOnChangesFeature));
  }
  if (meta.hasOwnProperty("template") && meta.isStandalone) {
    features.push(importExpr(Identifiers.StandaloneFeature));
  }
  if (meta.hostDirectives?.length) {
    features.push(importExpr(Identifiers.HostDirectivesFeature).callFn([createHostDirectivesFeatureArg(meta.hostDirectives)]));
  }
  if (features.length) {
    definitionMap.set("features", literalArr(features));
  }
}
function compileDirectiveFromMetadata(meta, constantPool, bindingParser) {
  const definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
  addFeatures(definitionMap, meta);
  const expression = importExpr(Identifiers.defineDirective).callFn([definitionMap.toLiteralMap()], void 0, true);
  const type = createDirectiveType(meta);
  return { expression, type, statements: [] };
}
function compileComponentFromMetadata(meta, constantPool, bindingParser) {
  const definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
  addFeatures(definitionMap, meta);
  const selector = meta.selector && CssSelector.parse(meta.selector);
  const firstSelector = selector && selector[0];
  if (firstSelector) {
    const selectorAttributes = firstSelector.getAttrs();
    if (selectorAttributes.length) {
      definitionMap.set("attrs", constantPool.getConstLiteral(
        literalArr(selectorAttributes.map((value) => value != null ? literal(value) : literal(void 0))),
        /* forceShared */
        true
      ));
    }
  }
  const templateTypeName = meta.name;
  const templateName = templateTypeName ? `${templateTypeName}_Template` : null;
  const changeDetection = meta.changeDetection;
  if (!USE_TEMPLATE_PIPELINE) {
    const template2 = meta.template;
    const templateBuilder = new TemplateDefinitionBuilder(constantPool, BindingScope.createRootScope(), 0, templateTypeName, null, null, templateName, Identifiers.namespaceHTML, meta.relativeContextFilePath, meta.i18nUseExternalIds, meta.deferBlocks);
    const templateFunctionExpression = templateBuilder.buildTemplateFunction(template2.nodes, []);
    const ngContentSelectors = templateBuilder.getNgContentSelectors();
    if (ngContentSelectors) {
      definitionMap.set("ngContentSelectors", ngContentSelectors);
    }
    definitionMap.set("decls", literal(templateBuilder.getConstCount()));
    definitionMap.set("vars", literal(templateBuilder.getVarCount()));
    const { constExpressions, prepareStatements } = templateBuilder.getConsts();
    if (constExpressions.length > 0) {
      let constsExpr = literalArr(constExpressions);
      if (prepareStatements.length > 0) {
        constsExpr = fn([], [...prepareStatements, new ReturnStatement(constsExpr)]);
      }
      definitionMap.set("consts", constsExpr);
    }
    definitionMap.set("template", templateFunctionExpression);
  } else {
    const tpl = ingestComponent(meta.name, meta.template.nodes, constantPool);
    transformTemplate(tpl);
    const templateFn = emitTemplateFn(tpl, constantPool);
    definitionMap.set("decls", literal(tpl.root.decls));
    definitionMap.set("vars", literal(tpl.root.vars));
    if (tpl.consts.length > 0) {
      definitionMap.set("consts", literalArr(tpl.consts));
    }
    definitionMap.set("template", templateFn);
  }
  if (meta.declarations.length > 0) {
    definitionMap.set("dependencies", compileDeclarationList(literalArr(meta.declarations.map((decl) => decl.type)), meta.declarationListEmitMode));
  }
  if (meta.encapsulation === null) {
    meta.encapsulation = ViewEncapsulation.Emulated;
  }
  if (meta.styles && meta.styles.length) {
    const styleValues = meta.encapsulation == ViewEncapsulation.Emulated ? compileStyles(meta.styles, CONTENT_ATTR, HOST_ATTR) : meta.styles;
    const styleNodes = styleValues.reduce((result, style) => {
      if (style.trim().length > 0) {
        result.push(constantPool.getConstLiteral(literal(style)));
      }
      return result;
    }, []);
    if (styleNodes.length > 0) {
      definitionMap.set("styles", literalArr(styleNodes));
    }
  } else if (meta.encapsulation === ViewEncapsulation.Emulated) {
    meta.encapsulation = ViewEncapsulation.None;
  }
  if (meta.encapsulation !== ViewEncapsulation.Emulated) {
    definitionMap.set("encapsulation", literal(meta.encapsulation));
  }
  if (meta.animations !== null) {
    definitionMap.set("data", literalMap([{ key: "animation", value: meta.animations, quoted: false }]));
  }
  if (changeDetection != null && changeDetection !== ChangeDetectionStrategy.Default) {
    definitionMap.set("changeDetection", literal(changeDetection));
  }
  const expression = importExpr(Identifiers.defineComponent).callFn([definitionMap.toLiteralMap()], void 0, true);
  const type = createComponentType(meta);
  return { expression, type, statements: [] };
}
function createComponentType(meta) {
  const typeParams = createBaseDirectiveTypeParams(meta);
  typeParams.push(stringArrayAsType(meta.template.ngContentSelectors));
  typeParams.push(expressionType(literal(meta.isStandalone)));
  typeParams.push(createHostDirectivesType(meta));
  if (meta.isSignal) {
    typeParams.push(expressionType(literal(meta.isSignal)));
  }
  return expressionType(importExpr(Identifiers.ComponentDeclaration, typeParams));
}
function compileDeclarationList(list, mode) {
  switch (mode) {
    case 0:
      return list;
    case 1:
      return fn([], [new ReturnStatement(list)]);
    case 2:
      const resolvedList = list.prop("map").callFn([importExpr(Identifiers.resolveForwardRef)]);
      return fn([], [new ReturnStatement(resolvedList)]);
  }
}
function prepareQueryParams(query, constantPool) {
  const parameters = [getQueryPredicate(query, constantPool), literal(toQueryFlags(query))];
  if (query.read) {
    parameters.push(query.read);
  }
  return parameters;
}
function toQueryFlags(query) {
  return (query.descendants ? 1 : 0) | (query.static ? 2 : 0) | (query.emitDistinctChangesOnly ? 4 : 0);
}
function convertAttributesToExpressions(attributes) {
  const values = [];
  for (let key of Object.getOwnPropertyNames(attributes)) {
    const value = attributes[key];
    values.push(literal(key), value);
  }
  return values;
}
function createContentQueriesFunction(queries, constantPool, name) {
  const createStatements = [];
  const updateStatements = [];
  const tempAllocator = temporaryAllocator(updateStatements, TEMPORARY_NAME);
  for (const query of queries) {
    createStatements.push(importExpr(Identifiers.contentQuery).callFn([variable("dirIndex"), ...prepareQueryParams(query, constantPool)]).toStmt());
    const temporary = tempAllocator();
    const getQueryList = importExpr(Identifiers.loadQuery).callFn([]);
    const refresh = importExpr(Identifiers.queryRefresh).callFn([temporary.set(getQueryList)]);
    const updateDirective = variable(CONTEXT_NAME).prop(query.propertyName).set(query.first ? temporary.prop("first") : temporary);
    updateStatements.push(refresh.and(updateDirective).toStmt());
  }
  const contentQueriesFnName = name ? `${name}_ContentQueries` : null;
  return fn([
    new FnParam(RENDER_FLAGS, NUMBER_TYPE),
    new FnParam(CONTEXT_NAME, null),
    new FnParam("dirIndex", null)
  ], [
    renderFlagCheckIfStmt(1, createStatements),
    renderFlagCheckIfStmt(2, updateStatements)
  ], INFERRED_TYPE, null, contentQueriesFnName);
}
function stringAsType(str) {
  return expressionType(literal(str));
}
function stringMapAsLiteralExpression(map) {
  const mapValues = Object.keys(map).map((key) => {
    const value = Array.isArray(map[key]) ? map[key][0] : map[key];
    return {
      key,
      value: literal(value),
      quoted: true
    };
  });
  return literalMap(mapValues);
}
function stringArrayAsType(arr) {
  return arr.length > 0 ? expressionType(literalArr(arr.map((value) => literal(value)))) : NONE_TYPE;
}
function createBaseDirectiveTypeParams(meta) {
  const selectorForType = meta.selector !== null ? meta.selector.replace(/\n/g, "") : null;
  return [
    typeWithParameters(meta.type.type, meta.typeArgumentCount),
    selectorForType !== null ? stringAsType(selectorForType) : NONE_TYPE,
    meta.exportAs !== null ? stringArrayAsType(meta.exportAs) : NONE_TYPE,
    expressionType(getInputsTypeExpression(meta)),
    expressionType(stringMapAsLiteralExpression(meta.outputs)),
    stringArrayAsType(meta.queries.map((q) => q.propertyName))
  ];
}
function getInputsTypeExpression(meta) {
  return literalMap(Object.keys(meta.inputs).map((key) => {
    const value = meta.inputs[key];
    return {
      key,
      value: literalMap([
        { key: "alias", value: literal(value.bindingPropertyName), quoted: true },
        { key: "required", value: literal(value.required), quoted: true }
      ]),
      quoted: true
    };
  }));
}
function createDirectiveType(meta) {
  const typeParams = createBaseDirectiveTypeParams(meta);
  typeParams.push(NONE_TYPE);
  typeParams.push(expressionType(literal(meta.isStandalone)));
  typeParams.push(createHostDirectivesType(meta));
  if (meta.isSignal) {
    typeParams.push(expressionType(literal(meta.isSignal)));
  }
  return expressionType(importExpr(Identifiers.DirectiveDeclaration, typeParams));
}
function createViewQueriesFunction(viewQueries, constantPool, name) {
  const createStatements = [];
  const updateStatements = [];
  const tempAllocator = temporaryAllocator(updateStatements, TEMPORARY_NAME);
  viewQueries.forEach((query) => {
    const queryDefinition = importExpr(Identifiers.viewQuery).callFn(prepareQueryParams(query, constantPool));
    createStatements.push(queryDefinition.toStmt());
    const temporary = tempAllocator();
    const getQueryList = importExpr(Identifiers.loadQuery).callFn([]);
    const refresh = importExpr(Identifiers.queryRefresh).callFn([temporary.set(getQueryList)]);
    const updateDirective = variable(CONTEXT_NAME).prop(query.propertyName).set(query.first ? temporary.prop("first") : temporary);
    updateStatements.push(refresh.and(updateDirective).toStmt());
  });
  const viewQueryFnName = name ? `${name}_Query` : null;
  return fn([new FnParam(RENDER_FLAGS, NUMBER_TYPE), new FnParam(CONTEXT_NAME, null)], [
    renderFlagCheckIfStmt(1, createStatements),
    renderFlagCheckIfStmt(2, updateStatements)
  ], INFERRED_TYPE, null, viewQueryFnName);
}
function createHostBindingsFunction(hostBindingsMetadata, typeSourceSpan, bindingParser, constantPool, selector, name, definitionMap) {
  const bindings = bindingParser.createBoundHostProperties(hostBindingsMetadata.properties, typeSourceSpan);
  const eventBindings = bindingParser.createDirectiveHostEventAsts(hostBindingsMetadata.listeners, typeSourceSpan);
  if (USE_TEMPLATE_PIPELINE) {
    const hostJob = ingestHostBinding({
      componentName: name,
      properties: bindings,
      events: eventBindings
    }, bindingParser, constantPool);
    transformHostBinding(hostJob);
    const varCount = hostJob.root.vars;
    if (varCount !== null && varCount > 0) {
      definitionMap.set("hostVars", literal(varCount));
    }
    return emitHostBindingFunction(hostJob);
  }
  const bindingContext = variable(CONTEXT_NAME);
  const styleBuilder = new StylingBuilder(bindingContext);
  const { styleAttr, classAttr } = hostBindingsMetadata.specialAttributes;
  if (styleAttr !== void 0) {
    styleBuilder.registerStyleAttr(styleAttr);
  }
  if (classAttr !== void 0) {
    styleBuilder.registerClassAttr(classAttr);
  }
  const createInstructions = [];
  const updateInstructions = [];
  const updateVariables = [];
  const hostBindingSourceSpan = typeSourceSpan;
  if (eventBindings && eventBindings.length) {
    createInstructions.push(...createHostListeners(eventBindings, name));
  }
  const allOtherBindings = [];
  let totalHostVarsCount = 0;
  bindings && bindings.forEach((binding) => {
    const stylingInputWasSet = styleBuilder.registerInputBasedOnName(binding.name, binding.expression, hostBindingSourceSpan);
    if (stylingInputWasSet) {
      totalHostVarsCount += MIN_STYLING_BINDING_SLOTS_REQUIRED;
    } else {
      allOtherBindings.push(binding);
      totalHostVarsCount++;
    }
  });
  let valueConverter;
  const getValueConverter = () => {
    if (!valueConverter) {
      const hostVarsCountFn = (numSlots) => {
        const originalVarsCount = totalHostVarsCount;
        totalHostVarsCount += numSlots;
        return originalVarsCount;
      };
      valueConverter = new ValueConverter(
        constantPool,
        () => error("Unexpected node"),
        // new nodes are illegal here
        hostVarsCountFn,
        () => error("Unexpected pipe")
      );
    }
    return valueConverter;
  };
  const propertyBindings = [];
  const attributeBindings = [];
  const syntheticHostBindings = [];
  for (const binding of allOtherBindings) {
    const value = binding.expression.visit(getValueConverter());
    const bindingExpr = bindingFn(bindingContext, value);
    const { bindingName, instruction, isAttribute } = getBindingNameAndInstruction(binding);
    const securityContexts = bindingParser.calcPossibleSecurityContexts(selector, bindingName, isAttribute).filter((context) => context !== SecurityContext.NONE);
    let sanitizerFn = null;
    if (securityContexts.length) {
      if (securityContexts.length === 2 && securityContexts.indexOf(SecurityContext.URL) > -1 && securityContexts.indexOf(SecurityContext.RESOURCE_URL) > -1) {
        sanitizerFn = importExpr(Identifiers.sanitizeUrlOrResourceUrl);
      } else {
        sanitizerFn = resolveSanitizationFn(securityContexts[0], isAttribute);
      }
    }
    const instructionParams = [literal(bindingName), bindingExpr.currValExpr];
    if (sanitizerFn) {
      instructionParams.push(sanitizerFn);
    } else {
      if (isIframeSecuritySensitiveAttr(bindingName)) {
        instructionParams.push(importExpr(Identifiers.validateIframeAttribute));
      }
    }
    updateVariables.push(...bindingExpr.stmts);
    if (instruction === Identifiers.hostProperty) {
      propertyBindings.push(instructionParams);
    } else if (instruction === Identifiers.attribute) {
      attributeBindings.push(instructionParams);
    } else if (instruction === Identifiers.syntheticHostProperty) {
      syntheticHostBindings.push(instructionParams);
    } else {
      updateInstructions.push({ reference: instruction, paramsOrFn: instructionParams, span: null });
    }
  }
  for (const bindingParams of propertyBindings) {
    updateInstructions.push({ reference: Identifiers.hostProperty, paramsOrFn: bindingParams, span: null });
  }
  for (const bindingParams of attributeBindings) {
    updateInstructions.push({ reference: Identifiers.attribute, paramsOrFn: bindingParams, span: null });
  }
  for (const bindingParams of syntheticHostBindings) {
    updateInstructions.push({ reference: Identifiers.syntheticHostProperty, paramsOrFn: bindingParams, span: null });
  }
  const hostAttrs = convertAttributesToExpressions(hostBindingsMetadata.attributes);
  styleBuilder.assignHostAttrs(hostAttrs, definitionMap);
  if (styleBuilder.hasBindings) {
    styleBuilder.buildUpdateLevelInstructions(getValueConverter()).forEach((instruction) => {
      for (const call2 of instruction.calls) {
        totalHostVarsCount += Math.max(call2.allocateBindingSlots - MIN_STYLING_BINDING_SLOTS_REQUIRED, 0);
        updateInstructions.push({
          reference: instruction.reference,
          paramsOrFn: convertStylingCall(call2, bindingContext, bindingFn),
          span: null
        });
      }
    });
  }
  if (totalHostVarsCount) {
    definitionMap.set("hostVars", literal(totalHostVarsCount));
  }
  if (createInstructions.length > 0 || updateInstructions.length > 0) {
    const hostBindingsFnName = name ? `${name}_HostBindings` : null;
    const statements = [];
    if (createInstructions.length > 0) {
      statements.push(renderFlagCheckIfStmt(1, getInstructionStatements(createInstructions)));
    }
    if (updateInstructions.length > 0) {
      statements.push(renderFlagCheckIfStmt(2, updateVariables.concat(getInstructionStatements(updateInstructions))));
    }
    return fn([new FnParam(RENDER_FLAGS, NUMBER_TYPE), new FnParam(CONTEXT_NAME, null)], statements, INFERRED_TYPE, null, hostBindingsFnName);
  }
  return null;
}
function bindingFn(implicit, value) {
  return convertPropertyBinding(null, implicit, value, "b");
}
function convertStylingCall(call2, bindingContext, bindingFn2) {
  return call2.params((value) => bindingFn2(bindingContext, value).currValExpr);
}
function getBindingNameAndInstruction(binding) {
  let bindingName = binding.name;
  let instruction;
  const attrMatches = bindingName.match(ATTR_REGEX);
  if (attrMatches) {
    bindingName = attrMatches[1];
    instruction = Identifiers.attribute;
  } else {
    if (binding.isAnimation) {
      bindingName = prepareSyntheticPropertyName(bindingName);
      instruction = Identifiers.syntheticHostProperty;
    } else {
      instruction = Identifiers.hostProperty;
    }
  }
  return { bindingName, instruction, isAttribute: !!attrMatches };
}
function createHostListeners(eventBindings, name) {
  const listenerParams = [];
  const syntheticListenerParams = [];
  const instructions = [];
  for (const binding of eventBindings) {
    let bindingName = binding.name && sanitizeIdentifier(binding.name);
    const bindingFnName = binding.type === 1 ? prepareSyntheticListenerFunctionName(bindingName, binding.targetOrPhase) : bindingName;
    const handlerName = name && bindingName ? `${name}_${bindingFnName}_HostBindingHandler` : null;
    const params = prepareEventListenerParameters(BoundEvent.fromParsedEvent(binding), handlerName);
    if (binding.type == 1) {
      syntheticListenerParams.push(params);
    } else {
      listenerParams.push(params);
    }
  }
  for (const params of syntheticListenerParams) {
    instructions.push({ reference: Identifiers.syntheticHostListener, paramsOrFn: params, span: null });
  }
  for (const params of listenerParams) {
    instructions.push({ reference: Identifiers.listener, paramsOrFn: params, span: null });
  }
  return instructions;
}
var HOST_REG_EXP = /^(?:\[([^\]]+)\])|(?:\(([^\)]+)\))$/;
function parseHostBindings(host) {
  const attributes = {};
  const listeners = {};
  const properties = {};
  const specialAttributes = {};
  for (const key of Object.keys(host)) {
    const value = host[key];
    const matches = key.match(HOST_REG_EXP);
    if (matches === null) {
      switch (key) {
        case "class":
          if (typeof value !== "string") {
            throw new Error(`Class binding must be string`);
          }
          specialAttributes.classAttr = value;
          break;
        case "style":
          if (typeof value !== "string") {
            throw new Error(`Style binding must be string`);
          }
          specialAttributes.styleAttr = value;
          break;
        default:
          if (typeof value === "string") {
            attributes[key] = literal(value);
          } else {
            attributes[key] = value;
          }
      }
    } else if (matches[
      1
      /* HostBindingGroup.Binding */
    ] != null) {
      if (typeof value !== "string") {
        throw new Error(`Property binding must be string`);
      }
      properties[matches[
        1
        /* HostBindingGroup.Binding */
      ]] = value;
    } else if (matches[
      2
      /* HostBindingGroup.Event */
    ] != null) {
      if (typeof value !== "string") {
        throw new Error(`Event binding must be string`);
      }
      listeners[matches[
        2
        /* HostBindingGroup.Event */
      ]] = value;
    }
  }
  return { attributes, listeners, properties, specialAttributes };
}
function verifyHostBindings(bindings, sourceSpan) {
  const bindingParser = makeBindingParser();
  bindingParser.createDirectiveHostEventAsts(bindings.listeners, sourceSpan);
  bindingParser.createBoundHostProperties(bindings.properties, sourceSpan);
  return bindingParser.errors;
}
function compileStyles(styles, selector, hostSelector) {
  const shadowCss = new ShadowCss();
  return styles.map((style) => {
    return shadowCss.shimCssText(style, selector, hostSelector);
  });
}
function createHostDirectivesType(meta) {
  if (!meta.hostDirectives?.length) {
    return NONE_TYPE;
  }
  return expressionType(literalArr(meta.hostDirectives.map((hostMeta) => literalMap([
    { key: "directive", value: typeofExpr(hostMeta.directive.type), quoted: false },
    { key: "inputs", value: stringMapAsLiteralExpression(hostMeta.inputs || {}), quoted: false },
    { key: "outputs", value: stringMapAsLiteralExpression(hostMeta.outputs || {}), quoted: false }
  ]))));
}
function createHostDirectivesFeatureArg(hostDirectives) {
  const expressions = [];
  let hasForwardRef = false;
  for (const current of hostDirectives) {
    if (!current.inputs && !current.outputs) {
      expressions.push(current.directive.type);
    } else {
      const keys = [{ key: "directive", value: current.directive.type, quoted: false }];
      if (current.inputs) {
        const inputsLiteral = createHostDirectivesMappingArray(current.inputs);
        if (inputsLiteral) {
          keys.push({ key: "inputs", value: inputsLiteral, quoted: false });
        }
      }
      if (current.outputs) {
        const outputsLiteral = createHostDirectivesMappingArray(current.outputs);
        if (outputsLiteral) {
          keys.push({ key: "outputs", value: outputsLiteral, quoted: false });
        }
      }
      expressions.push(literalMap(keys));
    }
    if (current.isForwardReference) {
      hasForwardRef = true;
    }
  }
  return hasForwardRef ? new FunctionExpr([], [new ReturnStatement(literalArr(expressions))]) : literalArr(expressions);
}
function createHostDirectivesMappingArray(mapping) {
  const elements = [];
  for (const publicName in mapping) {
    if (mapping.hasOwnProperty(publicName)) {
      elements.push(literal(publicName), literal(mapping[publicName]));
    }
  }
  return elements.length > 0 ? literalArr(elements) : null;
}
var ResourceLoader = class {
};
var enabledBlockTypes;
var CompilerFacadeImpl = class {
  constructor(jitEvaluator = new JitEvaluator()) {
    this.jitEvaluator = jitEvaluator;
    this.FactoryTarget = FactoryTarget$1;
    this.ResourceLoader = ResourceLoader;
    this.elementSchemaRegistry = new DomElementSchemaRegistry();
  }
  compilePipe(angularCoreEnv, sourceMapUrl, facade) {
    const metadata = {
      name: facade.name,
      type: wrapReference(facade.type),
      typeArgumentCount: 0,
      deps: null,
      pipeName: facade.pipeName,
      pure: facade.pure,
      isStandalone: facade.isStandalone
    };
    const res = compilePipeFromMetadata(metadata);
    return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
  }
  compilePipeDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
    const meta = convertDeclarePipeFacadeToMetadata(declaration);
    const res = compilePipeFromMetadata(meta);
    return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
  }
  compileInjectable(angularCoreEnv, sourceMapUrl, facade) {
    const { expression, statements } = compileInjectable(
      {
        name: facade.name,
        type: wrapReference(facade.type),
        typeArgumentCount: facade.typeArgumentCount,
        providedIn: computeProvidedIn(facade.providedIn),
        useClass: convertToProviderExpression(facade, "useClass"),
        useFactory: wrapExpression(facade, "useFactory"),
        useValue: convertToProviderExpression(facade, "useValue"),
        useExisting: convertToProviderExpression(facade, "useExisting"),
        deps: facade.deps?.map(convertR3DependencyMetadata)
      },
      /* resolveForwardRefs */
      true
    );
    return this.jitExpression(expression, angularCoreEnv, sourceMapUrl, statements);
  }
  compileInjectableDeclaration(angularCoreEnv, sourceMapUrl, facade) {
    const { expression, statements } = compileInjectable(
      {
        name: facade.type.name,
        type: wrapReference(facade.type),
        typeArgumentCount: 0,
        providedIn: computeProvidedIn(facade.providedIn),
        useClass: convertToProviderExpression(facade, "useClass"),
        useFactory: wrapExpression(facade, "useFactory"),
        useValue: convertToProviderExpression(facade, "useValue"),
        useExisting: convertToProviderExpression(facade, "useExisting"),
        deps: facade.deps?.map(convertR3DeclareDependencyMetadata)
      },
      /* resolveForwardRefs */
      true
    );
    return this.jitExpression(expression, angularCoreEnv, sourceMapUrl, statements);
  }
  compileInjector(angularCoreEnv, sourceMapUrl, facade) {
    const meta = {
      name: facade.name,
      type: wrapReference(facade.type),
      providers: facade.providers && facade.providers.length > 0 ? new WrappedNodeExpr(facade.providers) : null,
      imports: facade.imports.map((i) => new WrappedNodeExpr(i))
    };
    const res = compileInjector(meta);
    return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
  }
  compileInjectorDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
    const meta = convertDeclareInjectorFacadeToMetadata(declaration);
    const res = compileInjector(meta);
    return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
  }
  compileNgModule(angularCoreEnv, sourceMapUrl, facade) {
    const meta = {
      kind: R3NgModuleMetadataKind.Global,
      type: wrapReference(facade.type),
      bootstrap: facade.bootstrap.map(wrapReference),
      declarations: facade.declarations.map(wrapReference),
      publicDeclarationTypes: null,
      imports: facade.imports.map(wrapReference),
      includeImportTypes: true,
      exports: facade.exports.map(wrapReference),
      selectorScopeMode: R3SelectorScopeMode.Inline,
      containsForwardDecls: false,
      schemas: facade.schemas ? facade.schemas.map(wrapReference) : null,
      id: facade.id ? new WrappedNodeExpr(facade.id) : null
    };
    const res = compileNgModule(meta);
    return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, []);
  }
  compileNgModuleDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
    const expression = compileNgModuleDeclarationExpression(declaration);
    return this.jitExpression(expression, angularCoreEnv, sourceMapUrl, []);
  }
  compileDirective(angularCoreEnv, sourceMapUrl, facade) {
    const meta = convertDirectiveFacadeToMetadata(facade);
    return this.compileDirectiveFromMeta(angularCoreEnv, sourceMapUrl, meta);
  }
  compileDirectiveDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
    const typeSourceSpan = this.createParseSourceSpan("Directive", declaration.type.name, sourceMapUrl);
    const meta = convertDeclareDirectiveFacadeToMetadata(declaration, typeSourceSpan);
    return this.compileDirectiveFromMeta(angularCoreEnv, sourceMapUrl, meta);
  }
  compileDirectiveFromMeta(angularCoreEnv, sourceMapUrl, meta) {
    const constantPool = new ConstantPool();
    const bindingParser = makeBindingParser();
    const res = compileDirectiveFromMetadata(meta, constantPool, bindingParser);
    return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, constantPool.statements);
  }
  compileComponent(angularCoreEnv, sourceMapUrl, facade) {
    const { template: template2, interpolation } = parseJitTemplate(facade.template, facade.name, sourceMapUrl, facade.preserveWhitespaces, facade.interpolation);
    const meta = __spreadProps(__spreadValues(__spreadValues({}, facade), convertDirectiveFacadeToMetadata(facade)), {
      selector: facade.selector || this.elementSchemaRegistry.getDefaultComponentElementName(),
      template: template2,
      declarations: facade.declarations.map(convertDeclarationFacadeToMetadata),
      declarationListEmitMode: 0,
      // TODO: leaving empty in JIT mode for now,
      // to be implemented as one of the next steps.
      deferBlocks: /* @__PURE__ */ new Map(),
      deferrableDeclToImportDecl: /* @__PURE__ */ new Map(),
      styles: [...facade.styles, ...template2.styles],
      encapsulation: facade.encapsulation,
      interpolation,
      changeDetection: facade.changeDetection,
      animations: facade.animations != null ? new WrappedNodeExpr(facade.animations) : null,
      viewProviders: facade.viewProviders != null ? new WrappedNodeExpr(facade.viewProviders) : null,
      relativeContextFilePath: "",
      i18nUseExternalIds: true
    });
    const jitExpressionSourceMap = `ng:///${facade.name}.js`;
    return this.compileComponentFromMeta(angularCoreEnv, jitExpressionSourceMap, meta);
  }
  compileComponentDeclaration(angularCoreEnv, sourceMapUrl, declaration) {
    const typeSourceSpan = this.createParseSourceSpan("Component", declaration.type.name, sourceMapUrl);
    const meta = convertDeclareComponentFacadeToMetadata(declaration, typeSourceSpan, sourceMapUrl);
    return this.compileComponentFromMeta(angularCoreEnv, sourceMapUrl, meta);
  }
  compileComponentFromMeta(angularCoreEnv, sourceMapUrl, meta) {
    const constantPool = new ConstantPool();
    const bindingParser = makeBindingParser(meta.interpolation);
    const res = compileComponentFromMetadata(meta, constantPool, bindingParser);
    return this.jitExpression(res.expression, angularCoreEnv, sourceMapUrl, constantPool.statements);
  }
  compileFactory(angularCoreEnv, sourceMapUrl, meta) {
    const factoryRes = compileFactoryFunction({
      name: meta.name,
      type: wrapReference(meta.type),
      typeArgumentCount: meta.typeArgumentCount,
      deps: convertR3DependencyMetadataArray(meta.deps),
      target: meta.target
    });
    return this.jitExpression(factoryRes.expression, angularCoreEnv, sourceMapUrl, factoryRes.statements);
  }
  compileFactoryDeclaration(angularCoreEnv, sourceMapUrl, meta) {
    const factoryRes = compileFactoryFunction({
      name: meta.type.name,
      type: wrapReference(meta.type),
      typeArgumentCount: 0,
      deps: Array.isArray(meta.deps) ? meta.deps.map(convertR3DeclareDependencyMetadata) : meta.deps,
      target: meta.target
    });
    return this.jitExpression(factoryRes.expression, angularCoreEnv, sourceMapUrl, factoryRes.statements);
  }
  createParseSourceSpan(kind, typeName, sourceUrl) {
    return r3JitTypeSourceSpan(kind, typeName, sourceUrl);
  }
  /**
   * JIT compiles an expression and returns the result of executing that expression.
   *
   * @param def the definition which will be compiled and executed to get the value to patch
   * @param context an object map of @angular/core symbol names to symbols which will be available
   * in the context of the compiled expression
   * @param sourceUrl a URL to use for the source map of the compiled expression
   * @param preStatements a collection of statements that should be evaluated before the expression.
   */
  jitExpression(def, context, sourceUrl, preStatements) {
    const statements = [
      ...preStatements,
      new DeclareVarStmt("$def", def, void 0, StmtModifier.Exported)
    ];
    const res = this.jitEvaluator.evaluateStatements(
      sourceUrl,
      statements,
      new R3JitReflector(context),
      /* enableSourceMaps */
      true
    );
    return res["$def"];
  }
};
function convertToR3QueryMetadata(facade) {
  return __spreadProps(__spreadValues({}, facade), {
    predicate: convertQueryPredicate(facade.predicate),
    read: facade.read ? new WrappedNodeExpr(facade.read) : null,
    static: facade.static,
    emitDistinctChangesOnly: facade.emitDistinctChangesOnly
  });
}
function convertQueryDeclarationToMetadata(declaration) {
  return {
    propertyName: declaration.propertyName,
    first: declaration.first ?? false,
    predicate: convertQueryPredicate(declaration.predicate),
    descendants: declaration.descendants ?? false,
    read: declaration.read ? new WrappedNodeExpr(declaration.read) : null,
    static: declaration.static ?? false,
    emitDistinctChangesOnly: declaration.emitDistinctChangesOnly ?? true
  };
}
function convertQueryPredicate(predicate) {
  return Array.isArray(predicate) ? (
    // The predicate is an array of strings so pass it through.
    predicate
  ) : (
    // The predicate is a type - assume that we will need to unwrap any `forwardRef()` calls.
    createMayBeForwardRefExpression(
      new WrappedNodeExpr(predicate),
      1
      /* ForwardRefHandling.Wrapped */
    )
  );
}
function convertDirectiveFacadeToMetadata(facade) {
  const inputsFromMetadata = parseInputsArray(facade.inputs || []);
  const outputsFromMetadata = parseMappingStringArray(facade.outputs || []);
  const propMetadata = facade.propMetadata;
  const inputsFromType = {};
  const outputsFromType = {};
  for (const field in propMetadata) {
    if (propMetadata.hasOwnProperty(field)) {
      propMetadata[field].forEach((ann) => {
        if (isInput(ann)) {
          inputsFromType[field] = {
            bindingPropertyName: ann.alias || field,
            classPropertyName: field,
            required: ann.required || false,
            transformFunction: ann.transform != null ? new WrappedNodeExpr(ann.transform) : null
          };
        } else if (isOutput(ann)) {
          outputsFromType[field] = ann.alias || field;
        }
      });
    }
  }
  return __spreadProps(__spreadValues({}, facade), {
    typeArgumentCount: 0,
    typeSourceSpan: facade.typeSourceSpan,
    type: wrapReference(facade.type),
    deps: null,
    host: extractHostBindings(facade.propMetadata, facade.typeSourceSpan, facade.host),
    inputs: __spreadValues(__spreadValues({}, inputsFromMetadata), inputsFromType),
    outputs: __spreadValues(__spreadValues({}, outputsFromMetadata), outputsFromType),
    queries: facade.queries.map(convertToR3QueryMetadata),
    providers: facade.providers != null ? new WrappedNodeExpr(facade.providers) : null,
    viewQueries: facade.viewQueries.map(convertToR3QueryMetadata),
    fullInheritance: false,
    hostDirectives: convertHostDirectivesToMetadata(facade)
  });
}
function convertDeclareDirectiveFacadeToMetadata(declaration, typeSourceSpan) {
  return {
    name: declaration.type.name,
    type: wrapReference(declaration.type),
    typeSourceSpan,
    selector: declaration.selector ?? null,
    inputs: declaration.inputs ? inputsMappingToInputMetadata(declaration.inputs) : {},
    outputs: declaration.outputs ?? {},
    host: convertHostDeclarationToMetadata(declaration.host),
    queries: (declaration.queries ?? []).map(convertQueryDeclarationToMetadata),
    viewQueries: (declaration.viewQueries ?? []).map(convertQueryDeclarationToMetadata),
    providers: declaration.providers !== void 0 ? new WrappedNodeExpr(declaration.providers) : null,
    exportAs: declaration.exportAs ?? null,
    usesInheritance: declaration.usesInheritance ?? false,
    lifecycle: { usesOnChanges: declaration.usesOnChanges ?? false },
    deps: null,
    typeArgumentCount: 0,
    fullInheritance: false,
    isStandalone: declaration.isStandalone ?? false,
    isSignal: declaration.isSignal ?? false,
    hostDirectives: convertHostDirectivesToMetadata(declaration)
  };
}
function convertHostDeclarationToMetadata(host = {}) {
  return {
    attributes: convertOpaqueValuesToExpressions(host.attributes ?? {}),
    listeners: host.listeners ?? {},
    properties: host.properties ?? {},
    specialAttributes: {
      classAttr: host.classAttribute,
      styleAttr: host.styleAttribute
    }
  };
}
function convertHostDirectivesToMetadata(metadata) {
  if (metadata.hostDirectives?.length) {
    return metadata.hostDirectives.map((hostDirective) => {
      return typeof hostDirective === "function" ? {
        directive: wrapReference(hostDirective),
        inputs: null,
        outputs: null,
        isForwardReference: false
      } : {
        directive: wrapReference(hostDirective.directive),
        isForwardReference: false,
        inputs: hostDirective.inputs ? parseMappingStringArray(hostDirective.inputs) : null,
        outputs: hostDirective.outputs ? parseMappingStringArray(hostDirective.outputs) : null
      };
    });
  }
  return null;
}
function convertOpaqueValuesToExpressions(obj) {
  const result = {};
  for (const key of Object.keys(obj)) {
    result[key] = new WrappedNodeExpr(obj[key]);
  }
  return result;
}
function convertDeclareComponentFacadeToMetadata(decl, typeSourceSpan, sourceMapUrl) {
  const { template: template2, interpolation } = parseJitTemplate(decl.template, decl.type.name, sourceMapUrl, decl.preserveWhitespaces ?? false, decl.interpolation);
  const declarations = [];
  if (decl.dependencies) {
    for (const innerDep of decl.dependencies) {
      switch (innerDep.kind) {
        case "directive":
        case "component":
          declarations.push(convertDirectiveDeclarationToMetadata(innerDep));
          break;
        case "pipe":
          declarations.push(convertPipeDeclarationToMetadata(innerDep));
          break;
      }
    }
  } else if (decl.components || decl.directives || decl.pipes) {
    decl.components && declarations.push(...decl.components.map((dir) => convertDirectiveDeclarationToMetadata(
      dir,
      /* isComponent */
      true
    )));
    decl.directives && declarations.push(...decl.directives.map((dir) => convertDirectiveDeclarationToMetadata(dir)));
    decl.pipes && declarations.push(...convertPipeMapToMetadata(decl.pipes));
  }
  return __spreadProps(__spreadValues({}, convertDeclareDirectiveFacadeToMetadata(decl, typeSourceSpan)), {
    template: template2,
    styles: decl.styles ?? [],
    declarations,
    viewProviders: decl.viewProviders !== void 0 ? new WrappedNodeExpr(decl.viewProviders) : null,
    animations: decl.animations !== void 0 ? new WrappedNodeExpr(decl.animations) : null,
    // TODO: leaving empty in JIT mode for now,
    // to be implemented as one of the next steps.
    deferBlocks: /* @__PURE__ */ new Map(),
    deferrableDeclToImportDecl: /* @__PURE__ */ new Map(),
    changeDetection: decl.changeDetection ?? ChangeDetectionStrategy.Default,
    encapsulation: decl.encapsulation ?? ViewEncapsulation.Emulated,
    interpolation,
    declarationListEmitMode: 2,
    relativeContextFilePath: "",
    i18nUseExternalIds: true
  });
}
function convertDeclarationFacadeToMetadata(declaration) {
  return __spreadProps(__spreadValues({}, declaration), {
    type: new WrappedNodeExpr(declaration.type)
  });
}
function convertDirectiveDeclarationToMetadata(declaration, isComponent = null) {
  return {
    kind: R3TemplateDependencyKind.Directive,
    isComponent: isComponent || declaration.kind === "component",
    selector: declaration.selector,
    type: new WrappedNodeExpr(declaration.type),
    inputs: declaration.inputs ?? [],
    outputs: declaration.outputs ?? [],
    exportAs: declaration.exportAs ?? null
  };
}
function convertPipeMapToMetadata(pipes) {
  if (!pipes) {
    return [];
  }
  return Object.keys(pipes).map((name) => {
    return {
      kind: R3TemplateDependencyKind.Pipe,
      name,
      type: new WrappedNodeExpr(pipes[name])
    };
  });
}
function convertPipeDeclarationToMetadata(pipe2) {
  return {
    kind: R3TemplateDependencyKind.Pipe,
    name: pipe2.name,
    type: new WrappedNodeExpr(pipe2.type)
  };
}
function parseJitTemplate(template2, typeName, sourceMapUrl, preserveWhitespaces, interpolation) {
  const interpolationConfig = interpolation ? InterpolationConfig.fromArray(interpolation) : DEFAULT_INTERPOLATION_CONFIG;
  const parsed = parseTemplate(template2, sourceMapUrl, { preserveWhitespaces, interpolationConfig, enabledBlockTypes });
  if (parsed.errors !== null) {
    const errors = parsed.errors.map((err) => err.toString()).join(", ");
    throw new Error(`Errors during JIT compilation of template for ${typeName}: ${errors}`);
  }
  return { template: parsed, interpolation: interpolationConfig };
}
function convertToProviderExpression(obj, property2) {
  if (obj.hasOwnProperty(property2)) {
    return createMayBeForwardRefExpression(
      new WrappedNodeExpr(obj[property2]),
      0
      /* ForwardRefHandling.None */
    );
  } else {
    return void 0;
  }
}
function wrapExpression(obj, property2) {
  if (obj.hasOwnProperty(property2)) {
    return new WrappedNodeExpr(obj[property2]);
  } else {
    return void 0;
  }
}
function computeProvidedIn(providedIn) {
  const expression = typeof providedIn === "function" ? new WrappedNodeExpr(providedIn) : new LiteralExpr(providedIn ?? null);
  return createMayBeForwardRefExpression(
    expression,
    0
    /* ForwardRefHandling.None */
  );
}
function convertR3DependencyMetadataArray(facades) {
  return facades == null ? null : facades.map(convertR3DependencyMetadata);
}
function convertR3DependencyMetadata(facade) {
  const isAttributeDep = facade.attribute != null;
  const rawToken = facade.token === null ? null : new WrappedNodeExpr(facade.token);
  const token = isAttributeDep ? new WrappedNodeExpr(facade.attribute) : rawToken;
  return createR3DependencyMetadata(token, isAttributeDep, facade.host, facade.optional, facade.self, facade.skipSelf);
}
function convertR3DeclareDependencyMetadata(facade) {
  const isAttributeDep = facade.attribute ?? false;
  const token = facade.token === null ? null : new WrappedNodeExpr(facade.token);
  return createR3DependencyMetadata(token, isAttributeDep, facade.host ?? false, facade.optional ?? false, facade.self ?? false, facade.skipSelf ?? false);
}
function createR3DependencyMetadata(token, isAttributeDep, host, optional, self, skipSelf) {
  const attributeNameType = isAttributeDep ? literal("unknown") : null;
  return { token, attributeNameType, host, optional, self, skipSelf };
}
function extractHostBindings(propMetadata, sourceSpan, host) {
  const bindings = parseHostBindings(host || {});
  const errors = verifyHostBindings(bindings, sourceSpan);
  if (errors.length) {
    throw new Error(errors.map((error2) => error2.msg).join("\n"));
  }
  for (const field in propMetadata) {
    if (propMetadata.hasOwnProperty(field)) {
      propMetadata[field].forEach((ann) => {
        if (isHostBinding(ann)) {
          bindings.properties[ann.hostPropertyName || field] = getSafePropertyAccessString("this", field);
        } else if (isHostListener(ann)) {
          bindings.listeners[ann.eventName || field] = `${field}(${(ann.args || []).join(",")})`;
        }
      });
    }
  }
  return bindings;
}
function isHostBinding(value) {
  return value.ngMetadataName === "HostBinding";
}
function isHostListener(value) {
  return value.ngMetadataName === "HostListener";
}
function isInput(value) {
  return value.ngMetadataName === "Input";
}
function isOutput(value) {
  return value.ngMetadataName === "Output";
}
function inputsMappingToInputMetadata(inputs) {
  return Object.keys(inputs).reduce((result, key) => {
    const value = inputs[key];
    if (typeof value === "string") {
      result[key] = {
        bindingPropertyName: value,
        classPropertyName: value,
        transformFunction: null,
        required: false
      };
    } else {
      result[key] = {
        bindingPropertyName: value[0],
        classPropertyName: value[1],
        transformFunction: value[2] ? new WrappedNodeExpr(value[2]) : null,
        required: false
      };
    }
    return result;
  }, {});
}
function parseInputsArray(values) {
  return values.reduce((results, value) => {
    if (typeof value === "string") {
      const [bindingPropertyName, classPropertyName] = parseMappingString(value);
      results[classPropertyName] = {
        bindingPropertyName,
        classPropertyName,
        required: false,
        transformFunction: null
      };
    } else {
      results[value.name] = {
        bindingPropertyName: value.alias || value.name,
        classPropertyName: value.name,
        required: value.required || false,
        transformFunction: value.transform != null ? new WrappedNodeExpr(value.transform) : null
      };
    }
    return results;
  }, {});
}
function parseMappingStringArray(values) {
  return values.reduce((results, value) => {
    const [alias, fieldName] = parseMappingString(value);
    results[fieldName] = alias;
    return results;
  }, {});
}
function parseMappingString(value) {
  const [fieldName, bindingPropertyName] = value.split(":", 2).map((str) => str.trim());
  return [bindingPropertyName ?? fieldName, fieldName];
}
function convertDeclarePipeFacadeToMetadata(declaration) {
  return {
    name: declaration.type.name,
    type: wrapReference(declaration.type),
    typeArgumentCount: 0,
    pipeName: declaration.name,
    deps: null,
    pure: declaration.pure ?? true,
    isStandalone: declaration.isStandalone ?? false
  };
}
function convertDeclareInjectorFacadeToMetadata(declaration) {
  return {
    name: declaration.type.name,
    type: wrapReference(declaration.type),
    providers: declaration.providers !== void 0 && declaration.providers.length > 0 ? new WrappedNodeExpr(declaration.providers) : null,
    imports: declaration.imports !== void 0 ? declaration.imports.map((i) => new WrappedNodeExpr(i)) : []
  };
}
function publishFacade(global) {
  const ng = global.ng || (global.ng = {});
  ng.\u0275compilerFacade = new CompilerFacadeImpl();
}
var VERSION = new Version("16.2.12");
var CompilerConfig = class {
  constructor({ defaultEncapsulation = ViewEncapsulation.Emulated, useJit = true, missingTranslation = null, preserveWhitespaces, strictInjectionParameters } = {}) {
    this.defaultEncapsulation = defaultEncapsulation;
    this.useJit = !!useJit;
    this.missingTranslation = missingTranslation;
    this.preserveWhitespaces = preserveWhitespacesDefault(noUndefined(preserveWhitespaces));
    this.strictInjectionParameters = strictInjectionParameters === true;
  }
};
function preserveWhitespacesDefault(preserveWhitespacesOption, defaultSetting = false) {
  return preserveWhitespacesOption === null ? defaultSetting : preserveWhitespacesOption;
}
var _VisitorMode;
(function(_VisitorMode2) {
  _VisitorMode2[_VisitorMode2["Extract"] = 0] = "Extract";
  _VisitorMode2[_VisitorMode2["Merge"] = 1] = "Merge";
})(_VisitorMode || (_VisitorMode = {}));
var XmlTagDefinition = class {
  constructor() {
    this.closedByParent = false;
    this.implicitNamespacePrefix = null;
    this.isVoid = false;
    this.ignoreFirstLf = false;
    this.canSelfClose = true;
    this.preventNamespaceInheritance = false;
  }
  requireExtraParent(currentParent) {
    return false;
  }
  isClosedByChild(name) {
    return false;
  }
  getContentType() {
    return TagContentType.PARSABLE_DATA;
  }
};
var _TAG_DEFINITION = new XmlTagDefinition();
var FactoryTarget;
(function(FactoryTarget2) {
  FactoryTarget2[FactoryTarget2["Directive"] = 0] = "Directive";
  FactoryTarget2[FactoryTarget2["Component"] = 1] = "Component";
  FactoryTarget2[FactoryTarget2["Injectable"] = 2] = "Injectable";
  FactoryTarget2[FactoryTarget2["Pipe"] = 3] = "Pipe";
  FactoryTarget2[FactoryTarget2["NgModule"] = 4] = "NgModule";
})(FactoryTarget || (FactoryTarget = {}));
publishFacade(_global);

export {
  __spreadValues,
  __spreadProps,
  __export,
  __async,
  ResourceLoader,
  CompilerConfig
};
/*! Bundled license information:

@angular/compiler/fesm2022/compiler.mjs:
  (**
   * @license Angular v16.2.12
   * (c) 2010-2022 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-SO6IKGEA.mjs.map
