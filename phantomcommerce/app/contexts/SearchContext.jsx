"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// 1. IMPORTAÇÃO CENTRALIZADA DO FIREBASE
import { db } from '../lib/firebase'; // Ajuste o caminho conforme sua estrutura
// 2. Importações específicas do Firestore continuam necessárias
import { collection, query, where, getDocs, limit } from "firebase/firestore";

// O bloco de configuração do Firebase foi REMOVIDO daqui

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  const categories = ['aventura', 'acao', 'rpg', 'estrategia', 'esportes', 'corrida'];
  const handleSearchSubmit = (queryText) => {
    if (!queryText) return;
    if (!isNaN(queryText)) {
      router.push(`/product/${queryText}`);
    } else {
      const queryLowerCase = queryText.toLowerCase();
      if (categories.includes(queryLowerCase)) {
        router.push(`/category/${encodeURIComponent(queryLowerCase)}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(queryText)}`);
      }
    }
    clearSearch();
  };

  const handleSearchChange = useCallback(async (event) => {
    const searchText = event.target.value;
    setSearchQuery(searchText);

    if (searchText.length > 0) {
      setIsSearching(true);
      try {
        const gamesRef = collection(db, 'games');
        const q = query(
          gamesRef,
          where('title_lowercase', '>=', searchText.toLowerCase()),
          where('title_lowercase', '<=', searchText.toLowerCase() + '\uf8ff'),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setSearchResults(results);
        setIsResultsVisible(results.length > 0);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
        setSearchResults([]);
        setIsResultsVisible(false);
      } finally {
        setIsSearching(false);
      }
    } else {
      clearSearch();
    }
  }, []);

  const hideSearchResults = () => setIsResultsVisible(false);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsResultsVisible(false);
    setIsSearching(false);
  };

  const value = {
    searchQuery,
    searchResults,
    isResultsVisible,
    isSearching,
    handleSearchSubmit,
    handleSearchChange,
    hideSearchResults,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}