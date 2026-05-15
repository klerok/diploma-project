import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9_а-яА-ЯёЁ-]+$/, {
    message: 'Никнейм может содержать только буквы, цифры, _ и -',
  })
  nickname: string;
}
