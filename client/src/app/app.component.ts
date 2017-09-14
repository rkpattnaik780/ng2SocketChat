import { Component, OnInit , AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from './chat.service';
import * as io from "socket.io-client";
import { Message } from "./message";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild("msgsarea", {read: ElementRef}) msgsarea : ElementRef;

  constructor(private chatService: ChatService) { }


  title = 'app';
  messages: Message[] = [];
  obj: Message = { name: "", msg: "" };
  arr: Message[] = this.messages;
  socket = io('http://localhost:4000');
  showChats: boolean = false;

  submitMsg(): void {
    this.socket.emit('save-message', this.obj);
    this.obj.msg = "";
  }

  scrollToBottom() : void {
    console.log("scrollToBottom invoked");
    this.msgsarea.nativeElement.scrollTop = this.msgsarea.nativeElement.scrollHeight ;//this.msgsarea.nativeElement.scrollHeight;
    console.log(this.msgsarea.nativeElement.scrollHeight);
  }


  submitName(): void {
    this.showChats = true;
    setTimeout(() => {this.scrollToBottom();},500);
  }

  ngOnInit(): void {

    this.chatService.loadAllChats().subscribe(msgs => { this.messages.push(msgs); console.log(this) ;});

    this.socket.on('new-message', function (data) {
      console.log(data);
      this.messages[0].push(data);
      setTimeout(() => {this.scrollToBottom();},100);
    }.bind(this));

  //  setTimeout(() => {this.scrollToBottom();},4000);    
  }


}
