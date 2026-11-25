/** Single quotes suppress expansion; double quotes group without suppressing. */
type Quote = '"' | "'" | null;

/** Whitespace outside quotes ends a word. */
const separates = (char: string, quote: Quote) => quote === null && /\s/.test(char);

/** A backslash escapes the next character, except inside single quotes. */
const escapes = (char: string, quote: Quote, line: string, i: number) =>
  char === "\\" && quote !== "'" && i + 1 < line.length;

/**
 * The quoting state after `char`, or `undefined` when `char` is not a quote
 * that applies here — a different quote inside a quote is a literal, which is
 * what keeps `"il a dit 'salut'"` one word.
 */
function nextQuote(char: string, quote: Quote): Quote | undefined {
  if (char !== '"' && char !== "'") return undefined;
  if (quote === null) return char;
  return quote === char ? null : undefined;
}

/**
 * The variable name after `$`, or `null` where `$` stands for itself. The
 * leading class stays spelled out rather than `\w`: a name may not start with
 * a digit, so `$1` is not a variable here.
 */
function variableAt(line: string, i: number, quote: Quote): string | null {
  if (line[i] !== "$" || quote === "'") return null;
  return /^(\?|[A-Za-z_]\w*)/.exec(line.slice(i + 1))?.[1] ?? null;
}

/** Appends the pending word unless nothing has been typed into it. */
function flush(words: string[], word: string, started: boolean): void {
  if (started) words.push(word);
}

/**
 * Splits a line into words: whitespace separates, quotes group, `$` expands
 * everywhere except inside single quotes.
 *
 * Checked against bash, including the greedy case — `a$USERb` reads a variable
 * named `USERb`. One deliberate divergence: bash re-splits an expansion's
 * result, so unquoted `$UNSET` yields no word; here it yields one empty word.
 * No command here counts its arguments, so it never surfaces.
 *
 * Each character class is a named predicate above rather than a branch here,
 * which keeps this loop one level deep.
 */
export function lex(line: string, expand: (name: string) => string): string[] {
  const words: string[] = [];
  let word = "";
  /** Distinguishes `""` from no argument at all. */
  let started = false;
  let quote: Quote = null;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (separates(char, quote)) {
      flush(words, word, started);
      word = "";
      started = false;
      continue;
    }

    // Anything that is not a separator begins a word, quote characters
    // included — that is what makes `""` an empty argument rather than none.
    started = true;

    const toggled = nextQuote(char, quote);
    if (toggled !== undefined) {
      quote = toggled;
      continue;
    }

    if (escapes(char, quote, line, i)) {
      i += 1;
      word += line[i];
      continue;
    }

    const name = variableAt(line, i, quote);
    if (name === null) {
      word += char;
      continue;
    }

    word += expand(name);
    i += name.length;
  }

  flush(words, word, started);
  return words;
}
