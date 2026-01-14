import { Request, Response } from 'express';
import { RoutesRequest, RoutesResponse, RoutePreference } from '../types/api';
import { logger } from '../utils/logger';

export const postRoutes = (req: Request, res: Response) => {
  try {
    const body: RoutesRequest = req.body;

    // Validate request
    if (!body.origin || !body.destination) {
      return res.status(400).json({
        error: 'Missing required fields: origin and destination',
      });
    }

    if (typeof body.origin.lat !== 'number' || typeof body.origin.lng !== 'number') {
      return res.status(400).json({
        error: 'Invalid origin coordinates',
      });
    }

    if (typeof body.destination.lat !== 'number' || typeof body.destination.lng !== 'number') {
      return res.status(400).json({
        error: 'Invalid destination coordinates',
      });
    }

    const preference = body.preference || RoutePreference.FASTEST;
    const departureTime = body.departure_time_iso || new Date().toISOString();

    logger.info('Route request received', {
      origin: body.origin,
      destination: body.destination,
      preference,
      departureTime,
    });

    // MOCKED RESPONSE - Replace with real routing engine later
    const mockResponse: RoutesResponse = {
      routes: [
        {
          id: 'route-1',
          totalDuration: 1800, // 30 minutes
          totalDistance: 15000, // 15 km
          transferCount: 1,
          walkingTime: 420, // 7 minutes
          departureTime,
          arrivalTime: new Date(new Date(departureTime).getTime() + 1800 * 1000).toISOString(),
          realtimeConfidence: 0.85,
          legs: [
            {
              mode: 'WALK',
              from: {
                name: 'Start Location',
                lat: body.origin.lat,
                lng: body.origin.lng,
              },
              to: {
                name: 'Gangnam Station',
                lat: 37.498095,
                lng: 127.027610,
              },
              duration: 300, // 5 minutes
              distance: 400,
              instructions: 'Walk to Gangnam Station (Line 2)',
            },
            {
              mode: 'SUBWAY',
              from: {
                name: 'Gangnam Station',
                lat: 37.498095,
                lng: 127.027610,
                stopId: 'subway-gangnam-line2',
              },
              to: {
                name: 'Seoul Station',
                lat: 37.554648,
                lng: 126.970730,
                stopId: 'subway-seoul-line1',
              },
              duration: 1200, // 20 minutes
              distance: 12000,
              instructions: 'Take Line 2 (Green) towards City Hall, transfer at City Hall to Line 1',
              routeId: 'line-2',
              routeName: 'Line 2 (Green Line)',
              stopCount: 10,
            },
            {
              mode: 'WALK',
              from: {
                name: 'Seoul Station',
                lat: 37.554648,
                lng: 126.970730,
              },
              to: {
                name: 'Destination',
                lat: body.destination.lat,
                lng: body.destination.lng,
              },
              duration: 300, // 5 minutes
              distance: 350,
              instructions: 'Walk to destination',
            },
          ],
        },
        {
          id: 'route-2',
          totalDuration: 2100, // 35 minutes
          totalDistance: 16500,
          transferCount: 0,
          walkingTime: 480, // 8 minutes
          departureTime,
          arrivalTime: new Date(new Date(departureTime).getTime() + 2100 * 1000).toISOString(),
          realtimeConfidence: 0.90,
          legs: [
            {
              mode: 'WALK',
              from: {
                name: 'Start Location',
                lat: body.origin.lat,
                lng: body.origin.lng,
              },
              to: {
                name: 'Nearby Bus Stop',
                lat: body.origin.lat + 0.002,
                lng: body.origin.lng + 0.001,
                stopId: 'bus-stop-123',
              },
              duration: 240, // 4 minutes
              distance: 320,
              instructions: 'Walk to nearby bus stop',
            },
            {
              mode: 'BUS',
              from: {
                name: 'Nearby Bus Stop',
                lat: body.origin.lat + 0.002,
                lng: body.origin.lng + 0.001,
                stopId: 'bus-stop-123',
              },
              to: {
                name: 'Destination Bus Stop',
                lat: body.destination.lat - 0.002,
                lng: body.destination.lng - 0.001,
                stopId: 'bus-stop-456',
              },
              duration: 1620, // 27 minutes
              distance: 15800,
              instructions: 'Take Bus 472 (Blue Bus)',
              routeId: 'bus-472',
              routeName: 'Bus 472',
              stopCount: 18,
            },
            {
              mode: 'WALK',
              from: {
                name: 'Destination Bus Stop',
                lat: body.destination.lat - 0.002,
                lng: body.destination.lng - 0.001,
              },
              to: {
                name: 'Destination',
                lat: body.destination.lat,
                lng: body.destination.lng,
              },
              duration: 240, // 4 minutes
              distance: 280,
              instructions: 'Walk to destination',
            },
          ],
        },
      ],
      metadata: {
        requestTime: new Date().toISOString(),
        preference,
        realtimeAvailable: true,
        fallbackMode: false,
      },
    };

    res.json(mockResponse);
  } catch (error) {
    logger.error('Error processing route request', { error });
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
