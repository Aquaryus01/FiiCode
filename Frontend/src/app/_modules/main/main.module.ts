import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {AuthGuard} from './_guards/auth.guard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule} from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { CardsComponent } from './main/cards/cards.component';
import { CardComponent } from './main/cards/card/card.component';
import { StartPageComponent } from './start-page/start-page.component';
import { PostsComponent } from './start-page/posts/posts.component';
import { PostComponent } from './start-page/posts/post/post.component';
import { AddPostsComponent } from './start-page/add-posts/add-posts.component';
import { WeatherComponent } from './weather/weather.component';
import { SearchBarComponent } from './start-page/search-bar/search-bar.component';
import { QuestionComponent } from './start-page/question/question.component';
import { PopularPostsComponent } from './start-page/popular-posts/popular-posts.component';
import { PostService } from './start-page/_services/post.service';
import { ChatComponent } from './chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommentComponent } from './start-page/posts/post/comment/comment.component';
import { AdminComponent } from './admin/admin.component';
import { AgmCoreModule } from '@agm/core';

const appRoutes: Routes = [
  { path: 'allergy', component:  MainComponent, canActivate: [AuthGuard]},
  { path: '', component:  StartPageComponent, canActivate: [AuthGuard]},
  { path: 'chat', component:  ChatComponent, canActivate: [AuthGuard]},
  { path: 'admin', component:  AdminComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyASNBJxA0kqHfEdg5syku8Vn5qCVlwIy0Y'}),
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule
  ],
  declarations: [AdminComponent,MainComponent, NavbarComponent, CardsComponent, CardComponent, StartPageComponent, PostsComponent, PostComponent, AddPostsComponent, WeatherComponent, SearchBarComponent, QuestionComponent, PopularPostsComponent, ChatComponent, CommentComponent],
  providers: [AuthGuard, PostService]
})
export class MainModule { }