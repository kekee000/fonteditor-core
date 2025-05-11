"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _lang = require("../common/lang");
var _string = _interopRequireDefault(require("./util/string"));
var _pathAdjust = _interopRequireDefault(require("../graphics/pathAdjust"));
var _pathCeil = _interopRequireDefault(require("../graphics/pathCeil"));
var _computeBoundingBox = require("../graphics/computeBoundingBox");
var _compound2simpleglyf = _interopRequireDefault(require("./util/compound2simpleglyf"));
var _glyfAdjust = _interopRequireDefault(require("./util/glyfAdjust"));
var _optimizettf = _interopRequireDefault(require("./util/optimizettf"));
var _default = _interopRequireDefault(require("./data/default"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } /**
 * @file ttf相关处理对象
 * @author mengke01(kekee000@gmail.com)
 */
/**
 * 缩放到EM框
 *
 * @param {Array} glyfList glyf列表
 * @param {number} ascent 上升
 * @param {number} descent 下降
 * @param {number} ajdustToEmPadding  顶部和底部留白
 * @return {Array} glyfList
 */
function adjustToEmBox(glyfList, ascent, descent, ajdustToEmPadding) {
  glyfList.forEach(function (g) {
    if (g.contours && g.contours.length) {
      var rightSideBearing = g.advanceWidth - g.xMax;
      var bound = _computeBoundingBox.computePath.apply(void 0, _toConsumableArray(g.contours));
      var scale = (ascent - descent - ajdustToEmPadding) / bound.height;
      var center = (ascent + descent) / 2;
      var yOffset = center - (bound.y + bound.height / 2) * scale;
      g.contours.forEach(function (contour) {
        if (scale !== 1) {
          (0, _pathAdjust.default)(contour, scale, scale);
        }
        (0, _pathAdjust.default)(contour, 1, 1, 0, yOffset);
        (0, _pathCeil.default)(contour);
      });
      var box = _computeBoundingBox.computePathBox.apply(void 0, _toConsumableArray(g.contours));
      g.xMin = box.x;
      g.xMax = box.x + box.width;
      g.yMin = box.y;
      g.yMax = box.y + box.height;
      g.leftSideBearing = g.xMin;
      g.advanceWidth = g.xMax + rightSideBearing;
    }
  });
  return glyfList;
}

/**
 * 调整字形位置
 *
 * @param {Array} glyfList 字形列表
 * @param {number=} leftSideBearing 左边距
 * @param {number=} rightSideBearing 右边距
 * @param {number=} verticalAlign 垂直对齐
 *
 * @return {Array} 改变的列表
 */
function adjustPos(glyfList, leftSideBearing, rightSideBearing, verticalAlign) {
  var changed = false;

  // 左边轴
  if (null != leftSideBearing) {
    changed = true;
    glyfList.forEach(function (g) {
      if (g.leftSideBearing !== leftSideBearing) {
        (0, _glyfAdjust.default)(g, 1, 1, leftSideBearing - g.leftSideBearing);
      }
    });
  }

  // 右边轴
  if (null != rightSideBearing) {
    changed = true;
    glyfList.forEach(function (g) {
      g.advanceWidth = g.xMax + rightSideBearing;
    });
  }

  // 基线高度
  if (null != verticalAlign) {
    changed = true;
    glyfList.forEach(function (g) {
      if (g.contours && g.contours.length) {
        var bound = _computeBoundingBox.computePath.apply(void 0, _toConsumableArray(g.contours));
        var offset = verticalAlign - bound.y;
        (0, _glyfAdjust.default)(g, 1, 1, 0, offset);
      }
    });
  }
  return changed ? glyfList : [];
}

/**
 * 合并两个ttfObject，此处仅合并简单字形
 *
 * @param {Object} ttf ttfObject
 * @param {Object} imported ttfObject
 * @param {Object} options 参数选项
 * @param {boolean} options.scale 是否自动缩放，默认true
 * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
 *                                     (与 options.scale 互斥)
 *
 * @return {Object} 合并后的ttfObject
 */
function merge(ttf, imported) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    scale: true
  };
  var list = imported.glyf.filter(function (g) {
    return (
      // 简单轮廓
      g.contours && g.contours.length
      // 非预定义字形
      && g.name !== '.notdef' && g.name !== '.null' && g.name !== 'nonmarkingreturn'
    );
  });

  // 调整字形以适应边界
  if (options.adjustGlyf) {
    var ascent = ttf.hhea.ascent;
    var descent = ttf.hhea.descent;
    var ajdustToEmPadding = 16;
    adjustPos(list, 16, 16);
    adjustToEmBox(list, ascent, descent, ajdustToEmPadding);
    list.forEach(function (g) {
      ttf.glyf.push(g);
    });
  }
  // 根据unitsPerEm 进行缩放
  else if (options.scale) {
    var scale = 1;

    // 调整glyf对导入的轮廓进行缩放处理
    if (imported.head.unitsPerEm && imported.head.unitsPerEm !== ttf.head.unitsPerEm) {
      scale = ttf.head.unitsPerEm / imported.head.unitsPerEm;
    }
    list.forEach(function (g) {
      (0, _glyfAdjust.default)(g, scale, scale);
      ttf.glyf.push(g);
    });
  }
  return list;
}
var TTF = exports.default = /*#__PURE__*/function () {
  /**
   * ttf读取函数
   *
   * @constructor
   * @param {Object} ttf ttf文件结构
   */
  function TTF(ttf) {
    _classCallCheck(this, TTF);
    this.ttf = ttf;
  }

  /**
   * 获取所有的字符信息
   *
   * @return {Object} 字符信息
   */
  return _createClass(TTF, [{
    key: "codes",
    value: function codes() {
      return Object.keys(this.ttf.cmap);
    }

    /**
     * 根据编码获取字形索引
     *
     * @param {string} c 字符或者字符编码
     *
     * @return {?number} 返回glyf索引号
     */
  }, {
    key: "getGlyfIndexByCode",
    value: function getGlyfIndexByCode(c) {
      var charCode = typeof c === 'number' ? c : c.codePointAt(0);
      var glyfIndex = this.ttf.cmap[charCode] || -1;
      return glyfIndex;
    }

    /**
     * 根据索引获取字形
     *
     * @param {number} glyfIndex glyf的索引
     *
     * @return {?Object} 返回glyf对象
     */
  }, {
    key: "getGlyfByIndex",
    value: function getGlyfByIndex(glyfIndex) {
      var glyfList = this.ttf.glyf;
      var glyf = glyfList[glyfIndex];
      return glyf;
    }

    /**
     * 根据编码获取字形
     *
     * @param {string} c 字符或者字符编码
     *
     * @return {?Object} 返回glyf对象
     */
  }, {
    key: "getGlyfByCode",
    value: function getGlyfByCode(c) {
      var glyfIndex = this.getGlyfIndexByCode(c);
      return this.getGlyfByIndex(glyfIndex);
    }

    /**
     * 设置ttf对象
     *
     * @param {Object} ttf ttf对象
     * @return {this}
     */
  }, {
    key: "set",
    value: function set(ttf) {
      this.ttf = ttf;
      return this;
    }

    /**
     * 获取ttf对象
     *
     * @return {ttfObject} ttf ttf对象
     */
  }, {
    key: "get",
    value: function get() {
      return this.ttf;
    }

    /**
     * 添加glyf
     *
     * @param {Object} glyf glyf对象
     *
     * @return {number} 添加的glyf
     */
  }, {
    key: "addGlyf",
    value: function addGlyf(glyf) {
      return this.insertGlyf(glyf);
    }

    /**
     * 插入glyf
     *
     * @param {Object} glyf glyf对象
     * @param {Object} insertIndex 插入的索引
     * @return {number} 添加的glyf
     */
  }, {
    key: "insertGlyf",
    value: function insertGlyf(glyf, insertIndex) {
      if (insertIndex >= 0 && insertIndex < this.ttf.glyf.length) {
        this.ttf.glyf.splice(insertIndex, 0, glyf);
      } else {
        this.ttf.glyf.push(glyf);
      }
      return [glyf];
    }

    /**
     * 合并两个ttfObject，此处仅合并简单字形
     *
     * @param {Object} imported ttfObject
     * @param {Object} options 参数选项
     * @param {boolean} options.scale 是否自动缩放
     * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
     *                                     (和 options.scale 参数互斥)
     *
     * @return {Array} 添加的glyf
     */
  }, {
    key: "mergeGlyf",
    value: function mergeGlyf(imported, options) {
      var list = merge(this.ttf, imported, options);
      return list;
    }

    /**
     * 删除指定字形
     *
     * @param {Array} indexList 索引列表
     * @return {Array} 删除的glyf
     */
  }, {
    key: "removeGlyf",
    value: function removeGlyf(indexList) {
      var glyf = this.ttf.glyf;
      var removed = [];
      for (var i = glyf.length - 1; i >= 0; i--) {
        if (indexList.indexOf(i) >= 0) {
          removed.push(glyf[i]);
          glyf.splice(i, 1);
        }
      }
      return removed;
    }

    /**
     * 设置unicode代码
     *
     * @param {string} unicode unicode代码 $E021, $22
     * @param {Array=} indexList 索引列表
     * @param {boolean} isGenerateName 是否生成name
     * @return {Array} 改变的glyf
     */
  }, {
    key: "setUnicode",
    value: function setUnicode(unicode, indexList, isGenerateName) {
      var glyf = this.ttf.glyf;
      var list = [];
      if (indexList && indexList.length) {
        var first = indexList.indexOf(0);
        if (first >= 0) {
          indexList.splice(first, 1);
        }
        list = indexList.map(function (item) {
          return glyf[item];
        });
      } else {
        list = glyf.slice(1);
      }

      // 需要选出 unicode >32 的glyf
      if (list.length > 1) {
        var less32 = function less32(u) {
          return u < 33;
        };
        list = list.filter(function (g) {
          return !g.unicode || !g.unicode.some(less32);
        });
      }
      if (list.length) {
        unicode = Number('0x' + unicode.slice(1));
        list.forEach(function (g) {
          // 空格有可能会放入 nonmarkingreturn 因此不做编码
          if (unicode === 0xA0 || unicode === 0x3000) {
            unicode++;
          }
          g.unicode = [unicode];
          if (isGenerateName) {
            g.name = _string.default.getUnicodeName(unicode);
          }
          unicode++;
        });
      }
      return list;
    }

    /**
     * 生成字形名称
     *
     * @param {Array=} indexList 索引列表
     * @return {Array} 改变的glyf
     */
  }, {
    key: "genGlyfName",
    value: function genGlyfName(indexList) {
      var glyf = this.ttf.glyf;
      var list = [];
      if (indexList && indexList.length) {
        list = indexList.map(function (item) {
          return glyf[item];
        });
      } else {
        list = glyf;
      }
      if (list.length) {
        var first = this.ttf.glyf[0];
        list.forEach(function (g) {
          if (g === first) {
            g.name = '.notdef';
          } else if (g.unicode && g.unicode.length) {
            g.name = _string.default.getUnicodeName(g.unicode[0]);
          } else {
            g.name = '.notdef';
          }
        });
      }
      return list;
    }

    /**
     * 清除字形名称
     *
     * @param {Array=} indexList 索引列表
     * @return {Array} 改变的glyf
     */
  }, {
    key: "clearGlyfName",
    value: function clearGlyfName(indexList) {
      var glyf = this.ttf.glyf;
      var list = [];
      if (indexList && indexList.length) {
        list = indexList.map(function (item) {
          return glyf[item];
        });
      } else {
        list = glyf;
      }
      if (list.length) {
        list.forEach(function (g) {
          delete g.name;
        });
      }
      return list;
    }

    /**
     * 添加并体替换指定的glyf
     *
     * @param {Array} glyfList 添加的列表
     * @param {Array=} indexList 需要替换的索引列表
     * @return {Array} 改变的glyf
     */
  }, {
    key: "appendGlyf",
    value: function appendGlyf(glyfList, indexList) {
      var glyf = this.ttf.glyf;
      var result = glyfList.slice(0);
      if (indexList && indexList.length) {
        var l = Math.min(glyfList.length, indexList.length);
        for (var i = 0; i < l; i++) {
          glyf[indexList[i]] = glyfList[i];
        }
        glyfList = glyfList.slice(l);
      }
      if (glyfList.length) {
        Array.prototype.splice.apply(glyf, [glyf.length, 0].concat(_toConsumableArray(glyfList)));
      }
      return result;
    }

    /**
     * 调整glyf位置
     *
     * @param {Array=} indexList 索引列表
     * @param {Object} setting 选项
     * @param {number=} setting.leftSideBearing 左边距
     * @param {number=} setting.rightSideBearing 右边距
     * @param {number=} setting.verticalAlign 垂直对齐
     * @return {Array} 改变的glyf
     */
  }, {
    key: "adjustGlyfPos",
    value: function adjustGlyfPos(indexList, setting) {
      var glyfList = this.getGlyf(indexList);
      return adjustPos(glyfList, setting.leftSideBearing, setting.rightSideBearing, setting.verticalAlign);
    }

    /**
     * 调整glyf
     *
     * @param {Array=} indexList 索引列表
     * @param {Object} setting 选项
     * @param {boolean=} setting.reverse 字形反转操作
     * @param {boolean=} setting.mirror 字形镜像操作
     * @param {number=} setting.scale 字形缩放
     * @param {boolean=} setting.ajdustToEmBox  是否调整字形到 em 框
     * @param {number=} setting.ajdustToEmPadding 调整到 em 框的留白
     * @return {boolean}
     */
  }, {
    key: "adjustGlyf",
    value: function adjustGlyf(indexList, setting) {
      var glyfList = this.getGlyf(indexList);
      var changed = false;
      if (setting.reverse || setting.mirror) {
        changed = true;
        glyfList.forEach(function (g) {
          if (g.contours && g.contours.length) {
            var offsetX = g.xMax + g.xMin;
            var offsetY = g.yMax + g.yMin;
            g.contours.forEach(function (contour) {
              (0, _pathAdjust.default)(contour, setting.mirror ? -1 : 1, setting.reverse ? -1 : 1);
              (0, _pathAdjust.default)(contour, 1, 1, setting.mirror ? offsetX : 0, setting.reverse ? offsetY : 0);
            });
          }
        });
      }
      if (setting.scale && setting.scale !== 1) {
        changed = true;
        var scale = setting.scale;
        glyfList.forEach(function (g) {
          if (g.contours && g.contours.length) {
            (0, _glyfAdjust.default)(g, scale, scale);
          }
        });
      }
      // 缩放到embox
      else if (setting.ajdustToEmBox) {
        changed = true;
        var ascent = this.ttf.hhea.ascent;
        var descent = this.ttf.hhea.descent;
        var ajdustToEmPadding = 2 * (setting.ajdustToEmPadding || 0);
        adjustToEmBox(glyfList, ascent, descent, ajdustToEmPadding);
      }
      return changed ? glyfList : [];
    }

    /**
     * 获取glyf列表
     *
     * @param {Array=} indexList 索引列表
     * @return {Array} glyflist
     */
  }, {
    key: "getGlyf",
    value: function getGlyf(indexList) {
      var glyf = this.ttf.glyf;
      if (indexList && indexList.length) {
        return indexList.map(function (item) {
          return glyf[item];
        });
      }
      return glyf;
    }

    /**
     * 查找相关字形
     *
     * @param  {Object} condition 查询条件
     * @param  {Array|number} condition.unicode unicode编码列表或者单个unicode编码
     * @param  {string} condition.name glyf名字，例如`uniE001`, `uniE`
     * @param  {Function} condition.filter 自定义过滤器
     * @example
     *     condition.filter = function (glyf) {
     *         return glyf.name === 'logo';
     *     }
     * @return {Array}  glyf字形索引列表
     */
  }, {
    key: "findGlyf",
    value: function findGlyf(condition) {
      if (!condition) {
        return [];
      }
      var filters = [];

      // 按unicode数组查找
      if (condition.unicode) {
        var unicodeList = Array.isArray(condition.unicode) ? condition.unicode : [condition.unicode];
        var unicodeHash = {};
        unicodeList.forEach(function (unicode) {
          if (typeof unicode === 'string') {
            unicode = Number('0x' + unicode.slice(1));
          }
          unicodeHash[unicode] = true;
        });
        filters.push(function (glyf) {
          if (!glyf.unicode || !glyf.unicode.length) {
            return false;
          }
          for (var i = 0, l = glyf.unicode.length; i < l; i++) {
            if (unicodeHash[glyf.unicode[i]]) {
              return true;
            }
          }
        });
      }

      // 按名字查找
      if (condition.name) {
        var name = condition.name;
        filters.push(function (glyf) {
          return glyf.name && glyf.name.indexOf(name) === 0;
        });
      }

      // 按筛选函数查找
      if (typeof condition.filter === 'function') {
        filters.push(condition.filter);
      }
      var indexList = [];
      this.ttf.glyf.forEach(function (glyf, index) {
        for (var filterIndex = 0, filter; filter = filters[filterIndex++];) {
          if (true === filter(glyf)) {
            indexList.push(index);
            break;
          }
        }
      });
      return indexList;
    }

    /**
     * 更新指定的glyf
     *
     * @param {Object} glyf glyfobject
     * @param {string} index 需要替换的索引列表
     * @return {Array} 改变的glyf
     */
  }, {
    key: "replaceGlyf",
    value: function replaceGlyf(glyf, index) {
      if (index >= 0 && index < this.ttf.glyf.length) {
        this.ttf.glyf[index] = glyf;
        return [glyf];
      }
      return [];
    }

    /**
     * 设置glyf
     *
     * @param {Array} glyfList glyf列表
     * @return {Array} 设置的glyf列表
     */
  }, {
    key: "setGlyf",
    value: function setGlyf(glyfList) {
      delete this.glyf;
      this.ttf.glyf = glyfList || [];
      return this.ttf.glyf;
    }

    /**
     * 对字形按照unicode编码排序，此处不对复合字形进行排序，如果存在复合字形, 不进行排序
     *
     * @param {Array} glyfList glyf列表
     * @return {Array} 设置的glyf列表
     */
  }, {
    key: "sortGlyf",
    value: function sortGlyf() {
      var glyf = this.ttf.glyf;
      if (glyf.length > 1) {
        // 如果存在复合字形则退出
        if (glyf.some(function (a) {
          return a.compound;
        })) {
          return -2;
        }
        var notdef = glyf.shift();
        // 按代码点排序, 首先将空字形排到最后，然后按照unicode第一个编码进行排序
        glyf.sort(function (a, b) {
          if ((!a.unicode || !a.unicode.length) && (!b.unicode || !b.unicode.length)) {
            return 0;
          } else if ((!a.unicode || !a.unicode.length) && b.unicode) {
            return 1;
          } else if (a.unicode && (!b.unicode || !b.unicode.length)) {
            return -1;
          }
          return Math.min.apply(null, a.unicode) - Math.min.apply(null, b.unicode);
        });
        glyf.unshift(notdef);
        return glyf;
      }
      return -1;
    }

    /**
     * 设置名字
     *
     * @param {string} name 名字字段
     * @return {Object} 名字对象
     */
  }, {
    key: "setName",
    value: function setName(name) {
      if (name) {
        this.ttf.name.fontFamily = this.ttf.name.fullName = name.fontFamily || _default.default.name.fontFamily;
        this.ttf.name.fontSubFamily = name.fontSubFamily || _default.default.name.fontSubFamily;
        this.ttf.name.uniqueSubFamily = name.uniqueSubFamily || '';
        this.ttf.name.postScriptName = name.postScriptName || '';
      }
      return this.ttf.name;
    }

    /**
     * 设置head信息
     *
     * @param {Object} head 头部信息
     * @return {Object} 头对象
     */
  }, {
    key: "setHead",
    value: function setHead(head) {
      if (head) {
        // unitsperem
        if (head.unitsPerEm && head.unitsPerEm >= 64 && head.unitsPerEm <= 16384) {
          this.ttf.head.unitsPerEm = head.unitsPerEm;
        }

        // lowestrecppem
        if (head.lowestRecPPEM && head.lowestRecPPEM >= 8 && head.lowestRecPPEM <= 16384) {
          this.ttf.head.lowestRecPPEM = head.lowestRecPPEM;
        }
        // created
        if (head.created) {
          this.ttf.head.created = head.created;
        }
        if (head.modified) {
          this.ttf.head.modified = head.modified;
        }
      }
      return this.ttf.head;
    }

    /**
     * 设置hhea信息
     *
     * @param {Object} fields 字段值
     * @return {Object} 头对象
     */
  }, {
    key: "setHhea",
    value: function setHhea(fields) {
      (0, _lang.overwrite)(this.ttf.hhea, fields, ['ascent', 'descent', 'lineGap']);
      return this.ttf.hhea;
    }

    /**
     * 设置OS2信息
     *
     * @param {Object} fields 字段值
     * @return {Object} 头对象
     */
  }, {
    key: "setOS2",
    value: function setOS2(fields) {
      (0, _lang.overwrite)(this.ttf['OS/2'], fields, ['usWinAscent', 'usWinDescent', 'sTypoAscender', 'sTypoDescender', 'sTypoLineGap', 'sxHeight', 'bXHeight', 'usWeightClass', 'usWidthClass', 'yStrikeoutPosition', 'yStrikeoutSize', 'achVendID',
      // panose
      'bFamilyType', 'bSerifStyle', 'bWeight', 'bProportion', 'bContrast', 'bStrokeVariation', 'bArmStyle', 'bLetterform', 'bMidline', 'bXHeight']);
      return this.ttf['OS/2'];
    }

    /**
     * 设置post信息
     *
     * @param {Object} fields 字段值
     * @return {Object} 头对象
     */
  }, {
    key: "setPost",
    value: function setPost(fields) {
      (0, _lang.overwrite)(this.ttf.post, fields, ['underlinePosition', 'underlineThickness']);
      return this.ttf.post;
    }

    /**
     * 计算度量信息
     *
     * @return {Object} 度量信息
     */
  }, {
    key: "calcMetrics",
    value: function calcMetrics() {
      var ascent = -16384;
      var descent = 16384;
      var uX = 0x78;
      var uH = 0x48;
      var sxHeight;
      var sCapHeight;
      this.ttf.glyf.forEach(function (g) {
        if (g.yMax > ascent) {
          ascent = g.yMax;
        }
        if (g.yMin < descent) {
          descent = g.yMin;
        }
        if (g.unicode) {
          if (g.unicode.indexOf(uX) >= 0) {
            sxHeight = g.yMax;
          }
          if (g.unicode.indexOf(uH) >= 0) {
            sCapHeight = g.yMax;
          }
        }
      });
      ascent = Math.round(ascent);
      descent = Math.round(descent);
      return {
        // 此处非必须自动设置
        ascent: ascent,
        descent: descent,
        sTypoAscender: ascent,
        sTypoDescender: descent,
        // 自动设置项目
        usWinAscent: ascent,
        usWinDescent: -descent,
        sxHeight: sxHeight || 0,
        sCapHeight: sCapHeight || 0
      };
    }

    /**
     * 优化ttf字形信息
     *
     * @return {Array} 改变的glyf
     */
  }, {
    key: "optimize",
    value: function optimize() {
      return (0, _optimizettf.default)(this.ttf);
    }

    /**
     * 复合字形转简单字形
     *
     * @param {Array=} indexList 索引列表
     * @return {Array} 改变的glyf
     */
  }, {
    key: "compound2simple",
    value: function compound2simple(indexList) {
      var ttf = this.ttf;
      if (ttf.maxp && !ttf.maxp.maxComponentElements) {
        return [];
      }
      var i;
      var l;
      // 全部的compound glyf
      if (!indexList || !indexList.length) {
        indexList = [];
        for (i = 0, l = ttf.glyf.length; i < l; ++i) {
          if (ttf.glyf[i].compound) {
            indexList.push(i);
          }
        }
      }
      var list = [];
      for (i = 0, l = indexList.length; i < l; ++i) {
        var glyfIndex = indexList[i];
        if (ttf.glyf[glyfIndex] && ttf.glyf[glyfIndex].compound) {
          (0, _compound2simpleglyf.default)(glyfIndex, ttf, true);
          list.push(ttf.glyf[glyfIndex]);
        }
      }
      return list;
    }
  }]);
}();