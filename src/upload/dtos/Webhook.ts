import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class WebhookStuff {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNumber()
  @Min(1)
  size: number;

  @IsString()
  @IsNotEmpty()
  eTag: string;
  @IsString()
  @IsNotEmpty()
  sequencer: string;
}

export class WebhookDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookStuff)
  data: WebhookStuff[];
}
