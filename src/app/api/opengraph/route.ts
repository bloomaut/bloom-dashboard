import { NextResponse, NextRequest } from "next/server";
const ogs = require("open-graph-scraper-lite");

async function handler(req: NextRequest) {
  if (req.method === "GET") {
    const options = { url: "http://ogp.me/" };

    const otherOptions = {
      html: `<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="preload" href="/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2" as="font" crossorigin="" type="font/woff2"><link rel="stylesheet" href="/_next/static/css/be529ac5feea68a4.css" data-precedence="next"><link rel="preload" as="script" fetchpriority="low" href="/_next/static/chunks/webpack-0c24db0ab053506f.js"><script src="/_next/static/chunks/c141e8ea-b7cafba0bbbd1fbd.js" async=""></script><script src="/_next/static/chunks/569-6ce7befb8dd5b128.js" async=""></script><script src="/_next/static/chunks/main-app-3892d8246b3df54e.js" async=""></script><script src="/_next/static/chunks/461-3ba264a0901e57f9.js" async=""></script><script src="/_next/static/chunks/app/%5Bhash%5D/page-cd7eaba011003f36.js" async=""></script><title>Engine</title><title>PowerAppEngine</title><title>PowerAppEngine</title><meta name="description" content="Landing page generator"><meta name="keywords" content="landing, page, generator, landing page generator, powerappengine, power app engine, power app, powerapp, engine, power, app, appengine, powerapp"><meta property="og:title" content="PowerAppEngine"><meta property="og:description" content="Landing page generator"><meta property="og:url" content="https://power-app-engine.vercel.app/"><meta property="og:locale" content="en_US"><meta property="og:image" content="https://power-app-engine-5sz8oqs85-jvgroup.vercel.app/api/og?type=hotlink&amp;flakeId=75806e8a1c04cad241934a374c1359c0&amp;=ntJl2"><meta property="og:image:alt" content="Og Image Alt"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="PowerAppEngine"><meta name="twitter:description" content="Landing page generator"><meta name="twitter:image" content="https://power-app-engine-5sz8oqs85-jvgroup.vercel.app/api/og?type=hotlink&amp;flakeId=75806e8a1c04cad241934a374c1359c0&amp;=ntJl2"><meta name="twitter:image:alt" content="Og Image Alt"><link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16"><meta name="next-size-adjust"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&amp;family=Kaushan+Script&amp;family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&amp;family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&amp;family=Montserrat:ital,wght@0,100..900;1,100..900&amp;family=Open+Sans:ital,wght@0,300..800;1,300..800&amp;family=Philosopher:ital,wght@0,400;0,700;1,400;1,700&amp;family=Playfair+Display:ital,wght@0,400..900;1,400..900&amp;family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&amp;display=swap"><script src="/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js" nomodule=""></script><script src="https://vercel.live/_next-live/feedback/feedback.js"></script><script type="text/javascript">
    window.hasMobileFirstExtension = true;</script></head></html>`,
    };

    try {
      const data = await ogs(otherOptions);
      const { error, html, result, response } = data;
      return NextResponse.json({ result });
    } catch (error) {
      return NextResponse.json({ error });
    }
  } else {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

export const GET = handler;
