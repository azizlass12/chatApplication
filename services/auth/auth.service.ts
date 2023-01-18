import { Injectable } from '@angular/core';
import { getAuth,Auth,onAuthStateChanged,createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { timeStamp } from 'console';
import { sendPasswordResetEmail } from 'firebase/auth';
// import {   } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
public _uid=new BehaviorSubject<any>(null);
currentUser:any
  constructor(
    private fireAuth:Auth,
    private apiService:ApiService
  ) { }
  async login(email:string,password:string):Promise<any>{
    try {
      const response =await signInWithEmailAndPassword(this.fireAuth,email,password);
      console.log(response);
      if(response.user){
        this.setUserData(response.user.uid);

      }
    }catch(e) {
      throw(e);
    }
  }
  getId(){
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    console.log(this.currentUser)
    return this.currentUser?.uid
  }
  setUserData(uid){
    this._uid.next(uid);
  }
  randomIntFormInterval(min,max){
    return Math.floor(Math.random()* (max - min +1 ) + min );

  }
  async registre(formValue) {
    try {
      const registredUser = await createUserWithEmailAndPassword(this.fireAuth,formValue.email , formValue.password )
      console.log('registred user:',registredUser)
      let number = this.randomIntFormInterval(200,400)

      const data = {
        email : formValue.email ,
        name : formValue.username,
        uid:registredUser.user.uid,
        photo:'https://i.pravatar.cc/'+ number

      }
      await this.apiService.setDocument(`users/${registredUser.user.uid}`,data)
      const userData = {
        id : registredUser.user.uid
      }
      return userData
    } catch (e) {
      throw(e)
    }
  }
  // async resetPassword (email :string){
  //   try {
  //     await sendPasswordResetEmail(this.fireAuth,email)

  //   }catch(e) {
  //     throw(e)
  //   }
  // }
  async logout(){
    try {
      await this.fireAuth.signOut()
      this._uid.next(null)
      this.currentUser = null
      return true 

    } catch (e) {
      throw (e)
    }
  }
  checkAuth() :Promise<any> {
    return new Promise((resolve , reject) => {
      onAuthStateChanged(this.fireAuth, user => {
      console.log('auth user:' , user)
      resolve(user)
    })
  
  })
  


  }
  async getUserData(id) {
    const docSnap : any = await this.apiService.getDocById(`users/${id}`)
    if(docSnap?.exists()){
      return docSnap.data()
    }else{
      throw('No such document exists')
    }
  }
}
