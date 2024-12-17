
// Syntax voor macro's:
// {zn:ev,geslacht} vervangen door een enkelvoudig zelfstandig naamwoord. Geslacht kan `mv`, of `o` zijn
// {zn:mv,geslacht} vervangen door een meervoudig zelfstandig naamwoord. Geslacht kan `mv`, of `o` zijn
// {bn:o} vervangen door een onverbogen bijvoeglijk naamwoord
// {bn:v} vervangen door een verbogen bijvoeglijk naamwoord
// {ww:tags} vervangen voor een werkwoord. De tags zijn één of meer van de volgende, door spaties gescheiden:
//     past         participle    active         infinitive
//     imperfect    present       future         short-form
//     perfect      imperative    subjunctive    indicative
//     singular     first-person  second-person  third-person
//     plural       conditional   impersonal     passive
//     main-clause  subordinate-clause           diminutive
// {znww:tags} vervangen door een zelfstandig naamwoord met een werkwoord van van dezelfde "hoeveelheid", plus bepaalde tags
// Aan het einde van alle macro's kan nog een extra dubbele punt met een regex voor het woord komen.
// Als deze regex wordt weggelaten en het woord géén werkwoord is, zal er een default regex van /^[^ \n]+$/ gebruikt worden.


const zelfstandigeNaamwoorden = []
const bijvoeglijkeNaamwoorden = []
const werkwoorden = []
let strofes = [];

async function ggLaadStrofes() {
    return fetch("ggdb_strofes.jsonc")
        .then(res => res.text())
        .then(text => {
            // Deze enge RegEx verwijdert comments
            strofes = JSON.parse(text.replace(/\/\*.*?\*\/|\/\/.*?(\n|$)/gm, ""));
            console.log(strofes);
        })
        .catch(e => console.error(e));
}

async function ggLaadZelfstandigeNaamwoorden() {
    return fetch("json/parsed/zelfnaam.tsv")
        .then(res => res.text())
        .then(text => {
            for (let subtext of text.split("\n")) {
                zelfstandigeNaamwoorden.push(subtext.split("\t"));
            }
        })
        .catch(e => console.error(e));
}

async function ggLaadBijvoeglijkeNaamwoorden() {
    return fetch("json/parsed/bijvnaam.tsv")
        .then(res => res.text())
        .then(text => {
            for (let subtext of text.split("\n")) {
                bijvoeglijkeNaamwoorden.push(subtext.split("\t"));
            }
        })
        .catch(e => console.error(e));
}

async function ggLaadWerkwoorden() {
    return fetch("json/parsed/werkwoord.jsonl")
        .then(res => res.text())
        .then(text => {
            for (let subtext of text.split("\n")) {
                if (subtext != "")
                    werkwoorden.push(JSON.parse(subtext));
            }
        })
        .catch(e => console.error(e));
}

function kiesRandom(lijst) {
    return lijst[Math.floor(Math.random()*lijst.length)];
}

function heeftTags(woordTags, zoekTags) {
    let aantalGevonden = 0;
    for (let woordTag of woordTags) {
        if (zoekTags.indexOf(woordTag) > -1)
            ++aantalGevonden;
    }
    return aantalGevonden >= zoekTags.length;
}

function ggGenereerGedicht(strofenAantal) {
    let gedicht = "";
    for (let _ = 0; _ < strofenAantal; ++_) {
        const origStrofe = kiesRandom(strofes).join("\n");
        let strofe = "";
        let i = 0;
        while (i < origStrofe.length) {
            // Verkrijg de macro
            let openIndex = origStrofe.indexOf("{", i) + 1;
            if (openIndex == 0) {
                strofe += origStrofe.substring(i);
                break;
            }
            strofe += origStrofe.substring(i, openIndex - 1);
            let sluitIndex = origStrofe.indexOf("}", openIndex);
            let macro = origStrofe.substring(openIndex, sluitIndex);
            i = sluitIndex + 1;

            // Parse de macro
            let [macroBasis, macroArg, macroRegex, macroSubstring] = macro.split(":");
            // Als de regex niet is gedefiniëerd en het geen werkwoord is, stel dan een default in die spaties uitsluit.
            if (!macroRegex && macroBasis != "ww")
                macroRegex = "^[^ \n]+$";
            console.log(macroBasis, macroArg, macroRegex, macroSubstring);

            let succes = false;
            let pogingen = 0;
            const maxPogingen = 100;
            let woord;
            switch (macroBasis) {
                case "bn": {
                    while (!succes && pogingen < maxPogingen) {
                        let bnRandom = kiesRandom(bijvoeglijkeNaamwoorden);
                        if (macroArg != undefined && macroArg == "v" && bnRandom[1] != "")
                            woord = bnRandom[1];
                        else
                            woord = bnRandom[0];
                        if ((!macroRegex && woord) || (woord && woord.match(macroRegex))) {
                            console.log(bnRandom);
                            succes = true;
                        }
                    }
                } break;
                case "zn": {
                    while (!succes && pogingen < maxPogingen) {
                        let znRandom = kiesRandom(zelfstandigeNaamwoorden);
                        if (macroArg != undefined) {
                            let [tijd, geslacht] = macroArg.split(",");
                            if (geslacht && geslacht != znRandom[2]) {
                                // Dit is niet het goede geslacht, probeer opnieuw
                                ++pogingen;
                                continue;
                            }
                            if (tijd == "mv" && znRandom[1] != "")
                                woord = znRandom[1];
                            else
                                woord = znRandom[0];
                        } else
                            woord = znRandom[0];
                        if ((!macroRegex && woord) || (woord && woord.match(macroRegex))) {
                            console.log(znRandom);
                            succes = true;
                        }

                        ++pogingen;
                    }
                } break;
                case "ww": {
                    while (!succes && pogingen < maxPogingen) {
                        let wwRandom = kiesRandom(werkwoorden);
                        
                        if (macroArg == undefined) {
                            // Er is geen argument, en het maakt dus niet uit welk woord gekozen wordt
                            let woorden = [];
                            woorden.push(wwRandom.word);
                            for (let form of wwRandom.forms) {
                                woorden.push(form.form);
                            }
                            woord = kiesRandom(woorden);
                            if ((!macroRegex && woord) || (woord && woord.match(macroRegex))) {
                                console.log(wwRandom);
                                succes = true;
                            }
                            break;
                        }

                        let zoekTags = macroArg.split(" ");
                        let woorden = [];
                        let standaardTags = ["infinitive", "present", "plural", "first-person", "second-person", "third-person"];
                        if (heeftTags(standaardTags, zoekTags)) 
                            woorden.push(wwRandom.word);
                        for (let form of wwRandom.forms) {
                            if (heeftTags(form.tags, zoekTags))
                                woorden.push(form.form);
                        }
                        if (woorden.length > 0) {
                            woord = kiesRandom(woorden);
                            if ((!macroRegex && woord) || (woord && woord.match(macroRegex))) {
                                console.log(wwRandom);
                                succes = true;
                            }
                        }

                        ++pogingen;
                    }
                } break;
                default:
                    console.error("unreachable");
                    strofe += "[ERROR]";
                    break;
            }
            if (!succes) {
                console.error(`Kon in ${pogingen} pogingen geen woord vinden voor ${macro}.`);
                strofe += "[ERROR]";
                continue;
            }
            if (macroSubstring != undefined) {
                let [start, end] = macroSubstring.split(",");
                start = parseInt(start);
                if (start < 0)
                    start += woord.length;
                if (end != undefined) {
                    end = parseInt(end);
                    if (end < 0)
                        end += woord.length;
                    woord = woord.substring(start, end);
                } else
                    woord = woord.substring(start);
            }
            strofe += woord;
        }

        gedicht += strofe + "\n\n";
    }
    return gedicht;
}
