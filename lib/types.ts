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
  layout?: string;
}

