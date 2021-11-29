import DBInit from './init/Database';
import express from 'express';
import router from './route/RepoRoute';
import Logger from './util/Logger';
import ExpressPinoLogger from 'express-pino-logger';

Logger.debug('Initializing server...');

const PORT = 3000;

const app = express();

app.use(
  ExpressPinoLogger({
      logger: Logger.logger,
  })
);

app.use(express.json());

DBInit.start();

app.use(router);

app.listen(PORT, ()=> {
  Logger.info(`LibQuality API is running on http://localhost:${PORT}`);
})

export { app };