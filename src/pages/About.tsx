import { motion } from "motion/react";
import { IMAGES } from "../data";

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="pt-20 bg-brand-cream overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative py-24 bg-brand-brown-dark text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={IMAGES.legacy} alt="Heritage background" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-brown-dark via-brand-brown-dark/90 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-2xl">
            <span className="text-brand-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">Our Story</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-brand-cream leading-tight">Tradition That Tastes Like Home</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Since 1942, Haji Syeed Pure Ghee Sweets has been more than a sweet shop. We are custodians of authentic recipes, preserving the culinary heritage of Madanapalle for 85 years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-brown mb-8 relative inline-block">
                Our Quality Promise
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-gold"></span>
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-brand-brown mb-2">Uncompromising Ingredients</h3>
                  <p className="text-brand-charcoal/70 leading-relaxed">We believe that great sweets begin with great ingredients. We source the finest, purest ghee, premium quality dry fruits, and aromatic saffron, ensuring every bite reflects our commitment to excellence.</p>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-brand-brown mb-2">Handcrafted Craftsmanship</h3>
                  <p className="text-brand-charcoal/70 leading-relaxed">Automation can never replace the touch of a master artisan. Our sweets are meticulously handcrafted daily, maintaining the perfect texture and flavor profile that machines simply cannot replicate.</p>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-brand-brown mb-2">Preserving Authenticity</h3>
                  <p className="text-brand-charcoal/70 leading-relaxed">While times change, our recipes don't. We proudly utilize the same traditional methods and proportions handed down through generations, offering you a timeless taste of heritage.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img src={IMAGES.store_exterior} alt="Our craftsmanship" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-dark/80 to-transparent flex items-end p-8">
                <blockquote className="text-xl font-serif text-white italic leading-relaxed border-l-4 border-brand-gold pl-4">
                  "Quality is not an act, it is a habit passed down through generations."
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-brand-beige border-t border-brand-gold/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-brand-brown mb-4">Journey of Legacy</h2>
            <p className="text-brand-charcoal/70">A sweet history spanning generations.</p>
          </div>

          <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-gold before:to-transparent">
            {[
              { year: "1942", title: "The Humble Beginning", desc: "Haji Syeed opened a small sweet stall in Madanapalle, introducing pure ghee sweets made with family recipes." },
              { year: "1970", title: "Passing the Baton", desc: "The next generation took over, expanding the menu while strictly adhering to the original quality standards." },
              { year: "2005", title: "A Landmark Establishment", desc: "Relocated to the current flagship store at Avenue Rd, becoming a landmark in the city." },
              { year: "2026", title: "Modern Heritage", desc: "Continuing the 85-year legacy, serving thousands of loyal customers while embracing modern delivery channels." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-brand-beige bg-brand-gold text-brand-brown-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 bg-brand-cream rounded-full"></div>
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-brand-brown/5 hover:shadow-md transition-shadow">
                  <span className="font-serif text-3xl font-bold text-brand-gold/40 mb-2 block">{item.year}</span>
                  <h4 className="text-xl font-bold text-brand-brown mb-2">{item.title}</h4>
                  <p className="text-brand-charcoal/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
