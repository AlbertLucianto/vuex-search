import { indicesOf, mergeRange } from '@/utils';

export default function highlightChunks(text, queries) {
  const matches = [];

  queries.forEach((query) => {
    matches.push(...indicesOf(query, text));
  });

  const highlights = mergeRange(matches);

  const chunks = [];
  let lastEnd = 0;

  highlights.forEach(([start, end]) => {
    chunks.push({
      isHighlighted: false,
      text: text.slice(lastEnd, start),
    });
    chunks.push({
      isHighlighted: true,
      text: text.slice(start, end),
    });

    lastEnd = end;
  });

  chunks.push({
    isHighlighted: false,
    text: text.slice(lastEnd),
  });

  return chunks;
}
