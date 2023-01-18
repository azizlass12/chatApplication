import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
isTypePassword:boolean =true
isLogin=false
  form: FormGroup
  constructor(
    private router:Router,
    private authService:AuthService
  ) { 
    this.initForm()
  }

  ngOnInit() {
  }
initForm(){
  this.form= new  FormGroup({
email:new FormControl('', 
{validators: [Validators.required,Validators.email]}
),
password:new FormControl('', 
{validators: [Validators.required,Validators.minLength(8)]}
),
  })
}
onChange(){
  this.isTypePassword=!this.isTypePassword
}
onSubmit(){
  if(!this.form.valid)return;
  console.log(this.form.valid);
  this.login(this.form);
}
login(form) {
  this.authService.login(form.value.email,form.value.password).then(data=>{
    console.log(data)
    this.router.navigateByUrl('/home')
    form.reset()
  })
  .catch(e=>{
    console.log(e)
    let msg : string = 'Could not sign you in , please try again.'
    if(e.code == 'auth/user-not-found') msg = 'E-mail address could not be found'
    else if(e.code == 'auth/wrong-password') msg = 'Please enter a correct password'

  })
}
}
