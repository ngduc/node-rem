export {};
import { User, UserNote } from 'api/models';

const DUMMY_USER = {
  email: 'dummy1@example.com',
  role: 'user',
  password: 'dummy111'
};
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
  const dummyUser = new User(DUMMY_USER);
  await dummyUser.save();

  const adminUser1 = new User(ADMIN_USER_1);
  await adminUser1.save();

  const createUserNotes = async (user: any, num: number, text: string) => {
    for (let i = 0; i < num; i += 1) {
      const note = new UserNote({ user, note: `${text} ${i}` });
      await note.save();
    }
  };
  await createUserNotes(adminUser1, 100, 'admin1 note');

  const adminUser2 = new User(ADMIN_USER_2);
  await adminUser2.save();
  await createUserNotes(adminUser2, 50, 'admin2 note');
}

async function checkNewDB() {
  const dummyUser = await User.findOne({ email: DUMMY_USER.email });
  if (!dummyUser) {
    console.log('- New DB detected ===> Initializing Dev Data...');
    await setup();
  } else {
    console.log('- Skip InitData');
  }
}

checkNewDB();
