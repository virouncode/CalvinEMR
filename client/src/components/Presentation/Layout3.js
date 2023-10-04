import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal from "../Confirm/ConfirmGlobal";
import PatientHeader from "../PatientPortal/PatientHeader";
import Welcome from "./Welcome";

const Layout3 = () => {
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
      <PatientHeader />
      <Welcome />
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
      </main>
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

export default Layout3;
