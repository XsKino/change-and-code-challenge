import Link from "next/link"

export default function Home() {
  return (
    <main className='min-h-screen p-8 flex gap-8 justify-center items-center'>
      <Link className='btn btn-primary' href='/login'>
        Login
      </Link>
      <Link className='btn btn-secondary' href='/signup'>
        Signup
      </Link>
    </main>
  )
}
