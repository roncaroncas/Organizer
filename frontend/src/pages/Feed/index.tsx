import {useEffect, useState} from "react";

import { format } from 'date-fns';

import Header from "../../components/Header";
import useFetch from "../../hooks/useFetch";


interface Post {
  id?: number
  authorName?: string
  authorId: number
  groupPostId?: number
  text: string
  timestamp?: string
}

function Feed ({ removeCookie }:{removeCookie:any})  {


  let [newPost, setNewPost] = useState<Post>({
    text: ""
  });


  // ----- FETCHS ----- //

  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/posts/getAll', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const { data:data_post, error:error_post, isLoading:isLoading_post, fetchData:fetchData_post } = useFetch('http://localhost:8000/posts/addNew', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost)
  });

  let [feed, setFeed] = useState([])

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setFeed(data);
    }
  }, [data]);


  // --- LOG ---!
  useEffect(() => {
    if (feed) {
      console.log(feed);
    }
  }, [feed]);


// --------------EVENT HANDLERS----------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // const [tempFormValues, setTempFormValues] = useState({
    //   startDay: format(task.startDayTime, "yyyy-MM-dd"), // Pre-fill with initial value
    //   endDay: format(task.endDayTime, "yyyy-MM-dd")
    // })

    const { name, value, type, checked } = e.target;

    // console.log(name, value, type, checked)

    setNewPost(prevPost => {
      let newPost = { ...prevPost };

    if (type === "checkbox") {
        newPost[name] = checked;
      } else {
        newPost[name] = value;
      }
      return newPost;    

    });
  };

  // ----------------------------------------------------


  let handleSubmit = async () => {
    await fetchData_post() //MANDA O NOVO POST PRO DB
    await fetchData() // LE OS POSTS DE NOVO DO DB!
    console.log(newPost)
  }


  let structuredFeed = feed.map((post) => {

    return (
      <div key={post.id} className="card-container">
        <a href={"/profile/"+post.authorId}> <strong> {post.authorName} </strong> </a>
        <p> {format(post.timestamp, "dd/MM/yy - HH:mm")}</p>
        <p> {post.text} </p>
      </div>
      )
  })



  return (
    <div>

      <Header removeCookie={removeCookie}/>

      <div className="pagebody">

        {/* --- Novo Post --- */}
        <div className="card-container">
          <h3> O que você está pensando? </h3>
          <input type="text" name="text" onChange={handleInputChange}/> {/*name='text' é o novo da variável do newPost!!*/}

          <button className ="btn accept" onClick={handleSubmit}>
            Publicar!
          </button>
        </div>

        <div className="container">
          <h3> Meu Feed! </h3>      
          {structuredFeed}
          <br/>

        </div>
       


      </div>
   
    </div>
  )
};

export default Feed;
