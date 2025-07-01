import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveEntity } from './entities/leave.entity';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveEntity]), EmployeeModule],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
