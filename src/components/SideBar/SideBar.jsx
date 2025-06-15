import "./SideBar.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import defaultAvatar from "../../assets/avatar.png";

function SideBar() {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="sidebar">
      <img
        className="sidebar__avatar"
        src={currentUser?.avatar || defaultAvatar}
        alt={`${currentUser?.name || "User"} avatar`}
      />
      <p className="sidebar__username">{currentUser?.name || "User"}</p>
    </div>
  );
}

export default SideBar;
