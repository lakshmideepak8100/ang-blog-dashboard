import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  RequiredValidator,
  Validators,
  FormControl,
} from '@angular/forms';
import { Post } from 'src/app/model/post';
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
  defaultVals: Post = {
    title: 'DudhSagarWaterFalls',
    permalink: this.postPermaLink,
    category: {
      categoryId: 'Random',
      category: 'Random',
    },
    postImgPath: '',
    excerpt: 'Thank you for Presence',
    content: 'Will Design later',
    isFeatured: false,
    views: 0,
    status: 'New',
    createdAt: new Date(),
  };

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private fireStorage: PostService
  ) {
    this.postForm = this.fb.group({
      title: [
        this.defaultVals.title,
        [Validators.required, Validators.minLength(10)],
      ],
      permalink: [
        { value: `${this.defaultVals.permalink}`, disabled: true },
        RequiredValidator,
      ],
      excerpt: [
        this.defaultVals.excerpt,
        [Validators.required, Validators.minLength(10)],
      ],
      category: ['', Validators.required],
      postImg: ['', Validators.required],
      content: [this.defaultVals.content, Validators.required],
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
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: raw_data.permalink,
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
      createdAt: new Date(),
    };
    console.log(postData);
    console.log(this.postImg);

    this.fireStorage.uploadImage(this.postImg, postData);
  }
}
