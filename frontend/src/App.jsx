import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getAllNotes } from "./API/Note";
import { getAllLabels } from "./API/User";
import { SidebarLayout } from "./Components/SidebarLayout";
import { Toast } from "./Components/Toast";
import { EntryPage } from "./Pages/Auth/Entry";
import { LogInPage } from "./Pages/Auth/LogIn";
import { RegisterPage } from "./Pages/Auth/Register";
import { Labels } from "./Pages/Labels";
import { OverviewPage } from "./Pages/Overview";
import "./Stylesheets/Base.scss";

function App(props) {
    let [isAuthenticated, setAuthenticated] = useState(props.isAuthenticated);
    let [toast, setToast] = useState("");
    let navigate = useNavigate();
    let location = useLocation();
    let { state } = useLocation();

    let [notes, setNotes] = useState([]);
    let [labels, setLabels] = useState([]);

    const fetchNotes = async () => {
        setNotes(await getAllNotes());
    };

    const fetchLabels = async () => {
        setLabels(await getAllLabels());
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotes();
            fetchLabels();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (state === true) {
            setAuthenticated(true);
        }
    }, [state]);

    // wenn der User authenticated ist dann einfach die normale seite anzeigen, außer wenn es /login oder /register ist, dann auf / weiterleiten (das macht sinn, weil man ja theoretisch /login als bookmark speichern könnte)
    // wenn der User nicht authenticated ist:
    // - ist es /login oder /register, dann anzeigen
    // - sonst auf login weiterleiten, nach dem Login auf die zuerst angefragte Adresse weiterleiten


    useEffect(() => {
        const publicPaths = ["/", "/login", "/register"];

        let isPublicPath = publicPaths.indexOf(location.pathname) !== -1;

        if (isAuthenticated) {
            // wenn es ein öffentlicher Pfad ist => zur "Homepage" weiterleiten
            if (isPublicPath) {
                navigate("/app", { replace: true });
            }

            fetchLabels();
            fetchNotes();
        } else {
            // wenn es ein privater Pfad ist => zur Login Seite weiterleiten
            if (!isPublicPath) {
                navigate("/login", { replace: true, state: location.pathname });
            }
        }
    }, [isAuthenticated, location.pathname, navigate])

    const login = (newAddress) => {
        navigate(newAddress, { replace: true, state: true });
    }

    if (isAuthenticated) {
        return <SidebarLayout setAuthenticated={setAuthenticated}>
            <Routes>
                <Route path="/app" element={<OverviewPage notes={notes} labels={labels} fetchNotes={fetchNotes} fetchLabels={fetchLabels} />} />
                <Route path="/labels" element={<Labels fetchNotes={fetchNotes} labels={labels} fetchLabels={fetchLabels} />} />
            </Routes>
        </SidebarLayout>
    } else {
        return <>
            <Routes>
                <Route path="/" exact element={<EntryPage login={login} />} />
                <Route path="/login" element={<LogInPage login={login} />} />
                <Route path="/register" element={<RegisterPage setToast={setToast} />} />
            </Routes>
            {toast.length > 0 ? <Toast text={toast} closeToast={() => setToast("")} /> : null}
        </>
    }
}

export default App;
