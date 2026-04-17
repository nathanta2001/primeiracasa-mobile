# 📱 Primeira Casa - Mobile (Work in Progress)

Este repositório contém a versão mobile do projeto **Primeira Casa**, reconstruída do zero utilizando **React Native** e **Expo**. O objetivo é oferecer uma experiência nativa fluida para a gestão de inventário e listas residenciais, aproveitando os recursos de hardware dos dispositivos móveis.

## 🛠️ Stack Tecnológica

* **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
* **Navegação:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
* **Linguagem:** TypeScript
* **Consumo de API:** Axios
* **Estilização:** NativeWind / Tailwind CSS (opcional, conforme sua escolha)

## ✨ Funcionalidades em Implementação

* [x] **Arquitetura de Navegação:** Estrutura de abas (Tabs) configurada com Expo Router.
* [x] **Autenticação:** Tela de login integrada com o backend.
* [x] **Gestão de Itens:** Listagem e visualização de detalhes de itens da casa.
* [ ] **Sincronização Offline:** (Em desenvolvimento).
* [ ] **Câmera Nativa:** Para registro fotográfico de produtos.

## 🏗️ Estrutura de Pastas (Expo Router)

O projeto utiliza a nova estrutura do Expo SDK:
* `src/app/`: Contém as rotas e layouts da aplicação.
* `src/components/`: Componentes modulares reutilizáveis.
* `src/services/`: Integração com a API REST.
* `src/types/`: Definições de interfaces TypeScript para consistência de dados.

## 🚀 Como Executar

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/nathanta2001/primeiracasa-mobile.git](https://github.com/nathanta2001/primeiracasa-mobile.git)
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o Expo Go:**
    ```bash
    npx expo start
    ```

---
**Nota:** Este projeto está em fase ativa de desenvolvimento.
Desenvolvido por [Nathan](https://github.com/nathanta2001) 🚀
