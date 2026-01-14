import { Router } from 'express';
import { getHealth } from './health';
import { postRoutes } from './routes';
import { getRealtimeStatus } from './realtime';

const router = Router();

// Health check
router.get('/health', getHealth);

// Routing endpoints
router.post('/routes', postRoutes);

// Real-time status
router.get('/realtime/status', getRealtimeStatus);

export default router;
