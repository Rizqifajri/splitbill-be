import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if(existingUser){
      throw new ConflictException("User with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt)
    
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        //@ts-ignore
        password: hashedPassword,
      }, 
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id : true,
        name: true,
        email: true,
      }
    })
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where : {id},
      select : {
        id : true,
        name: true,
        email: true,
      }
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const dataToUpdate = { ...updateUserDto };
    if(updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(updateUserDto.password, salt)
    }
    return this.prisma.user.update({
      where: {id},
      data: dataToUpdate,
      select: {
        id : true,
        name: true,
        email: true,
      }
    })
  }

  remove(id: string) {
    return this.prisma.user.delete({where :{id}});
  }
}
