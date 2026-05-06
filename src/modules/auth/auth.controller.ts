import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { IdentityValidationPipe } from '../../common/pipes/identity-validation.pipe.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
        
    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto)
    }

    @Post('login')
    @UsePipes(IdentityValidationPipe)
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user:any) {
        return user;
    }
    
    @Post('forgot-password')
    @UsePipes(IdentityValidationPipe)
    forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto)
    }

    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto)
    }
    
}
