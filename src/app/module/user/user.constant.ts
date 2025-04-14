export const USER_ROLE = {
  user: 'user',
  admin: 'admin',
  superAdmin: 'superAdmin',
} as const;

export const USER_STATUS = ['active', 'inactive'] as const;

export const userSearchableFields = ['name', 'email', 'role'];
