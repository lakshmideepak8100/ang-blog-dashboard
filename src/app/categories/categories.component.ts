import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { CategoriesService } from '../services/categories.service';
import { CategoryArray } from './categoreyArray';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
    categoryArray: Array<any> = [];
    formCategory: string = '';
    formStatus: string = 'Add';
    editDataId: string = '';
    constructor(private categoryService: CategoriesService) {}

    ngOnInit(): void {
        this.categoryService.loadData().subscribe((val) => {
            this.categoryArray = val;
            console.log(this.categoryArray);
        });
    }
    onSubmit(formData: any) {
        let categoryData: Category = {
            category: formData.value.category,
        };
        if (this.formStatus === 'Add') {
            this.categoryService.saveData(categoryData);
            console.log(categoryData);
            formData.reset();
        } else if (this.formStatus == 'Edit') {
            this.categoryService.updateData(this.editDataId, categoryData);
            this.formStatus = 'Add';
            this.editDataId = '';
            formData.reset();
        }
    }
    OnEditClick(dataToBeEdited: any, id: string) {
        this.formStatus = 'Edit';
        console.log(dataToBeEdited);
        this.formCategory = dataToBeEdited;
        this.editDataId = id;
    }
    onDelete(delId: string) {
        this.categoryService.delete(delId);
    }
}
