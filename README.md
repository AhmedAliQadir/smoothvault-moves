# Smooth Vault Moves: live site (GitHub Pages)

This branch is what GitHub Pages serves at https://smoothvaultmoves.co.uk.

- `index.html` + `img/`: the home page (traditional local-trades layout, October 2026). Plain HTML, CSS and JS in one file; edit it directly.
- `privacy/`, `terms/`, `review/`, `404.html`, `assets/`: built from the React source on `master` (`npm run build`), unchanged.
- `config.js`: company number, registered office, review links and the Web3Forms key. The home page and the legal pages both read it.
- `CNAME`: the custom domain. Keep it.

The React home page with the 3D hero is still on `master` and is not deployed.
