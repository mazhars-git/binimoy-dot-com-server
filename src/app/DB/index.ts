import config from '../config';
import { USER_ROLE } from '../module/user/user.constant';
import { User } from '../module/user/user.model';

const adminUser = {
  name: 'Mr. Admin',
  email: 'admin@admin.com',
  phoneNumber: '01711111111',
  role: USER_ROLE.superAdmin,
  password: config.SUPER_ADMIN_PASS,
};

const seedSuperAdmin = async () => {
  try {
    // Check if an admin already exists
    const isAdminExist = await User.findOne({ role: USER_ROLE.superAdmin });

    if (!isAdminExist) {
      await User.create(adminUser);
    }
  } catch (error) {
    console.error('Error seeding super admin user:', error);
  }
};

export default seedSuperAdmin;
