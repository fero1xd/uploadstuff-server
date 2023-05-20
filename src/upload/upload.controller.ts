import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Services } from 'src/types';
import { UploadService } from './upload.service';
import { UploadDto } from './dtos/upload';
import { WebhookDto } from './dtos/Webhook';

@Controller()
export class UploadController {
  constructor(
    @Inject(Services.UPLOAD_SERVICE)
    private readonly uploadService: UploadService,
  ) {}

  @Post('/prepareUpload')
  async prepareUpload(@Body() data: UploadDto) {
    return await this.uploadService.prepareUpload(data);
  }

  @Get('/poll/:key')
  async pollUpload(@Param('key') key: string) {
    return await this.uploadService.pollUpload(key);
  }

  @Post('/webhook')
  async lambdaWebhook(@Body() data: WebhookDto) {
    await this.uploadService.handleWebhook(data);
    return 'Ok';
  }
}
