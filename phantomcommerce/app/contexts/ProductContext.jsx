'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { db } from '../lib/firebase'; 
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [game, setGame] = useState(null);
    const [relatedGames, setRelatedGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getGame = async (id) => {
        const gameRef = doc(db, 'games', id);
        const gameSnap = await getDoc(gameRef);

        if (!gameSnap.exists()) {
            throw new Error("Jogo não encontrado");
        }
        const gameData = gameSnap.data();
        return {
            id: gameSnap.id,
            ...gameData,
            originalPrice: gameData.oldPrice || gameData.price,
            discountedPrice: gameData.price,
            tags: gameData.categories || [],
            platforms: gameData.platforms || [],
            gallery: gameData.galleryImageUrls || [],
        };
    };

    // Usamos apenas a função original que busca por Nomes
    const getRelatedGames = async (gameNames = []) => {
        if (!gameNames || gameNames.length === 0) return [];
        const gamesRef = collection(db, 'games');
        const q = query(gamesRef, where('title', 'in', gameNames.slice(0, 30)));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            originalPrice: doc.data().oldPrice || doc.data().price,
            discountedPrice: doc.data().price,
            tags: doc.data().categories || [],
            platforms: doc.data().platforms || [],
            gallery: doc.data().galleryImageUrls || [],
        }));
    };

    const fetchProductData = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        setGame(null);
        setRelatedGames([]);
        try {
            const mainGame = await getGame(id);
            setGame(mainGame);

            // LÓGICA ATUALIZADA E SIMPLIFICADA
            // Pega a lista de nomes da propriedade que existir, ou uma lista vazia.
            const namesList = mainGame.relatedGameNames || mainGame.relatedGameIds || [];

            // Se a lista tiver nomes, busca os jogos relacionados
            if (namesList.length > 0) {
                const related = await getRelatedGames(namesList);
                setRelatedGames(related);
            }

        } catch (err) {
            console.error("Erro ao buscar dados do produto:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = { game, relatedGames, loading, error, fetchProductData };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct deve ser usado dentro de um ProductProvider');
    }
    return context;
}