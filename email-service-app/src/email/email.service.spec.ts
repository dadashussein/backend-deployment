import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: MailerService;
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
    
    // Setup console spies
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should successfully send an email', async () => {
      const testEmail = 'test@example.com';
      const testSubject = 'Test Subject';
      const testTemplate = 'test-template';
      const testContext = { key: 'value' };

      mockMailerService.sendMail.mockResolvedValue(true);

      await service.sendEmail(testEmail, testSubject, testTemplate, testContext);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: testEmail,
        subject: testSubject,
        template: testTemplate,
        context: testContext,
      });
      expect(consoleSpy).toHaveBeenCalledWith(`Email sent to ${testEmail}`);
    });

    it('should handle errors when sending email fails', async () => {
      const testEmail = 'test@example.com';
      const testError = new Error('Send mail failed');
      mockMailerService.sendMail.mockRejectedValue(testError);

      await service.sendEmail(testEmail, 'subject', 'template');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Failed to send email: ${testError.message}`
      );
    });
  });
});