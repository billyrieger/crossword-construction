// ``A dependency graph that contains any wasm must all be imported
// asynchronously. This `bootstrap.js` file does the single async import, so
// that no one else needs to worry about it again.''
// https://github.com/MaxBittker/sandspiel/blob/master/js/bootstrap.js
import("./index").catch(e =>
  console.error("Error importing `index.ts`:", e)
);

export {};