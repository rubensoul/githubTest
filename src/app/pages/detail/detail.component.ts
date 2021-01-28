import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubService } from 'src/app/shared/services/github.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  username: string;
  content: any = [];
  repo: any = [];

  constructor(private route: ActivatedRoute,
    private serviceGithub: GithubService
    ) {
      this.username = this.route.snapshot.paramMap.get('username');
    }

  ngOnInit(): void {
    this.getInfoUser();
    this.getReps();
  }

  getInfoUser(){
    this.serviceGithub.getInfoUser(this.username).subscribe((res) => (this.content = res))
  }

  getReps(){
    this.serviceGithub.getRepByUser(this.username, 1, 10).subscribe((res) => (this.repo = res))
  }

}
