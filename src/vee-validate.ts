import { extend } from "vee-validate";
import { required, confirmed, min } from "vee-validate/dist/rules";

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
  message: "Das Passwort benötigt mindestens {length} Zeichen"
});
