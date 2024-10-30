// components/TeacherLayout.js
import Head from "next/head";

const Layout = ({
  title = "Default Title",
  description = "Default description",
  header = true,
  footer = true,
  children,
  setSchoolData,
  schoolData,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add more meta tags as needed */}
      </Head>
      {header && <header></header>}
      <main>{children}</main>
      {footer && <footer></footer>}
    </>
  );
};

export default Layout;
