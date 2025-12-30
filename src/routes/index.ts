import hardcoverController from '@controllers/hardcover';
import { Router } from 'express';

const routes: Router = Router();

routes.use('/:method', hardcoverController.handler);

export default routes;