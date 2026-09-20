import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault();

        try {

            const response = await apiRequest(
                "/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            if (response.ok) {

                const data = await response.json();

                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.id);
                localStorage.setItem("role", data.role);
                localStorage.setItem("name", data.name);

                setMessage("Login successful!");

                console.log("Login response:", data);

                if (data.role === "DONOR") {
                    navigate("/donor-dashboard");
                } else if (data.role === "VOLUNTEER") {
                    navigate("/volunteer-dashboard");
                }

            } else {

                setMessage("Invalid email or password.");

            }

        } catch (error) {

            console.error(error);
            setMessage("Unable to connect to server.");

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    🔐
                </div>

                <p className="auth-label">
                    WELCOME BACK
                </p>

                <h1>Login</h1>

                <p className="auth-description">
                    Sign in to continue helping your community.
                </p>

                <form onSubmit={handleLogin}>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Login
                    </button>

                </form>

                {message && (
                    <p className={
                        message === "Login successful!"
                            ? "success-message"
                            : "error-message"
                    }>
                        {message}
                    </p>
                )}

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <p className="auth-footer-text">
                    Don't have an account?
                    {" "}
                    <Link to="/register">
                        Create one
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;