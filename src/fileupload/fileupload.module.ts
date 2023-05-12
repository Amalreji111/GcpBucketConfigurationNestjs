import { Module } from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { FileuploadController } from './fileupload.controller';
import { StorageModule } from '../storage/storage.module';
import { StorageProvider } from '../storage/storage-provider';

@Module({
  imports:[StorageModule],
  controllers: [FileuploadController],
  providers: [FileuploadService]
})
export class FileuploadModule {}
