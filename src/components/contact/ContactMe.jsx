import React, { useState, useEffect } from 'react';
import Globe3D from './Globe3D';
import './ContactMe.css';

const requirements = [
    'Portfolio', 'Landing Page', 'Website Design', 'Full Stack Website'
];

const ContactMe = () => {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        requirement: '',
        country: '',
        desc: ''
    });

    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(res => res.json())
            .then(data => {
                const countryNames = data.map(c => c.name.common).sort();
                setCountries(countryNames);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleRequirementSelect = (req) => {
        setFormData(prev => ({
            ...prev,
            requirement: req
        }));
        if (errors.requirement) {
            setErrors(prev => ({
                ...prev,
                requirement: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fname.trim()) {
            newErrors.fname = 'First name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.requirement) {
            newErrors.requirement = 'Please select a project requirement';
        }
        if (!formData.country) {
            newErrors.country = 'Please select your country';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (validateForm()) {
            // Handle form submission here
            console.log('Form submitted:', formData);
            // Reset form after successful submission
            setFormData({
                fname: '',
                lname: '',
                email: '',
                requirement: '',
                country: '',
                desc: ''
            });
            setIsSubmitted(false);
        }
    };

    return (
        <section className="contact-section">
            <h2 className="contact-heading center-shadow">CONTACT ME</h2>
            <div className="contact-container compact">
                <div className="contact-form-box compact">
                    <form className="contact-form compact" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group compact half-width">
                                <label htmlFor="fname">First Name</label>
                                <input
                                    type="text"
                                    id="fname"
                                    name="fname"
                                    value={formData.fname}
                                    onChange={handleInputChange}
                                    placeholder="First name"
                                    required
                                    className={isSubmitted && errors.fname ? 'error' : ''}
                                />
                                {isSubmitted && errors.fname && <span className="error-message">{errors.fname}</span>}
                            </div>
                            <div className="form-group compact half-width">
                                <label htmlFor="lname">Last Name</label>
                                <input
                                    type="text"
                                    id="lname"
                                    name="lname"
                                    value={formData.lname}
                                    onChange={handleInputChange}
                                    placeholder="Last name"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group compact full-width">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    required
                                    className={isSubmitted && errors.email ? 'error' : ''}
                                />
                                {isSubmitted && errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group compact full-width">
                                <label>Project Requirement</label>
                                <div className={`tag-row ${isSubmitted && errors.requirement ? 'error' : ''}`}>
                                    {requirements.map((req) => (
                                        <button
                                            type="button"
                                            key={req}
                                            className={`tag-btn${formData.requirement === req ? ' selected' : ''}`}
                                            onClick={() => handleRequirementSelect(req)}
                                        >
                                            {req}
                                        </button>
                                    ))}
                                </div>
                                {isSubmitted && errors.requirement && <span className="error-message">{errors.requirement}</span>}
                            </div>
                        </div>
                        <div className="form-group compact full-width">
                            <label htmlFor="desc">How can I help?</label>
                            <textarea
                                id="desc"
                                name="desc"
                                value={formData.desc}
                                onChange={handleInputChange}
                                placeholder="Feel free to share queries or your needs."
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="submit-btn compact">Submit</button>
                    </form>
                </div>
                <div className="contact-empty-box compact">
                    <Globe3D selectedCountry={formData.country} style={{ marginBottom: '0.5rem' }} />
                    <div className="right-fields">
                        <div className="form-group compact country-group">
                            <label htmlFor="country">Country</label>
                            <div className="custom-select-wrapper">
                                <span className="globe-icon">
                                    <i className="fa-solid fa-globe"></i>
                                </span>
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                    className={`custom-select ${isSubmitted && errors.country ? 'error' : ''}`}
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((country, idx) => (
                                        <option key={idx} value={country}>{country}</option>
                                    ))}
                                </select>
                                {isSubmitted && errors.country && <span className="error-message">{errors.country}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactMe; 