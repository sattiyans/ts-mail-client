import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { pixelId: string } }
) {
  const { pixelId } = params;
  
  try {
    // Forward the request to the backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${backendUrl}/track/pixel/${pixelId}`);
    
    if (response.ok) {
      const pixel = await response.arrayBuffer();
      return new NextResponse(pixel, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
    
    return new NextResponse('Not found', { status: 404 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
