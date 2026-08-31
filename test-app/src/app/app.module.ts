import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SamTabsNextModule } from "@gsa-sam/sam-ui-elements/src/ui-kit/experimental/tabs";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { TabsGalleryComponent } from "./tabs-gallery/tabs-gallery.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "tabs", component: TabsGalleryComponent },
];

@NgModule({
  declarations: [AppComponent, HomeComponent, TabsGalleryComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    SamTabsNextModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
