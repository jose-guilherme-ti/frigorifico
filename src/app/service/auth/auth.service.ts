import { ConexaoService } from './../conexao/conexao.service';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private conexao: ConexaoService,
    public storage: Storage) { }
    


  registrar(dado): Promise<boolean> {

    return new Promise((resolve, reject) => {
      this.conexao.registroBd(dado).then(res => {
        console.log("Dados Cadastrado: ", res);
        resolve(true);
      }).catch(err => {
        console.log("Erro dados não cadastrado: ", err);
        reject(false);
      })

    })
  }

  logout(){
    this.storage.remove('usuario');
   
  }
 
}
