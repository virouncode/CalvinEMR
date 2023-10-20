import { useEffect } from "react";

// Custom hook for managing localStorage and detecting tab closures
export const useLocalStorageTracker = () => {
  //Quand j'ouvre une tab
  //Dans un useEffect :
  //Je crée un objet tabCounter  s'il n'existe pas ou j'incrémente de 1 s'il existe

  useEffect(() => {
    const handleTabClosing = () => {
      if (localStorage.getItem("tabCounter") === "1") {
        localStorage.clear();
      } else {
        localStorage.setItem(
          "tabCounter",
          (parseInt(localStorage.getItem("tabCounter")) - 1).toString()
        );
      }
    };
    const tabCounter = localStorage.getItem("tabCounter");
    if (!tabCounter) {
      localStorage.setItem("tabCounter", "1");
    } else {
      localStorage.setItem("tabCounter", (parseInt(tabCounter) + 1).toString());
    }

    window.addEventListener("beforeunload", handleTabClosing);
    return () => {
      window.removeEventListener("beforeunload", handleTabClosing);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useLocalStorageTracker;
