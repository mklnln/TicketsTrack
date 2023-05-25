import { useState } from "react";
import { styled } from "styled-components";

interface SeatsGridProps {
  chosenSeat: string;
  setChosenSeat: (seat: string) => void;
}

const SeatsGrid: React.FC<SeatsGridProps> = ({ chosenSeat, setChosenSeat }) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // todo reflect current state of the backend
  //   useEffect(() => {
  //     // TODO: GET seating data for selected flight
  //     setSelectedSeat("");
  //     fetch(`/api/get-flight/${selectedFlight}`).then((res) =>
  //       res.json().then((data) => {
  //         setSeating(data.data);
  //       })
  //     );
  //   }, [selectedFlight]);

  const handleChooseSeat = (e: React.MouseEvent<HTMLButtonElement>) => {
    const seat = e.currentTarget.getAttribute("data-seat-value");
    if (seat) {
      setChosenSeat(seat);
    }
  };
  return (
    <>
      {rows.map((row) => {
        return (
          <RowDiv key={`row-${row}`}>
            {seatNums.map((seat) => {
              return (
                <SingleSeat
                  key={`${row}-${seat}`}
                  onClick={handleChooseSeat}
                  data-seat-value={`${row}-${seat}`}
                >
                  <span>{`${row}-${seat}`}</span>
                </SingleSeat>
              );
            })}
          </RowDiv>
        );
      })}
      <h1>{chosenSeat}</h1>
    </>
  );
};

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px dashed yellowgreen;
`;

const SingleSeat = styled.button`
  height: 60px;
  width: 60px;
  border: 1px solid fuchsia;
  padding: 0px;
`;

export default SeatsGrid;
