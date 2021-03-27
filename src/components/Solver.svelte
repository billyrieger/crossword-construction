<script lang="ts">
  import { onMount } from "svelte";
  import wasm from "../../solver/Cargo.toml";

  export let input: number;

  let double: (n: number) => number;

  onMount(async () => {
    const module = await wasm();
    double = module.double;
  });
</script>

<p>{input} doubled is {double ? double(input) : "idk!"}!</p>
