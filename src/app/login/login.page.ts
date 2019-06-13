import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../service/auth/auth.service';

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


  constructor(  
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private authservice:AuthService
    ) { }

  ngOnInit() {
  }

  
  //Exibir form de registro
  exibirRegistrar() {
    this.login = false;
    this.register = true;
  }

  //Exibir form de login
  exibirLogin() {
    this.login = true;
    this.register = false;
  }
  //Registro
  /*criarNovaConta() {
    //let load = this.loadingCtrl.create();
    //load.present();

    this.authservice.registrar(this.registerForm)
      .then((res) => {
        let uid = res.user.uid;

        //Organizar dados
        let data = {
          uid: uid,
          name: this.registerForm.name,
          email: this.registerForm.email
        };

        //Gravar user no firestore
        this.firebaseProvider.postUser(data)
          .then(() => {
            this.storage.set('usuario', data)
              .then(() => {
                //load.dismiss();
                this.navCtrl.setRoot('HomePage');
              })
          })
          .catch((err) => {
            //load.dismiss();
          })
      })
      .catch((err) => {
        //load.dismiss();
      })
  }*/

}
