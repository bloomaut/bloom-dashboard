import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    // Validate that the URL is from allowed domains (security measure)
    const allowedDomains = [
      "new-notibox.s3.us-east-1.amazonaws.com",
      "s3.amazonaws.com",
      // Add other trusted domains as needed
    ];

    const urlObj = new URL(url);
    const isAllowedDomain = allowedDomains.some(
      domain => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
    );

    if (!isAllowedDomain) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
    }

    // Fetch the PDF from the external URL
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PDFProxy/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch PDF: ${response.status}` }, { status: response.status });
    }

    // Get the PDF content
    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF with proper CORS headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("PDF Proxy Error:", error);
    return NextResponse.json({ error: "Failed to proxy PDF request" }, { status: 500 });
  }
}

// Handle preflight OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
