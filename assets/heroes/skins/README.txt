Hero non-base skin sprite sheets live here.

Base hero skins do not use this folder. They keep using the existing paths in SPRITE_SHEETS.
Every non-base hero skin has its own explicit path in SKIN_SPRITE_SHEETS in js/data.js.

Use the same 6-frame horizontal sheet format as the base sprites:
idle, windup, attack, block, hit, downed.

Hero sheet paths:
- knight-royal-vanguard-sheet.png
- crimson-champion-sheet.png
- knight-golden-oath-sheet.png
- rogue-verdant-shade-sheet.png
- rogue-crimson-ghost-sheet.png
- rogue-gilded-contract-sheet.png
- wizard-astral-scholar-sheet.png
- wizard-starfire-magus-sheet.png
- wizard-auric-arcana-sheet.png

Until a PNG exists, the game falls back to the base sprite sheet and applies the skin filter.
