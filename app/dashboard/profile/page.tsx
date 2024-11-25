"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react"
import { useForm, FieldValues } from "react-hook-form"
import axios from "axios"
import { User } from "@prisma/client"
import toast from "react-hot-toast"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  const form = useForm()

  const currentUserId = localStorage.getItem("userId")

  useEffect(() => {
    const init = async () => {
      const { data: currentUser } = await axios.get(`/api/user/${currentUserId}`)
      setCurrentUser(currentUser)

      const { data: users } = await axios.get("/api/user")
      setUsers(users)

      setIsLoading(false)
    }

    init()
  }, [currentUserId])

  const handleEditUser = async (data: FieldValues) => {
    try {
      const { name, englishLevel, techSkills, cvLink, password } = data
      await axios.put(`/api/user/${currentUserId}`, {
        name,
        englishLevel,
        techSkills,
        cvLink,
        password,
      })
      toast.success("Profile details updated")
      form.reset()
    } catch (error) {
      toast.error("Failed to update profile details")
    }
  }

  if (isLoading || !currentUser || !users) return <div>Loading...</div>

  return (
    <div className='flex-1 min-h-screen p-4 flex flex-col gap-4'>
      <header className='flex'>
        <div className='flex-1 flex justify-end '>
          <div className='flex gap-4 p-2 px-4 rounded bg-base-200'>
            <p>{currentUser?.email}</p>
            <p>|</p>
            <p>{currentUser?.name}</p>
          </div>
        </div>
      </header>

      {/* edit current user */}
      <form
        className='card flex flex-col gap-4 p-4 mx-auto container max-w-screen-md bg-base-200'
        onSubmit={form.handleSubmit(handleEditUser)}>
        <h1 className='text-2xl font-bold'>Edit Profile</h1>
        <label className='flex flex-col gap-2'>
          <p>Name</p>
          <input
            defaultValue={currentUser.name}
            className='input input-bordered'
            type='text'
            {...form.register("name")}
          />
        </label>
        <label className='flex flex-col gap-2'>
          <p>English Level</p>
          <select
            className='select select-bordered'
            defaultValue={currentUser.englishLevel}
            {...form.register("englishLevel")}>
            <option value='A1'>A1</option>
            <option value='A2'>A2</option>
            <option value='B1'>B1</option>
            <option value='B2'>B2</option>
            <option value='C1'>C1</option>
            <option value='C2'>C2</option>
          </select>
        </label>
        <label className='flex flex-col gap-2'>
          <p>Tech Skills</p>
          <textarea
            defaultValue={currentUser.techSkills}
            className='textarea textarea-bordered'
            {...form.register("techSkills", { required: false })}
          />
        </label>
        <label className='flex flex-col gap-2'>
          <p>CV Link</p>
          <input
            className='input input-bordered'
            type='text'
            defaultValue={currentUser.cvLink}
            {...form.register("cvLink", { required: false })}
          />
        </label>
        <button className='btn btn-primary'>Save</button>
      </form>
    </div>
  )
}
