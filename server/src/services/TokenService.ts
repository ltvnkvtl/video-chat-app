import Token from '../models/token';
import * as jwt from 'jsonwebtoken';
import { GeneratedTokens } from '../models/iToken';
import { UserDto } from '../dto/UserDto';

class TokenService {
    generateTokens(payload: UserDto): GeneratedTokens {
        const accessToken = jwt.sign(payload, `${process.env.JWT_ACCESS_SECRET}`, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, `${process.env.JWT_REFRESH_SECRET}`, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }

    validateAccessToken(accessToken: string) {
        try {
            return jwt.verify(accessToken, `${process.env.JWT_ACCESS_SECRET}`);
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(refreshToken: string) {
        try {
            return jwt.verify(refreshToken, `${process.env.JWT_REFRESH_SECRET}`);
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await Token.findOne({ user: userId });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        return await Token.create({ user: userId, refreshToken });
    }

    async removeToken(refreshToken: string) {
        return await Token.deleteOne({ refreshToken });
    }

    async findToken(refreshToken: string) {
        return await Token.findOne({ refreshToken });
    }
}

export default new TokenService();
