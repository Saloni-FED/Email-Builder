import { NextResponse } from 'next/server'
import { getTemplate } from '@/lib/db'
import { renderTemplate } from '@/lib/templateRenderer'

export async function POST(request: Request) {
  try {
    const { templateId, data } = await request.json()
    const template = await getTemplate(templateId)
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const renderedHtml = await renderTemplate(template, data)
    
    return new NextResponse(renderedHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="email-template.html"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to render template' }, { status: 500 })
  }
}

