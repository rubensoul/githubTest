import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private serviceGithub: GithubService,
    private route: ActivatedRoute,) {

   }

  ngOnInit(): void {
    this.searchRep();
    this.getTerm();

    this.route.queryParams.subscribe(params => {
      let newterms = params['newterms'];
      if (newterms) {
        this.valueTerm = newterms;
        this.search(this.valueTerm)
      }
    });
  }

  searchRep(){
    this.searchTerms.pipe(
      debounceTime(1000), 
      distinctUntilChanged(),
      switchMap(
        term => 
          term 
            ? 
            this.serviceGithub.searchUser(term, this.page = 1, 12)
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
    if (term.target) {
      this.termValue = term.target.value
    } else {
      this.termValue = term;
    }
    if (this.termValue && this.termValue.trim() !== '') {
      this.searchTerms.next(this.termValue);
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
    if (this.termSearch) {
      this.termSearch.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  selectChange(event) {
    this.valueTerm = event.target.value;
    this.search(event)
  }

}
