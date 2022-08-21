//import * as shell from "shelljs";
import shelljs from "shelljs";

// Copy all the view templates
shelljs.cp("-R", "src/webapi/views", "build/src/webapi");
shelljs.cp("-R", "config", "build");