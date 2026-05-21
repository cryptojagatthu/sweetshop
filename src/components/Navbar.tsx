import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ShoppingBag, Phone } from "lucide-react";
import { cn } from "../lib/utils";
import { useCartStore } from "../store/cartStore";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Sweets", path: "/sweets" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
  { name: "My Orders", path: "/track-order" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-cream border-b border-brand-brown/10 h-[90px] flex items-center transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            
            {/* Logo area */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/images/logo.png" 
                alt="Haji Syeed Pure Ghee Sweets Logo" 
                className="h-[60px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col items-start">
                <span className="font-serif text-[22px] font-bold text-brand-brown uppercase tracking-[1px] leading-none">
                  Haji Syeed
                </span>
                <span className="text-[10px] uppercase tracking-[2.5px] font-semibold text-brand-gold mt-1 leading-none">
                  Pure Ghee Sweets
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-[13px] font-medium uppercase tracking-[1px] transition-all hover:text-brand-brown",
                    location.pathname === link.path ? "text-brand-brown opacity-100" : "text-brand-charcoal opacity-80 hover:opacity-100"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/cart" className="relative text-brand-brown hover:text-brand-gold transition-colors flex items-center gap-1.5 mr-2">
                <ShoppingBag size={18} />
                <span className="text-[12px] font-semibold uppercase tracking-[1px]">Cart ({cartItems.length})</span>
              </Link>
              <a 
                href="tel:+918977077110" 
                className="flex items-center gap-2 text-brand-brown hover:text-brand-gold transition-colors font-semibold tracking-[1.5px] text-[13px]"
              >
                <Phone size={15} className="text-brand-gold" />
                <span>089770 77110</span>
              </a>
              <Link 
                to="/sweets" 
                className="bg-brand-brown text-white hover:bg-brand-brown-dark transition-colors px-[20px] py-[10px] rounded text-[11px] font-semibold uppercase tracking-[2px]"
              >
                Order Online
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md focus:outline-none text-brand-brown"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-brand-cream border-b border-brand-gold/20 shadow-lg md:hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block px-3 py-3 rounded-md text-base font-medium text-brand-charcoal hover:bg-brand-beige hover:text-brand-brown transition-colors",
                    location.pathname === link.path && "bg-brand-beige text-brand-brown"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-brand-gold/20 px-3 flex flex-col gap-3">
                <Link 
                  to="/cart" 
                  className="w-full px-5 py-3 rounded bg-brand-beige text-brand-brown hover:bg-brand-gold hover:text-white text-center font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Cart ({cartItems.length})
                </Link>
                <a 
                  href="tel:+918977077110" 
                  className="w-full px-5 py-3 rounded bg-brand-gold text-brand-brown hover:bg-brand-brown hover:text-white text-center font-bold transition-colors flex items-center justify-center gap-2 tracking-wide"
                >
                  <Phone size={18} />
                  089770 77110
                </a>
                <Link 
                  to="/sweets" 
                  className="w-full px-5 py-3 rounded bg-brand-brown text-white hover:bg-brand-gold text-center font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Order Now
                </Link>
                <a 
                  href="https://wa.me/919885017876?text=Hello! I want to place an order or make an inquiry from the website." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full px-5 py-3 rounded border border-green-600 text-green-700 hover:bg-green-50 text-center font-medium transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
