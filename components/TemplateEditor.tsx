'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Template, TemplateSection } from '@/lib/db'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { saveTemplate } from '@/app/actions'

export default function TemplateEditor({ template }: { template: Template }) {
  const [name, setName] = useState(template.name)
  const [subject, setSubject] = useState(template.subject)
  const [sections, setSections] = useState(template.sections)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)
    const updatedTemplate = await saveTemplate({ ...template, name, subject, sections })
    setIsSaving(false)
    router.push('/')
  }

  const handleAddSection = (type: TemplateSection['type']) => {
    setSections([...sections, { type, content: '', style: {} }])
  }

  const handleUpdateSection = (index: number, updatedSection: TemplateSection) => {
    const newSections = [...sections]
    newSections[index] = updatedSection
    setSections(newSections)
  }

  const handleRemoveSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index)
    setSections(newSections)
  }

  const handleDownloadHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          ${sections.map(section => {
            const style = Object.entries(section.style || {}).map(([key, value]) => `${key}:${value}`).join(';')
            switch (section.type) {
              case 'logo':
                return `<div style="${style}">${section.content}</div>`
              case 'header':
                return `<h1 style="${style}">${section.content}</h1>`
              case 'paragraph':
                return `<p style="${style}">${section.content}</p>`
              case 'button-group':
                return `<div style="${style}"></div>`
              case 'button':
                return `<button style="${style}">${section.content}</button>`
              case 'image':
                return `<img src="${section.content}" style="${style}" alt="Template image" />`
              default:
                return ''
            }
          }).join('\n')}
        </div>
      </body>
      </html>
    `
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      {/* Editor Section */}
      <div className="lg:w-1/2 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium">Sections</h3>
          {sections.map((section, index) => (
            <div key={index} className="mt-4 p-4 border rounded-md">
              <select
                value={section.type}
                onChange={(e) => handleUpdateSection(index, { ...section, type: e.target.value as TemplateSection['type'] })}
                className="mb-2 p-2 border rounded"
              >
                <option value="logo">Logo</option>
                <option value="header">Header</option>
                <option value="paragraph">Paragraph</option>
                <option value="button-group">Button Group</option>
                <option value="button">Button</option>
                <option value="image">Image</option>
              </select>
              <Textarea
                value={section.content}
                onChange={(e) => handleUpdateSection(index, { ...section, content: e.target.value })}
                className="mt-1 w-full"
                rows={3}
              />
              <Textarea
                value={JSON.stringify(section.style, null, 2)}
                onChange={(e) => {
                  try {
                    const style = JSON.parse(e.target.value)
                    handleUpdateSection(index, { ...section, style })
                  } catch (error) {
                    // Invalid JSON, do nothing
                  }
                }}
                className="mt-1 w-full font-mono"
                rows={3}
                placeholder="Enter JSON style object"
              />
              <Button onClick={() => handleRemoveSection(index)} variant="destructive" className="mt-2">
                Remove Section
              </Button>
            </div>
          ))}
          <div className="mt-4 space-x-2">
            <Button onClick={() => handleAddSection('logo')} variant="outline">Add Logo</Button>
            <Button onClick={() => handleAddSection('header')} variant="outline">Add Header</Button>
            <Button onClick={() => handleAddSection('paragraph')} variant="outline">Add Paragraph</Button>
            <Button onClick={() => handleAddSection('button-group')} variant="outline">Add Button Group</Button>
            <Button onClick={() => handleAddSection('button')} variant="outline">Add Button</Button>
            <Button onClick={() => handleAddSection('image')} variant="outline">Add Image</Button>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Template'}
          </Button>
          <Button onClick={handleDownloadHTML} variant="outline">
            Download HTML
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="lg:w-1/2 mt-8 lg:mt-0 p-4 border rounded-md bg-gray-50 overflow-auto">
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <div className="max-w-2xl mx-auto">
          {sections.map((section, index) => {
            const style = section.style || {}
            switch (section.type) {
              case 'logo':
                return <div key={index} style={style}>{section.content}</div>
              case 'header':
                return <h1 key={index} style={style}>{section.content}</h1>
              case 'paragraph':
                return <p key={index} style={style}>{section.content}</p>
              case 'button-group':
                return <div key={index} style={style}></div>
              case 'button':
                return <button key={index} style={style}>{section.content}</button>
              case 'image':
                return <img key={index} src={section.content || "/placeholder.svg"} style={style} alt="Template" />
              default:
                return null
            }
          })}
        </div>
      </div>
    </div>
  )
}
