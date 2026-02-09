//logic perhitungan total bayar per orangnnya berapa disini.
//TOTAL = SubTotal - Discount + Service + Tax

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class BillsService {
  constructor(private prisma: PrismaService) {}
  
  
  async create(createBillDto: CreateBillDto) {
    const ownerExists = await this.prisma.user.findUnique({
      where :{ id: createBillDto.ownerId }  
    })
    if(!ownerExists){
      throw new NotFoundException(`Owner with id ${createBillDto.ownerId} does not exist`);
    }

    const membersToCreate = [
    {
      name: 'Owner',
      isOwner: true,
      userId: createBillDto.ownerId
    }
  ]

  if(createBillDto.memberNames && createBillDto.memberNames.length > 0){
    createBillDto.memberNames.forEach((name)=> {
      membersToCreate.push({
        name: name,
        isOwner: false,
        userId: null as any
      })
    })
  }

    return this.prisma.bill.create({
      data: {
        title: createBillDto.title,
        taxRate: createBillDto.taxRate || 0,
        serviceRate: createBillDto.serviceRate || 0,
        discount: createBillDto.discount || 0,
        paymentDetails: createBillDto.paymentDetails || null,
        owner: {
          connect: { id: createBillDto.ownerId }
        },
        members: {
          create: membersToCreate
        },
        items: {
          create: createBillDto.items?.map((item)=> ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          })),
      },
    },
    include:{
      members:true,
      items:true
    }
    });
  }

  findAll() {
    return this.prisma.bill.findMany()
  }

  findOne(id: string) {
    return this.prisma.bill.findUnique({
      where: { id: id },
      include: {
        members: true,
        items: true
      }
    })
  }

  update(id: string, updateBillDto: UpdateBillDto) {
    
  }

  remove(id: string) {
    return this.prisma.bill.delete({
      where: { id: id },
    })
  }
}
