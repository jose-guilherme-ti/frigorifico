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
        let sql = 'insert into usuario ( nome, email, senha) values (?, ?, ?)';
        let data = [ usuario.nome, usuario.email, Md5.hashStr(usuario.senha)];
        //let data = [usuario.id, usuario.nome, usuario.email, usuario.senha];
        console.log("Dados do banco de dados ",data);
        return db.executeSql(sql, data)
          .catch((e) => console.log(e));
      })
      .catch((e) => console.error(e));
  }
  public loginLocal(usuario: Login) {
    return this.BancoService.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT * FROM usuario WHERE email = ? and senha = ?';
        let data = [usuario.email, Md5.hashStr(usuario.senha)];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let usuarioEncontrado: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var usuario = data.rows.item(i);
                usuarioEncontrado.push(usuario);
              }
              return usuarioEncontrado;
            } else {
              return null;
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }


  public cadastrarProdutoBD(produto: Produto) {
    return this.BancoService.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into produto ( peso_inicial, quantidade, tipo_corte, valor, cliente, rota) values (?, ?, ?, ?, ?, ?)';
        let data = [ produto.peso_inicial, produto.quantidade, produto.tipo_corte, produto.valor, produto.cliente, produto.rota];
        console.log("Dados do banco de dados ",data);
        return db.executeSql(sql, data)
          .catch((e) => console.log(e));
      })
      .catch((e) => console.error(e));
  }

  public get(id: number) {
    return this.BancoService.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from products where id = ?';
        let data = [id];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let producto = new Produto();
              producto.id           = item.id;
              producto.peso_inicial = item.peso_inicial;
              producto.quantidade   = item.quantidade;
              producto.tipo_corte   = item.tipo_corte;
              producto.valor        = item.valor;
              producto.cliente      = item.clietne;
              producto.rota         = item.rota;

              return producto;
            }

            return null;
          })
          .catch((e) => console.error(e));
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

export class Login {
  senha: string;
  email: string;
}

export class Produto {
  id:number;
  peso_inicial: string;
  quantidade: number;
  tipo_corte:string;
  valor:string;
  cliente:string;
  rota:string;
}
 