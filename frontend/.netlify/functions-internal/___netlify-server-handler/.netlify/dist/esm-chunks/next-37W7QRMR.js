
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    
import {
  getTracer
} from "./chunk-NEZW7TGG.js";
import {
  getRegionalBlobStore
} from "./chunk-K4RDUZYO.js";
import {
  getRequestContext
} from "./chunk-LVXJQ2G2.js";
import "./chunk-5QSXBV7L.js";
import "./chunk-GNGHTHMQ.js";
import {
  __commonJS,
  __require,
  __toESM
} from "./chunk-OEQOKJGE.js";

// node_modules/fs-monkey/lib/util/lists.js
var require_lists = __commonJS({
  "node_modules/fs-monkey/lib/util/lists.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.fsSyncMethods = exports.fsProps = exports.fsAsyncMethods = void 0;
    var fsProps = exports.fsProps = ["constants", "F_OK", "R_OK", "W_OK", "X_OK", "Stats"];
    var fsSyncMethods = exports.fsSyncMethods = ["renameSync", "ftruncateSync", "truncateSync", "chownSync", "fchownSync", "lchownSync", "chmodSync", "fchmodSync", "lchmodSync", "statSync", "lstatSync", "fstatSync", "linkSync", "symlinkSync", "readlinkSync", "realpathSync", "unlinkSync", "rmdirSync", "mkdirSync", "mkdirpSync", "readdirSync", "closeSync", "openSync", "utimesSync", "futimesSync", "fsyncSync", "writeSync", "readSync", "readFileSync", "writeFileSync", "appendFileSync", "existsSync", "accessSync", "fdatasyncSync", "mkdtempSync", "copyFileSync", "rmSync", "createReadStream", "createWriteStream"];
    var fsAsyncMethods = exports.fsAsyncMethods = ["rename", "ftruncate", "truncate", "chown", "fchown", "lchown", "chmod", "fchmod", "lchmod", "stat", "lstat", "fstat", "link", "symlink", "readlink", "realpath", "unlink", "rmdir", "mkdir", "mkdirp", "readdir", "close", "open", "utimes", "futimes", "fsync", "write", "read", "readFile", "writeFile", "appendFile", "exists", "access", "fdatasync", "mkdtemp", "copyFile", "rm", "watchFile", "unwatchFile", "watch"];
  }
});

// node_modules/fs-monkey/lib/patchFs.js
var require_patchFs = __commonJS({
  "node_modules/fs-monkey/lib/patchFs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = patchFs2;
    var _lists = require_lists();
    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;
          var F = function F2() {
          };
          return { s: F, n: function n() {
            if (i >= o.length) return { done: true };
            return { done: false, value: o[i++] };
          }, e: function e(_e) {
            throw _e;
          }, f: F };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var normalCompletion = true, didErr = false, err;
      return { s: function s() {
        it = it.call(o);
      }, n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      }, e: function e(_e2) {
        didErr = true;
        err = _e2;
      }, f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]();
        } finally {
          if (didErr) throw err;
        }
      } };
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function patchFs2(vol) {
      var fs2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : __require("fs");
      var bkp = {};
      var patch = function patch2(key, newValue) {
        bkp[key] = fs2[key];
        fs2[key] = newValue;
      };
      var patchMethod = function patchMethod2(key) {
        return patch(key, vol[key].bind(vol));
      };
      var _iterator = _createForOfIteratorHelper(_lists.fsProps), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var prop = _step.value;
          if (typeof vol[prop] !== "undefined") patch(prop, vol[prop]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (typeof vol.StatWatcher === "function") {
        patch("StatWatcher", vol.FSWatcher.bind(null, vol));
      }
      if (typeof vol.FSWatcher === "function") {
        patch("FSWatcher", vol.StatWatcher.bind(null, vol));
      }
      if (typeof vol.ReadStream === "function") {
        patch("ReadStream", vol.ReadStream.bind(null, vol));
      }
      if (typeof vol.WriteStream === "function") {
        patch("WriteStream", vol.WriteStream.bind(null, vol));
      }
      if (typeof vol._toUnixTimestamp === "function") patchMethod("_toUnixTimestamp");
      var _iterator2 = _createForOfIteratorHelper(_lists.fsAsyncMethods), _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
          var method = _step2.value;
          if (typeof vol[method] === "function") patchMethod(method);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var _iterator3 = _createForOfIteratorHelper(_lists.fsSyncMethods), _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
          var _method = _step3.value;
          if (typeof vol[_method] === "function") patchMethod(_method);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return function unpatch() {
        for (var key in bkp) fs2[key] = bkp[key];
      };
    }
  }
});

// node_modules/fs-monkey/lib/correctPath.js
var require_correctPath = __commonJS({
  "node_modules/fs-monkey/lib/correctPath.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.correctPath = correctPath;
    exports.unixify = unixify;
    var isWin = process.platform === "win32";
    function removeTrailingSeparator(str) {
      var i = str.length - 1;
      if (i < 2) {
        return str;
      }
      while (isSeparator(str, i)) {
        i--;
      }
      return str.substr(0, i + 1);
    }
    function isSeparator(str, i) {
      var _char = str[i];
      return i > 0 && (_char === "/" || isWin && _char === "\\");
    }
    function normalizePath(str, stripTrailing) {
      if (typeof str !== "string") {
        throw new TypeError("expected a string");
      }
      str = str.replace(/[\\\/]+/g, "/");
      if (stripTrailing !== false) {
        str = removeTrailingSeparator(str);
      }
      return str;
    }
    function unixify(filepath) {
      var stripTrailing = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      if (isWin) {
        filepath = normalizePath(filepath, stripTrailing);
        return filepath.replace(/^([a-zA-Z]+:|\.\/)/, "");
      }
      return filepath;
    }
    function correctPath(filepath) {
      return unixify(filepath.replace(/^\\\\\?\\.:\\/, "\\"));
    }
  }
});

// node_modules/fs-monkey/lib/patchRequire.js
var require_patchRequire = __commonJS({
  "node_modules/fs-monkey/lib/patchRequire.js"(exports) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = patchRequire;
    var path = _interopRequireWildcard(__require("path"));
    function _getRequireWildcardCache(e) {
      if ("function" != typeof WeakMap) return null;
      var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(e2) {
        return e2 ? t : r;
      })(e);
    }
    function _interopRequireWildcard(e, r) {
      if (!r && e && e.__esModule) return e;
      if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e };
      var t = _getRequireWildcardCache(r);
      if (t && t.has(e)) return t.get(e);
      var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) {
        var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
        i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
      }
      return n["default"] = e, t && t.set(e, n), n;
    }
    var isWin32 = process.platform === "win32";
    var correctPath = isWin32 ? require_correctPath().correctPath : function(p) {
      return p;
    };
    function stripBOM(content) {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    }
    function patchRequire(vol) {
      var unixifyPaths = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      var Module = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : __require("module");
      if (isWin32 && unixifyPaths) {
        var original = vol;
        vol = {
          readFileSync: function readFileSync(path2, options) {
            return original.readFileSync(correctPath(path2), options);
          },
          realpathSync: function realpathSync(path2) {
            return original.realpathSync(correctPath(path2));
          },
          statSync: function statSync(path2) {
            return original.statSync(correctPath(path2));
          }
        };
      }
      function internalModuleReadFile(path2) {
        try {
          return vol.readFileSync(path2, "utf8");
        } catch (err) {
        }
      }
      function internalModuleStat(filename) {
        try {
          return vol.statSync(filename).isDirectory() ? 1 : 0;
        } catch (err) {
          return -2;
        }
      }
      function stat(filename) {
        filename = path._makeLong(filename);
        var cache = stat.cache;
        if (cache !== null) {
          var _result = cache.get(filename);
          if (_result !== void 0) return _result;
        }
        var result = internalModuleStat(filename);
        if (cache !== null) cache.set(filename, result);
        return result;
      }
      stat.cache = null;
      var preserveSymlinks = false;
      function toRealPath(requestPath) {
        return vol.realpathSync(requestPath);
      }
      var packageMainCache = /* @__PURE__ */ Object.create(null);
      function readPackage(requestPath) {
        var entry = packageMainCache[requestPath];
        if (entry) return entry;
        var jsonPath = path.resolve(requestPath, "package.json");
        var json = internalModuleReadFile(path._makeLong(jsonPath));
        if (json === void 0) {
          return false;
        }
        var pkg;
        try {
          var pkgJson = JSON.parse(json);
          pkg = packageMainCache[requestPath] = pkgJson.exports && pkgJson.exports.require || pkgJson.main;
        } catch (e) {
          e.path = jsonPath;
          e.message = "Error parsing " + jsonPath + ": " + e.message;
          throw e;
        }
        return pkg;
      }
      function tryFile(requestPath, isMain) {
        var rc = stat(requestPath);
        if (preserveSymlinks && !isMain) {
          return rc === 0 && path.resolve(requestPath);
        }
        return rc === 0 && toRealPath(requestPath);
      }
      function tryExtensions(p, exts, isMain) {
        for (var i = 0; i < exts.length; i++) {
          var filename = tryFile(p + exts[i], isMain);
          if (filename) {
            return filename;
          }
        }
        return false;
      }
      function tryPackage(requestPath, exts, isMain) {
        var pkg = readPackage(requestPath);
        if (!pkg) return false;
        var filename = path.resolve(requestPath, pkg);
        return tryFile(filename, isMain) || tryExtensions(filename, exts, isMain) || tryExtensions(path.resolve(filename, "index"), exts, isMain);
      }
      Module._extensions[".js"] = function(module2, filename) {
        var content = vol.readFileSync(filename, "utf8");
        module2._compile(stripBOM(content), filename);
      };
      Module._extensions[".json"] = function(module2, filename) {
        var content = vol.readFileSync(filename, "utf8");
        try {
          module2.exports = JSON.parse(stripBOM(content));
        } catch (err) {
          err.message = filename + ": " + err.message;
          throw err;
        }
      };
      var warned = true;
      Module._findPath = function(request, paths, isMain) {
        if (path.isAbsolute(request)) {
          paths = [""];
        } else if (!paths || paths.length === 0) {
          return false;
        }
        var cacheKey = request + "\0" + (paths.length === 1 ? paths[0] : paths.join("\0"));
        var entry = Module._pathCache[cacheKey];
        if (entry) return entry;
        var exts;
        var trailingSlash = request.length > 0 && request.charCodeAt(request.length - 1) === 47;
        for (var i = 0; i < paths.length; i++) {
          var curPath = paths[i];
          if (curPath && stat(curPath) < 1) continue;
          var basePath = correctPath(path.resolve(curPath, request));
          var filename;
          var rc = stat(basePath);
          if (!trailingSlash) {
            if (rc === 0) {
              if (preserveSymlinks && !isMain) {
                filename = path.resolve(basePath);
              } else {
                filename = toRealPath(basePath);
              }
            } else if (rc === 1) {
              if (exts === void 0) exts = Object.keys(Module._extensions);
              filename = tryPackage(basePath, exts, isMain);
            }
            if (!filename) {
              if (exts === void 0) exts = Object.keys(Module._extensions);
              filename = tryExtensions(basePath, exts, isMain);
            }
          }
          if (!filename && rc === 1) {
            if (exts === void 0) exts = Object.keys(Module._extensions);
            filename = tryPackage(basePath, exts, isMain);
          }
          if (!filename && rc === 1) {
            if (exts === void 0) exts = Object.keys(Module._extensions);
            filename = tryExtensions(path.resolve(basePath, "index"), exts, isMain);
          }
          if (filename) {
            if (request === "." && i > 0) {
              if (!warned) {
                warned = true;
                process.emitWarning("warning: require('.') resolved outside the package directory. This functionality is deprecated and will be removed soon.", "DeprecationWarning", "DEP0019");
              }
            }
            Module._pathCache[cacheKey] = filename;
            return filename;
          }
        }
        return false;
      };
    }
  }
});

// node_modules/fs-monkey/lib/index.js
var require_lib = __commonJS({
  "node_modules/fs-monkey/lib/index.js"(exports) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "patchFs", {
      enumerable: true,
      get: function get2() {
        return _patchFs["default"];
      }
    });
    Object.defineProperty(exports, "patchRequire", {
      enumerable: true,
      get: function get2() {
        return _patchRequire["default"];
      }
    });
    Object.defineProperty(exports, "unixify", {
      enumerable: true,
      get: function get2() {
        return _correctPath.unixify;
      }
    });
    exports.util = void 0;
    var _patchFs = _interopRequireDefault(require_patchFs());
    var _patchRequire = _interopRequireDefault(require_patchRequire());
    var _correctPath = require_correctPath();
    var util = _interopRequireWildcard(require_lists());
    exports.util = util;
    function _getRequireWildcardCache(e) {
      if ("function" != typeof WeakMap) return null;
      var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(e2) {
        return e2 ? t : r;
      })(e);
    }
    function _interopRequireWildcard(e, r) {
      if (!r && e && e.__esModule) return e;
      if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e };
      var t = _getRequireWildcardCache(r);
      if (t && t.has(e)) return t.get(e);
      var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) {
        var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
        i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
      }
      return n["default"] = e, t && t.set(e, n), n;
    }
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
  }
});

// src/run/next.cts
var import_fs_monkey = __toESM(require_lib());
import fs from "fs/promises";
import { relative, resolve } from "path";
process.env.NODE_ENV = "production";
var { getRequestHandlers } = __require("next/dist/server/lib/start-server.js");
var ResponseCache = __require("next/dist/server/response-cache/index.js").default;
var originalGet = ResponseCache.prototype.get;
ResponseCache.prototype.get = function get(...getArgs) {
  if (!this.didAddBackgroundWorkTracking) {
    if (typeof this.batcher !== "undefined") {
      const originalBatcherBatch = this.batcher.batch;
      this.batcher.batch = async (key, fn) => {
        const trackedFn = async (...workFnArgs) => {
          const workPromise = fn(...workFnArgs);
          const requestContext = getRequestContext();
          if (requestContext && workPromise instanceof Promise) {
            requestContext.trackBackgroundWork(workPromise);
          }
          return await workPromise;
        };
        return originalBatcherBatch.call(this.batcher, key, trackedFn);
      };
    } else if (typeof this.pendingResponses !== "undefined") {
      const backgroundWork = /* @__PURE__ */ new Map();
      const originalPendingResponsesSet = this.pendingResponses.set;
      this.pendingResponses.set = async (key, value) => {
        const requestContext = getRequestContext();
        if (requestContext && !this.pendingResponses.has(key)) {
          const workPromise = new Promise((_resolve) => {
            backgroundWork.set(key, _resolve);
          });
          requestContext.trackBackgroundWork(workPromise);
        }
        return originalPendingResponsesSet.call(this.pendingResponses, key, value);
      };
      const originalPendingResponsesDelete = this.pendingResponses.delete;
      this.pendingResponses.delete = async (key) => {
        const _resolve = backgroundWork.get(key);
        if (_resolve) {
          _resolve();
        }
        return originalPendingResponsesDelete.call(this.pendingResponses, key);
      };
    }
    this.didAddBackgroundWorkTracking = true;
  }
  return originalGet.apply(this, getArgs);
};
async function getMockedRequestHandler(...args) {
  const tracer = getTracer();
  return tracer.withActiveSpan("mocked request handler", async () => {
    const ofs = { ...fs };
    const { encodeBlobKey } = await import("../shared/blobkey.js");
    async function readFileFallbackBlobStore(...fsargs) {
      const [path, options] = fsargs;
      try {
        return await ofs.readFile(path, options);
      } catch (error) {
        if (typeof path === "string" && path.endsWith(".html")) {
          const store = getRegionalBlobStore();
          const relPath = relative(resolve(".next/server/pages"), path);
          const file = await store.get(await encodeBlobKey(relPath), {
            type: "json"
          });
          if (file !== null) {
            if (!file.isFallback) {
              const requestContext = getRequestContext();
              if (requestContext) {
                requestContext.usedFsReadForNonFallback = true;
              }
            }
            return file.html;
          }
        }
        throw error;
      }
    }
    (0, import_fs_monkey.patchFs)(
      {
        readFile: readFileFallbackBlobStore
      },
      // eslint-disable-next-line n/global-require, @typescript-eslint/no-var-requires
      __require("fs").promises
    );
    const requestHandlers = await getRequestHandlers(...args);
    return Array.isArray(requestHandlers) ? requestHandlers[0] : requestHandlers.requestHandler;
  });
}
export {
  getMockedRequestHandler
};
