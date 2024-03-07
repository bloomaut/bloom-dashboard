import Link from "next/link";

const NotFoundHandler = () => {
  return (
    <div>
      <h1>Oops! Page not found</h1>
      <Link href={"/"}>Go Back</Link>
    </div>
  );
};

export default NotFoundHandler;
