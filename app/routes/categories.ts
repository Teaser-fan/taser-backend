import Router from 'koa-router';
import { createCategory, getCategories, getCategoryById, removeCategory, updateCategory } from '../controllers/categories';

const router: Router = new Router();

router.get('/', getCategories);

router.post('/', createCategory);

router.get('/:id', getCategoryById);

router.patch('/:id', updateCategory);

router.delete('/:id', removeCategory);

export const categoriesRouter = router.routes();
