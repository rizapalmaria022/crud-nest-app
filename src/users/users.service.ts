import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto, UserUpdateDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    // user creation
    async registration(createUserDto: UserDto) {
        const { firstname, lastname, role, email, password, username } = createUserDto;
        // check if email is already exists
        const userExists = await this.prisma.user.findFirst({
            where: { email },
        });

        // if exists return 
        if (userExists) {
            throw new BadRequestException('Email already exists');
        }

        // hashing of password
        const hashedPassword = await this.hashPassword(password);
        // DB insert user
        await this.prisma.user.create({
            data: {
                firstname,
                lastname,
                role,
                email,
                username,
                password: hashedPassword
            },
        });

        return { status: "success", message: 'User created succefully'};
    }

    // Get user by id
    async getMyUser(id: number, req: Request) {
        // find by id
        const userDetail = await this.prisma.user.findFirst({ where: { id } });

        if (!userDetail) {
            // if user is not exists
            throw new NotFoundException();
        }
    

        return { user: userDetail };
    }

    // Get all users 
    async getUsers() {
        const users = await this.prisma.user.findMany({
            where: { deleted: null },
            select: { id: true, email: true ,  firstname: true , lastname: true, role: true, username: true  },
        });

        return { users };
    }

    // Update user details
    async update(id: number, userUpdateDto: UserUpdateDto) {
        const { firstname, lastname, role, email,username } = userUpdateDto;
        // check if user id is exists
        const userExists = await this.prisma.user.findFirst({
            where: { id },
        });
        console.log(userExists);
        if (!userExists) {
            throw new BadRequestException('Invalid User details'); 
        }
       
        
        await this.prisma.user.update({
            where: { id: Number(id) },
            data: {
                firstname,
                lastname,
                role,
                username,
                email
            },
        });

        return { status: "success", message: 'User details update succefully'}; 
    }

    // user delete 
    async deleteUser(id: number) {
        // check if user id exists
        const userExists = await this.prisma.user.findFirst({
            where: { id },
        });

        if (!userExists) {
            throw new BadRequestException('Invalid User details');
        }
    
        // delete user
        await this.prisma.user.delete({
            where: { id: Number(id) }
        });

        return { status: "success", message: 'User Deleted'}; 
    }

    // password hashing
    async hashPassword(password: string) {
        const saltOrRounds = 10;

        return await bcrypt.hash(password, saltOrRounds);
    }


}
