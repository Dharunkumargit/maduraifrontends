import React, { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { GrGroup } from 'react-icons/gr'
import { Roledata } from '../../../components/Data';
import axios from "axios";
import AddRoles from './AddRoles';
import { toast } from 'react-toastify';
import { API } from '../../../../const';

const Roles = () => {
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/roles/getroles`);
      setRoleData(response.data.data);
    } catch (error) {
      toast.error("Fetch Role Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);
  const Columns = [
    
    { label: "Role Name", key: "role_name" },
    { label: "Created By", key: "created_by_user" },
    
  ];

  const handleDeleteRole = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this role?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/roles/deleterolebyid/${id}`);
      toast.success("Role deleted successfully");
      // Remove row instantly
      setRoleData((prev) => prev.filter((role) => role._id !== id));
    } catch (error) {
      toast.error("Failed to delete role");
      console.error(error);
    }
    
  }
  return (
    <div>
      <Table title="Settings" sub_title="Roles" pagetitle="Roles" 
      addButtonLabel="Add Role"
      addButtonIcon={<GrGroup size={22}/>}
      colomns={Columns}
      AddModal={true}
      tabledata={roleData}
      onDelete={handleDeleteRole}
      loading={loading}
      showViewButton={false}
      addroutepoint={"addroles"}
      EditModal={true}
      editroutepoint={"editroles"}/>
    </div>
  )
}

export default Roles
