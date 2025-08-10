export interface Incident {
  id: string;
  date: string;
  location: string;
  severity: 'Minor' | 'Moderate' | 'Critical';
  duration: string;
  log: string;
  recommendations?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export type ZoneStatus = 'normal' | 'warning' | 'critical';

export interface Sensor {
    name: string;
    status: string;
}

export interface Zone {
  id: string;
  name: string;
  status: ZoneStatus;
  temp: number;
  sensors: Sensor[];
}
