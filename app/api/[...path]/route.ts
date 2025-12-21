import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const backendUrl = process.env.BACKEND_URL || 'http://wotlk-api.dadgar.se:8080';
  console.log(`[Proxy] BACKEND_URL: ${backendUrl}`);
  const targetUrl = `${backendUrl}/api/${path.join('/')}${req.nextUrl.search}`;

  console.log(`[Proxy] ${req.method} request to: ${targetUrl}`);

  try {
    const headers = new Headers(req.headers);
    headers.delete('host');
    headers.delete('connection');
    headers.delete('content-length');

    let body: BodyInit | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const textBody = await req.text();
      body = textBody.length ? textBody : undefined;
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      body,
    };

    const response = await fetch(targetUrl, fetchOptions);

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend', details: error instanceof Error ? error.message : String(error) },
      { status: 502 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
