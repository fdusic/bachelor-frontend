import { Injectable } from '@angular/core';

@Injectable()
export class RoleService {

  public role : string = null;

  constructor() {
  }

  setRole(role : any) {
    this.role = role;
  }

}
