import { Request, Response } from "express";

export const healthCheck = (_req: Request, res: Response) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'Server is up and running :)',
    timestamp: new Date(Date.now())
  }

  try {
    res.status(200).send(healthCheck);
  } catch (e: any) {
    healthCheck.message = e.message;
    res.status(503).send();
  }

}