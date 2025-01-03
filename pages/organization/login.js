import { Input } from "@/Components/Input";
import { TypingHeading } from "@/Components/Heading";
import Button, { LongWidthBnt } from "@/Components/Button";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { _AppContext } from "@/Contexts/AppContext";
import { isObjectEmpty, isOnline } from "@/Functions/miniFuntions";
import ShowIf from "@/Components/ShowIf";
import Link from "next/link";
import verifyOrganizationToken from "@/Functions/organization/verifyOrganizationToken";


export default function Login(){

    const {setAlert} = useContext(_AppContext)

    const [isLoading, setLoading] = useState(false)
    const [isLoad, setLoad] = useState(false)


    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!isOnline()) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'No internet conections.'}])

        let formData = Object.fromEntries(new FormData(e.target));

        if(isObjectEmpty(formData)) return setAlert((alerts) => [...alerts, {type: 'warning', msg: 'Please fill all form fields.'}])

        setLoading(true);

        let res = await fetch(`${window.location.origin}/api/organization/login`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(formData)
        });
        let {miss, alert, token, organization} = await res.json();
        

        setLoading(false);
        setAlert((alerts) => [...alerts, alert])

        if(!miss) return;
        localStorage.setItem('organization-token', token);
        return router.push(`/organization/${organization.name}`);
    }

    async function verify(){
        let {miss, organization} = await verifyOrganizationToken(localStorage.getItem('organization-token'));
        if(!miss) return setLoad(true);
        return router.push(`/organization/${organization.name}`);
    }

    useEffect(() => {
        verify();
    }, [])

    return (
        <div className="flex items-center justify-center w-full h-[100svh] overflow-hidden ">
            <div 
                className="absolute flex flex-col top-4 left-4 text-[2vmax] font-bold cursor-default z-[100]"
                onClick={() => router.push('/login')}
            >
                Hello,
                <div className="text-[3em]">Organization</div>
            </div>
            <main className="w-full h-full flex items-center flex-col justify-center p-5 relative max-sm:bottom-20">
                <ShowIf when={isLoad} loading={true}>
                    <TypingHeading className="font-serif text-2xl my-5">- Login Form -</TypingHeading>
                    <form onSubmit={handleSubmit} className="flex items-center flex-col gap-4 max-w-[500px] w-full" >
                        <Input minLength={6} name={'username'} placeholder="Enter Username" />
                        <Input minLength={6} name={'password'} placeholder="Enter Password" type='password' />
                        <div className="w-full">
                            <LongWidthBnt isLoading={isLoading} title='Login' className='w-full max-md:hidden' />
                            <Button isLoading={isLoading} title='Login' className='md:hidden w-full border-2' />
                        </div>
                        <div className="text-sm flex items-center justify-center flex-wrap gap-2 font-mono text-black">add Member? <Link href={'/organization/signup'} className="opacity-70 active:opacity-100 sm:hover:opacity-100 font-semibold text-sky-500">Sign-up</Link></div>
                    </form>
                </ShowIf>
            </main>
        </div>
    )
}