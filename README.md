# Expo + React Native Web + PWA + Firebase

CRUD de nome e e-mail, preparado para build web e deploy contínuo pela Vercel. O build e as dependências são instalados na infraestrutura da Vercel; não exige testes locais.

## Stack

- Expo SDK 58, React 19.2.3, React Native 0.86 e React Native Web 0.21.
- TypeScript, Firebase JavaScript SDK e Cloud Firestore.
- PWA: manifesto e service worker gerado pelo Workbox.
- Vercel para hospedagem HTTPS e builds automáticos.

## Deploy na Vercel

1. Acesse https://vercel.com/new, conecte o GitHub e importe `nirrochimas/expo-pwa3321`.
2. Use `npm run build` como Build Command e `dist` como Output Directory; o `vercel.json` já define isso.
3. Em Settings → Build and Deployment → Node.js Version, selecione Node 22.x (22.13 ou superior) ou Node 24.x (24.3 ou superior), conforme suporte atual da Vercel.
4. Faça o deploy e confira os logs. `scripts/print-env.cjs` registra as versões de Node, npm, npx e git.

## Configurar Firebase

1. No Firebase Console, crie/selecione um projeto e habilite Cloud Firestore.
2. Registre um app Web e copie a configuração do Firebase.
3. Na Vercel, Settings → Environment Variables, adicione para Preview e Production: `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`, `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` e `EXPO_PUBLIC_FIREBASE_APP_ID`.
4. Faça um novo deploy após salvar as variáveis.
5. Configure Firestore Security Rules antes de usar dados reais. Este exemplo não inclui autenticação; não publique regras abertas para todos. Para uso real, adicione Firebase Authentication e restrinja o acesso a usuários autorizados.

Variáveis `EXPO_PUBLIC_` são incorporadas ao bundle do navegador: não coloque segredos privados, credenciais administrativas ou service-account keys nelas. A Firebase API key de cliente não é um segredo, mas as regras do Firestore precisam proteger os dados.

## PWA

- Manifesto: `public/manifest.json`; ícone SVG em `public/icons/icon.svg`.
- O service worker é gerado em `dist/sw.js` durante o build e precacheia os assets estáticos.
- O CRUD do Firestore precisa de internet; as respostas do Firestore não são armazenadas em cache pelo service worker.

## Validação

As alterações foram gravadas no GitHub. O build ainda precisa ser executado após importar o repositório na Vercel; este processo não executou o build remoto nem acessou o Firebase Console.
