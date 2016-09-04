import { benchmark } from "./Benchmark";
import * as crc from "crc";

const uintMax = Math.pow(2, 16);
benchmark("crc16", (chunk: string) => {
  return crc.crc16(chunk) - uintMax;
});
