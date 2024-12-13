
const btnGenerate = document.querySelector("button#btnGenerate");
const gedichtContainer = document.querySelector(".gedichtContainer");
const gedichtElem = gedichtContainer.querySelector(".gedicht");

btnGenerate.addEventListener("click", () => {
    gedichtElem.textContent = ggGenereerGedicht(4);
});
