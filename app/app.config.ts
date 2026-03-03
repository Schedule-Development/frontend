export default defineAppConfig({
  ui: {
    // Definimos blue como primária e stone como base no NuxtUI (e vamos sobrescrever o blue pelo seu azul no CSS)
    primary: 'blue',
    gray: 'stone',

    button: {
      default: {
        rounded: 'rounded-lg'
      }
    },
    card: {
      background: 'bg-brand-surface',
      ring: 'ring-1 ring-brand-surface',
      shadow: 'shadow-sm hover:shadow-md transition-shadow duration-300'
    }
  }
})
