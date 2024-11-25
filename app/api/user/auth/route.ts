import { NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/platform/user"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body
  const user = await authenticateUser(email, password)
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  return NextResponse.json(user)
}
