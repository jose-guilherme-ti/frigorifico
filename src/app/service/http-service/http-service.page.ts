import { Http, RequestOptions, Headers } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Component({
  selector: 'app-http-service',
  templateUrl: './http-service.page.html',
  styleUrls: ['./http-service.page.scss'],
})
export class HttpServicePage implements OnInit {
  private handleError;
  private url: string = 'https://www.ftc.br/slimapi/public/api';
  constructor(public http: Http) {
    console.log('Hello HttpServiceProvider Provider');
  }

  save(endpoint, resource) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.url}/${endpoint}`, resource, options).pipe(
      map(res => { return res.json() }),
      catchError(this.handleError)
    );
  }
  pegar(endpoint) {
    return this.http.get(`${this.url}/${endpoint}`).pipe(
      map(res => { return res.json() }),
      catchError(this.handleError)
    );
  }


  ngOnInit() {
  }

}
