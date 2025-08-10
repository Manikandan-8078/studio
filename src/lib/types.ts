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
