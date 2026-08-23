export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  HOSTEL_ADMIN = 'HOSTEL_ADMIN',
  WARDEN = 'WARDEN',
  MAINTENANCE_STAFF = 'MAINTENANCE_STAFF',
  MESS_STAFF = 'MESS_STAFF',
  SECURITY = 'SECURITY',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
