import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { EmailService } from '../email/email.service';
import { EarlyAccessUser } from './early-access-user.model';
import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

describe('UserService', () => {
  let service: UserService;
  let emailService: EmailService;
  let earlyAccessUserModel: typeof EarlyAccessUser;

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  const mockEarlyAccessUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: getModelToken(EarlyAccessUser),
          useValue: mockEarlyAccessUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    emailService = module.get<EmailService>(EmailService);
    earlyAccessUserModel = module.get<typeof EarlyAccessUser>(
      getModelToken(EarlyAccessUser)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addUsers', () => {
    const testEmail = 'test@example.com';

    it('should successfully add a new user', async () => {
      mockEarlyAccessUserModel.findOne.mockResolvedValue(null);
      mockEarlyAccessUserModel.create.mockResolvedValue({ email: testEmail });
      mockEmailService.sendEmail.mockResolvedValue(undefined);

      const result = await service.addUsers(testEmail);

      expect(result).toEqual({
        message: 'Your email has been added to the early access list',
      });
      expect(mockEarlyAccessUserModel.create).toHaveBeenCalledWith({
        email: testEmail,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockEarlyAccessUserModel.findOne.mockResolvedValue({ email: testEmail });

      await expect(service.addUsers(testEmail)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should call emailService.sendEmail with correct parameters', async () => {
      const testEmail = 'test@example.com';
      const expectedUserName = 'test';

      jest
        .spyOn(Date.prototype, 'toLocaleDateString')
        .mockReturnValue('1/1/2024');

      await service.sendWelcomeEmail(testEmail);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        testEmail,
        'Welcome to our early access program!',
        'format',
        {
          userName: expectedUserName,
          signUpDate: '1/1/2024',
        }
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});