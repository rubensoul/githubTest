import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './generic/request.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  

  constructor(private requestService: RequestService) { }
  
    // response repositories public
    searchUser(search?:string, page?:number, per_page?: number): Observable<any> {
      let params = {
        'q': search ? search : '',
        'page': page ? page : '',
        'per_page': per_page ? per_page : '',
      }
      return this.requestService.get('/search/users', params)
    }

    getInfoUser(name?:string): Observable<any> {
      return this.requestService.get(`/users/${name}`)
    }

    getRepByUser(user:string, page?:number,per_page?:number): Observable<any> {
      let params = {
        'page': page ? page : '',
        'per_page': per_page ? per_page : '',
      }
        return this.requestService.get(`/users/${user}/repos`, params)
      }




}
