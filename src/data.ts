export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=2000",
  legacy: "https://images.unsplash.com/photo-1627415959958-38bb1ebb41bc?auto=format&fit=crop&q=80&w=1000",
  sweets_assortment: "https://images.unsplash.com/photo-1541795795328-f073b763494e?auto=format&fit=crop&q=80&w=1000",
  jalebi: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000",
  laddu: "https://images.unsplash.com/photo-1605197143477-9003c27ffb2a?auto=format&fit=crop&q=80&w=1000",
  kaju_katli: "https://images.unsplash.com/photo-1599596395376-b9a3804555ae?auto=format&fit=crop&q=80&w=1000",
  halwa: "https://images.unsplash.com/photo-1589301773112-004313b2de9a?auto=format&fit=crop&q=80&w=1000",
  store_exterior: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000",
  gifts: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000"
};

export const BEST_SELLERS = [
  {
    id: 1,
    name: "Pure Ghee Mysore Pak",
    description: "Melt-in-mouth traditional delicacy made with premium pure ghee.",
    price: "₹600",
    weight: "500g",
    image: IMAGES.sweets_assortment,
    category: "Pure Ghee Specials"
  },
  {
    id: 2,
    name: "Kaju Katli",
    description: "Premium cashew fudge adorned with edible silver leaf.",
    price: "₹1100",
    weight: "1kg",
    image: IMAGES.kaju_katli,
    category: "Dry Fruit Sweets"
  },
  {
    id: 3,
    name: "Motichoor Laddu",
    description: "Fine sweet pearls of besan bound in pure ghee and saffron.",
    price: "₹350",
    weight: "500g",
    image: IMAGES.laddu,
    category: "Traditional Sweets"
  },
  {
    id: 4,
    name: "Badam Halwa",
    description: "Rich and luxurious almond halwa slowly cooked in ghee.",
    price: "₹800",
    weight: "500g",
    image: IMAGES.halwa,
    category: "Pure Ghee Specials"
  }
];

export const CATEGORIES = [
  "Traditional Sweets",
  "Pure Ghee Specials",
  "Dry Fruit Sweets",
  "Festival Specials",
  "Gift Boxes",
  "Savouries",
  "Seasonal Specials"
];
