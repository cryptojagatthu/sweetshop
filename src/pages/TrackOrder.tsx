import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Loader2, Package, ChefHat, Truck, CheckCircle, Clock } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import toast from "react-hot-toast";

const API_URL = (import.meta as any).env.VITE_API_URL || "";

const STATUS_STEPS = [
  { id: 'Accepted', label: 'Order Placed', icon: <Package size={24} /> },
  { id: 'Preparing', label: 'Preparing', icon: <ChefHat size={24} /> },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: <Truck size={24} /> },
  { id: 'Delivered', label: 'Delivered', icon: <CheckCircle size={24} /> }
];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const historyStr = localStorage.getItem('sweetshop_recent_orders');
      if (historyStr) {
        setRecentOrders(JSON.parse(historyStr));
      }
    } catch (e) {}
  }, []);

  const handleTrack = async (e?: React.FormEvent, directOrderId?: string, directPhone?: string) => {
    if (e) e.preventDefault();
    const targetOrderId = directOrderId || orderId;
    const targetPhone = directPhone || phone;
    
    if (!targetPhone) {
      toast.error("Please enter your Phone Number");
      return;
    }

    if (directOrderId && directPhone) {
      setOrderId(directOrderId);
      setPhone(directPhone);
    }

    setLoading(true);
    setOrderData(null);

    try {
      if (targetOrderId) {
        // Track specific order
        const resp = await fetch(`${API_URL}/api/orders/track?orderId=${encodeURIComponent(targetOrderId)}&phone=${encodeURIComponent(targetPhone)}`);
        if (!resp.ok) {
          if (resp.status === 404) toast.error("No order found with these details.");
          else toast.error("Could not fetch order details.");
        } else {
          const data = await resp.json();
          setOrderData(data.order);
        }
      } else {
        // Fetch order history by phone
        const resp = await fetch(`${API_URL}/api/orders/history?phone=${encodeURIComponent(targetPhone)}`);
        if (!resp.ok) {
          toast.error("Could not fetch order history.");
        } else {
          const data = await resp.json();
          if (data.orders.length === 0) {
            toast.error("No orders found for this phone number.");
          } else {
            setRecentOrders(data.orders);
            localStorage.setItem('sweetshop_recent_orders', JSON.stringify(data.orders.slice(0, 5)));
            toast.success(`Found ${data.orders.length} orders!`);
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = orderData ? STATUS_STEPS.findIndex(s => s.id === orderData.status) : -1;

  return (
    <div className="pt-[140px] pb-24 bg-brand-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-brand-brown mb-4">Track Your Order</h1>
          <p className="text-brand-charcoal/70">Enter your order ID and phone number to see the current status. Leave Order ID blank to search your history.</p>
        </div>

        <form onSubmit={handleTrack} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-brand-brown/10 mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/70 mb-2">Order ID (Optional)</label>
            <input value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold" placeholder="Leave blank to fetch history" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/70 mb-2">Phone Number *</label>
            <input required type="tel" pattern="[0-9]{10}" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold" placeholder="10-digit mobile number" />
          </div>
          <div className="flex items-end">
             <button type="submit" disabled={loading} className="w-full md:w-auto bg-brand-brown hover:bg-brand-brown-dark text-white px-8 py-3.5 rounded text-xs font-bold tracking-[2px] uppercase transition-colors flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Track</>}
             </button>
          </div>
        </form>

        {/* Recent Orders UI */}
        {!orderData && recentOrders.length > 0 && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-sm font-bold text-brand-brown uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock size={16} /> Recent Orders
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentOrders.map((ro, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleTrack(undefined, ro.orderId, ro.phone)}
                  className="bg-white p-4 rounded-lg border border-brand-brown/10 shadow-sm hover:shadow-md hover:border-brand-gold cursor-pointer transition-all flex justify-between items-center group"
                >
                  <div>
                    <p className="font-bold text-brand-brown text-sm">#{ro.orderId}</p>
                    <p className="text-xs text-brand-charcoal/60 mt-1">{new Date(ro.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-gold">₹{ro.amount}</p>
                    <div className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center text-brand-brown mt-1 ml-auto group-hover:bg-brand-gold group-hover:text-white transition-colors">
                      <Search size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {orderData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-brand-brown/10"
            >
              <div className="flex justify-between items-center border-b border-brand-brown/10 pb-6 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-brand-charcoal/50 font-bold">Order ID</p>
                  <p className="font-bold text-brand-brown text-lg">{orderData.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-brand-charcoal/50 font-bold">Amount</p>
                  <p className="font-bold text-brand-gold text-lg">₹{orderData.amount}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative py-8">
                <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 bg-brand-brown/10 -ml-0.5" />
                <div className="space-y-12">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = currentStepIndex >= index;
                    const isCurrent = currentStepIndex === index;
                    
                    return (
                      <div key={step.id} className={`relative flex items-center md:justify-between gap-6 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`hidden md:block w-1/2 text-right pr-12 font-serif text-lg ${isCompleted ? 'text-brand-brown font-bold' : 'text-brand-charcoal'}`}>
                          {index % 2 === 0 ? step.label : ''}
                        </div>
                        
                        <div className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center z-10 border-4 border-white ${isCurrent ? 'bg-brand-gold text-white shadow-lg scale-110' : isCompleted ? 'bg-brand-brown text-white' : 'bg-brand-beige text-brand-brown/40'}`}>
                           {step.icon}
                        </div>
                        
                        <div className={`w-full md:w-1/2 md:pl-12 font-serif text-lg ${isCompleted ? 'text-brand-brown font-bold' : 'text-brand-charcoal'}`}>
                           {index % 2 !== 0 ? step.label : <span className="md:hidden">{step.label}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-12 bg-brand-beige p-6 rounded-lg">
                <h3 className="font-bold text-brand-brown mb-4">Order Items</h3>
                <div className="space-y-3 gap-y-3">
                  {orderData.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-brand-brown/10 border-dashed pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand-brown">{item.quantity}x</span>
                        <span className="text-brand-charcoal">{item.name} <span className="text-[10px] uppercase bg-white px-2 py-0.5 rounded ml-2 text-brand-brown font-bold">{item.weight}</span></span>
                      </div>
                      <span className="font-bold text-brand-brown">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
