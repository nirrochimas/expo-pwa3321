# CRUD de Usuários — Expo, PWA e Firebase

Aplicativo web responsivo para cadastrar e gerenciar usuários com **nome e e-mail**. Desenvolvido com Expo e React Native Web, usa Cloud Firestore como banco de dados e está preparado para publicação na Vercel como Progressive Web App (PWA).

## Funcionalidades do aplicativo

### Cadastro
- Formulário com os campos **Nome** e **E-mail**.
- Validação para exigir um nome e um endereço de e-mail válido.
- Normalização do e-mail para minúsculas antes de salvar.
- Feedback de sucesso ou erro ao salvar.
- Bloqueio do botão de cadastro enquanto a operação está em andamento.

### Listagem
- Exibição dos usuários armazenados na coleção `usuarios` do Cloud Firestore.
- Atualização em tempo real por meio de uma assinatura do Firestore.
- Ordenação dos registros pelo nome.
- Estado vazio quando ainda não há cadastros.
- Mensagens para problemas de configuração ou permissão do banco.

### Edição e exclusão
- Ação **Editar** preenche o formulário com os dados existentes.
- A edição salva as mudanças no documento correspondente.
- A ação **Excluir** pede confirmação antes de remover um registro.
- O aplicativo apresenta mensagens de sucesso e erro para as operações.

## Tecnologias

- **Expo** — estrutura de desenvolvimento do aplicativo.
- **React** e **React Native Web** — interface que funciona no navegador.
- **TypeScript** — tipagem do código.
- **Firebase JavaScript SDK** — integração com o Firebase.
- **Cloud Firestore** — armazenamento dos registros.
- **Workbox** — geração do service worker para o PWA.
- **Vercel** — build e hospedagem web.

## Como os dados são armazenados

O aplicativo usa a coleção `usuarios`. Cada documento contém campos equivalentes a:

```json
{
  "nome": "Maria Silva",
  "email": "maria@example.com",
  "createdAt": "timestamp do Firestore",
  "updatedAt": "timestamp do Firestore (adicionado ao editar)"
}
```

O Firestore gera o identificador do documento. O campo `createdAt` é definido na criação; `updatedAt` é definido quando o cadastro é editado. Os timestamps são valores nativos do Firestore, e não strings literais.

## Configuração do Firebase

1. Abra o [Firebase Console](https://console.firebase.google.com/), crie ou selecione um projeto e habilite o **Cloud Firestore**.
2. Registre um aplicativo Web no projeto Firebase e obtenha os valores da configuração do SDK.
3. No projeto da Vercel, abra **Settings → Environment Variables** e configure as seguintes variáveis para os ambientes desejados (Preview e Production):

   - `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `EXPO_PUBLIC_FIREBASE_APP_ID`

4. Faça um novo deploy depois de salvar as variáveis, pois os valores `EXPO_PUBLIC_*` são incorporados ao bundle durante o build.

O arquivo `.env.example` lista os nomes esperados. Não coloque chaves privadas, credenciais administrativas ou arquivos de service account nas variáveis públicas. A configuração Firebase de cliente não substitui regras de segurança.

### Segurança do Firestore

Este exemplo não inclui autenticação de usuários. Antes de disponibilizar o app publicamente, configure regras de segurança apropriadas. **Não use regras que permitam leitura e escrita irrestritas para qualquer pessoa.** Para dados reais, recomenda-se integrar Firebase Authentication e autorizar somente usuários autenticados com as permissões necessárias. Enquanto as regras do Firestore negarem acesso, a interface mostrará uma mensagem de erro.

## PWA

- Manifesto: `public/manifest.json`.
- Ícone: `public/icons/icon.svg`.
- O build gera o service worker em `dist/sw.js) com Workbox e pré-armazena arquivos estáticos do app.
- O service worker é registrado no navegador em produção.
- O cadastro, a listagem, a edição e a exclusão no Firestore precisam de conexão com a internet. O service worker não armazena em cache as respostas do Firestore.

## Publicação na Vercel

O repositório contém um `vercel.json` com o comando de build e a pasta de saída configurados.

1. Acesse [Vercel — New Project](https://vercel.com/new) e conecte a conta GitHub que tem acesso ao repositório.
2. Importe `nirrochimas/expo-pwa3321`.
3. Use `npm run build) como **Build Command** e `dist` como **Output Directory**. O `vercel.json` já define essas opções.
4. Selecione uma versão de Node.js compatível com o campo `engines` do `package.json` e com o Expo configurado no projeto.
5. Configure as variáveis do Firebase descritas acima e execute o deploy.

Durante o build, `scripts/print-env.cjs` registra nos logs as versões de Node, npm, npx e Git usando os comandos:

```sh
node --version
npm --version
npx --version
git --version
```

## Scripts

- `npm run build` — registra as versões das ferramentas, exporta o app para web e gera o service worker.
- `npm run build:web` — alias para o build web.
- `npm run typecheck` — executa a verificação de tipos do TypeScript.

## Estrutura principal

```text
.
├── App.tsx                 # Interface de cadastro, listagem, edição e exclusão
├── app.json                # Configuração Expo
├── package.json            # Dependências e scripts
├── vercel.json             # Configuração de build/publicação
├── workbox-config.cjs      # Configuração do service worker
├── scripts/
│   └── print-env.cjs        # Versões de Node, npm, npx e Git nos logs
├── public/
│   ├── manifest.json       # Metadados do PWA
│   └── icons/icon.svg      # Ícone do aplicativo
└── src/
    ├── firebase.ts         # Inicialização do Firebase
    └── users.ts            # Operações CRUD do Firestore
```

## Estado da validação

A configuração e o código estão versionados no GitHub. O build precisa ser confirmado nos logs da Vercel depois da importação do projeto, e as operações com dados reais precisam ser verificadas após configurar o Firebase e as regras de segurança.
