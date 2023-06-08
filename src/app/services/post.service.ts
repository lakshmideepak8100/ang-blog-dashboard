import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { ToastrService } from 'ngx-toastr';
import { Post } from '../model/post';
import { finalize, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  task: any;
  downloadURl: any;
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService
  ) {}

  uploadPost(selectedImage: any, postData: Post) {
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
            this.afs
              .collection('posts')
              .add(postData)
              .then((docRef) => {
                this.toastr.success('Post is Uploaded SuccessFully');
                console.log(docRef);
              });
          });
        })
      )
      .subscribe();

    console.log('Leaving the Upload Post');
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
}
