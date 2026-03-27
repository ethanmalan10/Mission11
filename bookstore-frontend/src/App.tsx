import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import BookList from './components/BookList';
import Cart from './components/Cart';

function App() {
  const [view, setView] = useState<'list' | 'cart'>('list');
  const [savedPage, setSavedPage] = useState(1);

  return (
    <CartProvider>
      {view === 'list'
        ? <BookList initialPage={savedPage} onGoToCart={page => { setSavedPage(page); setView('cart'); }} />
        : <Cart onContinueShopping={() => setView('list')} />
      }
    </CartProvider>
  );
}

export default App;
