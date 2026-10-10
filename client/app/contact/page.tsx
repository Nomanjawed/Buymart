'use client'

import Image from 'next/image'
import { Camera, Mail, MapPin, Phone, Send, UsersRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'

const contactInfo = {
  phone: '',
  email: '',
  instagram: '',
  facebook: '',
}

export default function ContactPage() {
  const [formMessage, setFormMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (!contactInfo.email) {
      setFormMessage('Contact email has not been added yet.')
      return
    }

    const fullName = String(formData.get('fullName') || '')
    const email = String(formData.get('email') || '')
    const phone = String(formData.get('phone') || '')
    const message = String(formData.get('message') || '')
    const subject = encodeURIComponent(`Website enquiry from ${fullName}`)
    const body = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\n${message}`,
    )

    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
    setFormMessage('Your email app is opening with your message.')
  }

  return (
    <main className="flex-1 bg-[#f4f4f1] px-4 py-8 text-[#202a26] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 max-w-2xl sm:mb-9">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a53b2b]">
            Get in touch
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Let&apos;s make something memorable.
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
            Questions about a model, a custom design, or an order? Send us a note.
          </p>
        </header>

        <div className="grid overflow-hidden border border-[#deded7] bg-white lg:grid-cols-[0.9fr_1.1fr]">
          <section aria-labelledby="contact-details-title" className="relative isolate min-h-[460px] overflow-hidden bg-[#243b33] text-white sm:min-h-[500px]">
            <Image
              src="/About_us.jpg"
              alt="A detailed 3D-printed model"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="z-0 object-cover object-center"
            />
            <div aria-hidden="true" className="absolute inset-0 z-10 bg-linear-to-t from-[#10211b]/95 via-[#172a23]/75 to-[#172a23]/25" />

            <div className="relative z-20 flex min-h-[460px] flex-col justify-between p-5 sm:min-h-[500px] sm:p-8 lg:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Buymart studio</p>
                <h2 id="contact-details-title" className="mt-3 max-w-sm text-2xl font-semibold leading-tight sm:text-3xl">
                  Good ideas start with a conversation.
                </h2>
              </div>

              <address className="not-italic">
                <dl className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Phone size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#e6b9a7]" />
                    <div>
                      <dt className="text-xs text-white/65">Phone</dt>
                      <dd className="mt-1 text-sm font-medium">
                        {contactInfo.phone || 'Add your contact number'}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#e6b9a7]" />
                    <div>
                      <dt className="text-xs text-white/65">Email</dt>
                      <dd className="mt-1 break-all text-sm font-medium">
                        {contactInfo.email || 'Add your email address'}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#e6b9a7]" />
                    <div>
                      <dt className="text-xs text-white/65">Social</dt>
                      <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                        {contactInfo.instagram ? (
                          <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#e6b9a7]">
                            <Camera size={16} aria-hidden="true" /> Instagram
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-white/65">
                            <Camera size={16} aria-hidden="true" /> Add Instagram
                          </span>
                        )}
                        {contactInfo.facebook ? (
                          <a href={contactInfo.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#e6b9a7]">
                            <UsersRound size={16} aria-hidden="true" /> Facebook
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-white/65">
                            <UsersRound size={16} aria-hidden="true" /> Add Facebook
                          </span>
                        )}
                      </dd>
                    </div>
                  </div>
                </dl>
              </address>
            </div>
          </section>

          <section aria-labelledby="message-title" className="p-5 sm:p-8 lg:p-10">
            <div className="mb-6">
              <h2 id="message-title" className="text-2xl font-semibold">Send a message</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Fill in the details below and we&apos;ll be in touch.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Full name
                  <input
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={120}
                    placeholder="Your name"
                    className="mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm font-normal outline-none transition focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                    className="mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm font-normal outline-none transition focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium">
                Phone number <span className="font-normal text-neutral-500">(optional)</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  placeholder="Your phone number"
                  className="mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm font-normal outline-none transition focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
                />
              </label>

              <label className="block text-sm font-medium">
                Message
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={5}
                  placeholder="Tell us what you have in mind..."
                  className="mt-2 w-full resize-y border border-neutral-300 bg-white px-3 py-3 text-sm font-normal leading-6 outline-none transition focus:border-[#31493e] focus:ring-2 focus:ring-[#31493e]/15"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#243b33] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#a53b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#243b33] focus-visible:ring-offset-2 sm:w-auto"
              >
                Contact <Send size={16} aria-hidden="true" />
              </button>
              <p role="status" aria-live="polite" className="min-h-5 text-sm text-neutral-600">
                {formMessage}
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}