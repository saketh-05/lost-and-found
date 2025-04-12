import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, CheckSquare, MessageCircle, Facebook, Instagram, Linkedin, Twitter, MapPin } from 'lucide-react';

function Landing() {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.fade-in').forEach(element => {
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
              <a href="#" className="nav-link text-lg hover:text-teal-200 transition-colors">Lost items</a>
              <a href="#" className="nav-link text-lg hover:text-teal-200 transition-colors">Found items</a>
              <a href="#" className="nav-link text-lg hover:text-teal-200 transition-colors">About Us</a>
              <button className="bg-teal-500 px-6 py-2 rounded-full font-semibold hover:bg-teal-400 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-8 py-24">
          <div className="flex items-center justify-between">
            <div className="w-1/2 pr-12">
              <h2 className="text-6xl font-bold mb-6 leading-tight">
                Find Your Lost Items with Ease
              </h2>
              <p className="text-xl mb-10 text-teal-100">
                Connect with your lost belongings through our advanced search system and helpful community.
              </p>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="search-input w-96 px-6 py-4 rounded-l-full text-gray-800 focus:outline-none"
                />
                <button className="bg-teal-500 px-8 py-4 rounded-r-full font-semibold hover:bg-teal-400 transition-colors flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
            <div className="w-1/2 flex justify-end">
              <img
                src="https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Lost and Found"
                className="hero-image w-full max-w-lg object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 px-8">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-800">How It Works</h3>
          <div className="grid grid-cols-4 gap-8">
            <div className="feature-card p-8 rounded-2xl card-hover fade-in">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Search Items</h4>
              <p className="text-gray-600 leading-relaxed">
                Browse through our extensive database of lost and found items
              </p>
            </div>
            
            <Link to="/reportlostitem" className="feature-card p-8 rounded-2xl card-hover fade-in">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Report Lost Item</h4>
              <p className="text-gray-600 leading-relaxed">
                Submit detailed information about your missing belongings
              </p>
            </Link>
            
            <div className="feature-card p-8 rounded-2xl card-hover fade-in">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <CheckSquare className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Report Found Item</h4>
              <p className="text-gray-600 leading-relaxed">
                Help others by reporting items you've found in your area
              </p>
            </div>
            
            <div className="feature-card p-8 rounded-2xl card-hover fade-in">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">Connect</h4>
              <p className="text-gray-600 leading-relaxed">
                Securely communicate with finders to retrieve your items
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
        <h5 className="text-xl font-bold mb-6">Connect With Us</h5>
        <div className="flex justify-center space-x-4">
          <a href="#" className="social-icon bg-gray-800 p-3 rounded-full hover:bg-teal-900 hover:text-teal-400 transition-all">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="social-icon bg-gray-800 p-3 rounded-full hover:bg-teal-900 hover:text-teal-400 transition-all">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="social-icon bg-gray-800 p-3 rounded-full hover:bg-teal-900 hover:text-teal-400 transition-all">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="#" className="social-icon bg-gray-800 p-3 rounded-full hover:bg-teal-900 hover:text-teal-400 transition-all">
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-800 pt-8 text-center">
      <p className="text-gray-500">&copy; 2024 Lost & Found. All rights reserved.</p>
    </div>
  </div>
</footer>

    </div>
  );
}

export default Landing;