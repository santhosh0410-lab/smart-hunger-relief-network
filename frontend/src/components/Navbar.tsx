import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        navigate("/login");
    };

    return (

        <nav className="navbar">

            <div className="navbar-brand">

                <span className="navbar-logo">
                    🍲
                </span>

                <h1>
                    SMART HUNGER RELIEF NETWORK
                </h1>

            </div>


            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>


                {token && role === "DONOR" && (

                    <Link to="/donor-dashboard">
                        Dashboard
                    </Link>

                )}


                {token && role === "VOLUNTEER" && (

                    <Link to="/volunteer-dashboard">
                        Dashboard
                    </Link>

                )}


                {!token && (

                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>

                )}


                {token && (

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                )}

            </div>

        </nav>
    );
}

export default Navbar;