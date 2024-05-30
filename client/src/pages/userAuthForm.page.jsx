import { Link } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useRef } from "react";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(authForm.current);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const { fullname, email, password } = data;

    //Form Validation
    if (fullname.length < 3) {
      return console.log({ error: "Full name must be 3 letters long!!" });
    }

    if (!email.length) {
      return console.log({ error: "enter email!!" });
    }
    if (!emailRegex.test(email)) {
      return console.log({ error: "Email is Invalid" });
    }

    if (!passwordRegex.test(password)) {
      return console.log({
        error:
          "password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
      });
    }
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <form ref={authForm} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "Sign-in" ? "Welcome Back!" : "Join Us Today"}
          </h1>
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
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-dark center mt-14"
          >
            {type.replace("-", " ")}
          </button>
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-color font-bold">
            <hr className="w-1/2 border-black"></hr>
            <p>or</p>
            <hr className="w-1/2 border-black"></hr>
          </div>
          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={googleIcon} className="w-5" />
            Continue with Google
          </button>
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
