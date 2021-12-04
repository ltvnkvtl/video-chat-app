import { RoleType } from '../models/iUser';

export const isUserRole = (role: RoleType): boolean => {
    return role === RoleType.USER || role === RoleType.ADMIN;
};
