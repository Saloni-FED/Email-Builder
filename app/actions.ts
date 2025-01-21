'use server'

import { Template, saveTemplate as dbSaveTemplate } from '@/lib/db'

export async function saveTemplate(template: Template) {
  // In a real application, you might want to add validation here
  
  return await dbSaveTemplate(template)
}

