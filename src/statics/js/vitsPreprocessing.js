const pad = "_";
const punctuation = "।?!,;:—“”‘’'\".…- ";
const letters =
  "ঁংঃঅআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহািীুূৃেৈোৌ্ৎড়ঢ়য়‌‍";
const lettersIpa = "∂aiueoεðAIUEOЄιθμyYwkKgGNcCjzTтDΔtτdδnpfbvmsSlrRρH";

// Export all symbols:
const symbols = [pad, ...punctuation, ...letters, ...lettersIpa];

// Mappings from symbol to numeric ID and vice versa:
const symbolToId = symbols.reduce((acc, symbol, index) => {
  acc[symbol] = index;
  return acc;
}, {});

console.log("symbol to id is : ", symbolToId);

function intersperse(lst, item) {
  const result = Array(lst.length * 2 + 1).fill(item);
  for (let i = 1; i < result.length; i += 2) {
    const idx = Math.floor(i / 2);
    result[i] = lst[idx];
  }
  return result;
}

function textToSequence(cleanText) {
  const sequence = [];
  for (const symbol of cleanText) {
    const symbolId = symbolToId[symbol];
    sequence.push(symbolId);
  }
  return sequence;
}

export const getPhonemeID = (romanizedIpa, addBlank = true) => {
  let textNorm = textToSequence(romanizedIpa);
  if (addBlank) {
    textNorm = intersperse(textNorm, 0);
  }
  return textNorm;
};
