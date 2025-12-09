# Anbefalinger til den Perfekte Opskriftsside 🎯

Baseret på analyse af jeres nuværende opskriftssider, her er mine anbefalinger til at skabe den perfekte brugeroplevelse:

## ✅ Hvad I Allerede Har (Godt Gjort!)

1. **Strukturerede Data (JSON-LD)** - Fuldstændig Recipe schema ✅
2. **SEO Metadata** - Title, description, keywords, Open Graph ✅
3. **Anmeldelsessystem** - Med ratings og reviews ✅
4. **Print/Download/Deling** - Funktioner tilgængelige ✅
5. **Næringsindhold** - Komplet nutrition information ✅
6. **Lignende opskrifter** - Relateret indhold ✅
7. **Breadcrumbs** - Navigation ✅
8. **Responsive design** - Mobile-friendly ✅

## 🚀 Anbefalinger til Forbedringer

### 1. **Visuelt Indhold (Højeste Prioritet)**

#### A. Hero Billede
- **Tilføj et stort, appetitligt hero-billede** af den færdige ret
- Billede skal være høj kvalitet (minimum 1200x800px)
- Placeret øverst på siden, før ingredienser og instruktioner
- Brug Next.js Image komponent for optimal performance
- Tilføj alt-text med opskriftens navn

**Implementering:**
```tsx
// I recipe page, tilføj efter title:
<div className="mt-8 relative aspect-[16/9] rounded-lg overflow-hidden">
  <Image
    src={`/images/recipes/${slug}-hero.jpg`}
    alt={recipe.title}
    fill
    className="object-cover"
    priority
  />
</div>
```

#### B. Step-by-Step Billeder (Valgfrit, Men Meget Værdifuldt)
- Tilføj billeder for hver vigtige step i fremgangsmåden
- Især for komplekse teknikker (f.eks. "fold æggehvide i dejen")
- Forbedrer forståelse og engagement betydeligt

### 2. **Brugeroplevelse (UX) Forbedringer**

#### A. Sticky Ingrediensliste
- Gør ingredienslisten sticky (fast position) når man scroller ned
- Brugeren kan altid se ingredienser mens de følger instruktioner
- Særligt vigtigt på desktop

**Implementering:**
```tsx
<div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
  {/* Ingredienser */}
</div>
```

#### B. Checkboxer til Ingredienser
- Tilføj checkboxes til hver ingrediens
- Brugeren kan markere ingredienser som de har samlet
- Forbedrer workflow i køkkenet

#### C. Timer Funktion
- Tilføj indbyggede timere for steps der kræver tid (f.eks. "lad simre i 15 min")
- Klik på tiden for at starte en timer
- Meget praktisk under tilberedning

#### D. Portionsjustering
- Tilføj en slider eller input til at justere portioner
- Automatisk opdatering af ingrediensmængder
- Standard: 4 personer, justerbar til 1-12 personer

### 3. **Indhold og Struktur**

#### A. Kort Opsummering (Recipe Summary Card)
- Tilføj en kort "quick facts" boks øverst:
  - ⏱️ Total tid
  - 👥 Antal portioner
  - 🔥 Sværhedsgrad
  - 🍽️ Kategori
  - ⭐ Rating (hvis tilgængelig)
- Gør det nemt at få overblik med det samme

#### B. FAQ Sektion
- Tilføj en FAQ sektion med ofte stillede spørgsmål
- F.eks. "Kan jeg erstatte X med Y?", "Hvor længe kan jeg gemme dette?"
- Forbedrer SEO og hjælper brugere

#### C. Tips og Tricks Sektion
- Flyt "PRO TIPS" til en mere fremtrædende position
- Vis de vigtigste tips først
- Kollapsible sektion for at undgå at fylde for meget

#### D. Variant Opskrifter
- Hvis der er variationer (f.eks. vegetarisk, glutenfri), link til dem
- "Prøv også: Vegansk version" eller "Glutenfri variant"

### 4. **Interaktivitet og Engagement**

#### A. Save/Favorite Funktion
- Tillad brugere at gemme opskrifter til "Mine opskrifter"
- Bruger localStorage eller brugerkonto
- Vis antal saves på opskriften

#### B. Cooking Mode
- Tilføj en "Kog-modus" knap
- Skjuler alt undtagen nuværende step
- Større tekst, nemmere at følge under kogning
- Frem/næste knapper til at navigere mellem steps

#### C. Video Tutorial (Fremtid)
- Hvis muligt, tilføj en kort video (30-60 sek) af den vigtigste teknik
- Embed YouTube eller Vimeo video
- Meget værdifuldt for komplekse opskrifter

### 5. **SEO og Performance**

#### A. Billeder med Structured Data
- Tilføj ImageObject schema til billeder
- Forbedrer rich results i Google

#### B. Video Schema (Hvis video tilføjes)
- Tilføj VideoObject schema hvis der er video

#### C. FAQ Schema
- Hvis FAQ tilføjes, brug FAQPage schema
- Kan give FAQ rich results i Google

#### D. Lazy Loading
- Lazy load lignende opskrifter sektion
- Forbedrer initial page load

### 6. **Social Sharing Forbedringer**

#### A. Custom Open Graph Billeder
- Opret custom Open Graph billeder for hver opskrift
- Inkluder opskriftens navn, tid, og rating
- Meget bedre deling på sociale medier

#### B. Share Preview
- Vis preview af hvordan deling ser ud
- Gør det nemmere at se hvad der deles

### 7. **Accessibility (Tilgængelighed)**

#### A. ARIA Labels
- Tilføj korrekte ARIA labels til alle interaktive elementer
- Forbedrer skærmlæser support

#### B. Keyboard Navigation
- Sikr at alle funktioner kan bruges med tastatur
- Vigtigt for tilgængelighed

#### C. High Contrast Mode
- Test og sikr god læsbarhed i high contrast mode
- Følg WCAG 2.1 AA standarder

### 8. **Mobile-Specifikke Forbedringer**

#### A. Swipe Navigation
- Tillad swipe mellem steps i cooking mode
- Bedre mobile UX

#### B. Voice Instructions (Fremtid)
- Text-to-speech for instruktioner
- Hænderne kan være beskidte i køkkenet

#### C. Larger Touch Targets
- Sikr at alle knapper er mindst 44x44px
- Bedre mobile usability

### 9. **Analytics og Tracking**

#### A. Recipe View Tracking
- Track hvilke opskrifter der ses mest
- Hjælper med at forstå brugerpræferencer

#### B. Conversion Tracking
- Track hvis brugeren starter at følge opskriften
- Track hvis de når til sidste step
- Mål engagement

#### C. Print/Download Tracking
- Track hvor ofte opskrifter printes/downloades
- Vigtig metrik for værdi

### 10. **Print Optimering**

#### A. Print Stylesheet Forbedringer
- Sikr at print-versionen er perfekt formateret
- Fjern navigation, ads, og unødvendige elementer
- Vis kun ingredienser og instruktioner
- Tilføj logo og URL i footer

## 📊 Prioritering af Anbefalinger

### Høj Prioritet (Implementer Først):
1. ✅ **Hero Billede** - Kritiskt for engagement
2. ✅ **Sticky Ingrediensliste** - Meget praktisk
3. ✅ **Checkboxer til Ingredienser** - Bedre workflow
4. ✅ **Portionsjustering** - Meget efterspurgt feature
5. ✅ **Recipe Summary Card** - Bedre overblik

### Medium Prioritet:
6. ⚠️ **Timer Funktion** - Praktisk men ikke kritisk
7. ⚠️ **Cooking Mode** - God UX forbedring
8. ⚠️ **Save/Favorite** - Forbedrer engagement
9. ⚠️ **FAQ Sektion** - SEO og brugerhjælp

### Lav Prioritet (Nice to Have):
10. 💡 **Step-by-Step Billeder** - Værdifuldt men tidskrævende
11. 💡 **Video Tutorial** - Fremtidig feature
12. 💡 **Custom OG Billeder** - Bedre social sharing
13. 💡 **Variant Links** - Hvis variationer eksisterer

## 🎨 Design Anbefalinger

### Farver og Typografi
- Brug høj kontrast mellem tekst og baggrund
- Brug større font-size for instruktioner (16px minimum)
- Brug farvekodning for sværhedsgrad (grøn=let, gul=medium, rød=svær)

### Spacing
- Giv god luft mellem sektioner
- Brug konsistent spacing (4px grid system)
- Maksimal linjelængde på 75-80 karakterer for bedre læsbarhed

### Icons
- Brug konsistente icons gennem siden
- Clock icon for tid
- Users icon for portioner
- Flame icon for sværhedsgrad

## 📱 Mobile-First Approach

- Design for mobile først, derefter desktop
- Touch-friendly knapper (minimum 44x44px)
- Swipe gestures hvor det giver mening
- Simplified navigation på mobile

## 🔍 SEO Best Practices (Allerede Godt, Men Kan Forbedres)

1. ✅ Structured data - Allerede perfekt
2. ⚠️ Tilføj FAQ schema hvis FAQ tilføjes
3. ⚠️ Tilføj ImageObject schema for billeder
4. ⚠️ Overvej VideoObject hvis video tilføjes
5. ✅ Meta tags - Allerede godt
6. ⚠️ Tilføj custom Open Graph billeder

## 💡 Eksempler fra Top Recipe Sites

### Hvad gør de bedste recipe sites?

1. **AllRecipes.com**
   - Store hero billeder
   - Portionsjustering
   - Save til favorites
   - Reviews og ratings fremme

2. **BBC Good Food**
   - Clean design
   - Step-by-step billeder
   - Timer funktion
   - Nutrition info fremme

3. **Tasty.co**
   - Video tutorials
   - Visual step-by-step
   - Cooking mode
   - Social sharing optimeret

## 🚀 Implementerings Roadmap

### Fase 1 (1-2 uger):
- Hero billede integration
- Sticky ingrediensliste
- Checkboxer til ingredienser
- Recipe summary card

### Fase 2 (2-3 uger):
- Portionsjustering
- Timer funktion
- Cooking mode
- Save/Favorite funktion

### Fase 3 (3-4 uger):
- FAQ sektion
- Variant links
- Custom OG billeder
- Print optimering

### Fase 4 (Fremtid):
- Step-by-step billeder
- Video tutorials
- Voice instructions
- Advanced analytics

## 📝 Noter

- Alle forbedringer skal testes på mobile og desktop
- Sikr at performance ikke påvirkes negativt
- Test med rigtige brugere for feedback
- Iterer baseret på analytics data

## ✅ Konklusion

Jeres opskriftssider er allerede meget godt struktureret med:
- ✅ Komplet SEO optimering
- ✅ Strukturerede data
- ✅ Reviews system
- ✅ Print/Download funktionalitet

De vigtigste forbedringer er:
1. **Visuelt indhold** (billeder) - Højeste prioritet
2. **Interaktive features** (checkboxes, timer, portionsjustering)
3. **Cooking mode** for bedre brugeroplevelse
4. **FAQ og tips** forbedret struktur

Med disse forbedringer vil I have en af de bedste opskriftssider i Danmark! 🎉
