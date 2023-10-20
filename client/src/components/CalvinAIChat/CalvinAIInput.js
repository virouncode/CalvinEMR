import SendIcon from "@mui/icons-material/Send";
import { Button, TextField } from "@mui/material";
import React from "react";
import TypingDots from "../Presentation/TypingDots";

const CalvinAIInput = ({
  handleChangeInput,
  value,
  handleAskGPT,
  isLoading,
}) => {
  return (
    <div className="calvinai-chat__input">
      <TextField
        className="calvinai-chat__textarea"
        placeholder="Type a message..."
        variant="outlined"
        onChange={handleChangeInput}
        value={value}
        multiline
        rows={2}
        sx={{
          "& fieldset": { border: "none" },
        }}
      />
      {isLoading ? (
        <TypingDots text="" />
      ) : (
        <Button
          className="calvinai-chat__send-btn"
          variant="contained"
          color="primary"
          onClick={handleAskGPT}
          style={{ backgroundColor: "#3C5A76" }}
        >
          <SendIcon />
        </Button>
      )}
    </div>
  );
};

export default CalvinAIInput;
