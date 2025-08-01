import React, { useState } from "react";
import { Smartphone, Backpack, Wallet, Key, MapPin, Mail } from "lucide-react";
import axios from "axios";

export default function ReportFoundItem() {
  const [formData, setFormData] = useState({
    email: "",
    itemName: "",
    description: "",
    image: "",
    city: "",
    location: {
      coordinates: [0, 0],
    },
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        email: formData.email,
        itemName: formData.itemName,
        description: formData.description,
        image: formData.image,
        city: formData.city,
        location: formData.location,
        date: formData.date,
      };

      const response = await axios.post(
        "http://localhost:5000/found-item",
        payload
      ); // CHANGE THIS TO YOUR BACKEND

      if (response.data.success) {
        setSuccessMessage("Item reported successfully!");
        // Reset form after success
        setFormData({
          email: "",
          itemName: "",
          description: "",
          image: "",
          city: "",
          location: { coordinates: [0, 0] },
          date: new Date().toISOString().split("T")[0],
        });
      } else {
        setError("Failed to report the item. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  const handleLatitudeChange = (e) => {
    const value = parseFloat(e.target.value);
    setFormData({
      ...formData,
      location: {
        coordinates: [
          formData.location.coordinates[0],
          isNaN(value) ? 0 : value,
        ],
      },
    });
  };

  const handleLongitudeChange = (e) => {
    const value = parseFloat(e.target.value);
    setFormData({
      ...formData,
      location: {
        coordinates: [
          isNaN(value) ? 0 : value,
          formData.location.coordinates[1],
        ],
      },
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-teal-500 to-white'>
      {/* Navbar */}
      <nav className='container mx-auto px-8 py-6'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <MapPin className='w-8 h-8 text-white' />
            <h1 className='text-3xl font-bold text-white'>Lost & Found</h1>
          </div>
          <div className='flex items-center space-x-8'>
            <a
              href='#'
              className='nav-link text-white text-xl font-semibold hover:text-teal-200 transition-colors'
            >
              Lost Items
            </a>
            <a
              href='#'
              className='nav-link text-white text-xl font-semibold hover:text-teal-200 transition-colors'
            >
              About Us
            </a>
            <a
              href='#'
              className='nav-link text-white text-xl font-semibold hover:text-teal-200 transition-colors'
            >
              Profile
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className='py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Form */}
          <div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
              Report Found Item
            </h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='itemName'
                  className='block text-sm font-medium text-gray-700'
                >
                  Item Name
                </label>
                <input
                  type='text'
                  id='itemName'
                  value={formData.itemName}
                  onChange={(e) =>
                    setFormData({ ...formData, itemName: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='image'
                  className='block text-sm font-medium text-gray-700'
                >
                  Image
                </label>
                <input
                  type='file'
                  id='image'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        image: URL.createObjectURL(file),
                      });
                    }
                  }}
                  className='mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-teal-50 file:text-teal-600
                    hover:file:bg-teal-100'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium text-gray-700'
                >
                  City
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <MapPin className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='city'
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className='mt-1 block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='latitude'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Latitude
                  </label>
                  <input
                    type='number'
                    id='latitude'
                    step='any'
                    value={formData.location.coordinates[1]}
                    onChange={handleLatitudeChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='longitude'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Longitude
                  </label>
                  <input
                    type='number'
                    id='longitude'
                    step='any'
                    value={formData.location.coordinates[0]}
                    onChange={handleLongitudeChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none'
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='date'
                  className='block text-sm font-medium text-gray-700'
                >
                  Date Found
                </label>
                <input
                  type='date'
                  id='date'
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email Address
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='email'
                    id='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className='mt-1 block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none'
                    required
                  />
                </div>
              </div>

              {/* Messages */}
              {error && <p className='text-red-500'>{error}</p>}
              {successMessage && (
                <p className='text-green-500'>{successMessage}</p>
              )}

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors'
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>

          {/* Recent Items */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
              Recent Found Items
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Sample Items */}
              <ItemCard
                icon={<Smartphone className='w-8 h-8 text-teal-600' />}
                title='iPhone 13'
                desc='Black case with card holder'
                date='April 10, 2024'
              />
              <ItemCard
                icon={<Backpack className='w-8 h-8 text-teal-600' />}
                title='Nike Backpack'
                desc='Blue with white stripes'
                date='April 8, 2024'
              />
              <ItemCard
                icon={<Wallet className='w-8 h-8 text-teal-600' />}
                title='Brown Wallet'
                desc="Leather with initials 'JD'"
                date='April 5, 2024'
              />
              <ItemCard
                icon={<Key className='w-8 h-8 text-teal-600' />}
                title='House Keys'
                desc='3 keys with red keychain'
                date='April 3, 2024'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemCard({ icon, title, desc, date }) {
  return (
    <div className='p-4 border border-gray-200 rounded-lg flex items-start space-x-4'>
      {icon}
      <div>
        <h3 className='font-medium text-gray-900'>{title}</h3>
        <p className='text-gray-500 text-sm'>{desc}</p>
        <p className='text-gray-400 text-sm mt-1'>{date}</p>
      </div>
    </div>
  );
}
