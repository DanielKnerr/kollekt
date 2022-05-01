import "../Stylesheets/Auth/AuthPageContainer.scss";

export function AuthPageContainer(props) {
    return <div className="authPage">
        <img src="/images/kollekt_full_512.png" alt="" />
        {props.children}
    </div>
}