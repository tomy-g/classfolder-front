'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetTitle
} from '@/components/ui/sheet'
import Link from 'next/link'
import { ModeToggle } from './mode-toogle'
import { FolderOpen, Menu } from 'lucide-react'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { cn } from '@/lib/utils'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import authService from '@/services/Logout'

export default function Header () {
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  function logOut () {
    setAuth({
      accessToken: '',
      roles: [],
      user: '',
      pic: ''
    })
    void authService.logout()
    router.push('/')
  }

  return (
    <header className='flex h-20 shrink-0 items-center max-w-screen-3xl px-10 mx-auto '>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='lg:hidden ml-auto' size='icon' variant='outline'>
            <Menu className='h-6 w-6' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='right'>
          <VisuallyHidden.Root>
            <SheetTitle>Menu</SheetTitle>
          </VisuallyHidden.Root>
          <div className='grid gap-4 my-8'>
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'lg' }),
                'justify-start hover:bg-transparent'
              )}
              href='#'
            >
              Home
            </Link>
            {auth?.accessToken !== ''
              ? (
              <>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'justify-start hover:bg-transparent'
                  )}
                  href='#'
                >
                  Groups
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'justify-start hover:bg-transparent'
                  )}
                  href='#'
                >
                  Profile
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'justify-start hover:bg-transparent'
                  )}
                  onClick={logOut}
                  href='#'
                >
                  Log out
                </Link>
              </>
                )
              : (
              <>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'justify-start hover:bg-transparent'
                  )}
                  href='/login'
                >
                  Log in
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'justify-start hover:bg-transparent'
                  )}
                  href='/register'
                >
                  Register
                </Link>
              </>
                )}
            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>
      <Link className='mr-6 hidden lg:flex' href='#'>
        <FolderOpen className='h-6 w-6' />
        <span className='sr-only'>Class Folder</span>
      </Link>
      <nav className='ml-auto hidden lg:flex gap-6'>
        <Link className={cn(buttonVariants({ variant: 'ghost' }), '')} href='/'>
          Home
        </Link>
        {auth?.accessToken !== ''
          ? (
          <>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='#'
            >
              Groups
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='#'
            >
              Profile
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='#'
              onClick={logOut}
            >
              Log out
            </Link>
          </>
            )
          : (
          <>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='/login'
            >
              Log in
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='/register'
            >
              Register
            </Link>
          </>
            )}
        <ModeToggle />
      </nav>
    </header>
  )
}
