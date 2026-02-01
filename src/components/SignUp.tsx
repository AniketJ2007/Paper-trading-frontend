import { useState } from "react";
function SignUp() {
  const [email, setemail] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [message, setmessage] = useState<string>("");
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const req = {
      body: {
        name,
        email,
        password,
      },
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_NODE_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        },
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setmessage(data.message || "Succesful in signing");
    } catch (error: any) {
      
      console.error("Error Signing Up:", error);

      setmessage(error.message || "Error Signing Up");
    }
  };
  return (
    <>
      <div className="flex justify-center min-h-screen items-center">
        <form
          action=""
          method="get"
          className="flex flex-col gap-8"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="Email" className="text-white text-2xl mr-13">
              Name
            </label>
            <input
              type="text"
              className="text-white border-2 border-white h-10 min-w-fit rounded-lg p-2"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>
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
            <label htmlFor="Password" className="text-white text-2xl mr-4.5 ">
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
                    hover:border-blue-600 hover:border rounded-lg p-3 "
            >
              Sign Up
            </button>
          </div>
          {message && (
            <p className="text-red-600 text-3xl text-center mt-4">{message}</p>
          )}
        </form>
      </div>
    </>
  );
}

export default SignUp;
