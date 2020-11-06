



export class User {
    logentry:any;
password:any;
last_login:any;
is_superuser:any;
id:any;
email:any;
first_name:any;
last_name:any;
date_joined:any;
is_active:any;
is_staff:any;
avatar:any;
groups:any;
user_permissions:any;


    constructor() {

    }


    initWithJSON(json) : User{
      for (var key in json) {
          this[key] = json[key];
      }
      return this;
    }
}
  