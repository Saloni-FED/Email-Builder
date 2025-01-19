import { Template } from './types'

export async function renderTemplate(template: Template, data: any): Promise<string> {
  // Convert template sections to HTML
  const sectionsHtml = template.sections.map(section => {
    const style = Object.entries(section.style || {})
      .map(([key, value]) => `${key}:${value}`)
      .join(';')

    switch (section.type) {
      case 'logo':
        return `<div style="${style}">${section.content}</div>`
      case 'header':
        return `<h1 style="${style}">${section.content}</h1>`
      case 'paragraph':
        return `<p style="${style}">${section.content}</p>`
      case 'button-group':
        return `<div style="${style}">`
      case 'button':
        return `<button style="${style}">${section.content}</button>`
      case 'image':
        return `<img src="${section.content}" style="${style}" alt="Template image" />`
      default:
        return ''
    }
  }).join('\n')

  // If there's a custom layout, use it; otherwise, use default layout
  const layout = template.layout || `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${template.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        {{content}}
      </div>
    </body>
    </html>
  `

  // Replace content placeholder with actual content
  return layout.replace('{{content}}', sectionsHtml)
}

