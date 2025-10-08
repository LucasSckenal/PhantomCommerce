"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import Header from '../components/Header/Header';
import GameCard from '../components/GameCard/GameCard'; // Usando GameCard
import styles from './SearchPage.module.scss';
import { SearchX } from 'lucide-react';
import { SearchProvider, useSearch } from '../contexts/SearchContext'; // 1. Importa o context

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { allGames, isSearching } = useSearch(); // 2. Usa o estado do context

    const searchedGames = useMemo(() => {
        if (!query || allGames.length === 0) {
            return [];
        }
        // 3. Filtra a lista de jogos vinda do Firebase
        return allGames.filter(game =>
            game.title.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, allGames]);

    if (isSearching && searchedGames.length === 0) {
        return <div>Buscando...</div>
    }

    return (
        <div className={styles.searchPageWrapper}>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>
                    {searchedGames.length > 0 ? (
                        <>
                            <h1 className={styles.title}>
                                Resultados para: <span>"{query}"</span>
                            </h1>
                            <p className={styles.resultsCount}>
                                {searchedGames.length} jogo(s) encontrado(s)
                            </p>
                            <div className={styles.gameGrid}>
                                {searchedGames.map(game => (
                                    <GameCard key={game.id} game={game} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.noResults}>
                            <SearchX size={64} className={styles.noResultsIcon} />
                            <h1 className={styles.title}>
                                Nenhum resultado para: <span>"{query}"</span>
                            </h1>
                            <p className={styles.resultsCount}>
                                Tente uma busca diferente ou verifique a ortografia.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// 4. Envolve a página com o provider
export default function SearchPage() {
    return (
        <Suspense fallback={<div>A carregar...</div>}>
            <SearchProvider>
                <SearchResults />
            </SearchProvider>
        </Suspense>
    );
}
