import { useState } from 'react';

export default function useToken() {

  function getToken () {
    const storageToken = localStorage?.getItem('token');
    // console.log("lido do storage: " + storageToken)
    return storageToken
  }

  const [token, setToken] = useState(getToken());

  // console.log("useState foi acionado!")

  function saveToken (userToken) {

    localStorage.setItem('token', userToken)
    setToken(userToken.token)
    // console.log("setToken chamado!")

  }

  return {
    setToken: saveToken,
    token
  }
}