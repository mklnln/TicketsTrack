import { FormEvent, useState } from "react";
import { styled } from "styled-components";

interface FormValuesType {
  name: string;
  email: string;
  phoneNumber: string;
}

const Form = () => {
  const [formValues, setFormValues] = useState<FormValuesType>({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const set = (name: string) => {
    // ? how can i return this without such ugly destructuring?
    return ({ target: { value } }: { target: { value: string } }) => {
      console.log(value, "value??");
      setFormValues((oldValues) => ({ ...oldValues, [name]: value }));
    };
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
        <label htmlFor="">Name</label>
        <input
          type="text"
          id="name"
          value={formValues.name}
          required
          onChange={set("name")}
        />
        <label htmlFor="">Email</label>
        <input
          type="email"
          id="email"
          value={formValues.email}
          required
          onChange={set("email")}
        />
        <label htmlFor="">Phone Number</label>
        <input
          type="tel"
          id="phone-number"
          value={formValues.phoneNumber}
          required
          minLength={10}
          onChange={set("phoneNumber")}
        />

        <SubmitButton type="submit">Submit</SubmitButton>
      </FormElement>
    </>
  );
};

export default Form;

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const SubmitButton = styled.button`
  margin: 10px 0px;
`;
