import App from "./components/App.svelte";
import { Crossword } from "./crossword";

const app = new App({
  target: document.body,
  props: {
    name: "foo",
  },
});

console.log(new Crossword(5, 5));

export default app;
