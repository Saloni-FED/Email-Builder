import { Metadata } from 'next';
import { getTemplate } from '@/lib/db';
import TemplateEditor from '@/components/TemplateEditor';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Edit Email Templates Online - Easy & Responsive Editor',
  description: 'Effortlessly edit and customize email templates for your campaigns. Create professional, responsive, and eye-catching emails in minutes.',
  keywords: 'edit email templates, email template editor, responsive email editor, email marketing, email builder, customize email templates',
};


export default async function EditTemplate({ params }: { params: { id: string } }) {
  const template = params.id === 'new' ? {
    id: 'new',
    name: '',
    subject: '',
    sections: []
  } : await getTemplate(params.id);

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Template</h1>
      <TemplateEditor template={template} />
      <Toaster />
    </main>
  );
}
