import Link from "next/link"
import { Plus, Mail, ArrowRight } from "lucide-react"
import { getTemplates } from "@/lib/db"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default async function Home() {
  const templates = await getTemplates()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Email Template Builder</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create and manage professional email templates with our intuitive builder. Start crafting engaging emails
            today.
          </p>
         
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {templates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="truncate">{template.name}</span>
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Email Template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                  <Mail className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="ml-auto group-hover:translate-x-1 transition-transform">
                  <Link href={`/edit/${template.id}`}>
                    Edit Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Create New Template Card */}
          
        </div>
      </main>
      <Toaster />
    </div>
  )
}

