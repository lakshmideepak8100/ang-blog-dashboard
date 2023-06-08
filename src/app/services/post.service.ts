import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from '../model/post';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  task: any;
  downloadURl: any;
  constructor(private storage: AngularFireStorage) {}

  uploadImage(selectedImage: any, postData: Post) {
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
          });
        })
      )
      .subscribe();
    console.log(postData);

    console.log('Leaving the Upload Image');
  }
}
