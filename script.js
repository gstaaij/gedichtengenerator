
const formControls = document.querySelector("form.controls");
const btnGenerate = document.querySelector("input#btnGenerate");
const inputStrofenAantal = document.querySelector("input#inputStrofenAantal");
const gedichtContainer = document.querySelector(".gedichtContainer");
const gedichtElem = gedichtContainer.querySelector(".gedicht");

const btnGenerateText = btnGenerate.value;
btnGenerate.value = "Aan het laden...";
btnGenerate.disabled = true;
let geladenDingen = 0;
function woordenLaadCallback() {
    ++geladenDingen;
    if (geladenDingen >= 4) {
        btnGenerate.disabled = false;
        btnGenerate.value = btnGenerateText;
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

formControls.addEventListener("submit", e => {
    e.preventDefault();
    gedichtElem.textContent = ggGenereerGedicht(inputStrofenAantal.value);
});
