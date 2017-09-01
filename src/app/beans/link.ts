import {Step} from "./step";
import {Process} from "./process";
export class Link {

  public idL : number;
  public from : Step;
  public to : Step;
  public process : Process = new Process();

}
