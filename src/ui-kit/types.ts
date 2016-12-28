export type OptionsType = Array<{
  value: string | number, // the model value
  label: string, // the visible text for the input or option
  name: string, // the machine readable description of the input
  disabled?: boolean // if true, the option is greyed out and not clickable
}>;
