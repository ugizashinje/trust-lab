/**
 * vue-i18n plural rules backed by the browser's Intl.PluralRules.
 *
 * A plural message lists its forms separated by `|`, in this order:
 *   en, fr:  one | other               "{n} pt | {n} pts"
 *   sr:      one | few | other         "{n} поен | {n} поена | {n} поена"
 *
 * Note that French treats 0 as singular ("0 point"), unlike English.
 */
const CATEGORY_ORDER: Record<string, Intl.LDMLPluralRule[]> = {
  en: ['one', 'other'],
  fr: ['one', 'other'],
  sr: ['one', 'few', 'other'],
}

export function createPluralRule(lang: keyof typeof CATEGORY_ORDER) {
  const rules = new Intl.PluralRules(lang)
  const order = CATEGORY_ORDER[lang]!
  return (choice: number, choicesLength: number): number => {
    const category = rules.select(Math.abs(choice))
    const index = order.indexOf(category)
    const resolved = index === -1 ? order.length - 1 : index
    return Math.min(resolved, choicesLength - 1)
  }
}
