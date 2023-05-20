import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stuff } from 'src/typeorm/entities/Stuff';
import { Repository } from 'typeorm';
import { UploadDto } from './dtos/upload';
import { Services, Status } from 'src/types';
import { SignerService } from 'src/signer/signer.service';
import { v4 } from 'uuid';
import { WebhookDto } from './dtos/Webhook';
import { HttpService } from '@nestjs/axios';
import { contentType } from 'mime-types';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Stuff)
    private readonly stuffRepository: Repository<Stuff>,
    @Inject(Services.SIGNER_SERVICE)
    private readonly signerService: SignerService,
    private readonly httpService: HttpService,
  ) {}

  async prepareUpload(data: UploadDto) {
    const { files, metadata, callbackSlug, callbackUrl } = data;

    const stringifiedMetadata = JSON.stringify(metadata);

    const result: {
      presignedUrl: { url: string };
      name: string;
      key: string;
    }[] = [];

    for (const file of files) {
      const uid = v4();

      const fileKey = `${uid}.${file}`;
      const ct = contentType(file);

      if (!ct) {
        throw new BadRequestException('Invalid File Type');
      }

      const presignedUrl = await this.signerService.signUrl(fileKey, ct);
      const dom = presignedUrl.split('?')[0].split('/').slice(0, 4).join('/');
      const genUrl = dom + '/' + encodeURIComponent(fileKey);

      await this.stuffRepository.save(
        this.stuffRepository.create({
          fileUrl: genUrl,
          fileKey: fileKey,
          fileName: file,
          metadata: stringifiedMetadata,
          callbackUrl,
          callbackSlug,
        }),
      );

      result.push({
        presignedUrl: { url: presignedUrl },
        name: file,
        key: fileKey,
      });
    }

    return result;
  }

  async pollUpload(key: string) {
    console.log('Poll request for', key);
    const stuff = await this.stuffRepository.findOne({
      where: {
        fileKey: key,
      },
    });

    if (!stuff) {
      throw new NotFoundException('Upload not found!');
    }

    return stuff;
  }

  async handleWebhook(body: WebhookDto) {
    console.log('[+] Incomming webhook request');
    console.log(body);
    for (const stuff of body.data) {
      const key = stuff.key;

      const dbStuff = await this.stuffRepository.findOne({
        where: { fileKey: decodeURIComponent(key.replace(/\+/g, ' ')) },
      });

      if (!dbStuff) {
        // Something very wrong happened
        // throw new NotFoundException("Key is invalid");
        console.log('[-] Stuff not found in database. Serious problem hmmmm');
        continue;
      }

      dbStuff.status = Status.DONE;
      await this.stuffRepository.save(dbStuff);

      try {
        if (dbStuff.callbackUrl.startsWith('http://localhost')) return;

        console.log(
          'calling callback url',
          dbStuff.callbackUrl + `?slug=${dbStuff.callbackSlug}`,
        );
        await this.httpService.axiosRef.post(
          dbStuff.callbackUrl + `?slug=${dbStuff.callbackSlug}`,
          {
            status: 'uploaded',
            metadata: JSON.parse(dbStuff.metadata ?? '{}'),
            file: {
              // Trying to figure out this
              url: dbStuff.fileUrl,
              key: dbStuff.fileKey,
              name: dbStuff.fileName,
            },
          },
          {
            headers: {
              'uploadstuff-hook': 'callback',
            },
          },
        );
      } catch (_) {
        // Problem calling the callback url
        console.log('[-] Callback url failed to connect');
      }
    }
  }
}
