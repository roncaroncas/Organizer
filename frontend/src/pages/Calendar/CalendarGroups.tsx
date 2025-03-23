import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import useFetch from "../../hooks/useFetch";

//----------------

interface GroupTask {
  id: number;
  name: string;
  parentId: number | null
  [key: string]: any;
}

//---------------

function CalendarGroups() {
  // DISPLAYED GROUPS
  const [groups, setGroups] = useState<GroupTask[]>([]);
  
  // ------FETCHES-------------- //
  const { data, fetchData } = useFetch('http://localhost:8000/myTaskGroups', {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data)
      setGroups(data);
    }
  }, [data]);

  // Build a tree structure from flat data
  const buildTree = (groups: GroupTask[]) => {

    const map: { [key: number]: GroupTask } = {};
    const roots: GroupTask[] = [];

    // Build a map of all group tasks
    groups.forEach((group) => {
      map[group.id] = { ...group, children: [] };
    });

    // Now, build the tree by assigning children to the parent
    groups.forEach((group) => {
      if (group.parentId === null || group.parentId === 0) {
        roots.push(map[group.id]);
      } else {
        map[group.parentId]?.children.push(map[group.id]);
      }
    });

    return roots;
  };

  const renderTree = (node: GroupTask) => (
    <div key={node.id}>
      <label>
        <input type="checkbox" value={node.name} />
        ({node.id}) {node.name}
      </label>''
      {node.children.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          {node.children.map((child) => renderTree(child))}
        </div>
      )}
    </div>
  );

  // Build the tree structure from the flat list
  const treeData = buildTree(groups);

  return (
    <div className="checkbox-group">
      <h3>
        Calendar Groups <a href="/taskGroups">⚙️</a>
      </h3>
      {treeData.map((root) => renderTree(root))}
    </div>
  );
}

export default CalendarGroups;
