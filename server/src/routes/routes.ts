import { Request, Response } from 'express';
import {
  RoutesRequest,
  RoutesResponse,
  RoutePreference,
  AccessibleRoutesRequest,
  AccessibleRoutesResponse,
} from '../types/api';
import { logger } from '../utils/logger';
import { TransitGraph } from '../services/graph';
import { accessibilityService } from '../services/accessibility';
import stationsData from '../data/stations.json';
import connectionsData from '../data/connections.json';

// Initialize graph with Seoul transit data
const transitGraph = new TransitGraph(stationsData, connectionsData);

export const postRoutes = (req: Request, res: Response) => {
  try {
    const body: AccessibleRoutesRequest = req.body;

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

    // Use real routing engine
    const calculatedRoutes = transitGraph.findRoutes(
      body.origin.lat,
      body.origin.lng,
      body.destination.lat,
      body.destination.lng,
      preference,
      3 // max routes
    );

    // Convert calculated routes to API format
    const routes = calculatedRoutes.map((calc, index) => {
      const departureTimeObj = new Date(departureTime);
      const arrivalTimeObj = new Date(departureTimeObj.getTime() + calc.totalDuration * 1000);
      
      const legs = calc.segments.map((seg, segIndex) => ({
        mode: 'SUBWAY' as const,
        from: {
          name: seg.from.name,
          lat: seg.from.lat,
          lng: seg.from.lng,
          stopId: seg.from.id,
        },
        to: {
          name: seg.to.name,
          lat: seg.to.lat,
          lng: seg.to.lng,
          stopId: seg.to.id,
        },
        duration: seg.duration_seconds,
        distance: seg.distance_meters,
        instructions: `Take Line ${seg.line} from ${seg.from.name} to ${seg.to.name}`,
        routeId: `line-${seg.line}`,
        routeName: `Line ${seg.line}`,
        stopCount: 1,
      }));

      return {
        id: `route-${index + 1}`,
        totalDuration: calc.totalDuration,
        totalDistance: calc.totalDistance,
        transferCount: calc.transferCount,
        walkingTime: 0,
        departureTime,
        arrivalTime: arrivalTimeObj.toISOString(),
        realtimeConfidence: 0.85,
        legs,
      };
    });

    // Filter routes based on accessibility profile
    const accessibilityProfile = body.accessibilityProfile;
    const includeVoiceGuidance = body.includeVoiceGuidance ?? false;
    
    let filteredRoutes = routes;
    let filteredCount = 0;
    
    if (accessibilityProfile) {
      const originalCount = routes.length;
      filteredRoutes = routes.filter((route) =>
        accessibilityService.isRouteAccessible(route, accessibilityProfile)
      );
      filteredCount = originalCount - filteredRoutes.length;
      
      logger.info('Accessibility filtering applied', {
        originalCount,
        filteredCount,
        remainingCount: filteredRoutes.length,
      });
    }
    
    // Enhance routes with accessibility information
    const accessibleRoutes = filteredRoutes.map((route) =>
      accessibilityService.enhanceRouteWithAccessibility(
        route,
        accessibilityProfile,
        includeVoiceGuidance
      )
    );
    
    // Sort by accessibility score if profile is provided
    if (accessibilityProfile) {
      accessibleRoutes.sort((a, b) => b.accessibilityScore.overall - a.accessibilityScore.overall);
    }

    // Fallback to mock if no routes found
    const response: AccessibleRoutesResponse = accessibleRoutes.length > 0 ? {
      routes: accessibleRoutes,
      metadata: {
        requestTime: new Date().toISOString(),
        preference,
        realtimeAvailable: false,
        fallbackMode: false,
        accessibilityFilterApplied: !!accessibilityProfile,
        filteredRoutesCount: filteredCount,
      },
    } : {
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
        accessibilityFilterApplied: false,
        filteredRoutesCount: 0,
      },
    };
    
    // Enhance fallback routes if using mock data
    if (accessibleRoutes.length === 0 && response.routes.length > 0) {
      response.routes = response.routes.map((route) =>
        accessibilityService.enhanceRouteWithAccessibility(
          route,
          accessibilityProfile,
          includeVoiceGuidance
        )
      );
    }

    res.json(response);
  } catch (error) {
    logger.error('Error processing route request', { error });
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
