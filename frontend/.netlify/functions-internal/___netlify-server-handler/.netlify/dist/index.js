
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    
import {
  copyPrerenderedContent
} from "./esm-chunks/chunk-BVYZSEV6.js";
import {
  copyStaticAssets,
  copyStaticContent,
  copyStaticExport,
  publishStaticDir,
  unpublishStaticDir
} from "./esm-chunks/chunk-HWMLYAVP.js";
import "./esm-chunks/chunk-TYCYFZ22.js";
import {
  clearStaleEdgeHandlers,
  createEdgeHandlers
} from "./esm-chunks/chunk-OAVVYSTW.js";
import {
  clearStaleServerHandlers,
  createServerHandler
} from "./esm-chunks/chunk-DLVROEVU.js";
import "./esm-chunks/chunk-IJZEDP6B.js";
import {
  wrapTracer
} from "./esm-chunks/chunk-5QSXBV7L.js";
import {
  init_esm,
  trace
} from "./esm-chunks/chunk-GNGHTHMQ.js";
import {
  restoreBuildCache,
  saveBuildCache
} from "./esm-chunks/chunk-72ZI2IVI.js";
import {
  setImageConfig
} from "./esm-chunks/chunk-AMY4NOT5.js";
import {
  PluginContext
} from "./esm-chunks/chunk-GFYWJNQR.js";
import {
  verifyAdvancedAPIRoutes,
  verifyNetlifyFormsWorkaround,
  verifyPublishDir
} from "./esm-chunks/chunk-ZSVHJNNY.js";
import "./esm-chunks/chunk-KGYJQ2U2.js";
import "./esm-chunks/chunk-ZENB67PD.js";
import "./esm-chunks/chunk-APO262HE.js";
import "./esm-chunks/chunk-UYKENJEU.js";
import "./esm-chunks/chunk-OEQOKJGE.js";

// src/index.ts
init_esm();
import { rm } from "fs/promises";
var tracer = wrapTracer(trace.getTracer("Next.js runtime"));
var onPreDev = async (options) => {
  await tracer.withActiveSpan("onPreDev", async () => {
    const context = new PluginContext(options);
    await rm(context.blobDir, { recursive: true, force: true });
  });
};
var onPreBuild = async (options) => {
  await tracer.withActiveSpan("onPreBuild", async () => {
    process.env.NEXT_PRIVATE_STANDALONE = "true";
    const ctx = new PluginContext(options);
    if (options.constants.IS_LOCAL) {
      await clearStaleServerHandlers(ctx);
      await clearStaleEdgeHandlers(ctx);
    } else {
      await restoreBuildCache(ctx);
    }
  });
};
var onBuild = async (options) => {
  await tracer.withActiveSpan("onBuild", async (span) => {
    const ctx = new PluginContext(options);
    verifyPublishDir(ctx);
    span.setAttribute("next.buildConfig", JSON.stringify(ctx.buildConfig));
    if (!options.constants.IS_LOCAL) {
      await saveBuildCache(ctx);
    }
    if (ctx.buildConfig.output === "export") {
      return Promise.all([copyStaticExport(ctx), setImageConfig(ctx)]);
    }
    await verifyAdvancedAPIRoutes(ctx);
    await verifyNetlifyFormsWorkaround(ctx);
    await Promise.all([
      copyStaticAssets(ctx),
      copyStaticContent(ctx),
      copyPrerenderedContent(ctx),
      createServerHandler(ctx),
      createEdgeHandlers(ctx),
      setImageConfig(ctx)
    ]);
  });
};
var onPostBuild = async (options) => {
  await tracer.withActiveSpan("onPostBuild", async () => {
    await publishStaticDir(new PluginContext(options));
  });
};
var onSuccess = async () => {
  await tracer.withActiveSpan("onSuccess", async () => {
    const prewarm = [process.env.DEPLOY_URL, process.env.DEPLOY_PRIME_URL, process.env.URL].filter(
      // If running locally then the deploy ID is a placeholder value. Filtering for `https://0--` removes it.
      (url) => Boolean(url && !url.startsWith("https://0--"))
    );
    await Promise.allSettled(prewarm.map((url) => fetch(url)));
  });
};
var onEnd = async (options) => {
  await tracer.withActiveSpan("onEnd", async () => {
    await unpublishStaticDir(new PluginContext(options));
  });
};
export {
  onBuild,
  onEnd,
  onPostBuild,
  onPreBuild,
  onPreDev,
  onSuccess
};
