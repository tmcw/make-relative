# make-relative

A missing link for IPFS compatibility: this module makes links relative on
a website, so that one can navigate through the pages when using IPFS. IPFS
essentially makes websites run in sub-directories, so if you’re using links
that start with /, then they’ll jump to the wrong place.

Installation:

```
npm install -g https://github.com/tmcw/make-relative
```

Usage:

This needs to be run in the root of a built website. It will find all HTML
files under its current path and rewrite the following references in-place:

- a href, link href
- meta content
- img src

```sh
$ make-relative https://expected-domain-name.com
```

The domain name is required, because that makes this able to make domain-absolute links relative if they point to the same website.
