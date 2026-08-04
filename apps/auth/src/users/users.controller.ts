import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersDocument } from './schema/user.schema';
import { CurrentUser } from '@app/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        return this.usersService.createUser(createUserDto);
    }
    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: UsersDocument){
        return user;
    }
}
