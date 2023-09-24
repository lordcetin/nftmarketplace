import Link from "next/link";
import React from "react";
import { Fragment } from "react";
import Media from "react-media";

const Header = ({email,user}) => {

  return (
    <Fragment>
    <Media queries={{
      small: "(max-width: 599px)", // < 600px
      medium: "(min-width: 1024px) and (max-width: 1366px)", // < 1366px
      large: "(min-width: 1400px)" // >= 1400px
    }}>
    {matches => (
      <Fragment>
      {matches.small &&
      <Fragment>
      <header className="h-[60px] border-b border-slate-800 py-4 px-5 flex items-center w-[297px]">
      <button className="flex items-center gap-x-4">
      <Link href={`/${user?.username}`}><img src={user?.avatar} alt={email} className="w-6 h-6 rounded-full" /></Link>
      <Link href={`/${user?.username}`}><h6 className="text-base font-semibold">{email}</h6></Link>
      </button>
      </header>
      </Fragment>
      }
      {matches.medium &&
      <Fragment>
      <header className="h-[60px] border-b border-slate-800 py-4 px-5 flex items-center w-[500px]">
      <button className="flex items-center gap-x-4">
      <Link href={`/${user?.username}`}><img src={user?.avatar} alt={email} className="w-6 h-6 rounded-full" /></Link>
      <Link href={`/${user?.username}`}><h6 className="text-base font-semibold">{email}</h6></Link>
      </button>
      </header>
      </Fragment>
      }
      {matches.large &&
      <Fragment>
      <header className="h-[60px] border-b border-slate-800 py-4 px-5 flex items-center w-[700px]">
      <button className="flex items-center gap-x-4">
          <Link href={`/${user?.username}`}><img src={user?.avatar} alt={email} className="w-6 h-6 rounded-full" /></Link>
          <Link href={`/${user?.username}`}><h6 className="text-base font-semibold">{email}</h6></Link>
      </button>
      </header>
      </Fragment>
      }
      </Fragment>
      )}
    </Media>
    </Fragment>
    );
};

export default Header;
