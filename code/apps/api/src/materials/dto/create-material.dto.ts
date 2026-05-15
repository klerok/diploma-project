import { MaterialType } from '../../../generated/prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  title: string;

  @IsEnum(MaterialType)
  type: MaterialType;

  @IsInt()
  @Min(1)
  @Max(500)
  pages: number;

  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  sourceUrl?: string;
}
