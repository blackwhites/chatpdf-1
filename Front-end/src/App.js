
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import React from 'react';
import './App.css';

import Home from './home/home';
import Work from './work';
import Subscribe from './pay/sub';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/c/:fid" element={<Work />}></Route>
        <Route path="/book" element={<Subscribe />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
