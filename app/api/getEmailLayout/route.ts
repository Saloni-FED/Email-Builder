import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const layoutPath = path.join(process.cwd(), 'app/templates/layout.html')
    const layoutContent = await fs.promises.readFile(layoutPath, 'utf-8')
    return NextResponse.json({ layout: layoutContent })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load template' }, { status: 500 })
  }
}

