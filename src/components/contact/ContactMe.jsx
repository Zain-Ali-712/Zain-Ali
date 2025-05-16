import React, { useState, useEffect } from 'react';
import './ContactMe.css';

const requirements = [
    'Portfolio', 'Landing Page', 'Website Design', 'Website'
];

const scales = [
    'Small', 'Medium', 'Large'
];

const ContactMe = () => {
    const [selectedRequirement, setSelectedRequirement] = useState(requirements[0]);
    const [selectedScale, setSelectedScale] = useState(scales[0]);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(res => res.json())
            .then(data => {
                const countryNames = data.map(c => c.name.common).sort();
                setCountries(countryNames);
            });
    }, []);

    return (
        <section className="contact-section">
            <h2 className="contact-heading center-shadow">CONTACT ME</h2>
            <div className="contact-container compact">
                <div className="contact-form-box compact">
                    <form className="contact-form compact">
                        <div className="form-row">
                            <div className="form-group compact half-width">
                                <label htmlFor="fname">First Name</label>
                                <input type="text" id="fname" name="fname" placeholder="First name" required />
                            </div>
                            <div className="form-group compact half-width">
                                <label htmlFor="lname">Last Name</label>
                                <input type="text" id="lname" name="lname" placeholder="Last name" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group compact full-width">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" placeholder="Email" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group compact full-width">
                                <label>Project Requirement</label>
                                <div className="tag-row">
                                    {requirements.map((req, idx) => (
                                        <button
                                            type="button"
                                            key={req}
                                            className={`tag-btn${selectedRequirement === req ? ' selected' : ''}`}
                                            onClick={() => setSelectedRequirement(req)}
                                        >
                                            {req}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group compact full-width">
                                <label>Project Scale/Level</label>
                                <div className="tag-row">
                                    {scales.map((scale, idx) => (
                                        <button
                                            type="button"
                                            key={scale}
                                            className={`tag-btn${selectedScale === scale ? ' selected' : ''}`}
                                            onClick={() => setSelectedScale(scale)}
                                        >
                                            {scale}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="form-group compact full-width">
                            <label htmlFor="desc">How can I help?</label>
                            <textarea id="desc" name="desc" placeholder="Feel free to share queries or your needs." rows={3} />
                        </div>
                        <button type="submit" className="submit-btn compact">Submit</button>
                    </form>
                </div>
                <div className="contact-empty-box compact">
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
                                    value={selectedCountry}
                                    onChange={e => setSelectedCountry(e.target.value)}
                                    required
                                    className="custom-select"
                                >
                                    <option value="">Country</option>
                                    {countries.map((country, idx) => (
                                        <option key={idx} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactMe; 