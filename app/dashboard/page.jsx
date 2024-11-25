import React from "react"
import { House } from "@phosphor-icons/react/dist/ssr"

export default function DashboardHome() {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <House weight='fill' className='size-12' />
      <h1 className='text-2xl font-bold'>Dashboard | home</h1>
    </div>
  )
}
