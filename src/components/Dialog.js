import React from "react";
import { ClickButton } from "./ClickButton";

const Dialog = ({ isVisible, onConfirm, onCancel, DialogTitle }) => {
  if (!isVisible) return null;
  return (
    <>
      <div className="confirm-dialog-overlay">
        <div className="confirm-dialog">
          <p>{DialogTitle}</p>
          <ClickButton
            onClick={() => onConfirm(true)}
            className="table-btn mx-2"
            label="Yes"
          />
          <ClickButton
            onClick={() => onCancel(false)}
            className="table-btn mx-2"
            label="No"
          />
        </div>
      </div>
    </>
  );
};

export default Dialog;
