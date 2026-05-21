import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShoppingCart, Plus, Minus } from "lucide-react";
import { BEST_SELLERS, CATEGORIES, IMAGES } from "../data";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

const WEIGHT_OPTIONS = ["250g", "500g", "1kg", "2kg"];

// Helper component for Product Card
const ProductCard: React.FC<{ sweet: any }> = ({ sweet }) => {
  const [selectedWeight, setSelectedWeight] = useState("1kg");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addItem({
      id: sweet.id.toString(),
      name: sweet.name,
      price: activePrice,
      weight: selectedWeight,
      quantity,
      image: sweet.image
    });
    navigate("/checkout");
  };

  // Extract base price (removing currency and parsing to number)
  const basePrice = parseInt(sweet.price.replace(/[^0-9]/g, '')) || 0;
  
  // Calculate price based on weight
  const getPriceForWeight = (weight: string) => {
    // Assuming base price is for 1kg usually, let's normalize
    let multiplier = 1;
    if (weight === "250g") multiplier = 0.25;
    if (weight === "500g") multiplier = 0.5;
    if (weight === "2kg") multiplier = 2;
    return Math.round(basePrice * multiplier);
  };

  const activePrice = getPriceForWeight(selectedWeight);

  const handleAddToCart = () => {
    addItem({
      id: sweet.id.toString(),
      name: sweet.name,
      price: activePrice,
      weight: selectedWeight,
      quantity,
      image: sweet.image
    });
    setQuantity(1);
    toast.success(`${quantity}x ${sweet.name} (${selectedWeight}) added to cart`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl overflow-hidden border border-brand-brown/10 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-beige">
        <img src={sweet.image} alt={sweet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-charcoal text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded shadow-sm">
          {sweet.category}
        </span>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-bold text-brand-brown mb-2">{sweet.name}</h3>
        <p className="text-sm text-brand-charcoal/60 mb-4 line-clamp-2 flex-grow">{sweet.description}</p>
        
        {/* Weight Selector */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-brand-charcoal/50 font-bold mb-2">Select Weight</p>
          <div className="flex gap-2">
            {WEIGHT_OPTIONS.map(w => (
              <button 
                key={w}
                onClick={() => setSelectedWeight(w)}
                className={`flex-1 py-1 text-xs font-semibold rounded border ${selectedWeight === w ? 'bg-brand-brown text-white border-brand-brown' : 'bg-transparent text-brand-charcoal border-brand-brown/20 hover:border-brand-brown'}`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        
        {/* Price & Quantity & Actions */}
        <div className="pt-4 border-t border-brand-beige flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-brand-brown font-bold text-xl">₹{activePrice}</p>
            <div className="flex items-center gap-3 border border-brand-brown/20 rounded py-1 px-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-brand-gold text-brand-brown"><Minus size={14} /></button>
              <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-brand-gold text-brand-brown"><Plus size={14} /></button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-brand-beige hover:bg-brand-gold hover:text-white text-brand-brown py-2.5 rounded text-[11px] font-bold tracking-[1px] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 border border-brand-brown/10"
              >
                <ShoppingCart size={14} /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-brand-brown hover:bg-brand-brown-dark text-white py-2.5 rounded text-[11px] font-bold tracking-[1px] uppercase transition-all duration-300 flex items-center justify-center"
              >
                Buy Now
              </button>
            </div>
            <a 
              href={`https://wa.me/919885017876?text=Hello! I am inquiring about ${sweet.name} (${selectedWeight}) - ₹${activePrice} from Haji Syeed Sweets.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-green-600 text-green-700 hover:bg-green-600 hover:text-white py-2 rounded text-[11px] font-bold tracking-[1px] uppercase transition-all duration-300 flex items-center justify-center gap-1.5"
            >
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Since we only have best sellers in mock, we'll repeat them to simulate a full catalog
const CATALOG = [
  ...BEST_SELLERS,
  { id: 5, name: "Kheer Kadam", description: "Mini rosogollas enveloped in sweetened khoya.", price: "₹650", weight: "500g", image: IMAGES.sweets_assortment, category: "Traditional Sweets" },
  { id: 6, name: "Special Mix Box", description: "Assortment of our finest premium sweets.", price: "₹1500", weight: "1kg", image: IMAGES.gifts, category: "Gift Boxes" },
  { id: 7, name: "Besan Laddu", description: "Roasted gram flour laddu made with pure ghee.", price: "₹400", weight: "500g", image: IMAGES.laddu, category: "Pure Ghee Specials" },
  { id: 8, name: "Anjeer Roll", description: "Healthy and rich fig and dried fruit roll.", price: "₹1200", weight: "500g", image: IMAGES.kaju_katli, category: "Dry Fruit Sweets" },
];

export default function Sweets() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSweets = CATALOG.filter(sweet => {
    const matchesCategory = activeCategory === "All" || sweet.category === activeCategory;
    const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 bg-brand-cream min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-brown-dark text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-brand-gold drop-shadow">Our Signature Sweets</h1>
          <p className="max-w-2xl mx-auto text-white/80">Explore our wide range of authentic, pure ghee delicacies prepared daily with premium ingredients.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Categories */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === "All" ? "bg-brand-brown text-brand-cream" : "bg-white text-brand-charcoal hover:bg-brand-beige border border-brand-brown/10"}`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-brand-brown text-white" : "bg-white text-brand-charcoal hover:bg-brand-beige border border-brand-brown/10"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search sweets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-brand-brown/20 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            />
            <Search className="absolute left-3.5 top-3 text-brand-brown/40" size={18} />
          </div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredSweets.map((sweet) => (
              <ProductCard key={sweet.id} sweet={sweet} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredSweets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-brand-charcoal/50 font-serif">No sweets found matching your search.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-4 text-brand-gold hover:text-brand-brown underline underline-offset-4 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
