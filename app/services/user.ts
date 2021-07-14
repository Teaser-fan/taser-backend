import { ErrorResponse } from '../dtos/error-response';
import { IUser, IUserDocument, UserModel } from '../models/user';
import { USER_MESSAGES } from '../shared/constants';
import { PaginateResult } from 'mongoose';
import { encryptPassword, comparePassword } from '../shared/util';
import { config } from '../config';
import jwt from 'jsonwebtoken';
import mailer from '../nodemailer';
import ejs from 'ejs';
import path from 'path';
import nanoid from 'nanoid';

export async function fetchUsers(
  limit: number,
  offset: number
): Promise<PaginateResult<IUserDocument>> {
  return UserModel.paginate(
    {},
    {
      lean: true,
      limit,
      offset,
      select: '-password -passwordResetToken -verificationToken',
    }
  );
}

export async function fetchUserById(userId: string): Promise<IUser> {
  const user: IUser = await UserModel.findById(userId)
    .select('-password -passwordResetToken -verificationToken')
    .where('isDeleted')
    .equals(false)
    .lean();

  if (!user) {
    throw new ErrorResponse(404, USER_MESSAGES.USER_NOT_FOUND);
  }

  return user;
}

export async function saveUser(user: IUser): Promise<void> {
  const userExists: boolean = await UserModel.exists({ email: user.email });

  if (userExists) {
    throw new ErrorResponse(400, USER_MESSAGES.USER_EXISTS);
  }

  user.password = encryptPassword(user.password);
  const newUser = new UserModel(user);
  await newUser.save();
  const token = nanoid.nanoid();
  const url = `${config.baseUrl}/verify-email?email=${user.email}&token=${token}`;
  const filePath = path.join(__dirname, '../templates/email-verification.ejs');
  const html = await ejs.renderFile(filePath, { url });
  await mailer.sendMail({
    to: user.email,
    from: config.mail.user,
    subject: 'Email Verification', // Subject line
    html: html, // html body
  });
  newUser.verificationToken = token;
  await newUser.save();
}

export async function editUser(
  userId: string,
  updatedUser: IUser
): Promise<void> {
  const user: IUserDocument = await UserModel.findById(userId);
  if (!user) {
    throw new ErrorResponse(404, USER_MESSAGES.USER_NOT_FOUND);
  }
  Object.assign(user, updatedUser);

  await user.save();
}

export async function deleteUser(userId: string): Promise<void> {
  const isExist: boolean = await UserModel.exists({
    _id: userId,
    isDeleted: false,
  });
  if (!isExist) {
    throw new ErrorResponse(404, USER_MESSAGES.USER_NOT_FOUND);
  }
  await UserModel.findByIdAndDelete(userId);
}

export async function authenticateUser(authPayload: any): Promise<any> {
  const { email, password } = authPayload;

  const user: IUser = await UserModel.findOne({ email: email })
    .select('-passwordResetToken -verificationToken')
    .where('isDeleted')
    .equals(false)
    .lean();

  if (!user) {
    throw new ErrorResponse(404, USER_MESSAGES.USER_NOT_FOUND);
  }

  if (!comparePassword(password, user.password)) {
    throw new ErrorResponse(401, USER_MESSAGES.INVALID_CREDENTIALS);
  }

  delete user.password;

  const token: string = jwt.sign(user, config.secret, { expiresIn: '1d' });

  return {
    user,
    token: `JWT ${token}`,
  };
}

export async function verifyEmail(payload: any): Promise<void> {
  const { email, token } = payload;

  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new ErrorResponse(404, USER_MESSAGES.USER_NOT_FOUND);
  }

  const isTokenValid =
    user.verificationToken && user.verificationToken === token;

  if (!isTokenValid) {
    throw new ErrorResponse(400, USER_MESSAGES.INVALID_VERIFICATION_TOKEN);
  }

  user.isVerified = true;
  await user.save();
}

export async function resetPasswordEmail(payload: any): Promise<void> {
  const { email } = payload;

  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new ErrorResponse(404, USER_MESSAGES.USER_NOT_FOUND);
  }

  const token = nanoid.nanoid();
  const url = `${config.baseUrl}/reset-password?email=${user.email}&token=${token}`;
  const filePath = path.join(__dirname, '../templates/reset-password.ejs');
  const html = await ejs.renderFile(filePath, { url });
  await mailer.sendMail({
    to: user.email,
    from: config.mail.user,
    subject: 'Reset Password', // Subject line
    html: html, // html body
  });
  user.passwordResetToken = token;
  await user.save();
}

export async function editPassword(payload: any): Promise<void> {
  const { email, token, oldPassword, newPassword } = payload;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new ErrorResponse(404, USER_MESSAGES.USER_NOT_FOUND);
  }

  const isTokenValid =
    user.passwordResetToken && user.passwordResetToken === token;

  if (!isTokenValid) {
    throw new ErrorResponse(400, USER_MESSAGES.INVALID_CREDENTIALS);
  }

  const isOldPasswordValid = comparePassword(oldPassword, user.password);

  if (!isOldPasswordValid) {
    throw new ErrorResponse(400, USER_MESSAGES.INVALID_CREDENTIALS);
  }

  user.password = encryptPassword(newPassword);
  user.passwordResetToken = null;
  await user.save();
}
