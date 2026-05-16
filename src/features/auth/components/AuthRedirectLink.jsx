import { Link } from "react-router-dom";

function AuthRedirectLink({ text, linkText, to }) {
  return (
    <p className="text-center text-sm text-slate-400">
      {text}{" "}
      <Link
        to={to}
        className="font-medium text-violet-400 hover:text-violet-300"
      >
        {linkText}
      </Link>
    </p>
  );
}

export default AuthRedirectLink;
