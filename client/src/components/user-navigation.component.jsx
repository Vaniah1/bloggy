import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";

const UserNavigationPanel = () => {
  const {
    userAuth: { username },
  } = useContext(UserContext);
  return (
    <AnimationWrapper transition={{ duration: 0.2, y: { duration: 0.1 } }}>
      <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        <Link to={`/user/${username}`} className="flex gap-2 link pl-8 py-4">
          <i className="fi fi-rr-user"></i>
          <p>Profile</p>
        </Link>
      </div>
    </AnimationWrapper>
  );
};
export default UserNavigationPanel;
