import { createContext, useContext, useState } from 'react';

interface CartItem {
  bookID: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: { bookID: number; title: string; price: number }) => void;
  updateQuantity: (bookID: number, quantity: number) => void;
  removeFromCart: (bookID: number) => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>(null!);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (book: { bookID: number; title: string; price: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.bookID === book.bookID);
      if (existing) return prev.map(i => i.bookID === book.bookID ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const updateQuantity = (bookID: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => i.bookID === bookID ? { ...i, quantity } : i));
  };

  const removeFromCart = (bookID: number) => {
    setItems(prev => prev.filter(i => i.bookID !== bookID));
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
