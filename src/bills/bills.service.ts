//logic perhitungan total bayar per orangnnya berapa disini.
//TOTAL = SubTotal - Discount + Service + Tax

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AssignItemDto } from 'src/assign-item/dto/assign-item-dto';

@Injectable()
export class BillsService {
  constructor(private prisma: PrismaService) {}
  //create bill beserta member dan itemnya
  async create(createBillDto: CreateBillDto) {
    const ownerExists = await this.prisma.user.findUnique({
      where: { id: createBillDto.ownerId },
    });
    if (!ownerExists) {
      throw new NotFoundException(
        `Owner with id ${createBillDto.ownerId} does not exist`,
      );
    }

    const membersToCreate = [
      {
        name: 'Owner',
        isOwner: true,
        userId: createBillDto.ownerId,
      },
    ];

    if (createBillDto.memberNames && createBillDto.memberNames.length > 0) {
      createBillDto.memberNames.forEach((name) => {
        membersToCreate.push({
          name: name,
          isOwner: false,
          userId: null as any,
        });
      });
    }

    return this.prisma.bill.create({
      data: {
        title: createBillDto.title,
        taxRate: createBillDto.taxRate || 0,
        serviceRate: createBillDto.serviceRate || 0,
        discount: createBillDto.discount || 0,
        paymentDetails: createBillDto.paymentDetails || null,
        owner: {
          connect: { id: createBillDto.ownerId },
        },
        members: {
          create: membersToCreate,
        },
        items: {
          create: createBillDto.items?.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
          })),
        },
      },
      include: {
        members: true,
        items: true,
      },
    });
  }

  async assignItem(dto: AssignItemDto) {
    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });
    if (!item)
      throw new NotFoundException(`Item with id ${dto.itemId} not found`);

    const member = await this.prisma.member.findUnique({
      where: { id: dto.memberId },
    });
    if (!member)
      throw new NotFoundException(`Member with id ${dto.memberId} not found`);

    return this.prisma.assignment.create({
      data: {
        itemId: dto.itemId,
        memberId: dto.memberId,
        portion: dto.portion || 1,
      },
    });
  }

  findAll() {
    return this.prisma.bill.findMany({
      include: {
        members: true,
        items: true,
      }
    });
  }

  async findOne(id: string) {
    const bill = await this.prisma.bill.findUnique({
      where: { id: id },
      include: {
        members: true,
        items: {
          include: { assignments: true },
        },
      },
    });

    if (!bill) {
      throw new NotFoundException(`Bill with id ${id} not found`);
    }

    const memberTotals = {}

    bill.members.forEach((member) => {
      memberTotals[member.id] = {
        name: member.name,
        items: [],
        subTotal: 0,
        tax: 0,
        service: 0,
        discount: 0,
        total: 0
      }
    })

    let billSubTotal = 0; // Total harga seluruh makanan di struk

    // B. Loop setiap Item untuk menghitung subtotal member
    bill.items.forEach((item) => {
      const itemPrice = Number(item.price);
      // Hitung total porsi item ini dibagi ke berapa orang?
      const totalPortions = item.assignments.reduce(
        (acc, curr) => acc + Number(curr.portion),
        0,
      );

      if (totalPortions > 0) {
        const pricePerPortion = itemPrice / totalPortions;
        billSubTotal += itemPrice;

        // Masukkan harga ke member yang makan
        item.assignments.forEach((assign) => {
          if (memberTotals[assign.memberId]) {
            const myPortion = Number(assign.portion);
            const myCost = pricePerPortion * myPortion;

            // A. Hitung Harga (Sudah Benar)
            memberTotals[assign.memberId].subTotal += myCost;

            // B. MASUKKAN DATA ITEM KE ARRAY (INI YANG TADI KURANG)
            // <--- TAMBAHAN DI SINI ---
            memberTotals[assign.memberId].items.push({
              name: item.name,
              price: myCost,        // Harga yang harus dia bayar untuk item ini
              portion: myPortion,   // Berapa porsi yang dia makan
              originalPrice: itemPrice // Harga asli item (opsional, buat info aja)
            });
            // -------------------------
          }
        })
      }
    });

    //tax dan service
    const taxRate = Number(bill.taxRate) / 100;
    const serviceRate = Number(bill.serviceRate) / 100;
    const discountTotal = Number(bill.discount);
    
    Object.keys(memberTotals).forEach((memberId) => {
      const m = memberTotals[memberId]

      const ratio = billSubTotal > 0 ? m.subTotal / billSubTotal : 0;

      m.service = m.subTotal * serviceRate
      m.tax = (m.subTotal + m.service) * taxRate
      m.discount = discountTotal * ratio

      m.total = m.subTotal + m.service + m.tax - m.discount

      m.total = Math.ceil(m.total) 
    })

    return {
      ...bill,
      breakdown: memberTotals
    }
  }

  update(id: string, updateBillDto: UpdateBillDto) {
    return `This action updates a #${id} bill`;
  }

  remove(id: string) {
    return this.prisma.bill.delete({
      where: { id: id },
    });
  }
}
