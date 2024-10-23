export { parse as parseFlags } from "https://deno.land/std@0.224.0/flags/mod.ts";

export {
  copy,
  emptyDir,
  ensureDir,
  expandGlob,
  walk,
} from "https://deno.land/std@0.224.0/fs/mod.ts";
export type { WalkEntry } from "https://deno.land/std@0.224.0/fs/mod.ts";

export {
  basename,
  common,
  dirname,
  extname,
  isAbsolute,
  join,
  relative,
  toFileUrl,
} from "https://deno.land/std@0.224.0/path/mod.ts";

export { readableStreamFromReader } from "https://deno.land/std@0.224.0/streams/mod.ts";

export { serve } from "https://deno.land/std@0.224.0/http/server.ts";

export * as frontmatter from "https://deno.land/std@0.224.0/encoding/front_matter.ts";
export {
  normalizeURL,
  parseURL,
  withLeadingSlash,
  withoutLeadingSlash,
  withoutTrailingSlash,
  withTrailingSlash,
} from "https://esm.sh/ufo@1.5.4/";
export type { ParsedURL } from "https://esm.sh/ufo@1.5.4/";

export {
  compile,
  configure,
  render,
  templates,
} from "https://deno.land/x/eta@v3.5.0/mod.ts";

export { deepmerge } from "https://deno.land/x/deepmergets@v7.1.3/dist/deno/index.ts";
export { marked } from "https://esm.sh/marked@14.1.3/";
export { default as slugify } from "https://esm.sh/slugify@1.6.6/";
export { minify } from "https://esm.sh/html-minifier-terser@7.2.0/";
export type { Options as MinifyOpts } from "https://esm.sh/html-minifier-terser@7.2.0/";
export { default as hljs } from "https://cdn.skypack.dev/highlight.js";
