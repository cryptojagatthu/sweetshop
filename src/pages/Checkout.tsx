import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const API_URL = (import.meta as any).env.VITE_API_URL || "";

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  const total = getTotal();
  const deliveryCharges = total > 1000 ? 0 : 50;
  const finalTotal = total > 0 ? total + deliveryCharges : 0;

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    deliveryType: "Home Delivery",
    instructions: "",
    paymentMethod: "COD"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return navigate("/cart");
    }

    setLoading(true);

    try {
      // 1. Create order on backend (mocked razorpay via express server)
      const resp = await fetch(`${API_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal * 100 }) // Razorpay expects paise
      });
      const order = await resp.json();

      if (formData.paymentMethod === "Razorpay" && order.id) {
        // Load razorpay window
        const res = await loadRazorpay();
        if (!res) {
          toast.error("Razorpay SDK failed to load. Please try another payment method or COD.");
          setLoading(false);
          return;
        }

        const options = {
          key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID || "rzp_test_mockkey", // In prod, we get this from backend config endpoint or env
          amount: order.amount,
          currency: "INR",
          name: "Haji Syeed Sweets",
          description: "Online Order",
          order_id: order.id,
          handler: async function (response: any) {
             const verifyResp = await fetch(`${API_URL}/api/orders/verify`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
               })
             });
             const verifyJson = await verifyResp.json();
             if (verifyJson.success) {
                completeOrderSaving(order.id, "Paid");
             } else {
                toast.error("Payment verification failed!");
                setLoading(false);
             }
          },
          prefill: {
            name: formData.customerName,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: "#4A3225" }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on("payment.failed", function (response: any) {
           toast.error(response.error.description);
           setLoading(false);
        });
        rzp1.open();
      } else {
        // COD or mock bypass
        if (formData.paymentMethod === "COD") {
          completeOrderSaving(`ORD_COD_${Date.now()}`, "Pending");
        } else {
           // Direct mock mode
           completeOrderSaving(order.id || `ORD_MOCK_${Date.now()}`, "Paid");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate order.");
      setLoading(false);
    }
  };

  const completeOrderSaving = async (paymentOrderId: string, paymentStatus: string) => {
    try {
      const orderData = {
        orderId: paymentOrderId,
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        deliveryType: formData.deliveryType,
        instructions: formData.instructions,
        paymentMethod: formData.paymentMethod,
        amount: finalTotal,
        items: items
      };

      const resp = await fetch(`${API_URL}/api/orders/confirm`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ orderData, paymentStatus })
      });
      
      const json = await resp.json();
      if (!json.success) throw new Error(json.error);

      setOrderId(paymentOrderId);
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      toast.error("Error saving order. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  // Render Success Screen
  if (success) {
    return (
      <div className="min-h-screen pt-[120px] pb-24 bg-brand-cream flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-lg w-full rounded-2xl p-8 md:p-12 text-center shadow-2xl border border-brand-brown/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="text-green-600" size={40} />
          </motion.div>
          <h1 className="text-3xl font-serif font-bold text-brand-brown mb-2">Thank you for your order!</h1>
          <p className="text-brand-charcoal/70 mb-6">Your sweets are being prepared.</p>
          
          <div className="bg-brand-beige/50 p-4 rounded text-sm text-left mb-8 space-y-2">
            <div className="flex justify-between border-b border-brand-brown/10 pb-2">
              <span className="text-brand-charcoal/60">Order ID</span>
              <span className="font-bold text-brand-brown">{orderId}</span>
            </div>
            <div className="flex justify-between border-b border-brand-brown/10 pb-2 pt-2">
              <span className="text-brand-charcoal/60">Payment</span>
              <span className="font-bold text-brand-brown">Success</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-brand-charcoal/60">Est. Delivery</span>
              <span className="font-bold text-brand-brown">Today, 5:00 PM</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/track-order')} className="w-full bg-brand-brown hover:bg-brand-brown-dark text-white py-3.5 rounded text-xs font-bold tracking-[2px] uppercase transition-colors">
              Track Order
            </button>
            <button onClick={() => navigate('/sweets')} className="w-full bg-white border border-brand-brown text-brand-brown hover:bg-brand-beige py-3.5 rounded text-xs font-bold tracking-[2px] uppercase transition-colors">
              Continue Shopping
            </button>
            <a href="https://wa.me/9108977077110" target="_blank" rel="noopener noreferrer" className="w-full text-brand-gold hover:text-brand-brown text-xs font-bold tracking-[2px] uppercase transition-colors underline underline-offset-4 mt-2">
              WhatsApp Support
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render Checkout Form
  return (
    <div className="pt-[120px] pb-24 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-brand-brown mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Customer Details */}
            <div className="bg-white rounded-xl border border-brand-brown/10 p-6 md:p-8">
              <h2 className="font-serif text-xl font-bold text-brand-brown mb-6 pl-4 border-l-4 border-brand-gold">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/70 mb-2">Full Name *</label>
                  <input required name="customerName" value={formData.customerName} onChange={handleChange} className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/70 mb-2">Phone Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" placeholder="+91 9876543210" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/70 mb-2">Email Address (Optional)</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" placeholder="john@example.com" />
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-xl border border-brand-brown/10 p-6 md:p-8">
              <h2 className="font-serif text-xl font-bold text-brand-brown mb-6 pl-4 border-l-4 border-brand-gold">Delivery details</h2>
              
              <div className="mb-6 flex gap-4">
                {['Home Delivery', 'Store Pickup'].map(type => (
                  <label key={type} className={`flex-1 border rounded p-4 cursor-pointer flex items-center justify-center font-bold text-sm transition-colors ${formData.deliveryType === type ? 'border-brand-brand-gold bg-brand-beige text-brand-brown' : 'border-brand-brown/20 text-brand-charcoal/70'}`}>
                    <input type="radio" name="deliveryType" value={type} checked={formData.deliveryType === type} onChange={handleChange} className="hidden" />
                    {type}
                  </label>
                ))}
              </div>

              {formData.deliveryType === 'Home Delivery' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/70 mb-2">Full Address *</label>
                    <textarea required={formData.deliveryType === 'Home Delivery'} name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold" placeholder="123 Sweet Lane..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/70 mb-2">City *</label>
                    <input required={formData.deliveryType === 'Home Delivery'} name="city" value={formData.city} onChange={handleChange} className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold" placeholder="Madanapalle" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/70 mb-2">Pincode *</label>
                    <input required={formData.deliveryType === 'Home Delivery'} name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold" placeholder="517325" />
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-xl border border-brand-brown/10 p-6 md:p-8">
              <h2 className="font-serif text-xl font-bold text-brand-brown mb-6 pl-4 border-l-4 border-brand-gold">Special Instructions (Optional)</h2>
              <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows={2} className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold" placeholder="E.g., Less sugar, Gift packing required, Birthday message..." />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-brand-brown/10 p-6 md:p-8">
              <h2 className="font-serif text-xl font-bold text-brand-brown mb-6 pl-4 border-l-4 border-brand-gold">Payment Method</h2>
              <div className="flex flex-col gap-3">
                {/* <label className={`block border p-4 rounded cursor-pointer flex items-center gap-3 ${formData.paymentMethod === 'Razorpay' ? 'bg-brand-beige border-brand-gold' : 'border-brand-brown/20'}`}>
                   <input type="radio" name="paymentMethod" value="Razorpay" checked={formData.paymentMethod === 'Razorpay'} onChange={handleChange} className="text-brand-gold focus:ring-brand-gold h-4 w-4" />
                   <span className="font-bold text-brand-brown">UPI / Card / Net Banking (Razorpay)</span>
                </label> */}
                <label className={`block border p-4 rounded cursor-pointer flex items-center gap-3 ${formData.paymentMethod === 'COD' ? 'bg-brand-beige border-brand-gold' : 'border-brand-brown/20'}`}>
                   <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleChange} className="text-brand-gold focus:ring-brand-gold h-4 w-4" />
                   <span className="font-bold text-brand-brown">Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-brand-brown hover:bg-brand-brown-dark text-white py-4 rounded text-sm font-bold tracking-[2px] uppercase transition-colors flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : `Place Order (₹${finalTotal})`}
            </button>
          </form>

          {/* Sidebar Summary */}
          <div>
            <div className="bg-white rounded-xl border border-brand-brown/10 p-6 sticky top-[110px]">
              <h2 className="font-serif text-xl font-bold text-brand-brown mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={`${item.id}-${item.weight}`} className="flex justify-between items-start text-sm">
                    <div className="flex gap-2">
                      <span className="text-brand-charcoal/60">{item.quantity}x</span>
                      <div>
                        <p className="font-bold text-brand-brown">{item.name}</p>
                        <p className="text-[10px] text-brand-charcoal/60 uppercase">{item.weight}</p>
                      </div>
                    </div>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-brand-brown/10 space-y-3 text-sm">
                <div className="flex justify-between text-brand-charcoal">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{total}</span>
                </div>
                <div className="flex justify-between text-brand-charcoal">
                  <span>Standard Delivery</span>
                  <span className="font-bold">{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}</span>
                </div>
                
                <div className="pt-4 border-t border-brand-brown/10 flex justify-between items-end">
                  <span className="text-lg font-bold text-brand-brown">Total To Pay</span>
                  <span className="text-2xl font-bold text-brand-brown">₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
