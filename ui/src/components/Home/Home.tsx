import React from 'react';
import { LikeIcon } from './LikeIcon';
import { Link } from 'react-router-dom';
import { Modal } from '../base';
import { apiGet, apiPost, apiDelete, getLoginData } from '../../utils/apiUtil';

export function Home() {
  const [error, setError] = React.useState<any>(null);
  const [items, setItems] = React.useState(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
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

  const createNote = async () => {
    await apiPost(`/users/${userId}/notes`, {
      data: { title: newTitle, note: newTitle }
    });
    await fetchData();
    setShowCreateModal(false);
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
    return (
      <div className="p-5">
        <div className=" text-red-500">Error when fetching data: {error.message}</div>
        <Link to={`/`}>Back to Login</Link>
      </div>
    );
  }
  return (
    <div className="p-5">
      <h3>List User's Notes:</h3>

      <div className="flex flex-wrap items-baseline mt-4">
        <div className="w-1/6 mb-3 border rounded p-4 text-sm mr-4 bg-gray-200 hover:bg-blue-200">
          <a href="#" onClick={() => setShowCreateModal(true)}>
            + New Note
          </a>
        </div>

        {items ? (
          (items || []).map((item: any) => (
            <div key={item.id} className="w-1/6 mb-3 border rounded p-4 text-sm mr-4 hover:bg-blue-100">
              <div className="flex justify-between">
                <Link to={`/item/${item.id}`}>{item.note}</Link>
                <a href="#" onClick={() => onClickDelete(item)}>
                  ✕
                </a>
              </div>
              <div className="mt-2">
                <a className="flex" href="#" onClick={() => onClickLike(item)}>
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

        {showCreateModal && (
          <Modal
            title="New Note"
            content={
              <input
                autoFocus={true}
                onChange={(ev) => setNewTitle(ev.target.value)}
                className="w-full bg-gray-200 rounded p-2"
                placeholder="Note"
              />
            }
            onCancel={() => setShowCreateModal(false)}
            onConfirm={() => createNote()}
          />
        )}
      </div>
    </div>
  );
}
