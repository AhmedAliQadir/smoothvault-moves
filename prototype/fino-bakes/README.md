# Fino Bakes prototype

A one-page prototype for Fino Bakes (cheesecakes, tiramisu and dessert cups, made fresh to order, collection only from Walsall, Birmingham).

Open `index.html` through any static server (for example `npx serve prototype/fino-bakes`). It loads Three.js 0.160 from jsDelivr and fonts from Google Fonts, so it needs an internet connection.

- The desserts are modelled in code (no 3D files). Scrolling moves them between sections: the cheesecake splits into its layers, the flavour chips change toppings, "Show the layers" opens up the tiramisu, and the order form shows the dessert you picked.
- Add the shop's WhatsApp number to `WHATSAPP_NUMBER` near the bottom of `index.html`.
- `logo.png` and `logo-mark.png` are the logo cut out of the supplied artwork; the page uses them as masks so they take the text colour in light and dark mode.
- This is separate from the Smooth Vault Moves site in the rest of this repository and is not part of its build.
