import { DateField, NumberField, StringField } from '../../../decorators/field.decorator';

export class CreateLeaveDto {
  @StringField({minLength: 3})
  readonly reason: string;

  @DateField({ example: '2023-01-01', required: true })
  readonly startDate: string;

  @DateField({ example: '2023-01-01', required: true })
  readonly endDate: string;
}
