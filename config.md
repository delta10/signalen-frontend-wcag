To successfully configure the ```config.json``` file and ensure the Signalen frontend remains fully accessible, consider the following points:

- ```base -> header -> logo -> "alt"```: Follow the guidance provided at https://nldesignsystem.nl/wcag/2.4.4/#fout-verkeerde-linktekst-voor-een-link-met-een-afbeelding regarding appropriate link text for image-based links.
- ```base -> i18n -> en / nl -> describe_report -> alert -> "help_text"```:
  This is a markdown field where you can include text and links. It is displayed on the first step of the page and is intended to inform users that they can also call or email regarding a notification. Example:

    ```markdown
    "help_text": Problemen met het indienen van een melding? Bel [0299452452](tel:+0299452452) of mail naar [meldingen@purmerend.nl](mailto:meldingen@purmerend.nl). Wij zijn bereikbaar van maandag tot en met vrijdag van 8:00 uur tot 18:00 uur.
    ```