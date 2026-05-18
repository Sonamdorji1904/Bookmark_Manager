import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const pickPayload = (req: Request, target: "body" | "query" | "params") => {
  if (target === "query") {
    return req.query;
  }

  if (target === "params") {
    return req.params;
  }

  return req.body;
};

export const validate = (
  schema: AnyZodObject,
  target: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedPayload = schema.parse(pickPayload(req, target));

      if (target === "body") {
        req.body = parsedPayload;
      }

      res.locals.validated = {
        ...(res.locals.validated ?? {}),
        [target]: parsedPayload,
      };

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.flatten(),
        });
      }

      return next(error);
    }
  };
};
