import { NextPage } from "next";

interface BoardParams {
  id: string;
}

const BoardPage: NextPage<{ params: BoardParams }> = ({ params }) => {
  const boardId = params.id;
  return <h1>This is board with ID {boardId}</h1>;
};

export default BoardPage;
