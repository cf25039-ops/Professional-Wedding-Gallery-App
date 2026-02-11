import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "http://192.168.0.190:54323";
const supabaseAnonKey = "sb_publishable_ACJWlzQHlzjBrEguHvfOxg_3BJgxAaH";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuests = async () => {
      const { data, error: fetchError } = await supabase.from("guests").select("*");

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setGuests(data || []);
    };

    fetchGuests();
  }, []);

  return (
    <div className="guest-list">
      <h2>Guest List</h2>
      {error && <div className="error">Error: {error}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Attending</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id || guest.phone}>
              <td>{guest.name}</td>
              <td>{guest.phone}</td>
              <td>{guest.attending ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestList;
