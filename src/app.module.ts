import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContactsModule } from './contacts/contacts.module';
import { ContactPhonesModule } from './contact-phones/contact-phones.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ContactsModule,
    ContactPhonesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
