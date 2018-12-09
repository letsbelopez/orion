export function searchByTerm(query) {
  const term = query.split(" ").join("+");
  console.log(term);

  return fetch(
    `https://itunes.apple.com/search?term=${term}&media=music&limit=10`
  );
}

export function createiTunesLink(link) {
  return `${link.replace("https", "itunes")}&app=itunes`;
}
