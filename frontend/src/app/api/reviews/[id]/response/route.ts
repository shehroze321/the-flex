import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { response } = body;

    if (!response || typeof response !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Response text is required'
        },
        { status: 400 }
      );
    }

    const apiResponse = await fetch(`${BACKEND_URL}/api/reviews/${params.id}/response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response }),
    });

    if (!apiResponse.ok) {
      throw new Error(`Backend API error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding review response:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add review response',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
