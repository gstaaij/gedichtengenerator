
// Syntax voor macro's:
// {zn:ev} vervangen voor een enkelvoudig zelfstandig naamwoord
// {zn:mv} vervangen voor een meervoudig zelfstandig naamwoord
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
const strofe_TEST = "Stel, zij zou haar {zn:mv} {ww:present singular}\nin de {zn}, het {znww:past participle}\nen met {bn:o} {zn:ev}\nweer tot {ww: past first-person} komen";

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
    }
    return strofe;
}
