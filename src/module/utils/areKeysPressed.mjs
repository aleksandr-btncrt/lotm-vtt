export default function areKeysPressed(event, action) {
  if ( !event ) return false;
  const activeModifiers = {};
  const addModifiers = (key, pressed) => {
    activeModifiers[key] = pressed;
    MODIFIER_CODES[key].forEach(n => activeModifiers[n] = pressed);
  };
  addModifiers(MODIFIER_KEYS.ALT, event.altKey);
  addModifiers(MODIFIER_KEYS.CONTROL, event.ctrlKey);
  addModifiers("Meta", event.metaKey);
  addModifiers(MODIFIER_KEYS.SHIFT, event.shiftKey);
  return game.keybindings.get("dnd5e", action).some(b => {
    if ( game.keyboard.downKeys.has(b.key) && b.modifiers.every(m => activeModifiers[m]) ) return true;
    if ( b.modifiers.length ) return false;
    return activeModifiers[b.key];
  });
}