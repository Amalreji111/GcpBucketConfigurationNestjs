import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { FileuploadModule } from './fileupload/fileupload.module';
import path from 'path';
import * as gcpCredentials from './res/secrets.json'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,

    }),
    StorageModule.forRoot({
    projectId:gcpCredentials.project_id,
    credentials:{
      type:gcpCredentials.type,
      private_key:gcpCredentials.private_key,
      client_email:gcpCredentials.client_email,
      client_id:gcpCredentials.client_id,
       token_url:gcpCredentials.token_uri,
    
    },
    
  }), FileuploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
