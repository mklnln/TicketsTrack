import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SeatsGrid from "./components/SeatsGrid";
import { styled } from "styled-components";
import Form from "./components/Form";

function App() {
  const [count, setCount] = useState(0);
  const [chosenSeat, setChosenSeat] = useState<string>("");
  // * example fetch. remember the method is assumed to be get if not state
  // fetch("/api/add-reservation", {
  //   method: "POST",
  //   body: JSON.stringify(reservationData),
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((res) => res.json())
  //   .then((json) => {
  //     console.log(json.data.reservationCode, "resssssssssponse");
  //     setReservationId(json.data.reservationCode);
  //     window.localStorage.setItem(
  //       "reservationId",
  //       JSON.stringify(json.data.reservationCode)
  //     );
  //     // * remember to stringify
  //     navigate("/confirmation");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  return (
    <>
      <AppLayout>
        <SeatsGrid chosenSeat={chosenSeat} setChosenSeat={setChosenSeat} />
        <Form />
      </AppLayout>
    </>
  );
}

export default App;

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;
