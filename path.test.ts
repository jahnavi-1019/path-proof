import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NavNode, NavEdge } from './types.js';
import { AccessibleRouter } from './accessible-router.js';

test('PathProof Router: avoids stairs and steep slopes for wheelchair profiles', () => {
  const nodes = new Map<string, NavNode>([
    ['A', { id: 'A', name: 'Metro Entrance', lat: 37.77, lon: -122.41, elevationMeters: 10, hasElevator: true, elevatorWorking: true, elevatorLastVerifiedHoursAgo: 1 }],
    ['B_STAIRS', { id: 'B_STAIRS', name: 'Steep Pedestrian Overpass', lat: 37.771, lon: -122.41, elevationMeters: 25, hasElevator: false, elevatorWorking: false, elevatorLastVerifiedHoursAgo: 0 }],
    ['C_RAMP', { id: 'C_RAMP', name: 'Grade-Separated Wheelchair Ramp', lat: 37.772, lon: -122.412, elevationMeters: 18, hasElevator: false, elevatorWorking: false, elevatorLastVerifiedHoursAgo: 0 }],
    ['DEST', { id: 'DEST', name: 'City Hall Plaza', lat: 37.773, lon: -122.413, elevationMeters: 20, hasElevator: false, elevatorWorking: false, elevatorLastVerifiedHoursAgo: 0 }]
  ]);

  const edges: NavEdge[] = [
    // Direct but has stairs
    {
      fromNodeId: 'A',
      toNodeId: 'B_STAIRS',
      distanceMeters: 80,
      slopePercent: 18,
      hasStairs: true,
      stairCount: 42,
      isObstructed: false,
      curbCutsPresent: true
    },
    {
      fromNodeId: 'B_STAIRS',
      toNodeId: 'DEST',
      distanceMeters: 60,
      slopePercent: 2,
      hasStairs: false,
      stairCount: 0,
      isObstructed: false,
      curbCutsPresent: true
    },
    // Accessible gentle ramp bypass
    {
      fromNodeId: 'A',
      toNodeId: 'C_RAMP',
      distanceMeters: 140,
      slopePercent: 3.5, // Well within 5% wheelchair limit
      hasStairs: false,
      stairCount: 0,
      isObstructed: false,
      curbCutsPresent: true
    },
    {
      fromNodeId: 'C_RAMP',
      toNodeId: 'DEST',
      distanceMeters: 110,
      slopePercent: 2.0,
      hasStairs: false,
      stairCount: 0,
      isObstructed: false,
      curbCutsPresent: true
    }
  ];

  // Wheelchair route must choose C_RAMP over B_STAIRS
  const plan = AccessibleRouter.planRoute('A', 'DEST', nodes, edges, 'WHEELCHAIR');
  assert.equal(plan.isFullyAccessible, true);
  assert.equal(plan.nodes.length, 3);
  assert.equal(plan.nodes[1].id, 'C_RAMP');
  assert.ok(plan.maxEncounteredSlope <= 5.0);
  assert.ok(plan.totalDistanceMeters === 250);
});

test('PathProof Router: detours around reported active obstructions', () => {
  const nodes = new Map<string, NavNode>([
    ['N1', { id: 'N1', name: 'Station', lat: 0, lon: 0, elevationMeters: 0, hasElevator: false, elevatorWorking: false, elevatorLastVerifiedHoursAgo: 0 }],
    ['N2', { id: 'N2', name: 'Main Sidewalk (Blocked)', lat: 0, lon: 0, elevationMeters: 0, hasElevator: false, elevatorWorking: false, elevatorLastVerifiedHoursAgo: 0 }],
    ['N3', { id: 'N3', name: 'Bypass Avenue', lat: 0, lon: 0, elevationMeters: 0, hasElevator: false, elevatorWorking: false, elevatorLastVerifiedHoursAgo: 0 }],
    ['N4', { id: 'N4', name: 'Clinic', lat: 0, lon: 0, elevationMeters: 0, hasElevator: false, elevatorWorking: false, elevatorLastVerifiedHoursAgo: 0 }]
  ]);

  const edges: NavEdge[] = [
    { fromNodeId: 'N1', toNodeId: 'N2', distanceMeters: 50, slopePercent: 1, hasStairs: false, stairCount: 0, isObstructed: true, obstructionReason: 'Sidewalk torn up for repaving', curbCutsPresent: true },
    { fromNodeId: 'N2', toNodeId: 'N4', distanceMeters: 50, slopePercent: 1, hasStairs: false, stairCount: 0, isObstructed: false, curbCutsPresent: true },
    { fromNodeId: 'N1', toNodeId: 'N3', distanceMeters: 70, slopePercent: 2, hasStairs: false, stairCount: 0, isObstructed: false, curbCutsPresent: true },
    { fromNodeId: 'N3', toNodeId: 'N4', distanceMeters: 70, slopePercent: 2, hasStairs: false, stairCount: 0, isObstructed: false, curbCutsPresent: true }
  ];

  const plan = AccessibleRouter.planRoute('N1', 'N4', nodes, edges, 'WHEELCHAIR');
  assert.equal(plan.nodes[1].id, 'N3');
  assert.equal(plan.totalDistanceMeters, 140);
});
