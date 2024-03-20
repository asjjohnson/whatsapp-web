import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../service/data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() conversation: any;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  
  emojiPickerVisible: any;
  message = '';
  data:any;
  // messages: { from: string, body: string }[] = [];
 messages : any;
  constructor(private dataService :DataService,private http: HttpClient) {
    this.messages = [];
  }

  ngOnInit(): void {
 
    console.log("this.conversation",this.conversation)
  const eventSource = new EventSource('http://localhost:8080/events');

  eventSource.onmessage = (event) => {
    console.log("Message received", event);
      const message = JSON.parse(event.data);
      console.log("data", message);
      console.log('conversation', this.conversation)
      const transformedResponse = this.transformResponse(message);
      console.log("transformed data",transformedResponse);
      if(transformedResponse?.message?.from?.id._serialized === this.conversation?.id?._serialized){
        const allMessages = [...this.messages, ...transformedResponse?.messages];
        this.messages = allMessages;
        console.log("messages1",this.messages)
      }
      console.log("messages2",this.messages)
  };

  eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
  };
  }

  // submitMessage(event: any) {
  //   let value = event.target.value.trim();
  //   // this.message = '';
    
  //   if (value.length < 1) return false;
    
  //   this.messages = this.messages || [];
  //   console.log("gg",this.messages)
  //   this.messages?.unshift({
  //     id: 1,
  //     body: value,
  //     time: new Date().toLocaleTimeString(),
  //     me: true,
  //   });
  //   console.log("messages: " + this.messages);
  //   console.log("this.conversation: " + this.conversation.messages);
  //   console.log("value: " + value);
  //   console.log("current time: " + this.conversation.message)
  //   this.sendMessage(value)
  //   return true;
  // }

  submitMessage(event: any) {
    let value = event.target.value.trim();

    if (value.length < 1) return false;

    this.messages = this.messages || [];

    this.messages.unshift({
      id: 1,
      body: value,
      time: new Date().toLocaleTimeString(),
      me: true,
    });

    // Sort messages based on time in descending order
    this.messages.sort((a: any, b: any) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    this.sendMessage(value);
    return true;
}

  emojiClicked(event: any) {
    this.message += event.emoji.native;
  }

  sendMessage(message:any){
    let payload ={
      "phoneNumber":this.conversation?.id?._serialized,
      "message":message
  }
  console.log("send", payload);
    this.dataService.sendMessage(payload).subscribe(response => {
      this.data = response?.message;
  });
  }

  transformResponse(response:any) {
    return {
        name: response.from.name,
        time: new Date().toLocaleTimeString(),
        latestMessage: response.body,
        latestMessageRead: false,
        messages: [
            {
                id: 1,
                body: response.body,
                time: new Date().toLocaleTimeString(),
                me: false
            }
        ],
        message: {
            from: response.from,
            body: response.body
        },
        me: false
    };
}
}
