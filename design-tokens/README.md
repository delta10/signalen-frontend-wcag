# Signalen theming met basis + organisatie-updates

Deze map bevat alles om een organisatie-thema op te bouwen. Kort samengevat:

- `design-tokens/base.json` bevat de complete token-set die we als startpunt gebruiken.
- `design-tokens/overrides.json` bevat gedeelde correcties die voor alle organisaties gelden.
- `design-tokens/organizations/<organisatie>.json` bevat alleen de organisatie-specifieke verschillen.
- Via `source` kan een organisatie DTCG-tokenbestanden uit een versieerbaar npm-package importeren.
- De build merget deze lagen en genereert CSS-bestanden in `public/assets/organizations/<organisatie>/`.

De theming wordt bepaald in deze volgorde:

1. basis (`base.json`)
2. geïmporteerde organisatiebron (`source.light` of `source.dark`), met eventuele gedeelde tokenkoppelingen uit `source.adapter`
3. gedeelde applicatie-overrides (`overrides.json`)
4. organisatiecorrecties (`organizations/<organisatie>.json`)

De onderste laag levert defaults; elke volgende laag mag waarden overschrijven.
In dark mode worden de light-overrides opnieuw toegepast bovenop de dark-import,
gevolgd door de expliciete gedeelde en organisatie-specifieke dark-overrides.
Zo wist een volledige dark-export onze applicatie-aanpassingen niet.

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

## Utrecht: tokens importeren

Het Utrecht-thema gebruikt de volledige gepubliceerde tokenbestanden uit
[`@utrecht/design-tokens`](https://github.com/nl-design-system/utrecht/tree/main/proprietary/design-tokens).
De versie staat exact vast in `package.json` en `package-lock.json`.
Er worden geen eigen Utrecht-kleuren of typografiewaarden vastgelegd.

`organizations/utrecht.json` bevat de bronbestanden:

```json
{
  "source": {
    "light": "@utrecht/design-tokens/dist/tokens.json",
    "dark": "@utrecht/design-tokens/dist/dark/tokens.json",
    "adapter": "../adapters/utrecht.json"
  },
  "light": {
    "utrecht.root.background-color": "{utrecht.document.background-color}"
  },
  "dark": {}
}
```

Utrecht publiceert DTCG-tokenbomen, geen Theme Wizard-export met
`$metadata.tokenSetOrder` zoals in de Groningen-PR. Daarom worden hun light- en
dark-bestanden rechtstreeks ingelezen. Iedere geïmporteerde namespace vervangt
dezelfde namespace uit de basisset volledig. Ook nieuwe tokens komen mee;
weggelaten componenttokens vallen terug op de CSS van de component in plaats
van op oude, opgeloste waarden uit `base.json`.

De app gebruikt daarnaast `basis.*`, Signalen-onderdelen en de nieuwe NL Button.
`adapters/utrecht.json` verbindt deze met bestaande Utrecht-tokens. Dit gedeelde
koppelbestand hoort bij het tokenformaat en kan door andere organisaties worden
hergebruikt. Het organisatiebestand bevat alleen de import en de eigen light/dark
correcties. De build schrijft echte tokenreferenties, zodat dezelfde koppelingen
ook de dark-waarden volgen. Daarna winnen onze gedeelde applicatie-overrides van
de import en deze koppelingen, bijvoorbeeld voor de textarea-breedte en padding.
Alle referenties worden bij de build gevalideerd. De lettertypen worden lokaal
geladen via de font-import uit het Utrecht-package in `src/app/layout.tsx`.

De verwijzingen verbinden ook root, body en pagina-oppervlakken met
`utrecht.document.*`: deze onderdelen hebben in de gepubliceerde dark-export
nog vaste lichte waarden. Het informatievlak gebruikt de documenttekstkleur;
links daarin volgen `currentColor` via `.organization-theme--utrecht` in
`src/app/app.css`. Dit corrigeert het aangetoonde contrastverlies zonder eigen
kleurwaarden toe te voegen. Iedere organisatie krijgt in de layout een eigen
`organization-theme--<thema>`-klasse voor zulke lokale CSS-regels.

Build en activeer het thema:

1. Run `npm run tokens:build:org -- utrecht`.
2. Zet `base.theme` in `config.json` op `"utrecht"`.
3. De optionele Google Fonts-stylesheet is niet nodig voor Utrecht.
4. Start `npm run dev` en controleer light en dark mode.

`base.theme` bepaalt alleen de vormgeving. Organisatienaam, logo, API, kaart en
teksten blijven aparte configuratie. De meegeleverde `config.json` activeert
Utrecht voor een lokale preview, met de historische Meierijstad-demo als backend.
Zie `config.md` voor de herkomst en de omgevinginstellingen.

Een `source` mag ook één string zijn (alleen light). Relatieve bestandspaden
worden opgelost vanaf het organisatiebestand; packagepaden via Node-resolutie.
Beide JSON-bestanden moeten DTCG-tokens met `$value` bevatten. `light` en `dark`
blijven beschikbaar voor expliciete overrides bovenop een import.

## Buildgedrag

Bij `npm run tokens:build:org -- <organisatie>` gebeurt het volgende:

1. `base.json` wordt ingeladen.
2. `design-tokens/overrides.json` wordt ingeladen.
3. `design-tokens/organizations/<organisatie>.json` wordt ingeladen.
4. Geïmporteerde light namespaces en de eventuele adapter worden toegepast op de base tokens.
5. Gedeelde `light` updates en organisatie `light` correcties worden daarop toegepast.
6. Geïmporteerde dark namespaces en de adapter worden toegepast bovenop light. Daarna worden de light-overrides opnieuw toegepast, gevolgd door de gedeelde en organisatie-specifieke `dark` updates.
7. Beide varianten worden gebruikt als input voor Style Dictionary.
8. Output wordt gegenereerd in `public/assets/organizations/<organisatie>/`.

Als een updatepad niet bestaat in de basisset of de geïmporteerde tokens, stopt de
build met een duidelijke fout. Applicatie-overrides mogen expliciet basis-tokens
terugzetten die de import weglaat; andere weggelaten tokens behouden de CSS-fallback
van de component.

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
  - `design-tokens/adapters/*.json` triggeren ook een build voor alle organisaties.
  - Let op: deze watcher moet actief draaien in een terminal.
- `npm run dev` start Next.js. Start de token watcher in een tweede terminal als je tokens wilt aanpassen.

## Output bestanden

Na build vind je o.a.:

- `public/assets/organizations/<organisatie>/theme.css`
- `public/assets/organizations/<organisatie>/variables.css`

`theme.css` bevat:

- light variabelen onder `.organization-theme`
- dark variabelen onder `@media (prefers-color-scheme: dark)` voor `.organization-theme.organization-theme--media-query`

## Veelvoorkomende valkuilen

- **Geen effect na token wijziging:** start `npm run tokens:watch:org` in een tweede terminal of run handmatig `npm run tokens:build:org -- <organisatie>`. Na een package-update moet je het thema opnieuw bouwen.
- **Verkeerde styling geladen:** check dat `config.json` -> `base.theme` exact matcht met bestands/mapnaam (bijv. `purmerend`) of laat `base.theme` weg zodat `base.municipality` als fallback geldt.
- **Padfout in updates:** controleer dat elke key in `light`/`dark` exact bestaat in de basisset of de geïmporteerde tokens.
