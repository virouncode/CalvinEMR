// import { useCallback, useEffect, useReducer } from "react";

// const initialHttpState = { data: null, isLoading: false, error: null };

// //Reducer function: changes the current state to a new state following a certain action
// const httpReducer = (state, action) => {
//   if (action.type === "FETCH_START") {
//     return { ...state, isLoading: state.data ? false : true, error: null };
//   }
//   if (action.type === "FETCH_ERROR") {
//     return { data: null, isLoading: false, error: action.payload };
//   }
//   if (action.type === "FETCH_SUCCESS") {
//     return { data: action.payload, isLoading: false, error: null };
//   }
//   return initialHttpState; // default value for unknown actions
// };

// export const Test = () => {
//   //useReducer Hook to se the reducer function
//   const [httpState, dispatch] = useReducer(httpReducer, initialHttpState);
//   // Using useCallback() to prevent an infinite loop in useEffect() below
//   const fetchPosts = useCallback( async () => {
//     dispatch({ type: "FETCH_START" });
//     try {
//       const response = await fetch(
//         "https://jsonplaceholder.typicode.com/posts"
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch posts.");
//       }
//       const posts = await response.json();
//       dispatch({ type: "FETCH_SUCCESS", payload: posts });
//     } catch (error) {
//       dispatch({ type: "FETCH_ERROR", payload: error.message });
//     }
//   }, []);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   return (
//     <>
//       {" "}
//       <header>
//         {" "}
//         <h1>Complex State Blog</h1>
//         <button onClick={fetchPosts}>Load Posts</button>{" "}
//       </header>{" "}
//       {httpState.isLoading && <p>Loading...</p>}{" "}
//       {httpState.error && <p>{httpState.error}</p>}{" "}
//       {httpState.data && <BlogPosts posts={httpState.data} />}{" "}
//     </>
//   );
// }

// //or put fetchPosts in useEffect directly
// //signal: controller.signal

// const instance = axios.create({
//     baseURL: 'https://some-domain.com/api/',
//     headers: {'X-Custom-Header': 'foobar'}
//   });
