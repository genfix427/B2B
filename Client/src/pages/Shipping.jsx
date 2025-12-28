import React from 'react'
import PageHero from '../components/OtherContent/PageHero'
import ShippingInfo from '../components/ShippingContent/ShippingInfo'

const Shipping = () => {
  return (
    <div>
      <PageHero
        title="Reliable B2B Shipping Solutions"
        description="Optimized logistics and trusted partners ensure safe, fast, and compliant delivery of bulk pharmaceutical orders."
        gradient="from-sky-700 via-blue-700 to-indigo-800"
      />
      <ShippingInfo />
    </div>
  )
}

export default Shipping
