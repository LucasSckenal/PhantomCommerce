// components/GameDetails.tsx
const GameDetails = () => {
    return (
        <section className="my-12 p-8 bg-[#1F222B] rounded-lg grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h2 className="text-3xl font-bold">Sobre o Jogo</h2>
                <p className="mt-4 text-gray-300">
                    Um RPG futurista em mundo aberto com batalhas intensas e narrativa imersiva.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                    <h3 className="text-gray-400">Desenvolvedora</h3>
                    <p className="font-semibold">Night Studio</p>
                </div>
                <div>
                    <h3 className="text-gray-400">Publicadora</h3>
                    <p className="font-semibold">Future Games</p>
                </div>
                <div>
                    <h3 className="text-gray-400">Gêneros</h3>
                    <p className="font-semibold">RPG, Ação, Mundo Aberto</p>
                </div>
                <div>
                    <h3 className="text-gray-400">Classificação</h3>
                    <p className="font-semibold">18+</p>
                </div>
            </div>
        </section>
    );
}

export default GameDetails;