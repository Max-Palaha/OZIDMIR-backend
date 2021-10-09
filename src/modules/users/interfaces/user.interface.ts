export type IUser = {
  id: string;
  roles: string[];
  email: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
};
