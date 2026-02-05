// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Error from "./pages/error";
import MovieDetails from "./components/MovieDetails";

function App() {
  return (
  
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/*" element={<Error />} />
    </Routes>
  )
}

export default App;