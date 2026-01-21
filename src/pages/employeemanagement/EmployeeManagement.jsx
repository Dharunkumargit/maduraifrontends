import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'
import { Employeemanagementdata } from '../../components/Data';
import AddEmploye from './AddEmploye';

import { LuContact } from 'react-icons/lu';
import { API } from '../../../const';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const Columns = [
    { label: "Name", key: "name" },
    
    { label: "Phone Number", key: "phonenumber" },
    
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
      
      />
    </div>
  )
}

export default EmployeeManagement
