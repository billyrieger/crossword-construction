<script lang="ts">
  import { onMount } from "svelte";
  import wasm from "../../solver/Cargo.toml";

  export let entries: number[][];

  let solve: (entries: any) => any;
  let solution: string = "";

  onMount(async () => {
    const module = await wasm();
    solve = module.solve;
  });
</script>

<button
  on:click={() => {
    // console.log(entries);
    // solution = solve([[0, 1, 2, 3, 4, 5]]);
    solution = "solved!";
  }}>Solve</button
>
<p>The solution is: {solution}.</p>
