import { useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie'

function useToken() {

  function getToken () {
    const storageToken = localStorage?.getItem('token');
    return storageToken
  }

  const [token, setToken] = useState(getToken());

  function saveToken (userToken) {

    localStorage.setItem('token', userToken)
    setToken(userToken.token)
  }

  return {
    setToken: saveToken,
    token
  }
}

export default useToken