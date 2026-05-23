import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import FloatingCall from "./components/FloatingCall";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Sweets from "./pages/Sweets";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import Admin from "./pages/Admin";
import AdminNotifications from "./pages/AdminNotifications";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen relative font-sans">
        <Toaster position="top-center" toastOptions={{ style: { background: '#4A3225', color: '#fff', fontSize: '14px', borderRadius: '4px' } }} />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sweets" element={<Sweets />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
          </Routes>
        </main>
        <Footer />
        <FloatingWhatsApp />
        <FloatingCall />
      </div>
      <Analytics />
    </Router>
  );
}

