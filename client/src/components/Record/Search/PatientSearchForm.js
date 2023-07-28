//Librairies
import React from "react";

const PatientSearchForm = ({ search, setSearch }) => {
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch({ ...search, [name]: value });
  };
  return (
    <section className="patient-search">
      <h1 className="patient-search-title">Search Patient</h1>
      <form>
        <div className="patient-search-item">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={search.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="patient-search-item">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={search.email}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="patient-search-item">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={search.phone}
            onChange={handleChange}
          />
        </div>
        <div className="patient-search-item">
          <label>Date Of Birth</label>
          <input
            type="text"
            name="birth"
            value={search.birth}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="patient-search-item">
          <label>Chart Number</label>
          <input
            type="text"
            name="chart"
            value={search.chart}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="patient-search-item">
          <label>Health Insurance Number</label>
          <input
            type="text"
            name="health"
            value={search.health}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </form>
    </section>
  );
};

export default PatientSearchForm;
