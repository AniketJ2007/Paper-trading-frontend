import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setemail] = useState<string>();
  const [password, setpassword] = useState<string>();
  const [message, setmessage] = useState<string>("");
  const navigate = useNavigate();
  const handleClick = (e: any) => {
    e.preventDefault();
    navigate("/signup");
  };
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const req = {
      body: {
        email,
        password,
      },
    };

    try {
      const response:any = await fetch(
        "http://localhost:3000/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(req.body),
        },
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Status: ${response.status} ${data.message}`);
      }

      setmessage(data.message || "Succesful in signing");
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/market')
    } catch (error: any) {
      
      console.error("Error Signing Up:", error);

      setmessage(error.message || "Error Signing Up");
    }
  };
  const handleLogout=async()=>{
    try {
      const response:any = await fetch(
        "http://localhost:3000/api/v1/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Status: ${response.status} ${data.message}`);
      }

      setmessage(data.message || "Succesful in Logout");
      
    } catch (error: any) {
      
      console.error("Error Signing Up:", error);
      setmessage(error.message || "Error logging out");
    }finally{
      localStorage.removeItem('isLoggedIn');
      navigate('/login')
    }
  }
  return (
    <>
      <div className="flex flex-col gap-4 justify-center min-h-screen items-center">
        <form action="" method="get" className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="Email" className="text-white text-2xl mr-15">
              Email
            </label>
            <input
              type="text"
              className="text-white border-2 border-white h-10 min-w-fit rounded-lg p-2"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="Password" className="text-white text-2xl mr-4.5">
              Password
            </label>
            <input
              type="password"
              className="text-white border-2 border-white h-10 min-w-fit rounded-lg p-2"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          <div className="text-white text-2xl text-center">
            <button
              type="submit"
              className="hover:text-blue-600 
                    hover:border-blue-600 hover:border rounded-lg p-3"
            >
              Login
            </button>
          </div>
          <div className="text-white text-2xl text-center">
            If you are a new User{" "}
            <button
              onClick={handleClick}
              className="hover:text-blue-600 
                    hover:border-blue-600 hover:border rounded-lg"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="text-white text-2xl text-center mt-2">
            <button 
            type="button"
            className="bg-red-500 text-center text-2xl rounded-lg p-3"
             onClick={handleLogout}>
              LogOut
            </button>
        </div>
        {message && (
            <p className="text-red-600 text-3xl text-center mt-4">{message}</p>
          )}
      </div>
    </>
  );
}
export default Login;
