import { BrowserRouter, Routes, Route } from "react-router-dom";

import Display from './display/Display';
import Admin from './admin/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />}/>
        <Route path="*" element={<Display />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
