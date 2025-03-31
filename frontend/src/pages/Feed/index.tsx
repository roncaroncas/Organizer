import {useEffect, useState} from "react";

import { format } from 'date-fns';

import Header from "../../components/Header";
import useFetch from "../../hooks/useFetch";
import useForm from "../../hooks/useForm";

interface Post {
  id: number,
  authorName: string,
  authorId: number,
  groupPostId: number,
  text: string,
  timestamp: string,
  type: string,
}

interface FormData {
  text: string

}


// -------- FORMATED VALUE FOR API ------- //

const formatTaskForAPI = (values: FormData): Post => {

  let p:Post = {
    id: 0,
    authorName: "",
    authorId: 0,
    groupPostId: 0,
    text: values.text,
    timestamp: "",
    type: "",
  }
  
  return p;
};

function Feed ()  {


  // let [newPost, setNewPost] = useState<Post>({text: ""})
  let [deletedPostId, setDeletedPostId] = useState<number>(0)
  let [feed, setFeed] = useState([])

  const { formValues, handleInputChange, /*getFormattedData */} = useForm<FormData>(
    {
      text: "",
    },
    formatTaskForAPI
  );


  // ----- FETCHES ----- //

  //Fetch all
  const { data, /*error, isLoading,*/ fetchData } = useFetch('http://localhost:8000/posts/getAll', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  //Add new Post
  const { /*data:data_post, error:error_post, isLoading:isLoading_post,*/ fetchData:fetchData_post } = useFetch('http://localhost:8000/posts/addNew', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formatTaskForAPI(formValues))
  });

  //Delete post
  const { /*data: data_delete, error: error_delete, isLoading: isLoading_delete,*/ fetchData: fetchData_delete } = useFetch(`http://localhost:8000/posts/delete/${deletedPostId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setFeed(data);
    }
  }, [data]);

  useEffect(() => {
    if (deletedPostId !== 0) {
      
      // Delete the post first
      fetchData_delete().then(() => {
        // After deletion, refetch the posts and update the state with the new feed
        fetchData().then(() => {
          setDeletedPostId(0); // Reset the deletedPostId after fetching new data
        });
      });
    }
  }, [deletedPostId]);




// --------------EVENT HANDLERS----------------------




  let handleSubmit = async () => {
    await fetchData_post() //MANDA O NOVO POST PRO DB
    await fetchData() // LE OS POSTS DE NOVO DO DB!
  }

  let handleDeletePost = (postId: number) => {
    setDeletedPostId(postId)
    console.log("finge que deletei!" + postId.toString())
  }


  let structuredFeed = feed.map((post: Post) => {

    return (
      <div key={post.id} className="card-container">
        <a href={"/profile/"+post.authorId}> <strong> {post.authorName} </strong> </a>
        <p> {format(post.timestamp, "dd/MM/yy - HH:mm")}</p>
        <p> {post.text} </p>
        { post.type == "self" && 
        <button className="btn reject" onClick={() => handleDeletePost(post.id)}> Excluir! </button>
        }
      </div>
      )
  })



  return (
    <div>

      <Header/>

      <div className="pagebody">

        {/* --- Novo Post --- */}
        <div className="card-container">
          <form onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission
              handleSubmit(); // Trigger delete when form is submitted
            }}>
            <h3> O que você está pensando? </h3> 


            <input type="text" name="text" value={formValues.text} onChange={handleInputChange}/> {/*name='text' é o novo da variável do formValues!!*/}

            <button className ="btn accept">
              Publicar!
            </button>
          </form>
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
