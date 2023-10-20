import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosXano from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { confirmAlert } from "../Confirm/ConfirmGlobal";
import LinkForm from "./LinkForm";

const Reference = () => {
  const { user, auth, clinic, setClinic } = useAuth();
  const [myLinks, setMyLinks] = useState(
    clinic.staffInfos.find(({ id }) => id === user.id).links
  );
  const [addVisible, setAddVisible] = useState(false);
  const handleAdd = () => {
    setAddVisible(true);
  };
  const handleRemoveLink = async (e, linkName) => {
    if (
      await confirmAlert({ content: "Do you reall want to remove this link ?" })
    ) {
      const myNewLinks = [...myLinks].filter(({ name }) => name !== linkName);
      try {
        const userInfos = clinic.staffInfos.find(({ id }) => id === user.id);
        const datasToPut = { ...userInfos, links: myNewLinks };
        await axiosXano.put(`/staff/${user.id}`, datasToPut, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        setAddVisible(false);
        setMyLinks(myNewLinks);
        //update staffInfos
        const response2 = await axiosXano.get("/staff", {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
            "Content-Type": "application/json",
          },
        });
        setClinic({ ...clinic, staffInfos: response2.data });
        localStorage.setItem(
          "clinic",
          JSON.stringify({ ...clinic, staffInfos: response2.data })
        );
        toast.success("Link deleted successfully", { containerId: "A" });
      } catch (err) {
        toast.error(`Unable to delete link:${err.message}`);
      }
    }
  };

  return (
    <div className="reference">
      <div className="reference__column">
        <h3>Ontario</h3>
        <ul>
          <li>
            <a
              href="https://www.cancercareontario.ca/en"
              target="_blank"
              rel="noreferrer"
            >
              Cancer Care Ontario
            </a>
          </li>
          <li>
            <a
              href="https://www.ontario.ca/page/apply-ohip-and-get-health-card"
              target="_blank"
              rel="noreferrer"
            >
              OHIP
            </a>
          </li>
          <li>
            <a
              href="https://www.health.gov.on.ca/en/pro/programs/ohip/sob/"
              target="_blank"
              rel="noreferrer"
            >
              OHIP Schedule of benefits
            </a>
          </li>
          <li>
            <a
              href="https://www.ontario.ca/document/ohip-infobulletins-2023/"
              target="_blank"
              rel="noreferrer"
            >
              OHIP Info bulletins
            </a>
          </li>
          <li>
            <a
              href="https://www.oma.org/advocacy/campaigns/ontarios-doctors-lead-you-to-better-care/?utm_source=search&utm_medium=textads&utm_campaign=PB_MD_paidsearch&utm_content=responsivead&gclid=CjwKCAjwyY6pBhA9EiwAMzmfwUFGeFBzFvSg7jd5Ungi9onVmS4yJowOZyeC_3JJAHgirp73Wmg3-RoCdsYQAvD_BwE"
              target="_blank"
              rel="noreferrer"
            >
              Ontario Medical Association
            </a>
          </li>
          <li>
            <a
              href="https://www.ontariomd.ca/"
              target="_blank"
              rel="noreferrer"
            >
              Ontario MD
            </a>
          </li>
          <li>
            <a
              href="https://ehealthontario.on.ca/en/health-care-professionals/connectingontario"
              target="_blank"
              rel="noreferrer"
            >
              ComnnectingOntario Clinical Viewer
            </a>
          </li>
          <li>
            <a href="https://otn.ca/" target="_blank" rel="noreferrer">
              OTN
            </a>
          </li>
          <li>
            <a
              href="https://www.publichealthontario.ca/"
              target="_blank"
              rel="noreferrer"
            >
              Public Health Ontario
            </a>
          </li>
          <li>
            <a
              href="https://www.ontario.ca/page/ministry-health"
              target="_blank"
              rel="noreferrer"
            >
              Ontario MOH
            </a>
          </li>
          <li>
            <a href="https://www.cpso.on.ca/" target="_blank" rel="noreferrer">
              College of Physicians and Surgeons of Ontario (CPSO)
            </a>
          </li>
          <li>
            <a href="https://www.cno.org/" target="_blank" rel="noreferrer">
              College of Nurses of Ontario (CNO)
            </a>
          </li>
          <li>
            <a
              href="https://www.lifelabs.com/"
              target="_blank"
              rel="noreferrer"
            >
              Lifelabs
            </a>
          </li>
          <li>
            <a href="https://www.dynacare.ca/" target="_blank" rel="noreferrer">
              Dynacare
            </a>
          </li>
          <li>
            <a href="https://www.mhlab.ca/" target="_blank" rel="noreferrer">
              MedHealth labs
            </a>
          </li>
          <li>
            <a
              href="https://applymd.utoronto.ca/"
              target="_blank"
              rel="noreferrer"
            >
              University of Toronto (Medicine)
            </a>
          </li>
        </ul>

        <h3>Canada</h3>
        <ul>
          <li>
            <a
              href="https://www.canada.ca/en/health-canada.html"
              target="_blank"
              rel="noreferrer"
            >
              Health Canada
            </a>
          </li>
          <li>
            <a
              href="https://www.canada.ca/en/public-health.html"
              target="_blank"
              rel="noreferrer"
            >
              Public Health Agency of Canada
            </a>
          </li>
          <li>
            <a
              href="https://www.royalcollege.ca/"
              target="_blank"
              rel="noreferrer"
            >
              Royal College of Physicians and Surgeons of Canada
            </a>
          </li>
          <li>
            <a
              href="https://www.cfpc.ca/en/home"
              target="_blank"
              rel="noreferrer"
            >
              College of Family Physicians of Canada
            </a>
          </li>
          <li>
            <a href="https://www.cma.ca/" target="_blank" rel="noreferrer">
              Canadian Medical Association
            </a>
          </li>
        </ul>

        <h3>International</h3>
        <ul>
          <li>
            <a href="https://www.who.int/" target="_blank" rel="noreferrer">
              WHO
            </a>
          </li>
        </ul>
      </div>

      <div className="reference__column">
        <h3>USA</h3>
        <ul>
          <li>
            <a href="https://www.fda.gov/" target="_blank" rel="noreferrer">
              FDA
            </a>
          </li>
          <li>
            <a href="https://www.usmle.org/" target="_blank" rel="noreferrer">
              US Medical Licensing Medical Examination
            </a>
          </li>
        </ul>
        <h3>Commercial links</h3>
        <ul>
          <li>
            <a
              href="https://www.uptodate.com/login"
              target="_blank"
              rel="noreferrer"
            >
              UpToDate
            </a>
          </li>
        </ul>
        <h3>Drugs databases</h3>
        <ul>
          <li>
            <a
              href="https://www.pharmacists.ca/products-services/cps-subscriptions/"
              target="_blank"
              rel="noreferrer"
            >
              CPS
            </a>
          </li>
          <li>
            <a
              href="https://www.shoppersdrugmart.ca/en/rx-inventory"
              target="_blank"
              rel="noreferrer"
            >
              Shoppers Drugmart Drug locator and inventory (free)
            </a>
          </li>
          <li>
            <a href="https://www.drugs.com/" target="_blank" rel="noreferrer">
              Drugs.com (free)
            </a>
          </li>
          <li>
            <a
              href="https://www.pdr.net/browse-by-drug-name"
              target="_blank"
              rel="noreferrer"
            >
              PDR/ConnectiveRx (free)
            </a>
          </li>
          <li>
            <a
              href="https://www.epocrates.com/online/drugs"
              target="_blank"
              rel="noreferrer"
            >
              Epocrates (free after registration) - Drugs database
            </a>
          </li>
          <li>
            <a
              href="https://www.epocrates.com/online/diseases"
              target="_blank"
              rel="noreferrer"
            >
              Epocrates (free after registration) - Disease database
            </a>
          </li>
          <li>
            <a
              href="https://www.epocrates.com/online/interaction-check"
              target="_blank"
              rel="noreferrer"
            >
              Epocrates (free after registration) - Interaction check
            </a>
          </li>
          <li>
            <a
              href="https://www.epocrates.com/online/pill-search"
              target="_blank"
              rel="noreferrer"
            >
              Epocrates (free after registration) - Pill identification
            </a>
          </li>
          <li>
            <a
              href="https://www.epocrates.com/online/medical-calculators"
              target="_blank"
              rel="noreferrer"
            >
              Epocrates (free after registration) - Calculators
            </a>
          </li>
          <li>
            <a
              href="https://www.epocrates.com/online/tables"
              target="_blank"
              rel="noreferrer"
            >
              Epocrates (free after registration) - Tables
            </a>
          </li>
          <li>
            <a
              href="https://www.epocrates.com/online/guidelines"
              target="_blank"
              rel="noreferrer"
            >
              Epocrates (free after registration) - Guidelines
            </a>
          </li>
        </ul>
      </div>
      <div className="reference__column">
        <div className="reference__personal-title">
          <h3>Personal Links</h3>
          <button onClick={handleAdd} disabled={addVisible}>
            Add
          </button>
        </div>
        {addVisible && (
          <LinkForm setAddVisible={setAddVisible} setMyLinks={setMyLinks} />
        )}
        <ul>
          {myLinks.length
            ? myLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.name}
                  </a>
                  <i
                    className="fa-solid fa-trash"
                    style={{ cursor: "pointer", marginLeft: "5px" }}
                    onClick={(e) => handleRemoveLink(e, link.name)}
                  ></i>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

export default Reference;
