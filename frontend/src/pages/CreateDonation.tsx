import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function CreateDonation() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("FOOD");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        

        

        try {

            const formData = new FormData();

            formData.append("title", title);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("quantity", quantity);
            formData.append("location", location);
            

            if (image) {
                formData.append("image", image);
            }

            const response = await apiRequest(
                "/api/donations",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (response.ok) {

                setMessage("Donation created successfully! ❤️");

                setTitle("");
                setCategory("FOOD");
                setDescription("");
                setQuantity("");
                setLocation("");
                setImage(null);

            } else {

                const errorText = await response.text();
                console.error(errorText);

                setMessage("Unable to create donation.");

            }

        } catch (error) {

            console.error(error);
            setMessage("Unable to connect to server.");

        }
    };

    return (

        <div className="donation-page">

            <div className="donation-card">

                <div className="donation-header">

                    <div className="donation-icon">
                        🎁
                    </div>

                    <p className="donation-label">
                        GIVE WITH PURPOSE
                    </p>

                    <h1>
                        Create a Donation
                    </h1>

                    <p>
                        Share surplus food or groceries and help make
                        someone's day better.
                    </p>

                </div>


                <form
                    className="donation-form"
                    onSubmit={handleSubmit}
                >

                    {/* Donation Title */}

                    <div className="donation-form-group">

                        <label>
                            Donation Title
                        </label>

                        <div className="input-wrapper">

                            <span className="field-icon">
                                🍱
                            </span>

                            <input
                                type="text"
                                placeholder="Example: Fresh Meal Packets"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* Category */}

                    <div className="donation-form-group">

                        <label>
                            What are you donating?
                        </label>

                        <div className="donation-category-selection">

                            <button
                                type="button"
                                className={
                                    category === "FOOD"
                                        ? "donation-category-card selected"
                                        : "donation-category-card"
                                }
                                onClick={() => setCategory("FOOD")}
                            >

                                <span className="category-icon">
                                    🍛
                                </span>

                                <strong>
                                    Food
                                </strong>

                                <small>
                                    Meals, cooked food & bakery items
                                </small>

                            </button>


                            <button
                                type="button"
                                className={
                                    category === "GROCERY"
                                        ? "donation-category-card selected"
                                        : "donation-category-card"
                                }
                                onClick={() => setCategory("GROCERY")}
                            >

                                <span className="category-icon">
                                    🛒
                                </span>

                                <strong>
                                    Groceries
                                </strong>

                                <small>
                                    Rice, vegetables & essentials
                                </small>

                            </button>

                        </div>

                    </div>


                    {/* Description */}

                    <div className="donation-form-group">

                        <label>
                            Description
                        </label>

                        <div className="textarea-wrapper">

                            <span className="field-icon textarea-icon">
                                📝
                            </span>

                            <textarea
                                placeholder="Tell volunteers about the donation..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows={4}
                            />

                        </div>

                    </div>


                    {/* Quantity */}

                    <div className="donation-form-group">

                        <label>
                            Quantity
                        </label>

                        <div className="input-wrapper">

                            <span className="field-icon">
                                📦
                            </span>

                            <input
                                type="text"
                                placeholder="Example: 20 meal packets"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* Location */}

                    <div className="donation-form-group">

                        <label>
                            Pickup Location
                        </label>

                        <div className="input-wrapper">

                            <span className="field-icon">
                                📍
                            </span>

                            <input
                                type="text"
                                placeholder="Where can volunteers collect it?"
                                value={location}
                                onChange={(e) =>
                                    setLocation(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* Image */}

                    <div className="donation-form-group">

                        <label>
                            Donation Image
                        </label>

                        <label className="image-upload">

                            <span className="upload-icon">
                                📸
                            </span>

                            <span className="upload-title">
                                {image
                                    ? image.name
                                    : "Add a photo of your donation"}
                            </span>

                            <span className="upload-subtitle">
                                Help volunteers know what is available
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {

                                    if (e.target.files) {
                                        setImage(e.target.files[0]);
                                    }

                                }}
                            />

                        </label>

                    </div>


                    {/* Message */}

                    {message && (

                        <div className="donation-message">
                            {message}
                        </div>

                    )}


                    {/* Submit */}

                    <button
                        type="submit"
                        className="donation-submit"
                    >
                        ❤️ Create Donation
                    </button>


                    {/* Back */}

                    <button
                        type="button"
                        className="back-button"
                        onClick={() =>
                            navigate("/donor-dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </form>

            </div>

        </div>
    );
}

export default CreateDonation;