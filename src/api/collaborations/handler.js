const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationService, noteService, validator) {
    this._collaborationService = collaborationService;
    this._noteService = noteService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.valdateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { userId, noteId } = request.payload;

      await this._noteService.verifyNoteOwner(noteId, credentialId);

      const collaborationId = await this._collaborationService.addCollaborator(noteId, userId);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // SERVER ERROR
      const response = h.response({
        status: 'fail',
        message: 'Maaf terjadi kesalahan pada server kami',
      });
      console.error(error);
      response.code(500);
      return response;
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.valdateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { userId, noteId } = request.payload;

      await this._noteService.verifyNoteOwner(noteId, credentialId);

      await this._collaborationService.deleteCollaborator(noteId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // SERVER ERROR
      const response = h.response({
        status: 'fail',
        message: 'Maaf terjadi kesalahan pada server kami',
      });
      console.error(error);
      response.code(500);
      return response;
    }
  }
}

module.exports = CollaborationsHandler;
