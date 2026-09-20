import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DonorDashboard from "./pages/DonorDashboard";
import CreateDonation from "./pages/CreateDonation";
import VolunteerDashboard from "./pages/VolunteerDashboard";

import "./App.css";

function Home() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const goToDashboard = () => {

        if (role === "DONOR") {
            navigate("/donor-dashboard");
        } else if (role === "VOLUNTEER") {
            navigate("/volunteer-dashboard");
        } else {
            navigate("/login");
        }
    };

    return (

        <div className="home-page">

            {/* Hero */}

            <section className="hero">

                <div className="hero-content">

                    <span className="hero-tag">
                        🌱 SHARE • SERVE • SUPPORT
                    </span>

                    <h1 className="project-title">
                        SMART HUNGER
                        <span> RELIEF NETWORK</span>
                    </h1>

                    <p className="hero-description">
                        Connecting surplus food and groceries with
                        volunteers who help deliver them to people
                        in need.
                    </p>


                    <div className="hero-buttons">

                        {token ? (

                            <button
                                className="primary-button"
                                onClick={goToDashboard}
                            >
                                Go to Dashboard →
                            </button>

                        ) : (

                            <>
                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                >
                                    Join the Network →
                                </button>

                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                >
                                    Login
                                </button>
                            </>

                        )}

                    </div>

                </div>


                <div className="hero-visual">

                    <div className="hero-food-circle">
                        🍲
                    </div>

                    <div className="floating-card food-float">
                        🍛
                        <span>
                            Surplus Food
                        </span>
                    </div>

                    <div className="floating-card grocery-float">
                        🛒
                        <span>
                            Groceries
                        </span>
                    </div>

                    <div className="floating-card volunteer-float">
                        🤝
                        <span>
                            Volunteers
                        </span>
                    </div>

                </div>

            </section>


            {/* Categories */}

            <section className="category-section">

                <div className="section-title">

                    <p>
                        WHAT WE CONNECT
                    </p>

                    <h2>
                        Turning surplus into support
                    </h2>

                </div>


                <div className="category-grid">

                    <div className="category-card">

                        <div className="category-icon">
                            🍛
                        </div>

                        <h3>
                            Surplus Food
                        </h3>

                        <p>
                            Fresh meals and extra food can reach
                            people instead of going to waste.
                        </p>

                    </div>


                    <div className="category-card">

                        <div className="category-icon">
                            🛒
                        </div>

                        <h3>
                            Essential Groceries
                        </h3>

                        <p>
                            Rice, vegetables, pulses and other
                            useful groceries can make a difference.
                        </p>

                    </div>


                    <div className="category-card">

                        <div className="category-icon">
                            🤝
                        </div>

                        <h3>
                            Helping Volunteers
                        </h3>

                        <p>
                            Volunteers connect available donations
                            with communities that need support.
                        </p>

                    </div>

                </div>

            </section>


            {/* How it works */}

            <section className="how-section">

                <div className="section-title">

                    <p>
                        HOW IT WORKS
                    </p>

                    <h2>
                        Three simple steps
                    </h2>

                </div>


                <div className="steps-grid">

                    <div className="step-card">

                        <span>
                            01
                        </span>

                        <div>
                            <strong>
                                Donate
                            </strong>

                            <p>
                                Donors post surplus food or
                                groceries.
                            </p>
                        </div>

                    </div>


                    <div className="step-card">

                        <span>
                            02
                        </span>

                        <div>
                            <strong>
                                Connect
                            </strong>

                            <p>
                                Volunteers find available
                                donations and request them.
                            </p>
                        </div>

                    </div>


                    <div className="step-card">

                        <span>
                            03
                        </span>

                        <div>
                            <strong>
                                Distribute
                            </strong>

                            <p>
                                Donations are collected and
                                delivered to people in need.
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* CTA */}

            <section className="home-cta">

                <div>

                    <span>
                        ❤️
                    </span>

                    <h2>
                        One donation can make a difference.
                    </h2>

                    <p>
                        Be part of a community working together
                        to reduce food waste and support people.
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/register")
                    }
                >
                    Become a Donor or Volunteer →
                </button>

            </section>

        </div>
    );
}

function DonorRoute() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "DONOR") {
        return <Navigate to="/login" replace />;
    }

    return <DonorDashboard />;
}


function VolunteerRoute() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "VOLUNTEER") {
        return <Navigate to="/login" replace />;
    }

    return <VolunteerDashboard />;
}

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <main>
                <Routes>

                    <Route path="/" element={<Home />} />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/donor-dashboard"
                        element={<DonorRoute />}
                    />

                    <Route
                        path="/volunteer-dashboard"
                        element={<VolunteerRoute />}
                    />

                    <Route
                        path="/create-donation"
                        element={<CreateDonation />}
                    />

                </Routes>
            </main>

            <Footer />

        </BrowserRouter>
    );
}

export default App;