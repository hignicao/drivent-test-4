import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findVacancyByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    select: {
      id: true,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

const bookingRepository = {
  findBookingByUserId,
  findVacancyByRoomId,
  createBooking,
  updateBooking,
};

export default bookingRepository;
