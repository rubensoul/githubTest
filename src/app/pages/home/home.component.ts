import { Component, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { GithubService } from 'src/app/shared/services/github.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private searchTerms: Subject<string> = new Subject<string>();
  content:any = [];
  page = 1;
  termValue: string;
  termSearch: any = [];
  valueTerm: string = '';

  constructor(private serviceGithub: GithubService) { }

  ngOnInit(): void {
    this.searchRep();
    this.getTerm();
  }

  searchRep(){
    this.searchTerms.pipe(
      debounceTime(1000), 
      distinctUntilChanged(),
      switchMap(
        term => 
          term 
            ? 
            this.serviceGithub.searchUser(term, this.page, 12)
            : 
            of<any>([])
      ),
      catchError(error => {
        // TODO: real error handling
        return of<any>([]);
      })
    ).subscribe(res => { 
      this.content = res;
      this.getTerm();
    });
  }

  search(term){
    this.termValue = term.target.value
    if (this.termValue && this.termValue.trim() !== '') {
      this.searchTerms.next(term.target.value);
    } else {
      this.searchTerms.next('');
    }
  }
  
  nav(e){
    this.page += e;
    this.serviceGithub.searchUser(this.termValue, this.page, 12).subscribe((res => (this.content = res)))
  }


  removeTerm(){
    localStorage.removeItem('term');
    this.getTerm();
  }

  getTerm(){
    this.termSearch = JSON.parse(localStorage.getItem('term'));
    // this.termSearch.sort((val)=> {return new Date(val.date)})

    this.termSearch.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  }

  selectChange(event) {
    this.valueTerm = event.target.value;
    this.search(event)
  }

}
