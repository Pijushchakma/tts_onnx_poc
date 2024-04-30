import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

//avatarが左にあるメッセージ（他人）
export const MessageLeft = (props) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  const photoURL = props.photoURL ? props.photoURL : "dummy.js";
  const displayName = props.displayName ? props.displayName : "名無しさん";

  return (
    <>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Avatar alt={displayName} src={photoURL}></Avatar>
        <div>
          <Typography sx={{ fontWeight: 600 }} fontStyle={"italic"}>
            {displayName}
          </Typography>
          <Box
            sx={{
              position: "relative",
              marginLeft: "20px",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "#A8DDFD",
              width: "60%",
              //height: "50px",
              textAlign: "left",
              font: "400 .9em 'Open Sans', sans-serif",
              border: "1px solid #97C6E3",
              borderRadius: "10px",
              "&:after": {
                content: "''",
                position: "absolute",
                width: "0",
                height: "0",
                borderTop: "15px solid #A8DDFD",
                borderLeft: "15px solid transparent",
                borderRight: "15px solid transparent",
                top: "0",
                left: "-15px",
              },
              "&:before": {
                content: "''",
                position: "absolute",
                width: "0",
                height: "0",
                borderTop: "17px solid #97C6E3",
                borderLeft: "16px solid transparent",
                borderRight: "16px solid transparent",
                top: "-1px",
                left: "-17px",
              },
            }}
          >
            <div>
              <p>{message}</p>
            </div>
            <Box
              sx={{
                position: "absolute",
                fontSize: ".85em",
                fontWeight: "300",
                marginTop: "10px",
                bottom: "-3px",
                right: "5px",
              }}
            >
              {timestamp}
            </Box>
          </Box>
        </div>
      </Box>
    </>
  );
};
//avatarが右にあるメッセージ（自分）
export const MessageRight = (props) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        border: "0px solid black",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          border: "0px solid red",
          width: "100%",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Typography sx={{ fontWeight: 600 }} fontStyle={"italic"}>
          {props.displayName}
        </Typography>
      </Box>
      <Box
        sx={{
          border: "0px solid red",
          width: "100%",
          justifyContent: "flex-end",
          display: "flex",
        }}
      >
        <Box
          sx={{
            position: "relative",
            marginRight: "20px",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#f8e896",
            width: "60%",
            //height: "50px",
            textAlign: "left",
            font: "400 .9em 'Open Sans', sans-serif",
            border: "1px solid #dfd087",
            borderRadius: "10px",
            "&:after": {
              content: "''",
              position: "absolute",
              width: "0",
              height: "0",
              borderTop: "15px solid #f8e896",
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              top: "0",
              right: "-15px",
            },
            "&:before": {
              content: "''",
              position: "absolute",
              width: "0",
              height: "0",
              borderTop: "17px solid #dfd087",
              borderLeft: "16px solid transparent",
              borderRight: "16px solid transparent",
              top: "-1px",
              right: "-17px",
            },
            wordWrap: "break-word",
          }}
        >
          <Typography sx={{ padding: 0, margin: 0 }}>{message}</Typography>
          <div>{timestamp}</div>
        </Box>
      </Box>
    </Box>
  );
};
