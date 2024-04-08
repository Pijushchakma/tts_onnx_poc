import { Box, Button, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import "./App.css";
// import { inferModel } from "./statics/js/modelHelper";
import { vitsInferModel } from "./statics/js/vitsModelHelper";
function App() {
  const [inputText, setInputText] = useState("");
  const [phoneme, setPhoneme] = useState("");
  const [showBackDrop, setShowbackDrop] = useState(false);
  // const audioRef = useRef(null);
  const handleModelRun = async () => {
    const outputVoice = await vitsInferModel("tumi kεno SaRa dile na");
    console.log("output : ", outputVoice);
    // audioRef.current.src = `data:audio/wav;base64,${outputVoice}`;
    // audioRef.current.play();
    // setShowbackDrop(true);
    // const result = await inferModel(inputText);
    // setShowbackDrop(false);
    // setPhoneme(result);
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
        {/* <Textarea size="lg" name="Size" placeholder="Large" /> */}
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
      <Button variant="contained" onClick={handleModelRun}>
        Convert to Phoneme
      </Button>
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
          <Typography>Something Magic is Happening. Please Wait</Typography>
          <CircularProgress color="inherit" />
        </Box>
      </Backdrop>
    </div>
  );
}

export default App;
