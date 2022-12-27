import { extend } from "vee-validate";
import { required, confirmed, min, email } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "Dieses Feld ist erforderlich",
});
extend("confirmed", {
  ...confirmed,
  message: "Die Passwörter stimmen nicht überein",
});
extend("min", {
  ...min,
  message: "Das Passwort benötigt mindestens {length} Zeichen",
});
extend("min", {
  ...min,
  message: "Das Passwort benötigt mindestens {length} Zeichen",
});
extend("email", {
  ...email,
  message: "Das E-Mail-Feld muss eine gültige E-Mail sein",
});
