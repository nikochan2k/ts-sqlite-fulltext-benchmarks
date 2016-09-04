import { benchmark } from "./Benchmark";
import * as crc from "crc";

const uintMax = Math.pow(2, 24);
benchmark("crc24", (chunk: string) => {
  return crc.crc24(chunk) - uintMax;
});
