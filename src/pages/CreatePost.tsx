import { useState, useRef, useEffect, ChangeEvent } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  CTAButton,
  ErrorStatement,
  Footer,
  Input,
  Navbar,
  OutlineButton,
} from "../components";
import { isEditorEmpty } from "../functions/regexFunctions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { categories } from "../data/categories";
import { FaArrowDown } from "react-icons/fa6";
import { axiosInstance } from "../utils/axios";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDBUser } from "../context/userContext";
import { getMinsToRead } from "../functions/mathFunctions";
import { modules, formats, QuillToolbar } from "../components/QuillToolbar";
import Avvvatars from "avvvatars-react";
import { useQueryClient } from "@tanstack/react-query";
import { compressImage } from "@/functions/compressImage";

const CreatePost = () => {
  const navigate = useNavigate();
  // User Object
  const { dbUser } = useDBUser();
  // Ref for file input
  const fileRef = useRef<HTMLInputElement | null>();
  // State for text editor input
  const [value, setValue] = useState<string>();
  // State for disabling button
  const [disabled, setDisabled] = useState(false);
  // State for adding image
  const [imageFile, setImageFile] = useState<File | string>();
  // State for adding title of post
  const [title, setTitle] = useState<string>("");
  // State for selecting post category
  const [category, setCategory] = useState<string>("");
  // State for adding category if "other" was selected
  const [otherCategory, setOtherCategory] = useState<string>("");
  // Error states
  const [error, setError] = useState({
    title: 0,
    category: 0,
    image: 0,
    content: 0,
    other: 0,
  });

  const inputRef = useRef<HTMLDivElement | null>();

  const queryClient = useQueryClient();

  // Scroll to top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Create a new Post | The Thought Journal";
  }, []);

  // To save the post
  const handleSave = async () => {
    setError({
      title: 0,
      category: 0,
      image: 0,
      content: 0,
      other: 0,
    });

    // Check if title is empty
    if (title == null || title == undefined || title.length <= 0) {
      setError((prev) => ({ ...prev, title: 1 }));
      inputRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // If title is longer than 100 characters.
    else if (title && title.length > 100) {
      setError((prev) => ({ ...prev, title: 2 }));
      inputRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // Check if image has been added
    else if (imageFile == null || imageFile == undefined) {
      setError((prev) => ({ ...prev, image: 1 }));
      inputRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // Check if category has been selected
    else if (category == null || category == undefined) {
      setError((prev) => ({ ...prev, category: 1 }));
      inputRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // Check if category has been added if "OTHER" was selected
    else if (category == "OTHER") {
      if (
        otherCategory == null ||
        otherCategory == undefined ||
        otherCategory.length <= 0
      ) {
        setError((prev) => ({ ...prev, other: 1 }));
        inputRef.current.scrollIntoView({ behavior: "smooth" });
        return;
      } else if (otherCategory.length > 20) {
        setError((prev) => ({ ...prev, other: 2 }));
        inputRef.current.scrollIntoView({ behavior: "smooth" });
        return;
      } else if (String(otherCategory).split(" ").length > 2) {
        setError((prev) => ({ ...prev, other: 3 }));
        inputRef.current.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Check if content has been added for blog
    if (isEditorEmpty(value)) {
      setError((prev) => ({ ...prev, content: 1 }));
      inputRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setDisabled(true);

    const compressedFile = await compressImage(imageFile);

    // Adding data to FormData object
    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("otherCategory", otherCategory);
    formData.append("content", String(value));
    formData.append("user", JSON.stringify(dbUser));

    // Sending request to server
    axiosInstance
      .post("/post/create-post", formData, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
      })
      .then(() => {
        toast.success("Post created!");
        setDisabled(false);
        queryClient.resetQueries({
          queryKey: ["getUserPosts", dbUser?.username],
        });
        navigate("/profile");
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        console.log(err);
        setDisabled(false);
      });
  };

  // To get image input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    let extension = e.target.files[0]?.name?.split(".").pop();

    let allowedExtensions = ["jpg", "png", "jpeg"];

    if (!allowedExtensions.includes(extension)) {
      toast.error("Invalid Image Format.");
      fileRef.current.value = null;
      return;
    }

    setImageFile(e.target.files[0]);

    if (fileRef.current) {
      fileRef.current.value = null;
    }
  };

  return (
    <div className="bg-bgwhite dark:bg-darkbg dark:text-darkmodetext">
      <Navbar />
      <Toaster />

      {/* Editor box */}
      <div
        ref={inputRef}
        className="p-10 pb-20 m-5 lg:m-10 bg-white dark:bg-darkgrey shadow-xl border-[1px] rounded-xl"
      >
        {/* Title */}
        <h1 className="text-2xl lg:text-4xl text-center font-medium">
          Create a new Journal post{" "}
        </h1>
        {/* Subtitle */}
        <p className="text-base mt-2 lg:text-xl text-center">
          (You can preview your post below!)
        </p>

        {/* Input fields */}
        {/* Horizontal Flex on larger screens */}
        <div className="mt-10 lg:mt-24 lg:flex lg:gap-x-16">
          {/* Add Post title */}
          <div className="lg:flex-1">
            <p className="font-medium">Title</p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={"Enter the title of your post"}
            />
            {error.title == 1 && (
              <ErrorStatement text={"Please enter the title of your post."} />
            )}
            {error.title == 2 && (
              <ErrorStatement text={"Title cannot exceed 100 characters."} />
            )}
          </div>

          {/* Add Post thumbnail image */}
          <div className="mt-8 lg:mt-0 lg:flex-1">
            <p className="font-medium">Thumbnail</p>
            {/* Hidden input box - used to accept images */}
            <input
              className="hidden"
              type="file"
              ref={fileRef}
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleFileChange}
            />
            {/* Flex div - button & image name */}
            <div className="mt-3">
              {/* Flex div - button & image name */}
              <div>
                {/* Button to open file input  */}
                <OutlineButton
                  text={
                    <p className="flex gap-x-3 justify-center items-center">
                      Select your image
                      {/* Icon */}
                      <img
                        src={
                          "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736740227/gallery_zmqd5v.png"
                        }
                        className="h-5"
                      />
                    </p>
                  }
                  onClick={() => fileRef.current.click()}
                />
                {/* Display file name */}
                <p className="mt-3 overflow-clip">
                  {typeof imageFile == "string" ? imageFile : imageFile?.name}
                </p>
              </div>
            </div>
            {error.image == 1 && (
              <ErrorStatement text={"Please add an image for your post."} />
            )}
          </div>
        </div>

        {/* Category select */}
        <div className="my-8 flex flex-col gap-y-5 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-5">
          <p className="font-medium">Post Category</p>
          <Select
            onValueChange={(selectedCategory) => setCategory(selectedCategory)}
          >
            <SelectTrigger className="md:w-[180px] dark:bg-darkgrey dark:border-2">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent className="dark:bg-darkgrey">
              {categories.map((category) => {
                return (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {error.category == 1 && (
            <ErrorStatement text={"Please select a category for your post."} />
          )}
        </div>

        {/* Other Category */}
        {category == "OTHER" && (
          <div className="lg:max-w-[48%]">
            <p className="font-medium">Specify the Category</p>
            <Input
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              placeholder={"Enter the category for your post"}
            />
            {error.other == 1 && (
              <ErrorStatement
                text={"Please enter the category for your post."}
              />
            )}
            {error.other == 2 && (
              <ErrorStatement text={"Category cannot exceed 20 characters."} />
            )}
            {error.other == 3 && (
              <ErrorStatement text={"Category cannot be more than 2 words."} />
            )}
          </div>
        )}

        {/* Quill Editor */}
        <div className="mt-10">
          {error.content == 1 && (
            <ErrorStatement text={"Please add the content for your post."} />
          )}
          <QuillToolbar />
          <ReactQuill
            theme="snow"
            className="h-96 mt-1"
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
          />
        </div>

        {/* Save Button */}
        <div className="mt-24 lg:mt-20 flex justify-center">
          <div className="w-[45%] lg:w-[30%]">
            <CTAButton
              disabledText={"Please wait..."}
              disabled={disabled}
              onClick={handleSave}
              text="Save"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <h1 className="py-5 text-2xl lg:text-4xl text-center font-medium flex justify-center gap-x-2 items-center">
        Preview your Journal post! <FaArrowDown />
      </h1>

      {/* Preview Post */}
      <div className=" pb-20 m-5 lg:m-10 bg-white dark:bg-darkgrey dark:text-darkmodetext shadow-xl border-[1px] rounded-xl">
        {/* Thumbnail Image */}
        <div>
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile as Blob)}
              className="h-96 lg:h-[30rem] w-full rounded-t object-cover object-center"
            ></img>
          )}
        </div>

        {/* If nothing is added */}
        {!imageFile &&
          !title &&
          !category &&
          (!value || isEditorEmpty(value)) && (
            <div className="flex justify-center items-center pt-20 text-2xl">
              Create your Post Above!
            </div>
          )}

        {/* Title + Content Section */}
        <div className="p-5 md:p-10 md:pt-0 mt-8">
          {/* Badge */}
          {category && category != "OTHER" && (
            <p className="bg-cta text-white dark:text-darkmodetext text-lg lg:text-xl rounded-full px-3 py-1 w-fit">
              {category}
            </p>
          )}

          {category == "OTHER" && otherCategory && (
            <p className="bg-cta text-white text-lg lg:text-xl rounded-full px-3 py-1 w-fit">
              {otherCategory}
            </p>
          )}

          {/* Post Title */}
          {title && (
            <h1 className="mt-10 text-4xl lg:text-6xl font-bold text-ink dark:text-darkmodeCTA">
              {title}
            </h1>
          )}

          {/* Post Author */}
          {(title?.length > 0 || (value && !isEditorEmpty(value))) && (
            <Link
              to={`/user/${dbUser?.username}`}
              className="mt-14 flex gap-x-4 text-xl items-center w-fit"
            >
              {/* User Image or Avatar */}
              {dbUser?.photoURL ? (
                <img
                  src={dbUser?.photoURL}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <Avvvatars size={50} value={dbUser.name} />
              )}

              {/* User's name & username */}
              <div>
                <p className="break-all font-medium">{dbUser?.name}</p>
                <p className="break-all">@{dbUser?.username}</p>
              </div>
            </Link>
          )}

          {/* Time to read */}
          {value && !isEditorEmpty(value) && (
            <div className="mt-4 px-2 text-greyText font-medium">
              {getMinsToRead(value)} min read.
            </div>
          )}

          {/* Post Content */}
          {!isEditorEmpty(value) && (
            <div className="mt-10">
              <ReactQuill
                value={value}
                className="border-none postdisplay"
                theme="snow"
                readOnly
                modules={{ toolbar: null }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="pt-20">
        <Footer />
      </div>
    </div>
  );
};

export default CreatePost;
