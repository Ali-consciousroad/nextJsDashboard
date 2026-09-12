import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if users table exists
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;
    
    return NextResponse.json({ 
      success: true, 
      tableExists: result.rows[0].exists,
      message: 'Database check completed'
    });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
} 