import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SamTabsNextModule } from "@gsa-sam/sam-ui-elements/src/ui-kit/experimental/tabs";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { TabsGalleryComponent } from "./tabs-gallery/tabs-gallery.component";
import { DatepickerGalleryComponent } from "./datepicker-gallery/datepicker-gallery.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "tabs", component: TabsGalleryComponent },
  { path: "datepicker", component: DatepickerGalleryComponent },
];

@NgModule({
  declarations: [AppComponent, HomeComponent, TabsGalleryComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    SamTabsNextModule,
    // DatepickerGalleryComponent is standalone (see that file for why), so it
    // is imported here rather than added to `declarations`.
    DatepickerGalleryComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
