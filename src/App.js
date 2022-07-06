import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatMain from './component/chat/ChatMain';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<ChatMain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
