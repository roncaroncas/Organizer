import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

import useFetch from "../../hooks/useFetch"

interface GroupTask {
  id?: number
  name: string;
  parentId: number;
}

function CalendarGroupsManager() {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState<GroupTask>({id: null, name: "", parentId: 0});
  const [editingGroup, setEditingGroup] = useState(null);
  const [editValues, setEditValues] = useState<GroupTask>({id: null, name: "", parentId: 0});

  // Fetch data from the backend when the component mounts


  // const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/myTaskGroups', {
  //   method: "GET",
  //   credentials: "include",
  //   headers: { "Content-Type": "application/json" },
  // })

  useEffect(() => {
    fetch('http://localhost:8000/myTaskGroups', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setGroups(data)
    })
  }, [])

  // // Use this effect to log `groups` after it's updated
  // useEffect(() => {
  //   console.log(groups);  // This will log after groups state is updated
  // }, [groups]);


  // Handle adding a new group
  async function addGroup() {
    if (!newGroup.name.trim()) return

    try {

      // console.log("newGroup.name: ", newGroup.name)
      // console.log("newGroup: ", newGroup)

      console.log(newGroup)
      const response = await fetch('http://localhost:8000/addTaskGroup', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
      });

      const data = await response.json();
      console.log("Chamei algo aqui!: ", data)
      setGroups(prevGroups => [...prevGroups, data]);; // Update state with the new group data
      setNewGroup({ id: null, name: "", parentId: null }); // Reset newGroup after submission
    } catch (error) {
      console.error('Error adding group', error);
    }
  }

  // Handle updating an existing group
  async function updateGroup(id) {
    try {

      console.log(editValues)
      const response = await fetch('http://localhost:8000/updateTaskGroup', {
        method: 'PUT',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues)
      });
      const data = await response.json();
      console.log("Chamei algo aqui!")
      setGroups(groups.map(group => group.id === id ? data : group));
      setEditingGroup(null);
    } catch (error) {
      console.error('Error updating group', error);
    }
  }

  // Handle deleting a group
  async function deleteGroup(id) {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        console.log(id)
        await fetch("http://localhost:8000/deleteTaskGroup", {
          method: 'DELETE',
          credentials: "include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({id})
          });
          setGroups(groups.filter(group => group.id !== id));
      } catch (error) {
        console.error('Error deleting group', error);
      }
    }
  }

  // Handle start editing a group
  function startEditing(group) {
    setEditingGroup(group.id);
    if (group.id) {
       setEditValues({id: group.id, name: group.name, parentId: group.parentId });
     } else {
       setEditValues({id: null, name: group.name, parentId: group.parentId });
     }
   
  }

  return (
    <div>
      <Header/>

      <div className="pagebody">

        {/* -- Title -- */}
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Manage Calendar Groups</h2>


        {/* -- Content --*/}
        <div>
          {groups.map(group => (
            <div key={group.id} className="card-container">
              {editingGroup === group.id ? (
                <div>
                  <input style={{ width: "100%", padding: "8px", marginBottom: "8px", border: "1px solid #ccc" }} value={editValues.name} onChange={e => setEditValues({ ...editValues, name: e.target.value })} />

                  <select
                    style={{ width: "100%", padding: "8px", marginBottom: "8px", border: "1px solid #ccc" }}
                    value={editValues.parentId || ""}
                    onChange={e => setEditValues({ ...editValues, parentId: e.target.value || null })}
                  >
                    <option value="">No Parent</option>
                    {groups.filter(group => group.id !== editingGroup).map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                  <button style={{ backgroundColor: "green", color: "white", padding: "8px", marginRight: "8px", border: "none", cursor: "pointer" }} onClick={() => updateGroup(group.id)}>Save</button>
                  <button style={{ backgroundColor: "gray", color: "white", padding: "8px", border: "none", cursor: "pointer" }} onClick={() => setEditingGroup(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>{group.name}</strong>
                  <p>Id: {group.id}</p>
                  <p>ParentId: {group.parentId}</p>
                  <p>ParentName: {group.parentId ? groups.find(parentGroup => parentGroup.id === group.parentId)?.name : "None"}</p>
                  <p> BLABLABLA CONFIGS </p>
                  <button style={{ backgroundColor: "blue", color: "white", padding: "5px", marginRight: "8px", border: "none", cursor: "pointer" }} onClick={() => startEditing(group)}>Edit</button>
                  <button style={{ backgroundColor: "red", color: "white", padding: "5px", border: "none", cursor: "pointer" }} onClick={() => deleteGroup(group.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="card-container">
          <h3 style={{ fontWeight: "bold" }}>Add New Group</h3>
          <input style={{ width: "100%", padding: "8px", marginBottom: "8px", border: "1px solid #ccc" }} placeholder="Group Name" value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} />
          <select
            style={{ width: "100%", padding: "8px", marginBottom: "8px", border: "1px solid #ccc" }}
            value={newGroup.parentId || ""}
            onChange={e => setNewGroup({ ...newGroup, parentId: e.target.value || null })}
          >
            <option value="">No Parent</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
          <button style={{ backgroundColor: "blue", color: "white", padding: "10px", width: "100%", border: "none", cursor: "pointer" }} onClick={addGroup}>Add Group</button>
        </div>
      </div>
    </div>
  );
}

export default CalendarGroupsManager;
