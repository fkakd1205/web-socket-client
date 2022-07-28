import ChannelBody from "./ChannelBody";
import qs from 'query-string';
import { channelApiConnect } from "../../api/channelApiConnect";
import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatRoomMain from "../chat-room/ChatRoomMain";

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 90vh;
`;

const ChannelMain = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = qs.parse(location.search);

    const [channelList, dispatchChannelList] = useReducer(channelListReducer, initialChannelList);
    const [channelData, dispatchChannelData] = useReducer(channelDataReducer, initialChannelData);

    useEffect(() => {
        async function fetchInit() {
            await __reqSearchAllChannel();
        }

        fetchInit();
    }, [])

    // STEP 4.
    const __reqSearchAllChannel = async () => {
        await channelApiConnect().searchList()
            .then(res => {
                if(res.status === 200) {
                    dispatchChannelList({
                        type: 'INIT_DATA',
                        payload: res.data.data
                    })
                }
            })
            .catch(err => {
                let res = err.response;
                if (res?.status === 500) {
                    alert('undefined error.');
                    return;
                }
                alert(res?.data?.memo);
            });
    }

    const onActionEnterToChannel = (e) => {
        let channelId = e.target.value;
        let channel =  channelList.filter(r => r.id === channelId)[0];

        dispatchChannelData({
            type: 'INIT_DATA',
            payload: channel
        })
    }

    return (
        <Container>
            <ChannelBody
                channelList={channelList}

                onActionEnterToChannel={onActionEnterToChannel}
            ></ChannelBody>

            <ChatRoomMain
                channelData={channelData}
            ></ChatRoomMain>
        </Container>
    )
}

export default ChannelMain;

const initialChannelList = null;
const initialChannelData = null;

const channelListReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialChannelList;
        default: return {...state};
    }
}

const channelDataReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialChannelData;
        default: return {...state};
    }
}
