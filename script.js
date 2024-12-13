
const btnGenerate = document.querySelector("button#btnGenerate");
const gedichtContainer = document.querySelector(".gedichtContainer");
const gedichtElem = gedichtContainer.querySelector(".gedicht");

btnGenerate.disabled = true;
let geladenDingen = 0;
function woordenLaadCallback() {
    ++geladenDingen;
    if (geladenDingen >= 2)
        btnGenerate.disabled = false;
}
ggLaadZelfstandigeNaamwoorden()
    .then(woordenLaadCallback);
ggLaadBijvoeglijkeNaamwoorden()
    .then(woordenLaadCallback);

btnGenerate.addEventListener("click", () => {
    gedichtElem.textContent = ggGenereerGedicht(4);
});
