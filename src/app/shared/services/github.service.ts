import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './generic/request.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  termSearch: any = []

  constructor(private requestService: RequestService) { }
  
    // response repositories public
    searchUser(search?:string, page?:number, per_page?: number): Observable<any> {
      this.setTerms(search)
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
    
    
    setTerms(term){
      let terms = JSON.parse(localStorage.getItem('term'));
      let currentDate = new Date();

      if (terms) {
        const newTerm = { 'term': term, 'date': currentDate }
        terms.push(newTerm);
        localStorage.setItem('term', JSON.stringify(terms));

      }else {

        let a = []
        const newTerm = { 'term': term, 'date': currentDate }
        a.push(newTerm);

        localStorage.setItem('term', JSON.stringify(a));
      }
    }

}
