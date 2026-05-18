import { Response } from "express";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T,
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  },
  message = "Success",
) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};
