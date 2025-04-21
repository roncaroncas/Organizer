import { useContext } from 'react'
import { CookieContext } from '../../App';

function SidebarProfile () {

  const { removeCookie } = useContext(CookieContext);

  function handleLogout() {
    removeCookie('token');
  }

  return(
  <ul>

    <li>
      <a href="/profile" style={{cursor: "pointer"}}>
        Perfil
      </a>
    </li>

    <li>
      <a onClick={handleLogout} style={{cursor: "pointer"}}>
        Logout
      </a>
    </li>

  </ul>
  )
}

export default SidebarProfile




