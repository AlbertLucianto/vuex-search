export default function indicesOf(searchStr, str, caseSensitive = false) {
  const searchStrLen = searchStr.length;

  if (searchStrLen === 0) {
    return [];
  }

  const indices = [];

  let strCpy = str;
  let searchStrCpy = searchStr;
  if (!caseSensitive) {
    strCpy = str.toLowerCase();
    searchStrCpy = searchStr.toLowerCase();
  }

  let lastIndex = 0;
  let index = strCpy.indexOf(searchStrCpy, lastIndex);
  while (index > -1) {
    lastIndex = index + searchStrLen;
    indices.push([index, lastIndex]);

    index = strCpy.indexOf(searchStrCpy, lastIndex);
  }

  return indices;
}
