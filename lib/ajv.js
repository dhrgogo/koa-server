const Ajv = require('ajv')

const ajv = new Ajv({allErrors: true, jsonPoints: true, coerceTypes: true,  useDefaults: true, removeAdditional: true })

require('ajv-errors')(ajv)
require('ajv-keywords')(ajv)

module.exports = ajv