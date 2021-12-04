import User from '../models/user';
import ApiError from '../exceptions/ApiErrors';
import { IUser } from '../models/iUser';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dto/UserDto';

class UserService {
    async getAllUsers() {
        return await User.find();
    }

    async getUserById(id: string) {
        const user = await User.findById(id);

        if (!user) {
            throw ApiError.NotFoundError('User not found');
        }

        return user;
    }

    async updateUser(user: Partial<IUser>) {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 3);
        }

        if (user.email) {
            const userByEmail = await User.findOne({ email: user.email });

            if (userByEmail) {
                throw ApiError.BadRequest(`user with email ${user.email} already exist`);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(user.id, user, { new: true });

        if (!updatedUser) {
            throw ApiError.NotFoundError('User not found');
        }

        return { ...new UserDto(updatedUser) };
    }

    async deleteUser(id: string) {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            throw ApiError.NotFoundError('User not found');
        }

        return { ...new UserDto(deletedUser) };
    }
}

export default new UserService();
