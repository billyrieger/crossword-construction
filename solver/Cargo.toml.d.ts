export * from "../target/wasm-pack/solver/index";

type Exports = typeof import("../target/wasm-pack/solver/index");
declare const init: () => Promise<Exports>;
export default init;