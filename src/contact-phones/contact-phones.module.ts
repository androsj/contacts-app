import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ContactPhonesService } from './contact-phones.service';
import { ContactPhonesController } from './contact-phones.controller';
import { ContactsModule } from '../contacts/contacts.module';

@Module({
  imports: [DatabaseModule, ContactsModule],
  providers: [ContactPhonesService],
  controllers: [ContactPhonesController],
})
export class ContactPhonesModule {}
