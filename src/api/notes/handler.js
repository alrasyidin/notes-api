const ClientError = require("../../exceptions/ClientError");

class NotesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    postNoteHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);

            const { title = 'untitled', body, tags } = request.payload;

            const noteId = this._service.addNote({ title, body, tags });

            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId
                }
            });

            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });

                response.code(error.statusCode);
                return response;
            }

            //SERVER ERROR
            const response = h.response({
                status: 'fail',
                message: 'Maaf terjadi kesalahan pada server kami'
            });

            console.error(error);
            response.code(500);
            return response;
        }
    }

    getNotesHandler() {
        try {
            const notes = this._service.getNotes();

            return {
                status: 'success',
                data: {
                    notes
                }
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });

                response.code(error.statusCode);
                return response;
            }

            //SERVER ERROR
            const response = h.response({
                status: 'fail',
                message: 'Maaf terjadi kesalahan pada server kami'
            });

            console.error(error)

            response.code(500);
            return response;
        }
    }

    getNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;

            const note = this._service.getNote(id);

            return {
                status: 'success',
                data: {
                    note
                }
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });

                response.code(error.statusCode);
                return response;
            }

            //SERVER ERROR
            const response = h.response({
                status: 'fail',
                message: 'Maaf terjadi kesalahan pada server kami'
            });
            console.error(error)

            response.code(500);
            return response;
        }
    }

    putNoteByIdHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);

            const { id } = request.params;
            const { title, body, tags } = request.payload;

            this._service.editNoteById(id, { title, body, tags });

            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui'
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });

                response.code(error.statusCode);
                return response;
            }

            //SERVER ERROR
            const response = h.response({
                status: 'fail',
                message: 'Maaf terjadi kesalahan pada server kami'
            });

            console.error(error);
            response.code(500);
            return response;
        }
    }

    deleteNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;

            this._service.deleteNoteById(id);

            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil dihapus'
            });


            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });

                response.code(error.statusCode);
                return response;
            }

            //SERVER ERROR
            const response = h.response({
                status: 'fail',
                message: 'Maaf terjadi kesalahan pada server kami'
            });
            console.error(error)
            response.code(500);
            return response;
        }
    }
}

module.exports = NotesHandler;