import React from "react";
import { Button } from "react-bootstrap";

const ClickButton = ({ label, onClick, disabled }) => {
  return (
    <Button className="create-btn" onClick={onClick} disabled={disabled}>
      {label}
    </Button>
  );
};

const Delete = ({ label, onClick }) => {
  return (
    <>
      <Button className="delete" onClick={onClick}>
        {label}{" "}
      </Button>
    </>
  );
};
const ChooseButton = ({ label, onClick }) => {
  return (
    <>
      <Button className="choosefilebtn" onClick={onClick}>
        {label}{" "}
      </Button>
    </>
  );
};
const View = ({ label, onClick }) => {
  return (
    <>
      <Button className="delete" onClick={onClick}>
        {label}{" "}
      </Button>
    </>
  );
};

export { ClickButton, ChooseButton, Delete, View };
