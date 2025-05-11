"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.win = exports.mac = void 0;
/**
 * @file Unicode Platform-specific Encoding Identifiers
 * @author mengke01(kekee000@gmail.com)
 */
// mac encoding id
var mac = exports.mac = {
  'Default': 0,
  // default use
  'Version1.1': 1,
  'ISO10646': 2,
  'UnicodeBMP': 3,
  'UnicodenonBMP': 4,
  'UnicodeVariationSequences': 5,
  'FullUnicodecoverage': 6
};

// windows encoding id
var win = exports.win = {
  Symbol: 0,
  UCS2: 1,
  // default use
  ShiftJIS: 2,
  PRC: 3,
  BigFive: 4,
  Johab: 5,
  UCS4: 6
};