import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { Package, Search, Mail, Bell } from "lucide-react";

const API_URL = (import.meta as any).env.VITE_API_URL || "";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }, (err) => {
        console.error(err);
        toast.error("Error loading orders.");
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
       toast.error(error.message);
    }
  };

  const updateOrderStatus = async (docId: string, orderId: string, newStatus: string) => {
    try {
      const resp = await fetch(`${API_URL}/api/orders/update-status`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ docId, orderId, newStatus })
      });
      const json = await resp.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Status updated and notification sent");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-brand-brown/10 max-w-sm w-full text-center">
          <h1 className="text-2xl font-serif font-bold text-brand-brown mb-6">Admin Access</h1>
          <p className="text-sm text-brand-charcoal/70 mb-8">Sign in with an authorized account to access the dashboard.</p>
          <button onClick={handleLogin} className="w-full flex items-center justify-center gap-3 bg-brand-brown text-white py-3 rounded font-bold hover:bg-brand-brown-dark transition-colors">
            <Mail size={18} /> Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const todayOrders = orders.filter(o => 
    o.createdAt && new Date(o.createdAt.seconds * 1000).toDateString() === new Date().toDateString()
  );
  
  const revenue = orders.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-brand-cream pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-brand-brown">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm font-semibold">{user.email}</span>
            <Link to="/admin/notifications" className="text-brand-brown hover:text-brand-gold transition-colors p-2 bg-white rounded-full shadow-sm border border-brand-brown/10">
              <Bell size={20} />
            </Link>
            <button onClick={() => signOut(auth)} className="text-xs bg-white border border-brand-brown text-brand-brown px-3 py-1.5 rounded font-bold hover:bg-brand-beige">Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-brand-brown/10 shadow-sm">
            <p className="text-[11px] uppercase tracking-wider text-brand-charcoal/60 font-bold mb-1">Today's Orders</p>
            <p className="text-3xl font-bold text-brand-brown">{todayOrders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-brand-brown/10 shadow-sm">
            <p className="text-[11px] uppercase tracking-wider text-brand-charcoal/60 font-bold mb-1">Pending Orders</p>
            <p className="text-3xl font-bold text-brand-brown">{orders.filter(o => o.status === 'Accepted').length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-brand-brown/10 shadow-sm">
            <p className="text-[11px] uppercase tracking-wider text-brand-charcoal/60 font-bold mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-brand-gold">₹{revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-brand-brown/10 shadow-sm">
            <p className="text-[11px] uppercase tracking-wider text-brand-charcoal/60 font-bold mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-brand-brown">{new Set(orders.map(o => o.email || o.phone)).size}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-brand-brown/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-brown/10 flex justify-between items-center bg-brand-beige/30">
            <h2 className="font-serif text-xl font-bold text-brand-brown flex items-center gap-2"><Package size={20} /> Recent Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-charcoal">
              <thead className="bg-brand-beige/50 text-[10px] uppercase font-bold tracking-wider text-brand-charcoal/70 border-b border-brand-brown/10">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-brown/5">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-brand-beige/20 inline-transition">
                    <td className="p-4">
                      <p className="font-bold text-brand-brown text-xs">{order.orderId}</p>
                      <p className="text-[10px] text-brand-charcoal/50 mt-1">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Just now'}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-brand-brown">{order.customerName}</p>
                      <p className="text-xs text-brand-charcoal/70">{order.phone}</p>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      <p className="text-xs truncate">{order.items.map((i:any) => `${i.quantity}x ${i.name}`).join(', ')}</p>
                    </td>
                    <td className="p-4 font-bold text-brand-brown">
                      ₹{order.amount}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] rounded font-bold uppercase tracking-wide ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                       <span className={`px-2.5 py-1 text-[10px] rounded outline outline-1 outline-offset-[-1px] font-bold uppercase tracking-wide ${
                         order.status === 'Delivered' ? 'bg-brand-gold/10 text-brand-brown outline-brand-gold/30' : 
                         order.status === 'Out for Delivery' ? 'bg-blue-50 text-blue-700 outline-blue-200' : 
                         'bg-brand-beige text-brand-brown outline-brand-brown/10'
                       }`}>
                         {order.status}
                       </span>
                    </td>
                    <td className="p-4">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, order.orderId, e.target.value)}
                        className="text-xs font-bold bg-white border border-brand-brown/20 rounded p-1.5 focus:outline-none focus:border-brand-gold cursor-pointer"
                      >
                        {['Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-brand-charcoal/50">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
