import { Phone } from "lucide-react";

export default function FloatingCall() {
  return (
    <a
      href="tel:+918977077110"
      className="fixed bottom-6 left-6 z-50 bg-brand-gold text-brand-brown p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group border border-brand-brown/10"
      aria-label="Call Store"
    >
      <Phone size={28} className="animate-pulse" />
      <span className="absolute left-full ml-4 bg-brand-charcoal text-white text-sm py-1.5 px-3 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none w-max font-medium">
        Call Store: 089770 77110
      </span>
    </a>
  );
}
