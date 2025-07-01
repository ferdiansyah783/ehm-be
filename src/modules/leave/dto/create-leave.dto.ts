import { DateField, NumberField, StringField } from '../../../decorators/field.decorator';

export class CreateLeaveDto {
  @StringField()
  readonly reason: string;

  @DateField({ example: '2023-01-01' })
  readonly startDate: string;

  @DateField({ example: '2023-01-01' })
  readonly endDate: string;
}
