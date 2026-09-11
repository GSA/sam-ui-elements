import { faWarnIfIconHtmlMissing } from "./warn-if-icon-html-missing";
import { faWarnIfIconSpecMissing } from "./warn-if-icon-spec-missing";
import { Icon, IconLookup } from "@fortawesome/fontawesome-svg-core";

describe("fa-icon missing-icon warnings", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  describe("faWarnIfIconHtmlMissing", () => {
    it("reports the requested name and prefix when the icon is not registered", () => {
      const iconSpec = {
        iconName: "coffee",
        prefix: "fas",
      } as unknown as IconLookup;

      faWarnIfIconHtmlMissing(undefined as unknown as Icon, iconSpec);

      expect(errorSpy).toHaveBeenCalledWith(
        "FontAwesome: Could not find icon with iconName=coffee and prefix=fas"
      );
    });

    it("stays silent when the icon was resolved", () => {
      const iconSpec = {
        iconName: "coffee",
        prefix: "fas",
      } as unknown as IconLookup;

      faWarnIfIconHtmlMissing({} as Icon, iconSpec);

      expect(errorSpy).not.toHaveBeenCalled();
    });

    it("stays silent when no icon was requested at all", () => {
      faWarnIfIconHtmlMissing(
        undefined as unknown as Icon,
        undefined as unknown as IconLookup
      );

      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe("faWarnIfIconSpecMissing", () => {
    it("reports a null or undefined icon object", () => {
      faWarnIfIconSpecMissing(undefined as unknown as IconLookup);

      expect(errorSpy).toHaveBeenCalledWith(
        "FontAwesome: Could not find icon. " +
          "It looks like you've provided a null or undefined icon object to this component."
      );
    });

    it("stays silent when an icon spec is provided", () => {
      faWarnIfIconSpecMissing({
        iconName: "coffee",
        prefix: "fas",
      } as unknown as IconLookup);

      expect(errorSpy).not.toHaveBeenCalled();
    });
  });
});
