import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateFileuploadDto } from './dto/create-fileupload.dto';
import { UpdateFileuploadDto } from './dto/update-fileupload.dto';
import { StorageProvider } from '../storage/storage-provider';

@Injectable()
export class FileuploadService {
  constructor(
    @Inject(StorageProvider) private readonly  storageService:StorageProvider
    
    ){

  }
  async uploadFile(file) {
    const files=await this.storageService.uploadFile(file)
    // return {url:""};
    return files;
  }

  async findOne(fileName:string) {
    const file=await this.storageService.getSignedUrl(fileName)
    return file;
  }

  findAll(id: number) {
    return `This action returns a #${id} fileupload`;
  }

  update(id: number, updateFileuploadDto: UpdateFileuploadDto) {
    return `This action updates a #${id} fileupload`;
  }

  remove(fileName: string) {
    const isDeleted=this.storageService.deleteFile(fileName)
    if(!isDeleted){
     throw new BadRequestException('Sorry unable to process the request right now.')
    }
    return {
      message:"Ok",
      statusCode: 200,
    };
  }
}
