'use client';

import { createContext, useContext, useState, useCallback } from 'react';
// 1. IMPORTAÇÃO CENTRALIZADA DO FIREBASE
import { db } from '../lib/firebase'; // Ajuste o caminho conforme sua estrutura
// 2. Importações específicas do Firestore continuam necessárias
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// O bloco de configuração do Firebase foi REMOVIDO daqui

// 1. Criar o Context
const ProductContext = createContext();

// 2. Criar o Provider (o componente que vai "segurar" e prover os dados)
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
            if (mainGame && mainGame.relatedGameNames) {
                const related = await getRelatedGames(mainGame.relatedGameNames);
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

// 3. Criar um Hook customizado para facilitar o uso do context
export function useProduct() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct deve ser usado dentro de um ProductProvider');
    }
    return context;
}