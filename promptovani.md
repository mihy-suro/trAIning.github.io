# Jak na kvalitní prompt

## 1) Proč záleží na promptování

Velké jazykové modely (LLM) nejsou „inteligentní bytosti“, ale statistické modely,
které **predikují další tokeny** na základě vstupu.
Prompt je proto v praxi tvoje **programovací rozhraní**.

**Prompt engineering** je disciplína, která se zabývá:
- návrhem promptů,
- jejich iterativním laděním,
- a nastavováním „mantinelů“ tak, aby výstupy byly  
  **kvalitní, konzistentní a kontrolovatelné**.

Dobře napsaný prompt:
- snižuje riziko halucinací (fabulací),
- zvyšuje konzistenci výstupu,
- šetří čas (méně iterací),
- umožňuje automatizaci (strojově čitelný formát).

---

## 2) Základní a pokročilé techniky promptování (přehled)

| Technika | Kdy ji použít | Hlavní riziko |
|--------|---------------|---------------|
| Buď jasný a konkrétní | Prakticky vždy | Nejasný cíl → model si domýšlí |
| Specifikace formátu výstupu | Reporty, šablony, automatizace | Volný text → nekonzistentní výstupy |
| Zero-shot prompting | Jednoduché úkoly | Slabá kontrola nad stylem |
| One-shot prompting | Když chceš „navést směr“ | Jedna ukázka nemusí stačit |
| Few-shot prompting | Klasifikace, styl, struktura | Špatné příklady naučí špatné chování |
| Role / system prompt | Konzistentní tón a perspektiva | Příliš obecná role |
| Cue (prefill) | Když formát „ujíždí“ | Přestřelený cue sváže model |
| Chain of Thought (CoT) | Analýzy, multi-step úlohy | Délka, cena, latence |
| Tree of Thoughts | Hledání řešení, návrhy | Složitost, nutnost evaluace |
| Prompt chaining | Komplexní workflow | Chyby se řetězí |
| XML / strukturované tagy | Práce s texty, bezpečnost | Nejsou sandbox |
| „Dej modelu out“ | Nejistá nebo neúplná data | Bez outu roste fabulace |
| Ochrana proti injection | Uživatelský obsah | Neoddělené instrukce |

---

## 3) Obsah bublin / tooltipů (příklady a vysvětlení)

### Buď jasný a konkrétní
**Špatně**
> „Napiš mi shrnutí.“

**Lépe**
> „Shrň text pro laiky do 5 bodů.  
> U každého bodu uveď dopad a riziko.  
> Max. 800 znaků.“

**Proč to funguje**  
Model ví:
- co je cíl,
- pro koho píše,
- jak má výstup vypadat.

---

### Specifikace formátu výstupu
**Příklad**
> „Vrať výstup jako:
> 1) Nadpis  
> 2) 3× Proč  
> 3) 3× Jak  
> 4) Sekce ‚Nejistoty‘ (pokud existují)“

**Tip**  
Když chceš automatizaci, vyžaduj:
- JSON,
- tabulku,
- pevnou strukturu sekcí.

---

### Zero-shot / One-shot / Few-shot
**Zero-shot**
> „Přelož text do angličtiny.“

**One-shot**
> „Ahoj světe → Hello world  
> Dobrý den → ?“

**Few-shot**
> „Pes → animal  
> Auto → vehicle  
> Hruška → ?“

**Pozor**  
Model kopíruje **pattern**, ne úmysl.  
Špatný příklad = špatný výsledek.

---

### Role / system prompt
**Příklad**
> „Jsi seniorní analytik kybernetické bezpečnosti.  
> Piš stručně, používej odrážky a označ nejistoty.“

**Tip**
- Role patří do *system promptu*.
- Úkol patří do *user promptu*.

---

### Cue (prefill)
**Příklad**
> User: „Shrň text do tří bodů.“  
> Assistant:  
> **Top 3 zjištění:**  
> 1.

Model má tendenci strukturu **dokončit správně**.

---

### Chain of Thought (CoT)
**Příklad**
> „Nejdřív krok za krokem zvaž možnosti,  
> potom uveď finální odpověď.“

**Používej když**
- úloha má více kroků,
- záleží na logice a návaznosti.

**Pozor**
- delší výstupy,
- vyšší cena a latence.

---

### Tree of Thoughts
**Příklad**
> „Navrhni 3 různé přístupy.  
> U každého uveď výhody, rizika a kdy selže.  
> Pak vyber nejlepší a zdůvodni proč.“

**Vhodné pro**
- návrh řešení,
- plánování,
- strategické rozhodování.

---

### Prompt chaining
**Příklad workflow**
1. Extrahuj fakta  
2. Zkontroluj rozpory  
3. Navrhni závěry  
4. Přepiš do srozumitelné podoby

**Výhoda**
- lepší kontrola,
- jednodušší ladění jednotlivých kroků.

---

### XML / strukturované tagy
**Příklad**
```xml
<instructions>
Vytáhni rizika z textu.
Používej jen informace ze <source>.
</instructions>

<source>
... text ...
</source>
