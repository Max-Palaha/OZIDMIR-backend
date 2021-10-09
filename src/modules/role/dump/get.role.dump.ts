import { IRole } from '../interfaces';
import { RoleDocument } from '../schemas/role.schema';

export default (role: RoleDocument): IRole => {
  return {
    id: role._id.toString(),
    name: role.name,
    description: role.description,
  };
};
