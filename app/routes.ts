import Router from 'koa-router';
const router = new Router();

router.prefix('/api/v1');

/**
 * Base route, return a 401
 */
router.get('/', async ctx => ctx.status = 401);

/**
 * Basic healthcheck
 */
router.get('/healthcheck', async ctx => ctx.body = 'OK');

export const routes = router.routes();
