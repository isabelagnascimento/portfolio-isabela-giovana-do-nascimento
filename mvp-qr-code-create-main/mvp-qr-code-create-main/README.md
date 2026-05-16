# 🟦 QR Code Create • Professional QR Generator

> Uma plataforma full-stack moderna e inteligente para criação, personalização e gestão de QR Codes em alta resolução.

![Status do Projeto](https://img.shields.io/badge/Status-Completo-success?style=for-the-badge)
![Autora](https://img.shields.io/badge/Autora-Isabela%20Giovana%20do%20Nascimento-blueviolet?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Firebase%20%7C%20Gemini-blue?style=for-the-badge)

---

## 📖 Sobre o Projeto

O **QR Code Create** é muito mais que um simples gerador. Desenvolvido para oferecer uma experiência de design fluida, ele combina o poder da **Inteligência Artificial (Gemini)** com uma interface reativa de alta performance. O foco do projeto é permitir que empresas e usuários finais criem códigos QR esteticamente agradáveis, profissionais e totalmente personalizados em segundos.

---

## 🚀 Funcionalidades Principais

### 🎨 Personalização Extrema
*   **Estilização Dinâmica:** Altere cores, formatos de pontos (dots), tipos de cantos e padrões de fundo com pré-visualização instantânea (16ms de latency).
*   **Branding:** Upload de logos personalizados via Cloud Storage para embutir no centro do QR Code.
*   **Presets Premium:** Seleção de temas prontos com curadoria de design (Ocean Breeze, Sunset, Midnight).

### 🤖 Inteligência & IA
*   **Design Assisted by AI:** Um assistente integrado que utiliza o modelo **Gemini** para gerar configurações de estilo baseadas em descrições em linguagem natural.
*   **Voice Input:** Entrada de dados e comandos via reconhecimento de voz (Web Speech API).

### 📊 Gestão & Administração
*   **User History:** Histórico persistente no Firestore permitindo que usuários logados gerenciem suas criações passadas.
*   **Admin Dashboard:** Painel exclusivo para controle de recursos globais (Toggle de IA, Exportação HD, etc.).
*   **Analytics Real-time:** Monitoramento de eventos (downloads, uploads, uso de IA) via Firebase Analytics.

### ♿ Acessibilidade & UX
*   **Menu de Acessibilidade:** Ajuste de tamanho de fonte e modo de alto contraste.
*   **Responsive Design:** Otimizado para Desktop, Tablet e Mobile.
*   **Exportação de Alta Qualidade:** Suporte para formatos PNG (Raster) e SVG (Vetor) em até 4000px.

---

## 🛠️ Stack Tecnológica

### Frontend & Core
*   **React 18** com **TypeScript** para robustez no desenvolvimento.
*   **Vite** como build tool para máxima velocidade de desenvolvimento.
*   **Tailwind CSS** para estilização utilitária e responsiva.
*   **Framer Motion** para animações fluidas e transições de tab.
*   **Zustand** para gerenciamento de estado global simplificado.

### Bibliotecas Específicas
*   `qr-code-styling`: Motor principal de geração e exportação de QR Codes.
*   `lucide-react`: Set de ícones modernos e consistentes.
*   `@google/generative-ai`: Integração com o Google Gemini.
*   `base-ui`: Componentes acessíveis e unstyled para UI.

### Infraestrutura (Firebase)
*   **Authentication:** Login via Google.
*   **Firestore:** Banco de dados NoSQL para histórico e configurações globais.
*   **Cloud Storage:** Armazenamento seguro de imagens e logos.
*   **Analytics:** Rastreamento de métricas de uso e conversão.

---

## 📂 Organização do Repositório

```text
src/
├── components/
│   ├── features/      # Componentes de negócio (Preview, Config, Upload, IA)
│   ├── ui/            # Componentes de interface base (Buttons, Modals, Inputs)
│   └── AuthProvider   # Contexto de autenticação e proteção de rotas
├── hooks/             # Hooks customizados (useSystemConfig, etc.)
├── store/             # Gerenciamento de estado global (Zustand)
├── services/          # Integrações com APIs externas (Gemini)
├── lib/               # Configurações de terceiros (Firebase SDK)
└── types/             # Definições de tipos TypeScript
