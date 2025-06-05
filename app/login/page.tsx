"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

 const Login =  () => {
    const router = useRouter();
    const[isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
    
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        try {
		e.preventDefault();
        setIsPending(true);
        setIsError(false);
        setErrorMessage("");
        const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Failed to Login");
    }
    // success: you can redirect or store token here
    //   console.log("Login success:", data);
        if (data.user) {
        router.push("/");
      }
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    } finally {
      setIsPending(false);
    }
  };

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900'>
    {/* Left side - Illustration */}
    <div className='flex-1 hidden lg:flex items-center justify-center p-12'>
        <div className='relative w-full h-full max-w-2xl'>
            <svg 
                aria-hidden='true' 
                viewBox='0 0 24 24' 
                className='w-full h-auto fill-white animate-float'
            >
                <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
            </svg>
            <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-64 h-64 rounded-full bg-purple-600 opacity-20 blur-3xl animate-pulse'></div>
            </div>
            <div className='mt-8 text-center'>
                <h2 className='text-2xl font-bold text-white'>Welcome Back!</h2>
                <p className='text-purple-200 mt-2'>Join millions of users worldwide</p>
            </div>
        </div>
    </div>

    {/* Right side - Form */}
    <div className='flex-1 flex flex-col justify-center items-center p-8 backdrop-blur-sm bg-white/5'>
        <div className='w-full max-w-md'>
            <form 
                className='flex gap-6 flex-col p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-lg'
                onSubmit={handleSubmit}
            >
                {/* Mobile Logo */}
                <div className='flex justify-center lg:hidden'>
                    <svg 
                        aria-hidden='true' 
                        viewBox='0 0 24 24' 
                        className='w-20 h-20 fill-white animate-bounce'
                    >
                        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                    </svg>
                </div>

                <h1 className='text-4xl font-extrabold text-white text-center'>
                    Let's go.
                    <span className='block text-sm font-normal text-purple-300 mt-2'>Sign in to your account</span>
                </h1>

                <div className='space-y-4'>
                    <label className='input-group'>
                        <span className='bg-white/10 text-white border-white/10'>
                            <MdOutlineMail className='w-5 h-5' />
                        </span>
                        <input
                            type='text'
                            className='input w-full bg-white/5 text-white placeholder-purple-300 border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all'
                            placeholder='Username'
                            name='username'
                            onChange={handleInputChange}
                            value={formData.username}
                        />
                    </label>

                    <label className='input-group'>
                        <span className='bg-white/10 text-white border-white/10'>
                            <MdPassword className='w-5 h-5' />
                        </span>
                        <input
                            type='password'
                            className='input w-full bg-white/5 text-white placeholder-purple-300 border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                </div>

                <button 
                    className={`btn rounded-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 border-none text-white hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all ${isPending ? 'loading' : ''}`}
                    disabled={isPending}
                >
                    {isPending ? "Signing in..." : "Sign In"}
                </button>

                {isError && (
                    <div className='alert alert-error bg-red-900/50 text-red-100 border-red-700 mt-4 animate-shake'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                )}
            </form>

            <div className='mt-6 text-center'>
                <p className='text-purple-200'>Don't have an account?</p>
                <Link href='/signup'>
                    <button className='btn rounded-full mt-3 bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/30 w-full max-w-xs transition-all'>
                        Create Account
                    </button>
                </Link>
            </div>
        </div>
    </div>
</div>
	);
};
export default Login;