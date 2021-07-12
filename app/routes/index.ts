import Router from 'koa-router';
import { categoriesRouter } from './categories';
import { ordersRouter } from './orders';
import { productsRouter } from './products';
import { usersRouter } from './user';
const router: Router = new Router();

router.prefix('/api/v1');

/**
 * Base route, return a 401
 */
router.get('/', async (ctx) => (ctx.status = 401));

/**
 * Basic healthcheck
 */
router.get('/healthcheck', async (ctx) => (ctx.body = 'OK'));

router.use('/products', productsRouter);

router.use('/categories', categoriesRouter);

router.use('/orders', ordersRouter);

router.use('/users', usersRouter);

export const routes = router.routes();
