import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { EmployeeDto } from './dto/employee.dto';
import { Auth } from '../../decorators/http.decorator';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  // @Auth()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<EmployeeDto> {
    const employee = await this.employeeService.create(createEmployeeDto);

    return employee.toDto();
  }

  @Get()
  // @Auth()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<EmployeeDto>> {
    return await this.employeeService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: number): Promise<EmployeeDto | null> {
    return await this.employeeService.findOne({ id });
  }

  @Put(':id')
  @Auth()
  async update(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<void> {
    await this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: number): Promise<void> {
    await this.employeeService.remove(id);
  }
}
