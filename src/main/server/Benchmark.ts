import * as path from "path";
import { DatabaseOperation } from "./DatabaseOperation";

export function benchmark(dbName: string, compute: (chunk: string) => number): void {
  const dbPath = path.join(__dirname, dbName + ".sqlite");
  const operation = new DatabaseOperation(compute, dbPath);
  operation.benchmark("私は");
}
