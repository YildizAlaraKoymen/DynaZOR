import { useEffect } from "react";
import Schedule from "../components/Schedule/Schedule"
import { useLocation, useNavigate } from "react-router-dom";

const SchedulePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const userID = state?.userID;
  const viewerID = localStorage.getItem("viewerID");
  const viewerRole = localStorage.getItem("viewerRole") || "user";

  useEffect(() => {
    if (!userID) {
    navigate("/login");
    }
  }, [])

  return <Schedule userID={userID} viewerID={viewerID} viewerRole={viewerRole} />
}

export default SchedulePage