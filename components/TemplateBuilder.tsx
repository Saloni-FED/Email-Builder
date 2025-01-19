'use client'

import { useState, useRef } from 'react'
import { Template, TemplateSection } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function TemplateBuilder({ initialTemplate }: { initialTemplate?: Template }) {
  const [template, setTemplate] = useState<Template>(initialTemplate || {
    id: '',
    name: '',
    subject: '',
    sections: []
  })
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      return data.url
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      })
      return null
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/uploadEmailConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
      })

      if (!response.ok) throw new Error('Save failed')

      toast({
        title: "Success",
        description: "Template saved successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/renderAndDownloadTemplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: template.id,
          data: {} // Add any dynamic data here
        })
      })

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template.name}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download template",
        variant: "destructive"
      })
    }
  }

  const handleAddImage = async (index: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
      fileInputRef.current.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const imageUrl = await handleImageUpload(file)
          if (imageUrl) {
            const newSections = [...template.sections]
            newSections[index] = {
              ...newSections[index],
              content: imageUrl
            }
            setTemplate({ ...template, sections: newSections })
          }
        }
      }
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
      />
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
        <Input
          id="name"
          value={template.name}
          onChange={(e) => setTemplate({ ...template, name: e.target.value })}
          className="mt-1"
        />
      </div>

      {/* Template sections editor */}
      <div>
        <h3 className="text-lg font-medium">Sections</h3>
        {template.sections.map((section, index) => (
          <div key={index} className="mt-4 p-4 border rounded-md">
            <select
              value={section.type}
              onChange={(e) => {
                const newSections = [...template.sections]
                newSections[index] = {
                  ...section,
                  type: e.target.value as TemplateSection['type']
                }
                setTemplate({ ...template, sections: newSections })
              }}
              className="mb-2 p-2 border rounded"
            >
              <option value="logo">Logo</option>
              <option value="header">Header</option>
              <option value="paragraph">Paragraph</option>
              <option value="button-group">Button Group</option>
              <option value="button">Button</option>
              <option value="image">Image</option>
            </select>

            {section.type === 'image' ? (
              <Button onClick={() => handleAddImage(index)}>
                Upload Image
              </Button>
            ) : (
              <Textarea
                value={section.content}
                onChange={(e) => {
                  const newSections = [...template.sections]
                  newSections[index] = {
                    ...section,
                    content: e.target.value
                  }
                  setTemplate({ ...template, sections: newSections })
                }}
                className="mt-1 w-full"
                rows={3}
              />
            )}

            <Button 
              onClick={() => {
                const newSections = template.sections.filter((_, i) => i !== index)
                setTemplate({ ...template, sections: newSections })
              }}
              variant="destructive"
              className="mt-2"
            >
              Remove Section
            </Button>
          </div>
        ))}

        <Button
          onClick={() => {
            setTemplate({
              ...template,
              sections: [
                ...template.sections,
                { type: 'paragraph', content: '', style: {} }
              ]
            })
          }}
          className="mt-4"
        >
          Add Section
        </Button>
      </div>

      <div className="flex space-x-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Template'}
        </Button>
        <Button onClick={handleDownload} variant="outline">
          Download HTML
        </Button>
      </div>
    </div>
  )
}

