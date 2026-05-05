import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authServie: AuthService) {}
        
    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authServie.signup(dto)
    }
    
}
