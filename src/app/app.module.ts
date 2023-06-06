import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { environment } from 'src/environments/environment.production';
import { CategoriesComponent } from './categories/categories.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { AllPostComponent } from './all-post/all-post.component';
import { NewPostComponent } from './new-post/new-post.component';
import { AllPostsComponent } from './post/all-posts/all-posts.component';
import { NewPostsComponent } from './posts/new-posts/new-posts.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        DashboardComponent,
        CategoriesComponent,
        AllPostComponent,
        NewPostComponent,
        AllPostsComponent,
        NewPostsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.fireBaseConfig),
        AngularFireDatabaseModule,
        FormsModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
