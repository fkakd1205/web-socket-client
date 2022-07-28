import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import ChatMain from './component/chat/ChatMain';
import LoginMain from './component/login/LoginMain';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from './redux/action/user';
import { useEffect } from 'react';
import { userApiConnect } from './api/userApiConnect';
import ChannelMain from './component/channel/ChannelMain';

function App() {
  const userRdx = useSelector(state => state.userReducer);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    async function userLoginCheck() {
      await userApiConnect().loginCheck()
        .then(res => {
          if (res.status == 200) {
            dispatch(setUserInfo(res.data.data));
          }
        })
        .catch(err => {
          let res = err.response;
          if (res?.status === 500) {
            alert('undefined error.');
            return;
          }
          alert(res?.data?.memo);
        })
    }

    userLoginCheck();
  }, [location])

  return (
    <>
      {userRdx.userInfo ? (
        <Routes>
          <Route path="*" element={<ChannelMain />} />
          <Route path="/" exact element={<ChannelMain />} />
          <Route path="/chat" exact element={<ChatMain />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="*" exact element={<LoginMain />} />
        </Routes>
      )}
    </>
  )
}

export default App;
