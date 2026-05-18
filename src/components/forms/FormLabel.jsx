function FormLabel({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="
        mb-2
        block
        text-sm
        font-medium
        text-slate-300
      "
    >
      {children}
    </label>
  );
}

export default FormLabel;
