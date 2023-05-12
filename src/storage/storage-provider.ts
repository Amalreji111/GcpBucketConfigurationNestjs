import { Injectable } from '@nestjs/common';
import { Storage, StorageOptions } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../EnvFactory';
import { GcpAction } from './Common/Enums';
@Injectable()
export class StorageProvider {
  private static gcpUrl:'https://storage.googleapis.com'
  private readonly storage: Storage;
  private readonly BUCKET_NAME: string
  constructor(options: StorageOptions,private readonly configService:ConfigService) {
    this.storage = new Storage(options);
    this.BUCKET_NAME=configService.get(EnvVariables.BUCKET_NAME)??"YourBucketName"
  }

  getBucket(bucketName: string) {
    return this.storage.bucket(bucketName);
  }
 async uploadFile(file){
    const bucket=this.getBucket(this.BUCKET_NAME)
    const blob=bucket.file(file.originalname);
    const stream=blob.createWriteStream({
        metadata:{
            contentType:file.mimetype
        }
    })
    stream.end(file.buffer);
    await new Promise<void>((resolve,reject)=>{
        stream.on('error', reject);
        stream.on('finish', resolve);
    })
    return {url:`${StorageProvider.gcpUrl}/${bucket.name}/${blob.name}`}
  }
  async getFileUrl(filename: string): Promise<string> {
    const bucket = this.getBucket(this.BUCKET_NAME);
    const blob = bucket.file(filename);
    const [metadata] = await blob.getMetadata();
    return `${StorageProvider.gcpUrl}/${bucket.name}/${blob.name}`;
  }
  async getSignedUrl(filename: string, options?: { expiresIn: number }): Promise<string> {
    const bucket = this.getBucket(this.BUCKET_NAME);
    const blob = bucket.file(filename);
    const [url] = await blob.getSignedUrl({
      action: GcpAction.READ,
      expires: options?.expiresIn || Date.now() + 3600000
    });
    return url;
  }
  async hasFile(filename: string): Promise<boolean> {
    const bucket = this.getBucket(this.BUCKET_NAME);
    const blob = bucket.file(filename);
    const [exists] = await blob.exists();
    return exists;
  }

  async updateFile(filename: string, newContent: Buffer): Promise<void> {
    const bucket = this.getBucket(this.BUCKET_NAME);
    const blob = bucket.file(filename);
    const stream = blob.createWriteStream({
      metadata: {
        contentType: 'application/octet-stream'
      }
    });
    stream.end(newContent);
    await new Promise<void>((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', resolve);
    });
  }
  async deleteFile(filename: string): Promise<boolean> {
    const bucket = this.getBucket(this.BUCKET_NAME);
    const blob = bucket.file(filename);
    const [exists] = await blob.exists();
    if (!exists) {
      return false;
    }
    await blob.delete();
    return true;
  }
  
}
