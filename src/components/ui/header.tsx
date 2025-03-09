import { Settings2 } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-12">
      <div className="text-yellow-500 font-mono text-2xl">TypeO</div>
      <div className="flex gap-4">
        <Settings2 className="w-5 h-5 text-gray-500 hover:text-gray-300 cursor-pointer" />
        {/* nav bar options  */}
      </div>
    </div>
  );
};

export default Header;
