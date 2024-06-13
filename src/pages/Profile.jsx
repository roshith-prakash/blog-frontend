import { CTAButton, Footer, Navbar, PostCard } from "../components";
import { useDBUser } from "../context/userContext";
import defaultAccount from "../assets/account.png";
import { BsPen } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import dayjs from "dayjs";
import { TfiWrite } from "react-icons/tfi";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import noPosts from "../assets/noposts.svg";

const Profile = () => {
  const navigate = useNavigate();
  const { dbUser } = useDBUser();

  console.log(dbUser);

  // Set window title.
  useEffect(() => {
    document.title = `${dbUser?.name} | The Thought Journal`;
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["getUserPosts"],
    queryFn: async () => {
      return axiosInstance.post("/post/get-user-posts", {
        username: dbUser?.username,
      });
    },
  });

  console.log(data);

  return (
    <>
      <div className="max-w-screen overflow-hidden">
        <Navbar />
      </div>
      <div className="lg:min-h-screenbg-bgwhite w-full pb-20">
        {/* Background color div */}
        <div className="bg-[#dcbbf0] border-b-4 border-black h-48"></div>

        {/* Profile Info Div */}
        <div className="bg-white shadow-xl -translate-y-14 border-2 min-h-52 pt-20 pb-10 rounded-lg mx-5 md:mx-10 lg:mx-20">
          {/* Floating Image */}
          <div className="absolute w-full -top-16 flex justify-center">
            <img
              src={dbUser?.photoURL ? dbUser?.photoURL : defaultAccount}
              className="bg-white rounded-full h-32 w-32 border-8 border-[#dcbbf0] pointer-events-none"
            />
          </div>

          {/* Edit icon on small screen */}
          <div className="lg:hidden absolute right-6 top-5">
            <BsPen
              className="text-xl cursor-pointer"
              onClick={() => navigate("/editProfile")}
            />
          </div>

          {/* Edit button on large screen */}
          <div className="hidden lg:block absolute right-6 top-5">
            <CTAButton
              text={
                <div className="flex items-center gap-x-2">
                  <BsPen />
                  <p>Edit</p>
                </div>
              }
              onClick={() => navigate("/editProfile")}
            />
          </div>

          {/* Name, Username and Bio */}
          <div className="px-2">
            <p className="text-center text-3xl font-bold">{dbUser?.name}</p>
            <p className="mt-2 text-center text-xl font-medium">
              @{dbUser?.username}
            </p>
            {dbUser?.bio && (
              <p className="px-4 my-10 text-md text-center">{dbUser?.bio}</p>
            )}
          </div>

          {/* Separator */}
          <hr className="my-5 mx-2" />

          {/* Day of joining */}
          <div className="mt-5 text-greyText flex justify-center items-center gap-x-2">
            <TfiWrite /> Became a Journaler on{" "}
            {dayjs(new Date(dbUser?.createdAt)).format("MMM DD, YYYY")}
          </div>
        </div>

        {/* Posts title */}
        {data?.data?.posts.length > 0 && (
          <div className="mt-6 font-semibold flex items-center gap-x-6 px-3 text-3xl lg:text-5xl mx-5 md:mx-10 lg:mx-20">
            <TfiWrite />
            Your Journal Posts
          </div>
        )}

        {/* If posts are present - map the posts */}
        {data?.data?.posts.length > 0 && (
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 mx-5 md:mx-10 lg:mx-20">
            {data &&
              data?.data?.posts?.map((post, index) => {
                return <PostCard post={post} index={index} />;
              })}
          </div>
        )}

        {/* If no posts were created by the user */}
        {!isLoading && data?.data?.posts.length == 0 && (
          <div className="flex w-full justify-center items-center">
            <div>
              <p className="font-medium text-2xl text-center ">
                You have not journalled any posts.
              </p>
              <div className="flex justify-center mt-16">
                <img src={noPosts} className="max-w-[50%]" />
              </div>
              <div className="mt-20 flex justify-center">
                <div className="max-w-[50%]">
                  <CTAButton text={<p className="text-xl">Create a Post</p>} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="pt-32">
        <Footer />
      </div>
    </>
  );
};

export default Profile;
