# Idiotic Investing 2 — browser edition

A JavaScript conversion of the supplied Game.java and GameEvents.java classes.
All 39 events are included. No dependencies, build command, backend, account
system, database, or saved game data. Every player has their own in-memory game.

## Play locally

Keep index.html, game.js, and ui.js together. Double-click index.html to open it
in a browser. Click Ready, enter your name, and follow the prompts. Type an
answer and press Enter, or use the suggested answer buttons. Restart or refresh
to start a new game.

## Publish free on GitHub Pages

1. Sign in at https://github.com and create a new **public** repository named
   `idiotic-investing`. You can initialize it with a README.
2. Extract the downloaded ZIP on your computer.
3. Open the repository and choose **Add file → Upload files**. Upload
   `index.html`, `game.js`, and `ui.js` directly into the repository root.
   You can also upload this README. Do not upload the ZIP itself or put the
   three game files inside an extra folder.
4. Click **Commit changes** to save the upload to `main`.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
7. Select branch **main**, folder **/(root)**, and click **Save**.
8. Wait for deployment to finish. The Pages settings will show the site link,
   normally `https://YOUR-USERNAME.github.io/idiotic-investing/`.
9. Send that link to your friends. They only need a browser.

GitHub Pages is free for public repositories on GitHub Free. Your game and
source code will be public. To update the game, upload changed files to the same
repository and commit them; Pages republishes the site.

If you get a 404, check that `index.html` is at the root of the selected branch,
then check the repository's Actions tab for the Pages deployment result.

Official instructions:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Files and editing

- `index.html`: layout and styles.
- `game.js`: event functions, state, validation, and turn updates. Original
  function names are retained so events are easy to find.
- `ui.js`: terminal input/output, suggested answers, and main game loop.

Browser input is asynchronous: methods that ask questions use `async` and
`await`. This pauses the event while the player chooses without freezing the
page. `Math.trunc` preserves Java's whole-dollar integer division.

## Small fixes made in the conversion

- Large cash wins are capped at 2,147,483,647 after each event instead of wrapping
  into a negative Java int. Reaching 999,999,999 cash still wins.
- Win/loss is checked after each turn, without asking for an extra `next` first.
- Ready and next accept any capitalization and surrounding spaces.
- Browser input replaces the multiple competing Java Scanner instances.

Other gameplay rules and probabilities are retained. Payroll still applies
before the win/loss check. Running out of cash still loses even if you hold
shares, and debt is not subtracted from the cash-based victory target.

## Validation

The converted logic passed 1,170 seeded event simulations covering all 39 events
with multiple starting states. Additional checks covered rounding, fractional
ownership payouts, numeric input validation, and maximum cash handling.

A simulated DOM integration check covered startup, 24 turns, victory, and input
shutdown. A real-browser visual check was unavailable in the build environment.
