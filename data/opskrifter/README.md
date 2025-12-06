# Sådan tilføjer du en ny opskrift

Det er super nemt at tilføje en ny opskrift! Følg disse trin:

## 1. Opret en ny JSON fil

Opret en ny fil i `data/opskrifter/` mappen. Filen skal hedde et unikt nummer (f.eks. `7.json`, `8.json`, osv.)

## 2. Brug denne skabelon

Kopier denne skabelon og udfyld den:

```json
{
  "id": "7",
  "title": "Dit opskrift navn",
  "description": "En kort beskrivelse af opskriften",
  "time": "30",
  "difficulty": "Nem",
  "category": "Aftensmad",
  "servings": "4",
  "tags": ["Tag1", "Tag2"],
  "ingredients": [
    "Ingrediens 1",
    "Ingrediens 2",
    "Ingrediens 3"
  ],
  "steps": [
    {
      "title": "Trin 1 titel",
      "text": "Beskrivelse af hvad man skal gøre i dette trin"
    },
    {
      "title": "Trin 2 titel",
      "text": "Beskrivelse af næste trin"
    }
  ]
}
```

## 3. Feltbeskrivelser

- **id**: Et unikt nummer (som matcher filnavnet)
- **title**: Navnet på opskriften
- **description**: En kort beskrivelse
- **time**: Tilberedningstid i minutter (som tal, f.eks. "30")
- **difficulty**: Sværhedsgrad ("Meget nem", "Nem", "Mellem", "Svær")
- **category**: Kategori ("Morgenmad", "Frokost", "Aftensmad", "Dessert", "Snack", "Drikkevarer")
- **servings**: Antal personer
- **tags**: Et array af tags (valgfrit)
- **ingredients**: Et array af ingredienser
- **steps**: Et array af trin, hvor hvert trin har en "title" og "text"

## 4. Eksempel

Se eksisterende opskrifter i `data/opskrifter/` mappen for inspiration!

## Tips

- Brug altid unikke ID'er
- Sørg for at JSON'en er gyldig (brug en JSON validator hvis du er i tvivl)
- Opskriften vil automatisk blive vist på opskriftssiden efter du har gemt filen

