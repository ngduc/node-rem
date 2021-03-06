import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { apiGet, getLoginData } from '../../utils/apiUtil';

export default () => {
  const { itemId } = useParams();
  const { loginData } = getLoginData();
  const [item, setItem] = React.useState([]);

  const fetchData = async () => {
    const { data, error } = await apiGet(`/users/${loginData?.data?.user?.id}/notes/${itemId}`);
    data && setItem(data.data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-5">
      <div>Selected Item: {JSON.stringify(item)}</div>

      <Link to="/home">Go Back</Link>
    </div>
  );
};
