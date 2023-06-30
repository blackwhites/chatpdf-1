import "./header.css";

export default function Header() {

  return (
    <header className="h-[52px]">
      <div className="header h-full flex flex-row justify-between items-center px-[1em]">
        <div className="logo-text font-bold text-[24px]">PinkGlow AI</div>
        <div className="nav flex flex-row items-center">
          <div className="nav-item  font-bold text-[#676b5f] cursor-pointer text-[15px] px-[15px] py-[10px] rounded-[8px] hover:bg-[#f2f2f2]" >
            <a href="/user">用户</a>
          </div>
          <div className="nav-item font-bold text-[#676b5f] cursor-pointer text-[15px] px-[15px] py-[10px] rounded-[8px] hover:bg-[#f2f2f2]" >
            <a href="/user">设置</a>
          </div>
        </div>
      </div>
    </header>
  )
}