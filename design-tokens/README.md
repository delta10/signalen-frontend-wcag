# Signalen theming met basis + organisatie-updates

Deze map bevat alles om een organisatie-thema op te bouwen. Kort samengevat:

- `design-tokens/base.json` bevat de complete token-set die we als startpunt gebruiken.
- `design-tokens/overrides.json` bevat gedeelde correcties die voor alle organisaties gelden.
- `design-tokens/organizations/<organisatie>.json` bevat alleen de organisatie-specifieke verschillen.
- Een organisatiebestand kan via `source` een Theme Wizard-export uit een npm-package of lokaal JSON-bestand importeren.
- De build merget deze lagen en genereert CSS-bestanden in `public/assets/organizations/<organisatie>/`.

De theming wordt bepaald in deze volgorde:

1. basis (`base.json`)
2. gedeelde overrides (`overrides.json`)
3. organisatie light (`organizations/<organisatie>.json` -> `light`)
4. organisatie dark (`organizations/<organisatie>.json` -> `dark`, alleen afwijkingen op light)

De onderste laag levert defaults; elke volgende laag mag waarden overschrijven.

## Bestandsrollen

- `base.json`: volledige basisset van tokens waar alle thema's op starten.
- `overrides.json`: gedeelde overrides voor alle organisaties, bijvoorbeeld fixes of projectbrede keuzes bovenop de basisset.
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

Een organisatie kan daarnaast een volledige Theme Wizard-export importeren. De
handmatige `light`- en `dark`-waarden blijven dan de laatste override-laag:

```json
{
  "source": "@nl-design-system-unstable/groningen-design-tokens/figma/groningen.tokens.json",
  "light": {
    "basis.color.action-1.color-default": "#055fa5"
  },
  "dark": {}
}
```

De import gebruikt de volgorde uit `$metadata.tokenSetOrder`, zet de aparte
`color-scheme-dark/*`-sets om naar dark-mode-overrides en negeert tokens die niet
in `base.json` bestaan. Zo blijft het organisatiebestand beperkt tot bewuste
afwijkingen, terwijl de volledige export uit een versieerbare dependency komt.

## Buildgedrag

Bij `npm run tokens:build:org -- <organisatie>` gebeurt het volgende:

1. `base.json` wordt ingeladen.
2. `design-tokens/overrides.json` wordt ingeladen.
3. `design-tokens/organizations/<organisatie>.json` wordt ingeladen.
4. Een eventuele Theme Wizard-bron uit `source` wordt ingeladen.
5. Gedeelde `light` updates, de bronimport en handmatige organisatie-updates worden in die volgorde toegepast.
6. Dezelfde lagen voor `dark` worden toegepast bovenop de light tokens (fallback naar light waar dark niet bestaat).
7. Beide varianten worden gebruikt als input voor Style Dictionary.
8. Output wordt gegenereerd in `public/assets/organizations/<organisatie>/`.

Als een updatepad niet bestaat in `base.json`, stopt de build met een duidelijke fout (zowel voor `light` als `dark`).

Belangrijk: je definieert in een organisatiebestand dus niet opnieuw "alle tokens", maar alleen de waarden die afwijken van de lagen daaronder.

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

## Concreet voorbeeld: thema maken voor Purmerend

1. Maak bestand `design-tokens/organizations/purmerend.json`.
   - Je kunt `design-tokens/organizations/default.json` kopiëren als startpunt of gebruiken als referentie.
2. Start met alleen `light` en zet daar de Purmerend-kleuren/typografie in die afwijken van `base.json`.
3. Laat tokens die gelijk blijven weg; die komen automatisch uit `base.json` en `overrides.json`.
4. Voeg pas `dark` toe als je dark mode-afwijkingen nodig hebt.
5. Run `npm run tokens:build:org -- purmerend`.
6. Controleer dat output bestaat in `public/assets/organizations/purmerend/` (`theme.css`, `variables.css`).
7. Zet in `config.json` de actieve theme op `"purmerend"` via `base.theme`.
8. Start `npm run dev` en controleer in de app of kleuren/typografie kloppen.

Starttemplate voor `design-tokens/organizations/purmerend.json`:

```json
{
  "light": {
    "basis.color.action-1.color-default": "#1b59a4",
    "basis.color.accent-1.color-default": "#224271"
  },
  "dark": {
    "basis.color.default.bg-document": "#1d1d1d",
    "basis.color.default.color-document": "#f5f5f5"
  }
}
```

Tip: begin klein met een paar duidelijke merk-kleuren. Als dat werkt, breid je stap voor stap uit.

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
- **Verkeerde styling geladen:** check dat `config.json` -> `base.theme` exact matcht met bestands/mapnaam (bijv. `purmerend`) of laat `base.theme` weg zodat `base.municipality` als fallback geldt.
- **Padfout in updates:** controleer dat elke key in `light`/`dark` exact bestaat in `base.json`.
