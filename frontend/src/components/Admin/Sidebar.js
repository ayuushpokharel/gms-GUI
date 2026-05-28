import React from "react";
import { Link } from "react-router-dom";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/admin/dashboard" className="sidebar-brand">
        🏋️ <span>GMS Admin</span>
      </Link>

      <div className="sidebar-nav">
        <Link to="/admin/dashboard" className="sidebar-link">
          <DashboardIcon fontSize="small" />
          <span>Dashboard</span>
        </Link>

        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          className="sidebar-tree"
        >
          <TreeItem
            nodeId="classes"
            label={
              <div className="sidebar-tree-label">
                <FitnessCenterIcon fontSize="small" />
                <span>Classes</span>
              </div>
            }
          >
            <TreeItem
              nodeId="all-classes"
              label={
                <Link to="/admin/classes" className="sidebar-sub-link">
                  <ListIcon fontSize="small" />
                  All Classes
                </Link>
              }
            />
            <TreeItem
              nodeId="add-class"
              label={
                <Link to="/admin/class" className="sidebar-sub-link">
                  <AddIcon fontSize="small" />
                  Add Class
                </Link>
              }
            />
          </TreeItem>
        </TreeView>

        <Link to="/admin/memberships" className="sidebar-link">
          <CardMembershipIcon fontSize="small" />
          <span>Memberships</span>
        </Link>

        <Link to="/admin/users" className="sidebar-link">
          <PeopleIcon fontSize="small" />
          <span>Users</span>
        </Link>

        <Link to="/admin/reviews" className="sidebar-link">
          <RateReviewIcon fontSize="small" />
          <span>Reviews</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
