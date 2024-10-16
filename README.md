We're developing a new frontend for the notification form section of https://signalen.org. Our goals are to achieve an 'A' accessibility status, provide multi-language support, and make the frontend easily customizable (colors, texts, etc.) by mounting a single config.json file with chosen municipality variables into the production container.
## Getting started as a developer
First, run the npm install command.
```bash
npm install
```

Set the environment variables in a ```.env``` or ```.env.local``` file.
```bash
NEXT_PUBLIC_BASE_URL_API=http://127.0.0.1:8000
NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key_here
NEXT_PUBLIC_MAPTILER_MAP=your_maptiler_map_url_here
```

Run the next development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Techniques
We’ve decided to use [Next.js](https://nextjs.org) with the App Router for this application. Alongside that, we’re utilizing [Radix UI](https://www.radix-ui.com/) for components and [React Hook Form](https://react-hook-form.com/) for form logic, validation, and more. For object validation, we’re using [Zod](https://zod.dev/), and for global state management, we rely on [zustand](https://zustand-demo.pmnd.rs/). Additionally, we’re incorporating [next-intl](https://next-intl-docs.vercel.app/) for internationalization (i18n), enabling multi-language support in the frontend.
