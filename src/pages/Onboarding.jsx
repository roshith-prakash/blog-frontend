import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/authContext";
import { useDBUser } from "../context/userContext";
import {
  CTAButton,
  ErrorStatement,
  Input,
  Navbar,
  OutlineButton,
} from "../components";
import notfound from "../assets/notfound.svg";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { auth } from "../firebase/firebase";
import { IoCloudUploadOutline } from "react-icons/io5";
import { axiosInstance } from "../utils/axios";
import defaultAccount from "../assets/account.png";

const Onboarding = () => {
  // Navigate function to navigate to different pages.
  const navigate = useNavigate();
  // Db user object
  const { dbUser, fetchUser } = useDBUser();
  // Firebase user object
  const { currentUser } = useAuth();
  // Ref for file input
  const fileRef = useRef();
  // Name of the user to be stored in DB
  const [name, setName] = useState();
  // Profile image of user
  const [image, setImage] = useState();
  // Bio of the user
  const [bio, setBio] = useState();
  // Username to be stored in DB
  const [username, setUsername] = useState();
  // To disable button
  const [disabled, setDisabled] = useState(false);
  // Error
  const [error, setError] = useState({
    name: 0,
    username: 0,
  });

  // console.log("Firebase user", currentUser);
  console.log("DB USER", dbUser);

  // Set window title.
  useEffect(() => {
    document.title = "Onboarding | The Thought Journal";
  }, []);

  // To set default values.
  useEffect(() => {
    if (currentUser) {
      setName(currentUser?.displayName);
      setImage(currentUser?.photoURL);
    }
  }, [currentUser]);

  // Set the received image in the state.
  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
    fileRef.current.value = null;
  };

  // To resend email verification link.
  const sendVerification = () => {
    const user = auth.currentUser;
    sendEmailVerification(user)
      .then((res) => {
        toast("Email Verification Link sent.");
      })
      .catch((err) => {
        toast.error("Something went wrong.");
      });
  };

  // Submit the data to the server to create the user object.
  const handleSubmit = () => {
    setError({
      name: 0,
      username: 0,
    });

    if (name == null || name == undefined || name.length <= 0) {
      setError((prev) => ({ ...prev, name: 1 }));
      return;
    } else if (
      username == null ||
      username == undefined ||
      username.length <= 0
    ) {
      setError((prev) => ({ ...prev, username: 1 }));
      return;
    }

    setDisabled(true);

    // Check if username is already in use.
    axiosInstance
      .post("/auth/checkUsername", { username: username })
      .then((res) => {
        // If username already exists - show an error
        if (res.data?.exists) {
          setError((prev) => ({ ...prev, username: 2 }));
          return;
        }
        // If username is available
        else {
          // Create formdata instance
          const formData = new FormData();

          // If image is added - add a file
          if (typeof image != "string") {
            formData.append("file", image);
          }

          // Add details in the user object
          const obj = {
            ...currentUser,
            bio: bio,
            username: username,
            name: name,
            image: typeof image == "string" ? image : null,
          };

          // Append the new user object in formdata
          formData.append("user", JSON.stringify(obj));

          // Add user in DB
          axiosInstance
            .post("/auth/create-user", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
              setDisabled(false);
              fetchUser();
              navigate("/");
            })
            .catch((err) => {
              // Display error
              toast.error("Something went wrong!");
              // Enable button
              setDisabled(false);
            });
        }
      })
      .catch((err) => {
        setDisabled(false);
        toast.error("Something went wrong.");
        console.log(err);
        return;
      });
  };

  // If user already exists
  if (dbUser) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              You have already created your profile!
            </p>
            <div className="mt-10 flex flex-col gap-10 justify-center items-center">
              {/* Image */}
              <img
                src={notfound}
                className="max-w-[50%] lg:max-w-[40%] pointer-events-none"
              />
              {/* Button to navigate back to home page */}
              <div className="w-[40%] lg:w-[30%]">
                <OutlineButton
                  onClick={() => navigate("/")}
                  text="Go Back Home"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If onboarding process was left.
  return (
    <div>
      <Navbar />
      <Toaster />
      <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] bg-bgwhite flex items-center justify-center pt-12 pb-32">
        <div className="bg-white border-[1px] px- w-[90%] md:w-[65%] md:mt-5 lg:mt-5 p-5 md:px-20 shadow-xl rounded-xl pb-10">
          {/* Title */}
          <h1 className="text-ink pt-5 font-bold text-2xl text-center">
            Set up your Journal Account!
          </h1>

          <div className="mt-10 flex flex-col gap-y-5">
            <input
              className="hidden"
              type="file"
              ref={fileRef}
              accept="image/.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <div className="flex justify-center">
              {image ? (
                <img
                  src={
                    typeof image == "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  className="h-24 rounded-full"
                />
              ) : (
                <img src={defaultAccount} className="h-24 rounded-full" />
              )}
            </div>
            <button
              onClick={() => fileRef.current.click()}
              className="flex justify-center items-center gap-x-2"
            >
              Upload <IoCloudUploadOutline className="translate-y-0.5" />
            </button>
          </div>

          {/* Name & Username */}
          <div className="mt-14 flex flex-col gap-y-8 lg:flex-row lg:gap-x-5">
            {/* Name Input field */}
            <div className="lg:flex-1 px-2">
              <p className="font-medium">Name</p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={"Enter your name"}
              />
              {error.name == 1 && (
                <ErrorStatement text={"Please enter your name."} />
              )}
            </div>

            {/* Username Input field */}
            <div className="lg:flex-1 px-2">
              <p className="font-medium">Username</p>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={"Enter a username"}
              />
              {error.username == 1 && (
                <ErrorStatement text={"Please enter a username."} />
              )}
              {error.username == 2 && (
                <ErrorStatement text={"Username already exists."} />
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-10 px-2 flex flex-col gap-y-5">
            <p className="font-medium">Bio</p>
            <textarea
              className="w-full border-2 h-36 rounded-lg"
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="mt-10 flex justify-center items-center">
            <div className="w-[40%]">
              <CTAButton
                onClick={handleSubmit}
                disabled={disabled}
                disabledText={"Please Wait..."}
                text={"Submit"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
