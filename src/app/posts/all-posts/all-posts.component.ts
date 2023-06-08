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

  onDelete(postImgPath: string, postId: string) {
    this.postService.deleteImage(postImgPath, postId);
  }

  featuredRegister(postId: string, event: any) {
    console.log(`postId : ${postId} is featured:${event.target.checked}`);

    const featuredData = {
      isFeatured: event.target.checked,
    };
    this.postService.togglePostFeature(postId, featuredData);
  }
}
