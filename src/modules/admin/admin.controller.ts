import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminDto } from './dto/admin.dto';
import { PageDto } from '../../common/dto/page.dto';
import { Auth } from '../../decorators/http.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Auth()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<AdminDto>> {
    return this.adminService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: number): Promise<AdminDto | null> {
    return this.adminService.findOne({ id });
  }

  @Put(':id')
  // @Auth()
  async update(
    @Param('id') id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<void> {
    return await this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: number): Promise<void> {
    return await this.adminService.remove(id);
  }
}
