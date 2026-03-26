# Design Tokens & NL Design System

Handleiding voor thema's en candidate components in dit project. Hoe wissel je van thema? Hoe voeg je een nieuw thema toe? Hoe gebruik je een candidate component?

---

## Snel

| Actie | Wat te doen |
|-------|-------------|
| **Thema wisselen** | `config.json` → `"base": { "theme": "purmerend" }` of `"utrecht"` |
| **Nieuw thema toevoegen** | Zie [Nieuw thema](#nieuw-thema-toevoegen) |
| **Candidate component gebruiken** | Zie [Candidate component toevoegen](#candidate-component-toevoegen) |
| **Token-styling wijzigen** (bijv. NL Button) | Pas `nl-button-tokens.json` aan → `npm run build:tokens` |

---

## Hoe het werkt

```
Theme package (Purmerend, Utrecht, …)  →  levert --basis-* of --utrecht-* tokens
                    ↓
Component tokens (bijv. nl-button-tokens.json)  →  npm run build:tokens  →  *.generated.css
                    ↓
Candidate component (bijv. @nl-design-system-candidate/button-css)  →  gebruikt --nl-button-*
```

- **Thema**: bepaalt kleuren, typografie, spacing via design tokens
- **Component tokens**: mappen component-variabelen (`--nl-button-*`) naar theme-tokens (`--basis-*`, `--utrecht-*`)
- **Candidate component**: gebruikt de gegenereerde variabelen; krijgt per thema automatisch de juiste styling

---

## Thema's

### Basis vs Utrecht

| Type | Voorbeelden | Token-systeem |
|------|-------------|---------------|
| **Basis** | Purmerend | `--basis-*` direct beschikbaar |
| **Utrecht** | Utrecht | `--utrecht-button-*` etc. – bridge nodig naar `--basis-*` |
| **Custom** | Geen package | Eigen tokens-bestand met huisstijlkleuren |

---

## Nieuw thema toevoegen

### 1. Package installeren (of custom tokens maken)

```bash
npm install @nl-design-system-community/[theme]-design-tokens
```

Controleer op npm of het theme package nog actief is. Sommige packages (zoals `@nl-design-system-unstable/amsterdam-design-tokens`) zijn deprecated.

Geen package of deprecated? Maak `public/assets/custom-[organisatie]-tokens.css` met de `--basis-*` en `--utrecht-*` variabelen die je component-tokens nodig hebben.

### 2. Theme config (`src/lib/theme.ts`)

```ts
export type ThemeId = 'purmerend' | 'utrecht' | 'amsterdam'  // + nieuw

amsterdam: {
  themeClass: 'amsterdam-theme',
  mediaQueryClass: 'amsterdam-theme--media-query',
  darkModeClass: 'amsterdam-theme--color-scheme-dark',
},
```

Controleer class names in `dist/theme.css` van het theme package.

### 3. Theme CSS (`src/app/theme-[naam].css`)

| Situatie | Imports |
|----------|---------|
| **Basis-tokens** (Purmerend, Amsterdam) | Alleen gegenereerde component-tokens (bijv. `nl-button-tokens.generated.css`) |
| **Geen basis** (Utrecht-achtig) | `[theme]-basis-bridge.css` (eerst) + gegenereerde component-tokens |
| **Custom** (geen package) | `custom-[organisatie]-tokens.css` + gegenereerde component-tokens |

### 4. Layout (`src/app/[locale]/layout.tsx`)

Import theme package CSS + `theme-[naam].css`. Zie bestaande imports voor Purmerend/Utrecht.

### 5. Config

`src/types/config.ts` → theme type uitbreiden.  
`config.json` → `"base": { "theme": "amsterdam" }`

---

## Candidate component toevoegen

### 1. Package installeren

```bash
npm install @nl-design-system-candidate/[component]-css @nl-design-system-candidate/[component]-react
```

### 2. Component tokens aanmaken

Maak `design-tokens/[component]-tokens.json` (zie `nl-button-tokens.json` als voorbeeld). De tokens mappen `--[component]-*` variabelen naar theme-tokens (`--basis-*`, `--utrecht-*`).

### 3. Style Dictionary config uitbreiden

In `style-dictionary.config.mjs`: voeg de nieuwe bron toe aan `source` en een nieuw platform/file aan `platforms` voor de gegenereerde CSS.

### 4. Build & import

```bash
npm run build:tokens
```

Import de gegenereerde CSS in het juiste theme-bestand (`theme-purmerend.css`, `theme-utrecht.css`, etc.) en de component-CSS in `src/app/layout.tsx` of een parent layout.

### 5. Component exporteren

Exporteer de React-component in `src/components/index.ts` (of waar je components centraal exporteert).

---

## Voorbeeld: NL Button

Dit project gebruikt de NL Button als candidate component:

- **Tokens**: `design-tokens/nl-button-tokens.json` → `public/assets/nl-button-tokens.generated.css`
- **Bridge** (alleen Utrecht): `public/assets/utrecht-basis-bridge.css` mapt `--basis-*` naar `--utrecht-button-*`
- **Imports**: `theme-purmerend.css` en `theme-utrecht.css` importeren de gegenereerde tokens; `layout.tsx` importeert `@nl-design-system-candidate/button-css/button.css`

---

## Build

```bash
npm run build:tokens
```

Genereert alle `*.generated.css` bestanden uit de JSON-bronnen in `design-tokens/`. Bij JSON-wijzigingen altijd opnieuw builden.

---

## Bestanden

| Bestand | Rol |
|---------|-----|
| `design-tokens/*.json` | Bron – component token-definities |
| `design-tokens/style-dictionary.config.mjs` | Build-config |
| `public/assets/*.generated.css` | Gegenereerd – niet handmatig bewerken |
| `public/assets/*-basis-bridge.css` | Theme-specifieke token-mapping (bijv. Utrecht) |
| `src/app/theme-*.css` | Theme-specifieke imports |
| `src/lib/theme.ts` | Theme-configuratie (classes, dark mode) |
