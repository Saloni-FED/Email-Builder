import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri : any = process.env.MONGODB_URI
const client = new MongoClient(uri)

export async function POST(request: Request) {
  try {
    const templateData = await request.json()

    await client.connect()
    const database = client.db("email_templates")
    const collection = database.collection("templates")

    const result = await collection.insertOne(templateData)

    return NextResponse.json({
      message: "Template saved successfully",
      templateId: result.insertedId,
    })
  } catch (error) {
    console.error("Error saving template:", error)
    return NextResponse.json({ error: "Failed to save template" }, { status: 500 })
  } finally {
    await client.close()
  }
}

