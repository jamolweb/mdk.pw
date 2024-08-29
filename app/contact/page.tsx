'use client'

import DesignOrderForm from '@/components/contact/DesignOrderForm'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

const ContactPage = () => {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    })
  }, [])
  return (
    <div>
      <div className="bg-[#222222]">
        <div
          data-aos="fade-down"
          className="container py-24 flex max-lg:flex-col max-lg:space-y-10 justify-between"
        >
          <DesignOrderForm />
        </div>
      </div>
    </div>
  )
}

export default ContactPage
