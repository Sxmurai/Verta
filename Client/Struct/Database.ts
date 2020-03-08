import { ConnectionManager } from "typeorm";
import { Setting } from "../Models/Settings";
import { Infractions } from "../Models/Infractions";
import { Level } from "../Models/Level";
import { Economy } from "../Models/Economy";

import { Tags } from "../Models/Tags";

const connectionManager = new ConnectionManager();
connectionManager.create({
  name: "VertaDB",
  type: "sqlite",
  database: `./VertaDB.sqlite`,
  entities: [Setting, Infractions, Level, Economy, Tags]
});

export default connectionManager;
