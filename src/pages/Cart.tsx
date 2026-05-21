import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();

  const total = getTotal();
  const deliveryCharges = total > 1000 ? 0 : 50;
  const finalTotal = total > 0 ? total + deliveryCharges : 0;

  if (items.length === 0) {
    return (
      <div className="pt-[140px] pb-24 bg-brand-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-6 text-brand-brown/40">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-brown mb-4">Your Cart is Empty</h1>
          <p className="text-brand-charcoal/60 mb-8 max-w-md mx-auto">Explore our authentic pure ghee delicacies and fill your cart with happiness.</p>
          <Link to="/sweets" className="bg-brand-brown hover:bg-brand-brown-dark text-white px-8 py-3 rounded-sm font-semibold uppercase tracking-widest text-[12px] transition-colors inline-block">
            Explore Sweets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[120px] pb-24 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-brand-brown mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          {/* Cart Items */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-brand-brown/10 p-6">
              <div className="hidden md:grid grid-cols-[100px_1fr_120px_100px_40px] gap-4 pb-4 border-b border-brand-brown/10 text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/50 mb-4">
                <div>Image</div>
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
                <div></div>
              </div>
              
              <div className="space-y-6 md:space-y-4">
                {items.map((item) => (
                  <motion.div 
                    layout
                    key={`${item.id}-${item.weight}`}
                    className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr_120px_100px_40px] items-center gap-4 md:py-2"
                  >
                    <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded hover:scale-105 transition-transform bg-brand-beige overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-brand-brown text-base md:text-lg leading-tight">{item.name}</h3>
                      <p className="text-[11px] uppercase tracking-wider text-brand-charcoal/60">{item.weight}</p>
                      <p className="text-brand-gold font-bold md:hidden">₹{item.price}</p>
                      
                      {/* Mobile quantity */}
                      <div className="flex items-center gap-3 border border-brand-brown/20 rounded py-1 px-2 w-fit mt-2 md:hidden">
                        <button onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)} className="p-1 hover:text-brand-gold"><Minus size={12} /></button>
                        <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)} className="p-1 hover:text-brand-gold"><Plus size={12} /></button>
                      </div>
                    </div>
                    
                    {/* Desktop quantity */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="flex items-center gap-3 border border-brand-brown/20 rounded py-1.5 px-3">
                        <button onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)} className="p-1 hover:text-brand-gold"><Minus size={14} /></button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)} className="p-1 hover:text-brand-gold"><Plus size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="text-right font-bold text-brand-brown hidden md:block">
                      ₹{item.price * item.quantity}
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id, item.weight)}
                      className="text-brand-charcoal/40 hover:text-red-500 transition-colors hidden md:flex items-center justify-center p-2"
                    >
                      <Trash2 size={18} />
                    </button>

                    {/* Mobile delete */}
                    <button 
                      onClick={() => removeItem(item.id, item.weight)}
                      className="text-brand-charcoal/40 hover:text-red-500 transition-colors md:hidden absolute right-4 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <Link to="/sweets" className="inline-block text-brand-brown font-medium hover:text-brand-gold transition-colors text-sm underline underline-offset-4">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl border border-brand-brown/10 p-6 sticky top-[110px]">
              <h2 className="font-serif text-xl font-bold text-brand-brown mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-brand-charcoal">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{total}</span>
                </div>
                <div className="flex justify-between text-brand-charcoal">
                  <span>Standard Delivery</span>
                  <span className="font-bold">{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}</span>
                </div>
                {deliveryCharges > 0 && (
                  <p className="text-[11px] text-brand-gold">Order ₹{1000 - total} more for free delivery!</p>
                )}
                
                <div className="pt-4 border-t border-brand-brown/10 flex justify-between items-end">
                  <span className="text-lg font-bold text-brand-brown">Total Estimated</span>
                  <span className="text-2xl font-bold text-brand-brown">₹{finalTotal}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-brand-brown hover:bg-brand-brown-dark text-white py-4 rounded text-xs font-bold tracking-[2px] uppercase transition-colors flex items-center justify-center gap-2 mb-4"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              
              <p className="text-[10px] text-brand-charcoal/50 text-center flex items-center justify-center gap-1">
                Prices include all applicable taxes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
