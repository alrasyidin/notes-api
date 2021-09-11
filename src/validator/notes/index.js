const { NotePayloadSchema } = require("./schema")


const NotesValidator = {
    validateNotePayload: paylod => {
        const validationResult = NotePayloadSchema.validate(payload);
        
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    }
}

module.exports = NotesValidator