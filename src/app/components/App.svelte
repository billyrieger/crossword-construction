<script lang="ts">
  export let name: string;

  let result: number;

  const worker = new Worker("worker.js");
  worker.addEventListener("message", ({ data }) => {
    result = data;
  });
</script>

<main>
  <h1>Hello {name}!</h1>
  <button on:click={() => worker.postMessage("asdf")}>Click me</button>
  <p>{result ?? "idk"}</p>
</main>

<style>
  * {
    color: blue;
  }
</style>
