import styled from "styled-components";

const Container = styled.div`
    width: 40%;
    display: inline-block;
`;

const ChannelBoxWrapper = styled.div`
    width: 80%;
    margin: 0 auto;
    position: relative;
    text-align: center;

    .channel-box-title {
        font-size: 1.2rem;
        font-weight: 700;
    }

    .channel-box {
        padding: 10px;
        display: flex;
        flex-direction: column;
        place-content: center;
        width: 80%;
        margin: 0 auto;
    }

    .button-el {
        width: 100%;
        background-color: var(--chat-main-color);
        border: 1px solid var(--chat-main-color);
        color: var(--chat-sub-color2);
        border-radius: 5px;
        padding: 5px;
        margin: 5px 0;
        font-size: 1rem;
        font-weight: 600;
        transition: 0.1s;

        :hover{
            cursor: pointer;
            background-color: var(--chat-sub-color1);
            border: 1px solid var(--chat-sub-color1);
        }
    }
`;




const ChannelBody = (props) => {
    return(
        <Container>
            <ChannelBoxWrapper>
                <div className='channel-box-title'>-- 채팅방 리스트 --</div>
                <div className='channel-box'>
                    {props.channelList?.map((r, idx) => {
                        return (
                            <div key={'channel-idx' + idx}>
                                <button
                                    type='button'
                                    className='button-el'
                                    value={r.id}
                                    onClick={props.onActionEnterToChannel}
                                >{r.title}</button>
                            </div>
                        )
                    })}
                </div>
            </ChannelBoxWrapper>
        </Container>
    )
}

export default ChannelBody;