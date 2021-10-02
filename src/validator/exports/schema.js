const Joi = require('joi');

const ExportsValidatorSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = { ExportsValidatorSchema };
