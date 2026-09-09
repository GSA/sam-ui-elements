import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SamDateRangeV2Module } from "@gsa-sam/sam-ui-elements/src/ui-kit/experimental/date-range-v2/date-range-v2.module";
import { SamFormService } from "@gsa-sam/sam-ui-elements/src/ui-kit/form-service";

// Standalone (unlike its `home`/`tabs-gallery` siblings, which opted out of
// standalone to match this repo's pre-existing `standalone: false` lint
// baseline debt) specifically so it can declare its own dependencies here
// instead of adding another `@angular-eslint/prefer-standalone` warning to
// `AppModule`'s already-baselined set -- see `eslint-baseline.json` /
// AGENTS.md's "Lint" section: the baseline is a ratchet that only ever
// moves down, so a new route must not add a new instance of debt this repo
// is already tracking as accepted.
@Component({
  selector: "app-datepicker-gallery",
  templateUrl: "./datepicker-gallery.component.html",
  standalone: true,
  imports: [FormsModule, SamDateRangeV2Module],
  // SamDateRangeV2Module declares DatepickerComponent, which injects
  // SamFormService, but the module itself does not provide it (that's left
  // to the consuming app -- see SamUIKitModule's `providers: [SamFormService]`
  // for how a full library consumer wires this up). Provide it here so this
  // route can render sam-datepicker-v2 standalone.
  providers: [SamFormService],
})
export class DatepickerGalleryComponent {
  date: Date;
}
