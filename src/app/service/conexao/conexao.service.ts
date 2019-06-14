import { BancoService } from './../banco/banco.service';
import { Injectable } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Md5 } from 'ts-md5/dist/md5';
export enum ConnectionStatusEnum {
  Online,
  Offline
}
@Injectable({
  providedIn: 'root'
})

export class ConexaoService {
  previousStatus;

  constructor(public alertCtrl: AlertController,
    public network: Network,
    public eventCtrl: Events,
    private BancoService:BancoService) {

    console.log('Hello NetworkProvider Provider');
    this.previousStatus = ConnectionStatusEnum.Online;
  }


  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Online) {
        this.eventCtrl.publish('network:offline');
      }
      this.previousStatus = ConnectionStatusEnum.Offline;
    });
    this.network.onConnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Offline) {
        this.eventCtrl.publish('network:online');
      }
      this.previousStatus = ConnectionStatusEnum.Online;
    });
  }

  public registroBd(usuario: Usuario) {
    return this.BancoService.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into usuario (id, nome, email, senha) values (?, ?, ?, ?)';
        let data = [usuario.id, usuario.nome, usuario.email, Md5.hashStr(usuario.senha)];
        console.log("Dados do banco de dados ",data);
        return db.executeSql(sql, data)
          .catch((e) => console.log(e));
      })
      .catch((e) => console.error(e));
  }
  

}
export class Usuario {
  id: number;
  nome: string;
  senha: string;
  email: string;
}