'use client'

import React, { useState, useEffect } from 'react';


export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/api/auth/session');

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error('Error fetching user details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="user-card">
      <h1>User Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div className='flex justify-center'>
          <div className="card lg:card-side w-80 bg-base-100 shadow-xl">
            <figure><img src="https://static.vecteezy.com/system/resources/previews/019/896/012/original/female-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png" alt="Album" /></figure>
            <div className="card-body">
              <h2 className="card-title">{"sreenija"}</h2>
              <p>{user.email}</p>
              <p>{user.phonenumber}</p>
            </div>
          </div>
        </div>

      ) : (
        <p>No user details available.</p>
      )}

    </div>
  );
}
