import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';

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

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: [{ value: `${this.postPermaLink}`, disabled: true }],
      excerpt: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      postImg: ['', Validators.required],
      content: ['', Validators.required],
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

    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };
    reader.readAsDataURL($imgEvent.target.files[0]);
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
}
