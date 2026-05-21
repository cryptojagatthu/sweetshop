import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { Settings, Save, ArrowLeft, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminNotifications() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    telegramChatId: '',
    newOrderEnabled: true,
    statusEnabled: true,
    bulkEnabled: true,
    dailyEnabled: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'notifications');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    if (auth.currentUser) fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'notifications'), settings, { merge: true });
      toast.success('Notification settings saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!auth.currentUser) {
    return <div className="p-8 text-center mt-24">Please login via Admin Dashboard first.</div>;
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/admin" className="inline-flex items-center gap-2 text-brand-brown hover:text-brand-gold text-sm font-bold uppercase tracking-wider mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-serif font-bold text-brand-brown flex items-center gap-3">
             <Bell className="text-brand-gold" size={32} />
             Notification Settings
           </h1>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-brown/10 flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown"></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-brand-brown/10 space-y-8">
            
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Telegram Configuration</h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal/70 mb-2">Telegram Chat ID</label>
                <input 
                  type="text" 
                  name="telegramChatId" 
                  value={settings.telegramChatId} 
                  onChange={handleChange} 
                  className="w-full border border-brand-brown/20 rounded p-3 focus:outline-none focus:border-brand-gold"
                  placeholder="e.g. -123456789 or 987654321" 
                />
                <p className="text-[10px] text-brand-charcoal/50 mt-1.5">The ID of the user, group, or channel where the bot will send notifications. Leave blank to use server default.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Triggers & Events</h2>
              
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="newOrderEnabled" checked={settings.newOrderEnabled} onChange={handleChange} className="w-4 h-4 text-brand-gold focus:ring-brand-gold rounded border-brand-brown/20" />
                  <div>
                    <span className="block font-bold text-sm text-brand-brown">New Orders</span>
                    <span className="block text-xs text-brand-charcoal/60">Receive a detailed message when a new order is paid and confirmed.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="statusEnabled" checked={settings.statusEnabled} onChange={handleChange} className="w-4 h-4 text-brand-gold focus:ring-brand-gold rounded border-brand-brown/20" />
                  <div>
                    <span className="block font-bold text-sm text-brand-brown">Order Status Updates</span>
                    <span className="block text-xs text-brand-charcoal/60">Notify when order status changes (Preparing, Out for Delivery, etc).</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="bulkEnabled" checked={settings.bulkEnabled} onChange={handleChange} className="w-4 h-4 text-brand-gold focus:ring-brand-gold rounded border-brand-brown/20" />
                  <div>
                    <span className="block font-bold text-sm text-brand-brown">High Value / Bulk Order Alerts</span>
                    <span className="block text-xs text-brand-charcoal/60">Get instant 🔥 alerts for orders above ₹5,000 or marked as bulk/wedding.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="dailyEnabled" checked={settings.dailyEnabled} onChange={handleChange} className="w-4 h-4 text-brand-gold focus:ring-brand-gold rounded border-brand-brown/20" />
                  <div>
                    <span className="block font-bold text-sm text-brand-brown">Daily Sales Summary</span>
                    <span className="block text-xs text-brand-charcoal/60">Receive a daily scheduled message at 10:00 PM with total revenue and stats.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-brand-brown text-white py-3.5 rounded font-bold uppercase tracking-[2px] text-xs hover:bg-brand-brown-dark transition-colors disabled:opacity-70"
              >
                {saving ? 'Saving...' : <><Save size={16} /> Save Configuration</>}
              </button>
            </div>
            
          </form>
        )}
      </div>
    </div>
  );
}
