import React from 'react';
import { apiGet, apiPost, apiDelete, getLoginData } from '../../utils/apiUtil';

export function Home() {
  const [items, setItems] = React.useState([]);
  const loginData = getLoginData();
  console.log('loginData', loginData);

  const fetchData = async () => {
    const { data, error } = await apiGet(`/users/${loginData?.data?.user?.id}/notes?sort=createdAt:desc`);
    console.log('data', data);
    data && setItems(data.data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onClickAddNote = async () => {
    const title = prompt('Note Title', '');

    if (title != null) {
      const { data, error } = await apiPost(`/users/${loginData?.data?.user?.id}/notes`, {
        data: { title, note: title }
      });
      console.log('data', data);
      await fetchData();
    }
  };

  const onClickDelete = async (item: any) => {
    await apiDelete(`/users/${loginData?.data?.user?.id}/notes/${item.id}`);
    await fetchData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Current user: {loginData?.data?.user?.email}</h3>
      <h3>List User's Notes:</h3>

      <div className="flex flex-wrap items-center mt-4">
        <div className="border rounded p-4 text-sm mt-4 mr-4">
          <a href="javascript:;" onClick={onClickAddNote}>
            + New Note
          </a>
        </div>

        {items.map((item: any) => (
          <div className="border rounded p-4 text-sm mt-4 mr-4">
            <a href="javascript:;" onClick={() => onClickDelete(item)}>
              ✕
            </a>{' '}
            {item.note}
          </div>
        ))}
      </div>
    </div>
  );
}
