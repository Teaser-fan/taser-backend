import Router from 'koa-router';
import { createCategory, getCategories, getCategoryById, removeCategory, updateCategory } from '../controllers/categories';
import passport from '../passport';

const router: Router = new Router();

router.get('/', getCategories);

router.post('/', passport.authenticate('jwt', { session: false }), createCategory);

router.get('/:id', getCategoryById);

router.patch('/:id', passport.authenticate('jwt', { session: false }), updateCategory);

router.delete('/:id', passport.authenticate('jwt', { session: false }), removeCategory);

export const categoriesRouter = router.routes();
