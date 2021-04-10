<script lang="ts">
  import type { ReturnMsg } from "../types";

  let worker = new Worker("./worker.js");

  worker.addEventListener("message", (event: MessageEvent<ReturnMsg>) => {
    switch (event.data.kind) {
      case "SolutionFound": {
        console.log("solution found!");
        break;
      }

      default: {
        break;
      }
    }
  });
</script>

<div>
</div>