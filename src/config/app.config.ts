interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Host'],
  customerRoles: ['Guest'],
  tenantRoles: ['Host', 'Guest'],
  tenantName: 'Company',
  applicationName: 'Home Rental App',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
};
