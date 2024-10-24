import { copy, ensureDir, minify, MinifyOpts, WalkEntry } from "./deps.ts";
import { basename, dirname, join, relative } from "./deps.ts";
import { buildFeed, buildPage, buildTagPage } from "./build.ts";
import { UserConfig } from "./config.ts";
import { getTags } from "./attributes.ts";
import {
  getBacklinkPages,
  getChildPages,
  getChildTags,
  getPagesByTag,
  Page,
  TagPage,
} from "./pages.ts";

export interface OutputFile {
  inputPath?: string;
  filePath: string;
  fileContent?: string;
}

interface BuildOpts {
  outputPath: string;
  view: string;
  head: string;
  userConfig: UserConfig;
  style: string;
  includeRefresh: boolean;
}

const minifyOpts: MinifyOpts = {
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
};

const minifyStyleOpts: MinifyOpts = {
  minifyCSS: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
};

export async function buildContentFiles(
  pages: Array<Page>,
  opts: BuildOpts,
): Promise<OutputFile[]> {
  const files: Array<OutputFile> = [];
  const styleMinified = await minify(opts.style, minifyStyleOpts);

  for (const page of pages) {
    const filePath = join(
      opts.outputPath,
      page.url.pathname,
      "index.html",
    );

    const tags = page.attrs && getTags(page.attrs);
    const pagesByTag: { [tag: string]: Array<Page> } = {};
    tags && tags.forEach((tag: string) => {
      pagesByTag[tag] = getPagesByTag(pages, tag);
    });

    const html = await buildPage(page, {
      headInclude: opts.head,
      includeRefresh: opts.includeRefresh,
      childPages: page.isIndex ? getChildPages(pages, page) : [],
      backlinkPages: getBacklinkPages(pages, page),
      taggedPages: pagesByTag,
      childTags: page.isIndex ? getChildTags(pages, page) : [],
      view: opts.view,
      userConfig: opts.userConfig,
      style: styleMinified,
    }).catch((reason) => {
      console.error("Error building page:", page);
      console.error("Reason:", reason);
      Deno.exit(1);
    });

    if (typeof html === "string") {
      const minified = await minify(html, minifyOpts);
      files.push({
        filePath,
        fileContent: minified,
      });
    }
  }

  return files;
}

export async function buildTagFiles(
  tagPages: Array<TagPage>,
  opts: BuildOpts,
): Promise<OutputFile[]> {
  const files: Array<OutputFile> = [];
  const styleMinified = await minify(opts.style, minifyStyleOpts);

  for (const tag of tagPages) {
    const filePath = join(
      opts.outputPath,
      "tag",
      tag.name,
      "index.html",
    );

    const html = await buildTagPage(tag.name, {
      taggedPages: tag.pages,
      view: opts.view,
      headInclude: opts.head,
      includeRefresh: opts.includeRefresh,
      userConfig: opts.userConfig,
      style: styleMinified,
    });

    if (typeof html === "string") {
      const minified = await minify(html, minifyOpts);
      files.push({
        inputPath: "",
        filePath,
        fileContent: minified,
      });
    }
  }

  return files;
}

export async function buildFeedFile(
  pages: Array<Page>,
  view: string,
  outputPath: string,
  userConfig: UserConfig,
): Promise<OutputFile | undefined> {
  const xml = await buildFeed(
    pages,
    view,
    userConfig,
  );

  if (typeof xml === "string") {
    return {
      inputPath: "",
      filePath: outputPath,
      fileContent: xml,
    };
  }
}

export function getStaticFiles(
  entries: Array<WalkEntry>,
  inputPath: string,
  outputPath: string,
): OutputFile[] {
  const files: Array<OutputFile> = [];

  for (const entry of entries) {
    const relPath = relative(inputPath, entry.path);
    const filePath = join(
      outputPath,
      dirname(relPath),
      basename(relPath),
    );
    files.push({
      inputPath: entry.path,
      filePath,
    });
  }

  return files;
}

export async function writeFiles(
  files: OutputFile[],
  quiet = false,
) {
  for (const file of files) {
    if (file.fileContent) {
      quiet ||
        console.log(`write\t${relative(Deno.cwd(), file.filePath)}`);
      await ensureDir(dirname(file.filePath));
      await Deno.writeTextFile(file.filePath, file.fileContent);
    }
  }
}

export async function copyFiles(
  files: OutputFile[],
  quiet = false,
) {
  for (const file of files) {
    if (file.inputPath) {
      quiet ||
        console.log(`copy\t${relative(Deno.cwd(), file.filePath)}`);
      await ensureDir(dirname(file.filePath));
      await copy(file.inputPath, file.filePath);
    }
  }
}
