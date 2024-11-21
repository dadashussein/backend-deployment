import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    async sendEmail(
        toAddress: string,
        subject: string,
        template: string,
        context: Record<string, unknown> = {}
    ): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: toAddress,
                subject,
                template,
                context,
            });
            console.log(`Email sent to ${toAddress}`);
        } catch (error) {
            console.error(`Failed to send email: ${error.message}`);
        }
    }
}