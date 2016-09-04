import * as path from "path";
import * as fs from "fs";
import { DatabaseOperation } from "./DatabaseOperation";

export function doImport(dbName: string, textDir: string, compute: (chunk: string) => number): void {
  const dbPath = path.join(__dirname, dbName + ".sqlite");
  try {
    fs.unlinkSync(dbPath);
  } catch (e) {
  }
  const operation = new DatabaseOperation(compute, dbPath);
  operation.createDb();
  const func = (file: string) => {
    return new Promise<void>((resolve) => {
      const textFile = path.join(textDir, file);
      console.log("Importing " + textFile);
      const rs = fs.createReadStream(textFile, { encoding: "utf-8" });
      operation.insertFile(rs, resolve);
    });
  };
  fs.readdir(textDir, (err: NodeJS.ErrnoException, files: string[]) => {
    files.reduce((prev, curr) => {
      return prev.then(() => {
        return func(curr);
      });
    }, Promise.resolve(null));
  });
}
