# Skill Sprites

Place custom skill activation sprites in this folder, then register them in
`SKILL_SPRITE_SHEETS` inside `js/data.js`.

Each skill can have a `base` sprite and optional skin-specific overrides:

```js
knight_heavy_attack: {
  base: "assets/skills/knight_heavy_attack.png",
  skins: {
    crimson_champion: "assets/skills/knight_heavy_attack_crimson_champion.png"
  }
}
```

If no sprite is registered, Crownfall uses the existing text/particle effect.
