import {Machine} from "./machine";
export class Step {

  public idStep : number;
  public name : string;
  public description : string;
  public color : string;
  public machine : Machine = new Machine();

}
