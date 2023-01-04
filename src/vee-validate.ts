import { extend } from "vee-validate";
import {
  required,
  confirmed,
  min,
  email,
  regex,
} from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "Das Feld ist erforderlich",
});
extend("confirmed", {
  ...confirmed,
  message: "Die Passwörter stimmen nicht überein",
});
extend("min", {
  ...min,
  message: "Das Passwort benötigt mindestens {length} Zeichen",
});
extend("email", {
  ...email,
  message: "Die E-Mail muss eine gültige E-Mail sein",
});
extend("requireDigit", {
  ...regex,
  validate: (value) => value.match(/^.*(?=.*[0-9]).*$/) !== null,
  message: "Das Passwort muss mindestens eine Ziffer ('0'-'9') enthalten",
});
extend("requireLowercase", {
  ...regex,
  validate: (value) => value.match(/^.*(?=.*[a-z]).*$/) !== null,
  message:
    "Das Passwort muss mindestens einen Kleinbuchstaben ('a'-'z') enthalten",
});
extend("requireNonAlphanumeric", {
  ...regex,
  validate: (value) => value.match(/^.*(?=.*[^a-zA-Z0-9]).*$/) !== null,
  message:
    "Das Passwort muss mindestens ein nicht alphanumerisches Zeichen enthalten",
});
extend("requireUppercase", {
  ...regex,
  validate: (value) => value.match(/^.*(?=.*[A-Z]).*$/) !== null,
  message:
    "Das Passwort muss mindestens einen Großbuchstaben enthalten ('A'-'Z')",
});
