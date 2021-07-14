import Router from 'koa-router';
import {
  createUser,
  createVendor,
  loginUser,
  resetPassword,
  updatePassword,
} from '../controllers/user';
const router: Router = new Router();

router.post('/register/customer', createUser);
router.post('/register/vendor', createVendor);
router.post('/login', loginUser);
router.get('/reset-password', resetPassword);
router.patch('/update-password', updatePassword);

export const authRouter = router.routes();
