import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../utils/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDBUser } from "../context/userContext";
import { useAuth } from "../context/authContext";
import { Footer, PostCard } from "../components";
import HashLoader from "react-spinners/HashLoader";
import { useInView } from "react-intersection-observer";
import homeNoPosts from "../assets/homeNoPosts.svg";

const Home = () => {
  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { ref, inView } = useInView();

  // Set window title.
  useEffect(() => {
    document.title = "Home | The Thought Journal";
  }, []);

  // // Get the DB user
  const { dbUser } = useDBUser();
  const { currentUser } = useAuth();

  // Query to get posts
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["recent-posts-home"],
      queryFn: async ({ pageParam }) => {
        return axiosInstance.post("/post/get-recent-posts", {
          page: pageParam,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage?.data?.nextPage;
      },
    });

  //Fetch next posts
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="pb-32">
        <div className="p-5">
          {/* Title - Gradient text */}
          <h1 className="text-4xl font-semibold px-2 py-5">
            Welcome{" "}
            <span className="bg-gradient-to-r from-cta to-hovercta bg-clip-text text-transparent">
              {dbUser?.name ? dbUser?.name : "Journaler"}!
            </span>
          </h1>

          {/* Subtitle */}
          <h3 className="text-2xl font-semibold px-2">Let's start reading!</h3>
        </div>
        <div>
          {/* Loading indicator */}
          {isLoading && (
            <div className="h-96 flex justify-center items-center">
              <HashLoader
                color={"#9b0ced"}
                loading={isLoading}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}

          {/* Mapping posts if available */}
          {data && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 ">
              {data &&
                data?.pages?.map((page) => {
                  return page?.data?.posts?.map((post, index) => {
                    return <PostCard post={post} index={index} />;
                  });
                })}
            </div>
          )}

          {/* Error while fetching */}
          {error && (
            <div className="flex flex-col justify-center pt-10">
              <div className="flex justify-center">
                <img src={homeNoPosts} className="max-w-[30%]" />
              </div>
              <p className="text-center mt-5 text-2xl font-medium">
                Uh oh! Couldn't fetch posts.
              </p>
            </div>
          )}

          {/* No content found */}
          {data &&
            (!data?.pages || data?.pages?.[0]?.data?.posts.length == 0) && (
              <div className="flex flex-col justify-center pt-10">
                <div className="flex justify-center">
                  <img src={homeNoPosts} className="max-w-[30%]" />
                </div>
                <p className="text-center mt-5 text-2xl font-medium">
                  Uh oh! Couldn't fetch posts.
                </p>
              </div>
            )}

          {/* Fetch Next page div - infinite loading */}
          {data && <div ref={ref}></div>}
        </div>
      </div>
      <div className="pt-20">
        <Footer />
      </div>
    </>
  );
};

export default Home;
