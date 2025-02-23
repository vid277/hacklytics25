"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/fs-monkey/lib/util/lists.js
var require_lists = __commonJS({
  "node_modules/fs-monkey/lib/util/lists.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.fsSyncMethods = exports2.fsProps = exports2.fsAsyncMethods = void 0;
    var fsProps = exports2.fsProps = ["constants", "F_OK", "R_OK", "W_OK", "X_OK", "Stats"];
    var fsSyncMethods = exports2.fsSyncMethods = ["renameSync", "ftruncateSync", "truncateSync", "chownSync", "fchownSync", "lchownSync", "chmodSync", "fchmodSync", "lchmodSync", "statSync", "lstatSync", "fstatSync", "linkSync", "symlinkSync", "readlinkSync", "realpathSync", "unlinkSync", "rmdirSync", "mkdirSync", "mkdirpSync", "readdirSync", "closeSync", "openSync", "utimesSync", "futimesSync", "fsyncSync", "writeSync", "readSync", "readFileSync", "writeFileSync", "appendFileSync", "existsSync", "accessSync", "fdatasyncSync", "mkdtempSync", "copyFileSync", "rmSync", "createReadStream", "createWriteStream"];
    var fsAsyncMethods = exports2.fsAsyncMethods = ["rename", "ftruncate", "truncate", "chown", "fchown", "lchown", "chmod", "fchmod", "lchmod", "stat", "lstat", "fstat", "link", "symlink", "readlink", "realpath", "unlink", "rmdir", "mkdir", "mkdirp", "readdir", "close", "open", "utimes", "futimes", "fsync", "write", "read", "readFile", "writeFile", "appendFile", "exists", "access", "fdatasync", "mkdtemp", "copyFile", "rm", "watchFile", "unwatchFile", "watch"];
  }
});

// node_modules/fs-monkey/lib/patchFs.js
var require_patchFs = __commonJS({
  "node_modules/fs-monkey/lib/patchFs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = patchFs2;
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
      var fs2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : require("fs");
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
  "node_modules/fs-monkey/lib/correctPath.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.correctPath = correctPath;
    exports2.unixify = unixify;
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
  "node_modules/fs-monkey/lib/patchRequire.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = patchRequire;
    var path = _interopRequireWildcard(require("path"));
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
      var Module = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : require("module");
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
      Module._extensions[".js"] = function(module3, filename) {
        var content = vol.readFileSync(filename, "utf8");
        module3._compile(stripBOM(content), filename);
      };
      Module._extensions[".json"] = function(module3, filename) {
        var content = vol.readFileSync(filename, "utf8");
        try {
          module3.exports = JSON.parse(stripBOM(content));
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
  "node_modules/fs-monkey/lib/index.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "patchFs", {
      enumerable: true,
      get: function get2() {
        return _patchFs["default"];
      }
    });
    Object.defineProperty(exports2, "patchRequire", {
      enumerable: true,
      get: function get2() {
        return _patchRequire["default"];
      }
    });
    Object.defineProperty(exports2, "unixify", {
      enumerable: true,
      get: function get2() {
        return _correctPath.unixify;
      }
    });
    exports2.util = void 0;
    var _patchFs = _interopRequireDefault(require_patchFs());
    var _patchRequire = _interopRequireDefault(require_patchRequire());
    var _correctPath = require_correctPath();
    var util = _interopRequireWildcard(require_lists());
    exports2.util = util;
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

// src/shared/blobkey.ts
var blobkey_exports = {};
__export(blobkey_exports, {
  encodeBlobKey: () => encodeBlobKey
});
async function encodeBlobKey(key) {
  const buffer = import_node_buffer.Buffer.from(key);
  const base64 = buffer.toString("base64url");
  if (base64.length <= maxLength) {
    return base64;
  }
  const digest = await import_node_crypto.webcrypto.subtle.digest("SHA-256", buffer);
  const hash = import_node_buffer.Buffer.from(digest).toString("base64url");
  return `${base64.slice(0, maxLength - hash.length - 1)}-${hash}`;
}
var import_node_buffer, import_node_crypto, maxLength;
var init_blobkey = __esm({
  "src/shared/blobkey.ts"() {
    "use strict";
    import_node_buffer = require("node:buffer");
    import_node_crypto = require("node:crypto");
    maxLength = 180;
  }
});

// src/run/next.cts
var next_exports = {};
__export(next_exports, {
  getMockedRequestHandler: () => getMockedRequestHandler
});
module.exports = __toCommonJS(next_exports);
var import_promises = __toESM(require("fs/promises"));
var import_path = require("path");
var import_fs_monkey = __toESM(require_lib());

// src/run/handlers/request-context.cts
var import_node_async_hooks = require("node:async_hooks");

// node_modules/@netlify/functions/dist/chunk-C6P2IO65.mjs
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __esm2 = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames2(fn)[0]])(fn = 0)), res;
};

// node_modules/@netlify/functions/dist/chunk-ATZ7N7EG.mjs
var import_process = require("process");
var systemLogTag;
var serializeError;
var LogLevel;
var SystemLogger;
var systemLogger;
var init_system_logger = __esm2({
  "src/lib/system_logger.ts"() {
    systemLogTag = "__nfSystemLog";
    serializeError = (error) => {
      const cause = error?.cause instanceof Error ? serializeError(error.cause) : error.cause;
      return {
        error: error.message,
        error_cause: cause,
        error_stack: error.stack
      };
    };
    LogLevel = /* @__PURE__ */ ((LogLevel2) => {
      LogLevel2[LogLevel2["Debug"] = 1] = "Debug";
      LogLevel2[LogLevel2["Log"] = 2] = "Log";
      LogLevel2[LogLevel2["Error"] = 3] = "Error";
      return LogLevel2;
    })(LogLevel || {});
    SystemLogger = class _SystemLogger {
      fields;
      logLevel;
      constructor(fields = {}, logLevel = 2) {
        this.fields = fields;
        this.logLevel = logLevel;
      }
      doLog(logger, message) {
        if (import_process.env.NETLIFY_DEV && !import_process.env.NETLIFY_ENABLE_SYSTEM_LOGGING) {
          return;
        }
        logger(systemLogTag, JSON.stringify({ msg: message, fields: this.fields }));
      }
      log(message) {
        if (this.logLevel > 2) {
          return;
        }
        this.doLog(console.log, message);
      }
      debug(message) {
        if (this.logLevel > 1) {
          return;
        }
        this.doLog(console.debug, message);
      }
      error(message) {
        if (this.logLevel > 3) {
          return;
        }
        this.doLog(console.error, message);
      }
      withLogLevel(level) {
        return new _SystemLogger(this.fields, level);
      }
      withFields(fields) {
        return new _SystemLogger(
          {
            ...this.fields,
            ...fields
          },
          this.logLevel
        );
      }
      withError(error) {
        const fields = error instanceof Error ? serializeError(error) : { error };
        return this.withFields(fields);
      }
    };
    systemLogger = new SystemLogger();
  }
});

// node_modules/@netlify/functions/dist/chunk-7ANA32NV.mjs
var init_internal = __esm2({
  "src/internal.ts"() {
    init_system_logger();
  }
});

// node_modules/@netlify/functions/dist/internal.mjs
init_internal();

// src/run/handlers/request-context.cts
var REQUEST_CONTEXT_GLOBAL_KEY = Symbol.for("nf-request-context-async-local-storage");
var requestContextAsyncLocalStorage;
function getRequestContextAsyncLocalStorage() {
  if (requestContextAsyncLocalStorage) {
    return requestContextAsyncLocalStorage;
  }
  const extendedGlobalThis = globalThis;
  if (extendedGlobalThis[REQUEST_CONTEXT_GLOBAL_KEY]) {
    return extendedGlobalThis[REQUEST_CONTEXT_GLOBAL_KEY];
  }
  const storage = new import_node_async_hooks.AsyncLocalStorage();
  requestContextAsyncLocalStorage = storage;
  extendedGlobalThis[REQUEST_CONTEXT_GLOBAL_KEY] = storage;
  return storage;
}
var getRequestContext = () => getRequestContextAsyncLocalStorage().getStore();

// node_modules/@opentelemetry/api/build/esm/platform/node/globalThis.js
var _globalThis = typeof globalThis === "object" ? globalThis : global;

// node_modules/@opentelemetry/api/build/esm/version.js
var VERSION = "1.8.0";

// node_modules/@opentelemetry/api/build/esm/internal/semver.js
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function _makeCompatibilityCheck(ownVersion) {
  var acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
  var rejectedVersions = /* @__PURE__ */ new Set();
  var myVersionMatch = ownVersion.match(re);
  if (!myVersionMatch) {
    return function() {
      return false;
    };
  }
  var ownVersionParsed = {
    major: +myVersionMatch[1],
    minor: +myVersionMatch[2],
    patch: +myVersionMatch[3],
    prerelease: myVersionMatch[4]
  };
  if (ownVersionParsed.prerelease != null) {
    return function isExactmatch(globalVersion) {
      return globalVersion === ownVersion;
    };
  }
  function _reject(v) {
    rejectedVersions.add(v);
    return false;
  }
  function _accept(v) {
    acceptedVersions.add(v);
    return true;
  }
  return function isCompatible2(globalVersion) {
    if (acceptedVersions.has(globalVersion)) {
      return true;
    }
    if (rejectedVersions.has(globalVersion)) {
      return false;
    }
    var globalVersionMatch = globalVersion.match(re);
    if (!globalVersionMatch) {
      return _reject(globalVersion);
    }
    var globalVersionParsed = {
      major: +globalVersionMatch[1],
      minor: +globalVersionMatch[2],
      patch: +globalVersionMatch[3],
      prerelease: globalVersionMatch[4]
    };
    if (globalVersionParsed.prerelease != null) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major !== globalVersionParsed.major) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major === 0) {
      if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
        return _accept(globalVersion);
      }
      return _reject(globalVersion);
    }
    if (ownVersionParsed.minor <= globalVersionParsed.minor) {
      return _accept(globalVersion);
    }
    return _reject(globalVersion);
  };
}
var isCompatible = _makeCompatibilityCheck(VERSION);

// node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
var major = VERSION.split(".")[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = _globalThis;
function registerGlobal(type, instance, diag, allowOverride) {
  var _a;
  if (allowOverride === void 0) {
    allowOverride = false;
  }
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
    version: VERSION
  };
  if (!allowOverride && api[type]) {
    var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
    diag.error(err.stack || err.message);
    return false;
  }
  if (api.version !== VERSION) {
    var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
    diag.error(err.stack || err.message);
    return false;
  }
  api[type] = instance;
  diag.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
  return true;
}
function getGlobal(type) {
  var _a, _b;
  var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
  if (!globalVersion || !isCompatible(globalVersion)) {
    return;
  }
  return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag) {
  diag.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
  if (api) {
    delete api[type];
  }
}

// node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
var __read = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var DiagComponentLogger = (
  /** @class */
  function() {
    function DiagComponentLogger2(props) {
      this._namespace = props.namespace || "DiagComponentLogger";
    }
    DiagComponentLogger2.prototype.debug = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("debug", this._namespace, args);
    };
    DiagComponentLogger2.prototype.error = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("error", this._namespace, args);
    };
    DiagComponentLogger2.prototype.info = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("info", this._namespace, args);
    };
    DiagComponentLogger2.prototype.warn = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("warn", this._namespace, args);
    };
    DiagComponentLogger2.prototype.verbose = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return logProxy("verbose", this._namespace, args);
    };
    return DiagComponentLogger2;
  }()
);
function logProxy(funcName, namespace, args) {
  var logger = getGlobal("diag");
  if (!logger) {
    return;
  }
  args.unshift(namespace);
  return logger[funcName].apply(logger, __spreadArray([], __read(args), false));
}

// node_modules/@opentelemetry/api/build/esm/diag/types.js
var DiagLogLevel;
(function(DiagLogLevel2) {
  DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
  DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
  DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
  DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
  DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
  DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
  DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
})(DiagLogLevel || (DiagLogLevel = {}));

// node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
function createLogLevelDiagLogger(maxLevel, logger) {
  if (maxLevel < DiagLogLevel.NONE) {
    maxLevel = DiagLogLevel.NONE;
  } else if (maxLevel > DiagLogLevel.ALL) {
    maxLevel = DiagLogLevel.ALL;
  }
  logger = logger || {};
  function _filterFunc(funcName, theLevel) {
    var theFunc = logger[funcName];
    if (typeof theFunc === "function" && maxLevel >= theLevel) {
      return theFunc.bind(logger);
    }
    return function() {
    };
  }
  return {
    error: _filterFunc("error", DiagLogLevel.ERROR),
    warn: _filterFunc("warn", DiagLogLevel.WARN),
    info: _filterFunc("info", DiagLogLevel.INFO),
    debug: _filterFunc("debug", DiagLogLevel.DEBUG),
    verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
  };
}

// node_modules/@opentelemetry/api/build/esm/api/diag.js
var __read2 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray2 = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME = "diag";
var DiagAPI = (
  /** @class */
  function() {
    function DiagAPI2() {
      function _logProxy(funcName) {
        return function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var logger = getGlobal("diag");
          if (!logger)
            return;
          return logger[funcName].apply(logger, __spreadArray2([], __read2(args), false));
        };
      }
      var self = this;
      var setLogger = function(logger, optionsOrLogLevel) {
        var _a, _b, _c;
        if (optionsOrLogLevel === void 0) {
          optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
        }
        if (logger === self) {
          var err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
          return false;
        }
        if (typeof optionsOrLogLevel === "number") {
          optionsOrLogLevel = {
            logLevel: optionsOrLogLevel
          };
        }
        var oldLogger = getGlobal("diag");
        var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
        if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
          var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
          oldLogger.warn("Current logger will be overwritten from " + stack);
          newLogger.warn("Current logger will overwrite one already registered from " + stack);
        }
        return registerGlobal("diag", newLogger, self, true);
      };
      self.setLogger = setLogger;
      self.disable = function() {
        unregisterGlobal(API_NAME, self);
      };
      self.createComponentLogger = function(options) {
        return new DiagComponentLogger(options);
      };
      self.verbose = _logProxy("verbose");
      self.debug = _logProxy("debug");
      self.info = _logProxy("info");
      self.warn = _logProxy("warn");
      self.error = _logProxy("error");
    }
    DiagAPI2.instance = function() {
      if (!this._instance) {
        this._instance = new DiagAPI2();
      }
      return this._instance;
    };
    return DiagAPI2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/context/context.js
function createContextKey(description) {
  return Symbol.for(description);
}
var BaseContext = (
  /** @class */
  /* @__PURE__ */ function() {
    function BaseContext2(parentContext) {
      var self = this;
      self._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
      self.getValue = function(key) {
        return self._currentContext.get(key);
      };
      self.setValue = function(key, value) {
        var context2 = new BaseContext2(self._currentContext);
        context2._currentContext.set(key, value);
        return context2;
      };
      self.deleteValue = function(key) {
        var context2 = new BaseContext2(self._currentContext);
        context2._currentContext.delete(key);
        return context2;
      };
    }
    return BaseContext2;
  }()
);
var ROOT_CONTEXT = new BaseContext();

// node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
var __read3 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray3 = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var NoopContextManager = (
  /** @class */
  function() {
    function NoopContextManager2() {
    }
    NoopContextManager2.prototype.active = function() {
      return ROOT_CONTEXT;
    };
    NoopContextManager2.prototype.with = function(_context, fn, thisArg) {
      var args = [];
      for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
      }
      return fn.call.apply(fn, __spreadArray3([thisArg], __read3(args), false));
    };
    NoopContextManager2.prototype.bind = function(_context, target) {
      return target;
    };
    NoopContextManager2.prototype.enable = function() {
      return this;
    };
    NoopContextManager2.prototype.disable = function() {
      return this;
    };
    return NoopContextManager2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/api/context.js
var __read4 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray4 = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME2 = "context";
var NOOP_CONTEXT_MANAGER = new NoopContextManager();
var ContextAPI = (
  /** @class */
  function() {
    function ContextAPI2() {
    }
    ContextAPI2.getInstance = function() {
      if (!this._instance) {
        this._instance = new ContextAPI2();
      }
      return this._instance;
    };
    ContextAPI2.prototype.setGlobalContextManager = function(contextManager) {
      return registerGlobal(API_NAME2, contextManager, DiagAPI.instance());
    };
    ContextAPI2.prototype.active = function() {
      return this._getContextManager().active();
    };
    ContextAPI2.prototype.with = function(context2, fn, thisArg) {
      var _a;
      var args = [];
      for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
      }
      return (_a = this._getContextManager()).with.apply(_a, __spreadArray4([context2, fn, thisArg], __read4(args), false));
    };
    ContextAPI2.prototype.bind = function(context2, target) {
      return this._getContextManager().bind(context2, target);
    };
    ContextAPI2.prototype._getContextManager = function() {
      return getGlobal(API_NAME2) || NOOP_CONTEXT_MANAGER;
    };
    ContextAPI2.prototype.disable = function() {
      this._getContextManager().disable();
      unregisterGlobal(API_NAME2, DiagAPI.instance());
    };
    return ContextAPI2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var TraceFlags;
(function(TraceFlags2) {
  TraceFlags2[TraceFlags2["NONE"] = 0] = "NONE";
  TraceFlags2[TraceFlags2["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags || (TraceFlags = {}));

// node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
var INVALID_SPANID = "0000000000000000";
var INVALID_TRACEID = "00000000000000000000000000000000";
var INVALID_SPAN_CONTEXT = {
  traceId: INVALID_TRACEID,
  spanId: INVALID_SPANID,
  traceFlags: TraceFlags.NONE
};

// node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
var NonRecordingSpan = (
  /** @class */
  function() {
    function NonRecordingSpan2(_spanContext) {
      if (_spanContext === void 0) {
        _spanContext = INVALID_SPAN_CONTEXT;
      }
      this._spanContext = _spanContext;
    }
    NonRecordingSpan2.prototype.spanContext = function() {
      return this._spanContext;
    };
    NonRecordingSpan2.prototype.setAttribute = function(_key, _value) {
      return this;
    };
    NonRecordingSpan2.prototype.setAttributes = function(_attributes) {
      return this;
    };
    NonRecordingSpan2.prototype.addEvent = function(_name, _attributes) {
      return this;
    };
    NonRecordingSpan2.prototype.setStatus = function(_status) {
      return this;
    };
    NonRecordingSpan2.prototype.updateName = function(_name) {
      return this;
    };
    NonRecordingSpan2.prototype.end = function(_endTime) {
    };
    NonRecordingSpan2.prototype.isRecording = function() {
      return false;
    };
    NonRecordingSpan2.prototype.recordException = function(_exception, _time) {
    };
    return NonRecordingSpan2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
var SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
function getSpan(context2) {
  return context2.getValue(SPAN_KEY) || void 0;
}
function getActiveSpan() {
  return getSpan(ContextAPI.getInstance().active());
}
function setSpan(context2, span) {
  return context2.setValue(SPAN_KEY, span);
}
function deleteSpan(context2) {
  return context2.deleteValue(SPAN_KEY);
}
function setSpanContext(context2, spanContext) {
  return setSpan(context2, new NonRecordingSpan(spanContext));
}
function getSpanContext(context2) {
  var _a;
  return (_a = getSpan(context2)) === null || _a === void 0 ? void 0 : _a.spanContext();
}

// node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
  return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
}
function isValidSpanId(spanId) {
  return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
}
function isSpanContextValid(spanContext) {
  return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
function wrapSpanContext(spanContext) {
  return new NonRecordingSpan(spanContext);
}

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
var contextApi = ContextAPI.getInstance();
var NoopTracer = (
  /** @class */
  function() {
    function NoopTracer2() {
    }
    NoopTracer2.prototype.startSpan = function(name, options, context2) {
      if (context2 === void 0) {
        context2 = contextApi.active();
      }
      var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
      if (root) {
        return new NonRecordingSpan();
      }
      var parentFromContext = context2 && getSpanContext(context2);
      if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) {
        return new NonRecordingSpan(parentFromContext);
      } else {
        return new NonRecordingSpan();
      }
    };
    NoopTracer2.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
      var opts;
      var ctx;
      var fn;
      if (arguments.length < 2) {
        return;
      } else if (arguments.length === 2) {
        fn = arg2;
      } else if (arguments.length === 3) {
        opts = arg2;
        fn = arg3;
      } else {
        opts = arg2;
        ctx = arg3;
        fn = arg4;
      }
      var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
      var span = this.startSpan(name, opts, parentContext);
      var contextWithSpanSet = setSpan(parentContext, span);
      return contextApi.with(contextWithSpanSet, fn, void 0, span);
    };
    return NoopTracer2;
  }()
);
function isSpanContext(spanContext) {
  return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
}

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
var NOOP_TRACER = new NoopTracer();
var ProxyTracer = (
  /** @class */
  function() {
    function ProxyTracer2(_provider, name, version, options) {
      this._provider = _provider;
      this.name = name;
      this.version = version;
      this.options = options;
    }
    ProxyTracer2.prototype.startSpan = function(name, options, context2) {
      return this._getTracer().startSpan(name, options, context2);
    };
    ProxyTracer2.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
      var tracer2 = this._getTracer();
      return Reflect.apply(tracer2.startActiveSpan, tracer2, arguments);
    };
    ProxyTracer2.prototype._getTracer = function() {
      if (this._delegate) {
        return this._delegate;
      }
      var tracer2 = this._provider.getDelegateTracer(this.name, this.version, this.options);
      if (!tracer2) {
        return NOOP_TRACER;
      }
      this._delegate = tracer2;
      return this._delegate;
    };
    return ProxyTracer2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
var NoopTracerProvider = (
  /** @class */
  function() {
    function NoopTracerProvider2() {
    }
    NoopTracerProvider2.prototype.getTracer = function(_name, _version, _options) {
      return new NoopTracer();
    };
    return NoopTracerProvider2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
var ProxyTracerProvider = (
  /** @class */
  function() {
    function ProxyTracerProvider2() {
    }
    ProxyTracerProvider2.prototype.getTracer = function(name, version, options) {
      var _a;
      return (_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options);
    };
    ProxyTracerProvider2.prototype.getDelegate = function() {
      var _a;
      return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
    };
    ProxyTracerProvider2.prototype.setDelegate = function(delegate) {
      this._delegate = delegate;
    };
    ProxyTracerProvider2.prototype.getDelegateTracer = function(name, version, options) {
      var _a;
      return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
    };
    return ProxyTracerProvider2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace/status.js
var SpanStatusCode;
(function(SpanStatusCode2) {
  SpanStatusCode2[SpanStatusCode2["UNSET"] = 0] = "UNSET";
  SpanStatusCode2[SpanStatusCode2["OK"] = 1] = "OK";
  SpanStatusCode2[SpanStatusCode2["ERROR"] = 2] = "ERROR";
})(SpanStatusCode || (SpanStatusCode = {}));

// node_modules/@opentelemetry/api/build/esm/context-api.js
var context = ContextAPI.getInstance();

// node_modules/@opentelemetry/api/build/esm/api/trace.js
var API_NAME3 = "trace";
var TraceAPI = (
  /** @class */
  function() {
    function TraceAPI2() {
      this._proxyTracerProvider = new ProxyTracerProvider();
      this.wrapSpanContext = wrapSpanContext;
      this.isSpanContextValid = isSpanContextValid;
      this.deleteSpan = deleteSpan;
      this.getSpan = getSpan;
      this.getActiveSpan = getActiveSpan;
      this.getSpanContext = getSpanContext;
      this.setSpan = setSpan;
      this.setSpanContext = setSpanContext;
    }
    TraceAPI2.getInstance = function() {
      if (!this._instance) {
        this._instance = new TraceAPI2();
      }
      return this._instance;
    };
    TraceAPI2.prototype.setGlobalTracerProvider = function(provider) {
      var success = registerGlobal(API_NAME3, this._proxyTracerProvider, DiagAPI.instance());
      if (success) {
        this._proxyTracerProvider.setDelegate(provider);
      }
      return success;
    };
    TraceAPI2.prototype.getTracerProvider = function() {
      return getGlobal(API_NAME3) || this._proxyTracerProvider;
    };
    TraceAPI2.prototype.getTracer = function(name, version) {
      return this.getTracerProvider().getTracer(name, version);
    };
    TraceAPI2.prototype.disable = function() {
      unregisterGlobal(API_NAME3, DiagAPI.instance());
      this._proxyTracerProvider = new ProxyTracerProvider();
    };
    return TraceAPI2;
  }()
);

// node_modules/@opentelemetry/api/build/esm/trace-api.js
var trace = TraceAPI.getInstance();

// node_modules/@opentelemetry/api/build/esm/experimental/trace/SugaredTracer.js
var defaultOnException = function(e, span) {
  span.recordException(e);
  span.setStatus({
    code: SpanStatusCode.ERROR
  });
};
function wrapTracer(tracer2) {
  return new SugaredTracer(tracer2);
}
var SugaredTracer = (
  /** @class */
  function() {
    function SugaredTracer3(tracer2) {
      this._tracer = tracer2;
      this.startSpan = tracer2.startSpan.bind(this._tracer);
      this.startActiveSpan = tracer2.startActiveSpan.bind(this._tracer);
    }
    SugaredTracer3.prototype.withActiveSpan = function(name, arg2, arg3, arg4) {
      var _a = massageParams(arg2, arg3, arg4), opts = _a.opts, ctx = _a.ctx, fn = _a.fn;
      return this._tracer.startActiveSpan(name, opts, ctx, function(span) {
        return handleFn(span, opts, fn);
      });
    };
    SugaredTracer3.prototype.withSpan = function(name, arg2, arg3, arg4) {
      var _a = massageParams(arg2, arg3, arg4), opts = _a.opts, ctx = _a.ctx, fn = _a.fn;
      var span = this._tracer.startSpan(name, opts, ctx);
      return handleFn(span, opts, fn);
    };
    return SugaredTracer3;
  }()
);
function massageParams(arg, arg2, arg3) {
  var opts;
  var ctx;
  var fn;
  if (!arg2 && !arg3) {
    fn = arg;
  } else if (!arg3) {
    opts = arg;
    fn = arg2;
  } else {
    opts = arg;
    ctx = arg2;
    fn = arg3;
  }
  opts = opts !== null && opts !== void 0 ? opts : {};
  ctx = ctx !== null && ctx !== void 0 ? ctx : context.active();
  return { opts, ctx, fn };
}
function handleFn(span, opts, fn) {
  var _a;
  var onException = (_a = opts.onException) !== null && _a !== void 0 ? _a : defaultOnException;
  var errorHandler = function(e) {
    onException(e, span);
    span.end();
    throw e;
  };
  try {
    var ret = fn(span);
    if (typeof (ret === null || ret === void 0 ? void 0 : ret.then) === "function") {
      return ret.then(function(val) {
        span.end();
        return val;
      }, errorHandler);
    }
    span.end();
    return ret;
  } catch (e) {
    throw errorHandler(e);
  }
}

// src/run/handlers/tracer.cts
var spanMeta = /* @__PURE__ */ new WeakMap();
var spanCounter = /* @__PURE__ */ new WeakMap();
function spanHook(span) {
  const originalEnd = span.end.bind(span);
  span.end = (endTime) => {
    originalEnd(endTime);
    const meta = spanMeta.get(span);
    if (meta) {
      const requestContext = getRequestContext();
      if (requestContext?.captureServerTiming) {
        const duration = (typeof endTime === "number" ? endTime : performance.now()) - meta.start;
        const serverTiming = requestContext.serverTiming ?? "";
        const currentRequestSpanCounter = spanCounter.get(requestContext) ?? 1;
        requestContext.serverTiming = `${serverTiming}${serverTiming.length === 0 ? "" : ", "}s${currentRequestSpanCounter};dur=${duration};desc="${meta.name}"`;
        spanCounter.set(requestContext, currentRequestSpanCounter + 1);
      }
    }
    spanMeta.delete(span);
  };
  return span;
}
var tracer;
function getTracer() {
  if (!tracer) {
    const baseTracer = trace.getTracer("Next.js Runtime");
    const startSpan = baseTracer.startSpan.bind(baseTracer);
    baseTracer.startSpan = (...args) => {
      const span = startSpan(...args);
      spanMeta.set(span, { start: performance.now(), name: args[0] });
      return spanHook(span);
    };
    const startActiveSpan = baseTracer.startActiveSpan.bind(baseTracer);
    baseTracer.startActiveSpan = (...args) => {
      const [name, ...restOfArgs] = args;
      const augmentedArgs = restOfArgs.map((arg) => {
        if (typeof arg === "function") {
          return (span) => {
            spanMeta.set(span, { start: performance.now(), name: args[0] });
            spanHook(span);
            return arg(span);
          };
        }
        return arg;
      });
      return startActiveSpan(name, ...augmentedArgs);
    };
    tracer = wrapTracer(baseTracer);
  }
  return tracer;
}

// node_modules/@netlify/blobs/dist/chunk-GUEW34CP.js
var NF_ERROR = "x-nf-error";
var NF_REQUEST_ID = "x-nf-request-id";
var BlobsInternalError = class extends Error {
  constructor(res) {
    let details = res.headers.get(NF_ERROR) || `${res.status} status code`;
    if (res.headers.has(NF_REQUEST_ID)) {
      details += `, ID: ${res.headers.get(NF_REQUEST_ID)}`;
    }
    super(`Netlify Blobs has generated an internal error (${details})`);
    this.name = "BlobsInternalError";
  }
};
var collectIterator = async (iterator) => {
  const result = [];
  for await (const item of iterator) {
    result.push(item);
  }
  return result;
};
var base64Decode = (input) => {
  const { Buffer: Buffer3 } = globalThis;
  if (Buffer3) {
    return Buffer3.from(input, "base64").toString();
  }
  return atob(input);
};
var base64Encode = (input) => {
  const { Buffer: Buffer3 } = globalThis;
  if (Buffer3) {
    return Buffer3.from(input).toString("base64");
  }
  return btoa(input);
};
var getEnvironment = () => {
  const { Deno, Netlify, process: process2 } = globalThis;
  return Netlify?.env ?? Deno?.env ?? {
    delete: (key) => delete process2?.env[key],
    get: (key) => process2?.env[key],
    has: (key) => Boolean(process2?.env[key]),
    set: (key, value) => {
      if (process2?.env) {
        process2.env[key] = value;
      }
    },
    toObject: () => process2?.env ?? {}
  };
};
var getEnvironmentContext = () => {
  const context2 = globalThis.netlifyBlobsContext || getEnvironment().get("NETLIFY_BLOBS_CONTEXT");
  if (typeof context2 !== "string" || !context2) {
    return {};
  }
  const data = base64Decode(context2);
  try {
    return JSON.parse(data);
  } catch {
  }
  return {};
};
var MissingBlobsEnvironmentError = class extends Error {
  constructor(requiredProperties) {
    super(
      `The environment has not been configured to use Netlify Blobs. To use it manually, supply the following properties when creating a store: ${requiredProperties.join(
        ", "
      )}`
    );
    this.name = "MissingBlobsEnvironmentError";
  }
};
var BASE64_PREFIX = "b64;";
var METADATA_HEADER_INTERNAL = "x-amz-meta-user";
var METADATA_HEADER_EXTERNAL = "netlify-blobs-metadata";
var METADATA_MAX_SIZE = 2 * 1024;
var encodeMetadata = (metadata) => {
  if (!metadata) {
    return null;
  }
  const encodedObject = base64Encode(JSON.stringify(metadata));
  const payload = `b64;${encodedObject}`;
  if (METADATA_HEADER_EXTERNAL.length + payload.length > METADATA_MAX_SIZE) {
    throw new Error("Metadata object exceeds the maximum size");
  }
  return payload;
};
var decodeMetadata = (header) => {
  if (!header || !header.startsWith(BASE64_PREFIX)) {
    return {};
  }
  const encodedData = header.slice(BASE64_PREFIX.length);
  const decodedData = base64Decode(encodedData);
  const metadata = JSON.parse(decodedData);
  return metadata;
};
var getMetadataFromResponse = (response) => {
  if (!response.headers) {
    return {};
  }
  const value = response.headers.get(METADATA_HEADER_EXTERNAL) || response.headers.get(METADATA_HEADER_INTERNAL);
  try {
    return decodeMetadata(value);
  } catch {
    throw new Error(
      "An internal error occurred while trying to retrieve the metadata for an entry. Please try updating to the latest version of the Netlify Blobs client."
    );
  }
};
var BlobsConsistencyError = class extends Error {
  constructor() {
    super(
      `Netlify Blobs has failed to perform a read using strong consistency because the environment has not been configured with a 'uncachedEdgeURL' property`
    );
    this.name = "BlobsConsistencyError";
  }
};
var REGION_AUTO = "auto";
var regions = {
  "us-east-1": true,
  "us-east-2": true
};
var isValidRegion = (input) => Object.keys(regions).includes(input);
var InvalidBlobsRegionError = class extends Error {
  constructor(region) {
    super(
      `${region} is not a supported Netlify Blobs region. Supported values are: ${Object.keys(regions).join(", ")}.`
    );
    this.name = "InvalidBlobsRegionError";
  }
};
var DEFAULT_RETRY_DELAY = getEnvironment().get("NODE_ENV") === "test" ? 1 : 5e3;
var MIN_RETRY_DELAY = 1e3;
var MAX_RETRY = 5;
var RATE_LIMIT_HEADER = "X-RateLimit-Reset";
var fetchAndRetry = async (fetch, url, options, attemptsLeft = MAX_RETRY) => {
  try {
    const res = await fetch(url, options);
    if (attemptsLeft > 0 && (res.status === 429 || res.status >= 500)) {
      const delay = getDelay(res.headers.get(RATE_LIMIT_HEADER));
      await sleep(delay);
      return fetchAndRetry(fetch, url, options, attemptsLeft - 1);
    }
    return res;
  } catch (error) {
    if (attemptsLeft === 0) {
      throw error;
    }
    const delay = getDelay();
    await sleep(delay);
    return fetchAndRetry(fetch, url, options, attemptsLeft - 1);
  }
};
var getDelay = (rateLimitReset) => {
  if (!rateLimitReset) {
    return DEFAULT_RETRY_DELAY;
  }
  return Math.max(Number(rateLimitReset) * 1e3 - Date.now(), MIN_RETRY_DELAY);
};
var sleep = (ms) => new Promise((resolve2) => {
  setTimeout(resolve2, ms);
});
var SIGNED_URL_ACCEPT_HEADER = "application/json;type=signed-url";
var Client = class {
  constructor({ apiURL, consistency, edgeURL, fetch, region, siteID, token, uncachedEdgeURL }) {
    this.apiURL = apiURL;
    this.consistency = consistency ?? "eventual";
    this.edgeURL = edgeURL;
    this.fetch = fetch ?? globalThis.fetch;
    this.region = region;
    this.siteID = siteID;
    this.token = token;
    this.uncachedEdgeURL = uncachedEdgeURL;
    if (!this.fetch) {
      throw new Error(
        "Netlify Blobs could not find a `fetch` client in the global scope. You can either update your runtime to a version that includes `fetch` (like Node.js 18.0.0 or above), or you can supply your own implementation using the `fetch` property."
      );
    }
  }
  async getFinalRequest({
    consistency: opConsistency,
    key,
    metadata,
    method,
    parameters = {},
    storeName
  }) {
    const encodedMetadata = encodeMetadata(metadata);
    const consistency = opConsistency ?? this.consistency;
    let urlPath = `/${this.siteID}`;
    if (storeName) {
      urlPath += `/${storeName}`;
    }
    if (key) {
      urlPath += `/${key}`;
    }
    if (this.edgeURL) {
      if (consistency === "strong" && !this.uncachedEdgeURL) {
        throw new BlobsConsistencyError();
      }
      const headers = {
        authorization: `Bearer ${this.token}`
      };
      if (encodedMetadata) {
        headers[METADATA_HEADER_INTERNAL] = encodedMetadata;
      }
      if (this.region) {
        urlPath = `/region:${this.region}${urlPath}`;
      }
      const url2 = new URL(urlPath, consistency === "strong" ? this.uncachedEdgeURL : this.edgeURL);
      for (const key2 in parameters) {
        url2.searchParams.set(key2, parameters[key2]);
      }
      return {
        headers,
        url: url2.toString()
      };
    }
    const apiHeaders = { authorization: `Bearer ${this.token}` };
    const url = new URL(`/api/v1/blobs${urlPath}`, this.apiURL ?? "https://api.netlify.com");
    for (const key2 in parameters) {
      url.searchParams.set(key2, parameters[key2]);
    }
    if (this.region) {
      url.searchParams.set("region", this.region);
    }
    if (storeName === void 0 || key === void 0) {
      return {
        headers: apiHeaders,
        url: url.toString()
      };
    }
    if (encodedMetadata) {
      apiHeaders[METADATA_HEADER_EXTERNAL] = encodedMetadata;
    }
    if (method === "head" || method === "delete") {
      return {
        headers: apiHeaders,
        url: url.toString()
      };
    }
    const res = await this.fetch(url.toString(), {
      headers: { ...apiHeaders, accept: SIGNED_URL_ACCEPT_HEADER },
      method
    });
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
    const { url: signedURL } = await res.json();
    const userHeaders = encodedMetadata ? { [METADATA_HEADER_INTERNAL]: encodedMetadata } : void 0;
    return {
      headers: userHeaders,
      url: signedURL
    };
  }
  async makeRequest({
    body,
    consistency,
    headers: extraHeaders,
    key,
    metadata,
    method,
    parameters,
    storeName
  }) {
    const { headers: baseHeaders = {}, url } = await this.getFinalRequest({
      consistency,
      key,
      metadata,
      method,
      parameters,
      storeName
    });
    const headers = {
      ...baseHeaders,
      ...extraHeaders
    };
    if (method === "put") {
      headers["cache-control"] = "max-age=0, stale-while-revalidate=60";
    }
    const options = {
      body,
      headers,
      method
    };
    if (body instanceof ReadableStream) {
      options.duplex = "half";
    }
    return fetchAndRetry(this.fetch, url, options);
  }
};
var getClientOptions = (options, contextOverride) => {
  const context2 = contextOverride ?? getEnvironmentContext();
  const siteID = context2.siteID ?? options.siteID;
  const token = context2.token ?? options.token;
  if (!siteID || !token) {
    throw new MissingBlobsEnvironmentError(["siteID", "token"]);
  }
  if (options.region !== void 0 && !isValidRegion(options.region)) {
    throw new InvalidBlobsRegionError(options.region);
  }
  const clientOptions = {
    apiURL: context2.apiURL ?? options.apiURL,
    consistency: options.consistency,
    edgeURL: context2.edgeURL ?? options.edgeURL,
    fetch: options.fetch,
    region: options.region,
    siteID,
    token,
    uncachedEdgeURL: context2.uncachedEdgeURL ?? options.uncachedEdgeURL
  };
  return clientOptions;
};

// node_modules/@netlify/blobs/dist/main.js
var DEPLOY_STORE_PREFIX = "deploy:";
var LEGACY_STORE_INTERNAL_PREFIX = "netlify-internal/legacy-namespace/";
var SITE_STORE_PREFIX = "site:";
var Store = class _Store {
  constructor(options) {
    this.client = options.client;
    if ("deployID" in options) {
      _Store.validateDeployID(options.deployID);
      let name = DEPLOY_STORE_PREFIX + options.deployID;
      if (options.name) {
        name += `:${options.name}`;
      }
      this.name = name;
    } else if (options.name.startsWith(LEGACY_STORE_INTERNAL_PREFIX)) {
      const storeName = options.name.slice(LEGACY_STORE_INTERNAL_PREFIX.length);
      _Store.validateStoreName(storeName);
      this.name = storeName;
    } else {
      _Store.validateStoreName(options.name);
      this.name = SITE_STORE_PREFIX + options.name;
    }
  }
  async delete(key) {
    const res = await this.client.makeRequest({ key, method: "delete", storeName: this.name });
    if (![200, 204, 404].includes(res.status)) {
      throw new BlobsInternalError(res);
    }
  }
  async get(key, options) {
    const { consistency, type } = options ?? {};
    const res = await this.client.makeRequest({ consistency, key, method: "get", storeName: this.name });
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
    if (type === void 0 || type === "text") {
      return res.text();
    }
    if (type === "arrayBuffer") {
      return res.arrayBuffer();
    }
    if (type === "blob") {
      return res.blob();
    }
    if (type === "json") {
      return res.json();
    }
    if (type === "stream") {
      return res.body;
    }
    throw new BlobsInternalError(res);
  }
  async getMetadata(key, { consistency } = {}) {
    const res = await this.client.makeRequest({ consistency, key, method: "head", storeName: this.name });
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200 && res.status !== 304) {
      throw new BlobsInternalError(res);
    }
    const etag = res?.headers.get("etag") ?? void 0;
    const metadata = getMetadataFromResponse(res);
    const result = {
      etag,
      metadata
    };
    return result;
  }
  async getWithMetadata(key, options) {
    const { consistency, etag: requestETag, type } = options ?? {};
    const headers = requestETag ? { "if-none-match": requestETag } : void 0;
    const res = await this.client.makeRequest({
      consistency,
      headers,
      key,
      method: "get",
      storeName: this.name
    });
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200 && res.status !== 304) {
      throw new BlobsInternalError(res);
    }
    const responseETag = res?.headers.get("etag") ?? void 0;
    const metadata = getMetadataFromResponse(res);
    const result = {
      etag: responseETag,
      metadata
    };
    if (res.status === 304 && requestETag) {
      return { data: null, ...result };
    }
    if (type === void 0 || type === "text") {
      return { data: await res.text(), ...result };
    }
    if (type === "arrayBuffer") {
      return { data: await res.arrayBuffer(), ...result };
    }
    if (type === "blob") {
      return { data: await res.blob(), ...result };
    }
    if (type === "json") {
      return { data: await res.json(), ...result };
    }
    if (type === "stream") {
      return { data: res.body, ...result };
    }
    throw new Error(`Invalid 'type' property: ${type}. Expected: arrayBuffer, blob, json, stream, or text.`);
  }
  list(options = {}) {
    const iterator = this.getListIterator(options);
    if (options.paginate) {
      return iterator;
    }
    return collectIterator(iterator).then(
      (items) => items.reduce(
        (acc, item) => ({
          blobs: [...acc.blobs, ...item.blobs],
          directories: [...acc.directories, ...item.directories]
        }),
        { blobs: [], directories: [] }
      )
    );
  }
  async set(key, data, { metadata } = {}) {
    _Store.validateKey(key);
    const res = await this.client.makeRequest({
      body: data,
      key,
      metadata,
      method: "put",
      storeName: this.name
    });
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
  }
  async setJSON(key, data, { metadata } = {}) {
    _Store.validateKey(key);
    const payload = JSON.stringify(data);
    const headers = {
      "content-type": "application/json"
    };
    const res = await this.client.makeRequest({
      body: payload,
      headers,
      key,
      metadata,
      method: "put",
      storeName: this.name
    });
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
  }
  static formatListResultBlob(result) {
    if (!result.key) {
      return null;
    }
    return {
      etag: result.etag,
      key: result.key
    };
  }
  static validateKey(key) {
    if (key === "") {
      throw new Error("Blob key must not be empty.");
    }
    if (key.startsWith("/") || key.startsWith("%2F")) {
      throw new Error("Blob key must not start with forward slash (/).");
    }
    if (new TextEncoder().encode(key).length > 600) {
      throw new Error(
        "Blob key must be a sequence of Unicode characters whose UTF-8 encoding is at most 600 bytes long."
      );
    }
  }
  static validateDeployID(deployID) {
    if (!/^\w{1,24}$/.test(deployID)) {
      throw new Error(`'${deployID}' is not a valid Netlify deploy ID.`);
    }
  }
  static validateStoreName(name) {
    if (name.includes("/") || name.includes("%2F")) {
      throw new Error("Store name must not contain forward slashes (/).");
    }
    if (new TextEncoder().encode(name).length > 64) {
      throw new Error(
        "Store name must be a sequence of Unicode characters whose UTF-8 encoding is at most 64 bytes long."
      );
    }
  }
  getListIterator(options) {
    const { client, name: storeName } = this;
    const parameters = {};
    if (options?.prefix) {
      parameters.prefix = options.prefix;
    }
    if (options?.directories) {
      parameters.directories = "true";
    }
    return {
      [Symbol.asyncIterator]() {
        let currentCursor = null;
        let done = false;
        return {
          async next() {
            if (done) {
              return { done: true, value: void 0 };
            }
            const nextParameters = { ...parameters };
            if (currentCursor !== null) {
              nextParameters.cursor = currentCursor;
            }
            const res = await client.makeRequest({
              method: "get",
              parameters: nextParameters,
              storeName
            });
            let blobs = [];
            let directories = [];
            if (![200, 204, 404].includes(res.status)) {
              throw new BlobsInternalError(res);
            }
            if (res.status === 404) {
              done = true;
            } else {
              const page = await res.json();
              if (page.next_cursor) {
                currentCursor = page.next_cursor;
              } else {
                done = true;
              }
              blobs = (page.blobs ?? []).map(_Store.formatListResultBlob).filter(Boolean);
              directories = page.directories ?? [];
            }
            return {
              done: false,
              value: {
                blobs,
                directories
              }
            };
          }
        };
      }
    };
  }
};
var getDeployStore = (input = {}) => {
  const context2 = getEnvironmentContext();
  const options = typeof input === "string" ? { name: input } : input;
  const deployID = options.deployID ?? context2.deployID;
  if (!deployID) {
    throw new MissingBlobsEnvironmentError(["deployID"]);
  }
  const clientOptions = getClientOptions(options, context2);
  if (!clientOptions.region) {
    if (clientOptions.edgeURL || clientOptions.uncachedEdgeURL) {
      if (!context2.primaryRegion) {
        throw new Error(
          "When accessing a deploy store, the Netlify Blobs client needs to be configured with a region, and one was not found in the environment. To manually set the region, set the `region` property in the `getDeployStore` options. If you are using the Netlify CLI, you may have an outdated version; run `npm install -g netlify-cli@latest` to update and try again."
        );
      }
      clientOptions.region = context2.primaryRegion;
    } else {
      clientOptions.region = REGION_AUTO;
    }
  }
  const client = new Client(clientOptions);
  return new Store({ client, deployID, name: options.name });
};

// src/run/regional-blob-store.cts
var fetchBeforeNextPatchedIt = globalThis.fetch;
var getRegionalBlobStore = (args = {}) => {
  return getDeployStore({
    ...args,
    fetch: fetchBeforeNextPatchedIt,
    region: process.env.USE_REGIONAL_BLOBS?.toUpperCase() === "TRUE" ? void 0 : "us-east-2"
  });
};

// src/run/next.cts
process.env.NODE_ENV = "production";
var { getRequestHandlers } = require("next/dist/server/lib/start-server.js");
var ResponseCache = require("next/dist/server/response-cache/index.js").default;
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
  const tracer2 = getTracer();
  return tracer2.withActiveSpan("mocked request handler", async () => {
    const ofs = { ...import_promises.default };
    const { encodeBlobKey: encodeBlobKey2 } = await Promise.resolve().then(() => (init_blobkey(), blobkey_exports));
    async function readFileFallbackBlobStore(...fsargs) {
      const [path, options] = fsargs;
      try {
        return await ofs.readFile(path, options);
      } catch (error) {
        if (typeof path === "string" && path.endsWith(".html")) {
          const store = getRegionalBlobStore();
          const relPath = (0, import_path.relative)((0, import_path.resolve)(".next/server/pages"), path);
          const file = await store.get(await encodeBlobKey2(relPath), {
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
      require("fs").promises
    );
    const requestHandlers = await getRequestHandlers(...args);
    return Array.isArray(requestHandlers) ? requestHandlers[0] : requestHandlers.requestHandler;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMockedRequestHandler
});
