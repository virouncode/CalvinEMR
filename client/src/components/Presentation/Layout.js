import { Outlet } from "react-router-dom";
import Header from "./Header";
import Welcome from "./Welcome";
import ConfirmGlobal from "../Confirm/ConfirmGlobal";
import { ToastContainer } from "react-toastify";
import { useRef } from "react";

const Layout = () => {
  const DIALOG_CONTAINER_STYLE = {
    height: "200vh",
    width: "100vw",
    fontFamily: "Arial",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    top: "0px",
    left: "0px",
    background: "rgba(0,0,0,0.8)",
    zIndex: "100000",
  };
  return (
    <>
      <Header />
      <Welcome />
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
      </main>
      {/* <Footer /> */}
      <ConfirmGlobal containerStyle={DIALOG_CONTAINER_STYLE} />
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
    </>
  );
};

export default Layout;
