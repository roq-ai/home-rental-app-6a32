const mapping: Record<string, string> = {
  bookings: 'booking',
  companies: 'company',
  properties: 'property',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
