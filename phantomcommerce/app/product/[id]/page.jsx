'use client';

import { useEffect } from 'react';
import { useProduct } from '../../contexts/ProductContext'; // Ajuste o caminho
import Header from '../../components/Header/Header';
import HeroSection from '../../components/HeroSection/HeroSection';
import GameDetails from '../../components/GameDetails/GameDetails';
import RelatedGames from '../../components/RelatedGames/RelatedGames';

export default function ProductPage({ params }) {
    const { id } = params;
    const { game, relatedGames, loading, error, fetchProductData } = useProduct();

    // Dispara a busca de dados quando o ID da página mudar
    useEffect(() => {
        if (id) {
            fetchProductData(id);
        }
    }, [id, fetchProductData]);

    if (loading) {
        return <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando...</h1>;
    }

    if (error) {
        return <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Erro: {error}</h1>;
    }

    if (!game) {
        return <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Jogo não encontrado</h1>;
    }

    return (
        <>
            <Header />
            <HeroSection game={game} />
            <GameDetails game={game} />
            <RelatedGames games={relatedGames} />
        </>
    );
}
