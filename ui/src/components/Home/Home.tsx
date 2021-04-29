import React from 'react';
import { LikeIcon } from './LikeIcon';
import { Link } from 'react-router-dom';
import { apiGet, apiPost, apiDelete, getLoginData } from '../../utils/apiUtil';

export function Home() {
  const [error, setError] = React.useState<any>(null);
  const [items, setItems] = React.useState(null);
  const { loginData, userId } = getLoginData();
  console.log('loginData', loginData);

  const fetchData = async () => {
    const { data, error } = await apiGet(`/users/${userId}/notes?sort=createdAt:desc`);
    setError(error);
    data && setItems(data.data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onClickAddNote = async () => {
    const title = prompt('Note Title', '');

    if (title != null) {
      await apiPost(`/users/${userId}/notes`, {
        data: { title, note: title }
      });
      await fetchData();
    }
  };

  const onClickDelete = async (item: any) => {
    await apiDelete(`/users/${userId}/notes/${item.id}`);
    await fetchData();
  };

  const onClickLike = async (item: any) => {
    await apiPost(`/users/${userId}/notes/${item.id}/like`, {});
    await fetchData();
  };

  if (error) {
    return <div className="p-5 text-red-500">Error when fetching data: {error.message}</div>;
  }
  return (
    <div className="p-5">
      <h3>List User's Notes:</h3>

      <div className="flex flex-wrap items-baseline mt-4">
        <div className="w-1/6 mb-3 border rounded p-4 text-sm mr-4 bg-gray-200 hover:bg-blue-200">
          <a href="javascript:;" onClick={onClickAddNote}>
            + New Note
          </a>
        </div>

        {items ? (
          (items || []).map((item: any) => (
            <div className="w-1/6 mb-3 border rounded p-4 text-sm mr-4 hover:bg-blue-100">
              <div className="flex justify-between">
                <Link to={`/item/${item.id}`}>{item.note}</Link>
                <a href="javascript:;" onClick={() => onClickDelete(item)}>
                  ✕
                </a>
              </div>
              <div className="mt-2">
                <a className="flex" href="javascript:;" onClick={() => onClickLike(item)}>
                  <LikeIcon />
                  <span className="ml-2">
                    Likes:
                    <span className="ml-2">{item.likes}</span>
                  </span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div>Loading..</div>
        )}
      </div>
    </div>
  );
}
