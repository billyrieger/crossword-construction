import { get_spread_object } from 'svelte/internal';
import Crossword from './Crossword.svelte';
import wasm from './solver/Cargo.toml';

const app = new Crossword({
	target: document.body,
	props: {}
});

(async () => {
	const foo = await wasm();
	console.log(foo);
	alert(foo.greet());
})();

export default app;