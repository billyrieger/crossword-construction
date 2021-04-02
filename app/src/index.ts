import App from './components/App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'foo'
	}
});

export default app;