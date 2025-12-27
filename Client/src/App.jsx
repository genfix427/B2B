import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HowItWorks from './pages/HowItWorks'
import Testimonials from './pages/Testimonials'
import FAQ from './pages/FAQ'
import Shipping from './pages/Shipping'
import About from './pages/About'
import Contact from './pages/Contact'

const App = () => {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/how-it-works' element={<HowItWorks />} />
        <Route path='/testimonials' element={<Testimonials />} />
        <Route path='/faqs' element={<FAQ />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
