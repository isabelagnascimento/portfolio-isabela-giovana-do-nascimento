# 🎬 Laboratório de Classificação Visual

## 📝 Descrição do Projeto
Este projeto consiste em um experimento prático focado no treinamento de um modelo de imagem simples utilizando o Teachable Machine (Google). O objetivo principal é demonstrar na prática como a alimentação de um modelo com um dataset restrito e enviesado afeta o comportamento da Inteligência Artificial.

Para a atividade, foram definidas duas classes estereotipadas de pessoas: **Criativo** e **Racional**. O modelo é treinado intencionalmente com imagens baseadas em julgamentos subjetivos, associando aparências físicas a características intelectuais. O experimento culmina em um Memorial de Impacto e Ética, que analisa as consequências e falhas do modelo no mundo real.

O modelo final treinado está disponível para visualização e teste através deste link:
🔗 [Acessar o Modelo no Teachable Machine](https://teachablemachine.withgoogle.com/models/C8_Sj6kQy/)

## 🚀 Tecnologias Utilizadas
* **Plataforma:** Teachable Machine (Google)
* **Entrada de Dados:** Curadoria de imagens estáticas e captura via Webcam em tempo real
* **Técnicas:** Treinamento de Modelo de Visão Computacional, Análise de Viés Algorítmico, Human-in-the-loop

## 📊 Resultados e Aprendizados
Durante os testes de inferência, o sistema funciona de maneira mais clara com fotos estáticas, mas apresenta falhas e maior índice de erros ao analisar imagens ao vivo pela webcam.

**Memorial de Impacto e Ética:**
* **Mecanismo do Viés:** A seleção restrita de dados corrompe a lógica do algoritmo e gera uma visão distorcida da realidade porque ensina a IA a julgar uma característica intelectual baseando-se unicamente na percepção subjetiva do curador, ignorando o contexto real.
* **Consequência Social:** O sistema discrimina as pessoas, pois o aprendizado que a máquina interpreta a partir de dados restritos não reflete a diversidade do mundo, gerando marginalização baseada em estereótipos visuais.
* **Ação Mitigadora:** A implementação de um processo de "Human-in-the-loop" garante a avaliação crítica e a diversificação do dataset por um comitê humano antes do treinamento, o que impede que os vieses inconscientes do desenvolvedor alimentem o modelo final.

## 🔧 Como Executar
1. Clone este repositório.
2. Acesse a pasta `classificacao-visual-02` (ou o nome da pasta onde você salvou o projeto).
3. Abra o arquivo `Laboratório de Classificação Visual - Experiência 02.pdf` para visualizar os prints que evidenciam os dados de treinamento e a falha de classificação da IA.
4. Teste o modelo enviesado acessando o link: https://teachablemachine.withgoogle.com/models/C8_Sj6kQy/

---
[Voltar ao início](../README.md)
