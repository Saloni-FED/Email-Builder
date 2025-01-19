export interface TemplateSection {
  type: 'header' | 'paragraph' | 'button' | 'logo' | 'button-group' | 'image';
  content: string;
  style?: Record<string, string>;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  sections: TemplateSection[];
}

let templates: Template[] = [
  {
    id: '1',
    name: 'Modern Welcome',
    subject: 'Welcome to Our Platform',
    sections: [
      {
        type: 'logo',
        content: 'ADD LOGO',
        style: {
          textAlign: 'center',
          padding: '20px',
          color: '#666',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          margin: '20px auto',
          width: 'fit-content'
        }
      },
      {
        type: 'header',
        content: 'Email has never been easier',
        style: {
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px',
          color: '#000',
          border: '1px solid #e5e5e5',
          padding: '15px',
          borderRadius: '4px'
        }
      },
      {
        type: 'paragraph',
        content: 'Create beautiful and sophisticated emails in minutes. No coding required, and minimal setup. The way email should be.',
        style: {
          textAlign: 'center',
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '30px'
        }
      },
      {
        type: 'button-group',
        content: '',
        style: {
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '30px'
        }
      },
      {
        type: 'button',
        content: 'Get started',
        style: {
          backgroundColor: '#000',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '500'
        }
      },
      {
        type: 'button',
        content: 'Learn more',
        style: {
          backgroundColor: 'transparent',
          color: '#000',
          padding: '12px 24px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '500'
        }
      },
      {
        type: 'image',
        content: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7XkBkOxOtb07C04QU3xvgJ0wfFzHkP.png',
        style: {
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          display: 'block',
          margin: '0 auto',
          borderRadius: '8px'
        }
      }
    ]
  },
  // Keep existing templates...
  {
    id: '2',
    name: 'Newsletter',
    subject: 'This Week\'s Updates',
    sections: [
      { type: 'header', content: 'Newsletter', style: { color: '#333', fontSize: '24px' } },
      { type: 'paragraph', content: 'Here are this week\'s top stories...', style: { color: '#666' } }
    ]
  }
];

export async function getTemplates(): Promise<Template[]> {
  return templates;
}

export async function getTemplate(id: string): Promise<Template | undefined> {
  return templates.find(t => t.id === id);
}

export async function saveTemplate(template: Template): Promise<Template> {
  const index = templates.findIndex(t => t.id === template.id);
  if (index !== -1) {
    templates[index] = template;
  } else {
    template.id = (templates.length + 1).toString();
    templates.push(template);
  }
  return template;
}

