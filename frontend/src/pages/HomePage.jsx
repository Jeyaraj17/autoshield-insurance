import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();


  const handleGetQuote = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleContactUs = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };



  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  const carouselSlides = [
    {
      image: "/assets/car-slide.svg",
      caption: "Comprehensive 4-wheeler Coverage",
    },
    {
      image: "/assets/bike-slide.svg",
      caption: "Affordable 2-wheeler Plans",
    },
    {
      image: "/assets/claims-slide.svg",
      caption: "Hassle-free Claim Settlement",
    },
    {
      image: "/assets/support-slide.svg",
      caption: "24/7 Customer Support",
    },
  ];

  const serviceCards = [
    {
      title: "Quick Policy Application",
      description:
        "Apply quickly for two-wheeler or four-wheeler insurance with instant confirmation.",
      image: "/assets/card-bike.svg",
      icon: "🚗",
    },
    {
      title: "Fast Claim Settlement",
      description:
        "Submit claims easily — admin will review and approve quickly.",
      image: "/assets/card-claim.svg",
      icon: "⚡",
    },
    {
      title: "Customer Support",
      description: "Reach out anytime. We're here to help with any query.",
      image: "/assets/card-car.svg",
      icon: "🎧",
    },
  ];

  return (
    <div className="home-root">
      {/* Hero Section */}
      <div
        id="home"
        className="hero"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop)",
        }}
      >
        <div className="container hero-inner">
          <h1 className="hero-title">
            Secure Your Ride — Drive with Confidence
          </h1>
          <div className="hero-sub">
            Affordable two-wheeler & four-wheeler insurance with fast claim
            settlements.
          </div>
          <div className="hero-actions">
            <button className="btn btn-accent" onClick={handleGetQuote}>
              Get a Quote
            </button>
            <button className="btn btn-primary" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <div className="container stats">
        {/* Quick Stats */}
        <div className="stats-grid">
          {[
            { number: "10k+", label: "Policies Issued", icon: "📋" },
            { number: "95%", label: "Claim Success", icon: "✅" },
            { number: "24/7", label: "Support", icon: "🕐" },
          ].map((stat, index) => (
            <div className="stat-col" key={index}>
              <div className="stat-card">
                <div className="stat-emoji">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Section */}
        <div className="section">
          <div className="section-title">Our Insurance Solutions</div>
          <div className="carousel-wrap">
            <Slider {...carouselSettings}>
              {carouselSlides.map((slide, index) => (
                <div key={index} className="slide">
                  <img src={slide.image} alt={slide.caption} />
                  <div className="slide-cap">{slide.caption}</div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" className="services">
          <div className="section-title">Our Services</div>
          <div className="services-grid">
            {serviceCards.map((service, index) => (
              <div className="service-col" key={index}>
                <div className="service-card">
                  <img
                    className="service-img"
                    src={service.image}
                    alt={service.title}
                  />
                  <div className="service-emoji">{service.icon}</div>
                  <div className="service-title">{service.title}</div>
                  <div className="service-desc">{service.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Us Section */}
        <div id="about" className="about">
          <div className="section-title">About Us</div>
          <div className="about-p">
            We are a customer-first auto insurance provider dedicated to fast
            policy issuance and transparent claim settlement. Our mission is to
            protect your journey with affordable plans and friendly support.
          </div>
          <div className="about-points">
            {[
              "Trusted by thousands",
              "Tailored coverage",
              "Simple claim process",
            ].map((point, index) => (
              <div className="about-point" key={index}>
                ✓ {point}
              </div>
            ))}
          </div>
          <div className="testimonial">
            <div className="testimonial-quote">
              "Excellent service — my claim was approved within 48 hours."
            </div>
            <div className="testimonial-author">— S. Kumar</div>
          </div>
        </div>

        {/* How It Works Section (Claims) */}
        <div id="claims" className="steps">
          <div className="section-title">How It Works</div>
          <div className="steps-grid">
            {[
              {
                step: "1",
                title: "Apply Policy",
                subtitle: "Fill out our simple form",
                icon: "📝",
              },
              {
                step: "2",
                title: "Make Payment",
                subtitle: "Secure online payment",
                icon: "💳",
              },
              {
                step: "3",
                title: "Policy Active",
                subtitle: "Your coverage is ready",
                icon: "✅",
              },
            ].map((item, index) => (
              <div className="step-col" key={index}>
                <div className="step-card">
                  <div className="step-emoji">{item.icon}</div>
                  <div className="step-num">{item.step}</div>
                  <div className="step-title">{item.title}</div>
                  <div className="step-sub">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div className="quote">"Peace of mind for every mile."</div>



        {/* Contact Section */}
        <div id="contact" className="contact">
          <div className="section-title">Reach Out Anytime</div>
          <div className="contact-sub">
            We're here to help — call, email or drop a message.
          </div>
          <div className="contact-grid-centered">
            {/* Contact Info */}
            <div className="contact-card">
              <div className="h4 mb-2">📍 Office</div>
              <div>
                Cognizant Technology Solutions, OMR, Thoraipakkam, Chennai,
                Tamil Nadu 600097
              </div>
            </div>
            <div className="contact-card mt-3">
              <div className="h4 mb-2">📞 Phone</div>
              <a href="tel:+919876543210" className="contact-link">
                +91 98765 43210
              </a>
            </div>
            <div className="contact-card mt-3">
              <div className="h4 mb-2">📧 Email</div>
              <a
                href="mailto:support@autoshield.example"
                className="contact-link"
              >
                support@autoshield.example
              </a>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="map">
            <div className="h4 mb-2" style={{ fontWeight: 600 }}>
              Find Us
            </div>
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=Cognizant+Technology+Solutions+OMR+Thoraipakkam+Chennai&zoom=15&size=600x300&markers=color:red%7CChennai&key="
              alt="Cognizant OMR Thoraipakkam, Chennai"
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default HomePage;
