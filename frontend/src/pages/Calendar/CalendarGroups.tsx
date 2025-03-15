
import React, {useState, useRef, useEffect} from 'react'




function CalendarGroups () {


	const [taskGroups, setTaskGroups] = useState<{ id: number; name: string }[]>([
		{id: 1, name: "Group 1"}, 
		{id: 2, name: "Group 2"}, 
		{id: 3, name: "Group 3"},
	]) /*Dummy Values*/

	return (
	<div className="checkbox-group">
      <h3>Calendar Groups <a href="/taskGroups">⚙️</a></h3>
      	{taskGroups.map((group) => (
      	<div key={group.id}>
			<label>
	      		<input type="checkbox" value={group.name}/>
	      		{group.name}
	      	</label>
      	</div>)
      	)}
   	</div>)

}

export default CalendarGroups