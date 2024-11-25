/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server"
import { getAllUsers, createUser } from "@/platform/user"

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    const user = await createUser(body)

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user", message: error }, { status: 500 })
  }
}
