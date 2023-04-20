import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
  return (control: AbstractControl):
  ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      c && c.updateValueAndValidity();
      return null;
    }
    return !!control.parent && !!control.parent.value && control.value === (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value) {
    const matches = control.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    return matches ? null : { 'email': true };
  } else {
    return null;
  }
}
