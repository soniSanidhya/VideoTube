import React from "react";
import ChannelVideos from "./ChannelVideos";
import ChannelDetails from "./ChannelDetails";
import { Outlet, useParams } from "react-router-dom";

const ChannelLayout = () => {

  const {username} = useParams();
  const [isChannel, isChannelAvilable] = React.useState(false);
  const channelAvilable = () => {
    isChannelAvilable(true);
  };
  console.log(username);
  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <ChannelDetails isChannel={channelAvilable} />
      <div className="px-4 pb-4">
      {isChannel && <Outlet context = {{username}} />}
      
        </div>
    </section>
  );
};

export default ChannelLayout;
