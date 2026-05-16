# 🎬 GameAds Manager — Engenharia de Software e IA com Bubble.io

## 📝 Descrição do Projeto
Este projeto consiste no desenvolvimento de uma aplicação web de gestão de campanhas publicitárias para jogos, chamada **GameAds Manager**. A base estrutural do sistema foi gerada utilizando a Inteligência Artificial nativa da plataforma Bubble.io, atuando como um acelerador de rascunho, enquanto o back-end, as regras de negócio e as camadas de segurança foram refatorados manualmente sob os pilares tradicionais da engenharia de software.

O objetivo principal do laboratório é mitigar riscos comuns em ambientes LCNC (Low-Code/No-Code), tratando de tópicos críticos como governança de infraestrutura, engenharia de privacidade (*Privacy by Design*) e modelagem relacional de dados para evitar o desperdício de Unidades de Carga de Trabalho (WUs).

A aplicação em ambiente de testes pode ser acessada através do link abaixo:
🔗 [Acessar o GameAds Manager (Bubble.io)](https://isabelagiovana18.bubbleapps.io/version-test/)

## 🚀 Tecnologias Utilizadas
* **Plataforma Principal:** Bubble.io (Visual Framework & Workflow Engine)
* **Banco de Dados:** Banco relacional embutido com vinculação de Option Sets
* **Segurança e Integração:** Bubble Data API (JSON), Regras de Privacidade Dinâmicas

## 📊 Resultados e Aprendizados
A atuação crítica do desenvolvedor sobre o rascunho gerado pela IA permitiu a entrega de um sistema escalável, seguro e bem governado.

* **Arquitetura e Modelagem de Dados:** Para evitar erros de digitação e condições com textos soltos (*hardcoded*), os campos de texto livre gerados pela IA para *status* e canais de veiculação foram excluídos. Em seu lugar, implementou-se os conjuntos de opções (**Option Sets**: `OS_Status` e `OS_Channel`), restringindo as entradas às plataformas homologadas (Meta Ads, TikTok Ads, Google Ads). As tabelas mapeadas incluem `Campaign`, `DailyResult`, `Game` e `User`.
* **Segurança (Privacy by Design):** Por padrão, a IA cria tabelas expostas e visíveis publicamente. Essa vulnerabilidade (alinhada ao OWASP Top Ten para LCNC) foi corrigida removendo as permissões genéricas e estabelecendo regras estritas de propriedade (*Acesso Restrito*), onde a condição obriga que `This Campaign's owner is Current User`, impedindo o vazamento acidental de dados no lado do cliente.
* **Governança de Workflows:** As lógicas foram categorizadas de forma visual e documentadas nativamente na plataforma utilizando o recurso *Notes*. A organização segue um código rígido de cores de ação: **Verde** para criação e edição, **Vermelho** para exclusão de dados e **Azul/Cinza** para navegação e controles de interface.
* **Estratégia de Saída (Vendor Lock-in):** Como o Bubble detém a posse do código-fonte, estabeleceu-se um plano de mitigação de dependência de fornecedor. Caso ocorra a necessidade de migrar para uma arquitetura tradicional (como React e Node.js com PostgreSQL), os dados estruturados do sistema estão prontos para extração segura através da ativação da *Data API* do Bubble em formato JSON ou via exportação em lote por planilhas CSV.

## 🔧 Como Executar
1. Clone este repositório.
2. Acesse a pasta `gameads-manager-05`.
3. Abra o arquivo `Relatório+GameAds+Manager.pdf` para inspecionar os prints comprobatórios do rascunho do banco de dados, mapeamento de Option Sets, regras de privacidade e a categorização visual dos workflows.
4. Teste a usabilidade, o cadastro e o isolamento de dados acessando diretamente a URL de homologação: https://isabelagiovana18.bubbleapps.io/version-test/

---
[Voltar ao início](../README.md)
