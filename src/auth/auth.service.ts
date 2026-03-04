import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { SigninDto } from './dto/signin.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async signup(dto: SignupDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                role: dto.role,
            },
        });

        return this.generateToken(user.id, user.email, user.role);
    }

    async signin(dto: SigninDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user.id, user.email, user.role);
    }

    async validateGoogleUser(googleUser: {
        googleId: string;
        email: string;
        name: string;
    }) {
        let user = await this.prisma.user.findUnique({
            where: { googleId: googleUser.googleId },
        });

        if (!user) {
            user = await this.prisma.user.findUnique({
                where: { email: googleUser.email },
            });

            if (user) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: googleUser.googleId },
                });
            } else {
                user = await this.prisma.user.create({
                    data: {
                        email: googleUser.email,
                        name: googleUser.name,
                        googleId: googleUser.googleId,
                    },
                });
            }
        }

        return this.generateToken(user.id, user.email, user.role);
    }

    async getProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const { password, ...result } = user;
        return result;
    }

    private generateToken(userId: number, email: string, role: string) {
        const payload = { sub: userId, email, role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
