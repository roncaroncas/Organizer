import { useState } from "react";
import { useNavigate } from 'react-router-dom'


/////////////TABELA DE AMIGOS ///////////////////////////////


function AddFriendInput(){

  const [friendId, setFriendId] = useState<string>("")
  let navigate = useNavigate()

  async function addFriend(friendId: string) {

    console.log(friendId)
    
    const results = await fetch('http://localhost:8000/addFriend', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"friendId": parseInt(friendId)})
      })
    .then(data => data.json())
    // .then(data => data.blabla)

    return results
  }

  async function handleSubmit(event: any) {

    event.preventDefault() //DEVE TER UM JEITO MELHOR DO QUE ISSO AQUI 
    const response = await addFriend (friendId)
    console.log(response)

    if (response) {
      console.log("Amigo adicionado! :D")
    } else {
      console.log("Amigo nao existe :(")
    }

    navigate(0)

  }

  return(
    <form >
        <label>Adicionar Amigo</label>
        <input type="text" onChange={(e) => setFriendId(e.target.value)}/>
        <button onClick={handleSubmit}>Adicionar</button>
    </form> 
  )
}

export default AddFriendInput;