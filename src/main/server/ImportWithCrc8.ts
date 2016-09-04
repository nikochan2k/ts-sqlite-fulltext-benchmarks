import * as path from "path";
import { doImport } from "./Importer";
import * as crc from "crc";

const textPath = path.join(__dirname, "太宰治");
const uintMax = Math.pow(2, 8);
doImport("crc8", textPath, (chunk: string) => {
  return crc.crc8(chunk) - uintMax;
});
