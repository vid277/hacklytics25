
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    
import {
  getRegionalBlobStore
} from "./chunk-K4RDUZYO.js";
import {
  getLogger
} from "./chunk-LVXJQ2G2.js";
import {
  encodeBlobKey
} from "./chunk-TYCYFZ22.js";

// src/run/headers.ts
var ALL_VARIATIONS = Symbol.for("ALL_VARIATIONS");
var NetlifyVaryKeys = /* @__PURE__ */ new Set(["header", "language", "cookie", "query", "country"]);
var isNetlifyVaryKey = (key) => NetlifyVaryKeys.has(key);
var generateNetlifyVaryValues = ({
  header,
  language,
  cookie,
  query,
  country
}) => {
  const values = [];
  if (query.length !== 0) {
    if (query.includes(ALL_VARIATIONS)) {
      values.push(`query`);
    } else {
      values.push(`query=${query.join(`|`)}`);
    }
  }
  if (header.length !== 0) {
    values.push(`header=${header.join(`|`)}`);
  }
  if (language.length !== 0) {
    values.push(`language=${language.join(`|`)}`);
  }
  if (cookie.length !== 0) {
    values.push(`cookie=${cookie.join(`|`)}`);
  }
  if (country.length !== 0) {
    values.push(`country=${country.join(`|`)}`);
  }
  return values.join(",");
};
var getHeaderValueArray = (header) => {
  return header.split(",").map((value) => value.trim()).filter(Boolean);
};
var omitHeaderValues = (header, values) => {
  const headerValues = getHeaderValueArray(header);
  const filteredValues = headerValues.filter(
    (value) => !values.some((val) => value.startsWith(val))
  );
  return filteredValues.join(", ");
};
var setVaryHeaders = (headers, request, { basePath, i18n }) => {
  const netlifyVaryValues = {
    header: ["x-nextjs-data", "x-next-debug-logging"],
    language: [],
    cookie: ["__prerender_bypass", "__next_preview_data"],
    query: ["__nextDataReq"],
    country: []
  };
  const vary = headers.get("vary");
  if (vary !== null) {
    netlifyVaryValues.header.push(...getHeaderValueArray(vary));
  }
  const path = new URL(request.url).pathname;
  const locales = i18n && i18n.localeDetection !== false ? i18n.locales : [];
  if (locales.length > 1 && (path === "/" || path === basePath)) {
    netlifyVaryValues.language.push(...locales);
    netlifyVaryValues.cookie.push(`NEXT_LOCALE`);
  }
  const userNetlifyVary = headers.get("netlify-vary");
  if (userNetlifyVary) {
    const directives = getHeaderValueArray(userNetlifyVary);
    for (const directive of directives) {
      const [key, value] = directive.split("=");
      if (key === "query" && !value) {
        netlifyVaryValues.query.push(ALL_VARIATIONS);
      } else if (value && isNetlifyVaryKey(key)) {
        netlifyVaryValues[key].push(...value.split("|"));
      }
    }
  }
  headers.set(`netlify-vary`, generateNetlifyVaryValues(netlifyVaryValues));
};
var adjustDateHeader = async ({
  headers,
  request,
  span,
  tracer,
  requestContext
}) => {
  const cacheState = headers.get("x-nextjs-cache");
  const isServedFromCache = cacheState === "HIT" || cacheState === "STALE";
  span.setAttributes({
    "x-nextjs-cache": cacheState ?? void 0,
    isServedFromCache
  });
  if (!isServedFromCache) {
    return;
  }
  const key = new URL(request.url).pathname;
  let lastModified;
  if (requestContext.responseCacheGetLastModified) {
    lastModified = requestContext.responseCacheGetLastModified;
  } else {
    span.recordException(
      new Error("lastModified not found in requestContext, falling back to trying blobs")
    );
    span.setAttributes({
      severity: "alert",
      warning: true
    });
    const blobStore = getRegionalBlobStore({ consistency: "strong" });
    const blobKey = await encodeBlobKey(key);
    lastModified = await tracer.withActiveSpan(
      "get cache to calculate date header",
      async (getBlobForDateSpan) => {
        getBlobForDateSpan.setAttributes({
          key,
          blobKey
        });
        const blob = await blobStore.get(blobKey, { type: "json" }) ?? {};
        getBlobForDateSpan.addEvent(blob ? "Cache hit" : "Cache miss");
        return blob.lastModified;
      }
    );
  }
  if (!lastModified) {
    span.recordException(
      new Error(
        "lastModified not found in either requestContext or blobs, date header for cached response is not set"
      )
    );
    span.setAttributes({
      severity: "alert",
      warning: true
    });
    return;
  }
  const lastModifiedDate = new Date(lastModified);
  headers.set("x-nextjs-date", headers.get("date") ?? lastModifiedDate.toUTCString());
  headers.set("date", lastModifiedDate.toUTCString());
};
var setCacheControlHeaders = ({ headers, status }, request, requestContext, nextConfig) => {
  if (typeof requestContext.routeHandlerRevalidate !== "undefined" && ["GET", "HEAD"].includes(request.method) && !headers.has("cdn-cache-control") && !headers.has("netlify-cdn-cache-control")) {
    const cdnCacheControl = (
      // if we are serving already stale response, instruct edge to not attempt to cache that response
      headers.get("x-nextjs-cache") === "STALE" ? "public, max-age=0, must-revalidate, durable" : `s-maxage=${requestContext.routeHandlerRevalidate === false ? 31536e3 : requestContext.routeHandlerRevalidate}, stale-while-revalidate=31536000, durable`
    );
    headers.set("netlify-cdn-cache-control", cdnCacheControl);
    return;
  }
  if (status === 308 && request.url.endsWith("/") !== nextConfig.trailingSlash) {
    getLogger().withFields({ trailingSlash: nextConfig.trailingSlash, location: headers.get("location") }).log("NetlifyHeadersHandler.trailingSlashRedirect");
  }
  if (status === 404 && request.url.endsWith(".php")) {
    headers.set("cache-control", "public, max-age=0, must-revalidate");
    headers.set("netlify-cdn-cache-control", `max-age=31536000, durable`);
  }
  const cacheControl = headers.get("cache-control");
  if (cacheControl !== null && ["GET", "HEAD"].includes(request.method) && !headers.has("cdn-cache-control") && !headers.has("netlify-cdn-cache-control")) {
    const browserCacheControl = omitHeaderValues(cacheControl, [
      "s-maxage",
      "stale-while-revalidate"
    ]);
    const cdnCacheControl = (
      // if we are serving already stale response, instruct edge to not attempt to cache that response
      headers.get("x-nextjs-cache") === "STALE" ? "public, max-age=0, must-revalidate, durable" : [
        ...getHeaderValueArray(cacheControl).map(
          (value) => value === "stale-while-revalidate" ? "stale-while-revalidate=31536000" : value
        ),
        "durable"
      ].join(", ")
    );
    headers.set("cache-control", browserCacheControl || "public, max-age=0, must-revalidate");
    headers.set("netlify-cdn-cache-control", cdnCacheControl);
    return;
  }
  if (cacheControl === null && !headers.has("cdn-cache-control") && !headers.has("netlify-cdn-cache-control") && requestContext.usedFsReadForNonFallback) {
    headers.set("cache-control", "public, max-age=0, must-revalidate");
    headers.set("netlify-cdn-cache-control", `max-age=31536000, durable`);
  }
};
var setCacheTagsHeaders = (headers, requestContext) => {
  if (requestContext.responseCacheTags && (headers.has("cache-control") || headers.has("netlify-cdn-cache-control"))) {
    headers.set("netlify-cache-tag", requestContext.responseCacheTags.join(","));
  }
};
var NEXT_CACHE_TO_CACHE_STATUS = {
  HIT: `hit`,
  MISS: `fwd=miss`,
  STALE: `hit; fwd=stale`
};
var setCacheStatusHeader = (headers) => {
  const nextCache = headers.get("x-nextjs-cache");
  if (typeof nextCache === "string") {
    if (nextCache in NEXT_CACHE_TO_CACHE_STATUS) {
      const cacheStatus = NEXT_CACHE_TO_CACHE_STATUS[nextCache];
      headers.set("cache-status", `"Next.js"; ${cacheStatus}`);
    }
    headers.delete("x-nextjs-cache");
  }
};

export {
  setVaryHeaders,
  adjustDateHeader,
  setCacheControlHeaders,
  setCacheTagsHeaders,
  setCacheStatusHeader
};
