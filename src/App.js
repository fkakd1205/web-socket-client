import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatMain from './component/chat/ChatMain';
import LoginMain from './component/login/LoginMain';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" exact element={<ChatMain />} />
        <Route path="/" exact element={<LoginMain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
