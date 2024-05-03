import MarkdownIt from "markdown-it";
import StateInline from "markdown-it/lib/rules_inline/state_inline";

function matchIt(state: StateInline) {
  const delimiters = state.delimiters;
  const len = delimiters.length;

  const unpairs = [];
  for (let i = 0; i < len; i++) {
    const item = delimiters[i];
    if (item.marker !== 0x2a /* * */) {
      continue;
    }

    if (!unpairs.length) {
      for (let j = 0; j < item.length; j++) {
        const next = j + i;
        if (delimiters[next].marker === item.marker) {
          unpairs.push(next);
          delimiters[next].open = true;
        }
      }
      i += item.length - 1;
      continue;
    }

    const last = unpairs[unpairs.length - 1];
    if (last === undefined) {
      continue;
    }
    // If the previous delimiter has the same marker and is adjacent to this one,
    // merge those into one strong delimiter.
    if (item.close && delimiters[last].marker === item.marker) {
      unpairs.pop();
      continue;
    }

    if (!item.close) {
      const prevToken = state.tokens[item.token - 1];
      const lastChar = prevToken.content.slice(-1);
      if (lastChar !== " " && lastChar !== "\n") {
        item.close = true;
        unpairs.pop();
        continue;
      } else {
        unpairs.push(i);
      }
    }
  }
  return true;
}

export function matchPairs(md: MarkdownIt) {
  md.inline.ruler2.before("balance_pairs", "fix_emphasis", matchIt);
}
