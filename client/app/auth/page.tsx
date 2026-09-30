'use client'

import Image from 'next/image'
import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <main className="grid flex-1 bg-[#f4f4f1] lg:grid-cols-2">
      <section className="relative hidden min-h-170 overflow-hidden bg-neutral-900 lg:block">
        <Image
          src="/car.jpg"
          alt="Detailed miniature car model"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
            BUYMART / COLLECTORS&apos; EDITION
          </p>
          <h1 className="max-w-lg text-4xl font-semibold leading-tight xl:text-5xl">
            Bring your favorite worlds home.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-white/80">
            Find the models, details, and little obsessions worth making room for.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-14 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a53b2b] lg:hidden">
            BUYMART
          </p>

          <div className="mt-7 grid grid-cols-2 rounded-md bg-neutral-200 p-1" aria-label="Account type">
            <button
              type="button"
              aria-pressed={!isRegistering}
              aria-controls="auth-form-panel"
              onClick={() => setIsRegistering(false)}
              className={`h-10 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a53b2b] ${
                !isRegistering ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              aria-pressed={isRegistering}
              aria-controls="auth-form-panel"
              onClick={() => setIsRegistering(true)}
              className={`h-10 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a53b2b] ${
                isRegistering ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Create account
            </button>
          </div>

          <div id="auth-form-panel">
            {isRegistering ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      </section>
    </main>
  )
}