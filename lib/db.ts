export interface TemplateSection {
  type: "header" | "paragraph" | "button" | "image"
  content: string
  style?: Record<string, string>
}

export interface Template {
  id: string
  name: string
  subject: string
  sections: TemplateSection[]
}

const templates: Template[] = [
  {
    id: "1",
    name: "Modern Welcome",
    subject: "Welcome to Our Platform",
    sections: [
      {
        type: "header",
        content: "Email has never been easier",
        style: {
          fontSize: "42px",
          fontWeight: "bold",
          textAlign: "left",
          marginBottom: "24px",
          color: "#000",
          lineHeight: "1.2",
        },
      },
      {
        type: "paragraph",
        content:
          "Create beautiful and sophisticated emails in minutes. No coding required, and minimal setup. The way email should be.",
        style: {
          textAlign: "left",
          color: "#666",
          fontSize: "18px",
          lineHeight: "1.6",
          marginBottom: "32px",
          maxWidth: "600px",
        },
      },
      {
        type: "button",
        content: "Get started",
        style: {
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          fontWeight: "500",
          fontSize: "16px",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "40px",
        },
      },
      {
        type: "image",
        content: "/placeholder.svg",
        style: {
          width: "100%",
          maxWidth: "600px",
          height: "auto",
          display: "block",
          margin: "0",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
        },
      },
    ],
  },
  {
    id: "2",
    name: "Newsletter",
    subject: "This Week's Updates",
    sections: [
      { type: "header", content: "Newsletter", style: { color: "#333", fontSize: "24px" } },
      { type: "paragraph", content: "Here are this week's top stories...", style: { color: "#666" } },
    ],
  },
]

export async function getTemplates(): Promise<Template[]> {
  return templates
}

export async function getTemplate(id: string): Promise<Template | undefined> {
  return templates.find((t) => t.id === id)
}

export async function saveTemplate(template: Template): Promise<Template> {
  const index = templates.findIndex((t) => t.id === template.id)
  if (index !== -1) {
    templates[index] = template
  } else {
    template.id = (templates.length + 1).toString()
    templates.push(template)
  }
  return template
}

