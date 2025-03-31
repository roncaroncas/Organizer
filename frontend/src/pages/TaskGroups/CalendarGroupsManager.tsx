import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

import useFetch from "../../hooks/useFetch"

interface GroupTask {
  id: number
  name: string;
  parentId: number;
  [key: string]: any
}

function CalendarGroupsManager() {

  // DISPLAYED GROUPS
  const [groups, setGroups] = useState<GroupTask[]>([])
  const [interactingGroup, setInteractingGroup] = useState<GroupTask>({
    id: 0,
    name: "",
    parentId: 0,
  });

  // ------FETCHES-------------- //

  const { data, /*error*,/ /*isLoading,*/ fetchData } = useFetch('http://localhost:8000/myTaskGroups', {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })

  const { data:data_addedTaskGroup, fetchData:addTaskGroup } = useFetch('http://localhost:8000/myTaskGroups', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(interactingGroup),
  })

  const { data:data_updatedTaskGroup, fetchData:updateTaskGroup } = useFetch('http://localhost:8000/updateTaskGroup', {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(interactingGroup),
  })

  const { /*data:data_deletedTaskGroup,*/ fetchData:deleteTaskGroup } = useFetch('http://localhost:8000/deleteTaskGroup', {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(interactingGroup),
  })


  useEffect(() => {
    fetchData()
  }, [])

  // GET ALL
  useEffect(() => {
    if (data) {
      setGroups(data)
    }
  }, [data])


  function clearInteractingGroup() {
    setInteractingGroup({
      id: 0,
      name: "",
      parentId: 0,
    })
  }


  async function handleSave() {
    if (!interactingGroup || !interactingGroup.name.trim()) return;

    try {
      if (interactingGroup.id) {
        await updateTaskGroup()
        const updatedGroup:GroupTask = data_updatedTaskGroup 
        setGroups(prev => prev.map(g => (g.id === updatedGroup.id ? updatedGroup : g)));
      } else {
        await addTaskGroup();
        const addedGroup:GroupTask =data_addedTaskGroup
        setGroups(prev => [...prev, addedGroup]);
      }
      clearInteractingGroup();
    } catch (error) {
      console.error("Error saving group", error);
    }
  }

  async function handleDelete(group: GroupTask) {
    if (!group.id || !window.confirm("Are you sure you want to delete this group?")) return;

    try {
      await deleteTaskGroup();
      setGroups(prev => prev.filter(g => g.id !== group.id));
      clearInteractingGroup();
    } catch (error) {
      console.error("Error deleting group", error);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setInteractingGroup(() => {
      let newInteractingGroup = { ...interactingGroup };

      if (type === "checkbox") {
        // For checkboxes, the value will be a boolean, not a string
        newInteractingGroup[name] = checked;
      } else if (type === "number") {
        // If the input type is number, parse the value to a number
        newInteractingGroup[name] = value === "" ? "" : Number(value);
      } else {
        // Default case: treat as string
        newInteractingGroup[name] = value;
      }

      return newInteractingGroup;
    });
  }


  return (
    <div>
      <Header/>

      <div className="pagebody">

        {/* -- Title -- */}
        <div className = "container"> 
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Manage Calendar Groups</h2>


          {/* -- Content --*/}
          <>
            {console.log("interactingGroup: ", interactingGroup)}
            {groups.map(group => (

              <div key={group.id} className="card-container">
                {interactingGroup?.id === group.id ? (
                  <>
                    <input type="text" name="name" value={interactingGroup.name} onChange={e => handleInputChange(e)} />

                    <select
                      value={interactingGroup.parentId || ""}
                      onChange={e => setInteractingGroup({ ...interactingGroup, parentId: parseInt(e.target.value) })}
                    >
                      <option value="">No Parent</option>
                      {groups.filter(group => group.id !== interactingGroup.id).map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                    <button className="btn accept" onClick={handleSave}>Save</button>
                    <button className="btn reject" onClick={clearInteractingGroup}>Cancel</button>
                  </>
                ) : (
                  <>
                    <strong>{group.name}</strong>
                    <p>Id: {group.id}</p>
                    <p>ParentId: {group.parentId}</p>
                    <p>ParentName: {group.parentId ? groups.find(parentGroup => parentGroup.id === group.parentId)?.name : "None"}</p>
                    <p> BLABLABLA CONFIGS </p>
                    <button className="btn accept" onClick={() => setInteractingGroup(group)}>Edit</button>
                    <button className="btn reject" onClick={() => handleDelete(group)}>Delete</button>
                  </>
                )}
              </div>

            ))}
          </>
          

          {/*NEW GROUP*/}

          <div className="card-container">
            {interactingGroup && (interactingGroup.id === undefined || interactingGroup.id === -1) ? (
              <>
                <h3 style={{ fontWeight: "bold" }}>Edit New Group</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Group Name"
                  value={interactingGroup.name}
                  onChange={e => handleInputChange(e)}
                />
                <select
                  value={interactingGroup?.parentId || ""}
                  onChange={e => setInteractingGroup({ ...interactingGroup, parentId: parseInt(e.target.value) || 0 })}
                >
                  <option value="">No Parent</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
                <button className="btn accept" onClick={handleSave}>Save Group</button>
                <button className="btn reject" onClick={clearInteractingGroup}>Cancel</button>
              </>
            ) : (
              <>
                <h3
                  style={{ fontWeight: "bold" }}
                    // Set a special id for new group
                >
                  Add New Group
                </h3>
                <button 
                  onClick={() => setInteractingGroup({ id: -1, name: "", parentId: 0 })}
                  className ="btn accept"
                >
                  Create New Group!
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default CalendarGroupsManager;
