'use client'

import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/utils/api'

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      setMessage('Enter your email address and password.')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      await login(email.trim(), password)
      const returnTo = new URLSearchParams(window.location.search).get('returnTo')
      router.replace(returnTo === '/checkout' ? returnTo : '/dashboard')
    } catch (error) {
      const responseBody = axios.isAxiosError<{ message?: unknown; error?: unknown }>(error)
        ? error.response?.data
        : null
      const responseMessage =
        typeof responseBody?.message === 'string'
          ? responseBody.message
          : typeof responseBody?.error === 'string'
            ? responseBody.error
            : null
      const errorMessage =
        responseMessage ?? (error instanceof Error ? error.message : null)

      setMessage(
        errorMessage ?? 'Unable to sign in. Check your details and try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h2 className="mt-7 text-3xl font-semibold tracking-tight text-neutral-950">Welcome back</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Sign in to pick up where your collection left off.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        <div className="space-y-2">
          <label htmlFor="login-email" className="block text-sm font-medium text-neutral-800">
            Email address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            onChange={() => setMessage('')}
            className="h-12 w-full rounded-md border border-neutral-300 bg-white px-4 text-base text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#a53b2b] focus:ring-2 focus:ring-[#a53b2b]/15"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="block text-sm font-medium text-neutral-800">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              onChange={() => setMessage('')}
              className="h-12 w-full rounded-md border border-neutral-300 bg-white px-4 pr-12 text-base text-neutral-950 outline-none transition focus:border-[#a53b2b] focus:ring-2 focus:ring-[#a53b2b]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a53b2b]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>


        <button
          type="submit"
          className="h-12 w-full rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-[#a53b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a53b2b] focus-visible:ring-offset-2"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
        <p role="status" aria-live="polite" className="min-h-10 text-sm text-neutral-600">
          {message}
        </p>
      </form>
    </>
  )
}