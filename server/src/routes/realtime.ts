import { Request, Response } from 'express';

export const getRealtimeStatus = (req: Request, res: Response) => {
  // MOCKED RESPONSE - Replace with real status checks later
  res.json({
    ok: true,
    upstreamApis: {
      seoulBus: {
        status: 'healthy',
        lastFetch: new Date(Date.now() - 15000).toISOString(), // 15 seconds ago
        message: 'Mock data - not yet implemented',
      },
      seoulSubway: {
        status: 'healthy',
        lastFetch: new Date(Date.now() - 12000).toISOString(), // 12 seconds ago
        message: 'Mock data - not yet implemented',
      },
    },
    cache: {
      redis: {
        status: 'not_configured',
        message: 'Redis not yet configured for MVP',
      },
    },
    timestamp: new Date().toISOString(),
  });
};
