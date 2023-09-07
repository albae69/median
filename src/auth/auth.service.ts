import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // step 1 : fetch user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // if no user, throw an error
    if (!user) {
      throw new NotFoundException(`No user found with email: ${email}`);
    }

    // step 2 : check if the password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);

    // if password doesn't match, throw an error
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    // step 3 : generate a jwt containing the user id and return it
    return { accessToken: this.jwtService.sign({ userId: user.id }) };
  }
}
