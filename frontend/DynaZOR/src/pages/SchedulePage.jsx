import { useEffect } from "react";
import Schedule from "../components/Schedule/Schedule"
import Navbar from "../components/Navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SchedulePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getUserID } = useAuth();

  // prefer the target user's ID from navigation state; fall back to current user
  const targetUserID = state?.userID || getUserID();
  const currentUserID = getUserID();

  useEffect(() => {
    if (!currentUserID) {
      navigate("/home");
    }
  }, [currentUserID, navigate]);

  return (
    <>
      <Navbar userID={currentUserID}/>
      <Schedule userID={targetUserID} />
    </>
  )
}

export default SchedulePage