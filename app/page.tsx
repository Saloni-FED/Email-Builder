import Link from 'next/link'
import { getTemplates } from '@/lib/db'

export default async function Home() {
  const templates = await getTemplates()

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email Templates</h1>
      <ul className="space-y-2">
        {templates.map(template => (
          <li key={template.id} className="border p-4 rounded-md">
            <Link href={`/edit/${template.id}`} className="text-blue-600 hover:underline">
              {template.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/edit/new" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create New Template
      </Link>
    </main>
  )
}

