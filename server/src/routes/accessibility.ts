import { Request, Response } from 'express';
import { accessibilityService } from '../services/accessibility';
import { logger } from '../utils/logger';

/**
 * GET /v1/accessibility/stations/:stationId
 * Get accessibility features for a specific station
 */
export const getStationAccessibility = (req: Request, res: Response) => {
  try {
    const { stationId } = req.params;

    if (!stationId) {
      return res.status(400).json({
        error: 'Station ID is required',
      });
    }

    const accessibility = accessibilityService.getStationAccessibility(stationId);

    if (!accessibility) {
      return res.status(404).json({
        error: 'Station not found',
      });
    }

    res.json({
      stationId,
      accessibility,
    });
  } catch (error) {
    logger.error('Error fetching station accessibility', { error });
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

/**
 * GET /v1/accessibility/stations
 * Get all stations with accessibility information
 */
export const getAllStationsAccessibility = (req: Request, res: Response) => {
  try {
    // Get query parameters for filtering
    const wheelchairOnly = req.query.wheelchairOnly === 'true';
    const elevatorOnly = req.query.elevatorOnly === 'true';

    const stations: any[] = [];
    
    // Note: This is a simplified version - in production, you'd query all stations
    const stationIds = [
      '2_gangnam',
      '2_samsung',
      '2_jamsil',
      '2_sindang',
      '2_seoul_station',
      '2_hongik',
      '3_gangnam',
      '3_sinsa',
      '3_anguk',
      '3_gyeongbokgung',
    ];

    stationIds.forEach((stationId) => {
      const accessibility = accessibilityService.getStationAccessibility(stationId);
      if (accessibility) {
        // Apply filters
        if (wheelchairOnly && !accessibility.wheelchairAccessible) return;
        if (elevatorOnly && !accessibility.elevatorAvailable) return;

        stations.push({
          stationId,
          accessibility,
        });
      }
    });

    res.json({
      count: stations.length,
      stations,
      filters: {
        wheelchairOnly,
        elevatorOnly,
      },
    });
  } catch (error) {
    logger.error('Error fetching stations accessibility', { error });
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
