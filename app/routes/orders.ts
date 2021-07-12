import Router from 'koa-router';
import { createOrder, getOrderById, getOrders, removeOrder, updateOrder } from '../controllers/orders';

const router: Router = new Router();

router.get('/', getOrders);

router.post('/', createOrder);

router.get('/:id', getOrderById);

router.patch('/:id', updateOrder);

router.delete('/:id', removeOrder);

export const ordersRouter = router.routes();
