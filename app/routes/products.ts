import Router from 'koa-router';
import {
  createProduct,
  getProductById,
  getProducts,
  removeProduct,
  updateProduct,
  uploadImage,
} from '../controllers/products';

const router: Router = new Router();

router.get('/', getProducts);

router.post('/', createProduct);

router.get('/:id', getProductById);

router.patch('/:id', updateProduct);

router.delete('/:id', removeProduct);

router.get('/upload/image', uploadImage);

export const productsRouter = router.routes();
