Area asset hooks live in js/data.js inside BIOME_THEMES.

The main map background is controlled by:

MAP_BACKGROUND_IMAGE = "assets/areas/map-background.png"

For each story area, you can set:

mapBackgroundImage: "assets/areas/beach/map.png"

backgroundImage: "assets/areas/beach/background.png"

spriteSheets: {
  enemies: {
    goblin: "assets/areas/beach/goblin-sheet.png",
    bandit: "assets/areas/beach/bandit-sheet.png"
  }
}

Enemy sprite sheets use the same 6-frame layout as the normal enemy sheets.
Leave a path blank or omit an enemy id to use the default sprite.
