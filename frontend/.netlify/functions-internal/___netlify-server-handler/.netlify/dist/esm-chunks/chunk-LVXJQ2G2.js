
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    

// src/run/handlers/request-context.cts
import { AsyncLocalStorage } from "node:async_hooks";

// node_modules/@netlify/functions/dist/chunk-C6P2IO65.mjs
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// node_modules/@netlify/functions/dist/chunk-ATZ7N7EG.mjs
import { env } from "process";
var systemLogTag;
var serializeError;
var LogLevel;
var SystemLogger;
var systemLogger;
var init_system_logger = __esm({
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
        if (env.NETLIFY_DEV && !env.NETLIFY_ENABLE_SYSTEM_LOGGING) {
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
var init_internal = __esm({
  "src/internal.ts"() {
    init_system_logger();
  }
});

// node_modules/@netlify/functions/dist/internal.mjs
init_internal();

// src/run/handlers/request-context.cts
function createRequestContext(request, context) {
  const backgroundWorkPromises = [];
  return {
    captureServerTiming: request?.headers.has("x-next-debug-logging") ?? false,
    trackBackgroundWork: (promise) => {
      if (context?.waitUntil) {
        context.waitUntil(promise);
      } else {
        backgroundWorkPromises.push(promise);
      }
    },
    get backgroundWorkPromise() {
      return Promise.allSettled(backgroundWorkPromises);
    },
    logger: systemLogger.withLogLevel(
      request?.headers.has("x-nf-debug-logging") || request?.headers.has("x-next-debug-logging") ? LogLevel.Debug : LogLevel.Log
    )
  };
}
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
  const storage = new AsyncLocalStorage();
  requestContextAsyncLocalStorage = storage;
  extendedGlobalThis[REQUEST_CONTEXT_GLOBAL_KEY] = storage;
  return storage;
}
var getRequestContext = () => getRequestContextAsyncLocalStorage().getStore();
function getLogger() {
  return getRequestContext()?.logger ?? systemLogger;
}

export {
  createRequestContext,
  getRequestContext,
  getLogger
};
