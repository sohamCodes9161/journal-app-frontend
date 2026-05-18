import FormError from "./FormError";
import FormLabel from "./FormLabel";

function FormField({ label, htmlFor, error, children }) {
  return (
    <div>
      {label && <FormLabel htmlFor={htmlFor}>{label}</FormLabel>}

      {children}

      <FormError error={error} />
    </div>
  );
}

export default FormField;
