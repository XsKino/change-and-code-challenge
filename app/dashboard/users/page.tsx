"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { User } from "@prisma/client"
import toast from "react-hot-toast"
import { FieldValues, useForm } from "react-hook-form"

export default function UsersPage() {
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

  const handleCreateUser = async (data: FieldValues) => {
    try {
      const { email, name, englishLevel, techSkills, cvLink, password } = data
      await axios.post("/api/user", {
        email,
        name,
        role: "USER",
        englishLevel,
        techSkills,
        cvLink,
        password,
      })
      toast.success("User created")
      form.reset()
    } catch (error) {
      toast.error("Failed to create user")
    }
  }

  if (isLoading || !currentUser || !users) return <div>Loading...</div>
  return (
    <>
      <div className='flex-1 min-h-screen p-4 flex flex-col gap-4'>
        <header className='flex'>
          <h1 className='text-2xl font-bold'>Users</h1>
          <div className='flex-1 flex justify-end '>
            <div className='flex gap-4 p-2 px-4 rounded bg-base-200'>
              <p>{currentUser?.email}</p>
              <p>|</p>
              <p>{currentUser?.name}</p>
            </div>
          </div>
        </header>

        <div className='overflow-x-auto'>
          <table className='table rounded bg-base-200'>
            {/* head */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <th>{user.id}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className='flex gap-2'>
                    <button
                      onClick={() => {
                        const modal = document.getElementById(
                          `edit-${user.id}`
                        ) as HTMLDialogElement
                        modal?.showModal?.()
                      }}
                      className='btn btn-primary'>
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const modal = document.getElementById(
                          `delete-${user.id}`
                        ) as HTMLDialogElement
                        modal?.showModal?.()
                      }}
                      className='btn btn-error'>
                      Delete
                    </button>

                    <EditUserModal user={user} id={`edit-${user.id}`} />
                    <DeleteUserModal user={user} id={`delete-${user.id}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* create user */}
        <form
          className='card flex flex-col gap-4 p-4 mx-auto container max-w-screen-md bg-base-200'
          onSubmit={form.handleSubmit(handleCreateUser)}>
          <h1 className='text-2xl font-bold'>Add User</h1>
          <label className='flex flex-col gap-2'>
            <p>Name</p>
            <input className='input input-bordered' type='text' {...form.register("name")} />
          </label>
          <label className='flex flex-col gap-2'>
            <p>Email</p>
            <input className='input input-bordered' type='email' {...form.register("email")} />
          </label>
          <label className='flex flex-col gap-2'>
            <p>Password</p>
            <input
              className='input input-bordered'
              type='password'
              {...form.register("password")}
            />
          </label>
          <label className='flex flex-col gap-2'>
            <p>English Level</p>
            <select
              className='select select-bordered'
              defaultValue='A1'
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
              className='textarea textarea-bordered'
              {...form.register("techSkills", { required: false })}
            />
          </label>
          <label className='flex flex-col gap-2'>
            <p>CV Link</p>
            <input
              className='input input-bordered'
              type='text'
              {...form.register("cvLink", { required: false })}
            />
          </label>
          <button className='btn btn-primary'>Create User</button>
        </form>
      </div>
    </>
  )
}

const DeleteUserModal = ({ user, id }: { user: User; id: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const ref = useRef<HTMLDialogElement>(null)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await axios.delete(`/api/user/${user.id}`)
      setIsLoading(false)
      toast.success("User deleted")
      ref.current?.close()
    } catch (error) {
      toast.error("Failed to delete user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <dialog ref={ref} id={id} className='modal'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Delete user {user.name}?</h3>
        <form className='flex gap-2 justify-end' action={handleDelete}>
          <button type='button' onClick={() => ref.current?.close()} className='btn btn-outline'>
            Cancel
          </button>
          <button type='submit' className='btn btn-error'>
            {isLoading && <div className='loading loading-spinner loading-lg'></div>}
            Delete
          </button>
        </form>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  )
}

const EditUserModal = ({ user, id }: { user: User; id: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const ref = useRef<HTMLDialogElement>(null)
  const form = useForm()

  const handleEdit = async (data: FieldValues) => {
    setIsLoading(true)
    try {
      const { email, name, englishLevel, techSkills, cvLink, password } = data
      await axios.put(`/api/user/${user.id}`, {
        email,
        name,
        englishLevel,
        techSkills,
        cvLink,
        password,
      })
      toast.success("User updated")
      ref.current?.close()
    } catch (error) {
      toast.error("Failed to update user")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <dialog ref={ref} id={id} className='modal'>
      <form className='modal-box' onSubmit={form.handleSubmit(handleEdit)}>
        <h3 className='font-bold text-lg'>Edit user {user.name}</h3>

        <label className='flex flex-col gap-2'>
          <p>Name</p>
          <input
            className='input input-bordered'
            type='text'
            defaultValue={user.name}
            {...form.register("name")}
          />
        </label>
        <label className='flex flex-col gap-2'>
          <p>Email</p>
          <input
            className='input input-bordered'
            type='email'
            defaultValue={user.email}
            {...form.register("email")}
          />
        </label>
        <label className='flex flex-col gap-2'>
          <p>Password</p>
          <input className='input input-bordered' type='password' {...form.register("password")} />
        </label>
        <label className='flex flex-col gap-2'>
          <p>English Level</p>
          <select
            className='select select-bordered'
            defaultValue={user.englishLevel}
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
            className='textarea textarea-bordered'
            defaultValue={user.techSkills}
            {...form.register("techSkills", { required: false })}
          />
        </label>
        <label className='flex flex-col gap-2'>
          <p>CV Link</p>
          <input
            className='input input-bordered'
            defaultValue={user.cvLink}
            type='text'
            {...form.register("cvLink", { required: false })}
          />
        </label>

        <footer className='flex gap-2 justify-end'>
          <button type='button' onClick={() => ref.current?.close()} className='btn btn-outline'>
            Cancel
          </button>
          <button type='submit' className='btn btn-primary'>
            {isLoading && <div className='loading loading-spinner loading-lg'></div>}
            Update
          </button>
        </footer>
      </form>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  )
}
