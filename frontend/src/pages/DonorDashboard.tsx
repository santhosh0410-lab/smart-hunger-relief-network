import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

interface Donation {
    id: number;
    title: string;
    category: string;
    description: string;
    quantity: string;
    location: string;
    status: string;
    imageUrl: string | null;
}
interface DonationRequest {
    id: number;
    status: string;
    requestedAt: string;
    volunteer: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    donation: Donation;
}

function DonorDashboard() {
    const navigate = useNavigate();

    const name = localStorage.getItem("name");
    const donorId = localStorage.getItem("userId");

    const [donations, setDonations] = useState<Donation[]>([]);
    const [requests, setRequests] = useState<DonationRequest[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
    fetchMyDonations();
    fetchDonationRequests();
}, []);

    const fetchMyDonations = async () => {
        if (!donorId) {
            setMessage("Please login first.");
            return;
        }

        try {
            const response = await apiRequest(
                `/api/donations/donor/${donorId}`
            );

            if (response.ok) {
                const data = await response.json();
                setDonations(data);
            } else {
                setMessage("Unable to load your donations.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server.");
        }
    };

    const fetchDonationRequests = async () => {
    try {
        const response = await apiRequest("/api/requests");

        if (response.ok) {
            const data = await response.json();
            setRequests(data);
        } else {
            console.error("Unable to load donation requests.");
        }
    } catch (error) {
        console.error(error);
    }
};

const handleAcceptRequest = async (requestId: number) => {
    try {
        const response = await apiRequest(
            `/api/requests/${requestId}/accept`,
            {
                method: "PUT"
            }
        );

        if (response.ok) {
            setMessage("Donation request accepted successfully! ❤️");

            await fetchMyDonations();
            await fetchDonationRequests();
        } else {
            const errorText = await response.text();
            console.error(errorText);
            setMessage("Unable to accept donation request.");
        }
    } catch (error) {
        console.error(error);
        setMessage("Unable to connect to server.");
    }
};

    const getStatusStep = (status: string) => {
    const statuses = [
        "AVAILABLE",
        "REQUESTED",
        "ACCEPTED",
        "PICKED_UP",
        "DISTRIBUTED",
        "COMPLETED"
    ];

    return statuses.indexOf(status);
};

    return (
        <div className="donor-page">

            {/* HERO */}

            <div className="donor-hero">

                <div className="donor-welcome">

                    <span className="donor-badge">
                        🌱 DONOR DASHBOARD
                    </span>

                    <h1>
                        Welcome, {name}! 👋
                    </h1>

                    <p>
                        Your generosity can turn surplus food and groceries
                        into hope for someone in need.
                    </p>

                </div>

                <div className="donor-hero-icon">
                    🍲
                </div>

            </div>


            {/* DONATION ACTIONS */}

            <div className="donor-section">

                <div className="section-heading">

                    <p>MAKE A DIFFERENCE</p>

                    <h2>
                        What would you like to donate?
                    </h2>

                </div>


                <div className="donor-action-grid">

                    <div className="donor-action-card food-card">

                        <div className="action-icon">
                            🍛
                        </div>

                        <h3>
                            Donate Food
                        </h3>

                        <p>
                            Share fresh meals, cooked food, bakery items
                            and more.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/create-donation")
                            }
                        >
                            Donate Food →
                        </button>

                    </div>


                    <div className="donor-action-card grocery-card">

                        <div className="action-icon">
                            🛒
                        </div>

                        <h3>
                            Donate Groceries
                        </h3>

                        <p>
                            Donate rice, vegetables, pulses and other
                            essential groceries.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/create-donation")
                            }
                        >
                            Donate Groceries →
                        </button>

                    </div>


                    <div className="donor-action-card history-card">

                        <div className="action-icon">
                            📦
                        </div>

                        <h3>
                            My Donations
                        </h3>

                        <p>
                            Keep track of the donations you have
                            contributed.
                        </p>

                        <button
                            onClick={() =>
                                document
                                    .getElementById("my-donations")
                                    ?.scrollIntoView({
                                        behavior: "smooth"
                                    })
                            }
                        >
                            View Donations →
                        </button>

                    </div>

                </div>

            </div>


            {/* MESSAGE */}

            {message && (
                <div className="volunteer-message">
                    ❤️ {message}
                </div>
            )}


            {/* MY DONATIONS */}

            <div
                className="donor-section"
                id="my-donations"
            >

                <div className="section-heading">

                    <p>YOUR CONTRIBUTIONS</p>

                    <h2>
                        📦 My Donations
                    </h2>

                </div>


                {donations.length === 0 ? (

                    <div className="empty-donations">

                        <div className="empty-icon">
                            📦
                        </div>

                        <h3>
                            No donations yet
                        </h3>

                        <p>
                            Your food and grocery donations will appear
                            here after you create them.
                        </p>

                        <button
                            className="request-donation-button"
                            onClick={() =>
                                navigate("/create-donation")
                            }
                        >
                            🎁 Create Your First Donation
                        </button>

                    </div>

                ) : (

                    <div className="volunteer-donation-grid">

                        {donations.map((donation) => (

                            <div
                                className="volunteer-donation-card"
                                key={donation.id}
                            >

                                {/* IMAGE */}

                                <div className="donation-image-area">

                                    {donation.imageUrl ? (

                                        <img
                                            src={`${
                                                import.meta.env
                                                    .VITE_API_BASE_URL ||
                                                "https://smart-hunger-relief-backend.onrender.com"
                                            }/uploads/${donation.imageUrl}`}
                                            alt={donation.title}
                                        />

                                    ) : (

                                        <span>
                                            {donation.category === "FOOD"
                                                ? "🍛"
                                                : "🛒"}
                                        </span>

                                    )}

                                    <span className="category-badge">

                                        {donation.category === "FOOD"
                                            ? "🍛 FOOD"
                                            : "🛒 GROCERY"}

                                    </span>

                                </div>


                                {/* CONTENT */}

                                <div className="donation-card-content">

                                    <h3>
                                        {donation.title}
                                    </h3>

                                    <p className="donation-description">

                                        {donation.description ||
                                            "Essential donation ready for distribution."}

                                    </p>


                                    <div className="donation-details">

                                        <div>

                                            <span>
                                                📦
                                            </span>

                                            <div>

                                                <small>
                                                    Quantity
                                                </small>

                                                <strong>
                                                    {donation.quantity}
                                                </strong>

                                            </div>

                                        </div>


                                        <div>

                                            <span>
                                                📍
                                            </span>

                                            <div>

                                                <small>
                                                    Location
                                                </small>

                                                <strong>
                                                    {donation.location}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="donation-status">
    <span className="status-dot"></span>
    STATUS: {donation.status}
</div>
{donation.status === "REQUESTED" && (
    <div className="donation-request-box">

        {requests
            .filter(
                (request) =>
                    request.donation?.id === donation.id
                    && request.status === "PENDING"
            )
            .map((request) => (
                <div
                    className="request-details"
                    key={request.id}
                >
                    <p>
                        🤝 Volunteer Request
                    </p>

                    <strong>
                        {request.volunteer?.name}
                    </strong>

                    <span>
                        {request.volunteer?.email}
                    </span>

                    <button
                        className="request-donation-button"
                        onClick={() =>
                            handleAcceptRequest(request.id)
                        }
                    >
                        ✅ Accept Request
                    </button>
                </div>
            ))}

    </div>
)}
<div className="status-progress">

    {[
        "AVAILABLE",
        "REQUESTED",
        "ACCEPTED",
        "PICKED_UP",
        "DISTRIBUTED",
        "COMPLETED"
    ].map((status, index) => {

        const currentStep = getStatusStep(donation.status);

        return (
            <div
                className={`status-step ${
                    index <= currentStep ? "status-step-active" : ""
                }`}
                key={status}
            >
                <div className="status-step-circle">
                    {index <= currentStep ? "✓" : index + 1}
                </div>

                <span>
                    {status.replace("_", " ")}
                </span>
            </div>
        );
    })}

</div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* IMPACT */}

            <div className="donor-impact">

                <div>

                    <span className="impact-icon">
                        ❤️
                    </span>

                    <div>

                        <strong>
                            Every donation matters
                        </strong>

                        <p>
                            Together, we can reduce food waste and help
                            communities in need.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DonorDashboard;