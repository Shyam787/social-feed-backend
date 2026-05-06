import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdentityValidationPipe implements PipeTransform {
  transform(value: any) {
    const { email, username } = value

    if (!email && !username) {
      throw new BadRequestException('Either email or username must be provided')
    }

    return value;
  }
}
