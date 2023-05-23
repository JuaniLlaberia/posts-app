import PostContainer from "./components/PostContainer";
import Sidebar from "./components/Sidebar";
import './assets/posts.css'
import { Route, Routes } from "react-router";
import Post from "./components/Post";
import MyPosts from "./components/MyPosts";
import MyFavs from "./components/MyFavs";
import { useThemeContext } from "./context/ThemeContext";
import TrendingPage from "./components/TrendingPage";
import ErrorPage from "./components/ErrorPage";
import Search from "./components/Search";

function App() {
  const {theme} = useThemeContext();

  return (
    <main className={`${theme}`}>
      <Sidebar/>
      <Routes>
        <Route exact path='/' element={<PostContainer/>}/>
        <Route path='/post/:id' element={<Post/>}/>
        <Route path='/my-posts' element={<MyPosts/>}/>
        <Route path='/saved' element={<MyFavs/>}/>
        <Route path='/trending' element={<TrendingPage/>}/>
        <Route path='/search/:tag' element={<Search/>}/>
        <Route path='/*' element={<ErrorPage/>}/>
      </Routes>
    </main>
  );
}

export default App;
