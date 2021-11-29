import { Router } from 'express';
import path from 'path';
import RepoController from '../controller/RepoController';
import SearchLogController from '../controller/SearchLogController';
import SwaggerUI from 'swagger-ui-express';
import YamlJS from 'yamljs';
import Logger from '../util/Logger';

const router = Router();

router.use('/docs', SwaggerUI.serve);
router.get('/docs', SwaggerUI.setup(YamlJS.load(`${path.resolve(__dirname, '../../')}/swagger.yaml`)));
Logger.debug('Swagger route running on /docs');

router.get('/', RepoController.index);
router.get('/list', SearchLogController.listSearches);
router.get('/search', RepoController.getRepoQuality);
Logger.debug('LibQuality routes running on /, /list and /search');

export default router;