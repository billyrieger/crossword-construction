<script lang="ts">
  // import { createEventDispatcher, onMount } from "svelte";
  // import wasm from "../../solver/Cargo.toml";

  // const dispatch = createEventDispatcher();

  export let entries: number[][] = [];

  // let solve: (entries: any) => any;

  // onMount(async () => {
  //   const module = await wasm();
  //   solve = module.solve;
  // });
</script>

<button
  on:click={() => {
    console.log("solving...");
    // const solution = solve(entries);
    console.log(entries);
    console.log("solved");
    // dispatch("solved", solution);
  }}>Solve</button
>
