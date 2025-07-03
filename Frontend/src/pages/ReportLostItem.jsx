import React, { useState } from 'react';
import axios from 'axios';
import { Smartphone, Backpack, Wallet, Key, MapPin, Mail } from 'lucide-react';

export default function ReportLostItem() {
  const [formData, setFormData] = useState({
    email: '',
    itemName: '',
    description: '',
    image: null,
    city: '',
    location: {
      coordinates: [0, 0],
    },
    date: new Date().toISOString().split('T')[0],
    featureVector: [], // Add feature vector here
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Append text fields
      data.append('email', formData.email);
      data.append('itemName', formData.itemName);
      data.append('description', formData.description);
      data.append('city', formData.city);
      data.append('date', formData.date);
      data.append('latitude', formData.location.coordinates[1]);
      data.append('longitude', formData.location.coordinates[0]);
      data.append('featureVector', JSON.stringify(formData.featureVector)); // Ensure feature vector is included as JSON string

      // Append image file
      if (formData.image) {
        data.append('image', formData.image); // This must be a File object!
      }

      // API request
      const response = await axios.post(
        'http://localhost:5000/report-lost-item', // Adjust URL if necessary
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response.data);
      alert('Lost item reported successfully!');

      // Reset form state
      setFormData({
        email: '',
        itemName: '',
        description: '',
        image: null,  // Reset image to null
        city: '',
        location: { coordinates: [0, 0] },
        date: new Date().toISOString().split('T')[0],
        featureVector: [], // Reset feature vector
      });

    } catch (error) {
      console.error(error);
      alert('Failed to report the lost item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-white">
      <nav className="container mx-auto px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Lost & Found</h1>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#" className="nav-link text-white text-xl font-semibold hover:text-teal-200 transition-colors">Found Items</a>
            <a href="#" className="nav-link text-white text-xl font-semibold hover:text-teal-200 transition-colors">About Us</a>
            <a href="#" className="nav-link text-white text-xl font-semibold hover:text-teal-200 transition-colors">Profile</a>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Report Lost Item</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Item Name */}
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, image: file });
                    }
                  }}                   
                  className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-teal-50 file:text-teal-600
                      hover:file:bg-teal-100"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none pl-10"
                    required
                  />
                </div>
              </div>

              {/* Latitude and Longitude */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    type="number"
                    id="latitude"
                    step="any"
                    value={formData.location.coordinates[1]}
                    onChange={(e) => {
                      const lat = parseFloat(e.target.value);
                      if (!isNaN(lat)) {
                        setFormData({
                          ...formData,
                          location: {
                            coordinates: [formData.location.coordinates[0], lat]
                          }
                        });
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    type="number"
                    id="longitude"
                    step="any"
                    value={formData.location.coordinates[0]}
                    onChange={(e) => {
                      const lon = parseFloat(e.target.value);
                      if (!isNaN(lon)) {
                        setFormData({
                          ...formData,
                          location: {
                            coordinates: [lon, formData.location.coordinates[1]]
                          }
                        });
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
