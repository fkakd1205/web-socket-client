import styled from "styled-components";
import { dateToHHMM } from "../../utils/dateFormatUtils";

const ChattingBoxWrapper = styled.div`
    display: inline-block;
    width: 600px;
    background-color: var(--chat-sub-color2);
    position: relative;

    .send-box {
        width: 100%;
        position: fixed;
        bottom: -10;
        position: absolute;    
    }

    .send-message-form {
        width: 100%;
        display: flex;
    }

    .input-el {
        width: 85%;
        padding: 0 10px;
        border: 1px solid var(--chat-main-color)
    }

    .button-el {
        padding: 8px 10px;
        width: 15%;
        color: white;
        font-weight: 600;
        border: 1px solid var(--chat-main-color);
        background-color: var(--chat-main-color);
    }

    .box-title {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 30px;
        background-color: #444;
        background-color: var(--chat-main-color);
        color: white;
    }

    .message-box {
        padding: 5px;
        height: 200px;
        overflow: auto;
    }

    .message-log {
        display: flex;
        align-items: center;
        font-size: 14px;
        padding: 5px;
    }

    .message-log .sender {
        padding-right: 5px;
    }

    .message-log .send-time {
        margin-left: 10px;
        font-size: 12px;
        color: #888888;
    }

    .send-box {
        
    }
`;

const ChatRoomBody = (props) => {
    return (
        <ChattingBoxWrapper>
            <div>
                <div className='box-title'>{props.chatRoom.title}</div>
                <div className='message-box'>
                    {props.chattingLog?.map((r, idx) => {
                        return (
                            <div key={'chatting-log-idx' + idx} className='message-log'>
                                <div className='sender'>{r.name} : </div>
                                <div className='content'>{r.content}</div>
                                <div className='send-time'>{dateToHHMM(r.dateTime)}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='send-box' onSubmit={props.onSubmitSendMessageToRoom}>
                <form className='send-message-form'>
                    <input
                        type='text'
                        className='input-el'
                        name='content'
                        onChange={props.onChangeSendMessageValue}
                        value={props.sendMessage?.content || ''} />
                    <button
                        type='submit'
                        className='button-el'
                    >전송</button>
                </form>
            </div>
        </ChattingBoxWrapper>
    )
}

export default ChatRoomBody;