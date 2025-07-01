import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';
import { AdminEntity } from '../modules/admin/entities/admin.entity';
import { generateHash } from '../common/utils';

@EventSubscriber()
export class AdminSubscriber implements EntitySubscriberInterface<AdminEntity> {
  listenTo(): typeof AdminEntity {
    return AdminEntity;
  }

  beforeInsert(event: InsertEvent<AdminEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<AdminEntity>): void {
    const entity = event.entity as AdminEntity;

    if (entity.password !== event.databaseEntity.password) {
      entity.password = generateHash(entity.password);
    }
  }
}
