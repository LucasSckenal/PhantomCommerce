# PhantomCommerce - Loja de Jogos

Uma loja de jogos digitais moderna e responsiva construída com Next.js e SCSS.

## 🚀 Características

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Tema Escuro**: Interface moderna com tema cyberpunk
- **Componentes Modulares**: Arquitetura limpa e reutilizável
- **SCSS**: Estilização avançada com variáveis CSS e mixins
- **Next.js 15**: Framework React mais recente com App Router

## 📱 Seções da Página

### Header
- Logo da loja
- Barra de pesquisa
- Navegação (Home, Categorias)
- Ícones de ação (Wishlist, Carrinho, Perfil)
- Menu mobile responsivo

### Hero Section - Cyberworld 2077
- Informações principais do jogo
- Sistema de avaliação com estrelas
- Preços com desconto
- Botões de ação (Preorder, Ver Trailer)
- Player de vídeo
- Carrossel de imagens
- Card de compra lateral

### Detalhes do Jogo
- Seção "Sobre o Jogo"
- Informações da desenvolvedora
- Gêneros e classificação
- Requisitos mínimos e recomendados

### Jogos Relacionados
- Grid responsivo de jogos
- Cards com imagens, preços e avaliações
- Badges de desconto
- Botões de compra

## 🛠️ Tecnologias Utilizadas

- **Next.js 15.5.3** - Framework React
- **React 19.1.0** - Biblioteca de interface
- **SCSS** - Pré-processador CSS
- **CSS Modules** - Estilos isolados por componente
- **Lucide React** - Biblioteca de ícones moderna

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abrir no navegador:**
   ```
   http://localhost:3000
   ```

## 📁 Estrutura do Projeto

```
phantomcommerce/
├── app/
│   ├── components/          # Componentes React
│   │   ├── Header.js
│   │   ├── HeroSection.js
│   │   ├── GameDetails.js
│   │   └── RelatedGames.js
│   ├── styles/              # Estilos SCSS
│   │   ├── globals.scss
│   │   ├── Header.module.scss
│   │   ├── HeroSection.module.scss
│   │   ├── GameDetails.module.scss
│   │   └── RelatedGames.module.scss
│   ├── layout.js            # Layout principal
│   └── page.js              # Página inicial
├── public/                  # Arquivos estáticos
└── package.json
```

## 🎨 Design System

### Cores
- **Primary BG**: #000000 (Preto)
- **Secondary BG**: #1a1a1a (Cinza escuro)
- **Accent Purple**: #8b5cf6 (Roxo principal)
- **Accent Light Purple**: #a855f7 (Roxo claro)
- **Accent Light Purple 2**: #c084fc (Roxo mais claro)
- **Text Primary**: #ffffff (Branco)
- **Text Secondary**: #e5e7eb (Cinza claro)

### Tipografia
- **Fonte Principal**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700, 800

### Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1024px
- **Large**: > 1024px

## 📱 Responsividade

O design é totalmente responsivo com:
- Grid flexível que se adapta ao tamanho da tela
- Menu mobile com hambúrguer
- Carrossel de imagens otimizado para touch
- Cards que se reorganizam automaticamente
- Tipografia que escala adequadamente

## 🎯 Melhorias Implementadas

- **Paleta de cores atualizada**: Agora usa preto e roxo como na imagem original
- **Ícones Lucide**: Substituição de SVGs por ícones modernos do Lucide React
- **Background futurista**: Hero section com gradientes e efeitos visuais
- **Consistência visual**: Todas as cores e elementos seguem o tema cyberpunk
- **Header transparente**: Header sem background, permitindo que a imagem de fundo seja visível
- **Layout reorganizado**: Conteúdo principal no topo, especificações mais abaixo
- **Efeito de fade**: Imagem de fundo com gradiente vertical para melhor legibilidade
- **Ícones de plataforma**: Xbox, PlayStation e Steam adicionados ao layout
- **Backdrop blur**: Efeitos de vidro fosco nos elementos sobrepostos
- **Logo atualizado**: Carrinho de compras com controle de jogo dentro
- **Notificações**: Badges com número "1" nos ícones de coração e carrinho
- **Background futurista**: Paisagem com vegetação e robôs mecânicos
- **Botões estilizados**: Botão azul para preorder e botão com borda roxa para trailer
- **Tipografia melhorada**: Texto com sombra para melhor legibilidade sobre a imagem
- **Header fixo**: Header agora fica fixo na tela e segue o scroll
- **Fade vertical otimizado**: Transição suave da imagem de fundo para o background escuro

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

## 📄 Licença

Este projeto é apenas para fins educacionais e de demonstração.