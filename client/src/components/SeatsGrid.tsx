import { useState, useEffect } from "react";
import { styled } from "styled-components";
interface SeatsGridProps {
  chosenSeat: string;
  setChosenSeat: (seat: string) => void;
}

const SeatsGrid: React.FC<SeatsGridProps> = ({ chosenSeat, setChosenSeat }) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  interface seatsDBObject {
    id: String;
    isAvailable: Boolean;
  }

  const arr: seatsDBObject[] = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < seatNums.length; j++) {
      const obj: seatsDBObject = {
        id: `${rows[i]}-${seatNums[j]}`,
        isAvailable: false,
      };
      //
      // obj.id = `${rows[i]}-${seatNums[j]}`,
      // obj.isAvailable= false
      arr.push(obj);
    }
  }
  console.log(arr, "arr!!");

  const [seats, setSeats] = useState("");

  // todo reflect current state of the backend
  useEffect(() => {
    console.log("useFX bish");
    fetch("/")
      .then((response) => response.json())
      .then((data) => {
        // Process the retrieved data
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  });

  // useEffect(() => {
  //   console.log("useFX bish");
  //   fetch("/api/get-seats")
  //     .then((res) => {
  //       if (!res.ok) {
  //         console.log(res, "resss");
  //         throw new Error("Error fetching data: " + res.statusText);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data, "info thus fetched");
  //       setSeats(data.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // });

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
