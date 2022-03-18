import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ContactPhonesService } from './contact-phones.service';
import { ContactPhonesController } from './contact-phones.controller';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
  imports: [DatabaseModule, ContactsModule],
  providers: [ContactPhonesService],
  controllers: [ContactPhonesController],
})
export class ContactPhonesModule {}
