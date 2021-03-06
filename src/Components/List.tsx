import React, { useState } from "react";
import styled from "../styles/typed-components";
import { useQuery, useMutation } from "react-apollo";
import { GET_ROOMS, CREATE_ROOM, ADD_ROOM_USER } from "../Queries/RoomQueries";
import Title from "./Title";
import Button from "./Button";
import { toast } from "react-toastify";
import { GET_MY_PROFILE } from "../Queries/UserQueries";
import Skeleton from "./Skeleton";

const Container = styled.div`
  display: flex;
  border-radius: 5px;
  width: 400px;
  height: 400px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 10px 19px rgba(0, 0, 0, 0.22);
  background-color: #f4f4f5;
  margin-top: 20px;
  flex-direction: column;
`;
const Loading = styled.div`
  background-color: red;
`;
const Header = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
`;
const RoomListContainer = styled.div`
  overflow-y: auto;
  height: 100%;
  width: 100%;
  padding: 10px;
`;
interface IProps {
  currentRoom: string;
  roomData: any;
  handleClick?: (roomId: string) => void;
  user?: string;
  refetch?: any;
}
const List: React.SFC<IProps> = ({
  roomData,
  user,
  handleClick,
  refetch: roomRefetch,
  currentRoom,
}) => {
  const { data, loading } = useQuery(GET_MY_PROFILE, { variables: { username: user } });

  const [createRoomMutation] = useMutation(CREATE_ROOM);
  const [addRoomUserMutation] = useMutation(ADD_ROOM_USER);
  const onClick = async () => {
    try {
      const newRoom = await createRoomMutation();
      if (!newRoom.data) throw Error();
      const roomId = newRoom.data.createRoom.id;
      if (!roomId) throw Error();

      const success = await addRoomUserMutation({
        variables: {
          roomId: roomId,
          userId: data.getMyProfile.id,
        },
      });
      await roomRefetch();
      if (handleClick) handleClick(roomId);
    } catch (e) {
      toast.error(e);
    }
  };
  return (
    <Container>
      {loading && !roomData ? (
        <Skeleton width={"400"} height={"400"} />
      ) : (
        <>
          <Header>
            <Button onClick={onClick} text={"방 만들기"} />
          </Header>
          <RoomListContainer>
            {roomData?.map((room: any) => (
              <Title
                key={room.id}
                users={room.userConnection}
                messages={room.messages}
                handleClick={handleClick}
                roomId={room.id}
                currentRoom={currentRoom}
              />
            ))}
          </RoomListContainer>
        </>
      )}
    </Container>
  );
};

export default List;
