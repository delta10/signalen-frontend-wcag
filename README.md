# Signalen web form

We ([Delta10](https://www.delta10.nl) and [Frameless](https://www.frameless.io)) created a new web form for [Signalen](https://www.signalen.org), an open source application for municipalities for reports about the public space.

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

Now customize the configuration file config.json to your specific needs.

Generate the organisation-specific CSS:

```sh
npm run tokens:build:org
```

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
