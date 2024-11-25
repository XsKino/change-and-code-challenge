/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React from "react"
import axios from "axios"
import { useForm, FieldValues } from "react-hook-form"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const router = useRouter()

  const onSubmit = async (data: FieldValues) => {
    const email = data.email
    const password = data.password

    if (!email || !password) return

    try {
      const { data: user } = await axios.post("/api/user/auth", { email, password })

      localStorage.setItem("userId", user.id)
      if (user) router.push("/dashboard")
    } catch (error) {
      toast.error("Invalid credentials")
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-base-100'>
      <div className='max-w-md w-full space-y-8 p-8 bg-base-200 rounded-lg shadow'>
        <div>
          <h1 className='text-3xl font-bold text-center'>Login</h1>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium'>
                Email address
              </label>
              <input
                {...register("email", { required: { value: true, message: "Email is required" } })}
                id='email'
                name='email'
                type='email'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
              {errors.email && <p className='text-error'>{errors?.email?.message as string}</p>}
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium'>
                Password
              </label>
              <input
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                })}
                id='password'
                name='password'
                type='password'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
              {errors.password && (
                <p className='text-error'>{errors?.password?.message as string}</p>
              )}
            </div>
          </div>
          <button
            type='submit'
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}
