"use strict";
/** *************************************************************
 * Please refer to the Theme Options section in documentation   *
 ****************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteMetaData = exports.mdxConfig = exports.social = void 0;
exports.social = [
    {
        name: "Twitter",
        url: "https://www.twitter.com/",
        Icon: "mdi:twitter",
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/",
        Icon: "mdi:instagram",
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/",
        Icon: "mdi:linkedin",
    },
];
exports.mdxConfig = {
    publicDir: "public",
    pagesDir: "content",
    fileExt: ".md",
    collections: ["/blog", "/projects"],
    remarkPlugins: [],
    rehypePlugins: [],
};
exports.siteMetaData = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.VERCEL_URL ||
        "http://localhost:3000",
    authorName: "John Doe",
    siteName: "John Doe",
    defaultTitle: "John Doe Personal Site",
    titleTemplate: "John Doe | %s",
    description: "A short description goes here.",
    email: "hello@example.com",
    locale: "en_US",
    twitter: {
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
    },
};
