require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const authentications = require('./api/authentications');
const notes = require('./api/notes');
const users = require('./api/users');
const AuthenticationsService = require('./service/postgres/AuthenticationsService');
const NotesService = require('./service/postgres/NotesService');
const UsersService = require('./service/postgres/UsersService');
const NotesValidator = require('./validator/notes');
const UsersValidator = require('./validator/users');
const tokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
const CollaborationsService = require('./service/postgres/CollaborationsService');
const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');
const _exports = require('./api/exports');
const ProducersService = require('./service/rabbitmq/ProducersService');
const ExportsValidator = require('./validator/exports');
const uploads = require('./api/uploads');
const StorageService = require('./service/S3/StorageService');
const UploadsValidator = require('./validator/uploads');
const CacheService = require('./service/redis/CacheService');

const init = async () => {
  // using local file static
  // const storagesService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  // using S3
  const storagesService = new StorageService();

  // cache
  const cacheService = new CacheService();

  const collaborationsService = new CollaborationsService(cacheService);
  const notesService = new NotesService(collaborationsService, cacheService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register externals plugin
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // register stragey auth
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducersService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storagesService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
