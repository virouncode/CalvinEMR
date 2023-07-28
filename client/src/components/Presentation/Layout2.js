import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import LoginHeader from "../Login/LoginHeader";

const Layout2 = () => {
  return (
    <>
      <LoginHeader />
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout2;
