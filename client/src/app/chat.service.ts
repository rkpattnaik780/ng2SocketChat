import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {

  constructor(private http: Http) { }

  loadAllChats() { // http://localhost:3000/api/comments
      return this.http.get("http://localhost:3000/loadallchats").map(res => res.json());
    }

}
