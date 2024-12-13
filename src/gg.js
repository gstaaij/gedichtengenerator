
const btnGenerate = document.querySelector("button#btnGenerate");
const gedichtContainer = document.querySelector(".gedichtContainer");
const gedichtElem = gedichtContainer.querySelector(".gedicht");

btnGenerate.addEventListener("click", () => {
    gedichtElem.textContent = "Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit.\nTemporibus aspernatur omnis,\ntenetur voluptate dolor culpa\nlibero soluta sapiente?\nSoluta voluptate velit delectus\nporro esse illum quibusdam odio\nlaboriosam quos corporis!";
});
