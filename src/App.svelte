<script lang="ts">
  import Solver from "./components/Solver.svelte";

  let n: number = 5;
</script>

<main>
  <button
    on:click={() => {
      n += 1;
    }}
  >
    Click me!
  </button>
  <Solver input={n} />
</main>

<style></style>
