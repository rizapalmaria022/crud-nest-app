import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthenticationDto } from './dto/authentication.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';


@Injectable()
export class AuthService {
    constructor(
      private prismaService: PrismaService,
      private jwtService: JwtService
    ) {}

  // login user
  async login(authDto: AuthenticationDto, req: Request, res: Response) {
    const {email, password} = authDto;
    
    // checking if email is valid
    const user = await this.prismaService.user.findFirst({
      where: {
        email
      },
    });

    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }

    const isPasswordMatch = await this.comparePasswords({
      password,
      hash: user.password,
    });

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    const token = await this.signToken({
      userId: user.id,
      username: user.username,
    });

    if (!token) {
      throw new ForbiddenException('Could not signin');
    }

    res.cookie('token', token, {});

    return res.status(200).send({ message: 'Sign in succefully' , token});

  }

  async logout(req: Request, res: Response) {
    res.clearCookie('token');

    
    return { status: "success", message: 'Logout'};
  }

  async comparePasswords(args: { hash: string; password: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { userId: number; username: string }) {
    const payload = {
      sub: args.userId,
      username: args.username,
    };

    const token = await this.jwtService.signAsync(payload);

    return token;
  }
}
