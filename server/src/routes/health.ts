import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    service: 'seoul-transit-api',
    version: '1.0.0',
  });
};
