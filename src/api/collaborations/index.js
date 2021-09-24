const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: (server, { collaborationService, noteService, validator }) => {
    const collaborationHandler = new CollaborationsHandler(
      collaborationService,
      noteService,
      validator
    );

    server.route(routes(collaborationHandler));
  },
};
