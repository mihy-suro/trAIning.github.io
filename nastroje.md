# Přehled AI modelů a nástrojů

Tento dokument slouží jako **orientační přehled současných AI modelů a nástrojů**, se kterými se lze setkat při práci s texty, dokumenty, kódem, daty i audiovizuálním obsahem.  
Cílem není detailní srovnání, ale **rychlá orientace v tom, k čemu se který nástroj typicky používá**.

---

## 1️⃣ Foundation models (všeobecné modely)

**Foundation models** jsou velké předtrénované modely, které slouží jako univerzální základ pro širokou škálu úloh. Většina AI nástrojů je na některém z těchto modelů postavena a jejich chování se řídí především promptem a kontextem.

| Model / nástroj | K čemu slouží |
|-----------------|---------------|
| ChatGPT (OpenAI) | Univerzální konverzační model pro psaní textů, analýzy, brainstorming a kódování. |
| Gemini (Google) | Multimodální model integrovaný do ekosystému Google (text, obrázky, dokumenty). |
| Claude (Anthropic) | Práce s delšími texty, analýza dokumentů, technické a strukturované psaní. |
| Le Chat (Mistral AI) | Chatové rozhraní nad modely Mistral, obecná práce s textem. |
| Microsoft Copilot | AI asistent integrovaný do produktů Microsoft (Office, Windows, GitHub). |
| LLaMA (Meta) | Základ pro řadu open-source a výzkumných modelů. |

---

## 2️⃣ Open-source modely a ekosystém

Open-source modely lze **stáhnout a provozovat lokálně nebo na vlastním serveru**. Umožňují větší kontrolu nad daty, ale jejich použití je omezeno výkonem dostupného hardware.

| Model / platforma | K čemu slouží |
|-------------------|---------------|
| Hugging Face | Repozitář a komunita open-source modelů (text, obraz, audio, multimodální). |
| Mistral (open-source modely) | Menší a střední jazykové modely vhodné pro vlastní nasazení. |
| Gemma (Google) | Open-source modely optimalizované pro lokální i cloudové použití. |
| LLaMA-based modely | Komunitní modely odvozené z architektury Meta LLaMA. |

---

## 3️⃣ Rešerše a práce s dokumenty

Nástroje určené pro **vyhledávání, shrnování a práci s odbornými nebo interními dokumenty**. Často využívají principy RAG.

| Nástroj | K čemu slouží |
|--------|---------------|
| NotebookLM (Google) | Práce s vlastními dokumenty, dotazy nad texty, shrnutí (ukázka RAG). |
| Elicit | Podpora literárních rešerší a strukturované shrnutí odborných zdrojů. |
| Perplexity AI | Vyhledávání odpovědí s odkazy na zdroje („answer engine“). |
| Scite | Práce s citacemi a jejich kontextem ve vědecké literatuře. |
| Consensus | Vyhledávání odpovědí ve vědeckých studiích. |

---

## 4️⃣ Specializované nástroje pro práci s textem

Nástroje zaměřené na **konkrétní jazykové úlohy**, často jednodušší a účelovější než obecné modely.

| Nástroj | K čemu slouží |
|--------|---------------|
| DeepL | Kontextové překlady mezi jazyky. |
| QuillBot | Parafrázování a změna stylu textu. |
| Grammarly | Kontrola gramatiky, stylistiky a tónu textu. |

---

## 5️⃣ Přepis audia a práce se zvukem

| Nástroj / model | K čemu slouží |
|-----------------|---------------|
| Whisper (OpenAI) | Přepis řeči do textu, vícejazyčná transkripce. |
| ElevenLabs (TTS) | Generování realistického hlasu z textu. |

---

## 6️⃣ Generátory obrazových a audiovizuálních výstupů

| Nástroj | K čemu slouží |
|--------|---------------|
| DALL·E | Generování obrázků z textu. |
| Midjourney | Umělecké a stylizované generování obrazů. |
| Stable Diffusion | Open-source generování obrazů. |
| Runway | Generování a editace videí pomocí AI. |
| Synthesia | Generování videí s virtuálními avatary. |

---

## 7️⃣ Programování a vývoj software (sjednocená tabulka)

Tato tabulka zahrnuje **obecné modely, IDE/editory, CLI nástroje i platformy** používané při vývoji software a AI aplikací.

| Nástroj / model | Typ | K čemu slouží |
|-----------------|-----|---------------|
| ChatGPT (OpenAI) | Web / API | Vysvětlování kódu, návrh řešení, debugging. |
| Claude (Anthropic) | Web / API | Analýza větších kódových základen, refaktoring. |
| Gemini (Google) | Web / API | Generování kódu, integrace s Google ekosystémem. |
| GitHub Copilot | IDE plugin | Automatické doplňování kódu v editoru. |
| Cursor | AI-first editor | Editor kódu s vestavěným AI asistentem. |
| Claude Code | IDE / CLI | Asistent pro programování a práci s projektem. |
| OpenAI Codex | Model / CLI | Generování kódu z přirozeného jazyka. |
| Tabnine | IDE plugin | Kontextové doplňování kódu. |
| Qodo | CI / review | Automatická kontrola kvality kódu. |
| Aider | CLI | Terminálový AI asistent pracující s repozitářem. |
| Gemini CLI | CLI | AI asistent v terminálu (Google). |
| AIChat | CLI | Chatové rozhraní v terminálu pro různé AI backendy. |
| Warp (AI Terminal) | Terminál | Terminál s integrovanou AI asistencí. |
| Google AI Studio | Platforma | Vývoj a testování AI-based aplikací. |
| Firebase Studio | Cloud IDE | Online vývojové prostředí s AI asistencí. |

---

## 8️⃣ Vývoj aplikací a AI platformy (Google)

| Nástroj | K čemu slouží |
|--------|---------------|
| Google AI Studio | Experimentování s modely a tvorba AI aplikací. |
| Gemini Developer API | Integrace modelů Gemini do vlastních aplikací. |
| Dialogflow | Vývoj chatbotů a konverzačních rozhraní. |
| Flutter | Cross-platform vývoj aplikací (lze kombinovat s AI). |
| NotebookLM | Praktická ukázka RAG nad dokumenty. |

---

### Jak přehled používat
- **Foundation models** → obecná práce, psaní, analýzy  
- **Open-source modely** → vlastní provoz, kontrola nad daty  
- **Specializované nástroje** → konkrétní úlohy (překlad, rešerše)  
- **Programování** → asistence při vývoji a automatizaci  
- **RAG nástroje** → práce s dokumenty a znalostmi
