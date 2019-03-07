export {};
import { User, UserNote } from 'api/models';

const ADMIN_USER_1 = {
  email: 'admin1@example.com',
  role: 'admin',
  password: '1admin1'
};
const ADMIN_USER_2 = {
  email: 'admin2@example.com',
  role: 'admin',
  password: '2admin2'
};

async function setup() {
  const adminUser1 = new User(ADMIN_USER_1);
  await adminUser1.save();

  for (let i = 0; i < 100; i += 1) {
    const note = new UserNote({ user: adminUser1, note: `admin1 note ${i}` });
    await note.save();
  }

  const adminUser2 = new User(ADMIN_USER_2);
  await adminUser2.save();
  for (let i = 0; i < 50; i += 1) {
    const note = new UserNote({ user: adminUser2, note: `admin2 note ${i}` });
    await note.save();
  }
}

async function checkNewDB() {
  const adminUser1 = await User.findOne({ email: ADMIN_USER_1.email });
  if (!adminUser1) {
    console.log('- New DB detected ===> Initializing Dev Data...');
    await setup();
  } else {
    console.log('- Skip InitData');
  }
}

checkNewDB();
