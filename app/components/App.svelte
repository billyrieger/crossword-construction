<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import Solver from "./Solver.svelte";

  let gridRows = 15;
  let gridCols = 15;

  $: crossword = new Grid(gridRows, gridCols);
</script>

<main class="main">
  <div class="dimensions">
    <button
      class="icon-minus"
      on:click={() => {
        gridRows -= 1;
      }}
    />
    <span>{gridRows}</span>
    <button
      class="button"
      on:click={() => {
        gridRows += 1;
      }}
    >
      <div class="icon-help-circled" />
    </button>
  </div>
  <div class="dimensions">
    <button
      class="icon-minus"
      on:click={() => {
        gridCols -= 1;
      }}
    />
    <span>{gridCols}</span>
    <button
      class="icon-plus"
      on:click={() => {
        gridCols += 1;
      }}
    />
  </div>
  <GridComponent bind:crossword editable={true} />
  <Solver input={crossword} />
</main>

<style lang="scss" global>
  $picnic-primary: #70d;

  @import "../../node_modules/picnic/src/picnic";

  @font-face {
    font-family: "icons";
    src: url("../font/icons.woff") format("woff2"),
      url("../font/icons.woff2") format("woff"),
      url("../font/icons.ttf") format("truetype"),
      url("../font/icons.svg") format("svg");
    font-weight: normal;
    font-style: normal;
  }

  [class^="icon-"]:before,
  [class*=" icon-"]:before {
    font-family: "icons";
    font-style: normal;
    font-weight: normal;

    display: inline-block;
    text-decoration: inherit;
    width: 1em;
    margin-right: 0.2em;
    text-align: center;

    font-variant: normal;
    text-transform: none;

    /* Animation center compensation - margins should be symmetric */
    /* remove if not needed */
    margin-left: 0.2em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon-plus:before {
    content: "\e800";
  } /* '' */
  .icon-minus:before {
    content: "\e801";
  } /* '' */
  .icon-zoom-in:before {
    content: "\e802";
  } /* '' */
  .icon-zoom-out:before {
    content: "\e803";
  } /* '' */
  .icon-lock:before {
    content: "\e804";
  } /* '' */
  .icon-lock-open:before {
    content: "\e805";
  } /* '' */
  .icon-attention-circled:before {
    content: "\e806";
  } /* '' */
  .icon-help-circled:before {
    content: "\e807";
  } /* '' */
  .icon-info-circled:before {
    content: "\e808";
  } /* '' */
  .icon-clock:before {
    content: "\e809";
  } /* '' */
  .icon-spin3:before {
    content: "\e832";
  } /* '' */

  .main {
    width: 100%;
    height: 100%;
  }

  .dimensions {
    padding: 40px;
  }

  .button {
    padding: 0;
    margin: 0;
    width: 1.5em;
    height: 1.5em;
    // text-align: center;
  }
</style>
