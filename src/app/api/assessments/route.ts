import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/getSessionUser"

const JSON_FIELDS = ["domainScores", "strengths", "weaknesses"]

export async function GET() {
  const userId = await getSessionUser()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const assessments = await prisma.assessmentResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })

    const parsedAssessments = assessments.map(assessment => {
      const parsed: any = { ...assessment }
      JSON_FIELDS.forEach(field => {
        if (typeof parsed[field] === "string") {
          try {
            parsed[field] = JSON.parse(parsed[field])
          } catch (e) {
            parsed[field] = field === "domainScores" ? {} : []
          }
        }
      })
      return parsed
    })

    return NextResponse.json(parsedAssessments)
  } catch (error) {
    console.error("Assessments GET Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const userId = await getSessionUser()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { type, score, level, domainScores, strengths, weaknesses, companyMatchPct, feedback } = body

    const newAssessment = await prisma.assessmentResult.create({
      data: {
        userId,
        type,
        score,
        level,
        companyMatchPct,
        feedback,
        domainScores: JSON.stringify(domainScores || {}),
        strengths: JSON.stringify(strengths || []),
        weaknesses: JSON.stringify(weaknesses || [])
      }
    })

    const parsedAssessment: any = { ...newAssessment }
    JSON_FIELDS.forEach(field => {
      if (typeof parsedAssessment[field] === "string") {
        try {
          parsedAssessment[field] = JSON.parse(parsedAssessment[field])
        } catch (e) {
          parsedAssessment[field] = field === "domainScores" ? {} : []
        }
      }
    })

    return NextResponse.json(parsedAssessment, { status: 201 })
  } catch (error) {
    console.error("Assessments POST Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
