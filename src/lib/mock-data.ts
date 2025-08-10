import type { Incident, EmergencyContact, Zone } from './types';

export const mockIncidents: Incident[] = [
  {
    id: 'inc-001',
    date: '2024-07-28 14:32:11',
    location: 'Server Room, 2nd Floor',
    severity: 'Critical',
    duration: '12m 34s',
    log: 'Incident started at 14:32:11 in Server Room. Initial detection via thermal sensor array at 14:32:05, followed by photoelectric smoke detection at 14:32:10. Dual-sensor confirmation triggered main power cutoff to the zone. Emergency lighting activated immediately. Automated notification sent to building manager and local fire department. Suppression system deployed MAP solution at 14:32:13. Fire contained and extinguished by 14:44:45. No casualties reported. Minor equipment damage.',
  },
  {
    id: 'inc-002',
    date: '2024-06-15 09:05:20',
    location: 'Kitchen, 1st Floor',
    severity: 'Minor',
    duration: '2m 10s',
    log: 'Small Class A fire detected in the kitchen area, likely from an unattended cooking appliance. Ionization smoke detector activated at 09:05:20. Power to kitchen circuit was cut. Building staff responded with a portable fire extinguisher before automated suppression was required. Incident resolved by 09:07:30. No damage.',
  },
];

export const mockContacts: EmergencyContact[] = [
    { id: 'con-001', name: 'John Doe', role: 'Building Manager', phone: '555-0101', email: 'john.doe@example.com' },
    { id: 'con-002', name: 'Jane Smith', role: 'Head of Security', phone: '555-0102', email: 'jane.smith@example.com' },
    { id: 'con-003', name: 'Local Fire Dept.', role: 'Emergency Service', phone: '911', email: 'dispatch@localfire.gov' },
];

export const mockZones: Zone[] = [
  { id: 'zone-1', name: 'Lobby', status: 'normal', temp: 22, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}] },
  { id: 'zone-2', name: 'Office A', status: 'normal', temp: 23, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}] },
  { id: 'zone-3', name: 'Office B', status: 'normal', temp: 23, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}] },
  { id: 'zone-4', name: 'Server Room', status: 'normal', temp: 25, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}, {name: 'Electrical', status: 'Active'}] },
  { id: 'zone-5', name: 'Kitchen', status: 'normal', temp: 24, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}, {name: 'Chemical', status: 'Active'}] },
  { id: 'zone-6', name: 'Warehouse', status: 'normal', temp: 20, sensors: [{name: 'Smoke', status: 'Active'}, {name: 'Thermal', status: 'Active'}] },
];
