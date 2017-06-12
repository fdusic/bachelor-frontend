import {Machine} from "./machine";
import {User} from "./user";
export class FailureReport{

  public idRF : number;
  public dateCreated : Date;
  public machine : Machine;
  public employee : User;
  public repairer : User;
  public executed : boolean;
  public error : string;

}
