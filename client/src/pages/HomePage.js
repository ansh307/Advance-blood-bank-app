import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/Layout/Layout";
import Modal from "../components/shared/modal/Modal";
import API from "../services/API";
import moment from "moment";

const HomePage = () => {
  const { loading, error, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  //get function
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-inventory");
      if (data?.success) {
        setData(data?.inventory);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodRecords();
  }, []);

  // 🆕 NEW FUNCTION TO HANDLE DOWNLOAD
  const handleDownloadReport = async () => {
    try {
      console.log("data", data);
      const response = await fetch("http://localhost:8080/api/v1/inventory/download-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: data }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
  
      // Create dynamic filename with current date
      const currentDate = new Date().toISOString().split("T")[0]; // e.g. "2025-04-29"
      const filename = `blood_inventory_report_${currentDate}.pdf`;
  
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Failed to download PDF report");
    }
  };
  

  

  return (
    <Layout>
      {user?.role === "admin" && navigate("/admin")}
      {error && <span>{alert(error)}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <h4
                className="ms-4"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-plus text-success py-4"></i>
                Add Inventory
              </h4>

              {/* 🆕 NEW BUTTON */}
              <button className="btn btn-success me-4" onClick={handleDownloadReport}>
                Download Report (PDF)
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Blood Group</th>
                  <th scope="col">Inventory Type</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Donar Email</th>
                  <th scope="col">Time & Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((record) => (
                  <tr key={record._id}>
                    <td>{record.bloodGroup}</td>
                    <td>{record.inventoryType}</td>
                    <td>{record.quantity} (ML)</td>
                    <td>{record.email}</td>
                    <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Modal />
          </div>
        </>
      )}
    </Layout>
  );
};

export default HomePage;
