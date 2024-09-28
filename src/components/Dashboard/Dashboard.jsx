import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [editingReservationId, setEditingReservationId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5001/reservations/${user.id}`);
          setReservations(response.data);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:5001/reservations/${reservationId}`);
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservationId(reservation.id);
    setStartDate(reservation.start_date);
    setEndDate(reservation.end_date);
  };

  const handleSave = async (reservationId) => {
    try {
      await axios.put(`http://localhost:5001/reservations/${reservationId}`, {
        startDate,
        endDate
      });
      setReservations(reservations.map(reservation => 
        reservation.id === reservationId ? { ...reservation, start_date: startDate, end_date: endDate } : reservation
      ));
      setEditingReservationId(null);
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5 text-center dark:text-white">My Reservations</h1>
      {reservations.length > 0 ? (
        <ul className="space-y-4">
          {reservations.map((reservation) => (
            <li
              key={reservation.id}
              className={`p-4 rounded-lg shadow-md ${
                reservation.confirmed ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'
              }`}
            >
              <p className="text-xl font-semibold dark:text-white">Car: {reservation.carName}</p>
              {editingReservationId === reservation.id ? (
                <div>
                  <label className="font-medium dark:text-gray-300">Start Date:</label>
                  <input
                    type="date"
                    value={startDate.split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="ml-2 p-2 border dark:bg-gray-700 dark:text-white"
                  />
                  <label className="font-medium dark:text-gray-300 ml-4">End Date:</label>
                  <input
                    type="date"
                    value={endDate.split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="ml-2 p-2 border dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => handleSave(reservation.id)}
                    className="mt-2 ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="text-lg">
                  <p className="font-medium dark:text-gray-300">
                    Start Date: 
                    <span className="ml-2 dark:text-white">
                      {new Date(reservation.start_date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="font-medium dark:text-gray-300">
                    End Date: 
                    <span className="ml-2 dark:text-white">
                      {new Date(reservation.end_date).toLocaleDateString()}
                    </span>
                  </p>
                  <button
                    onClick={() => handleEdit(reservation)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Edit Dates
                  </button>
                </div>
              )}
              <p className="text-lg font-bold dark:text-white">
                Total Price: ${(
                  reservation.carPrice *
                  (new Date(reservation.end_date) - new Date(reservation.start_date)) /
                  (1000 * 60 * 60 * 24)
                ).toFixed(2)}
              </p>
              <button
                onClick={() => handleDelete(reservation.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                Delete Reservation
              </button>
              {reservation.confirmed ? (
                <p className="mt-2 text-green-700 font-semibold dark:text-green-300">Reservation Confirmed</p>
              ) : (
                <p className="mt-2 text-red-700 font-semibold dark:text-red-300">Pending Confirmation</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-xl dark:text-white">No reservations found.</p>
      )}
    </div>
  );
};

export default Dashboard;
