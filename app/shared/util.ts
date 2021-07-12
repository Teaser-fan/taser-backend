import { isValidObjectId } from 'mongoose';
import bcrypt from 'bcrypt';

export function isValidMongoId(id: string): boolean {
  return isValidObjectId(id);
}

export function encryptPassword(password: string): string {
  const encryptedPassword: string = bcrypt.hashSync(password, 10);
  return encryptedPassword;
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
