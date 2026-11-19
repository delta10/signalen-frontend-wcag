# Signalen theming met basis + organisatie-updates

Deze map bevat alles om een organisatie-thema op te bouwen. Kort samengevat:

- `design-tokens/base.json` bevat de neutrale standaard voor light mode, met vette vraagtitels en 8px ruimte tussen de keuzeopties.
- `design-tokens/overrides.json` bevat gedeelde overrides, waaronder de standaard voor dark mode.
- `design-tokens/organizations/<organisatie>.json` is optioneel en bevat alleen afwijkingen voor de huisstijl.
- De build merget deze lagen en genereert CSS-bestanden in `public/assets/organizations/<organisatie>/`.

Light mode gebruikt `base.json`, gedeelde `light` overrides en vervolgens
organisatie `light` overrides. Dark mode neemt die uitkomst als basis en past
daarna de gedeelde en organisatie `dark` overrides toe.

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

## Utrecht: zelfstandig organisatiebestand

`organizations/utrecht.json` gebruikt hetzelfde `light`/`dark`-formaat als de
andere organisaties. Kleuren en typografie zijn gebaseerd op de eerder bekeken
Utrecht-tokenversie 7.0.0; de applicatie gebruikt de bestaande basisset en
`overrides.json` voor componenten en layout. Het is een lokaal onderhouden thema,
geen volledige kopie van het Utrecht-package. Nieuwe Utrecht-versies worden niet
automatisch overgenomen.

De componenttokens verwijzen waar mogelijk naar `basis.*`, zodat light en dark
dezelfde relaties delen. De donkere informatievlakken zijn afgestemd op leesbare
tekst en links. Zolang Utrecht in beide modi dezelfde lichte kaart gebruikt,
houdt `utrecht.map-marker.background-color` de kaartpin in beide modi zwart.

Build en activeer het thema:

1. Run `npm run tokens:build:org -- utrecht`.
2. Zet `base.theme` in `config.json` op `"utrecht"`.
3. Laad Noto Sans via de bestaande instelling `base.fonts.googleStylesheetUrl`,
   zoals in de meegeleverde configuratie. Zonder die stylesheet wordt Arial
   gebruikt als fallback.
4. Controleer light en dark mode op desktop en mobiel.

De meegeleverde `config.json` gebruikt Meierijstad-demodata voor een lokale
Utrecht-preview. Zie `config.md` voor de omgevingsinstellingen.

## Buildgedrag

`npm run tokens:build:org` bouwt `default` en, als er een themabestand is,
het geconfigureerde thema (`base.theme`, of `base.municipality` als `theme`
ontbreekt). De frontend laadt `default` als het gekozen themabestand of de
gegenereerde CSS ontbreekt. Het standaardthema komt uit de gedeelde tokens.

`npm run tokens:build:org -- <organisatie>` bouwt uitsluitend het opgegeven
thema. Gebruik `-- default` om alleen de standaardstijl te bouwen.

Als een updatepad niet bestaat in `base.json`, stopt de build met een duidelijke fout (zowel voor `light` als `dark`).

Belangrijk: je definieert in een organisatiebestand dus niet opnieuw "alle tokens", maar alleen de waarden die afwijken van de lagen daaronder.

## Light, dark en inverse tokens

Gebruik `light` als volledige organisatielaag bovenop `base.json`. Leg hier de huisstijl vast, inclusief relaties tussen basis-tokens en eventuele componenttokens die naar basis-tokens verwijzen.

Gebruik `overrides.json` voor tokenwijzigingen die voor iedere organisatie moeten gelden, zoals layout- of componentoverrides die NLDS defaults corrigeren. Als dezelfde token ook in een organisatiebestand staat, wint de organisatie-specifieke waarde.

Gebruik `src/app/app.css` voor gewone CSS-regels die geen token override zijn.

`dark` is geen tweede volledig thema, maar een minimale set overrides bovenop `light`. Zet hier alleen tokenwaarden die in dark mode echt anders moeten zijn. Een ontbrekende organisatie-override valt terug op de gedeelde dark override of, als die ontbreekt, op de waarde uit `light`.

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
2. Start met alleen `light` en zet daar de Purmerend-kleuren/typografie in die afwijken van `base.json`.
3. Laat tokens die gelijk blijven weg; die komen automatisch uit `base.json` en `overrides.json`.
4. Voeg `dark` toe om ook in dark mode van de gedeelde standaard af te wijken.
5. Zet `base.theme` in `config.json` op `"purmerend"`.
6. Run `npm run tokens:build:org` en controleer de output onder `public/assets/organizations/`.
7. Start `npm run dev` en controleer in de app of kleuren en typografie kloppen.

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
  - Bij het starten en bij wijzigingen aan `base.json` of `overrides.json` worden de standaard en alle organisatiethema’s gebouwd.
  - Een wijziging aan een organisatiebestand bouwt alleen dat thema.
- Start `npm run dev` in een aparte terminal.

## Output bestanden

Na build vind je o.a.:

- `public/assets/organizations/<organisatie>/theme.css`
- `public/assets/organizations/<organisatie>/variables.css`

`theme.css` bevat:
- light variabelen onder `.organization-theme`
- dark variabelen onder `@media (prefers-color-scheme: dark)` voor `.organization-theme.organization-theme--media-query`

## Veelvoorkomende valkuilen

- **Geen effect na token wijziging:** als de watcher draait, worden wijzigingen in `design-tokens/organizations/<organisatie>.json`, `design-tokens/base.json` en `design-tokens/overrides.json` automatisch gebouwd; draait de watcher niet, run dan handmatig `npm run tokens:build:org -- <organisatie>`.
- **Verkeerde styling geladen:** check dat `config.json` -> `base.theme` exact matcht met bestands/mapnaam (bijv. `purmerend`) of laat `base.theme` weg zodat `base.municipality` als fallback geldt.
- **Padfout in updates:** controleer dat elke key in `light`/`dark` exact bestaat in `base.json`.
