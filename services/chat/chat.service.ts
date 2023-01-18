import { Injectable } from '@angular/core';
import { map, mergeScan, Observable, of, switchMap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentUserId: string;
  public users: Observable<any>;
  public chatRooms: Observable<any>;
  public selectedChatMessages: Observable<any>;

  constructor(public auth: AuthService, private api: ApiService) {
    this.getId();
  }

  getId() {
    this.currentUserId = this.auth.getId();
  }
  getUsers() {
    this.users = this.api.collectionDataQuery(
      'users',
      this.api.whereQuery('uid', '!=', this.currentUserId)
    );
  }
  async createChatRoom(user_id) {
    try {
      let room: any;
      const querySnapshot = await this.api.getDocs(
        'chatRooms',
        this.api.whereQuery('members', 'in', [
          [user_id, this.currentUserId],
          [this.currentUserId, user_id],
        ])
      );
      room = await querySnapshot.docs.map((doc: any) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      console.log('exist docs:', room);
      if (room?.length > 0) return room[0];
      const data = {
        members: [this.currentUserId, user_id],
        type: 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
        // currentUserId:String
      };
      room = await this.api.addDocument('chatRooms', data);
      return room;
    } catch (e) {
      throw e;
    }
  }
  getChatRooms() {
    this.getId()
    this.chatRooms = this.api
      .collectionDataQuery(
        'chatRooms',
        this.api.whereQuery('members', 'array-contains', this.currentUserId)
        
      )
      .pipe(
        map((data: any[]) => {
          console.log('room data: ', data);
          data.map((element) => {
            const user_data = element.members.filter(
              (x) => x != this.currentUserId
            );
            // console.log(user_data,'nkjn');
            const user = this.api.docDataQuery(`users/${user_data[0]}`, true);
            element.user = user;
          });
          return data;
        }),
        switchMap((data) => {
          return of(data);
        })
      );
  }
  getChatRoomMessages(chatRoomId) {
    this.selectedChatMessages = this.api
      .collectionDataQuery(
        `chats/${chatRoomId}/messages`,
        this.api.orderByQuery('createdAt', 'desc')
      )
      .pipe(map((arr: any) => arr.reverse()));
  } 
  async sendMessage(chatId, msg) {
    try {
      const new_message = {
        message: msg,
        sender: this.currentUserId,
        createdAt: new Date(),
      };
      console.log(chatId);
      if (chatId) {
        await this.api.addDocument(`chats/${chatId}/messages`, new_message);
      }
    } catch (e) {
      throw e;
    }
  }
}






























