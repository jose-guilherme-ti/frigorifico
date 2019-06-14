import { ConexaoService } from './../conexao/conexao.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private conexao: ConexaoService) { }


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
}
