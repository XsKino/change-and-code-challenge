"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import config from "@/config"
import { useEffect, useState } from "react"
import { User } from "@prisma/client"
import axios from "axios"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentUserId = localStorage.getItem("userId")

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const isAdmin = currentUser?.role === "ADMIN"

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: user } = await axios.get(`/api/user/${currentUserId}`)
      setCurrentUser(user)
    }
    fetchCurrentUser()
  }, [currentUserId])

  if (!currentUser) return null

  return (
    <div className='min-h-screen flex'>
      <nav className='sticky top-0 bg-base-200 border-r h-screen flex flex-col gap-2 p-4'>
        <h1 className='text-2xl font-bold'>{config.dashboard.title}</h1>
        <hr />
        {config.dashboard.navItems.map(item => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          if (item.adminOnly && !isAdmin) return null

          return (
            <Link href={item.href} key={item.label} className='btn btn-ghost justify-start'>
              <item.icon weight={isActive ? "fill" : "regular"} className='size-4' />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className='flex-1 flex flex-col'>{children}</div>
    </div>
  )
}
