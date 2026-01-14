import { Router } from 'express';
import { getHealth } from './health';
import { postRoutes } from './routes';
import { getRealtimeStatus } from './realtime';
import { getStationAccessibility, getAllStationsAccessibility } from './accessibility';

const router = Router();

// Health check
router.get('/health', getHealth);

// Routing endpoints
router.post('/routes', postRoutes);

// Real-time status
router.get('/realtime/status', getRealtimeStatus);

// Accessibility endpoints
router.get('/accessibility/stations/:stationId', getStationAccessibility);
router.get('/accessibility/stations', getAllStationsAccessibility);

export default router;
