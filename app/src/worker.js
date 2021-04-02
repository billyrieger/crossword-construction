import("../../solver/pkg")
  .then((wasm) => {
    self.addEventListener("message", (ev) => {
      console.log("Web worker started.");
      self.postMessage(wasm.square(5));
    });
  })
  .catch((err) => {
    console.log("Error while importing wasm");
    console.log(err);
  });
