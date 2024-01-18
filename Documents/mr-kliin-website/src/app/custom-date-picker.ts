import { NativeDateAdapter } from "@angular/material";

/** Adapts the native JS Date for use with cdk-based components that work with dates. */
export class CustomDatePicker extends NativeDateAdapter {
  parse(value: string) {
    let it = value.split("/");
    if (it.length == 3) {
      return new Date(+it[2], +it[1] - 1, +it[0], 12);
    }
  }

  format(date: Date, displayFormat: Object) {
    return (
      ("0" + date.getDate()).slice(-2) +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      date.getFullYear()
    );
  }

  getFirstDayOfWeek(): number {
    return 1;
  }
}
