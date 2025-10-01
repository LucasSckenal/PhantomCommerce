"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import gameData from '../data/gameData.json';
import Header from '../components/Header/Header';
import GameGrid from '../components/GameGrid/GameGrid';
import styles from './SearchPage.module.scss';
import { SearchX } from 'lucide-react';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const searchedGames = useMemo(() => {
        if (!query) {
            return [];
        }
        return gameData.filter(game =>
            game.title.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

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
                            <GameGrid games={searchedGames} />
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

export default function SearchPage() {
    return (
        <Suspense fallback={<div>A carregar...</div>}>
            <SearchResults />
        </Suspense>
    );
}

