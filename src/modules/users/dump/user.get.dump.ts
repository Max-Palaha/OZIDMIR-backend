import { IUser } from '../interfaces';
import { UserDocument } from '../schemas/user.schema';

export default (user: UserDocument): IUser => {
  return {
    id: user._id.toString(),
    roles: user.roles.map((role) => role.value),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
};
