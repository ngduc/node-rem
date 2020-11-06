import React from 'react';
import { apiGet, getLoginData } from '../../utils/apiUtil';

export function Home() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const fetch = async () => {
      const { data, error } = await apiGet('/users');
      console.log('data', data);
      data && setUsers(data.data);
    };
    fetch();
  }, []);

  const loginData = getLoginData();
  console.log('loginData', loginData);
  return (
    <div style={{ padding: 20 }}>
      <h3>Current user: {loginData?.data?.user?.email}</h3>
      <h3>List users: (require Admin role)</h3>

      <div className="flex items-center mt-4">
        {users.map((user: any) => (
          <div className="border rounded p-4 text-sm mr-4">{user.email}</div>
        ))}
      </div>
    </div>
  );
}
