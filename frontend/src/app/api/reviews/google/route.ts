import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyName = searchParams.get('propertyName');

    if (!propertyName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property name is required'
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/reviews/google?propertyName=${encodeURIComponent(propertyName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Google reviews',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/reviews/google/sync-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error syncing Google reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync Google reviews',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
