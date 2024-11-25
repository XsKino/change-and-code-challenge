import { NextRequest, NextResponse } from "next/server"
import { getUserById, updateUser, deleteUser } from "@/platform/user"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const user = await getUserById(id)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user", message: error }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const body = await request.json()

  try {
    const user = await updateUser(id, body)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user", message: error }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    await deleteUser(id)
    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user", message: error }, { status: 500 })
  }
}
