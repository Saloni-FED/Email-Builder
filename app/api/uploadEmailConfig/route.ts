import { NextResponse } from 'next/server'
import { saveTemplate } from '@/lib/db'
import { Template } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const template = await request.json() as Template
    const savedTemplate = await saveTemplate(template)
    return NextResponse.json(savedTemplate)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
  }
}

