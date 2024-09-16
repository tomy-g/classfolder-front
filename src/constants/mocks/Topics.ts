import { type Topic } from '@/types/Topic'
const topics: Topic[] = [
  {
    id: '1',
    title: 'Duda ejercicio 4 de la relación 1',
    author: 'John',
    responseCount: 0,
    viewCount: 11,
    body: 'No entiendo cómo se aplica la fórmula de la energía cinética en este caso. ¿Alguien me lo puede explicar?',
    group: 'Física'
  },
  {
    id: '2',
    title: 'Duda con el modelo entidad-relación',
    author: 'Maria',
    responseCount: 5,
    viewCount: 23,
    body: '¿Qué es una entidad débil y cómo se diferencia de una entidad fuerte? Aqui dejo un ejemplo para que me lo expliquen mejor: "Un cliente puede tener varias cuentas bancarias, pero una cuenta bancaria solo puede pertenecer a un cliente" Gracias.',
    group: 'Base de Datos'
  },
  {
    id: '3',
    title: 'Que entra en el primer parcial?',
    author: 'Alicia',
    responseCount: 3,
    viewCount: 15,
    body: 'Hola, alguien sabe si entra el tema de los autómatas en el primer parcial? Gracias',
    group: 'Matemática Discreta'
  }
]

export default topics
