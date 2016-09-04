import * as path from "path";
import { doImport } from "./Importer";
import * as crc from "crc";

const textPath = path.join(__dirname, "太宰治");
const uintMax = Math.pow(2, 16);
doImport("crc16", textPath, (chunk: string) => {
  return crc.crc16(chunk) - uintMax;
});
