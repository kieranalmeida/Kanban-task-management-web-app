import {BrowserRouter, Routes, Route} from "react-router-dom"
// Components
import Layout from "./components/Layout"
import Board from "./components/Board"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Board />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
