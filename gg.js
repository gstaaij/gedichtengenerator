
// Syntax voor macro's:
// {zn:ev,geslacht} vervangen voor een enkelvoudig zelfstandig naamwoord. Geslacht kan `mv`, of `o` zijn
// {zn:mv,geslacht} vervangen voor een meervoudig zelfstandig naamwoord. Geslacht kan `mv`, of `o` zijn
// TODO: bovenstaande geslachtbehandeling implementeren
// {bn:o} vervangen voor een onverbogen bijvoeglijk naamwoord
// {bn:v} vervangen voor een verbogen bijvoeglijk naamwoord
// {ww:tags} vervangen voor een werkwoord. De tags zijn één of meer van de volgende, door spaties gescheiden:
//     past          participle     activeinfinitive  imperfect
//     present       future         short-form        perfect
//     imperative    subjunctive    indicative        singular
//     first-person  second-person  third-person      plural
//     conditional   impersonal     passive           main-clause
//     subordinate-clause           diminutive
// {znww:tags} vervangen voor een zelfstandig naamwoord met een werkwoord van van dezelfde "hoeveelheid", plus bepaalde tags
// TODO: lees uit het JSON-bestand
const strofe_TEST = "Stel, zij zou haar {zn:mv} {ww:present singular}\nin de {zn:ev}, het {zn:ev} {ww:past participle}\nen met {bn:v} {zn:ev}\nweer tot {ww:past first-person} komen";

let zelfstandigeNaamwoorden = []
let bijvoeglijkeNaamwoorden = []

function ggLaadZelfstandigeNaamwoorden() {
    return fetch("/json/parsed/zelfnaam.tsv")
        .then((res) => res.text())
        .then((text) => {
            for (let subtext of text.split("\n")) {
                zelfstandigeNaamwoorden.push(subtext.split("\t"));
            }
        })
        .catch((e) => console.error(e));
}

function ggLaadBijvoeglijkeNaamwoorden() {
    return fetch("/json/parsed/bijvnaam.tsv")
        .then((res) => res.text())
        .then((text) => {
            for (let subtext of text.split("\n")) {
                bijvoeglijkeNaamwoorden.push(subtext.split("\t"));
            }
        })
        .catch((e) => console.error(e));
}

function kiesRandom(lijst) {
    return lijst[Math.floor(Math.random()*lijst.length)];
}

function ggGenereerGedicht(strofenAantal) {
    // TODO: gebruik strofenAantal

    let strofe = "";
    let i = 0;
    while (i < strofe_TEST.length) {
        // Verkrijg de macro
        let openIndex = strofe_TEST.indexOf("{", i) + 1;
        if (openIndex == 0) {
            strofe += strofe_TEST.substring(i);
            break;
        }
        strofe += strofe_TEST.substring(i, openIndex - 1);
        let sluitIndex = strofe_TEST.indexOf("}", openIndex);
        let macro = strofe_TEST.substring(openIndex, sluitIndex);
        i = sluitIndex + 1;

        // Parse de macro
        let macroSplit = macro.split(":");
        console.log(macroSplit);
        let macroBasis = macroSplit[0];
        switch (macroBasis) {
            case "bn":
                let bnRandom = kiesRandom(bijvoeglijkeNaamwoorden);
                if (macroBasis.length > 1 && macroBasis[0] == "v" && bnRandom[1] != "")
                    strofe += bnRandom[1];
                else
                    strofe += bnRandom[0];
                break;
            case "zn":
                let znRandom = kiesRandom(zelfstandigeNaamwoorden);
                if (macroBasis.length > 1 && macroBasis[0] == "mv" && znRandom[1] != "")
                    strofe += znRandom[1];
                else
                    strofe += znRandom[0];
                break;
            case "ww":
                console.log("ww");
                strofe += "{ww}";
                break;
            default:
                console.error("unreachable");
                break;
        }
    }
    return strofe;
}
