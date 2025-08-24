export interface Tenant {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  tenantId: string;
  name: string;
}

export interface Resource {
  id: string;
  tenantId: string;
  locationId: string;
  name: string;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
}

export const tenants: Tenant[] = [
  { id: 'tenant-1', name: 'テナントA' },
  { id: 'tenant-2', name: 'テナントB' },
];

export const locations: Location[] = [
  { id: 'loc-1', tenantId: 'tenant-1', name: '本店' },
  { id: 'loc-2', tenantId: 'tenant-1', name: '支店' },
  { id: 'loc-3', tenantId: 'tenant-2', name: '南口店' },
];

export const resources: Resource[] = [
  { id: 'res-1', tenantId: 'tenant-1', locationId: 'loc-1', name: '会議室1' },
  { id: 'res-2', tenantId: 'tenant-1', locationId: 'loc-2', name: '会議室2' },
  { id: 'res-3', tenantId: 'tenant-2', locationId: 'loc-3', name: 'スタジオA' },
];

export const services: Service[] = [
  { id: 'svc-1', tenantId: 'tenant-1', name: '相談' },
  { id: 'svc-2', tenantId: 'tenant-2', name: '撮影' },
];
