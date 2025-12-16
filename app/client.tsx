"use client";
import { useEffect, useState } from "react";

// export interface User {
//   _id: string;
//   email: string;
//   username: string;
//   password: string;
//   createdAt: string;  // or Date
//   updatedAt: string;  // or Date
//   __v: number;
// }


// async function Client() {
//   async function getUsers(): Promise<User[]> {
//     const res = await fetch("http://localhost:3000/api/users", {
//       cache: "no-store"
//     });
//     return res.json();
//   }
//   const Data: User[] = await getUsers();


//   const res = await fetch("http://localhost:3000/api/blogs/693d76fb88c418dcfb570e24?userId=69331953b5cabe3add79b252&categoryId=69389129e915a8321a502609")
//   const data = await res.json();

//   if (!data) return <p className="text-white font-bold text-3xl">Loading...</p>;

//   return (
//     <div>
//       {
//         Data.map((user: User) => (
//           <div className="text-white grid grid-cols-1 gap-2 items-center" key={user._id}>
//             <h2>{user.username}</h2>
//             <h2>{user.email}</h2>
//             <h2>{new Date(user.createdAt).toLocaleDateString()}</h2>
//             <h2>{new Date(user.updatedAt).toLocaleDateString()}</h2>
//           </div>
//         ))
//       }
//       <div className="w-100 h-1 bg-white my-5"></div>
//       <div key={data.blog?._id}>
//         <div className="text-white">{data.blog?.title}</div>
//         <div className="text-white">{data.blog?.description}</div>
//       </div>
//     </div>
//   )
// }

// export default Client;



export interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Client() {
  const [users, setUsers] = useState<User[]>([]);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const usersRes = await fetch("/api/users", {
        cache: "no-store",
      });
      const usersData = await usersRes.json();

      const blogRes = await fetch(
        "/api/blogs/693d76fb88c418dcfb570e24?userId=69331953b5cabe3add79b252&categoryId=69389129e915a8321a502609"
      );
      const blogData = await blogRes.json();

      setUsers(usersData);
      setBlog(blogData.blog);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-white font-bold text-3xl">Loading...</p>;
  }

  return (
    <div>
      {users.map((user) => (
        <div
          className="text-white grid grid-cols-1 gap-2 items-center"
          key={user._id}
        >
          <h2>{user.username}</h2>
          <h2>{user.email}</h2>
          <h2>{new Date(user.createdAt).toLocaleDateString()}</h2>
          <h2>{new Date(user.updatedAt).toLocaleDateString()}</h2>
        </div>
      ))}

      <div className="w-full h-1 bg-white my-5"></div>

      <div>
        <div className="text-white">{blog?.title}</div>
        <div className="text-white">{blog?.description}</div>
      </div>
    </div>
  );
}
