import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";

//----------------

interface Tempo {
  id: number;
  name: string;
  parentId: number | null
  [key: string]: any;
}

//---------------

function CalendarTempos() {
  // DISPLAYED GROUPS
  const [tempos, setTempos] = useState<Tempo[]>([]);
  
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
      setTempos(data);
    }
  }, [data]);

  // Build a tree structure from flat data
  const buildTree = (tempos: Tempo[]) => {

    const map: { [key: number]: Tempo } = {};
    const roots: Tempo[] = [];

    // Build a map of all tempo tasks
    tempos.forEach((tempo) => {
      map[tempo.id] = { ...tempo, children: [] };
    });

    // Now, build the tree by assigning children to the parent
    tempos.forEach((tempo) => {
      if (tempo.parentId === null || tempo.parentId === 0) {
        roots.push(map[tempo.id]);
      } else {
        map[tempo.parentId]?.children.push(map[tempo.id]);
      }
    });

    return roots;
  };

  const renderTree = (node: Tempo) => (
    <div key={node.id}>
      <label>
        <input type="checkbox" value={node.name} />
        ({node.id}) {node.name}
      </label>''
      {node.children.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          {node.children.map((child: Tempo) => renderTree(child))}
        </div>
      )}
    </div>
  );

  // Build the tree structure from the flat list
  const treeData = buildTree(tempos);

  return (
    <div className="checkbox-tempo">
      <h3>
        Tempos <a href="/taskGroups">⚙️</a>
      </h3>
      {treeData.map((root) => renderTree(root))}
    </div>
  );
}

export default CalendarTempos;
