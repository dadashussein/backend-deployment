import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EarlyAccessUser } from './early-access-user.model';
import { EmailService } from '../email/email.service';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(EarlyAccessUser)
        private readonly earlyAccessUserModel: typeof EarlyAccessUser,
        private readonly emailService: EmailService
    ) { }

    async addUsers(email: string): Promise<{ message: string }> {
        const existingUser = await this.earlyAccessUserModel.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        await this.earlyAccessUserModel.create({ email });
        await this.sendWelcomeEmail(email);
        return { message: 'Your email has been added to the early access list' };
    }

    async sendWelcomeEmail(email: string): Promise<void> {
        const subject = 'Welcome to our early access program!';
        const template = 'format';
        const context = {
            userName: email.split('@')[0],
            signUpDate: new Date().toLocaleDateString(),
        };
        await this.emailService.sendEmail(email, subject, template, context);
    }
}
