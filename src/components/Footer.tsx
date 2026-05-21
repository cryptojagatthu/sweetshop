import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-brown-dark text-white pt-16 pb-8 border-t-[8px] border-brand-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo.png" 
                alt="Haji Syeed Pure Ghee Sweets Logo" 
                className="h-[55px] w-auto object-contain bg-white/10 p-1 rounded-full"
              />
              <div>
                <h3 className="font-serif text-2xl font-bold text-brand-gold leading-tight">Haji Syeed</h3>
                <p className="text-xs tracking-widest text-brand-beige/85 uppercase">Pure Ghee Sweets</p>
                <p className="text-[10px] tracking-wider text-brand-beige/70 uppercase">Since 1942</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mt-4">
              Happiness crafted with pure ghee since generations. Authentic traditional sweets prepared with premium ingredients and recipes trusted for decades.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-medium mb-6 text-brand-cream border-b border-white/10 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Our Heritage", path: "/about" },
                { name: "Shop Sweets", path: "/sweets" },
                { name: "Our Services", path: "/services" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/70 hover:text-brand-gold transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-xl font-medium mb-6 text-brand-cream border-b border-white/10 pb-2 inline-block">Specialties</h4>
            <ul className="space-y-3">
              {[
                "Pure Ghee Sweets",
                "Traditional Delicacies",
                "Dry Fruit Specials",
                "Festival Gift Boxes",
                "Premium Savouries"
              ].map((item) => (
                <li key={item}>
                  <Link to="/sweets" className="text-white/70 hover:text-brand-gold transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-xl font-medium mb-6 text-brand-cream border-b border-white/10 pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="shrink-0 w-5 h-5 text-brand-gold" />
                <span className="leading-relaxed">Avenue Rd, near Bangalore Bus Stand, Basinikonda, Madanapalle, Andhra Pradesh 517325</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="shrink-0 w-5 h-5 text-brand-gold" />
                <span>+91 08977077110</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="shrink-0 w-5 h-5 text-brand-gold" />
                <span>contact@hajisyeedsweets.com</span>
              </li>
            </ul>
            
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-gold transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            Haji Syeed Pure Ghee Sweets © {new Date().getFullYear()}. Based on heritage since 1942.
          </p>
          <div className="flex gap-4 text-sm text-white/50">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
