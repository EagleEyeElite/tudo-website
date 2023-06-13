import React from "react";

type Link = {
    text: string,
    href?: string,
    highlighted?: boolean
}

export function CustomLink({link}) {
    let styling;
    if (link.highlighted ?? false) {
        styling = "bg-black hover:bg-transparent hover:text-black border border-black text-white py-3 px-12 lg:px-8 duration-200 transition-colors";
    } else {
        styling = "hover:underline";
    }
    return <a href={link.href} className={`mx-3 font-bold ${styling}`}>
        {link.text}
    </a>
}

type Props = {
    links: Link[]
};
export function Links({links}: Props) {
    const listLinks = links.map(
        (e, idx) => <>
            <li key={idx} className="my-2.5">
                {<CustomLink link={e}/>}
            </li>
        </>
    );

    return <>
        <ol className="flex flex-col mt-14 lg:mt-0 lg:flex-row justify-center items-center">
            {listLinks}
        </ol>
    </>
}