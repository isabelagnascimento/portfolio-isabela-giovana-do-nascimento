# 📈 Análise Financeira Avançada e Backtesting

## 📝 Descrição do Projeto
Este projeto é um sistema de análise quantitativa de ativos financeiros e backtesting de estratégias. O objetivo principal é aplicar ferramentas de Ciência de Dados no mercado financeiro para avaliar tendências e mitigar riscos através de indicadores técnicos.

O código processa um ano de dados da ação da Petrobras (PETR4.SA) para calcular métricas profissionais (como Volatilidade, Sharpe Ratio e Max Drawdown). Além disso, ele simula um "robô" de investimentos baseado na estratégia de cruzamento de Médias Móveis, comparando matematicamente a sua performance contra a estratégia tradicional de apenas comprar e segurar o ativo ("Buy & Hold").

## 🚀 Tecnologias Utilizadas
* ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) **Linguagem:** Python
* ![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white) **Análise de Dados:** Pandas, YFinance
* ![NumPy](https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white) **Cálculo Científico:** NumPy
* ![Matplotlib](https://img.shields.io/badge/Matplotlib-%23ffffff.svg?style=for-the-badge&logo=Matplotlib&logoColor=black) **Visualização Gráfica:** Matplotlib
* **Ambiente:** Google Colab / Jupyter Notebook

## 📊 Resultados e Aprendizados
O algoritmo obteve sucesso em simular cenários de investimento utilizando rigor matemático e visualizações claras.
* **Tradução de Regras de Negócio em Código:** Consegui transformar conceitos financeiros (como Índice de Força Relativa - RSI e MACD) em lógica de programação funcional.
* **Avaliação de Risco:** Aprendi a calcular o Drawdown e o Sharpe Ratio para entender de forma quantitativa a viabilidade e o risco de um investimento.
* **Data Visualization:** Implementei a plotagem de múltiplos gráficos para facilitar a análise técnica e a tomada de decisão de forma visual.

---

## 📈 Visualização de Dados e Indicadores

Abaixo, apresento os painéis gerados automaticamente pelo script Python utilizando a biblioteca Matplotlib, ilustrando o comportamento da ação e o acionamento da estratégia automatizada.

<img width="670" height="533" alt="Preço + Médias Moveis" src="https://github.com/user-attachments/assets/b99ca10d-65ed-4c86-b8d0-e5b95eb630c2" />

*Figura 1: Evolução do preço da ação frente às Médias Móveis. O cruzamento destas linhas serve como o gatilho para a estratégia automatizada de compra.*

<img width="680" height="537" alt="RSI" src="https://github.com/user-attachments/assets/f498bd40-b30a-4c85-b7bb-22764c19b186" />

*Figura 2: O RSI funciona como o termômetro do ativo. Picos acima da linha tracejada vermelha indicam possível sobrecompra, enquanto vales abaixo da linha verde sinalizam possível sobrevenda.*

<img width="687" height="535" alt="MACD" src="https://github.com/user-attachments/assets/0d24b835-e351-413a-a639-882f01db6d03" />

*Figura 3: Radar de tendências MACD. O distanciamento e cruzamento entre as linhas indicam o ganho ou a perda de força na movimentação dos preços.*

<img width="698" height="541" alt="Drawdown" src="https://github.com/user-attachments/assets/36794304-7f4d-4522-9f03-04f5b16835c5" />

*Figura 4: Medição do risco. O gráfico ilustra o Drawdown, evidenciando o tamanho das quedas percentuais sofridas pelo investimento desde os seus pontos de pico.*

<img width="673" height="547" alt="Comparação de Estratégia" src="https://github.com/user-attachments/assets/096e6337-6ecf-47e9-b308-d3ba7ce24ae1" />

*Figura 5: Backtesting e Validação. Comparativo de performance acumulada no período entre o investidor Humano (que apenas segurou a ação) e o Robô seguindo estritamente a estratégia de cruzamento de médias.*

---

## 🔧 Como Executar
1. Clone o repositório ou abra o arquivo `.ipynb` no Google Colab.
2. Instale as bibliotecas necessárias executando a primeira célula: `!pip install yfinance pandas matplotlib openpyxl numpy`.
3. Rode o script completo.
4. O programa exibirá os resultados do risco no terminal, plotará os gráficos na tela e baixará a planilha `analise_avancada.xlsx` contendo o histórico detalhado dos cálculos.
