#!/usr/bin/env node

const cheerio = require("cheerio");
const fg = require("fast-glob");
const path = require("path");
const URL = require("url").URL;
const fs = require("fs");

async function relativize(filepath) {
  const contents = await new Promise(resolve =>
    fs.readFile(filepath, "utf8", (err, res) => resolve(res))
  );
  const $ = cheerio.load(contents);
  const url = "/" + filepath.replace(/^\./, "");

  function relativize(elem, attribute) {
    const val = elem.attr(attribute);
    let u = new URL(val, "https://macwright.org/");
    if (u.host !== "macwright.org") return;
    let relative = path.relative(path.dirname(url), u.pathname);
    if (path.extname(relative) === "") relative += "/index.html";
    elem.attr(attribute, relative);
  }

  $("a, link").each(function() {
    relativize($(this), "href");
  });

  $("img").each(function() {
    relativize($(this), "src");
  });

  $("meta[property='og:image'],meta[name='thumbnail']").each(function() {
    relativize($(this), "content");
  });

  await new Promise(resolve => fs.writeFile(filepath, $.html(), resolve));

  console.log(`✓ ${filepath}`);
}

const stream = fg.stream(["**/*.html"]);
stream.once("error", console.log);
stream.on("data", relativize);
