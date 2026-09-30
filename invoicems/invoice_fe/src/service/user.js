import { smClient } from "@/lib";

// --------------------------------------------------
// CREATE USER
// --------------------------------------------------
export async function newAndUpdateUser(payload) {
  const response = await smClient.post(`/users/newAndUpdateUser`, payload);
  return response.data;
}

// --------------------------------------------------
// UPDATE USER  (⚠️ Your backend does NOT have this API yet)
// --------------------------------------------------
export async function updateUser(id, payload) {
  const response = await smClient.put(`/users/updateUser/${id}`, payload);
  return response.data;
}

// --------------------------------------------------
// UPDATE USER  (⚠️ Your backend does NOT have this API yet)
// --------------------------------------------------
export async function updateStatusActiveInactive(id, payload) {
  const response = await smClient.put(`/users/updateStatusActiveInactive/${id}`, payload);
  return response.data;
}


// --------------------------------------------------
// GET USER BY ID
// --------------------------------------------------
export async function getUserById(id) {
  const response = await smClient.get(`/users/${id}`);
  return response.data;
}

// --------------------------------------------------
// FILTER USERS 
// {
//   "limit": 100,
//   "filters": [
//     {
//       "key": "",
//       "operator": "",
//       "value": ""
//     }
//   ]
// }
// --------------------------------------------------
export async function filterUsers() {
  const payload = {
    limit: 100,
    filters: []
  };

  const response = await smClient.post(`/users/filterUsers`, payload);

  console.log("🔥 FILTER USERS RESPONSE:", response.data);

  return response.data;
}


// --------------------------------------------------
// DELETE USER 
// --------------------------------------------------
export async function deleteUser(id) {
  const response = await smClient.delete(`/users/deleteUser/${id}`);
  return response.data;
}
