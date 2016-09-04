import { Database, RunResult, Statement } from "sqlite3";
import { Readable } from "stream";
import * as readline from "readline";

export class DatabaseOperation {

  private EMPTY = /^[\s]+$/;
  private SPACE = /[\s]+/;

  private db: Database;
  private docStmt: Statement;
  private chunkStmt: Statement;

  public constructor(private compute: (chunk: string) => number, dbPath: string) {
    this.db = new Database(dbPath);
  }

  public createDb(): void {
    this.db.serialize(() => {
      this.db.run(
        `CREATE TABLE IF NOT EXISTS documents
(
  id INTEGER NOT NULL,
  text TEXT NOT NULL,
  CONSTRAINT PK_documents PRIMARY KEY (id)
)`
      );

      this.db.run(
        `CREATE TABLE IF NOT EXISTS chunks
(
  id INTEGER NOT NULL,
  hash INTEGER NOT NULL,
  CONSTRAINT PK_chunks PRIMARY KEY (id,hash),
  CONSTRAINT FK_document_chunk FOREIGN KEY (id) REFERENCES documents (id)
) WITHOUT ROWID`
      );
    });
  }

  public insertFile(rs: Readable, resolve: () => void) {
    this.db.serialize(() => {
      this.db.run("PRAGMA synchronous=OFF");
      this.db.run("PRAGMA count_changes=OFF");
      this.db.run("PRAGMA journal_mode=MEMORY");
      this.db.run("PRAGMA temp_store=MEMORY");
      this.db.run("BEGIN TRANSACTION");
      this.docStmt = this.db.prepare("INSERT INTO documents (text) VALUES(?)");
      this.chunkStmt = this.db.prepare("INSERT OR IGNORE INTO chunks (id, hash) VALUES(?, ?)");
      const rl = readline.createInterface({ input: rs });

      rs.on("end", () => {
        this.db.run("COMMIT TRANSACTION", (error: Error) => {
          resolve();
        });
      }).on("error", (error: Error) => {
        console.log(error);
        throw error;
      });

      rl.on("line", (line: string) => {
        let sentence = "";
        const length = line.length;
        for (let i = 0; i < length; i++) {
          let c = line[i];
          switch (c) {
            case "。":
              sentence += c;
              this.insertToDocuments(sentence);
              sentence = "";
              break;
            default:
              sentence += c;
              break;
          }
        }
        this.insertToDocuments(sentence);
      });
    });
  }

  protected insertToDocuments(sentence: string) {
    if (!sentence) {
      return;
    }
    if (!this.EMPTY.test(sentence)) {
      const text = sentence.trim();
      const that = this;
      this.docStmt.run(text, function(this: RunResult, err: Error) {
        if (!err) {
          that.insertToChunks(this.lastID, text);
        }
      });
    }
  }

  protected insertToChunks(id: number, text: string) {
    const words = text.split(this.SPACE);
    for (let i = 0, wordsLen = words.length; i < wordsLen; i++) {
      let word = words[i];
      const hashes = this.computeHashes(word);
      for (let j = 0, hashesLength = hashes.length; j < hashesLength; j++) {
        const hash = hashes[j];
        this.chunkStmt.run(id, hash);
      }
    }
  }

  protected computeHashes(word: string): Array<number> {
    const hashes: Array<number> = [];
    for (let j = 0, wordLen = word.length - 1; j < wordLen; j++) {
      const chunk = word.substring(j, j + 2);
      const hash = this.compute(chunk);
      hashes.push(hash);
    }
    return hashes;
  }

  public benchmark(word: string) {
    const hashes = this.computeHashes(word);
    const joined = hashes.join(",");
    const sql = `SELECT text
FROM documents d
WHERE ${hashes.length} <= (
  SELECT COUNT(0) FROM chunks c WHERE d.id = c.id AND c.hash in (${joined})
)`;
    let found = 0;
    this.db.each(sql, (error: Error, row: any) => {
      const text = row.text as string;
      if (text.indexOf(word) !== -1) {
        found++;
      }
    }, (err: Error, count: number) => {
      console.log(found / count);
    });
  }

}
