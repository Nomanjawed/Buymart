'use client'

import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { registerUser } from '@/utils/api'

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const username = formData.get('username')
    const fullname = formData.get('fullname')
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (
      typeof username !== 'string' || !username.trim() ||
      typeof fullname !== 'string' || !fullname.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof password !== 'string' || password.length < 8
    ) {
      setMessage('Complete all fields. Your password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Those passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      await registerUser(username.trim(), fullname.trim(), email.trim(), password)
      setMessage('Your account has been created. You can now sign in.')
      form.reset()
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

      setMessage(
        responseMessage ?? (error instanceof Error ? error.message : 'Unable to create your account. Please try again.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h2 className="mt-7 text-3xl font-semibold tracking-tight text-neutral-950">Create your account</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Create an account to start building your collection.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        <div className="space-y-2">
          <label htmlFor="register-name" className="block text-sm font-medium text-neutral-800">
            Full name
          </label>
          <input
            id="register-name"
            name="fullname"
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            onChange={() => setMessage('')}
            className="h-12 w-full rounded-md border border-neutral-300 bg-white px-4 text-base text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#a53b2b] focus:ring-2 focus:ring-[#a53b2b]/15"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="register-username" className="block text-sm font-medium text-neutral-800">
            Username
          </label>
          <input
            id="register-username"
            name="username"
            type="text"
            autoComplete="username"
            required
            onChange={() => setMessage('')}
            className="h-12 w-full rounded-md border border-neutral-300 bg-white px-4 text-base text-neutral-950 outline-none transition focus:border-[#a53b2b] focus:ring-2 focus:ring-[#a53b2b]/15"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="register-email" className="block text-sm font-medium text-neutral-800">
            Email address
          </label>
          <input
            id="register-email"
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
          <label htmlFor="register-password" className="block text-sm font-medium text-neutral-800">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={8}
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
          <p className="text-xs text-neutral-500">Use at least 8 characters.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-confirm-password" className="block text-sm font-medium text-neutral-800">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={8}
              required
              onChange={() => setMessage('')}
              className="h-12 w-full rounded-md border border-neutral-300 bg-white px-4 pr-12 text-base text-neutral-950 outline-none transition focus:border-[#a53b2b] focus:ring-2 focus:ring-[#a53b2b]/15"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a53b2b]"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-[#a53b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a53b2b] focus-visible:ring-offset-2"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
        <p role="status" aria-live="polite" className="min-h-10 text-sm text-neutral-600">
          {message}
        </p>
      </form>
    </>
  )
}