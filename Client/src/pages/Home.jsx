import React from 'react'
import Hero from '../components/HomeContent/Hero'
import WhyChooseUs from '../components/HomeContent/WhyChooseUs'
import AboutUsHome from '../components/HomeContent/AboutUsHome'
import Testimonials from '../components/TestimonialsContent/Testimonials'
import FaqSection from '../components/HomeContent/FaqSection'
import JoinBanner from '../components/HomeContent/JoinBanner'

const Home = () => {
  return (
    <div className="mt-12">
      <Hero />
      <WhyChooseUs />
      <AboutUsHome />
      <Testimonials />
      <FaqSection />
      <JoinBanner />
    </div>
  )
}

export default Home
