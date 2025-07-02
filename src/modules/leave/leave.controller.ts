import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { LeaveDto } from './dto/leave.dto';
import { Auth } from '../../decorators/http.decorator';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post(':employeeId')
  @Auth()
  async create(
    @Param('employeeId') employeeId: number,
    @Body() createLeaveDto: CreateLeaveDto,
  ) {
    const leave = await this.leaveService.create(employeeId, createLeaveDto);

    return leave.toDto();
  }

  @Get()
  @Auth()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<LeaveDto>> {
    return await this.leaveService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: number) {
    return this.leaveService.findOne({ id });
  }

  @Put(':id')
  @Auth()
  async update(
    @Param('id') id: number,
    @Body() updateLeaveDto: UpdateLeaveDto,
  ): Promise<void> {
    await this.leaveService.update(id, updateLeaveDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: number): Promise<void> {
    return await this.leaveService.remove(id);
  }
}
