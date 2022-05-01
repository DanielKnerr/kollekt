import "../Stylesheets/SidebarLayout.scss";
import { Sidebar } from "./Sidebar";

export function SidebarLayout(props) {
    return <div id="layout">
        <Sidebar setAuthenticated={props.setAuthenticated} />
        { props.children }
    </div>
}