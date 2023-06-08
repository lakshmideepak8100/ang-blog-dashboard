import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { ToastrService } from 'ngx-toastr';
import { Post } from '../models/post';
import { finalize, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  task: any;
  downloadURl: any;
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private route: Router
  ) {}

  uploadPost(
    selectedImage: any,
    postData: Post,
    formStatus: string,
    id: string
  ) {
    console.log('In uploadImage');

    const filePath = `postsImg/${Date.now()}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, selectedImage, {
      contentType: selectedImage.type, // Set the MIME type of the file
    });
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          const downloadURL = fileRef.getDownloadURL();
          downloadURL.subscribe((data) => {
            postData.postImgPath = data;
            if (formStatus == 'Add New') {
              this.saveData(postData);
            } else if (formStatus == 'Edit') {
              this.updateById(id, postData);
            }
          });
        })
      )
      .subscribe();

    console.log('Leaving the Upload Post');
  }

  saveData(postData: Post) {
    this.afs
      .collection('posts')
      .add(postData)
      .then((docRef) => {
        this.toastr.success('Post is Uploaded SuccessFully');
        this.route.navigate(['/posts']);
      });
  }
  loadData() {
    return this.afs
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions: any) => {
          return actions.map((a: any) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            const returnObj = { id, data };

            return returnObj;
          });
        })
      );
  }

  fetchById(id: string) {
    return this.afs.doc(`posts/${id}`).valueChanges();
  }

  updateById(id: string, postData: Post) {
    console.log(`posts/${id}`);
    this.afs
      .doc(`posts/${id}`)
      .update(postData)
      .then(() => {
        this.toastr.success('Data Updated Successfully');
        this.route.navigate(['/posts']);
      });
  }

  deleteImage(postImgPath: string, postid: string) {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        this.deleteData(postid);
      });
  }
  deleteData(id: string) {
    this.afs
      .doc(`posts/${id}`)
      .delete()
      .then(() => {
        this.toastr.warning('The Post is deleted');
      });
  }

  togglePostFeature(postId: string, value: any) {
    let toggle = '';
    if (value.isFeatured) {
      toggle = 'The post is made Featured';
    } else {
      toggle = 'The post is removed from Featured';
    }

    this.afs
      .doc(`posts/${postId}`)
      .update(value)
      .then(() => {
        this.toastr.info(toggle);
      });
  }
}
