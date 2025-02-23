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
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// src/run/handlers/cache.cts
var cache_exports = {};
__export(cache_exports, {
  NetlifyCacheHandler: () => NetlifyCacheHandler,
  default: () => cache_default
});
module.exports = __toCommonJS(cache_exports);
var import_node_buffer2 = require("node:buffer");
var import_node_path = require("node:path");
var import_posix = require("node:path/posix");

// node_modules/@netlify/functions/dist/chunk-C6P2IO65.mjs
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __esm2 = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames2(fn)[0]])(fn = 0)), res;
};

// node_modules/@netlify/functions/dist/chunk-7VFCQORF.mjs
var BUILDER_FUNCTIONS_FLAG;
var HTTP_STATUS_METHOD_NOT_ALLOWED;
var HTTP_STATUS_OK;
var METADATA_VERSION;
var init_consts = __esm2({
  "src/lib/consts.ts"() {
    BUILDER_FUNCTIONS_FLAG = true;
    HTTP_STATUS_METHOD_NOT_ALLOWED = 405;
    HTTP_STATUS_OK = 200;
    METADATA_VERSION = 1;
  }
});

// node_modules/@netlify/functions/dist/chunk-6V4VUZWK.mjs
var augmentResponse;
var wrapHandler;
var init_builder = __esm2({
  "src/lib/builder.ts"() {
    init_consts();
    augmentResponse = (response) => {
      if (!response) {
        return response;
      }
      const metadata = { version: METADATA_VERSION, builder_function: BUILDER_FUNCTIONS_FLAG, ttl: response.ttl || 0 };
      return {
        ...response,
        metadata
      };
    };
    wrapHandler = (handler) => (
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      (event, context2, callback) => {
        if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
          return Promise.resolve({
            body: "Method Not Allowed",
            statusCode: HTTP_STATUS_METHOD_NOT_ALLOWED
          });
        }
        const modifiedEvent = {
          ...event,
          multiValueQueryStringParameters: {},
          queryStringParameters: {}
        };
        const wrappedCallback = (error, response) => (
          // eslint-disable-next-line promise/prefer-await-to-callbacks
          callback ? callback(error, augmentResponse(response)) : null
        );
        const execution = handler(modifiedEvent, context2, wrappedCallback);
        if (typeof execution === "object" && typeof execution.then === "function") {
          return execution.then(augmentResponse);
        }
        return execution;
      }
    );
  }
});

// node_modules/@netlify/functions/dist/chunk-SURWFFYE.mjs
var import_process = require("process");
var purgeCache;
var init_purge_cache = __esm2({
  "src/lib/purge_cache.ts"() {
    purgeCache = async (options = {}) => {
      if (globalThis.fetch === void 0) {
        throw new Error(
          "`fetch` is not available. Please ensure you're using Node.js version 18.0.0 or above. Refer to https://ntl.fyi/functions-runtime for more information."
        );
      }
      const payload = {
        cache_tags: options.tags,
        deploy_alias: options.deployAlias
      };
      const token = import_process.env.NETLIFY_PURGE_API_TOKEN || options.token;
      if (import_process.env.NETLIFY_LOCAL && !token) {
        const scope = options.tags?.length ? ` for tags ${options.tags?.join(", ")}` : "";
        console.log(`Skipping purgeCache${scope} in local development.`);
        return;
      }
      if ("siteSlug" in options) {
        payload.site_slug = options.siteSlug;
      } else if ("domain" in options) {
        payload.domain = options.domain;
      } else {
        const siteID = options.siteID || import_process.env.SITE_ID;
        if (!siteID) {
          throw new Error(
            "The Netlify site ID was not found in the execution environment. Please supply it manually using the `siteID` property."
          );
        }
        payload.site_id = siteID;
      }
      if (!token) {
        throw new Error(
          "The cache purge API token was not found in the execution environment. Please supply it manually using the `token` property."
        );
      }
      const headers = {
        "Content-Type": "application/json; charset=utf8",
        Authorization: `Bearer ${token}`
      };
      if (options.userAgent) {
        headers["user-agent"] = options.userAgent;
      }
      const apiURL = options.apiURL || "https://api.netlify.com";
      const response = await fetch(`${apiURL}/api/v1/purge`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`Cache purge API call returned an unexpected status code: ${response.status}`);
      }
    };
  }
});

// node_modules/@netlify/functions/dist/chunk-MMCOWF6U.mjs
var import_node_stream = require("node:stream");
var import_node_util = require("node:util");
var pipeline = (0, import_node_util.promisify)(import_node_stream.pipeline);

// node_modules/@netlify/functions/dist/main.mjs
init_builder();
init_purge_cache();

// src/run/handlers/cache.cts
var import_constants = require("next/dist/lib/constants.js");

// package.json
var name = "@netlify/plugin-nextjs";
var version = "5.9.4";

// src/shared/cache-types.cts
var isCachedPageValue = (value) => value.kind === "PAGE" || value.kind === "PAGES";
var isCachedRouteValue = (value) => value.kind === "ROUTE" || value.kind === "APP_ROUTE";

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
  const { Buffer: Buffer4 } = globalThis;
  if (Buffer4) {
    return Buffer4.from(input, "base64").toString();
  }
  return atob(input);
};
var base64Encode = (input) => {
  const { Buffer: Buffer4 } = globalThis;
  if (Buffer4) {
    return Buffer4.from(input).toString("base64");
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
var fetchAndRetry = async (fetch2, url, options, attemptsLeft = MAX_RETRY) => {
  try {
    const res = await fetch2(url, options);
    if (attemptsLeft > 0 && (res.status === 429 || res.status >= 500)) {
      const delay = getDelay(res.headers.get(RATE_LIMIT_HEADER));
      await sleep(delay);
      return fetchAndRetry(fetch2, url, options, attemptsLeft - 1);
    }
    return res;
  } catch (error) {
    if (attemptsLeft === 0) {
      throw error;
    }
    const delay = getDelay();
    await sleep(delay);
    return fetchAndRetry(fetch2, url, options, attemptsLeft - 1);
  }
};
var getDelay = (rateLimitReset) => {
  if (!rateLimitReset) {
    return DEFAULT_RETRY_DELAY;
  }
  return Math.max(Number(rateLimitReset) * 1e3 - Date.now(), MIN_RETRY_DELAY);
};
var sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
var SIGNED_URL_ACCEPT_HEADER = "application/json;type=signed-url";
var Client = class {
  constructor({ apiURL, consistency, edgeURL, fetch: fetch2, region, siteID, token, uncachedEdgeURL }) {
    this.apiURL = apiURL;
    this.consistency = consistency ?? "eventual";
    this.edgeURL = edgeURL;
    this.fetch = fetch2 ?? globalThis.fetch;
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
      let name2 = DEPLOY_STORE_PREFIX + options.deployID;
      if (options.name) {
        name2 += `:${options.name}`;
      }
      this.name = name2;
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
  static validateStoreName(name2) {
    if (name2.includes("/") || name2.includes("%2F")) {
      throw new Error("Store name must not contain forward slashes (/).");
    }
    if (new TextEncoder().encode(name2).length > 64) {
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

// src/run/handlers/request-context.cts
var import_node_async_hooks = require("node:async_hooks");

// node_modules/@netlify/functions/dist/chunk-ATZ7N7EG.mjs
var import_process2 = require("process");
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
        if (import_process2.env.NETLIFY_DEV && !import_process2.env.NETLIFY_ENABLE_SYSTEM_LOGGING) {
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
function getLogger() {
  return getRequestContext()?.logger ?? systemLogger;
}

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
    NoopTracer2.prototype.startSpan = function(name2, options, context2) {
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
    NoopTracer2.prototype.startActiveSpan = function(name2, arg2, arg3, arg4) {
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
      var span = this.startSpan(name2, opts, parentContext);
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
    function ProxyTracer2(_provider, name2, version2, options) {
      this._provider = _provider;
      this.name = name2;
      this.version = version2;
      this.options = options;
    }
    ProxyTracer2.prototype.startSpan = function(name2, options, context2) {
      return this._getTracer().startSpan(name2, options, context2);
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
    ProxyTracerProvider2.prototype.getTracer = function(name2, version2, options) {
      var _a;
      return (_a = this.getDelegateTracer(name2, version2, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name2, version2, options);
    };
    ProxyTracerProvider2.prototype.getDelegate = function() {
      var _a;
      return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
    };
    ProxyTracerProvider2.prototype.setDelegate = function(delegate) {
      this._delegate = delegate;
    };
    ProxyTracerProvider2.prototype.getDelegateTracer = function(name2, version2, options) {
      var _a;
      return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name2, version2, options);
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
    TraceAPI2.prototype.getTracer = function(name2, version2) {
      return this.getTracerProvider().getTracer(name2, version2);
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
    SugaredTracer3.prototype.withActiveSpan = function(name2, arg2, arg3, arg4) {
      var _a = massageParams(arg2, arg3, arg4), opts = _a.opts, ctx = _a.ctx, fn = _a.fn;
      return this._tracer.startActiveSpan(name2, opts, ctx, function(span) {
        return handleFn(span, opts, fn);
      });
    };
    SugaredTracer3.prototype.withSpan = function(name2, arg2, arg3, arg4) {
      var _a = massageParams(arg2, arg3, arg4), opts = _a.opts, ctx = _a.ctx, fn = _a.fn;
      var span = this._tracer.startSpan(name2, opts, ctx);
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
      const [name2, ...restOfArgs] = args;
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
      return startActiveSpan(name2, ...augmentedArgs);
    };
    tracer = wrapTracer(baseTracer);
  }
  return tracer;
}

// src/run/handlers/cache.cts
var purgeCacheUserAgent = `${name}@${version}`;
var NetlifyCacheHandler = class {
  options;
  revalidatedTags;
  blobStore;
  tracer = getTracer();
  tagManifestsFetchedFromBlobStoreInCurrentRequest;
  constructor(options) {
    this.options = options;
    this.revalidatedTags = options.revalidatedTags;
    this.blobStore = getRegionalBlobStore({ consistency: "strong" });
    this.tagManifestsFetchedFromBlobStoreInCurrentRequest = {};
  }
  async encodeBlobKey(key) {
    const { encodeBlobKey: encodeBlobKey2 } = await Promise.resolve().then(() => (init_blobkey(), blobkey_exports));
    return await encodeBlobKey2(key);
  }
  captureResponseCacheLastModified(cacheValue, key, getCacheKeySpan) {
    if (cacheValue.value?.kind === "FETCH") {
      return;
    }
    const requestContext = getRequestContext();
    if (!requestContext) {
      getCacheKeySpan.recordException(
        new Error("CacheHandler was called without a request context")
      );
      getCacheKeySpan.setAttributes({
        severity: "alert",
        warning: true
      });
      return;
    }
    if (requestContext.responseCacheKey && requestContext.responseCacheKey !== key) {
      requestContext.responseCacheGetLastModified = void 0;
      getCacheKeySpan.recordException(
        new Error(
          `Multiple response cache keys used in single request: ["${requestContext.responseCacheKey}, "${key}"]`
        )
      );
      getCacheKeySpan.setAttributes({
        severity: "alert",
        warning: true
      });
      return;
    }
    requestContext.responseCacheKey = key;
    if (cacheValue.lastModified) {
      requestContext.responseCacheGetLastModified = cacheValue.lastModified;
    }
  }
  captureRouteRevalidateAndRemoveFromObject(cacheValue) {
    const { revalidate, ...restOfRouteValue } = cacheValue;
    const requestContext = getRequestContext();
    if (requestContext) {
      requestContext.routeHandlerRevalidate = revalidate;
    }
    return restOfRouteValue;
  }
  captureCacheTags(cacheValue, key) {
    if (!cacheValue) {
      return;
    }
    const requestContext = getRequestContext();
    if (!requestContext) {
      return;
    }
    if (requestContext.responseCacheTags) {
      return;
    }
    if (cacheValue.kind === "PAGE" || cacheValue.kind === "PAGES" || cacheValue.kind === "APP_PAGE" || cacheValue.kind === "ROUTE" || cacheValue.kind === "APP_ROUTE") {
      if (cacheValue.headers?.[import_constants.NEXT_CACHE_TAGS_HEADER]) {
        const cacheTags = cacheValue.headers[import_constants.NEXT_CACHE_TAGS_HEADER].split(/,|%2c/gi);
        requestContext.responseCacheTags = cacheTags;
      } else if ((cacheValue.kind === "PAGE" || cacheValue.kind === "PAGES") && typeof cacheValue.pageData === "object") {
        const cacheTags = [`_N_T_${key === "/index" ? "/" : encodeURI(key)}`];
        requestContext.responseCacheTags = cacheTags;
      }
    }
  }
  async injectEntryToPrerenderManifest(key, revalidate) {
    if (this.options.serverDistDir && (typeof revalidate === "number" || revalidate === false)) {
      try {
        const { loadManifest } = await import("next/dist/server/load-manifest.js");
        const prerenderManifest = loadManifest(
          (0, import_node_path.join)(this.options.serverDistDir, "..", "prerender-manifest.json")
        );
        try {
          const { normalizePagePath } = await import("next/dist/shared/lib/page-path/normalize-page-path.js");
          prerenderManifest.routes[key] = {
            experimentalPPR: void 0,
            dataRoute: (0, import_posix.join)("/_next/data", `${normalizePagePath(key)}.json`),
            srcRoute: null,
            // FIXME: provide actual source route, however, when dynamically appending it doesn't really matter
            initialRevalidateSeconds: revalidate,
            // Pages routes do not have a prefetch data route.
            prefetchDataRoute: void 0
          };
        } catch {
          const { SharedRevalidateTimings } = await import("next/dist/server/lib/incremental-cache/shared-revalidate-timings.js");
          const sharedRevalidateTimings = new SharedRevalidateTimings(prerenderManifest);
          sharedRevalidateTimings.set(key, revalidate);
        }
      } catch {
      }
    }
  }
  async get(...args) {
    return this.tracer.withActiveSpan("get cache key", async (span) => {
      const [key, ctx = {}] = args;
      getLogger().debug(`[NetlifyCacheHandler.get]: ${key}`);
      const blobKey = await this.encodeBlobKey(key);
      span.setAttributes({ key, blobKey });
      const blob = await this.tracer.withActiveSpan("blobStore.get", async (blobGetSpan) => {
        blobGetSpan.setAttributes({ key, blobKey });
        return await this.blobStore.get(blobKey, {
          type: "json"
        });
      });
      if (!blob) {
        span.addEvent("Cache miss", { key, blobKey });
        return null;
      }
      const staleByTags = await this.checkCacheEntryStaleByTags(blob, ctx.tags, ctx.softTags);
      if (staleByTags) {
        span.addEvent("Stale", { staleByTags });
        return null;
      }
      this.captureResponseCacheLastModified(blob, key, span);
      this.captureCacheTags(blob.value, key);
      switch (blob.value?.kind) {
        case "FETCH":
          span.addEvent("FETCH", { lastModified: blob.lastModified, revalidate: ctx.revalidate });
          return {
            lastModified: blob.lastModified,
            value: blob.value
          };
        case "ROUTE":
        case "APP_ROUTE": {
          span.addEvent(blob.value?.kind, {
            lastModified: blob.lastModified,
            status: blob.value.status
          });
          const valueWithoutRevalidate = this.captureRouteRevalidateAndRemoveFromObject(blob.value);
          return {
            lastModified: blob.lastModified,
            value: {
              ...valueWithoutRevalidate,
              body: import_node_buffer2.Buffer.from(valueWithoutRevalidate.body, "base64")
            }
          };
        }
        case "PAGE":
        case "PAGES": {
          span.addEvent(blob.value?.kind, { lastModified: blob.lastModified });
          const { revalidate, ...restOfPageValue } = blob.value;
          await this.injectEntryToPrerenderManifest(key, revalidate);
          return {
            lastModified: blob.lastModified,
            value: restOfPageValue
          };
        }
        case "APP_PAGE": {
          span.addEvent(blob.value?.kind, { lastModified: blob.lastModified });
          const { revalidate, rscData, ...restOfPageValue } = blob.value;
          await this.injectEntryToPrerenderManifest(key, revalidate);
          return {
            lastModified: blob.lastModified,
            value: {
              ...restOfPageValue,
              rscData: rscData ? import_node_buffer2.Buffer.from(rscData, "base64") : void 0
            }
          };
        }
        default:
          span.recordException(new Error(`Unknown cache entry kind: ${blob.value?.kind}`));
      }
      return null;
    });
  }
  transformToStorableObject(data, context2) {
    if (!data) {
      return null;
    }
    if (isCachedRouteValue(data)) {
      return {
        ...data,
        revalidate: context2.revalidate,
        body: data.body.toString("base64")
      };
    }
    if (isCachedPageValue(data)) {
      return {
        ...data,
        revalidate: context2.revalidate
      };
    }
    if (data?.kind === "APP_PAGE") {
      return {
        ...data,
        revalidate: context2.revalidate,
        rscData: data.rscData?.toString("base64")
      };
    }
    return data;
  }
  async set(...args) {
    return this.tracer.withActiveSpan("set cache key", async (span) => {
      const [key, data, context2] = args;
      const blobKey = await this.encodeBlobKey(key);
      const lastModified = Date.now();
      span.setAttributes({ key, lastModified, blobKey });
      getLogger().debug(`[NetlifyCacheHandler.set]: ${key}`);
      const value = this.transformToStorableObject(data, context2);
      this.captureCacheTags(value, key);
      await this.blobStore.setJSON(blobKey, {
        lastModified,
        value
      });
      if (data?.kind === "PAGE" || data?.kind === "PAGES") {
        const requestContext = getRequestContext();
        if (requestContext?.didPagesRouterOnDemandRevalidate) {
          const tag = `_N_T_${key === "/index" ? "/" : encodeURI(key)}`;
          const tags = tag.split(/,|%2c/gi).filter(Boolean);
          if (tags.length === 0) {
            return;
          }
          getLogger().debug(`Purging CDN cache for: [${tag}]`);
          requestContext.trackBackgroundWork(
            purgeCache({ tags, userAgent: purgeCacheUserAgent }).catch((error) => {
              getLogger().withError(error).error(`[NetlifyCacheHandler]: Purging the cache for tag ${tag} failed`);
            })
          );
        }
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async revalidateTag(tagOrTags, ...args) {
    const revalidateTagPromise = this.doRevalidateTag(tagOrTags, ...args);
    const requestContext = getRequestContext();
    if (requestContext) {
      requestContext.trackBackgroundWork(revalidateTagPromise);
    }
    return revalidateTagPromise;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async doRevalidateTag(tagOrTags, ...args) {
    getLogger().withFields({ tagOrTags, args }).debug("NetlifyCacheHandler.revalidateTag");
    const tags = (Array.isArray(tagOrTags) ? tagOrTags : [tagOrTags]).flatMap((tag) => tag.split(/,|%2c/gi)).filter(Boolean);
    if (tags.length === 0) {
      return;
    }
    const data = {
      revalidatedAt: Date.now()
    };
    await Promise.all(
      tags.map(async (tag) => {
        try {
          await this.blobStore.setJSON(await this.encodeBlobKey(tag), data);
        } catch (error) {
          getLogger().withError(error).log(`Failed to update tag manifest for ${tag}`);
        }
      })
    );
    await purgeCache({ tags, userAgent: purgeCacheUserAgent }).catch((error) => {
      getLogger().withError(error).error(`[NetlifyCacheHandler]: Purging the cache for tags ${tags.join(", ")} failed`);
    });
  }
  resetRequestCache() {
    this.tagManifestsFetchedFromBlobStoreInCurrentRequest = {};
  }
  /**
   * Checks if a cache entry is stale through on demand revalidated tags
   */
  async checkCacheEntryStaleByTags(cacheEntry, tags = [], softTags = []) {
    let cacheTags = [];
    if (cacheEntry.value?.kind === "FETCH") {
      cacheTags = [...tags, ...softTags];
    } else if (cacheEntry.value?.kind === "PAGE" || cacheEntry.value?.kind === "PAGES" || cacheEntry.value?.kind === "APP_PAGE" || cacheEntry.value?.kind === "ROUTE" || cacheEntry.value?.kind === "APP_ROUTE") {
      cacheTags = cacheEntry.value.headers?.[import_constants.NEXT_CACHE_TAGS_HEADER]?.split(/,|%2c/gi) || [];
    } else {
      return false;
    }
    if (this.revalidatedTags && this.revalidatedTags.length !== 0) {
      for (const tag of this.revalidatedTags) {
        if (cacheTags.includes(tag)) {
          return true;
        }
      }
    }
    return new Promise((resolve, reject) => {
      const tagManifestPromises = [];
      for (const tag of cacheTags) {
        let tagManifestPromise = this.tagManifestsFetchedFromBlobStoreInCurrentRequest[tag];
        if (!tagManifestPromise) {
          tagManifestPromise = this.encodeBlobKey(tag).then((blobKey) => {
            return this.tracer.withActiveSpan(`get tag manifest`, async (span) => {
              span.setAttributes({ tag, blobKey });
              return this.blobStore.get(blobKey, { type: "json" });
            });
          });
          this.tagManifestsFetchedFromBlobStoreInCurrentRequest[tag] = tagManifestPromise;
        }
        tagManifestPromises.push(
          tagManifestPromise.then((tagManifest) => {
            const isStale = tagManifest?.revalidatedAt >= (cacheEntry.lastModified || Date.now());
            if (isStale) {
              resolve(true);
              return true;
            }
            return false;
          })
        );
      }
      Promise.all(tagManifestPromises).then((tagManifestAreStale) => {
        resolve(tagManifestAreStale.some((tagIsStale) => tagIsStale));
      }).catch(reject);
    });
  }
};
var cache_default = NetlifyCacheHandler;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NetlifyCacheHandler
});
