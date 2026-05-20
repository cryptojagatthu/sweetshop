import { motion } from "motion/react";
import { Package, Users, Calendar, Gift, Briefcase, PartyPopper } from "lucide-react";

const SERVICES = [
  {
    icon: <Users size={32} />,
    title: "Wedding Orders",
    desc: "Make your special day sweeter with our premium wedding assortments. Customized packaging available to match your theme."
  },
  {
    icon: <Package size={32} />,
    title: "Bulk Orders",
    desc: "Planning a large gathering? We provide special rates and guaranteed fresh quality for all bulk orders."
  },
  {
    icon: <Calendar size={32} />,
    title: "Festival Specials",
    desc: "Exclusive festival curations for Diwali, Eid, Raksha Bandhan, and more. Authentic taste for every celebration."
  },
  {
    icon: <Gift size={32} />,
    title: "Gift Boxes",
    desc: "Elegant gift hampers perfect for taking a piece of our heritage to your loved ones."
  },
  {
    icon: <Briefcase size={32} />,
    title: "Corporate Gifting",
    desc: "Premium corporate boxes to appreciate your employees and clients, with options for brand customization."
  },
  {
    icon: <PartyPopper size={32} />,
    title: "Event Catering",
    desc: "Live sweet counters and bulk dessert supplies for private events, parties, and corporate gatherings."
  }
];

export default function Services() {
  return (
    <div className="pt-24 bg-brand-cream min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-4 block">How We Serve You</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6">Our Services</h1>
          <p className="text-brand-charcoal/70 text-lg leading-relaxed">Beyond our daily counter, we cater to your special occasions with the same love, quality, and heritage craftsmanship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-brand-brown/5 hover:shadow-xl hover:border-brand-gold/30 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-full bg-brand-beige text-brand-gold flex items-center justify-center mb-6 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-brown mb-4">{service.title}</h3>
              <p className="text-brand-charcoal/70 leading-relaxed mb-6">{service.desc}</p>
              
              <a 
                href={`https://wa.me/9108977077110?text=I am interested in your ${service.title} service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-brown font-medium group-hover:text-brand-gold transition-colors"
              >
                Inquire Now
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
