import { Button, buttonVariants } from '@/components/ui/button'
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet'
import Link from 'next/link'
import { ModeToggle } from './mode-toogle'
import { FolderOpen, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header () {
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
          <div className='grid gap-4 my-8'>
            <Link
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'justify-start hover:bg-transparent')}
              href='#'
            >
              Home
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'justify-start hover:bg-transparent')}
              href='#'
            >
              Groups
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'justify-start hover:bg-transparent')}
              href='#'
            >
              Profile
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Link className='mr-6 hidden lg:flex' href='#'>
        <FolderOpen className='h-6 w-6' />
        <span className='sr-only'>Class Folder</span>
      </Link>
      <nav className='ml-auto hidden lg:flex gap-6'>
        <Link
          className={cn(buttonVariants({ variant: 'ghost' }), '')}
          href='/'
        >
          Home
        </Link>
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
          href='/dashboard'
        >
          Dashboard
        </Link>
        <Link
          className={cn(buttonVariants({ variant: 'ghost' }), '')}
          href='/login'
        >
          Login
        </Link>
        <Link
          className={cn(buttonVariants({ variant: 'ghost' }), '')}
          href='/register'
        >
          Register
        </Link>
        <ModeToggle />
      </nav>
    </header>
  )
}
