<script lang="ts" context="module">
  export enum CellKind {
    Block,
    Open,
  }

  export enum Highlight {
    Primary,
    Secondary,
    None,
  }

  export type CellData = {
    kind: CellKind;
    value?: string;
    number?: number;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let data: CellData;

  export let row: number;
  export let col: number;
  export let value: string;
  export let number: string;
  export let highlight: Highlight = Highlight.None;

  const dispatch = createEventDispatcher();

  function click() {
    dispatch("click", {
      row: row,
      col: col,
    });
  }
</script>

<div
  class="cell row-{row} col-{col}"
  class:block={data.kind == CellKind.Block}
  class:primary={highlight === Highlight.Primary}
  class:secondary={highlight === Highlight.Secondary}
  on:mousedown={click}
>
  {#if data.number !== undefined}
    <div class="number">{data.number}</div>
  {/if}
  {#if data.value !== undefined && data.value.length > 0}
    <div class="value">{data.value}</div>
  {/if}
</div>

<style>
  .cell {
    display: inline-block;
    width: 2.75em;
    height: 2.75em;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    position: relative;

    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
  }

  .block {
    background-color: black;
  }

  .primary {
    background-color: aqua;
  }

  .block.primary {
    background-color: aqua;
    filter: brightness(0.5);
  }

  .row-0 {
    border-top: 1px solid black;
  }

  .col-0 {
    border-left: 1px solid black;
  }

  .number {
    position: absolute;
    font-size: 0.8em;
    left: 0.1em;
  }

  .value {
    width: 100%;
    height: 100%;
    font-size: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
