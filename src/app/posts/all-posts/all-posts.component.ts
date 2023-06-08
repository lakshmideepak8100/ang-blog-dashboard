import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css'],
})
export class AllPostsComponent implements OnInit {
  postList: Array<any> = [];
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.loadData().subscribe((val) => {
      this.postList = val;
      console.log(val);
    });
  }
}
