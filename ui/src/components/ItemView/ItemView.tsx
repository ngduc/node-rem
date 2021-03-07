import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { apiGet, apiPost, getLoginData } from '../../utils/apiUtil';

export default () => {
  const { itemId } = useParams();
  const { userId } = getLoginData();
  const [item, setItem] = React.useState<any>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await apiGet(`/users/${userId}/notes/${itemId}`);
      data && setItem(data.data);
    };
    fetchData();
  }, []);

  const onClickSave = async () => {
    const { data, error } = await apiPost(`/users/${userId}/notes/${itemId}`, { data: { ...item } });
  };
  return (
    <div className="p-5">
      {Object.keys(item).map((itemKey: string) => {
        return (
          <div className="flex">
            <span className="w-1/12 text-gray-500">{itemKey}</span>
            <span>{(item as any)[itemKey]}</span>
          </div>
        );
      })}
      <hr className="py-5" />

      <div>Edit Note:</div>
      <input
        className="bg-gray-200 p-2 mr-5"
        defaultValue={item.note}
        onChange={(ev: any) => {
          item.note = ev.target.value;
          setItem({ ...item });
        }}
      />
      <button onClick={onClickSave}>Save</button>
      <hr className="py-5" />
      <Link to="/home">Go Back</Link>
    </div>
  );
};
