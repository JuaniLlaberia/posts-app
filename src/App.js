import PostContainer from "./components/PostContainer";
import Sidebar from "./components/Sidebar";
import './assets/posts.css'
import { Route, Routes } from "react-router";
import Post from "./components/Post";

function App() {
  return (
    <>
      <Sidebar/>
      <Routes>
        <Route exact path='/' element={<PostContainer/>}/>
        <Route path='/post/:id' element={<Post/>}/>
        {/* <Route path='' element={}/> */}
      </Routes>
    </>
  );
}

export default App;
