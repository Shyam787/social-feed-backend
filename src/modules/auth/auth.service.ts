import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt'
import { PrismaService } from '../../database/prisma/prisma.service.js';
import jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService, 
    ) {}

    async signup(dto: SignupDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
            username: dto.username,
            email: dto.email,
            password: hashedPassword,
            },
        })

        return {
            message: 'User created successfully',
            userId: user.id,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findFirst({
            where: dto.email
                ? {email: dto.email}
                : {username: dto.username}
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password
        )

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email
        })
        
        return {
            message: 'Login successful',
            accessToken: token,
        };
    }

    forgotPassword(dto: ForgotPasswordDto) {
        return { message: 'Reset email sent', data: dto };
    }

    resetPassword(dto: ResetPasswordDto) {
        return { message: 'Password reset successful', data: dto };
    }

}
