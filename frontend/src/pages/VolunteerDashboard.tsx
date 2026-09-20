import { useEffect, useState } from "react";
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
    donation: Donation;
}

function VolunteerDashboard() {
    const name = localStorage.getItem("name");
    const volunteerId = localStorage.getItem("userId");

    const [donations, setDonations] = useState<Donation[]>([]);
    const [requests, setRequests] = useState<DonationRequest[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchAvailableDonations();
        fetchMyRequests();
    }, []);

    const fetchAvailableDonations = async () => {
        try {
            const response = await apiRequest(
                "/api/donations/status/AVAILABLE"
            );

            if (response.ok) {
                const data = await response.json();
                setDonations(data);
            } else {
                setMessage("Unable to load donations.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server.");
        }
    };

    const fetchMyRequests = async () => {
        if (!volunteerId) {
            return;
        }

        try {
            const response = await apiRequest(
                `/api/requests/volunteer/${volunteerId}`
            );

            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            } else {
                console.error("Unable to load volunteer requests.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRequestDonation = async (donationId: number) => {
        

        try {
            const response = await apiRequest(
    `/api/requests?donationId=${donationId}`,
    {
        method: "POST"
    }
);


            if (response.ok) {
                setMessage("Donation requested successfully! ❤️");

                setDonations((previousDonations) =>
                    previousDonations.filter(
                        (donation) => donation.id !== donationId
                    )
                );

                await fetchMyRequests();
            } else {
                const errorText = await response.text();
                console.error(errorText);
                setMessage("Unable to request donation.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server.");
        }
    };

    const handleUpdateStatus = async (
    requestId: number,
    status: string
) => {
    try {
        const response = await apiRequest(
            `/api/requests/${requestId}/status?status=${status}`,
            {
                method: "PUT"
            }
        );

        if (response.ok) {
            setMessage(`Donation status updated to ${status}! ❤️`);
            await fetchMyRequests();
        } else {
            const errorText = await response.text();
            console.error(errorText);
            setMessage("Unable to update donation status.");
        }
    } catch (error) {
        console.error(error);
        setMessage("Unable to connect to server.");
    }
};

    return (
        <div className="volunteer-page">

            <div className="volunteer-hero">
                <div className="volunteer-welcome">
                    <span className="volunteer-badge">
                        🤝 VOLUNTEER DASHBOARD
                    </span>

                    <h1>
                        Welcome, {name}! 👋
                    </h1>

                    <p>
                        Help collect and distribute food and groceries
                        to people who need them.
                    </p>
                </div>

                <div className="volunteer-hero-icon">
                    🤝
                </div>
            </div>

            <div className="volunteer-content">

                {/* AVAILABLE DONATIONS */}

                <div className="volunteer-heading">
                    <div>
                        <p>MAKE AN IMPACT</p>
                        <h2>Available Donations</h2>
                    </div>

                    <span className="donation-count">
                        {donations.length} Available
                    </span>
                </div>

                {message && (
                    <div className="volunteer-message">
                        ❤️ {message}
                    </div>
                )}

                {donations.length === 0 ? (
                    <div className="empty-donations">
                        <div className="empty-icon">
                            🍽️
                        </div>

                        <h3>No donations available</h3>

                        <p>
                            New donations will appear here when donors
                            share food or groceries.
                        </p>
                    </div>
                ) : (
                    <div className="volunteer-donation-grid">

                        {donations.map((donation) => (

                            <div
                                className="volunteer-donation-card"
                                key={donation.id}
                            >

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
                                            <span>📦</span>

                                            <div>
                                                <small>Quantity</small>
                                                <strong>
                                                    {donation.quantity}
                                                </strong>
                                            </div>
                                        </div>

                                        <div>
                                            <span>📍</span>

                                            <div>
                                                <small>Pickup Location</small>
                                                <strong>
                                                    {donation.location}
                                                </strong>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="donation-status">
                                        <span className="status-dot"></span>
                                        {donation.status}
                                    </div>

                                    <button
                                        className="request-donation-button"
                                        onClick={() =>
                                            handleRequestDonation(
                                                donation.id
                                            )
                                        }
                                    >
                                        🤝 Request This Donation
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

                {/* MY REQUESTS */}

                <div className="my-requests-section">

                    <div className="volunteer-heading">
                        <div>
                            <p>YOUR ACTIVITY</p>
                            <h2>🤝 My Donation Requests</h2>
                        </div>

                        <span className="donation-count">
                            {requests.length} Requests
                        </span>
                    </div>

                    {requests.length === 0 ? (

                        <div className="empty-donations">
                            <div className="empty-icon">
                                📋
                            </div>

                            <h3>No donation requests yet</h3>

                            <p>
                                Donations you request will appear here.
                            </p>
                        </div>

                    ) : (

                        <div className="volunteer-donation-grid">

                            {requests.map((request) => (

                                <div
                                    className="volunteer-donation-card"
                                    key={request.id}
                                >

                                    <div className="donation-image-area">

                                        {request.donation?.imageUrl ? (
                                            <img
                                                src={`${
                                                    import.meta.env
                                                        .VITE_API_BASE_URL ||
                                                    "https://smart-hunger-relief-backend.onrender.com"
                                                }/uploads/${
                                                    request.donation.imageUrl
                                                }`}
                                                alt={
                                                    request.donation.title
                                                }
                                            />
                                        ) : (
                                            <span>
                                                {request.donation?.category ===
                                                "FOOD"
                                                    ? "🍛"
                                                    : "🛒"}
                                            </span>
                                        )}

                                        <span className="category-badge">
                                            {request.donation?.category ===
                                            "FOOD"
                                                ? "🍛 FOOD"
                                                : "🛒 GROCERY"}
                                        </span>

                                    </div>

                                    <div className="donation-card-content">

                                        <h3>
                                            {request.donation?.title}
                                        </h3>

                                        <p className="donation-description">
                                            {request.donation?.description ||
                                                "Donation requested for distribution."}
                                        </p>

                                        <div className="donation-details">

                                            <div>
                                                <span>📦</span>

                                                <div>
                                                    <small>Quantity</small>
                                                    <strong>
                                                        {
                                                            request.donation
                                                                ?.quantity
                                                        }
                                                    </strong>
                                                </div>
                                            </div>

                                            <div>
                                                <span>📍</span>

                                                <div>
                                                    <small>
                                                        Pickup Location
                                                    </small>
                                                    <strong>
                                                        {
                                                            request.donation
                                                                ?.location
                                                        }
                                                    </strong>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="donation-status">
                                            <span className="status-dot"></span>
                                            REQUEST: {request.status}
                                        </div>

                                        <div className="donation-status">
                                            <span className="status-dot"></span>
                                            DONATION:{" "}
                                            {request.donation?.status}
                                        </div>
                                        {request.donation?.status === "ACCEPTED" && (
    <button
        className="request-donation-button"
        onClick={() =>
            handleUpdateStatus(request.id, "PICKED_UP")
        }
    >
        🚚 Mark as Picked Up
    </button>
)}

{request.donation?.status === "PICKED_UP" && (
    <button
        className="request-donation-button"
        onClick={() =>
            handleUpdateStatus(request.id, "DISTRIBUTED")
        }
    >
        📦 Mark as Distributed
    </button>
)}

{request.donation?.status === "DISTRIBUTED" && (
    <button
        className="request-donation-button"
        onClick={() =>
            handleUpdateStatus(request.id, "COMPLETED")
        }
    >
        ✅ Mark as Completed
    </button>
)}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

            <div className="volunteer-impact">

                <span>🌱</span>

                <div>
                    <strong>
                        Your time creates real impact
                    </strong>

                    <p>
                        Every pickup you make helps connect surplus
                        resources with people in need.
                    </p>
                </div>

            </div>

        </div>
    );
}

export default VolunteerDashboard;