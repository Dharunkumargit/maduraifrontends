import LOGO from "../assets/images/MaduraiLogo.png";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { HiOutlineBell } from "react-icons/hi";
import { useNavigate } from "react-router";



const NavBar = () => {
  const navigate = useNavigate();
  const [userInitials, setUserInitials] = useState("U");
  const [userName, setUserName] = useState("User");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user?.name) {
        setUserName(user.name);
      } else if (user?.email) {
        setUserName(user.email.split("@")[0]);
      }

      
      let initials = "U";

      if (user?.name) {
        initials = user.name
          .split(" ")
          .map(word => word[0])
          .join("")
          .slice(0, 2);
      } else if (user?.email) {
        initials = user.email.slice(0, 2);
      }

      setUserInitials(initials.toUpperCase());
    }
  }, []);
  
  return (
    <div className=" w-full z-10 font-roboto-flex flex justify-between items-center bg-white px-2 h-1/12 mt-4 mb-4">
      <div className="flex items-center gap-8  ">
        <img
          src={LOGO}
          className="w-[72px] h-[75.03px] ml-7  "
          alt="Logo Image"
        />
        <div className="flex items-center gap-3 px-5  rounded-md w-[290px] sm:w-[290px] bg-light-blue">
          <Search className="w-5 h-5 text-dark-grey" />
          <input
            type="text"
            className="h-11 placeholder:text-dark-blue outline-0"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex justify-center lg:p-2 md:p-2 p-1.5 lg:gap-3.5 md:gap-2   items-center text-center  rounded-full mr-3">
        <div className=" flex  items-center gap-2 text-sm font-extralight  text-dark-blue">
           {userName}
          <div className="">
            <button onClick={() => navigate("/dashboard/profile")} className="bg-light-blue text-dark-blue font-medium w-9 h-9 text-sm rounded-full flex cursor-pointer items-center justify-center" 
               >
              
              {userInitials}
            </button>
          </div>
        </div>
        

        
      </div>
    </div>
  );
};

export default NavBar;
