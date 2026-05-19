# Configuration

The application reads `config.json` from the project root. Keep the file valid JSON: strings use double quotes, booleans use `true` or `false`, and numeric values are written without quotes.

## API And Frontend URLs

- `baseUrlApi`: Base URL for the Signalen API. Include the trailing slash because the application appends API paths to this value.
- `pdokUrlApi`: Base URL for the PDOK location server.
- `frontendUrl`: Public URL of this frontend.

## MapTiler

- `maptilerApiKey`: API key used for MapTiler style requests.
- `maptilerMap`: MapTiler style URL for light mode, without `/style.json`.
- `maptilerMapDarkMode`: MapTiler style URL for dark mode, without `/style.json`.
- `restrictSelectionArea`: When `true`, users can only select locations inside the configured bounds and outside the configured out-of-bounds selection area.
- `maptilerOutOfBoundsSelectionArea`: Tileset URL used to draw the restricted selection area. Required when `restrictSelectionArea` is `true`.
- `maptilerOutOfBoundsLayerId`: Source layer ID for the out-of-bounds tileset. Required when `restrictSelectionArea` is `true`.

## Organisation

All organisation-specific settings are nested under `base`.

- `base.municipality`: Internal organisation name. Also used as the theme folder fallback when `base.theme` is not set.
- `base.theme`: Optional theme folder name under `public/assets/organizations/<theme>/`.
- `base.municipality_display_name`: Human-readable organisation name used in labels and fallback text.
- `base.naam`: Organisation name used in page metadata and page titles, for example `gemeente Amsterdam` or `provincie Noord-Brabant`.
- `base.assets_url`: Base URL used for API-provided assets such as feature icons. Do not include a trailing slash.
- `base.fonts.googleStylesheetUrl`: Optional Google Fonts stylesheet URL loaded in the document head.

## Languages

`base.supportedLanguages` controls the available locales and the language switcher. The language switcher is only shown when more than one language is configured.

Each language entry has:

- `label`: Accessible label for the language switch link.
- `lang`: Locale code used in routes, for example `nl` or `en`.
- `name`: Visible language name.

## Header Logo

Logo settings are configured at `base.header.logo`.

- `alt`: Accessible text for the logo image. Follow the guidance at https://nldesignsystem.nl/wcag/2.4.4/#fout-verkeerde-linktekst-voor-een-link-met-een-afbeelding for image links.
- `url`: Logo file path relative to `public/assets/`.
- `dark_mode_url`: Optional dark-mode logo file path relative to `public/assets/`.
- `width`: Optional logo width in pixels.
- `height`: Optional logo height in pixels.

## Address Search

- `base.pdok_address_suggest.scope`: PDOK filter scope. Use `gemeente` for municipality-based address suggestions or `provincie` for province-based address suggestions.
- `base.pdok_address_suggest.organization`: Exact PDOK filter value for the selected scope.

## Map Defaults

Map settings are configured at `base.map`.

- `find_address_in_distance`: Search radius in meters when finding an address near a selected location.
- `minimal_zoom`: Minimum zoom level required before users can select a location.
- `default_zoom`: Initial map zoom level.
- `center`: Initial map center as `[latitude, longitude]`.
- `maxBounds`: Bounding box as `[[west, south], [east, north]]`.

## Links

Links are configured at `base.links`.

- `home`: Homepage URL used by the header logo.
- `about`: Footer link to information about the service.
- `privacy`: Footer link to the privacy statement.
- `accessibility`: Footer link to the accessibility statement.
- `help`: Help URL.

The footer currently renders `about`, `privacy`, and `accessibility` when their value is present.

## Contact

- `base.contact.tel`: Organisation telephone number. This field is available in the configuration, but is not currently rendered by the frontend.

## Text Overrides

Organisation-specific translated text is configured at `base.i18n`.

Currently supported:

- `base.i18n.<locale>.describe_report.alert.help_text`: Markdown text displayed on the first step of the incident flow. Use Markdown links for telephone numbers and email addresses.

Example:

```json
"help_text": "Problemen met het indienen van een melding? Bel [0299452452](tel:+0299452452) of mail naar [meldingen@example.nl](mailto:meldingen@example.nl)."
```
