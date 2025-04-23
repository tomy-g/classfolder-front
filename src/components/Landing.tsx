import React, { Component } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  FileText,
  Users,
  Calendar,
  MessagesSquare,
  MessageCircleQuestion,
  Star
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export class Landing extends Component {
  render () {
    return (
      <main className='w-full'>
        {/* Hero Section */}
        <section className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/50'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
              <div className='flex flex-col justify-center space-y-4'>
                <div className='space-y-4'>
                  <h1 className='text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none'>
                    Intercambia apuntes con ClassFolder
                  </h1>
                  <p className='max-w-[600px] text-muted-foreground md:text-xl'>
                    ClassFolder permite a los estudiantes compartir documentos,
                    organizar eventos y acceder a la información de clase de
                    manera fluida.
                  </p>
                </div>
                <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                  <Button size='lg' asChild>
                    <Link href={'/register'}>Unirme ahora</Link>
                  </Button>
                  <Button size='lg' asChild variant='outline'>
                    <Link href={'/login'}>Ya tengo una cuenta</Link>
                  </Button>
                </div>
              </div>
              <div className='mx-auto lg:ml-auto'>
                <div className='rounded-lg overflow-hidden'>
                  <Image
                    src='/classfolder-landing-min.png'
                    width={550}
                    height={550}
                    alt='Classfolder Dashboard'
                    className='object-cover'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-6'>
                <div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
                  Funcionalidades
                </div>
                <h2 className='max-w-[900px] text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Todo lo que necesitas para intercambiar información con tus
                  compañeros de clase
                </h2>
                <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Classfolder proporciona todas las herramientas que necesitas
                  para compartir apuntes con tus compañeros, comunicarte con
                  ellos y organizar la información de tu clase.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12'>
              <Card>
                <CardHeader className='flex flex-row items-center gap-4'>
                  <FileText className='h-8 w-8' />
                  <CardTitle>Intercambio de documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    Comparte apuntes, documentos y recursos con tus compañeros
                    de clase de manera rápida y sencilla.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center gap-4'>
                  <Users className='h-8 w-8' />
                  <CardTitle>Grupos y comunidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    Crea y únete a grupos de clase para colaborar, compartir
                    recursos y discutir temas importantes.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center gap-4'>
                  <Calendar className='h-8 w-8' />
                  <CardTitle>Agenda colaborativa</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    Organiza eventos tales como exámenes y plazos de entrega en
                    un calendario compartido.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center gap-4'>
                  <MessageCircleQuestion className='h-8 w-8' />
                  <CardTitle>Foros de clase</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    Participa en discusiones y resuelve dudas con tus
                    compañeros.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center gap-4'>
                  <MessagesSquare className='h-8 w-8' />
                  <CardTitle>Mensajes privados</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    Comunicate con tus compañeros de clase a través de mensajes
                    directos.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center gap-4'>
                  <Star className='h-8 w-8' />
                  <CardTitle>Ranking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    Participa en un sistema de puntos y recompensas para
                    fomentar la colaboración y el intercambio de información.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Screenshots Section */}
        <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/50'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
              <div className='mx-auto lg:mr-auto'>
                <div className='rounded-lg overflow-hidden border shadow-xl'>
                  <Image
                    src='/placeholder.svg?height=550&width=550'
                    width={550}
                    height={550}
                    alt='Captura 1'
                    className='object-cover'
                  />
                </div>
              </div>
              <div className='mx-auto lg:mr-auto'>
                <div className='rounded-lg overflow-hidden border shadow-xl'>
                  <Image
                    src='/placeholder.svg?height=550&width=550'
                    width={550}
                    height={550}
                    alt='Captura 2'
                    className='object-cover'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-4'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Preparado para unirte?
                </h2>
                <p className='max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed'>
                  Unete a ClassFolder hoy y experimenta una mejor manera de
                  gestionar tus materiales de clase.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Button size='lg' asChild>
                  <Link href={'/register'}>Unirme ahora</Link>
                </Button>
                <Button size='lg' asChild variant='outline'>
                  <Link href={'/login'}>Ya tengo una cuenta</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }
}

export default Landing
