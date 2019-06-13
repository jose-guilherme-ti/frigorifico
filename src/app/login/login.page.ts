import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  animations: [
    trigger(
      'login', [
        transition(':enter', [
          style({
            opacity: 0
          }),
          animate("1s ease-in-out", style({
            opacity: 1
          }))
        ]),
        transition(':leave', [
          style({
            opacity: 0
          })
        ])
      ],
    ),
    trigger(
      'registro', [
        transition(':enter', [
          style({
            opacity: 0
          }),
          animate("1s ease-in-out", style({
            opacity: 1
          }))
        ]),
        transition(':leave', [
          style({
            opacity: 0
          })
        ])
      ],
    ),
  ]
})
export class LoginPage implements OnInit {

  login = true;
  register = false;
  loginForm = {
    email: '',
    password: ''
  };
  registerForm = {
    email: '',
    password: '',
    name: ''
  }


  constructor(  public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    ) { }

  ngOnInit() {
  }

}
