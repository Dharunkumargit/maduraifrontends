import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'
import { Employeemanagementdata } from '../../components/Data';
import AddEmploye from './AddEmploye';

import { LuContact } from 'react-icons/lu';
import { API } from '../../../const';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditEmployee from './EditEmployee';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const Columns = [
    { label: "Name", key: "name" },
    
    { label: "Phone Number", key: "phonenumber" },
    { label: "Email ID", key: "emailid" },
    { label: "Location", key: "location" },
    { label: "Designation", key: "designation" },
    { label: "Status", key: "status" },
    
  ];
  const getEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employee/getemployees`);
      setEmployees(res.data.data);
    } catch (err) {
      console.log("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);
 
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(`${API}/employee/deleteemployee/${id}`);

    toast.success("Employee deleted successfully");

    // ✅ Correct state update
    setEmployees((prev) => prev.filter((emp) => emp._id !== id));

  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error.response?.data?.message || "Delete failed");
  }
};

  

  return (
    <div>
      <Table title="Employee Management" sub_title="Table" pagetitle="Employee Management"
      colomns={Columns}
      tabledata={employees}
      addButtonLabel="Add Employee"
      addButtonIcon={<LuContact size={22}/>}
      AddModal={(modalProps) => <AddEmploye {...modalProps} onclose={() => {
        modalProps.onclose();
        getEmployees(); 
      }} />}
      
      showViewButton={false}
      showDeleteButton={true}
      onDelete={handleDelete}
      EditModal={EditEmployee}
      />
    </div>
  )
}

export default EmployeeManagement
