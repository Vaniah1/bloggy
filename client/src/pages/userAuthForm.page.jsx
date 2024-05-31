// Import necessary modules and components
import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useRef, useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

// Main component for user authentication form
const UserAuthForm = ({ type }) => {
  // Ref to access form data
  const authForm = useRef();
  const { userAuth, setUserAuth } = useContext(UserContext);
  const { access_token } = userAuth;

  console.log(access_token);
  // Function to handle user authentication through server (not implemented)
  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post("http://localhost:3000" + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
        toast.success("Successful");
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  // //if we were to use the fetch method
  // const userAuthThroughServer = (serverRoute, formData) => {
  //   fetch("http://localhost:3000" + serverRoute, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formData),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       toast.error(error.message);
  //     });
  // };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine server route based on authentication type
    let serverRoute = type == "Sign-in" ? "/signin" : "/signup";
    let form = new FormData(formElement);
    let formData = {};

    // Convert form data to object
    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }
    console.log(formData);
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    let { fullname, email, password } = formData;

    // Form Validation

    // Fullname validation to distinguish from sign in and up
    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Full name must be 3 letters long!!");
      }
    }

    // Email validation
    if (!email.length) {
      return toast.error("Enter email!!");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is Invalid");
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
      );
    }

    // Call server authentication function (not implemented)
    userAuthThroughServer(serverRoute, formData);
  };
  const handleGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";
        let formData = {
          access_token: user.accessToken,
        };
        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("Error logging in via Google");
        return console.log(err);
      });
  };

  // Render component
  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="formElement" className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "Sign-in" ? "Welcome Back!" : "Join Us Today"}
          </h1>
          {/* Render fullname input field for signup */}
          {type != "Sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}
          {/* Render email and password input fields */}
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />
          {/* Submit button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-dark center mt-14"
          >
            {type.replace("-", " ")}
          </button>
          {/* Divider with "or" text */}
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-color font-bold">
            <hr className="w-1/2 border-black"></hr>
            <p>or</p>
            <hr className="w-1/2 border-black"></hr>
          </div>
          {/* Google sign-in button */}
          <button
            onClick={handleGoogleAuth}
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
          >
            <img src={googleIcon} className="w-5" />
            Continue with Google
          </button>
          {/* Render link to sign-in or sign-up based on current form type */}
          {type == "Sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?
              <Link to="/signup" className="underlne text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/signin" className="underlne text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
