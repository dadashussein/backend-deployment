import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class MailController {
    constructor(private readonly mailService: UserService) { }

    @Post('subscribe')
    async addEarlyAccessUser(@Body('email') email: string) {        
        return this.mailService.addUsers(email);
    }
}