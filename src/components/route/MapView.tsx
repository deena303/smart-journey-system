import React from 'react';
import { MapView as RealMapView, MapViewProps as RealMapViewProps } from '../MapView';
import { Route, Location } from '../../types/journey';

export interface MapViewProps {
  route?: Route;
  origin?: Location;
  destination?: Location;
  activeSegmentId?: string;
  onSelectSegment?: (segmentId: string) => void;
  className?: string;
  interactive?: boolean;
  height?: string;
}

export const MapView: React.FC<MapViewProps> = (props) => {
  return <RealMapView {...props} />;
};

export default MapView;
