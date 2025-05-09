import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Run the seed script
    const { stdout, stderr } = await execAsync('node scripts/seed.js');
    
    if (stderr) {
      console.error('Error seeding database:', stderr);
      return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
} 