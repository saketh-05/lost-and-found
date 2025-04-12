import React, { useState } from 'react';
import { Smartphone, Backpack, Wallet, Key, MapPin, Mail } from 'lucide-react';

export default function ReportFoundItem() {
  const [formData, setFormData] = useState({
    email: '',
    itemName: '',
    description: '',
    image: '',
    city: '',
    location: {
      coordinates: [0, 0]
    },
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      email: '',
      itemName: '',
      description: '',
      image: '',
      city: '',
      location: {
        coordinates: [0, 0]
      },
      date: new Date().toISOString().split('T')[0],
    });
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
                    <a href="#" className="nav-link text-white text-xl font-semibold hover:text-teal-200 transition-colors">Lost Items</a>
                    <a href="#" className="nav-link text-white text-xl font-semibold hover:text-teal-200 transition-colors">About Us</a>
                    <a href="#" className="nav-link text-white text-xl font-semibold hover:text-teal-200 transition-colors">Profile</a>
                
                  </div>
                </div>
              </nav>


      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Report Found Item</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              

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

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, image: URL.createObjectURL(file) });
                      }
                    }}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-teal-50 file:text-teal-600
                      hover:file:bg-teal-100"
                    required
                  />
                </div>
              </div>
              
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    type="number"
                    id="latitude"
                    step="any"
                    value={formData.location.coordinates[1]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          coordinates: [formData.location.coordinates[0], parseFloat(e.target.value)]
                        }
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    type="number"
                    id="longitude"
                    step="any"
                    value={formData.location.coordinates[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          coordinates: [parseFloat(e.target.value), formData.location.coordinates[1]]
                        }
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date Lost</label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              >
                Submit Report
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Found Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg flex items-start space-x-4">
                <Smartphone className="w-8 h-8 text-teal-600" />
                <div>
                  <h3 className="font-medium text-gray-900">iPhone 13</h3>
                  <p className="text-gray-500 text-sm">Black case with card holder</p>
                  <p className="text-gray-400 text-sm mt-1">April 10, 2024</p>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg flex items-start space-x-4">
                <Backpack className="w-8 h-8 text-teal-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Nike Backpack</h3>
                  <p className="text-gray-500 text-sm">Blue with white stripes</p>
                  <p className="text-gray-400 text-sm mt-1">April 8, 2024</p>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg flex items-start space-x-4">
                <Wallet className="w-8 h-8 text-teal-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Brown Wallet</h3>
                  <p className="text-gray-500 text-sm">Leather with initials "JD"</p>
                  <p className="text-gray-400 text-sm mt-1">April 5, 2024</p>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg flex items-start space-x-4">
                <Key className="w-8 h-8 text-teal-600" />
                <div>
                  <h3 className="font-medium text-gray-900">House Keys</h3>
                  <p className="text-gray-500 text-sm">3 keys with red keychain</p>
                  <p className="text-gray-400 text-sm mt-1">April 3, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
