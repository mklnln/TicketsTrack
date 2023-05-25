import { ChangeEvent, FormEvent, useState } from "react";
import { styled } from "styled-components";

const Form = () => {
  const [firstName, setFirstName] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    if (e) {
      setState(e.target.value);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event.target);

    //todo fetch POST to backend
  };

  //   https://dmitripavlutin.com/react-forms-tutorial/

  return (
    <>
      <FormElement onSubmit={handleSubmit}>
        <label htmlFor="">First Name</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => handleChange(e, setFirstName)}
        />
        <button type="submit">Submit</button>
      </FormElement>
    </>
  );
};

export default Form;

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
`;
