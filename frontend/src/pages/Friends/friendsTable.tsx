import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

interface Friend {
  friendId: string;
  friendName: string;
  status: string;
  statusNmbr: number;
}

function FriendsTable() {
  let navigate = useNavigate();
  const [friendList, setFriendList] = useState<Friend[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/myFriends', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setFriendList(data);
      });
  }, []);

  function handleUnfriendClick(f_id: string) {
    fetch('http://localhost:8000/deleteFriend', {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "friendId": f_id })
    });

    navigate(0);
  }

  function handleAcceptFriendClick(f_id: string) {
    fetch('http://localhost:8000/acceptFriend', {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "friendId": f_id })
    });

    navigate(0);
  }

  const structuredFriends = friendList.map((friend: Friend) => {
    let f_id = friend.friendId;
    let goodMsg = null;
    let badMsg = null;

    if (friend.statusNmbr === 1) {
      goodMsg = (
        <td>
          <button className="table-actions accept" onClick={() => handleAcceptFriendClick(f_id)}>
            Accept Friendship
          </button>
        </td>
      );
      badMsg = (
        <td>
          <button className="table-actions reject" onClick={() => handleUnfriendClick(f_id)}>
            Reject Friendship
          </button>
        </td>
      );
    } else if (friend.statusNmbr === 2) {
      goodMsg = <td />;
      badMsg = (
        <td>
          <button className="table-actions cancel" onClick={() => handleUnfriendClick(f_id)}>
            Cancel Invitation
          </button>
        </td>
      );
    } else {
      goodMsg = <td />;
      badMsg = (
        <td>
          <button className="table-actions remove" onClick={() => handleUnfriendClick(f_id)}>
            Remove Friendship
          </button>
        </td>
      );
    }

    return (
      <tr key={friend.friendId}>
        <td>{friend.friendId}</td>
        <td>
          <a href={`/profile/${friend.friendId}`} className="friend-link">
            {friend.friendName}
          </a>
        </td>
        <td>{friend.status} ({friend.statusNmbr})</td>
       
        {goodMsg}
        {badMsg}
      </tr>
    );
  });

  return (
    <div className="container">
      <h2>Friends List</h2>
      <table className="friends-table">
        <thead>
          <tr>
            <th>Friend ID</th>
            <th>Friend Name</th>
            <th>Friend Status</th>
            <th>Actions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{structuredFriends}</tbody>
      </table>
    </div>
  );
}

export default FriendsTable;
