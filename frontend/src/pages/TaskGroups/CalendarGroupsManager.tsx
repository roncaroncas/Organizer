import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

import useFetch from "../../hooks/useFetch"

interface GroupTask {
  id?: number
  name: string;
  parentId: number;
}

function CalendarGroupsManager() {

  // DISPLAYED GROUPS
  const [groups, setGroups] = useState<GroupTask[]>([])

  // UNIFICAR OS QUATRO ESTADOS ABAIXO
  // const [currentId, setCurrentId] = useState<number>(-1)
  // const [newGroup, setNewGroup] = useState<GroupTask>({id: undefined, name: "", parentId: 0});
  // const [editingGroup, setEditingGroup] = useState<number>(undefined);
  // const [editValues, setEditValues] = useState<GroupTask>({id: undefined, name: "", parentId: 0});

  const [interactingGroup, setInteractingGroup] = useState<GroupTask | null>(null);

  // ------FETCHES-------------- //

  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/myTaskGroups', {
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

  const { data:data_deletedTaskGroup, fetchData:deleteTaskGroup } = useFetch('http://localhost:8000/deleteTaskGroup', {
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


  // // ADD NEW
  // useEffect(() => {
  //   if (data_addedTaskGroup) { // Ensure it's valid before updating state
  //     setGroups(prevGroups => [...prevGroups, data_addedTaskGroup]);
  //   }
  // }, [data_addedTaskGroup]);

  // // UPDATE
  // useEffect(() => {
  //   setGroups(groups.map(group => group.id === data_updatedTaskGroup.id ? data_updatedTaskGroup : group))
  // }, [data_updatedTaskGroup])

  // // DELETE
  // useEffect(() => {
  //   setGroups(groups.filter(group => group.id !== currentId))
  // }, [data_deletedTaskGroup])
  

  // Handle adding a new group
  // async function addGroup() {
  //   if (!newGroup.name.trim()) return

  //   try {
  //     addTaskGroup()
  //   } catch (error) {
  //     console.error('Error adding group', error);
  //   }
  // }

  // // Handle updating an existing group
  // async function updateGroup(id: number) {
  //   setCurrentId(id)
  //   try {
  //     updateTaskGroup()
  //   } catch (error) {
  //     console.error('Error updating group', error);
  //   }
  // }

  // // Handle deleting a group
  // async function deleteGroup(id: number) {
  //   setCurrentId(id)
  //   if (window.confirm("Are you sure you want to delete this group?")) {
  //     try {
  //       deleteTaskGroup();
  //     } catch (error) {
  //       console.error('Error deleting group', error);
  //     }
  //   }
  // }

  // Handle start editing a group
  function startEditing(group: GroupTask) {
    setInteractingGroup(group)
    // setEditingGroup(group.id);
    // if (group.id) {
    //    setEditValues({id: group.id, name: group.name, parentId: group.parentId });
    //  } else {
    //    setEditValues({id: undefined, name: group.name, parentId: group.parentId });
    //  }
  }


  async function handleSave() {
    if (!interactingGroup || !interactingGroup.name.trim()) return;

    try {
      if (interactingGroup.id) {
        const updatedGroup = await updateGroup(interactingGroup);
        setGroups(prev => prev.map(g => (g.id === updatedGroup.id ? updatedGroup : g)));
      } else {
        const addedGroup = await saveGroup(interactingGroup);
        setGroups(prev => [...prev, addedGroup]);
      }
      setInteractingGroup(null);
    } catch (error) {
      console.error("Error saving group", error);
    }
  }

  async function handleDelete(group: GroupTask) {
    if (!group.id || !window.confirm("Are you sure you want to delete this group?")) return;

    try {
      await deleteGroup({ id: group.id });
      setGroups(prev => prev.filter(g => g.id !== group.id));
      setInteractingGroup(null);
    } catch (error) {
      console.error("Error deleting group", error);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value, type, checked } = event.target;

    setInteractingGroup(prevUserData => {
      let newInteractingGroup = { ...interactingGroup };

      if (type === "checkbox") {
          newInteractingGroup[name] = checked;
        } else {
          newInteractingGroup[name] = value;
        }
        return newInteractingGroup;    

    })
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
                      onChange={e => setInteractingGroup({ ...interactingGroup, parentId: e.target.value || undefined })}
                    >
                      <option value="">No Parent</option>
                      {groups.filter(group => group.id !== interactingGroup.id).map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                    <button className="btn accept" onClick={handleSave}>Save</button>
                    <button className="btn reject" onClick={() => setInteractingGroup(null)}>Cancel</button>
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
                  onChange={e => setInteractingGroup({ ...interactingGroup, parentId: e.target.value || undefined })}
                >
                  <option value="">No Parent</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
                <button className="btn accept" onClick={handleSave}>Save Group</button>
                <button className="btn reject" onClick={() => setInteractingGroup(null)}>Cancel</button>
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
                  onClick={() => setInteractingGroup({ id: -1, name: "", parentId: undefined })}
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
