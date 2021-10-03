const ImageHeadersSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validation = ImageHeadersSchema.validate(headers);

    if (validation.error) {
      throw InvariantError(validation.error.message);
    }
  },
};

module.exports = UploadsValidator;
