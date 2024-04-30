import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import React, { useRef, useState } from "react";

export const TextInput = ({ handleSendMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");
  const [showAudioControl, setShowAudioControl] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          chunks.current.push(event.data);
        };
        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
          // Here you can do something with the recorded WAV Blob, like saving to server or playing
          // For demonstration, I'm just logging the Blob
          setShowAudioControl(true);
          const audioUrl = URL.createObjectURL(audioBlob);
          audioRef.current.src = audioUrl;
          chunks.current = [];
        };
        mediaRecorder.current.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setMessage("here is the audio input transcription");
    }
  };
  const handleSendButton = () => {
    handleSendMessage(message);
    setShowAudioControl(false);
    setMessage("");
  };
  return (
    <>
      <Box
        noValidate
        autoComplete="off"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "95%",
          margin: "auto",
          border: "0px solid red",
        }}
        onSubmit={handleSendButton}
      >
        <TextField
          value={message}
          onChange={handleInputChange}
          multiline
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {isRecording ? (
                  <GraphicEqIcon
                    sx={{
                      cursor: "pointer",
                    }}
                    onMouseLeave={stopRecording}
                    onMouseDown={stopRecording}
                  />
                ) : (
                  <MicIcon
                    sx={{ cursor: "pointer" }}
                    onMouseDown={() => {
                      startRecording();
                    }}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                  />
                )}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendButton}
                >
                  <SendIcon />
                </Button>
              </InputAdornment>
            ),
          }}
          id="standard-text"
          fullWidth
        />
      </Box>
      <audio
        ref={audioRef}
        controls
        style={{ display: showAudioControl ? "flex" : "none" }}
      />
    </>
  );
};
