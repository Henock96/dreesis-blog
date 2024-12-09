"use client";
import {Button, Navbar, TextInput } from 'flowbite-react'
import Link from 'next/link';
import {AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { dark, light } from '@clerk/themes';

export default function Header() {
  const path = usePathname();
  const {theme, setTheme } = useTheme();
  return (
    <Navbar className='border-b-2'>
      <Link 
          href="/"
          className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              rounded-lg text-white">
                Dreesis
            </span>
            Code
      </Link>
        <form action="">
          <TextInput 
            type='text'
            placeholder='Recherche'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
          />
        </form>
        <Button className="w-12 h-10 lg:hidden" color='gray' pill>
          <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button className="w-12 h-10 hidden sm:inline" color='gray' pill
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FaSun />: <FaMoon />}
          </Button>
          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: theme === 'light' ? light: dark,
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton >
              Se connecter
            </SignInButton>
          </SignedOut>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Link href='/'>
            <Navbar.Link active={path === '/'} as={'div'}>
              Accueil
            </Navbar.Link>
          </Link>
          <Link href='/blog'>
            <Navbar.Link active={path === '/blog'} as={'div'}>
              Blog
            </Navbar.Link>
          </Link>
          <Link href='/projects'>
            <Navbar.Link active={path === '/projects'} as={'div'}>
              Projets
            </Navbar.Link>
          </Link>
          <Link href='/about'>
            <Navbar.Link active={path === '/about'} as={'div'}>
              A Propos de Nous
            </Navbar.Link>
          </Link>
        </Navbar.Collapse>
        
    </Navbar>
  )
}
