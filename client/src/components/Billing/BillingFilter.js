import React from "react";
// import axiosXano from "../../api/xano";
// import useAuth from "../../hooks/useAuth";

const BillingFilter = ({ filterDatas, setFilterDatas }) => {
  // const { auth } = useAuth();
  // const [hinSearchVisible, setHinSearchVisible] = useState(false);
  // const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const handleDateChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (value === "" && name === "date_start") {
      value = "1970-01-01";
    } else if (value === "" && name === "date_end") {
      value = "3000-01-01";
    }
    setFilterDatas({ ...filterDatas, [name]: value });
  };
  // const handleChange = (e) => {
  //   const value = e.target.value;
  //   const name = e.target.name;
  //   setFilterDatas({ ...filterDatas, [name]: value });
  // };
  // const handleClickDiagnosis = async (e, code) => {
  //   const diagnosisId = (
  //     await axiosXano.get(`/diagnosis_codes_for_code?code=${code}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${auth.authToken}`,
  //       },
  //     })
  //   ).data.id;
  //   setFilterDatas({ ...filterDatas, diagnosis: diagnosisId });
  //   setDiagnosisSearchVisible(false);
  // };
  // const handleClickHin = (e, hin) => {
  //   setFilterDatas({ ...filterDatas, hin });
  //   setHinSearchVisible(false);
  // };
  return (
    <div className="billing-filter">
      <div className="billing-filter-row">
        <div className="billing-filter-title">Filter</div>
        <div className="billing-filter-row-item">
          <label htmlFor="">From</label>
          <input
            type="date"
            value={filterDatas.date_start}
            name="date_start"
            onChange={handleDateChange}
          />
        </div>
        <div className="billing-filter-row-item">
          <label htmlFor="">To</label>
          <input
            type="date"
            value={filterDatas.date_end}
            name="date_end"
            onChange={handleDateChange}
          />
        </div>
        {/* <div className="billing-filter-row-item">
          <label htmlFor="">Referrer OHIP nbr</label>
          <input
            type="text"
            value={filterDatas.ohip}
            name="ohip"
            onChange={handleChange}
          />
        </div> */}
      </div>
      {/* <div className="billing-filter-row">
        <div className="billing-filter-row-item">
          <label htmlFor="">Patient HIN</label>
          <input
            type="text"
            value={filterDatas.hin}
            name="hin"
            onChange={handleChange}
          />
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setHinSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-filter-row-item">
          <label htmlFor="">Diagnosis code</label>
          <input
            type="text"
            value={filterDatas.diagnosis}
            name="diagnosis"
            onChange={handleChange}
          />
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setDiagnosisSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-filter-row-item">
          <label htmlFor="">Billing Code</label>
          <input
            type="text"
            value={filterDatas.billing_code}
            name="billing_code"
            onChange={handleChange}
          />
        </div>
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
      )} */}
    </div>
  );
};

export default BillingFilter;
