<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import WebWorker from "web-worker:../Worker.ts";

  const dispatch = createEventDispatcher();

  export let entries: number[][] = [];
  let worker;

  onMount(() => {
    worker = new WebWorker();
    worker.onmessage = ({ data }) => {
      console.log("solved");
      dispatch("solved", data);
    };
    worker.postMessage({ type: "init" });
  });
</script>

<button
  on:click={() => {
    console.log("solving...");
    worker.postMessage({ type: "solve", entries });
  }}>Solve</button
>
