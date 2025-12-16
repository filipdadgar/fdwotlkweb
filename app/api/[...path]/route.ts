import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5277';
  const targetUrl = `${backendUrl}/api/${path.join('/')}${req.nextUrl.search}`;

  console.log(`Proxying ${req.method} request to: ${targetUrl}`);

  try {
    const headers = new Headers(req.headers);
    headers.delete('host');
    headers.delete('connection');

    const body = req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
      // @ts-ignore - duplex is needed for Node.js fetch with streaming body
      duplex: 'half', 
    });

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
