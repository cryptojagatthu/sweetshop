import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-24 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6">Get in Touch</h1>
          <p className="text-brand-charcoal/70 text-lg">We'd love to hear from you. Visit our store or reach out for orders and inquiries.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-brown/5">
              <h3 className="font-serif text-2xl font-bold text-brand-brown mb-8 border-b border-brand-beige pb-4">Store Information</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center text-brand-gold shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown mb-1">Address</h4>
                    <p className="text-brand-charcoal/70 leading-relaxed">
                      Avenue Rd, near Bangalore Bus Stand,<br/>
                      Basinikonda, Madanapalle,<br/>
                      Andhra Pradesh 517325
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center text-brand-gold shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown mb-1">Phone / WhatsApp</h4>
                    <p className="text-brand-charcoal/70 font-serif text-lg">08977077110</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center text-brand-gold shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown mb-1">Email</h4>
                    <p className="text-brand-charcoal/70">contact@hajisyeedsweets.com</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center text-brand-gold shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-brown mb-1">Store Hours</h4>
                    <p className="text-brand-charcoal/70">Mon - Sun: 9:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-brand-beige flex flex-wrap gap-4">
                <a href="https://wa.me/9108977077110" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded font-medium transition-colors flex items-center gap-2">
                  Chat on WhatsApp
                </a>
                <a href="tel:08977077110" className="bg-brand-brown hover:bg-brand-gold text-white px-6 py-3 rounded font-medium transition-colors flex items-center gap-2">
                  Call Store directly
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="h-[500px] lg:h-auto rounded-2xl overflow-hidden shadow-md border border-brand-brown/10 relative group"
          >
            <iframe 
              src="https://maps.google.com/maps?q=HAJI+IRSHAD+PURE+GHEE+SWEETS+Madanapalle&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
              className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border-[8px] border-white/20 rounded-2xl"></div>
          </motion.div>
        </div>
        
        {/* Contact Form Section */}
        <div className="mt-24 max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-brand-brown/5">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-brand-brown mb-4">Send us a Message</h2>
            <p className="text-brand-charcoal/70">Have a special request or feedback? We'd love to hear it.</p>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Your Name</label>
                <input type="text" className="w-full bg-brand-cream/50 border border-brand-brown/20 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Phone Number</label>
                <input type="tel" className="w-full bg-brand-cream/50 border border-brand-brown/20 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all" placeholder="+91 98765 43210" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">Email Address</label>
              <input type="email" className="w-full bg-brand-cream/50 border border-brand-brown/20 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all" placeholder="john@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">Subject</label>
              <select className="w-full bg-brand-cream/50 border border-brand-brown/20 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all appearance-none text-brand-charcoal/80">
                <option>Bulk Order Inquiry</option>
                <option>Feedback</option>
                <option>General Question</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">Your Message</label>
              <textarea rows={4} className="w-full bg-brand-cream/50 border border-brand-brown/20 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all resize-none" placeholder="Write your message here..."></textarea>
            </div>
            
            <button type="submit" className="w-full bg-brand-brown hover:bg-brand-gold text-white font-medium py-4 rounded-md transition-colors text-lg shadow-md">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
