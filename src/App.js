import { Box, Button, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { inferModel, loadPhonemizeModel } from "./statics/js/modelHelper";
import { loadVitsModel, vitsInferModel } from "./statics/js/vitsModelHelper";
function App() {
  const [inputText, setInputText] = useState("");
  const [phoneme, setPhoneme] = useState("");
  const [showBackDrop, setShowbackDrop] = useState(false);
  const [backDropMessage, setbackDropMessage] = useState("");

  const audioRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      setShowbackDrop(true);
      setbackDropMessage("Phonemizer model is Loading...........");
      await loadPhonemizeModel();

      setbackDropMessage("Vits model is Loading...........");
      await loadVitsModel();
      setShowbackDrop(false);
    };

    loadModels();
  }, []);
  useEffect(() => {
    console.log("the backDrop is : ", showBackDrop);
  }, [showBackDrop]);
  const handleGetAudio = async () => {
    setShowbackDrop(() => true);
    setbackDropMessage("Vits model is running...........");

    const outputWavBlobUrl = await vitsInferModel(phoneme);
    setShowbackDrop(false);
    audioRef.current.src = outputWavBlobUrl;
  };
  const handleGetPhoneme = async () => {
    setShowbackDrop(() => true);
    setbackDropMessage("Phonemizer model is running...........");

    const outputPhoneme = await inferModel(inputText);
    setPhoneme(outputPhoneme);
    setShowbackDrop(false);
  };

  const handleTextInput = (e) => {
    setInputText(e.target.value);
  };
  return (
    <div className="App">
      <Box
        sx={{
          width: "50%",
          p: 2,
          mx: "auto",
        }}
      >
        <Typography
          sx={{
            fontSize: "30px",
            m: 1,
          }}
        >
          বাংলায় লিখুন
        </Typography>

        <textarea
          id="outlined-basic"
          variant="outlined"
          // fullWidth
          value={inputText}
          onChange={handleTextInput}
          style={{
            minHeight: "100px",
            minWidth: "100%",
          }}
        />
      </Box>

      <Button variant="contained" onClick={handleGetPhoneme}>
        Convert to Phoneme
      </Button>
      {phoneme !== "" ? (
        <Box
          sx={{
            width: "50%",
            p: 2,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              border: "1px solid black",
              minHeight: "50px",
              p: 2,
            }}
          >
            {phoneme !== "" ? <Typography>{phoneme}</Typography> : null}
            {/* <Typography>{phoneme}</Typography> */}
          </Box>
          {/* <audio ref={audioRef} controls /> */}
        </Box>
      ) : null}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          mx: "auto",
          gap: 2,
          my: 2,
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {phoneme !== "" ? (
          <Button variant="contained" onClick={handleGetAudio}>
            Play the Audio
          </Button>
        ) : null}
        <audio ref={audioRef} controls />
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackDrop}
        // onClick={handleClose}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography>{backDropMessage}</Typography>
          <CircularProgress color="inherit" />
        </Box>
      </Backdrop>
    </div>
  );
}

export default App;
