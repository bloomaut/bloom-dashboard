import Link from "next/link";

const NotFoundHandler = () => {
  return (
    <html>
      <body>
        <h1>Oops! Page not found</h1>
        <Link href={"/"}>Go Back</Link>
      </body>
    </html>
  );
};

export default NotFoundHandler;
