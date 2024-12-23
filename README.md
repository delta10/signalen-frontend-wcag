# Signalen web form

We ([Delta10](https://www.delta10.nl) and [Frameless](https://www.frameless.io)) are developing a new web form for [Signalen](https://www.signalen.org), an open source application for municipalities for reports about the public space.

Our goals are to:

- be fully compliant with WCAG 2.1 conformance level AA for [compliance with Dutch law](https://www.digitoegankelijk.nl/wetgeving/wat-is-verplicht) (<span lang="nl">"[Toegankelijkheidsstatus A](https://www.digitoegankelijk.nl/toegankelijkheidsverklaring/status)"</span>);
- support [NL Design System](https://nldesignsystem.nl);
- and have multi-language support.

The frontend can easily be customized by configuring a single JSON file.

## Getting started as a developer

First, install the dependencies:

```sh
npm install
```

Set the environment variables in a `.env` file:

```sh
NEXT_PUBLIC_BASE_URL_API=http://127.0.0.1:8000
NEXT_PUBLIC_MAPTILER_API_KEY=
NEXT_PUBLIC_MAPTILER_MAP=https://api.maptiler.com/maps/nl-cartiqo-topo
NEXT_PUBLIC_PDOK_URL_API=https://api.pdok.nl/bzk/locatieserver/
NEXT_PUBLIC_MAPTILER_MAP_DARK_MODE=https://api.maptiler.com/maps/streets-v2-dark
```

Customize the `.env` configuration file for yourself:

- `NEXT_PUBLIC_MAPTILER_API_KEY`: visit the MapTiler website and create a free account. Login to go to the [API Keys page for MapTiler Cloud](https://cloud.maptiler.com/account/keys/). Create a new key for your development computer. Allow `localhost` as origin. Copy the key and assign it to `NEXT_PUBLIC_MAPTILER_API_KEY` in `.env`.
- `NEXT_PUBLIC_MAPTILER_MAP`: go the to [Maps page for MapTiler Cloud](https://cloud.maptiler.com/maps/) and either pick an existing map or create a new map. Copy the first part of the "Use vector style" URL, everything before `/style.json?key=`. Assign that first part of the URL to `NEXT_PUBLIC_MAPTILER_MAP`.
- Users can specify a different map theme for dark mode, which is triggered when the browser's preferred style theme is set to dark. To implement this, set the `NEXT_PUBLIC_MAPTILER_MAP_DARK_MODE` environment variable to the desired dark mode theme.

Then start the Next.js development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the web form.

## End-to-end tests

To run the end-to-end tests you need to have the "headless browsers" installed. Headless browsers are invisible browsers that run from the command line.

```shell
npm run install-test-browsers
```

The end-to-end tests work best when you build the project and start the production server on localhost:3000 with:

```shell
npm run build
npm run start
```

While leaving the server on localhost:3000 running, you can run the end to end tests in a separate terminal with:

```shell
npm run test-e2e
```

To view the results run the following command and open the [test results page on localhost:9323](http://localhost:9323):

```shell
npx playwright show-report tmp/playwright-html-report
```

### Multilanguage support
To set up and try out multilanguage support add the following lines to the `config.json`:
```
"supportedLanguages": [
  ...,
  {
    "label": "Switch to English",
    "lang": "en",
    "name": "English"
  }
 ]
```

## Techniques

- [Next.js](https://nextjs.org) with the App Router for the web application.
- [NL Design System](https://www.nldesignsystem.nl/) for components.
- [React Hook Form](https://react-hook-form.com/) for form logic, validation, and more.
- [Zod](https://zod.dev/) for object validation.
- [zustand](https://zustand-demo.pmnd.rs/) for global state management.
- [next-intl](https://next-intl-docs.vercel.app/) for internationalization (i18n), enabling multi-language support in the frontend.
