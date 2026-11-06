// Serbian Cyrillic → Latin transliteration (deterministic, one-way).
// Latin → Cyrillic is ambiguous ("nj" can be њ or н+ј), which is why
// sr-Cyrl.json is the only hand-edited Serbian file.

const MAP = {
  А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Ђ: 'Đ', Е: 'E', Ж: 'Ž', З: 'Z', И: 'I',
  Ј: 'J', К: 'K', Л: 'L', Љ: 'Lj', М: 'M', Н: 'N', Њ: 'Nj', О: 'O', П: 'P', Р: 'R',
  С: 'S', Т: 'T', Ћ: 'Ć', У: 'U', Ф: 'F', Х: 'H', Ц: 'C', Ч: 'Č', Џ: 'Dž', Ш: 'Š',
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z', и: 'i',
  ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'č', џ: 'dž', ш: 'š',
}

const DIGRAPHS = { Љ: 'LJ', Њ: 'NJ', Џ: 'DŽ' }
const isUpper = (ch) => ch !== undefined && ch !== ch.toLowerCase()

/** Transliterates a string. `{placeholders}` are left untouched. */
export function toLatin(text) {
  const chars = [...text]
  let out = ''
  let inPlaceholder = false
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    if (ch === '{') inPlaceholder = true
    if (ch === '}') inPlaceholder = false
    if (inPlaceholder || !(ch in MAP)) {
      out += ch
      continue
    }
    // ЉУБАВ → LJUBAV, but Љубав → Ljubav
    if (ch in DIGRAPHS && (isUpper(chars[i + 1]) || isUpper(chars[i - 1]))) {
      out += DIGRAPHS[ch]
    } else {
      out += MAP[ch]
    }
  }
  return out
}

/** Deep-transliterates every string leaf of a messages object. */
export function toLatinMessages(value) {
  if (typeof value === 'string') return toLatin(value)
  if (Array.isArray(value)) return value.map(toLatinMessages)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toLatinMessages(v)]))
  }
  return value
}
