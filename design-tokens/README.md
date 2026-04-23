# Signalen theming met base + organisatie light/dark updates

Deze setup gebruikt:

- `public/assets/organizations/<organisatie>/theme.css` als organisatie-specifieke themalaag
- `design-tokens/base.json` als volledige basis-tokenboom en bron van waarheid
- `design-tokens/overrides.json` als gedeelde token-overrides voor alle organisaties
- `design-tokens/organizations/<organisatie>.json` met `light` en optioneel `dark` updates
- Style Dictionary om de gemergde tokens om te zetten naar CSS in `public/assets/organizations/<organisatie>/`

## Bestandsrollen

- `base.json`: volledige tokens (bron van waarheid)
- `overrides.json`: gedeelde token-overrides voor alle organisaties, bijvoorbeeld layout- of componentcorrecties bovenop NLDS
- `<organisatie>.json`: organisatie-specifieke overrides in dit formaat:

```json
{
  "light": {
    "basis.color.action-1.color-default": "#1b59a4",
    "basis.heading.font-family": "{basis.text.font-family.default}"
  },
  "dark": {
    "basis.color.default.bg-document": "#121212",
    "basis.color.default.color-document": "#f5f5f5"
  }
}
```

## Buildgedrag

Bij `npm run tokens:build:org -- <organisatie>` gebeurt het volgende:

1. `base.json` wordt ingeladen.
2. `design-tokens/overrides.json` wordt ingeladen.
3. `design-tokens/organizations/<organisatie>.json` wordt ingeladen.
4. Gedeelde `light` updates worden toegepast op de base tokens.
5. Organisatie `light` updates worden daar bovenop toegepast.
6. Gedeelde en organisatie `dark` updates worden toegepast bovenop de light tokens (fallback naar light waar dark niet bestaat).
7. Beide varianten worden gebruikt als input voor Style Dictionary.
8. Output wordt gegenereerd in `public/assets/organizations/<organisatie>/`.

Als een updatepad niet bestaat in `base.json`, stopt de build met een duidelijke fout (zowel voor `light` als `dark`).

## Light, dark en inverse tokens

Gebruik `light` als volledige organisatielaag bovenop `base.json`. Leg hier de huisstijl vast, inclusief relaties tussen basis-tokens en eventuele componenttokens die naar basis-tokens verwijzen.

Gebruik `overrides.json` voor tokenwijzigingen die voor iedere organisatie moeten gelden, zoals layout- of componentoverrides die NLDS defaults corrigeren. Als dezelfde token ook in een organisatiebestand staat, wint de organisatie-specifieke waarde.

Gebruik `src/app/app.css` voor gewone CSS-regels die geen token override zijn.

`dark` is geen tweede volledig thema, maar een minimale set overrides bovenop `light`. Zet hier alleen tokenwaarden die in dark mode echt anders moeten zijn. Alles wat ontbreekt in `dark` valt automatisch terug op de waarde uit `light`.

`*-inverse` tokens zijn niet specifiek voor dark mode. Ze beschrijven de contrastrijke variant binnen dezelfde mode, bijvoorbeeld een primary button of page footer met een gekleurde achtergrond en lichte tekst. Definieer de relatie bij voorkeur in `light`:

```json
{
  "light": {
    "basis.color.accent-1.color-default": "#224271",
    "basis.color.accent-1-inverse.bg-default": "{basis.color.accent-1.color-default}",
    "basis.color.accent-1-inverse.color-default": "#ffffff",
    "basis.color.action-1-inverse.bg-default": "{basis.color.accent-1-inverse.bg-default}",
    "basis.color.action-1-inverse.color-default": "{basis.color.accent-1-inverse.color-default}",
    "utrecht.page-footer.background-color": "{basis.color.accent-1-inverse.bg-default}",
    "utrecht.page-footer.color": "{basis.color.accent-1-inverse.color-default}"
  },
  "dark": {
    "basis.color.accent-1-inverse.bg-default": "#11213d",
    "basis.color.accent-1-inverse.color-default": "#f5f5f5",
    "basis.color.default.bg-document": "#1d1d1d",
    "basis.color.default.color-document": "#f5f5f5"
  }
}
```

Zo blijven buttons en footer in beide modes via dezelfde basis-tokenrelaties werken, terwijl dark mode alleen de onderliggende basiswaarden wijzigt.

## Stap voor stap: van Theme Wizard naar werkend thema

1. Open de Theme Wizard en exporteer basis tokens als JSON  
   [Theme Wizard - basis tokens](https://theme-wizard.nl-design-system-community.nl/basis-tokens)
2. Sla dit bestand op als `design-tokens/base.json`.
3. Zet gedeelde token-overrides in `design-tokens/overrides.json`.
4. Maak of update `design-tokens/organizations/<organisatie>.json` met `light` en (optioneel) `dark`.
5. Genereer assets:
   - `npm run tokens:build:org -- <organisatie>`
6. Zet de runtime config op dezelfde organisatie-naam in `config.json`:
   - `base.theme = "<organisatie>"` (of laat weg om `base.municipality` te gebruiken als fallback)

## Commands

- Build voor een specifieke organisatie:  
  `npm run tokens:build:org -- <organisatie>`
- Watch organisatie-updates en build automatisch bij save:  
  `npm run tokens:watch:org`
  - `design-tokens/organizations/<organisatie>.json` triggert build voor die organisatie.
  - `design-tokens/base.json` en `design-tokens/overrides.json` triggeren een build voor alle organisaties.
  - Let op: deze watcher moet actief draaien in een terminal.
- `npm run dev` start nu zowel Next.js als deze token watcher.

## Output bestanden

Na build vind je o.a.:

- `public/assets/organizations/<organisatie>/theme.css`
- `public/assets/organizations/<organisatie>/variables.css`

`theme.css` bevat:
- light variabelen onder `.organization-theme`
- dark variabelen onder `@media (prefers-color-scheme: dark)` voor `.organization-theme.organization-theme--media-query`

## Veelvoorkomende valkuilen

- **Geen effect na token wijziging:** als `npm run dev` draait, worden wijzigingen in `design-tokens/organizations/<organisatie>.json`, `design-tokens/base.json` en `design-tokens/overrides.json` automatisch gebouwd; draait de watcher niet, run dan handmatig `npm run tokens:build:org -- <organisatie>`.
- **Verkeerde styling geladen:** check dat `config.json` -> `base.theme` exact matcht met mapnaam (of laat `base.theme` weg zodat `base.municipality` als fallback geldt).
- **Padfout in updates:** controleer dat elke key in `light`/`dark` exact bestaat in `base.json`.
