export type IUser = {
  id: string;
  roles: string[];
  email: string;
  isActivated: boolean;
  userName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
};
