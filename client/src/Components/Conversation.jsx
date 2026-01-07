import { useEffect, useState } from "react";

const Conversation = ({
  key,
  item,
  ownData,
  handleSelectedConversation,
  activeConversationId,
}) => {
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    if (item?.members?.length > 0) {
      let ownId = ownData?._id;
      let member = item.members.filter((m) => m._id !== ownId);

      // if no other member found, use the first one
      setMemberData(member[0] || item.members[0]);
    }
  }, [ownData, item]);

  const handleConversation = () => {
    handleSelectedConversation(item?._id, memberData);
  };
  return (
    <div
      key={key}
      onClick={handleConversation}
      className={`flex items-center w-full cursor-pointer border-b-1 border-gray-300 gap-3 p-4 hover:bg-gray-300 ${
        activeConversationId === item?._id ? "bg-gray-300" : ""
      }`}
    >
      <div className="shrink-0">
        <img
          src={memberData?.profile_pic}
          alt=""
          className="rounded-4xl h-16 w-16 border-2 border-white cursor-pointer"
        />
      </div>
      <div>
        <h1 className="text-md font-bold">{memberData?.f_name}</h1>
        <p className="text-gray-600 text-sm truncate w-30">
          {memberData?.headline}
        </p>
      </div>
    </div>
  );
};

export default Conversation;
