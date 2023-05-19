import PostContainer from "./components/PostContainer";
import Sidebar from "./components/Sidebar";
import './assets/posts.css'
import { Route, Routes } from "react-router";
import Post from "./components/Post";
import MyPosts from "./components/MyPosts";

function App() {
  return (
    <>
      <Sidebar/>
      <Routes>
        <Route exact path='/' element={<PostContainer/>}/>
        <Route path='/post/:id' element={<Post/>}/>
        <Route path='/my-posts' element={<MyPosts/>}/>
      </Routes>
    </>
  );
}

export default App;
