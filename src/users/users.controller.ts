import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto, UserUpdateDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('registration')
  @HttpCode(200)
  registration(@Body() createUserDto: UserDto) {
    return this.usersService.registration(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMyUser(@Param('id', ParseIntPipe)  id: number , @Req() req) {
    return this.usersService.getMyUser(id, req);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }
  
  @UseGuards(JwtAuthGuard)
  @Put('/update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() userUpdateDto: UserUpdateDto) {
    return this.usersService.update(id, userUpdateDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
