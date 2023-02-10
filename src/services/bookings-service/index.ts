import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function findBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function checkInfo(roomId: number, userId: number) {
  const room = await hotelRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }

  const vacancy = await bookingRepository.findVacancyByRoomId(roomId);
  if (vacancy.length >= room.capacity) {
    throw forbiddenError();
  }

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
}

async function createBooking(userId: number, roomId: number) {
  await checkInfo(roomId, userId);

  const bookingCreated = await bookingRepository.createBooking(userId, roomId);
  return bookingCreated.id;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    throw forbiddenError();
  }

  await checkInfo(roomId, userId);

  const bookingUpdated = await bookingRepository.updateBooking(bookingId, roomId);
  return bookingUpdated.id;
}

const bookingService = {
  findBooking,
  createBooking,
  updateBooking,
};

export default bookingService;
