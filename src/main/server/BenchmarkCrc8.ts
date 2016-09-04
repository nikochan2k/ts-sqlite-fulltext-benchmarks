import { benchmark } from "./Benchmark";
import * as crc from "crc";

const uintMax = Math.pow(2, 8);
benchmark("crc8", (chunk: string) => {
  return crc.crc8(chunk) - uintMax;
});
