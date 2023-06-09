import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  RequiredValidator,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  postTitle: string = '';
  postPermaLink: string = 'Just an intial';
  imgSrc: any = 'assets/imgs/blank_image.png';
  categoryList: Array<any> = [];
  postForm!: FormGroup;
  postImg!: any;
  postData!: any;
  formStatus: string = 'Add New';
  postId: string = '';
  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private fireStorage: PostService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.postId = val['id'];
      if (this.postId) {
        this.fireStorage.fetchById(val['id']).subscribe((postData) => {
          this.postData = postData;
          this.formStatus = 'Edit';
          this.imgSrc = this.postData.postImgPath;
          this.postForm = this.fb.group({
            title: [
              this.postData.title,
              [Validators.required, Validators.minLength(10)],
            ],
            permalink: [
              { value: `${this.postData.permalink}`, disabled: true },
            ],
            excerpt: [
              this.postData.excerpt,
              [Validators.required, Validators.minLength(10)],
            ],
            category: [this.postData.category.id, Validators.required],
            postImg: ['', Validators.required],
            content: [this.postData.content, Validators.required],
          });
        });
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: [{ value: ``, disabled: true }],
          excerpt: ['', [Validators.required, Validators.minLength(10)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required],
        });
      }
    });
  }
  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      this.categoryList = val;
    });
  }

  get fc() {
    return this.postForm.controls;
  }

  generatePermaLink($event: any) {
    this.postPermaLink = $event.target.value.replace(/\s/g, '-');
  }

  previewImage($imgEvent: any) {
    // console.log($imgEvent);
    //   this.imgSrc = URL.createObjectURL($imgEvent.target.files[0]);
    //   console.log(this.imgSrc);

    console.log('In Preview Image method');
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };
    reader.readAsDataURL($imgEvent.target.files[0]);
    //this.postForm.get('postImg')?.setValue($imgEvent.target.files[0]);
    this.postImg = $imgEvent.target.files[0];
    console.log('In Preview Image method');

    //console.log($imgEvent.target.files[0].type);
  }

  checkTheForm() {
    let formControl = this.postForm.controls;
    for (let control in formControl) {
      if (formControl[control].valid) {
        console.log(`${control} is valid`);
      } else {
        console.log(`${control} is Invalid`);
      }
    }
  }
  onPostSubmit() {
    console.log('in onPostSubmit');
    let raw_data = this.postForm.getRawValue();
    console.log(raw_data.permalink);
    const date: Date = new Date();
    let crtAt =
      date.getDate() +
      '/' +
      date.getMonth() +
      '/' +
      date.getFullYear() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds() +
      ':' +
      date.getMilliseconds();
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.title.replace(/\s/g, '-'), //raw_data.permalink
      category: {
        categoryId: this.categoryList[this.postForm.value.category].id,
        category: this.categoryList[this.postForm.value.category].data.category,
      },
      postImgPath: this.postForm.value.postImg,
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'New',
      createdAt: crtAt,
    };

    this.fireStorage.uploadPost(
      this.postImg,
      postData,
      this.formStatus,
      this.postId
    );
    this.postForm.reset();
    this.imgSrc = 'assets/imgs/blank_image.png';
    console.log('Leaving onPostSubmit');
  }
}
