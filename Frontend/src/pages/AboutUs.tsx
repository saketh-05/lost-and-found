import React, { useEffect } from 'react';
import { MapPin, Users, Shield, Clock, Heart, Award } from 'lucide-react';

function AboutUs() {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    document.querySelectorAll('.fade-in').forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50">
      {/* Hero Section */}
      <header className="hero-gradient text-white">
        <nav className="container mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MapPin className="w-8 h-8 text-teal-200" />
              <h1 className="text-3xl font-bold">Lost & Found</h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#" className="nav-link text-lg hover:text-teal-200 transition-colors">
                Lost items
              </a>
              <a href="#" className="nav-link text-lg hover:text-teal-200 transition-colors">
                Found items
              </a>
              <a href="#" className="nav-link text-lg hover:text-teal-200 transition-colors">
                About Us
              </a>
              <button className="bg-teal-500 px-6 py-2 rounded-full font-semibold hover:bg-teal-400 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold mb-6 leading-tight">
              Reuniting People with Their Belongings
            </h2>
            <p className="text-xl mb-10 text-teal-100">
              We believe that every lost item has a story, and every found item has the power to restore joy. 
              Our mission is to bridge the gap between loss and discovery.
            </p>
          </div>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-24 px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in">
              <h3 className="text-4xl font-bold mb-8 text-gray-800">Our Story</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Lost & Found was born from a simple yet powerful idea: what if we could create a world 
                where losing something doesn't mean losing hope? Founded in 2024, our platform has grown 
                from a small community initiative to a comprehensive solution trusted by thousands.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Every day, countless items are lost and found across our communities. Our technology-driven 
                approach combines the power of detailed search capabilities with the warmth of human connection, 
                making it easier than ever to reunite people with their precious belongings.
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">10K+</div>
                  <div className="text-gray-600">Items Reunited</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">25K+</div>
                  <div className="text-gray-600">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">98%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="fade-in">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Community helping each other"
                className="w-full rounded-2xl shadow-lg object-cover h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-8 bg-white">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-800">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card p-8 rounded-2xl card-hover fade-in text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Community First</h4>
              <p className="text-gray-600 leading-relaxed">
                We believe in the power of community. Every interaction on our platform strengthens 
                the bonds between neighbors and strangers alike.
              </p>
            </div>

            <div className="feature-card p-8 rounded-2xl card-hover fade-in text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Privacy & Security</h4>
              <p className="text-gray-600 leading-relaxed">
                Your personal information is sacred. We implement robust security measures to protect 
                your data while facilitating safe connections.
              </p>
            </div>

            <div className="feature-card p-8 rounded-2xl card-hover fade-in text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Speed & Efficiency</h4>
              <p className="text-gray-600 leading-relaxed">
                Time matters when you've lost something important. Our streamlined process ensures 
                quick matches and fast reunions.
              </p>
            </div>

            <div className="feature-card p-8 rounded-2xl card-hover fade-in text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Empathy & Care</h4>
              <p className="text-gray-600 leading-relaxed">
                We understand the emotional weight of lost belongings. Every feature is designed 
                with compassion and understanding.
              </p>
            </div>

            <div className="feature-card p-8 rounded-2xl card-hover fade-in text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Award className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Excellence</h4>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in every aspect of our service, continuously improving 
                to serve our community better.
              </p>
            </div>

            <div className="feature-card p-8 rounded-2xl card-hover fade-in text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <MapPin className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Global Reach</h4>
              <p className="text-gray-600 leading-relaxed">
                From local neighborhoods to international communities, we're building a global 
                network of helping hands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-8">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-800">Meet Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card p-8 rounded-2xl card-hover fade-in text-center">
              <img
                src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Sarah Chen"
                className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
              />
              <h4 className="text-xl font-bold mb-2 text-gray-800">Sarah Chen</h4>
              <p className="text-teal-600 font-semibold mb-4">Founder & CEO</p>
              <p className="text-gray-600 leading-relaxed">
                Passionate about connecting communities and leveraging technology for social good.
              </p>
            </div>

            <div className="feature-card p-8 rounded-2xl card-hover fade-in text-center">
              <img
                src="https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Marcus Johnson"
                className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
              />
              <h4 className="text-xl font-bold mb-2 text-gray-800">Marcus Johnson</h4>
              <p className="text-teal-600 font-semibold mb-4">Head of Technology</p>
              <p className="text-gray-600 leading-relaxed">
                Expert in building scalable platforms that prioritize user experience and security.
              </p>
            </div>

            <div className="feature-card p-8 rounded-2xl card-hover fade-in text-center">
              <img
                src="https://images.pexels.com/photos/3785087/pexels-photo-3785087.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Emily Rodriguez"
                className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
              />
              <h4 className="text-xl font-bold mb-2 text-gray-800">Emily Rodriguez</h4>
              <p className="text-teal-600 font-semibold mb-4">Community Manager</p>
              <p className="text-gray-600 leading-relaxed">
                Dedicated to fostering meaningful connections within our growing community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 place-items-center gap-12 mb-12">
            <div className="text-center">
              <h5 className="text-xl font-bold mb-6">Ready to Get Started?</h5>
              <p className="text-gray-400 mb-8 max-w-md">
                Join thousands of people who have successfully reunited with their lost belongings.
              </p>
              <button className="bg-teal-500 px-8 py-3 rounded-full font-semibold hover:bg-teal-400 transition-colors">
                Start Your Search
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500">
              &copy; 2024 Lost & Found. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutUs;