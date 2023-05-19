import PostContainer from "./components/PostContainer";
import Sidebar from "./components/Sidebar";
import './assets/posts.css'
import { Route, Routes } from "react-router";
import Post from "./components/Post";
import MyPosts from "./components/MyPosts";
import MyFavs from "./components/MyFavs";

function App() {
  return (
    <>
      <Sidebar/>
      <Routes>
        <Route exact path='/' element={<PostContainer/>}/>
        <Route path='/post/:id' element={<Post/>}/>
        <Route path='/my-posts' element={<MyPosts/>}/>
        <Route path='/saved' element={<MyFavs/>}/>
      </Routes>
    </>
  );
}

export default App;
