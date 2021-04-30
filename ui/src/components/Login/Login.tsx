import React from 'react';
import LoginBox from './LoginBox';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../utils/apiUtil';
import './LoginBox.css';

export function Login({ onLogin }: { onLogin?: () => void }) {
  const [errorMsg, setErrorMsg] = React.useState('');
  const navigate = useNavigate();

  const onSubmit = async (formData: any) => {
    const { username: email, password, name } = formData;
    let err = null;
    let apiData = null;

    if (name) {
      const { data, error } = await apiPost('/auth/register', { data: { email, password, name } });
      err = error;
      apiData = data;
    } else {
      const { data, error } = await apiPost('/auth/login', { data: { email, password } });
      err = error;
      apiData = data;
    }

    if (apiData?.data?.token) {
      localStorage.setItem('ld', btoa(JSON.stringify(apiData))); // save to localStorage in base64
      navigate('/home');
      if (onLogin) {
        onLogin();
      }
    } else {
      console.log('ERROR: ', err);
      setErrorMsg(err?.message || '');
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center text-white bg-gradient-to-br from-gray-600 via-teal-700 to-gray-800">
      <div className="flex items-center p-4">
        <LoginBox labels={['Email', 'Password']} onSubmit={onSubmit} />

        {errorMsg && <div data-id="login-error">{errorMsg}</div>}
      </div>
    </div>
  );
}
