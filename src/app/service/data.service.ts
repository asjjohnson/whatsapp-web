import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  sendMessage(data:any): Observable<any> {
    console.log(data);
    return this.http.post<any>(`${this.apiUrl}/message`, data);
  }

  getAllChatList() :Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch-chats-messages`, {});
  }
}
