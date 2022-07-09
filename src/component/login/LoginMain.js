import styled from "styled-components";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { userApiConnect } from "../../api/userApiConnect";

const Container = styled.div`
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%,-50%);
    width: 40%;

    @media screen and (max-width: 992px) {
        width: 90%;
    }

    .title {
        width: 100%;
        font-weight: 500;
        font-size: 1.4rem;
        text-align: center;
        margin-bottom: 40px;
    }

    .form-wrapper {
        margin-bottom: 4%;
    }

    .flex-box {
        display: flex;
        flex-direction: column;
        row-gap: 12px;
    }

    input {
        width: 100%;
        padding: 12px;
        border-width: 0;
        border: 1px solid #bcbcbc;
        border-radius: 5px;
        box-sizing: border-box;
    }

    button {
        width: 100%;
        padding: 12px;
        background: #000;
        border:1px solid #000;
        border-radius: 5px;
        color:white;
        font-weight: 600;
        font-size: 1rem;

        :hover {
            cursor: pointer;
        }
    }

    .service-box{
        text-align: right;
    }

    .move-page-btn {
        font-size: 14px;
        color: #000;
    }
`;

const LoginMain = () => {
    const [loginData, dispatchLoginData] = useReducer(loginDataReducer, initialLoginDataReducer);
    const navigate = useNavigate();

    const _onSubmit_postLogin = async (e) => {
        e.preventDefault();

        await __reqPostLogin();
    }

    const onChangeLoginData = (e) => {
        dispatchLoginData({
            type: 'CHANGE_DATA',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        });
    }

    // 피아르 로그인
    const __reqPostLogin = async () => {
        await userApiConnect().postLogin(loginData)
            .then(res => {
                if (res?.status === 200 && res?.data?.message === 'success') {
                    navigate('/chat');
                }
            })
            .catch(err => {
                let res = err.response;
                alert(res?.data?.memo);
            })
    }
    
    return (
        <Container>
            <form className='form-wrapper' onSubmit={(e) => _onSubmit_postLogin(e)}>
                <div className='title'>Login</div>
                <div className='flex-box'>
                    <div>
                        <input
                            type='text'
                            name='username'
                            onChange={(e) => onChangeLoginData(e)}
                            value={loginData?.username || ''}
                            required>
                        </input>
                    </div>
                    <div>
                        <input
                            type='password'
                            name='password'
                            onChange={(e) => onChangeLoginData(e)}
                            value={loginData?.password || ''}
                            required>
                        </input>
                    </div>
                    <div>
                        <button type='submit'>로그인</button>
                    </div>
                </div>
            </form>
        </Container>
    )
}

export default LoginMain;

const initialLoginDataReducer = null;

const loginDataReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CHANGE_DATA':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case 'CLEAR':
            return initialLoginDataReducer;
        default: return { ...state }
    }
}
