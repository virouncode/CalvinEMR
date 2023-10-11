import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosXano from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { toLocalDate } from "../../utils/formatDates";
import { staffIdToOhip } from "../../utils/staffIdToOhip";
import { billingFormSchema } from "../../validation/billingValidation";
import FakeWindow from "../Presentation/FakeWindow";
import DiagnosisSearch from "./DiagnosisSearch";
import HinSearch from "./HinSearch";

const BillingForm = ({ setAddVisible, setBillings, setErrMsg }) => {
  const { auth, user, clinic } = useAuth();
  const [formDatas, setFormDatas] = useState({
    date: toLocalDate(Date.now()),
    provider_ohip_nbr: staffIdToOhip(clinic.staffInfos, user.id),
    referrer_ohip_nbr: "",
    patient_hin: "",
    diagnosis_code: "",
    billing_codes: [],
  });
  const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const [hinSearchVisible, setHinSearchVisible] = useState(false);

  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "billing_codes") {
      value = value.split(",").map((billing_code) => billing_code.trim());
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleClickDiagnosis = (e, code) => {
    setFormDatas({ ...formDatas, diagnosis_code: code });
    setDiagnosisSearchVisible(false);
  };
  const handleClickHin = (e, hin) => {
    setFormDatas({ ...formDatas, patient_hin: hin });
    setHinSearchVisible(false);
  };
  const handleCancel = () => {
    setErrMsg("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await billingFormSchema.validate({
        ...formDatas,
        billing_codes: formDatas.billing_codes.join(","),
      });
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    if (formDatas.referrer_ohip_nbr.length !== 6) {
      setErrMsg("Referrer OHIP nbr field must be 6-digits");
      return;
    }
    if (
      !clinic.patientsInfos.find(
        ({ health_insurance_nbr }) =>
          health_insurance_nbr === formDatas.patient_hin
      )
    ) {
      setErrMsg("There is no patient with this HIN in the clinic's database");
      return;
    }

    if (
      (
        await axiosXano.get(
          `/diagnosis_codes_for_code?code=${formDatas.diagnosis_code}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data === null
    ) {
      setErrMsg("There is no existing diagnosis with this code");
      return;
    }
    for (const billing_code of formDatas.billing_codes) {
      const response = await axiosXano.get(
        `/ohip_fee_schedule?billing_code=${billing_code}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );

      if (response.data === null) {
        setErrMsg(`Billing code ${billing_code} doesn't exists`);
        return;
      }
    }

    //Submission
    try {
      for (const billing_code of formDatas.billing_codes) {
        const response = await axiosXano.get(
          `/ohip_fee_schedule?billing_code=${billing_code}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        const billing_code_id = response.data.id;
        const datasToPost = {
          date_created: Date.parse(new Date(formDatas.date)),
          provider_id: user.id,
          referrer_ohip_billing_nbr: parseInt(formDatas.referrer_ohip_nbr),
          patient_id: clinic.patientsInfos.find(
            ({ health_insurance_nbr }) =>
              health_insurance_nbr === formDatas.patient_hin
          ).id,
          diagnosis_id: (
            await axiosXano.get(
              `/diagnosis_codes_for_code?code=${formDatas.diagnosis_code}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth.authToken}`,
                },
              }
            )
          ).data.id,
          billing_code_id,
        };
        await axiosXano.post("/billings", datasToPost, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
      }
      const response = await axiosXano.get(`/billings?staff_id=${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setBillings(
        response.data.sort((a, b) => b.date_created - a.date_created)
      );
      setAddVisible(false);
      toast.success(`Billing(s) saved successfully`, { containerId: "A" });
    } catch (err) {
      toast.error(`Can't save billing(s): ${err.message}`, {
        containerId: "A",
      });
    }
  };
  return (
    <form className="billing-form" onSubmit={handleSubmit}>
      <div className="billing-form-title">Add a new billing</div>
      <div className="billing-form-row">
        <div className="billing-form-item">
          <label htmlFor="">Date</label>
          <input
            type="date"
            value={formDatas.date}
            name="date"
            onChange={handleChange}
          />
        </div>
        <div className="billing-form-item">
          <label htmlFor="">Provider OHIP nbr</label>
          <input
            type="text"
            value={formDatas.provider_ohip_nbr.toString()}
            name="provider_ohip_nbr"
            readOnly
            style={{ textAlign: "end" }}
          />
        </div>
        <div className="billing-form-item">
          <label htmlFor="">Referrer OHIP nbr</label>
          <input
            type="text"
            value={formDatas.referrer_ohip_nbr}
            name="referrer_ohip_nbr"
            onChange={handleChange}
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
      <div className="billing-form-row">
        <div className="billing-form-item">
          <label htmlFor="">Patient HIN</label>
          <input
            type="text"
            value={formDatas.patient_hin}
            name="patient_hin"
            onChange={handleChange}
            autoComplete="off"
          />
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setHinSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-form-item">
          <label htmlFor="">Diagnosis code</label>
          <input
            type="text"
            value={formDatas.diagnosis_code}
            name="diagnosis_code"
            onChange={handleChange}
            autoComplete="off"
          />
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setDiagnosisSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-form-item">
          <label htmlFor="">Billing code(s)</label>
          <input
            type="text"
            placeholder="A001,B423,F404,..."
            value={
              formDatas.billing_codes.length > 0
                ? formDatas.billing_codes.join(",")
                : ""
            }
            name="billing_codes"
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="billing-form-btns">
        <input type="submit" />
        <button onClick={handleCancel}>Cancel</button>
      </div>
      {hinSearchVisible && (
        <FakeWindow
          title="HEALTH INSURANCE NUMBER SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setHinSearchVisible}
        >
          <HinSearch handleClickHin={handleClickHin} />
        </FakeWindow>
      )}
      {diagnosisSearchVisible && (
        <FakeWindow
          title="DIAGNOSIS CODES SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setDiagnosisSearchVisible}
        >
          <DiagnosisSearch handleClickDiagnosis={handleClickDiagnosis} />
        </FakeWindow>
      )}
    </form>
  );
};

export default BillingForm;
