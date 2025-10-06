// contexts/CartContext.jsx
"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  // Função para obter a referência do carrinho do usuário
  const getCartRef = () => {
    if (!currentUser) return null;
    return doc(db, 'users', currentUser.uid, 'private', 'cart');
  };

  // Carregar carrinho do Firestore quando o usuário fizer login
  useEffect(() => {
    if (currentUser) {
      const cartRef = getCartRef();
      if (!cartRef) return;

      // Ouvir mudanças em tempo real no carrinho
      const unsubscribe = onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) {
          const cartData = docSnap.data();
          setCartItems(cartData.items || []);
        } else {
          // Se não existir, criar um carrinho vazio
          setDoc(cartRef, { 
            items: [],
            createdAt: new Date(),
            updatedAt: new Date()
          });
          setCartItems([]);
        }
        setIsLoading(false);
      }, (error) => {
        console.error('Erro ao carregar carrinho:', error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Usuário não logado - usar localStorage
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
      setIsLoading(false);
    }
  }, [currentUser]);

  // Salvar carrinho no localStorage para usuários não logados
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);

  // Função para sincronizar com Firestore
  const syncCartWithFirestore = async (newItems) => {
    if (!currentUser) return;

    try {
      const cartRef = getCartRef();
      if (!cartRef) return;

      await setDoc(cartRef, { 
        items: newItems,
        updatedAt: new Date(),
        itemCount: newItems.reduce((total, item) => total + (item.quantity || 1), 0),
        totalValue: newItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error);
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(prev => !prev);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const addToCart = async (product) => {
    const newItems = [...cartItems];
    const existingItemIndex = newItems.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Item já existe, incrementar quantidade
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: (newItems[existingItemIndex].quantity || 1) + 1,
        updatedAt: new Date()
      };
    } else {
      // Novo item
      newItems.push({
        ...product,
        quantity: 1,
        addedAt: new Date(),
        updatedAt: new Date()
      });
    }

    setCartItems(newItems);
    
    // Sincronizar com Firestore se usuário estiver logado
    if (currentUser) {
      await syncCartWithFirestore(newItems);
    }
  };

  const removeFromCart = async (itemId) => {
    const newItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(newItems);
    
    // Sincronizar com Firestore se usuário estiver logado
    if (currentUser) {
      await syncCartWithFirestore(newItems);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    const newItems = cartItems.map(item =>
      item.id === itemId
        ? { 
            ...item, 
            quantity: newQuantity,
            updatedAt: new Date()
          }
        : item
    );

    setCartItems(newItems);
    
    // Sincronizar com Firestore se usuário estiver logado
    if (currentUser) {
      await syncCartWithFirestore(newItems);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    
    // Sincronizar com Firestore se usuário estiver logado
    if (currentUser) {
      await syncCartWithFirestore([]);
    } else {
      localStorage.removeItem('guestCart');
    }
  };

  // Migrar carrinho do localStorage para Firestore quando usuário fizer login
  const migrateGuestCartToUser = async () => {
    if (!currentUser) return;

    const guestCart = localStorage.getItem('guestCart');
    if (guestCart) {
      const guestItems = JSON.parse(guestCart);
      if (guestItems.length > 0) {
        try {
          // Buscar carrinho atual do usuário no Firestore
          const cartRef = getCartRef();
          const cartSnap = await getDoc(cartRef);
          let currentFirestoreItems = [];
          
          if (cartSnap.exists()) {
            currentFirestoreItems = cartSnap.data().items || [];
          }

          // Combinar itens do guest com possíveis itens já no Firestore
          const mergedItems = [...currentFirestoreItems];
          
          guestItems.forEach(guestItem => {
            const existingIndex = mergedItems.findIndex(item => item.id === guestItem.id);
            if (existingIndex > -1) {
              // Item existe em ambos, somar quantidades
              mergedItems[existingIndex] = {
                ...mergedItems[existingIndex],
                quantity: (mergedItems[existingIndex].quantity || 1) + (guestItem.quantity || 1),
                updatedAt: new Date()
              };
            } else {
              // Novo item
              mergedItems.push({
                ...guestItem,
                addedAt: new Date(),
                updatedAt: new Date()
              });
            }
          });

          setCartItems(mergedItems);
          await syncCartWithFirestore(mergedItems);
          localStorage.removeItem('guestCart');
          
          console.log('Carrinho migrado com sucesso para a conta do usuário');
        } catch (error) {
          console.error('Erro ao migrar carrinho:', error);
        }
      }
    }
  };

  // Executar migração quando usuário fizer login
  useEffect(() => {
    if (currentUser) {
      migrateGuestCartToUser();
    }
  }, [currentUser]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => {
      return count + (item.quantity || 1);
    }, 0);
  };

  // Função para salvar o carrinho atual explicitamente (útil antes de logout)
  const saveCart = async () => {
    if (currentUser) {
      await syncCartWithFirestore(cartItems);
    }
  };

  const value = {
    isCartOpen,
    cartItems,
    isLoading,
    handleCartClick,
    closeCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
    saveCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};