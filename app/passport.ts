import passport from 'koa-passport';
import {
  Strategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';
import { fetchUserById } from './services/user';
import { config } from './config';

async function verifyUser(payload: any, done: VerifiedCallback) {
  const user = await fetchUserById(payload._id);
  if (!user) {
    done(null, false);
  }

  done(null, user);
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.secret,
};

passport.use(new Strategy(opts, verifyUser));

export default passport;
