import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { apiGet, getLoginData } from '../../utils/apiUtil';

export default () => {
  const { itemId } = useParams();
  const { userId } = getLoginData();
  const [item, setItem] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await apiGet(`/users/${userId}/notes/${itemId}`);
      data && setItem(data.data);
    };
    fetchData();
  }, []);

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
      <Link to="/home">Go Back</Link>
    </div>
  );
};
