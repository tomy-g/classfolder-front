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
import { Notifications } from './notifications'

export default function Header () {
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  function logOut () {
    setAuth({
      accessToken: '',
      roles: [],
      user: '',
      pic: '',
      userId: -1
    })
    void authService.logout()
    router.push('/')
  }

  return (
    <header className='flex h-20 shrink-0 items-center max-w-screen-3xl px-10 mx-auto '>
      <Link className='mr-6 lg:hidden' href='/'>
        <div className='flex items-center justify-center gap-3'>
          <FolderOpen className='h-6 w-6' />
          <h1 className='text-2xl font-medium'>Class Folder</h1>
        </div>
        <span className='sr-only'>Class Folder</span>
      </Link>
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
                  href='/groups'
                >
                  Grupos
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'justify-start hover:bg-transparent'
                  )}
                  href='/profile'
                >
                  Perfil
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'justify-start hover:bg-transparent'
                  )}
                  href='/messages'
                >
                  Mensajes
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'justify-start hover:bg-transparent'
                  )}
                  onClick={logOut}
                  href='#'
                >
                  Cerrar sesión
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
                  Iniciar sesión
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'justify-start hover:bg-transparent'
                  )}
                  href='/register'
                >
                  Registro
                </Link>
              </>
                )}
            <Notifications />
            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>
      <Link className='mr-6 hidden lg:flex' href='/'>
        <div className='flex items-center justify-center gap-3'>
          <FolderOpen className='h-6 w-6' />
          <h1 className='text-2xl font-medium'>Class Folder</h1>
        </div>
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
              href='/groups'
            >
              Grupos
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='/profile'
            >
              Perfil
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='/messages'
            >
              Mensajes
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='#'
              onClick={logOut}
            >
              Cerrar sesión
            </Link>
          </>
            )
          : (
          <>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='/login'
            >
              Iniciar sesión
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), '')}
              href='/register'
            >
              Registro
            </Link>
          </>
            )}
        <Notifications />
        <ModeToggle />
      </nav>
    </header>
  )
}
