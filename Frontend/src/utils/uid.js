export function uid(prefix = 'OME') {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${Date.now().toString().slice(-5)}`;
}
