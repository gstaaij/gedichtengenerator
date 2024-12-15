#!/usr/bin/env python3

import json
import os

try: os.mkdir("parsed")
except FileExistsError: pass

print("Bijvoeglijke naamwoorden...")

bnAmount = 0
with open("parsed/bijvnaam.tsv", "w") as outfile:
    with open("kaikki.org-dictionary-Nederlands-by-pos-adj.jsonl") as file:
        for line in file:
            obj = json.loads(line)
            if "senses" in obj:
                good = True
                for sense in obj["senses"]:
                    if "form_of" in sense:
                        good = False
                        break
                if not good: continue
            # Vind de verbogen vorm
            form = ""
            foundForm = False
            if "forms" in obj:
                for formObj in obj["forms"]:
                    if not "tags" in formObj:
                        continue
                    if "inflected" in formObj["tags"]:
                        foundForm = True
                        form = formObj["form"]
                        break
            outfile.write(f"{obj["word"]}\t{form}\n")
            bnAmount += 1

print(f"{bnAmount} unieke bijvoeglijke naamwoorden")
print()
print("Zelfstandige naamwoorden...")

znAmount = 0
with open("parsed/zelfnaam.tsv", "w") as outfile:
    with open("kaikki.org-dictionary-Nederlands-by-pos-noun.jsonl") as file:
        for line in file:
            obj = json.loads(line)
            if "senses" in obj:
                good = True
                for sense in obj["senses"]:
                    if "form_of" in sense:
                        good = False
                        break
                if not good: continue
            # Vind de meervoudsvorm
            form = ""
            foundForm = False
            if "forms" in obj:
                for formObj in obj["forms"]:
                    if not "tags" in formObj:
                        continue
                    if "plural" in formObj["tags"]:
                        foundForm = True
                        form = formObj["form"].split(", ")[0]
                        break
            gender = "mv"
            if "tags" in obj and "neuter" in obj["tags"]:
                gender = "o"
            outfile.write(f"{obj["word"]}\t{form}\t{gender}\n")
            znAmount += 1

print(f"{znAmount} unieke zelfstandige naamwoorden")
print()
print("Werkwoorden...")

foundTags = []
wwAmount = 0
with open("parsed/werkwoord.jsonl", "w") as outfile:
    with open("kaikki.org-dictionary-Nederlands-by-pos-verb.jsonl") as file:
        for line in file:
            obj = json.loads(line)
            if "senses" in obj:
                good = True
                for sense in obj["senses"]:
                    if "form_of" in sense:
                        good = False
                        break
                if not good: continue
            # Vind de meervoudsvorm
            forms = []
            if "forms" in obj:
                for formObj in obj["forms"]:
                    if not "tags" in formObj:
                        continue
                    for tag in formObj["tags"]:
                        if not tag in foundTags: foundTags.append(tag)
                    form = {}
                    form["form"] = formObj["form"]
                    form["tags"] = formObj["tags"]
                    forms.append(form)
            outObj = {"word": obj["word"], "forms": forms}
            json.dump(outObj, outfile)
            outfile.write("\n")
            wwAmount += 1

print(f"{wwAmount} unieke zelfstandige naamwoorden")
print("Mogelijke tags voor werkwoorden:")
for tag in foundTags:
    print(f"  {tag}")
