const InvariantError = require('../../exceptions/InvariantError');
const { ExportsValidatorSchema } = require('./schema');

const ExportsValidator = {
  validateExportNotesPayload: (payload) => {
    const validation = ExportsValidatorSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  },
};

module.exports = ExportsValidator;
