import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal from "../Confirm/ConfirmGlobal";
import Header from "./Header";
import Welcome from "./Welcome";

const Layout = () => {
  return (
    <>
      <Header />
      <Welcome />
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
        <ConfirmGlobal />
        <ToastContainer
          enableMultiContainer
          containerId={"A"}
          position="bottom-right"
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={1}
        />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
