import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { BillsModule } from './bills/bills.module';
import { AssignItemModule } from './assign-item/assign-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    PrismaModule,
    UsersModule,
    BillsModule,
    AssignItemModule,
  ],
})
export class AppModule {}