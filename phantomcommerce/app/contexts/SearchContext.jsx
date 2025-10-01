"use client";

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import gameData from '../data/gameData.json';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  const categories = ['aventura', 'acao', 'rpg', 'estrategia', 'esportes', 'corrida'];

  const handleSearchSubmit = (query) => {
    if (!query) return;

    if (!isNaN(query)) {
      router.push(`/product/${query}`);
    } else {
      const queryLowerCase = query.toLowerCase();
      if (categories.includes(queryLowerCase)) {
        router.push(`/category/${encodeURIComponent(queryLowerCase)}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
    
    clearSearch();
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // CORREÇÃO: Alterado de `query.length > 1` para `query.length > 0`
    // para que a busca inicie na primeira letra.
    if (query.length > 0) {
      const filteredGames = gameData.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setSearchResults(filteredGames);
      // A lista só aparece se houver resultados
      setIsResultsVisible(filteredGames.length > 0); 
    } else {
      setSearchResults([]);
      setIsResultsVisible(false);
    }
  };

  const hideSearchResults = () => {
    setIsResultsVisible(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsResultsVisible(false);
  };

  const value = {
    searchQuery,
    searchResults,
    isResultsVisible,
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

