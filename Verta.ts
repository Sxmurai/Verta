import Client from "./Client/VertaClient";
import "./Client/Utils/Formatter";

import { token } from "./Client/Utils/Config";

const client = new Client({ token: token });

client.start();
