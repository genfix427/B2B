import {
  FaLinkedinIn,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">

      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid gap-12 md:grid-cols-2 lg:grid-cols-5">

        {/* LOGO */}
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-semibold text-teal-600">
            B2BExchange<span className="text-teal-400">°</span>
          </h2>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
            Contact
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            395-07 Downtown<br />
            Miami, Florida 200879
          </p>

          <p className="mt-4 text-gray-600 text-sm">
            Toll Free: <span className="font-medium">1 (678) 255-5789</span>
          </p>

          <p className="text-gray-600 text-sm">
            Mon-Fri: 10AM – 5PM EST
          </p>

          <p className="mt-3 text-gray-600 text-sm">
            Fax: +1 789 255 4567
          </p>

          <a
            href="mailto:rxmart@rxmart.com"
            className="inline-block mt-4 text-sm text-teal-600 hover:underline"
          >
            b2bexchange@b2b.com
          </a>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
            Links
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            {["How It Works", "Testimonials", "FAQs", "News"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-teal-600 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
            Legal
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            {["Shipping", "About", "Contact Us", "DSCSA Act"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-teal-600 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
            Social
          </h3>

          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex items-center gap-3 hover:text-teal-600 transition cursor-pointer">
              <FaLinkedinIn className="text-teal-600" />
              Linkedin
            </li>

            <li className="flex items-center gap-3 hover:text-teal-600 transition cursor-pointer">
              <FaXTwitter className="text-teal-600" />
              Twitter
            </li>

            <li className="flex items-center gap-3 hover:text-teal-600 transition cursor-pointer">
              <FaInstagram className="text-teal-600" />
              Instagram
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative bg-teal-600 text-white">

        {/* subtle decorative dots */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[22px_22px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* COPYRIGHT */}
          <p className="text-sm">
            © 2025 B2BExchange. All Rights Reserved
          </p>

          {/* LEGAL LINKS */}
          <div className="flex gap-4 text-sm">
            {["Privacy & Policy", "Terms and Conditions", "DSCSA Act"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="hover:underline"
                >
                  {item}
                </a>
              )
            )}
          </div>

          {/* LOGOS */}
          <div className="flex items-center gap-4">
            <img
              src="/ncpa.png"
              alt="NCPA"
              className="h-8 bg-white p-1 rounded-md"
            />
            <img
              src="/fedex.png"
              alt="FedEx"
              className="h-8 bg-white p-1 rounded-md"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
