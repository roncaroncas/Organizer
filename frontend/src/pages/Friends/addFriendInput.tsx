import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function AddFriendInput() {
  const [friendId, setFriendId] = useState<string>("");
  let navigate = useNavigate();

  async function addFriend(friendId: string) {
    console.log(friendId);

    const results = await fetch('http://localhost:8000/addFriend', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "friendId": parseInt(friendId) })
    })
      .then(data => data.json());

    return results;
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    const response = await addFriend(friendId);
    console.log(response);

    if (response) {
      console.log("Amigo adicionado! :D");
    } else {
      console.log("Amigo não existe :(");
    }

    navigate(0);
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="friendId">Adicionar Amigo</label>
        <input
          type="text"
          id="friendId"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          className="input"
          placeholder="ID do amigo"
        />
        <button type="submit" className="btn">Adicionar</button>
      </form>
    </div>
  );
}

export default AddFriendInput;
