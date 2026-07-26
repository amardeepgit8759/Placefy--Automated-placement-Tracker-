import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/getSessionUser"

const JSON_FIELDS = [
  "syllabus",
  "roadmap",
  "completedTopics",
  "completedRoadmapTasks",
  "taskCompletionDates",
  "revisionPlan",
  "weakAreas"
]

export async function GET() {
  const userId = await getSessionUser()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Parse JSON string fields back into objects/arrays
    const parsedProfile: any = { ...profile }
    JSON_FIELDS.forEach(field => {
      if (typeof parsedProfile[field] === "string") {
        try {
          parsedProfile[field] = JSON.parse(parsedProfile[field])
        } catch (e) {
          // If parsing fails, default to empty array or object based on typical usage
          parsedProfile[field] = field === "taskCompletionDates" ? {} : []
        }
      }
    })

    return NextResponse.json(parsedProfile)
  } catch (error) {
    console.error("Profile GET Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const userId = await getSessionUser()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const updateData: any = {}

    // Iterate over provided fields. If it's a known JSON field and it's an object/array, stringify it
    for (const [key, value] of Object.entries(body)) {
      if (JSON_FIELDS.includes(key)) {
        updateData[key] = JSON.stringify(value)
      } else if (key !== "id" && key !== "userId" && key !== "user") {
        // Prevent overwriting primary keys or relations
        updateData[key] = value
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: updateData
    })

    // Parse it back before returning
    const parsedProfile: any = { ...updatedProfile }
    JSON_FIELDS.forEach(field => {
      if (typeof parsedProfile[field] === "string") {
        try {
          parsedProfile[field] = JSON.parse(parsedProfile[field])
        } catch (e) {
          parsedProfile[field] = field === "taskCompletionDates" ? {} : []
        }
      }
    })

    return NextResponse.json(parsedProfile)
  } catch (error) {
    console.error("Profile PATCH Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
