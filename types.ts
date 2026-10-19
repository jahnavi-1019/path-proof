export type MobilityProfileType = 'WHEELCHAIR' | 'STROLLER' | 'STANDARD_WALK';

export interface MobilityConstraints {
  maxSlopePercent: number; // e.g. 5% max for wheelchair
  allowStairs: boolean;
  requireElevatorForVertical: boolean;
  minSidewalkWidthMeters: number;
}

export interface NavNode {
  id: string;
  name: string;
  lat: number;
  lon: number;
  elevationMeters: number;
  hasElevator: boolean;
  elevatorWorking: boolean;
  elevatorLastVerifiedHoursAgo: number;
}

export interface NavEdge {
  fromNodeId: string;
  toNodeId: string;
  distanceMeters: number;
  slopePercent: number;
  hasStairs: boolean;
  stairCount: number;
  isObstructed: boolean;
  obstructionReason?: string;
  curbCutsPresent: boolean;
}

export interface AccessibleRoutePlan {
  profile: MobilityProfileType;
  totalDistanceMeters: number;
  estimatedMinutes: number;
  nodes: NavNode[];
  edges: NavEdge[];
  maxEncounteredSlope: number;
  hasElevatorUsage: boolean;
  isFullyAccessible: boolean;
  verificationConfidence: number; // 0 to 1
}
