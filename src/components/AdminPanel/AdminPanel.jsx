import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:5001/admin/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchUsers();
    fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:5001/reservations/${reservationId}`);
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleConfirmReservation = async (reservationId) => {
    try {
      await axios.put(`http://localhost:5001/reservations/confirm/${reservationId}`);
      setReservations(reservations.map(reservation =>
        reservation.id === reservationId ? { ...reservation, confirmed: true } : reservation
      ));
      alert('Reservation confirmed successfully');
    } catch (error) {
      console.error('Error confirming reservation:', error);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await axios.put(`http://localhost:5001/reservations/cancel/${reservationId}`);
      setReservations(reservations.map(reservation =>
        reservation.id === reservationId ? { ...reservation, confirmed: false } : reservation
      ));
      alert('Reservation canceled successfully');
    } catch (error) {
      console.error('Error canceling reservation:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-5 text-center dark:text-white">Admin Panel</h2>
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-3 dark:text-white">All Users</h3>
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-lg dark:text-white">Email: {user.email}</p>
              <p className="text-lg dark:text-white">Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
              <p className="text-lg dark:text-white">Reservations: {reservations.filter(reservation => reservation.user_id === user.id).length}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-3 dark:text-white">All Reservations</h3>
        <ul className="space-y-4">
          {reservations.map(reservation => (
            <li key={reservation.id} className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${reservation.confirmed ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'}`}>
              <p className="text-lg dark:text-white">Car: {reservation.carName}</p>
              <p className="text-lg dark:text-white">User: {reservation.userEmail}</p>
              <div className="text-lg">
                <p className="font-medium dark:text-gray-300">Start Date: 
                  <span className="ml-2 dark:text-white">{new Date(reservation.start_date).toLocaleDateString()}</span>
                </p>
                <p className="font-medium dark:text-gray-300">End Date: 
                  <span className="ml-2 dark:text-white">{new Date(reservation.end_date).toLocaleDateString()}</span>
                </p>
              </div>
              <p className="text-lg font-bold dark:text-white">
                Total Price: ${(
                  reservation.carPrice *
                  (new Date(reservation.end_date) - new Date(reservation.start_date)) /
                  (1000 * 60 * 60 * 24)
                ).toFixed(2)}
              </p>
              <div className="flex space-x-4 mt-4">
                {!reservation.confirmed && (
                  <button
                    onClick={() => handleConfirmReservation(reservation.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    Confirm
                  </button>
                )}
                {reservation.confirmed && (
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                  >
                    Cancel Confirmation
                  </button>
                )}
                <button
                  onClick={() => handleDeleteReservation(reservation.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
