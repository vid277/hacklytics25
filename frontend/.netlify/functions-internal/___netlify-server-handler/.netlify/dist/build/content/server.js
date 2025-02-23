
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    
import {
  copyNextDependencies,
  copyNextServerCode,
  getPatchesToApply,
  verifyHandlerDirStructure
} from "../../esm-chunks/chunk-IJZEDP6B.js";
import "../../esm-chunks/chunk-5QSXBV7L.js";
import "../../esm-chunks/chunk-GNGHTHMQ.js";
import "../../esm-chunks/chunk-KGYJQ2U2.js";
import "../../esm-chunks/chunk-APO262HE.js";
import "../../esm-chunks/chunk-UYKENJEU.js";
import "../../esm-chunks/chunk-OEQOKJGE.js";
export {
  copyNextDependencies,
  copyNextServerCode,
  getPatchesToApply,
  verifyHandlerDirStructure
};
