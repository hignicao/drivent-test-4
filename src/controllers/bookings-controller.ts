import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/bookings-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.findBooking(Number(userId));
    return res.send(booking).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const bookingId = await bookingService.createBooking(Number(userId), Number(roomId));
    return res.send(bookingId).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'ForbiddenError') return res.sendStatus(httpStatus.FORBIDDEN);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const bookingId = req.params.bookingId;

  try {
    const newBookingId = await bookingService.updateBooking(Number(userId), Number(roomId), Number(bookingId));
    return res.send(newBookingId).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'ForbiddenError') return res.sendStatus(httpStatus.FORBIDDEN);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
