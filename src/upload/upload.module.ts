import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Services } from 'src/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stuff } from 'src/typeorm/entities/Stuff';
import { SignerModule } from 'src/signer/signer.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Stuff]), SignerModule, HttpModule],
  controllers: [UploadController],
  providers: [
    {
      provide: Services.UPLOAD_SERVICE,
      useClass: UploadService,
    },
  ],
})
export class UploadModule {}
