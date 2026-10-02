# Pokédex SPA

Projeto 1 da disciplina **Programação Web Fullstack**: camada frontend de uma aplicação web em **React.js**, consumindo uma API JSON via **AJAX** e seguindo o conceito de **SPA (Single Page Application)** — todo o conteúdo é renderizado em um único `index.html`, sem recarregar a página.

A aplicação é uma Pokédex: o usuário pesquisa e filtra Pokémon, consulta os detalhes de cada um e monta o seu próprio time (até 6 Pokémon), com apelidos, ordenação e um resumo de tipos e atributos.

## Requisitos do projeto

| Requisito | Escolha |
| --- | --- |
| API JSON aberta | [PokéAPI](https://pokeapi.co) (sem chave de acesso) |
| Hook/funcionalidade do React | `useReducer` |
| Biblioteca externa | [React-Bootstrap](https://react-bootstrap.github.io/) (Bootstrap 5.3) + [React Router](https://reactrouter.com/) |

### Onde o React-Bootstrap é usado

Toda a interface é montada com componentes do React-Bootstrap; o `src/index.css` só tem pequenos ajustes visuais.

- **`components/Layout.jsx`** — `Navbar` responsiva (menu recolhível no celular), `Nav`, `Container`, `Badge`.
- **`pages/PokedexPage.jsx`** — grid com `Row`/`Col`, `Form.Control` (busca) e `Form.Select` (filtro).
- **`components/PokemonCard.jsx`** — `Card`; **`components/Pagination.jsx`** — `Pagination`.
- **`pages/PokemonDetailPage.jsx`** — `Card`, `Button`, `ButtonGroup`, `Alert`.
- **`components/StatBar.jsx`** — `ProgressBar` colorida conforme o valor do atributo.
- **`pages/TeamPage.jsx`** — `ListGroup`, `Form.Control`, `Modal` de confirmação para limpar o time.
- **`components/StatusMessage.jsx`** — `Spinner` (carregando) e `Alert` (erro).
- **`main.jsx`** — importa o CSS do Bootstrap e ativa o tema claro/escuro (`data-bs-theme`) conforme o sistema.

### Onde o `useReducer` é usado

- **`src/state/teamReducer.js`** — reducer do time. Ações: `ADD_MEMBER`, `REMOVE_MEMBER`, `SET_NICKNAME`, `MOVE_MEMBER`, `CLEAR_TEAM`. As regras (máximo de 6, sem repetidos, troca de posição) ficam no reducer, não nos componentes.
- **`src/state/TeamContext.jsx`** — `useReducer(teamReducer, initialTeamState, loadTeamState)`. O terceiro argumento faz a inicialização preguiçosa a partir do `localStorage`; o estado é compartilhado com toda a aplicação via Context.
- **`src/hooks/useFetch.js`** — hook próprio que controla o ciclo de cada requisição AJAX (`FETCH_START`, `FETCH_SUCCESS`, `FETCH_ERROR`, `RESET`) com `useReducer` e cancela requisições antigas com `AbortController`.

### Onde o React Router é usado

- **`src/App.jsx`** — definição das rotas com layout compartilhado (`<Outlet />`).
- **`src/components/Layout.jsx`** — navegação com `NavLink` (destaca a rota ativa).
- **`src/pages/PokedexPage.jsx`** — `useSearchParams` guarda busca, filtro e página na URL (`/?q=char&tipo=fire&pagina=2`), então o estado sobrevive ao botão "voltar".
- **`src/pages/PokemonDetailPage.jsx`** — rota dinâmica `/pokemon/:name` com `useParams` e `useNavigate`.

## Funcionalidades

- **Pokédex** (`/`): lista com mais de 1.300 Pokémon, busca por nome ou número, filtro por tipo e paginação.
- **Detalhes** (`/pokemon/:name`): imagem, tipos, descrição, altura, peso, habilidades, atributos base e navegação para o anterior/próximo.
- **Meu Time** (`/time`): adicionar/remover Pokémon, apelidos, reordenar, limpar o time, contagem de tipos e média dos atributos. O time fica salvo no navegador.

## Como executar

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Acesse o endereço exibido no terminal (por padrão `http://localhost:5173`).

## Estrutura

```
src/
├── App.jsx                     # rotas
├── main.jsx                    # ponto de entrada
├── index.css                   # ajustes sobre o Bootstrap
├── components/                 # Layout, PokemonCard, Pagination, StatBar, TypeBadge, StatusMessage
├── hooks/useFetch.js           # requisições AJAX com useReducer
├── pages/                      # PokedexPage, PokemonDetailPage, TeamPage, NotFoundPage
├── services/pokeapi.js         # acesso à PokéAPI + cache
├── state/                      # teamReducer + TeamContext
└── utils/labels.js             # traduções e formatação
```

## Divisão da equipe

| Integrante | Responsabilidade | Arquivos principais |
| --- | --- | --- |
| **Jedson Marengoni** | Frontend: interface com React-Bootstrap, rotas com React Router, páginas, componentes, layout responsivo e estilos | `App.jsx`, `main.jsx`, `index.css`, `components/*`, `pages/*` |
| **Giovanni Beker** | API e dados: integração com a PokéAPI via AJAX, cache, tratamento de erros, hook `useFetch`, reducer do time, Context e persistência no `localStorage` | `services/pokeapi.js`, `hooks/useFetch.js`, `state/teamReducer.js`, `state/TeamContext.jsx`, `utils/labels.js` |

## Uso de ferramentas de apoio

| Ferramenta | Uso |
| --- | --- |
| Claude Code (IA, Anthropic) | Geração da estrutura inicial do projeto e de uma primeira versão dos componentes, do reducer e da camada de acesso à API. O código foi revisado, testado e adaptado pela equipe. |
| Vite | Ferramenta de build e servidor de desenvolvimento. |
| Bootstrap / React-Bootstrap | Componentes visuais e layout responsivo. |
| PokéAPI | Fonte dos dados. |

