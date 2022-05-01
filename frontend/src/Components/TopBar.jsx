import "../Stylesheets/TopBar.scss";
// import { FaUser } from "react-icons/fa";

export function TopBar(props) {
        return <div className="topBar">
            <div>
                <img src="/images/kollekt_full_512.png" alt="" />
            </div>
            <div>
                {props.children}
            </div>
            <div>
                {/* <FaUser /> */}
            </div>
        </div>
}