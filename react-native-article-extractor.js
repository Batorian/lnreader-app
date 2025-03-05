// Simple mock implementation of article-extractor
const extractFromHtml = async html => {
  return {
    title: 'Article Title',
    content: html || '<p>Article content</p>',
    excerpt: 'Article excerpt',
    author: 'Author',
    published: null,
    ttr: 1, // time to read in minutes
    language: 'en',
    image: null,
    source: '',
    links: [],
  };
};

const setSanitizeHtmlOptions = () => {};

module.exports = {
  extractFromHtml,
  setSanitizeHtmlOptions,
};
