import { useState, useEffect } from "react";
import { FadeLoader } from "react-spinners";
import { styled } from "styled-components";
interface SeatsGridProps {
  chosenSeat: string;
  setChosenSeat: (seat: string) => void;
}

const SeatsGrid: React.FC<SeatsGridProps> = ({ chosenSeat, setChosenSeat }) => {
  interface SeatDBObject {
    seatID: String;
    isAvailable: Boolean;
  }

  interface RowDBObject {
    rowID: String;
    rowSeats: SeatDBObject[];
  }

  const [seats, setSeats] = useState<RowDBObject[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3004/api/get-seats")
      .then((response) => response.json())
      .then((data) => {
        // Process the retrieved data
        setSeats(data.body);
        if (seats) {
          setLoading(false);
        }
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  }, []);

  const handleChooseSeat = (e: React.MouseEvent<HTMLButtonElement>) => {
    const seat = e.currentTarget.getAttribute("data-seat-value");
    if (seat) {
      setChosenSeat(seat);
    }
  };

  return (
    <>
      {seats ? (
        seats.map((row: RowDBObject) => {
          return (
            <RowDiv>
              <RowTitle>Row {row.rowID}</RowTitle>
              {row.rowSeats.map((seat: SeatDBObject) => {
                return (
                  <SingleSeat
                    key={`${seat.seatID}`}
                    onClick={handleChooseSeat}
                    data-seat-value={`${seat.seatID}`}
                    className={seat.isAvailable ? "available" : "unavailable"}
                  >
                    {seat.seatID}
                  </SingleSeat>
                );
              })}
            </RowDiv>
          );
        })
      ) : (
        <FadeLoader
          color={"#ffffff"}
          loading={loading}
          // cssOverride={override}
          // size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
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
  // height: 200px;
  // width: 600px;
`;

const RowTitle = styled.span`
  width: 80px;
  text-align: left;
`;
const SingleSeat = styled.button`
  height: 60px;
  width: 60px;
  border: 1px solid fuchsia;
  padding: 0px;

  &.available {
    cursor: pointer;
  }
  &.unavailable {
    cursor: not-allowed;
    opacity: 25%;
  }
`;

export default SeatsGrid;
