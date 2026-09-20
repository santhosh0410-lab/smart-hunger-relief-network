import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("DONOR");
    const [message, setMessage] = useState("");

    const handleRegister = async (e: React.FormEvent) => {

        e.preventDefault();

        const formData = new URLSearchParams();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);

        try {

            const response = await fetch(
                "https://smart-hunger-relief-backend.onrender.com/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },
                    body: formData
                }
            );

            if (response.ok) {

                setMessage("Registration successful!");

                setName("");
                setEmail("");
                setPassword("");
                setRole("DONOR");

            } else {

                setMessage("Registration failed.");

            }

        } catch (error) {

            console.error(error);

            setMessage("Unable to connect to server.");

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                <div className="auth-icon">
                    🌱
                </div>

                <p className="auth-label">
                    JOIN THE NETWORK
                </p>

                <h1>Create Account</h1>

                <p className="auth-description">
                    Become part of a community that shares,
                    supports and makes a difference.
                </p>


                <form onSubmit={handleRegister}>

                    {/* Name */}

                    <label>
                        👤 Full Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />


                    {/* Email */}

                    <label>
                        ✉️ Email Address
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />


                    {/* Password */}

                    <label>
                        🔒 Password
                    </label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />


                    {/* Role */}

                    <label className="role-label">
                        🤝 Choose your role
                    </label>

                    <div className="role-selection">

                        <button
                            type="button"
                            className={
                                role === "DONOR"
                                    ? "role-card selected"
                                    : "role-card"
                            }
                            onClick={() =>
                                setRole("DONOR")
                            }
                        >
                            <span className="role-icon">
                                🍱
                            </span>

                            <strong>Donor</strong>

                            <small>
                                Share food & groceries
                            </small>
                        </button>


                        <button
                            type="button"
                            className={
                                role === "VOLUNTEER"
                                    ? "role-card selected"
                                    : "role-card"
                            }
                            onClick={() =>
                                setRole("VOLUNTEER")
                            }
                        >
                            <span className="role-icon">
                                🤝
                            </span>

                            <strong>Volunteer</strong>

                            <small>
                                Help distribute donations
                            </small>
                        </button>

                    </div>


                    {/* Submit */}

                    <button
                        type="submit"
                        className="auth-button register-button"
                    >
                        Create My Account
                    </button>

                </form>


                {message && (
                    <p className={
                        message ===
                        "Registration successful!"
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
                    Already have an account?
                    {" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;