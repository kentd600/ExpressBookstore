const bookProperties = {
    isbn: { type: 'integer' },
    amazon_url: { type: 'string', format: 'uri' },
    author: { type: 'string' },
    language: { type: 'string' },
    pages: { type: 'integer' },
    publisher: { type: 'string' },
    title: { type: 'string' },
    year: { type: 'integer' }
}

const postSchema = {
  type: 'object',
  properties: bookProperties,
  required: [
    'isbn',
    'author',
    'language',
    'pages',
    'publisher',
    'title',
    'year'
  ],
  additionalProperties: false
};

const putSchema = {
  type: 'object',
  properties: bookProperties,
  additionalProperties: false
}

module.exports = { postSchema, putSchema };