import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Save file to public/uploads directory
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(process.cwd(), 'public/uploads', filename)
    await writeFile(filepath, buffer)
    
    return NextResponse.json({ 
      url: `/uploads/${filename}`,
      message: 'File uploaded successfully' 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

