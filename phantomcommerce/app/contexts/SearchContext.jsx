"use client";

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from "firebase/firestore";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [allGames, setAllGames] = useState([]);

  // Busca todos os jogos uma vez quando o provider é montado
  useEffect(() => {
    const fetchAllGames = async () => {
      setIsSearching(true);
      try {
        const gamesRef = collection(db, 'games');
        const q = query(gamesRef);
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            originalPrice: doc.data().oldPrice || doc.data().price,
            discountedPrice: doc.data().price,
            tags: doc.data().categories || [],
        }));
        setAllGames(results);
      } catch (error) {
        console.error("Erro ao buscar todos os jogos:", error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchAllGames();
  }, []);

  const categories = ['aventura', 'acao', 'rpg', 'estrategia', 'esportes', 'corrida'];
  
  const handleSearchSubmit = (queryText) => {
    if (!queryText) return;
    const queryLowerCase = queryText.toLowerCase();
    
    if (!isNaN(queryText)) {
      router.push(`/product/${queryText}`);
    } else if (categories.includes(queryLowerCase)) {
      router.push(`/category/${encodeURIComponent(queryLowerCase)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(queryText)}`);
    }
    clearSearch();
  };

  // LÓGICA CORRIGIDA PARA O DROPDOWN
  const handleSearchChange = useCallback((event) => {
    const searchText = event.target.value;
    setSearchQuery(searchText);

    if (searchText.length > 0) {
      // Filtra a lista de jogos já carregada em vez de fazer uma nova chamada ao DB
      const filteredResults = allGames.filter(game => 
        game.title.toLowerCase().includes(searchText.toLowerCase())
      ).slice(0, 5); // Pega os 5 primeiros resultados

      setSearchResults(filteredResults);
      setIsResultsVisible(filteredResults.length > 0);
    } else {
      clearSearch();
    }
  }, [allGames]); // Depende da lista de todos os jogos

  const hideSearchResults = () => setIsResultsVisible(false);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsResultsVisible(false);
  };

  const value = {
    searchQuery,
    searchResults,
    isResultsVisible,
    isSearching,
    allGames,
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

