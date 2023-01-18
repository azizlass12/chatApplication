import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('new_chat') modal: ModalController;
  @ViewChild('popover') popover: PopoverController;
  segment = 'chats';
  open_new_chat = false;
  users :Observable<any[]>
  chatRooms :Observable<any[]>
  email:any

  // users = [
  //   {id: 1, name: 'NIkhil', photo: 'https://i.pravatar.cc/315'},
  //   {id: 2, name: 'XYZ', photo: 'https://i.pravatar.cc/325'},
  // ];
  // chatRooms = [
  //   {id: 1, name: 'NIkhil', photo: 'https://i.pravatar.cc/315'},
  //   {id: 2, name: 'XYZ', photo: 'https://i.pravatar.cc/325'},
  // ];

  constructor(
    private router: Router,
    private chatService:ChatService,
    private auth:AuthService
  ) {
   
  }
  ngOnInit() {
    this.getRooms()
  }
getRooms() {
  this.chatService.getChatRooms()
  this.chatRooms = this.chatService.chatRooms
  // console.log('chatrooms: cddddddddddd ', this.chatRooms)
}
  logout() {
    this.popover.dismiss();
this.chatService.auth.logout()  
this.router.navigateByUrl('/login',{replaceUrl:true})
}

  onSegmentChanged(event: any) {
    this.segment = event.detail.value
    console.log(event);
  }


  onWillDismiss(event: any) {}

  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }
  newChat(){
    this.open_new_chat= true
    if(!this.users) this.getUsers();

}
   getUsers(){
    this.chatService.getUsers()
    this.users = this.chatService.users 
    console.log(this.users)

   }
  async startChat(item){
try {
  // this.global.showLoder()
  // create chatroom
  const room = await this.chatService.createChatRoom(item?.uid)
  console.log('room',room)
  this.cancel()
  const navData: NavigationExtras = {
    queryParams: {
      name: item?.name
    }
  }
//  let  path = ['/','home','chats', room?.id]
  this.router.navigate(['/','home','chats', room?.id ] , navData)
  // this.global.hideloader()
} catch(e) {
  console.log(e)
  // this.global.hideloader()
}
  }

  getChat(item) {

    (item?.user).pipe(
      take(2)
    ).subscribe((item: {
      id: any;
      name: any; 
}) => {
console.log(item)

      const navData: NavigationExtras = {
       
        queryParams: {
         

          name: item?.name
          
        }
      };
        this.router.navigate(['/', 'home', 'chats', item?.id], navData);

      // this.router.navigate(['/', 'home', 'chats',item?.id], navData);


    })
  
  }

async userEmail() {
   
  const user =await this.auth.checkAuth()
  this.email=user.email
  console.log(this.email)

}
getUser(user: any) {
  return (user)
}
}