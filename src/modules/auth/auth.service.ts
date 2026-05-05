import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
    signup(dto: SignupDto){
        console.log('Signup Data: ', dto)

        return {
            message: 'Signup successful (dummy response)',
            data: dto
        };

    }

}
