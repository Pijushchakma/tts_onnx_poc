import * as ort from "onnxruntime-web";
import {
  charNormalize,
  getBatch,
  removePunctuationAndSplit,
} from "./preProcessing";

import { postProcessing } from "./postProcessing";

function reshape1Dto3D(array, shape) {
  if (array.length !== shape[0] * shape[1] * shape[2]) {
    throw new Error("Array size does not match the specified shape.");
  }

  const reshapedArray = [];
  let index = 0;
  for (let i = 0; i < shape[0]; i++) {
    const row = [];
    for (let j = 0; j < shape[1]; j++) {
      const matrix = [];
      for (let k = 0; k < shape[2]; k++) {
        matrix.push(array[index]);
        index++;
      }
      row.push(matrix);
    }
    reshapedArray.push(row);
  }

  return reshapedArray;
}

export const inferModel = async (inputText) => {
  const normalizedChar = charNormalize(inputText);
  var wordList = removePunctuationAndSplit(normalizedChar);

  var [finalBatches, wordBatches] = getBatch(wordList, 8, 3, 256); // input word list, batchSize,n_repeat and maxLen

  //  copied these wasm file from 'node_modules->onnxruntime-web->dist'
  ort.env.wasm.wasmPaths = {
    "ort-wasm.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm.wasm`,
    "ort-wasm-simd.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-simd.wasm`,
    "ort-wasm-threaded.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-threaded.wasm`,
    "ort-training-wasm-simd.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-training-wasm-simd.wasm`,
    "ort-wasm-simd-threaded.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-simd-threaded.wasm`,
    "ort-wasm-simd-threaded.jsep.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-simd-threaded.jsep.wasm`,
    "ort-wasm-simd.jsep.wasm": `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm-simd.jsep.wasm`,
  };

  console.log(
    "public url is : ",
    `${process.env.PUBLIC_URL}/wasmFiles/ort-wasm.wasm`
  );

  //  load the model
  const session = await ort.InferenceSession.create(
    `${process.env.PUBLIC_URL}/poc_onnx_phoneme_opset_14.onnx`,
    { executionProviders: ["wasm"] }
  );
  console.log("model Loaded..........");
  let predictions = {};
  for (let i = 0; i < finalBatches.length; i++) {
    //   flatten the 2D array
    const flattenedArray = finalBatches[i].flat();
    //  convert it to srting array
    const tensorData = flattenedArray.map(String);
    // convert the flattened array : type,data,output shape
    let feeds = {
      [session.inputNames[0]]: new ort.Tensor("int64", tensorData, [
        finalBatches[i].length,
        256,
      ]),
    };
    console.log("before model run");
    //  run the model for output
    const outputData = await session.run(feeds);
    console.log("after model run");

    const prediction = postProcessing(
      reshape1Dto3D(
        outputData[session.outputNames[0]].data.slice(
          0,
          finalBatches[i].length * 256 * 53
        ),
        [finalBatches[i].length, 256, 53]
      ),
      wordBatches[i]
    );

    Object.assign(predictions, prediction);
  }
  let phonemeSequence = "";

  wordList.forEach((word) => {
    phonemeSequence += predictions[word] + " ";
  });

  console.log(phonemeSequence.trim());
  return phonemeSequence.trim();
};
