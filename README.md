# SMALL

Small, created by Notimation, combines all our marketing tools into one easy-to-use app. It simplifies campaign and service management, offering users a centralized platform for control and monitoring.

**Nota:** This project is currently in development and may be subject to frequent changes. If you encounter any issues or have suggestions, please feel free to open an issue or submit a pull request.

## Getting Started

To build the project locally, follow these steps:

1. Clone this repository to your local machine using Git

```bash
git clone https://github.com/notimation/small.git
```

2. Install project dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Tecnologies

This project uses the following technologies and dependencies

- [Next.js](https://nextjs.org/) - v14.1.0
- [Node.js](https://nodejs.org/) - v14.1.0
- [@auth0/auth0-react](https://www.npmjs.com/package/@auth0/auth0-react) - v2.2.4
- [@auth0/nextjs-auth0](https://www.npmjs.com/package/@auth0/nextjs-auth0) - v3.5.0
- [@reduxjs/toolkit](https://redux-toolkit.js.org/) - v2.2.1
- [@types/node](https://www.npmjs.com/package/@types/node) - v20.4.5
- [@types/react](https://www.npmjs.com/package/@types/react) - v18.2.17
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) - v18.2.7
- [axios](https://axios-http.com/) - v1.6.7
- [ESLint](https://eslint.org/) - v8.57.0
- [eslint-config-next](https://www.npmjs.com/package/eslint-config-next) - v14.1.0
- [React](https://reactjs.org/) - v18.2.0
- [react-dropzone](https://react-dropzone.js.org/) - v14.2.3
- [react-error-boundary](https://www.npmjs.com/package/react-error-boundary) - v4.0.13
- [react-loader-spinner](https://www.npmjs.com/package/react-loader-spinner) - v6.1.6
- [react-redux](https://react-redux.js.org/) - v9.1.0
- [react-toastify](https://www.npmjs.com/package/react-toastify) - v10.0.4
- [Sass](https://sass-lang.com/) - v1.71.1
- [TypeScript](https://www.typescriptlang.org/) - v5.1.6
- [husky](https://typicode.github.io/husky/) - v9.0.11
- [prettier](https://www.npmjs.com/package/prettier) - v3.2.5

## Internationalization (i18n) Configuration with Next.js

Internationalization (i18n) is a crucial process for adapting a web application to different languages and regions. In the context of a Next.js project, we can implement i18n using the next-intl library, which provides a set of utilities for efficiently managing translations and multilingual routes.

### 1. Defining Translations in JSON Files

In the `dictionaries` folder, add within the JSON files for each language, the desired keys and values and define the corresponding translations for different parts of the application (for example, `es.json`, `en.json`, ` pt.json`).

```bash
"dict": {
    "home": {
      "banner": {
        "welcome": "Te damos la bienvenida a Small",
        "title": "Aprendé con Playground",
      }
    },
    "playground": {
      "breadcrumb_title": "Simulador",
      "template_title": "Plantillas",
      "popup": {
        "title": "Compartir y probar en Whatsapp",
        "copy_success": "URL copiada al porpapapeles",
        "copy_error": "Error al copiar URL"
      },
    },
}
```

### 2. Using Translations in Components

Within the application components, import `useTranslations` from `next-intl` to access translations. Then, use the `useTranslations` function to obtain translations specific to the dictionary and display them in the components as needed.

```bash
import { useTranslations } from "next-intl";

const Component = () => {
  const dict = useTranslations("home.banner");

  return <div>{dict("welcome")}</div>;
}
```


By following these steps, we have configured international
