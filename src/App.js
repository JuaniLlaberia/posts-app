import PostContainer from "./components/PostContainer";
import Sidebar from "./components/Sidebar";
import './assets/posts.css'
import { Route, Routes } from "react-router";
import Post from "./components/Post";
import MyPosts from "./components/MyPosts";
import MyFavs from "./components/MyFavs";
import { useThemeContext } from "./context/ThemeContext";

function App() {
  const {theme} = useThemeContext();

  return (
    <body className={`${theme}`}>
      <Sidebar/>
      <Routes>
        <Route exact path='/' element={<PostContainer/>}/>
        <Route path='/post/:id' element={<Post/>}/>
        <Route path='/my-posts' element={<MyPosts/>}/>
        <Route path='/saved' element={<MyFavs/>}/>
      </Routes>
    </body>
  );
}

export default App;
