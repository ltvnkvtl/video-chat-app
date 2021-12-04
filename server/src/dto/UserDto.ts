import { IUser, RoleType } from '../models/iUser';

export class UserDto {
    id: string;
    email: string;
    role: RoleType;
    name?: string;

    constructor(model: IUser) {
        this.id = model._id;
        this.email = model.email;
        this.role = model.role || RoleType.USER;
        this.name = model.name;
    }
}
