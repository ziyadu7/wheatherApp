import axios from "axios";
import { useState } from "react";
import './locationStyle.css'
type LocationInputProps = {
    setLong:(long:Number)=>void,
    setLat:(lat:Number)=>void,
    fetchData:()=>void
}

export function LocationInput({setLat,setLong,fetchData}:LocationInputProps) {

    const [locationSuggestions, setLocationSuggestions] = useState([])
    const [sugg,setSugg] = useState<Boolean>(false)
    const [location,setLocation] = useState('')

    // Function to get location suggestions from Mapbox Geocoding API
    const getLocationSuggestions = async (query) => {
        const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOXTOKEN
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`;
        const params = {
            access_token: MAPBOX_API_KEY,
            types: 'place,locality,neighborhood', // Limit results to places only
            limit: 5, // Number of suggestions to retrieve
            country: "IN"
        };

        try {
            const response = await axios.get(endpoint, { params });
            return response.data.features;
        } catch (error) {
            console.error('Error fetching location suggestions:', error);
            return [];
        }
    };

    // Function to handle location suggestion selection
    const handleLocationSuggestion = async (query) => {
        // Get location suggestions when the user types
        const suggestions = await getLocationSuggestions(query);
        setLocationSuggestions(suggestions);
    };
  return (
  <div className="locationMain">
    <label className="">{location.split(',')[0]||'Enter Location'}</label>
    <div className="inputField">
        <input
            type="text"
            onChange={(e) => {
                setSugg(true)
                handleLocationSuggestion(e.target.value);
            }}
            placeholder={'Enter Location'}
            className=""
        />
        <ul className="list">
            {sugg && locationSuggestions.map((suggestion) => (
                <li key={suggestion?.id}>
                    <button
                        type="button"
                        onClick={() => {
                            setSugg(false) 
                            setLocationSuggestions([]);
                            const [long, lat] = suggestion?.geometry.coordinates;
                            setLat(lat)
                            setLong(long)
                            setLocation(suggestion?.place_name)
                        }}
                    >
                        {suggestion.place_name}
                    </button>
                </li>
            ))}
        </ul>
    </div>
    <div><button onClick={fetchData}>Search</button></div>
</div>
  )
}
