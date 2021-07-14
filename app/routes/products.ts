import Router from 'koa-router';
import {
  createProduct,
  getProductById,
  getProducts,
  removeProduct,
  updateProduct,
  uploadImage,
} from '../controllers/products';
import passport from '../passport';

const router: Router = new Router();

router.get('/', getProducts);

router.post('/', passport.authenticate('jwt', { session: false }), createProduct);

router.get('/:id', getProductById);

router.patch('/:id', passport.authenticate('jwt', { session: false }), updateProduct);

router.delete('/:id', passport.authenticate('jwt', { session: false }), removeProduct);

router.get('/upload/image', passport.authenticate('jwt', { session: false }),uploadImage);

export const productsRouter = router.routes();
