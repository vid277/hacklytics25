
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    
import {
  getRequestContext
} from "./chunk-LVXJQ2G2.js";
import {
  wrapTracer
} from "./chunk-5QSXBV7L.js";
import {
  init_esm,
  trace
} from "./chunk-GNGHTHMQ.js";

// src/run/handlers/tracer.cts
init_esm();
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

export {
  getTracer
};
