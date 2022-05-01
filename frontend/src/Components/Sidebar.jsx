import "../Stylesheets/Sidebar.scss";
import { BsGridFill } from "react-icons/bs";
import { MdLabel, MdLogout, MdSettings } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { logout } from "../API/User";

function SidebarLink(props) {
    return <NavLink to={props.to}
        className={({ isActive }) =>
            isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
        }>
        {props.icon}
        <span>
            {props.text}
        </span>
    </NavLink>
}

export function Sidebar(props) {
    return <div id="sidebar">
        <div>
            {/* <input placeholder="Search Notes" /> */}
        </div>
        <div>
            <SidebarLink text="Notes" to="/app" icon={<BsGridFill />} />
            <SidebarLink text="Labels" to="/labels" icon={<MdLabel />} />
            <SidebarLink text="Settings" to="/settings" icon={<MdSettings />} />
        </div>
        <div onClick={() => {
            logout().then(() => {
                props.setAuthenticated();
            });
        }}>
            <MdLogout /> Logout
        </div>
    </div>
}