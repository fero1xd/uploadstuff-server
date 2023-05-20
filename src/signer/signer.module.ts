import { Module } from '@nestjs/common';
import { SignerService } from './signer.service';
import { Services } from 'src/types';

@Module({
  providers: [
    {
      provide: Services.SIGNER_SERVICE,
      useClass: SignerService,
    },
  ],
  exports: [
    {
      provide: Services.SIGNER_SERVICE,
      useClass: SignerService,
    },
  ],
})
export class SignerModule {}
