import { PrismaClient } from "@prisma/client"
import { User, Role, EnglishLevel } from "@prisma/client"
import shajs from "sha.js"

export async function getAllUsers() {
  const prisma = new PrismaClient()
  try {
    const users = await prisma.user.findMany()
    return users
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function getUserById(id: string) {
  const prisma = new PrismaClient()
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    return user
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function createUser(user: User) {
  const prisma = new PrismaClient()
  try {
    // Validation
    const { email, name, role, englishLevel, password } = user

    if (!email || !name || !role || !password) {
      throw new Error("Missing required fields")
    }

    if (!Object.values(Role).includes(role)) {
      throw new Error("Invalid role value")
    }

    if (englishLevel && !Object.values(EnglishLevel).includes(englishLevel)) {
      throw new Error("Invalid englishLevel value")
    }

    const hashedPassword = shajs("sha256").update(password).digest("hex")

    const newUser = await prisma.user.create({ data: { ...user, password: hashedPassword } })
    return newUser
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function updateUser(id: string, user: User) {
  const prisma = new PrismaClient()
  try {
    const { email, name, role, englishLevel, techSkills, cvLink, password } = user

    if (!email && !name && !role && !englishLevel && !techSkills && !cvLink && !password) {
      throw new Error("Missing required fields")
    }

    if (role && !Object.values(Role).includes(role)) {
      throw new Error("Invalid role value")
    }

    if (englishLevel && !Object.values(EnglishLevel).includes(englishLevel)) {
      throw new Error("Invalid englishLevel value")
    }

    const hashedPassword = password ? shajs("sha256").update(password).digest("hex") : undefined

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { ...user, password: hashedPassword },
    })
    return updatedUser
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function deleteUser(id: string) {
  const prisma = new PrismaClient()
  try {
    const deletedUser = await prisma.user.delete({ where: { id } })
    return deletedUser
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const prisma = new PrismaClient()
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return null
    }

    const hashedPassword = shajs("sha256").update(password).digest("hex")

    if (user.password !== hashedPassword) {
      return null
    }

    return user
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}
