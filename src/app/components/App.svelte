<script>
  export let name;

  const worker = new Worker("../worker.js");
  worker.addEventListener("message", ({ data }) => {
    console.log(`received ${data}`);
  });
</script>

<main>
  <h1>Hello {name}!</h1>
  <button on:click={() => worker.postMessage("asdf")}>Click me</button>
</main>

<style>
  * {
    color: blue;
  }
</style>
