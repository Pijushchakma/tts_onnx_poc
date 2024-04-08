import * as ort from "onnxruntime-web";
import { getPhonemeID } from "./vitsPreprocessing";

const MODELPATH = `${process.env.PUBLIC_URL}/vits_male_ms_opset_14.onnx`;
export const vitsInferModel = async (inputPhoneme) => {
  const phonemeID = getPhonemeID(inputPhoneme);
  console.log("phone ID is : ", phonemeID);
  const tensorData = phonemeID.map(String);
  console.log("tensor data : ", tensorData);
  const ten = new ort.Tensor("int64", tensorData, [1, tensorData.length]);
  console.log("tensor is :", ten);
  let text_lengths = new ort.Tensor("int64", [tensorData.length]);
  console.log("length ten", text_lengths);
  let scales = new ort.Tensor("float32", [0.0, 1, 0.0]);
  console.log("scales is : ", scales);
  let sid = new ort.Tensor("int64", [2]);
  console.log("sid is : ", sid);
  ort.env.wasm.wasmPaths = {
    "ort-wasm.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm.wasm`,
    "ort-wasm-simd.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-simd.wasm`,
    "ort-wasm-threaded.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-threaded.wasm`,
    "ort-training-wasm-simd.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-training-wasm-simd.wasm`,
    "ort-wasm-simd-threaded.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-simd-threaded.wasm`,
    "ort-wasm-simd-threaded.jsep.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-simd-threaded.jsep.wasm`,
    "ort-wasm-simd.jsep.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-simd.jsep.wasm`,
  };
  console.log("before vits model load");
  const session = await ort.InferenceSession.create(MODELPATH, {
    executionProviders: ["wasm"],
  });
  console.log("after vits model load ..............");
  let feeds = {
    input: ten,
    input_lengths: text_lengths,
    scales: scales,
    sid: sid,
  };
  let output = await session.run(feeds);
  console.log("the output is :", output["output"]);
  const audioBuffer = output["output"]["cpuData"];
  console.log("the audio buffer is : ", audioBuffer, typeof audioBuffer);
  let blob = new Blob([audioBuffer], { type: "audio/wav" });

  let blobUrl = URL.createObjectURL(blob);
  console.log("the bolb is : ", blobUrl);
  new Audio(blobUrl).play();

  //   const base64String = float32ArrayToBase64(audioBuffer);
  //   console.log("base 64 is : ", base64String);

  return audioBuffer;
};

function float32ArrayToBase64(float32Array) {
  // Convert Float32Array to Uint8Array
  const uint8Array = new Uint8Array(float32Array.buffer);

  // Convert Uint8Array to Base64 string
  const base64String = btoa(String.fromCharCode.apply(null, uint8Array));

  return base64String;
}
