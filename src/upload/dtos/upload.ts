import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class UploadDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  files: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  fileTypes: string[];

  @IsObject()
  metadata: any;

  callbackUrl: string;

  @IsString()
  callbackSlug: string;

  @IsNumber()
  maxFileSize: number;
}
