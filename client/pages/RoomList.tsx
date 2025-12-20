import { api } from "@/utils/api";
import { useEffect, useState } from "react";


const RoomList = () => {
const [rooms, setRooms] = useState<any[]>([]);


useEffect(() => {
api.getRooms().then(setRooms);
}, []);


return (
<div>
<h1 className="text-3xl font-bold mb-2">Room Listings</h1>
<p className="text-gray-500 mb-8">View, edit or manage all listed rooms.</p>


<div className="bg-white rounded-xl shadow p-6">
<table className="w-full text-sm">
<thead className="text-left text-gray-500">
<tr>
<th>Name</th>
<th>Facility</th>
<th>Price / Night</th>
<th>Status</th>
</tr>
</thead>
<tbody className="divide-y">
{rooms.map(r => (
<tr key={r._id}>
<td>{r.name}</td>
<td>{r.amenities}</td>
<td>₹{r.pricePerNight}</td>
<td>
<span className="inline-block w-10 h-6 bg-blue-500 rounded-full"></span>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
};


export default RoomList;