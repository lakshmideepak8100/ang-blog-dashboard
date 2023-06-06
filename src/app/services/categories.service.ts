import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    constructor(private afs: AngularFirestore, private toastr: ToastrService) {}

    saveData(categoryData: any) {
        this.afs
            .collection('categories')
            .add(categoryData)
            .then((docRef) => {
                console.log(docRef);
                this.toastr.success('Data Inserted Successfully..!!');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    loadData() {
        return this.afs
            .collection('categories')
            .snapshotChanges()
            .pipe(
                map((actions) => {
                    return actions.map((a) => {
                        const data = a.payload.doc.data();
                        const id = a.payload.doc.id;
                        const returnObj = { id, data };

                        return returnObj;
                    });
                })
            );
    }

    updateData(id: string, EditData: any) {
        this.afs
            .collection('categories')
            .doc(id)
            .update(EditData)
            .then((doc) => {
                this.toastr.success('Data Updated Successfully..!!');
            });
    }

    delete(id: string) {
        this.afs
            .collection('categories')
            .doc(id)
            .delete()
            .then((doc) => {
                this.toastr.success('Data Deleted Successfully..!!');
            });
    }
}
