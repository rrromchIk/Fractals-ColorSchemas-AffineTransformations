const saveButton = document.getElementById("save-button");

saveButton.addEventListener("click", () => {
    let canvas = document.getElementById("fractalCanvas");
    saveCanvasImage(canvas);
});
