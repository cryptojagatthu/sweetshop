import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Quote } from "lucide-react";
import { BEST_SELLERS, IMAGES } from "../data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <div className="bg-brand-cream overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] min-h-[calc(100vh-90px)] mt-[90px] border-b border-brand-brown/10 overflow-hidden">
        <div className="flex flex-col justify-center px-8 py-16 lg:p-[80px_60px] bg-brand-cream order-2 lg:order-1 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} className="mb-4">
              <span className="font-serif italic text-brand-gold text-lg lg:text-[18px]">
                Legacy of authentic taste Since 1942
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-[68px] font-serif font-normal text-brand-brown leading-[1.1] mb-6">
              Happiness Crafted <br className="hidden lg:block" />With Pure Ghee <br className="hidden lg:block" />Since Generations
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-[18px] leading-[1.6] text-brand-charcoal/70 max-w-[480px] font-light mb-10">
              Discover the heritage of Madanapalle's finest handmade sweets, prepared with time-honored recipes passed down through decades.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link to="/sweets" className="bg-brand-brown text-white tracking-[2px] uppercase text-[12px] font-semibold px-9 py-4 rounded-sm flex items-center gap-2 transition-colors hover:bg-brand-charcoal">
                Explore Collections <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="bg-transparent border border-brand-brown text-brand-brown tracking-[2px] uppercase text-[12px] font-semibold px-9 py-4 rounded-sm transition-colors hover:bg-brand-brown/5">
                Visit Our Store
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative bg-brand-beige lg:border-l lg:border-brand-brown/10 order-1 lg:order-2 min-h-[350px] lg:min-h-full">
          <img 
            src={IMAGES.hero}
            alt="Premium Assorted Sweets" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute lg:bottom-10 lg:-left-10 bottom-4 left-4 bg-white p-6 shadow-[20px_20px_60px_rgba(0,0,0,0.05)] rounded-sm flex items-center gap-5 z-20 hidden sm:flex">
             <div className="w-[60px] h-[60px] border border-brand-gold rounded-full flex items-center justify-center font-serif text-[12px] text-brand-gold text-center leading-[1.1]">ESTD<br/>1942</div>
             <div>
               <div className="font-serif text-[20px] text-brand-brown italic">100% Pure Ghee</div>
               <div className="text-[11px] uppercase tracking-[1px] opacity-60 font-semibold">Signature Quality</div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Bottom Bar matching Theme */}
      <div className="hidden lg:grid grid-cols-4 items-center h-[100px] border-b border-brand-brown/10 bg-white px-[60px]">
        <div className="flex flex-col gap-1 relative">
          <span className="text-[10px] uppercase text-brand-gold tracking-[2px] font-bold">Heritage</span>
          <span className="font-serif text-[18px] text-brand-brown">85 Years of Trust</span>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-[40px] bg-brand-brown/10"></div>
        </div>
        <div className="flex flex-col gap-1 relative pl-[40px]">
          <span className="text-[10px] uppercase text-brand-gold tracking-[2px] font-bold">Preparation</span>
          <span className="font-serif text-[18px] text-brand-brown">Handmade Everyday</span>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-[40px] bg-brand-brown/10"></div>
        </div>
        <div className="flex flex-col gap-1 relative pl-[40px]">
          <span className="text-[10px] uppercase text-brand-gold tracking-[2px] font-bold">Ingredients</span>
          <span className="font-serif text-[18px] text-brand-brown">Premium Dry Fruits</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[10px] uppercase text-brand-gold tracking-[2px] font-bold">Contact</span>
          <span className="font-serif text-[18px] text-brand-brown">089770 77110</span>
        </div>
      </div>

      {/* Heritage Story Section */}
      <section className="py-24 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand-gold/20 rounded-t-full transform -translate-x-4 translate-y-4"></div>
              <img 
                src={IMAGES.legacy} 
                alt="Our Heritage Preparation" 
                className="relative z-10 w-full h-[600px] object-cover rounded-t-full rounded-b-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-lg shadow-xl z-20 max-w-[200px] border border-brand-beige hidden md:block">
                <p className="font-serif text-4xl text-brand-gold font-bold mb-1">85</p>
                <p className="text-sm font-medium text-brand-charcoal uppercase tracking-wider">Years of Legacy</p>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-normal text-brand-brown mb-6">
                Our Legacy Since 1942
              </motion.h2>
              <motion.p variants={fadeUp} className="text-brand-charcoal/70 text-[18px] font-light mb-6 leading-relaxed">
                For over eight decades, Haji Syeed Pure Ghee Sweets has been synonymous with authenticity and unparalleled taste. Our journey began with a simple promise: to serve sweets made with the purest ingredients and unbounded love.
              </motion.p>
              <motion.p variants={fadeUp} className="text-brand-charcoal/70 text-lg mb-10 leading-relaxed">
                Every piece of sweet we craft holds the essence of our family tradition. From carefully roasting premium nuts to stirring rich pure ghee in copper vessels, our process remains beautifully unchanged.
              </motion.p>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-6 pt-6 border-t border-brand-gold/30">
                <div>
                  <h4 className="font-serif text-xl font-bold text-brand-brown mb-2">Pure Ingredients</h4>
                  <p className="text-sm text-brand-charcoal/60">We source only the finest quality pure ghee, saffron, and nuts.</p>
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-brand-brown mb-2">Handcrafted</h4>
                  <p className="text-sm text-brand-charcoal/60">Prepared daily by our master artisans using generational recipes.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Signature Collections Preview */}
      <section className="py-24 bg-brand-beige relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-brand-gold)_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] text-brand-gold font-bold tracking-[2px] uppercase mb-4 block">Curated Assortment</span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-brand-brown mb-6">Signature Collections</h2>
            <p className="text-brand-charcoal/70 font-light">Discover our range of meticulously crafted delicacies, perfect for every celebration and craving.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Pure Ghee Specials", img: IMAGES.sweets_assortment, desc: "Rich and luxurious traditional sweets" },
              { title: "Dry Fruit Assortment", img: IMAGES.gifts, desc: "Premium nuts and figs creations" },
              { title: "Festival Boxes", img: IMAGES.legacy, desc: "Elegant packaging for your loved ones" }
            ].map((col, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link
                  to="/sweets"
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-500 block"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={col.img} alt={col.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-serif text-2xl font-bold text-brand-brown mb-2">{col.title}</h3>
                    <p className="text-brand-charcoal/60 text-sm mb-4">{col.desc}</p>
                    <span className="inline-flex items-center gap-1 text-brand-gold font-medium text-sm group-hover:text-brand-brown transition-colors">
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] text-brand-gold font-bold tracking-[2px] uppercase mb-4 block">Most Loved</span>
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-brand-brown">Our Best Sellers</h2>
            </div>
            <Link to="/sweets" className="inline-flex items-center gap-2 text-brand-brown border-b border-brand-brown pb-1 hover:text-brand-gold hover:border-brand-gold transition-all">
              View All Sweets <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BEST_SELLERS.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-white rounded-lg overflow-hidden border border-brand-beige border-b-4 border-b-brand-gold/0 hover:border-b-brand-gold transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-brand-beige">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <a href={`https://wa.me/919885017876?text=Hello! I would like to quick-order ${product.name} (${product.weight}) - ${product.price} from Haji Syeed Sweets.`} target="_blank" rel="noopener noreferrer" className="w-full bg-white text-brand-charcoal text-center py-2 rounded text-sm font-semibold hover:bg-brand-gold hover:text-white transition-colors">
                      Quick Order
                    </a>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-serif text-lg font-bold text-brand-brown mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-brand-charcoal/50 uppercase tracking-widest mb-3">{product.weight}</p>
                  <p className="text-brand-gold font-semibold">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-brown text-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-cream rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-brand-cream mb-4">Customer Love</h2>
            <div className="flex justify-center gap-1 text-brand-gold">
              {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rahul S.", review: "The Mysore Pak literally melts in your mouth. You can taste the purity of the ghee. Highly recommended!" },
              { name: "Priya M.", review: "Been ordering from Haji Syeed for our family events for 10 years. Consistent quality and authentic taste." },
              { name: "Anwar K.", review: "The Kaju Katli and Motichoor Laddu are the best I've had in Andhra. The heritage truly shows in their craftsmanship." }
            ].map((t, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 relative"
              >
                <Quote className="absolute top-6 right-6 text-brand-gold/20" size={40} />
                <p className="text-brand-cream/80 leading-relaxed mb-6 italic relative z-10">"{t.review}"</p>
                <p className="font-serif font-bold text-brand-gold">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Location */}
      <section className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-brand-brown-dark py-24 px-8 lg:px-24 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
             <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-gold mb-8">Visit Our Heritage Store</h2>
              <p className="text-white/80 mb-8 leading-relaxed max-w-md">Experience the aroma of pure ghee and freshly prepared sweets. We invite you to our humble establishment that has served generations since 1942.</p>
              
              <div className="space-y-6 mb-10">
                <div>
                  <h4 className="text-brand-beige text-sm font-semibold uppercase tracking-wider mb-2">Address</h4>
                  <p className="text-white/70">Avenue Rd, near Bangalore Bus Stand,<br/>Basinikonda, Madanapalle,<br/>Andhra Pradesh 517325</p>
                </div>
                <div>
                  <h4 className="text-brand-beige text-sm font-semibold uppercase tracking-wider mb-2">Contact</h4>
                  <p className="text-white/70 text-lg font-serif">08977077110</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <a href="https://maps.app.goo.gl/4BoZ1YzGKtk6Q67g6" target="_blank" rel="noopener noreferrer" className="bg-brand-gold hover:bg-brand-cream text-brand-brown px-6 py-3 rounded text-sm font-semibold transition-colors">
                  Get Directions
                </a>
              </div>
             </div>
          </div>
          <div className="min-h-[400px] lg:min-h-full">
            <iframe 
              src="https://maps.google.com/maps?q=HAJI+IRSHAD+PURE+GHEE+SWEETS+Madanapalle&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
              className="w-full h-full object-cover"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
