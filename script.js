
const btnGenerate = document.querySelector("button#btnGenerate");
const inputStrofenAantal = document.querySelector("input#inputStrofenAantal");
const gedichtContainer = document.querySelector(".gedichtContainer");
const gedichtElem = gedichtContainer.querySelector(".gedicht");

const btnGenerateText = btnGenerate.textContent;
btnGenerate.textContent = "Aan het laden...";
btnGenerate.disabled = true;
let geladenDingen = 0;
function woordenLaadCallback() {
    ++geladenDingen;
    if (geladenDingen >= 4) {
        btnGenerate.disabled = false;
        btnGenerate.textContent = btnGenerateText;
    }
}
ggLaadStrofes()
    .then(woordenLaadCallback);
ggLaadZelfstandigeNaamwoorden()
    .then(woordenLaadCallback);
ggLaadBijvoeglijkeNaamwoorden()
    .then(woordenLaadCallback);
ggLaadWerkwoorden()
    .then(woordenLaadCallback);

btnGenerate.addEventListener("click", () => {
    gedichtElem.textContent = ggGenereerGedicht(inputStrofenAantal.value);
});
