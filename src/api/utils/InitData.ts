export {};
import { User, UserNote } from 'api/models';

const ADMIN_USER = {
  email: 'admin@example.com',
  role: 'admin',
  password: '1admin1'
};

async function setup() {
  const adminUser = new User(ADMIN_USER);
  await adminUser.save();

  for (let i = 0; i < 100; i += 1) {
    const note = new UserNote({ user: adminUser, note: `note ${i}` });
    await note.save();
  }
}

async function checkNewDB() {
  const adminUser = await User.findOne({ email: ADMIN_USER.email });
  if (!adminUser) {
    console.log('- New DB detected ===> Initializing Dev Data...');
    await setup();
  } else {
    console.log('- Skip InitData');
  }
}

checkNewDB();
