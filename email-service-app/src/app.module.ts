import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EarlyAccessUser } from './user/early-access-user.model';
import { MailController } from './user/user.controller';
import { EmailService } from './email/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.*']
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: configService.get<string>('EMAIL_TLS') === 'true' ? false : true,
          },
        },
        defaults: {
          from: configService.get<string>('EMAIL_FROM'),
        },
        template: {
          dir: join(__dirname, '..', 'src', 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    SequelizeModule.forRoot({
      autoLoadModels: true,
      synchronize: true,
      sync: { alter: true },
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
    }),
    SequelizeModule.forFeature([EarlyAccessUser]),
  ],
  controllers: [MailController],
  providers: [UserService, EmailService],
})
export class AppModule { }
