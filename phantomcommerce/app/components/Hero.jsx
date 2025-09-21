// components/Hero.tsx
import { Play } from 'lucide-react';

const Hero = () => {
  // NOTA: Para o efeito da imagem de fundo com overlay escuro,
  // usamos um pseudo-elemento ::before com CSS.
  // Adicione isso ao seu `app/globals.css` se necessário,
  // ou use div aninhado como no exemplo.
  return (
    <section 
        className="relative mt-8 rounded-lg overflow-hidden bg-cover bg-center p-8 md:p-12 min-h-[500px] flex flex-col justify-between"
        style={{backgroundImage: "url('/cyber-bg.jpg')"}}
    >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <div className="relative z-10">
            <h1 className="text-5xl font-bold">Cyberworld 2077</h1>
            <div className="flex items-center gap-4 mt-4">
                <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">Disponível</span>
                {/* Outros badges podem ir aqui */}
            </div>
            <div className="mt-2">
                <span className="text-xl text-gray-400 line-through">R$ 350,00</span>
                <span className="text-3xl font-bold ml-2">R$ 150,00</span>
            </div>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            {/* Player de Vídeo Fictício */}
            <div className="bg-black/70 aspect-video rounded-md flex items-center justify-center cursor-pointer group">
                <Play size={64} className="text-white group-hover:scale-110 transition-transform"/>
            </div>

            {/* Detalhes da Compra */}
            <div className="bg-[#1A1C23]/80 backdrop-blur-sm p-6 rounded-md">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-400 line-through">R$ 350,00</span>
                        <h2 className="text-3xl font-bold">R$ 150,00</h2>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-md transition-colors">
                        Comprar
                    </button>
                </div>
                <p className="mt-4 text-gray-300 text-sm">
                    CYBERWORLD 2077 é um jogo onde essa tudo conectado, em umque nesse mundo dominado por corporações e espiões, decisões onde sua vivência tudo é seu momento distópico poder lhe oferecer no mais novo RPG de Night Studio.
                </p>
                <p className="mt-4 text-gray-400 text-xs">Lançamento: 08/10/2025</p>

                <div className="grid grid-cols-2 gap-4 mt-6 text-xs text-gray-300">
                    <div>
                        <h4 className="font-bold text-white mb-1">Requisitos Mínimos</h4>
                        <ul>
                            <li>• CPU: Intel i5</li>
                            <li>• RAM: 8GB</li>
                            <li>• GPU: GTX 970</li>
                            <li>• Armazenamento: 70GB</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-1">Requisitos Recomendados</h4>
                        <ul>
                            <li>• CPU: Intel i7</li>
                            <li>• RAM: 16GB</li>
                            <li>• GPU: RTX 3060</li>
                            <li>• Armazenamento: 70GB</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        {/* Carrossel Fictício */}
        <div className="relative z-10 flex items-center justify-center gap-2 mt-4">
            <button className="text-gray-400">&lt;</button>
            <div className="flex gap-2">
                <div className="w-28 h-16 bg-gray-700 rounded-md border-2 border-white"></div>
                <div className="w-28 h-16 bg-gray-700 rounded-md"></div>
                <div className="w-28 h-16 bg-gray-700 rounded-md"></div>
                <div className="w-28 h-16 bg-gray-700 rounded-md"></div>
            </div>
            <button className="text-gray-400">&gt;</button>
        </div>
    </section>
  );
};

export default Hero;