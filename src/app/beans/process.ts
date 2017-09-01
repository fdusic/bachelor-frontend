import {Topology} from "./topology";
import {User} from "./user";
import {Step} from "./step";
export class Process{

  public idP : number;
  public name : string;
  public description : string;
  public version : number;
  public topology : Topology;
  public author : User;
  public steps : Step[] = [];

}
