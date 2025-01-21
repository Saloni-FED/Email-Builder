"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { Template, TemplateSection } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toolbar, ToolbarButton } from "@/components/ui/toolbar"
import { Panel, PanelHeader } from "@/components/ui/panel"
import { ColorPicker } from "./ColorPicker"
import { saveTemplate } from "@/app/actions"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Type,
  Square,
  MousePointer,
  Save,
  Download,
  Plus,
  Menu,
  Trash2,
} from "lucide-react"

export default function TemplateEditor({ template }: { template: Template }) {
  const allowedSectionTypes = Array.from(new Set(template.sections.map((section) => section.type)))
  const [name, setName] = useState(template.name)
  const [subject, setSubject] = useState(template.subject)
  const [sections, setSections] = useState(template.sections)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTool, setSelectedTool] = useState("pointer")
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)
    const templateData = {
      name,
      subject,
      sections: sections.map((section) => ({
        type: section.type,
        content: section.content,
        style: section.style,
      })),
    }

    try {
      const response = await fetch("/api/uploadEmailConfig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      })

      if (!response.ok) {
        throw new Error("Failed to save template")
      }

      const savedTemplate = await response.json()
      console.log("Template saved successfully:", savedTemplate)
      router.push("/")
    } catch (error) {
      console.error("Error saving template:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSection = (type: TemplateSection["type"]) => {
    if (!allowedSectionTypes.includes(type)) return
    const newSection = {
      type,
      content: "",
      style: {
        color: "#000000",
        backgroundColor: "#FFFFFF",
        fontSize: "16px",
        textAlign: "left",
        width: "100%",
        height: "auto",
      },
    }
    setSections([...sections, newSection])
    setSelectedSection(sections.length)
  }

  const handleImageUpload = async (file: File): Promise<{ dataUrl: string; serverUrl: string }> => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          if (selectedSection !== null) {
            const newSections = [...sections]
            newSections[selectedSection] = {
              ...newSections[selectedSection],
              content: reader.result,
            }
            setSections(newSections)

            // Upload to backend
            try {
              const formData = new FormData()
              formData.append("file", file)

              const response = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData,
              })

              if (!response.ok) {
                throw new Error("Failed to upload image to server")
              }

              const { url: serverUrl } = await response.json()

              resolve({
                dataUrl: reader.result,
                serverUrl,
              })
            } catch (error) {
              console.error("Error uploading image:", error)
              reject(error)
            }
          } else {
            reject(new Error("No section selected"))
          }
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }
      reader.readAsDataURL(file)
    })
  }


  const handleImageEdit = (property: string, value: string) => {
    if (selectedSection !== null) {
      const newSections = [...sections]
      newSections[selectedSection].style = {
        ...newSections[selectedSection].style,
        [property]: value,
      }
      setSections(newSections)
    }
  }

  const handleDownloadHTML = () => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #000000;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 16px;
          margin-bottom: 40px;
          border: none;
        }
        .button:hover {
          opacity: 0.9;
        }
        .image-container {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${sections
          .map((section) => {
            const style = Object.entries(section.style || {})
              .map(([key, value]) => `${key}:${value}`)
              .join(";")
            switch (section.type) {
              case "header":
                return `<h1 style="${style}">${section.content}</h1>`
              case "paragraph":
                return `<p style="${style}">${section.content}</p>`
              case "button":
                return `<a href="#" class="button" style="${style}">${section.content}</a>`
              case "image":
                const isBase64 = section.content.startsWith("data:image")
                return `<div class="image-container">
                  <img src="${isBase64 ? section.content : "/placeholder.svg"}" 
                       alt="${ ""}" 
                       style="${style}" />
                </div>`
              default:
                return ""
            }
          })
          .join("\n")}
      </div>
    </body>
    </html>
  `
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${name || "email-template"}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleImageUpload(file)
          }
        }}
      />
      {/* Top Toolbar */}
      <div className="sticky top-0 z-10 backdrop-blur-lg border-b bg-white/50">
        <div className="container mx-auto p-2">
          <div className="flex items-center justify-between">
            <Toolbar className="hidden md:flex">
              <ToolbarButton active={selectedTool === "pointer"} onClick={() => setSelectedTool("pointer")}>
                <MousePointer className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton active={selectedTool === "text"} onClick={() => setSelectedTool("text")}>
                <Type className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton active={selectedTool === "image"} onClick={() => setSelectedTool("image")}>
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton active={selectedTool === "shape"} onClick={() => setSelectedTool("shape")}>
                <Square className="w-4 h-4" />
              </ToolbarButton>
            </Toolbar>

            <Button variant="ghost" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </Button>

            <div className="flex items-center gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
              </Button>
              <Button variant="outline" onClick={handleDownloadHTML}>
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b"
          >
            <div className="container mx-auto p-4">
              <Toolbar className="flex-wrap justify-center">
                <ToolbarButton active={selectedTool === "pointer"} onClick={() => setSelectedTool("pointer")}>
                  <MousePointer className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton active={selectedTool === "text"} onClick={() => setSelectedTool("text")}>
                  <Type className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton active={selectedTool === "image"} onClick={() => setSelectedTool("image")}>
                  <ImageIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton active={selectedTool === "shape"} onClick={() => setSelectedTool("shape")}>
                  <Square className="w-4 h-4" />
                </ToolbarButton>
              </Toolbar>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-64 flex flex-col gap-4"
          >
            <Panel>
              <PanelHeader>
                <h3 className="font-medium">Template</h3>
              </PanelHeader>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
                </div>
              </div>
            </Panel>

            <Panel>
              <PanelHeader>
                <h3 className="font-medium">Add Section</h3>
              </PanelHeader>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                {allowedSectionTypes.includes("header") && (
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => handleAddSection("header")}
                  >
                    <Type className="w-5 h-5 mb-1" />
                    Header
                  </Button>
                )}
                {allowedSectionTypes.includes("paragraph") && (
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => handleAddSection("paragraph")}
                  >
                    <AlignLeft className="w-5 h-5 mb-1" />
                    Text
                  </Button>
                )}
                {allowedSectionTypes.includes("button") && (
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => handleAddSection("button")}
                  >
                    <Square className="w-5 h-5 mb-1" />
                    Button
                  </Button>
                )}
                {allowedSectionTypes.includes("image") && (
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => handleAddSection("image")}
                  >
                    <ImageIcon className="w-5 h-5 mb-1" />
                    Image
                  </Button>
                )}
              </div>
            </Panel>
          </motion.div>

          {/* Main Editor */}
          <motion.div layout className="flex-1 min-h-[400px] lg:min-h-[800px] bg-white rounded-lg shadow-sm border">
            <div className="p-4 lg:p-8">
              <AnimatePresence>
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "p-4 rounded-lg border-2 border-transparent hover:border-blue-200 cursor-pointer transition-colors relative group",
                      selectedSection === index && "border-blue-500",
                    )}
                    onClick={() => setSelectedSection(index)}
                  >
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        const newSections = sections.filter((_, i) => i !== index)
                        setSections(newSections)
                        setSelectedSection(null)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {section.type === "header" && <h1 style={section.style}>{section.content || "Header Text"}</h1>}
                    {section.type === "paragraph" && <p style={section.style}>{section.content || "Paragraph Text"}</p>}
                    {section.type === "button" && <button style={section.style}>{section.content || "Button"}</button>}
                    {section.type === "image" && (
                      <img
                        src={section.content || "/placeholder.svg"}
                        alt={ "Template image"}
                        style={section.style}
                        className="max-w-full"
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <AnimatePresence>
            {selectedSection !== null && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full lg:w-64"
              >
                <Panel>
                  <PanelHeader>
                    <h3 className="font-medium">Style</h3>
                  </PanelHeader>
                  <div className="p-4 space-y-4">
                    {sections[selectedSection].type === "image" ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Image URL</label>
                          <Input
                            value={sections[selectedSection].content}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[selectedSection].content = e.target.value
                              setSections(newSections)
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Alt Text</label>
                          {/* <Input
                            value={sections[selectedSection].alt || ""}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[selectedSection].alt = e.target.value
                              setSections(newSections)
                            }}
                            className="mt-1"
                          /> */}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Width</label>
                          <Input
                            value={sections[selectedSection].style?.width || "100%"}
                            onChange={(e) => handleImageEdit("width", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Height</label>
                          <Input
                            value={sections[selectedSection].style?.height || "auto"}
                            onChange={(e) => handleImageEdit("height", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                          Upload New Image
                        </Button>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Content</label>
                          <Textarea
                            value={sections[selectedSection].content}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[selectedSection].content = e.target.value
                              setSections(newSections)
                            }}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Colors</label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Text:</span>
                              <ColorPicker
                                color={sections[selectedSection].style?.color || "#000000"}
                                onChange={(color) => {
                                  const newSections = [...sections]
                                  newSections[selectedSection].style = {
                                    ...newSections[selectedSection].style,
                                    color,
                                  }
                                  setSections(newSections)
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Background:</span>
                              <ColorPicker
                                color={sections[selectedSection].style?.backgroundColor || "#FFFFFF"}
                                onChange={(color) => {
                                  const newSections = [...sections]
                                  newSections[selectedSection].style = {
                                    ...newSections[selectedSection].style,
                                    backgroundColor: color,
                                  }
                                  setSections(newSections)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Alignment</label>
                          <div className="mt-2">
                            <Toolbar>
                              <ToolbarButton
                                active={sections[selectedSection].style?.textAlign === "left"}
                                onClick={() => handleImageEdit("textAlign", "left")}
                              >
                                <AlignLeft className="w-4 h-4" />
                              </ToolbarButton>
                              <ToolbarButton
                                active={sections[selectedSection].style?.textAlign === "center"}
                                onClick={() => handleImageEdit("textAlign", "center")}
                              >
                                <AlignCenter className="w-4 h-4" />
                              </ToolbarButton>
                              <ToolbarButton
                                active={sections[selectedSection].style?.textAlign === "right"}
                                onClick={() => handleImageEdit("textAlign", "right")}
                              >
                                <AlignRight className="w-4 h-4" />
                              </ToolbarButton>
                            </Toolbar>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Panel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

