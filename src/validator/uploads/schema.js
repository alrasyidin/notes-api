const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.valid(
    'image/apng',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/avif',
    'image/gif',
    'image/webp'
  ).required(),
}).unknown();

module.exports = ImageHeadersSchema;
