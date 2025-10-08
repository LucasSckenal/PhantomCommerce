"use client";

import { useEffect, useRef } from "react";
import styles from "./styles/NotFound.module.scss";
import Link from "next/link";
import { Ghost, Search } from 'lucide-react';
import { useSearch } from './contexts/SearchContext'; 

export default function NotFoundPage() {
  const {
    searchQuery,
    searchResults,
    isResultsVisible,
    handleSearchSubmit,
    handleSearchChange,
    hideSearchResults,
    clearSearch
  } = useSearch();

  const searchContainerRef = useRef(null);

  // Efeito para fechar os resultados da busca ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        hideSearchResults();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hideSearchResults]);

  const onSearchSubmit = (event) => {
    event.preventDefault();
    handleSearchSubmit(searchQuery);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.illustration}>
           <Ghost className={styles.icon} />
        </div>
        <h1 className={styles.title404}>404</h1>
        <h2 className={styles.subtitle}>Página Não Encontrada</h2>
        <p className={styles.description}>
          Ops! A página que você procura não existe. Que tal tentar uma busca?
        </p>

        {/* Barra de Busca com resultados dinâmicos */}
        <div className={styles.searchSection} ref={searchContainerRef}>
          <form onSubmit={onSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                name="search"
                placeholder="Buscar jogos..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
              />
            </div>
          </form>

          {/* Dropdown de Resultados */}
          {isResultsVisible && searchResults.length > 0 && (
            <div className={styles.searchResultsContainer}>
              <ul className={styles.searchResultsList}>
                {searchResults.map((game) => (
                  <li key={game.id}>
                    <Link href={`/product/${game.id}`} className={styles.searchResultItem} onClick={clearSearch}>
                      <div className={styles.resultImageContainer}>
                        <img src={game.coverImageUrl || game.headerImageUrl} alt={`Capa do jogo ${game.title}`} className={styles.resultImage} />
                      </div>
                      <span className={styles.resultTitle}>{game.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.actions}>
            <Link href="/" className={`${styles.actionButton} ${styles.primary}`}>
              Voltar à Página Inicial
            </Link>
        </div>
      </div>
    </div>
  );
}
