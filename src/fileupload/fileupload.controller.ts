import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { CreateFileuploadDto } from './dto/create-fileupload.dto';
import { UpdateFileuploadDto } from './dto/update-fileupload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('fileupload')
export class FileuploadController {
  constructor(private readonly fileuploadService: FileuploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file): Promise<{ url: string }> {
    return this.fileuploadService.uploadFile(file);
  }

  @Get(':fileName')
  findAll(@Param('fileName')fileName:string) {
    return this.fileuploadService.findOne(fileName);
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileuploadService.findAll(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileuploadDto: UpdateFileuploadDto) {
    return this.fileuploadService.update(+id, updateFileuploadDto);
  }

  @Delete(':fileName')
  remove(@Param('fileName') fileName: string) {
    return this.fileuploadService.remove(fileName);
  }
}
