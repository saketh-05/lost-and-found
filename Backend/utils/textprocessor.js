const natural = require("natural");
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

const computeTextSimilarity = (text1, text2) => {
  tfidf.addDocument(text1);
  tfidf.addDocument(text2);
  return tfidf.tfidfs[0][1] || 0;
};

module.exports = { computeTextSimilarity };
