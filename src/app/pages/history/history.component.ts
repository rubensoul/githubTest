import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  termSearch: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTerm();
  }

  getTerm(){
    this.termSearch = JSON.parse(localStorage.getItem('term'));
    if (this.termSearch) {
      this.termSearch.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  removeTerm(){
    localStorage.removeItem('term');
    this.getTerm();
  }

  searchAgain(term){
    this.router.navigate([ '/home/' ], { queryParams: { 'newterms': term } });
  }

}
