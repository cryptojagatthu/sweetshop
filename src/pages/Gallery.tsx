import { motion } from "motion/react";
import { IMAGES } from "../data";

const GALLERY_IMAGES = [
  { img: IMAGES.hero, alt: "Premium Assortment", category: "Sweets" },
  { img: IMAGES.kaju_katli, alt: "Kaju Katli close up", category: "Sweets" },
  { img: IMAGES.store_exterior, alt: "Store Front", category: "Store" },
  { img: IMAGES.legacy, alt: "Preparation", category: "Heritage" },
  { img: IMAGES.laddu, alt: "Motichoor Laddu", category: "Sweets" },
  { img: IMAGES.gifts, alt: "Gift Boxes", category: "Packaging" },
  { img: IMAGES.halwa, alt: "Badam Halwa", category: "Sweets" },
  { img: IMAGES.sweets_assortment, alt: "Mixed Sweets", category: "Sweets" },
];

export default function Gallery() {
  return (
    <div className="pt-24 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4">Visual Journey</h1>
          <p className="text-brand-charcoal/70 text-lg">A glimpse into our heritage, craftsmanship, and the irresistible sweets we create.</p>
        </div>

        {/* CSS-based Masonry approximation using columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {GALLERY_IMAGES.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.1, duration: 0.5 }}
              className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <img src={item.img} alt={item.alt} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <span className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-1 block">{item.category}</span>
                  <h3 className="text-white font-serif text-lg">{item.alt}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
