import Router from 'koa-router';
import { createOrder, getOrderById, getOrders, removeOrder, updateOrder } from '../controllers/orders';
import passport from '../passport';

const router: Router = new Router();

router.get('/', passport.authenticate('jwt', { session: false }), getOrders);

router.post('/', createOrder);

router.get('/:id', getOrderById);

router.patch('/:id', updateOrder);

router.delete('/:id', passport.authenticate('jwt', { session: false }), removeOrder);

export const ordersRouter = router.routes();
